"use client"

import { useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { formatDateForTimePeriod } from "@/lib/utils"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PriceChartProps {
  data: [number, number][]
  timePeriod: string
}

export default function PriceChart({ data, timePeriod }: PriceChartProps) {
  const chartRef = useRef<ChartJS<"line">>(null)

  const chartData = {
    labels: data.map((item) => formatDateForTimePeriod(item[0], timePeriod)),
    datasets: [
      {
        label: "Price (USD)",
        data: data.map((item) => item[1]),
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.1,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(6)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 8,
        },
      },
      y: {
        position: "right",
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          callback: (value) => "$" + value,
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  }

  return <Line data={chartData} options={options} ref={chartRef} />
}

