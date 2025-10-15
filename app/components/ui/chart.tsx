"use client";

import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

// Cấu hình màu và nhãn cho các loại dữ liệu biểu đồ
export interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  // Tạo CSS variable từ config
  const style = Object.entries(config).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [`--color-${key}`]: value.color,
    }),
    {}
  ) as React.CSSProperties;

  return (
    <div
      className={cn("w-full rounded-lg border bg-background p-4", className)}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

// Định nghĩa props cho tooltip chart
interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    name: string;
    value: number;
    color?: string;
  }>;
  label?: string;
  // phần hiển thị trong tooltip trigger (vd: ô hover)
  content: React.ReactNode;
}

export function ChartTooltip({
  active,
  payload = [],
  label,
  content,
}: ChartTooltipProps) {
  if (!active || payload.length === 0) return null;

  return (
    <Tooltip open>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="top" align="center">
        <div className="text-sm font-medium">{label}</div>
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center gap-2 text-xs"
            style={{ color: item.color }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: {item.value.toLocaleString()}
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  );
}

// Component fallback khi chưa có dữ liệu
export function ChartTooltipContent() {
  return <div className="text-sm text-muted-foreground">Đang tải...</div>;
}
