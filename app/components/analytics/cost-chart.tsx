"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

// --- Kiểu dữ liệu Trip ---
export interface Trip {
  id: string;
  createdAt: string;
  type: "maintenance" | "fuel" | "repair" | "other";
  amount: number;
}

// --- Kiểu dữ liệu cho từng tháng ---
interface MonthlyCostData {
  month: string; // dạng YYYY-MM
  maintenance: number;
  fuel: number;
  repair: number;
  other: number;
  monthLabel?: string; // "Thg 1, 2025"
}

interface CostChartProps {
  trips: Trip[];
}

export function CostChart({ trips }: CostChartProps) {
  // Nhóm dữ liệu theo tháng
  const monthlyData = trips.reduce<Record<string, MonthlyCostData>>(
    (acc, trip) => {
      const date = new Date(trip.createdAt);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          maintenance: 0,
          fuel: 0,
          repair: 0,
          other: 0,
        };
      }

      // Cộng dồn chi phí theo loại
      acc[monthKey][trip.type] += trip.amount;

      return acc;
    },
    {}
  );

  // Chuyển thành mảng để hiển thị chart
  const chartData: MonthlyCostData[] = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Chỉ lấy 6 tháng gần nhất
    .map((item) => ({
      ...item,
      monthLabel: new Date(item.month + "-01").toLocaleDateString("vi-VN", {
        month: "short",
        year: "numeric",
      }),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi phí theo tháng</CardTitle>
        <CardDescription>Phân tích chi phí 6 tháng gần nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            maintenance: { label: "Bảo dưỡng", color: "hsl(var(--chart-1))" },
            fuel: { label: "Nhiên liệu", color: "hsl(var(--chart-2))" },
            repair: { label: "Sửa chữa", color: "hsl(var(--chart-3))" },
            other: { label: "Khác", color: "hsl(var(--chart-4))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthLabel" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="maintenance"
                fill="var(--color-maintenance)"
                name="Bảo dưỡng"
                stackId="a"
              />
              <Bar
                dataKey="fuel"
                fill="var(--color-fuel)"
                name="Nhiên liệu"
                stackId="a"
              />
              <Bar
                dataKey="repair"
                fill="var(--color-repair)"
                name="Sửa chữa"
                stackId="a"
              />
              <Bar
                dataKey="other"
                fill="var(--color-other)"
                name="Khác"
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
