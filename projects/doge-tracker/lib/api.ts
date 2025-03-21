"use server"

interface DogecoinData {
  prices: [number, number][]
  current_price: number
  price_change_percentage: number
}

export async function fetchDogecoinData(days: string): Promise<DogecoinData> {
  try {
    // Fetch historical price data
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/dogecoin/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 300 } }, // Cache for 5 minutes
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Fetch current price and 24h change
    const currentDataResponse = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=dogecoin",
      { next: { revalidate: 60 } }, // Cache for 1 minute
    )

    if (!currentDataResponse.ok) {
      throw new Error(`API request failed with status ${currentDataResponse.status}`)
    }

    const currentData = await currentDataResponse.json()
    const current = currentData[0]

    return {
      prices: data.prices,
      current_price: current.current_price,
      price_change_percentage:
        days === "1" ? current.price_change_percentage_24h : calculatePriceChangePercentage(data.prices),
    }
  } catch (error) {
    console.error("Error fetching Dogecoin data:", error)
    throw new Error("Failed to fetch Dogecoin data")
  }
}

function calculatePriceChangePercentage(prices: [number, number][]): number {
  if (prices.length < 2) return 0

  const firstPrice = prices[0][1]
  const lastPrice = prices[prices.length - 1][1]

  return ((lastPrice - firstPrice) / firstPrice) * 100
}

