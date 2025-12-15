"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts"
import { useMemo } from "react"

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
import { mockFiles } from "@/data/mockStorageData"

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

// Helper function to parse size string to MB
function parseSizeToMB(sizeString: string): number {
  if (!sizeString) return 0;
  
  const sizeMatch = sizeString.toLowerCase().match(/([\d.]+)\s*(mb|gb|kb)/i);
  if (!sizeMatch) return 0;
  
  const value = parseFloat(sizeMatch[1]);
  const unit = sizeMatch[2].toLowerCase();
  
  switch (unit) {
    case 'gb':
      return value * 1024;
    case 'mb':
      return value;
    case 'kb':
      return value / 1024;
    default:
      return value;
  }
}

// Helper function to format MB to GB with 1 decimal place
function formatMBtoGB(mb: number): number {
  return parseFloat((mb / 1024).toFixed(1));
}

// Process mock files data to get categorized usage
function processFileData(): FileCategoryData[] {
  // Define file type categories
  const documentTypes = ['DOCX', 'MD', 'TXT'];
  const imageTypes = ['JPG', 'PNG', 'SVG', 'GIF', 'BMP'];
  const videoTypes = ['MP4', 'MKV', 'MOV', 'AVI', 'WMV'];
  const spreadsheetTypes = ['XLSX', 'CSV'];
  const pdfType = ['PDF'];
  
  // Initialize categories with colors
  const categories = {
    Document: { usage: 0, files: 0, color: "#4299E1" },
    Image: { usage: 0, files: 0, color: "#48BB78" },
    Videos: { usage: 0, files: 0, color: "#ED8936" },
    Spreadsheets: { usage: 0, files: 0, color: "#9F7AEA" },
    PDF: { usage: 0, files: 0, color: "#4157FE" },
  };
  
  // Process all files
  mockFiles.forEach(file => {
    if (!file.isTrashed) {
      const fileSizeMB = parseSizeToMB(file.size);
      const fileType = file.fileType?.toUpperCase();
      
      if (documentTypes.includes(fileType)) {
        categories.Document.usage += fileSizeMB;
        categories.Document.files++;
      } else if (imageTypes.includes(fileType)) {
        categories.Image.usage += fileSizeMB;
        categories.Image.files++;
      } else if (videoTypes.includes(fileType)) {
        categories.Videos.usage += fileSizeMB;
        categories.Videos.files++;
      } else if (spreadsheetTypes.includes(fileType)) {
        categories.Spreadsheets.usage += fileSizeMB;
        categories.Spreadsheets.files++;
      } else if (pdfType.includes(fileType)) {
        categories.PDF.usage += fileSizeMB;
        categories.PDF.files++;
      }
    }
  });
  
  // Convert to array format and convert MB to GB
  return Object.entries(categories).map(([category, data]) => ({
    category,
    usage: formatMBtoGB(data.usage),
    files: data.files,
    color: data.color,
  }));
}

export function FileCategoriesChart({
  data,
  chartConfig = defaultChartConfig,
  totalUsage,
  title = "File Categories",
  description = "Total Files",
  minWidth = "672px",
  maxHeight = "342px",
  chartHeight = 200
}: FileCategoriesChartProps) {
  // Process data from mock files if no data provided
  const processedData = useMemo(() => {
    if (data) return data;
    return processFileData();
  }, [data]);
  
  // Calculate totals if not provided
  const calculatedTotalFiles = useMemo(() => 
    processedData.reduce((sum, item) => sum + item.files, 0), 
    [processedData]
  );
  
  const calculatedTotalUsage = useMemo(() => 
    processedData.reduce((sum, item) => sum + item.usage, 0), 
    [processedData]
  );
  
  const displayTotalUsage = totalUsage !== undefined ? totalUsage : calculatedTotalUsage;
  const maxUsage = Math.max(...processedData.map(item => item.usage));
  
  const yAxisMax = Math.ceil(displayTotalUsage) - 0.5 ;

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
              {description}: <span className="font-semibold text-foreground">{calculatedTotalFiles}</span>
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground flex items-center gap-[12px]">
              <span className="text-sm">Usage:</span>
              <span className="text-lg font-semibold text-foreground">{displayTotalUsage.toFixed(1)} GB</span>
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
                data={processedData}
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
                  domain={[0, yAxisMax]}
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
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '12px',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "usage") return [`${value.toFixed(1)} GB`, "Storage Used"];
                    if (name === "files") return [value, "Number of Files"];
                    return [value, name];
                  }}
                  labelStyle={{ 
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: '#1f2937'
                  }}
                  itemStyle={{ 
                    fontSize: '14px',
                    color: '#4b5563'
                  }}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                />
                <Bar 
                  dataKey="usage" 
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                  name="Storage Used"
                >
                  {processedData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      strokeWidth={1}
                      stroke="rgba(255, 255, 255, 0.3)"
                    />
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

// Export a default instance with pre-processed data
export function DefaultFileCategoriesChart() {
  const processedData = processFileData();
  const totalUsage = processedData.reduce((sum, item) => sum + item.usage, 0);
  
  return (
    <FileCategoriesChart 
      data={processedData}
      totalUsage={totalUsage}
    />
  );
}