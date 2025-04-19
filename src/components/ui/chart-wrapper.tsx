
import * as React from "react"
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts"

interface ChartProps {
  data: any[]
  type: "bar" | "line"
  categories: string[]
  index: string
  colors?: string[]
  valueFormatter?: (value: number) => string
  height?: number
}

export function Chart({
  data,
  type,
  categories,
  index,
  colors = ["#2563eb"],
  valueFormatter = (value: number) => `${value}`,
  height = 300,
}: ChartProps) {
  return (
    <ChartContainer
      config={{}}
      className="w-full aspect-[5/3] h-full max-h-96"
    >
      {type === "bar" ? (
        <BarChart data={data}>
          <XAxis 
            dataKey={index} 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number) => valueFormatter(value)}
              />
            }
          />
        </BarChart>
      ) : (
        <LineChart data={data}>
          <XAxis 
            dataKey={index} 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={valueFormatter}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          ))}
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number) => valueFormatter(value)}
              />
            }
          />
          <Legend />
        </LineChart>
      )}
    </ChartContainer>
  )
}
