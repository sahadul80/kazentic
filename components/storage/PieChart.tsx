"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function StoragePieCard() {
  const usedPercent = 70;
  const freePercent = 20;

  // Data for full circles (100% each)
  const usedData = [
    { name: "Used", value: 100, color: "#3B82F6" }
  ];

  const freeData = [
    { name: "Free", value: 100, color: "#F59E0B" }
  ];

  // Calculate radii - small circle is half the radius of large circle
  const largeRadius = 84; // Large circle outer radius
  const smallRadius = largeRadius / 3; // Small circle outer radius (half of large)

  return (
    <Card className="shadow-sm relative overflow-hidden border-fs max-h-[342px] min-w-[474px]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold">Storage</CardTitle>

        <Button variant="outline" className="flex items-center gap-1 text-blue-600">
          <span className="text-xs">↗</span> Upgrade
        </Button>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-600 text-sm">Total Size : 100 GB</p>

        <div className="relative flex items-center justify-center w-full h-[200px]">
          {/* Main Container */}
          <div className="relative w-[200px] h-[200px]">
            
            {/* LARGE BLUE CIRCLE (Used Storage) - Full Circle */}
            <div 
              className="absolute z-10"
              style={{
                width: `${largeRadius * 2}px`,
                height: `${largeRadius * 2}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usedData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={largeRadius}
                    endAngle={360}
                  >
                    {usedData.map((item, index) => (
                      <Cell 
                        key={index} 
                        fill={item.color}
                        stroke="#3B82F6"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center label for large circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-gray-800">{usedPercent}%</span>
                </div>
              </div>
            </div>

            {/* SMALL ORANGE CIRCLE (Free Storage) - Half radius, overlaps top right */}
            <div 
              className="absolute z-20"
              style={{
                width: `${smallRadius * 5}px`,
                height: `${smallRadius * 5}px`,
                top: `${90 - (largeRadius - smallRadius / 2)}%`,
                left: `${20 + (largeRadius - smallRadius / 2)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={freeData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    startAngle={0}
                    endAngle={360}
                  >
                    {freeData.map((item, index) => (
                      <Cell 
                        key={index} 
                        fill={item.color}
                        stroke="#F59E0B"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center label for small circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-xl font-bold text-gray-800">{freePercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="flex justify-center gap-[8px] text-sm">
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