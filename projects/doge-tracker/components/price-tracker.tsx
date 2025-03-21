"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchDogecoinData } from "@/lib/api"
import { formatPrice, getTimeLabel } from "@/lib/utils"
import PriceChart from "./price-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const TIME_PERIODS = [
  { value: "1", label: "24 Hours" },
  { value: "7", label: "7 Days" },
  { value: "30", label: "30 Days" },
  { value: "90", label: "90 Days" },
  { value: "365", label: "1 Year" },
  { value: "max", label: "All Time" },
]

export default function PriceTracker() {
  const [timePeriod, setTimePeriod] = useState("7")
  const [priceData, setPriceData] = useState<[number, number][]>([])
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDogecoinData(timePeriod)
        setPriceData(data.prices)
        setCurrentPrice(data.current_price)
        setPriceChange(data.price_change_percentage)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch Dogecoin data:", err)
        setError("Failed to load Dogecoin price data. Please try again later.")
        setLoading(false)
      }
    }

    loadData()
  }, [timePeriod])

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-2xl">Dogecoin (DOGE)</CardTitle>
          <CardDescription>
            {loading ? <Skeleton className="h-4 w-32" /> : `Last updated: ${new Date().toLocaleString()}`}
          </CardDescription>
        </div>
        <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {TIME_PERIODS.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-col space-y-1 mb-4">
              {loading ? (
                <Skeleton className="h-10 w-40" />
              ) : (
                <div className="text-3xl font-bold">{formatPrice(currentPrice || 0)}</div>
              )}
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <div className={`text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {priceChange >= 0 ? "+" : ""}
                  {priceChange.toFixed(2)}% {getTimeLabel(timePeriod)}
                </div>
              )}
            </div>
            <div className="h-[350px]">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-4">
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                </div>
              ) : (
                <PriceChart data={priceData} timePeriod={timePeriod} />
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

