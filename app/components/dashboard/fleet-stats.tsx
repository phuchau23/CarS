"use client";

import { Reminder, Trip, Vehicle } from "@/app/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Car, DollarSign, AlertCircle, TrendingUp } from "lucide-react";

interface FleetStatsProps {
  vehicles: Vehicle[];
  trips: Trip[];
  reminders: Reminder[];
}

export function FleetStats({ vehicles, trips, reminders }: FleetStatsProps) {
  const totalVehicles = vehicles.length;
  const totalMileage = vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0);
  const totalSpent = trips.reduce((sum, t) => sum + t.amount, 0);
  const activeReminders = reminders.filter(
    (r) => r.status === "pending" || r.status === "sent"
  ).length;
  const avgCostPerVehicle = totalVehicles > 0 ? totalSpent / totalVehicles : 0;

  const stats = [
    {
      title: "Tổng số xe",
      value: totalVehicles,
      icon: Car,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Tổng chi phí",
      value: `${totalSpent.toLocaleString()}đ`,
      icon: DollarSign,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Nhắc nhở đang chờ",
      value: activeReminders,
      icon: AlertCircle,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "TB chi phí/xe",
      value: `${avgCostPerVehicle.toLocaleString()}đ`,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
