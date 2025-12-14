"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

export type FileCategoryData = {
  category: string;
  usage: number;
  files: number;
  color: string;
}

export interface FileCategoriesChartProps {
  /** Array of file category data */
  data?: FileCategoryData[];
  /** Configuration for the chart */
  chartConfig?: ChartConfig;
  /** Total usage in GB */
  totalUsage?: number;
  /** Title of the chart */
  title?: string;
  /** Description text */
  description?: string;
  /** Minimum width of the card */
  minWidth?: string;
  /** Maximum height of the card */
  maxHeight?: string;
  /** Bar chart height */
  chartHeight?: number;
}

const defaultData: FileCategoryData[] = [
  { 
    category: "Image", 
    usage: 16, 
    files: 35,
    color: "#DBE9FF" 
  },
  { 
    category: "Document", 
    usage: 8, 
    files: 25,
    color: "#DBE9FF" 
  },
  { 
    category: "Videos", 
    usage: 2, 
    files: 15,
    color: "#DBE9FF" 
  },
  { 
    category: "Spreadsheets", 
    usage: 14, 
    files: 15,
    color: "#DBE9FF" 
  },
  { 
    category: "PDF", 
    usage: 10, 
    files: 10,
    color: "#4157FE" 
  },
]

const defaultChartConfig = {
  usage: {
    label: "Usage (GB)",
    color: "var(--primary)",
  },
  files: {
    label: "Number of Files",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

export function FileCategoriesChart({
  data = defaultData,
  chartConfig = defaultChartConfig,
  totalUsage = 40,
  title = "File Categories",
  description = "Total Files",
  minWidth = "672px",
  maxHeight = "342px",
  chartHeight = 200
}: FileCategoriesChartProps) {
  const totalFiles = data.reduce((sum, item) => sum + item.files, 0)
  const maxUsage = Math.max(...data.map(item => item.usage))

  return (
    <Card 
      className="shadow-sm overflow-hidden border-fs" 
      style={{ 
        minWidth: minWidth,
        maxHeight: maxHeight,
        height: maxHeight 
      }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-[8px]">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              {description}: <span className="font-semibold text-foreground">{totalFiles}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xl text-muted-foreground gap-[8px]">
                Usage: 
                <span className="text-lg font-semibold">{totalUsage} GB</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div 
          className="w-full" 
          style={{ height: `${chartHeight}px` }}
        >
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="horizontal"
                margin={{ top: 16, right: 24, left: 0, bottom: 2 }}
              >
                <CartesianGrid 
                  horizontal={true} 
                  vertical={false} 
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />
                <XAxis 
                  type="category" 
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  interval={0}
                  height={40}
                />
                <YAxis 
                  type="number"
                  domain={[0, maxUsage + 4]}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value) => `${value} GB`}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    boxShadow: '0 4px 6px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value, name) => {
                    if (name === "usage") return [`${value} GB`, "Usage"];
                    return [value, "Files"];
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Bar 
                  dataKey="usage" 
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                  name="Usage"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}