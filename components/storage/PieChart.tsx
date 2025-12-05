"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PieChart, Pie, Cell } from "recharts";

export default function StoragePieCard() {
  const usedPercent = 70;
  const freePercent = 20;

  // Data for each pie chart (complete circles)
  const pieDataUsed = [
    { name: "Used", value: usedPercent, color: "#3B82F6" }
  ];

  const pieDataFree = [
    { name: "Free", value: freePercent, color: "#F59E0B" }
  ];

  return (
    <Card className="p-4 shadow-sm relative overflow-hidden border border-blue-200">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Storage</CardTitle>

        <Button variant="outline" className="flex items-center gap-1 text-blue-600">
          <span className="text-xs">↗</span> Upgrade
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm mb-4">Total Size : 100 GB</p>

        <div className="relative flex items-center justify-center w-auto h-[240px]">
          {/* BLUE PIE CHART (Left side) */}
          <div className="absolute inset-0">
            <PieChart width={200} height={200}>
              <Pie
                data={pieDataUsed}
                dataKey="value"
                innerRadius={0}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={0}
                paddingAngle={0}
              >
                {pieDataUsed.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
            </PieChart>

            {/* Center text for blue pie */}
            <div className="absolute inset-0 top-33 left-27 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-4xl font-bold text-gray-800">{usedPercent}%</span>
            </div>
          </div>

          {/* ORANGE PIE CHART (Right side) */}
          <div className="absolute inset-0 left-35 -top-5">
            <PieChart width={150} height={150}>
              <Pie
                data={pieDataFree}
                dataKey="value"
                innerRadius={0}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                stroke="none"
                cornerRadius={0}
                paddingAngle={0}
              >
                {pieDataFree.map((item, index) => (
                  <Cell key={index} fill={item.color} />
                ))}
              </Pie>
            </PieChart>

            {/* Center text for orange pie */}
            <div className="absolute inset-0 top-31 left-18 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl font-bold text-gray-800">{freePercent}%</span>
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex justify-center gap-10 mt-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            Storage Used
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Storage Left
          </div>
        </div>
      </CardContent>
    </Card>
  );
}