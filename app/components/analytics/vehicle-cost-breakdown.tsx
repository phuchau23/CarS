"use client";

import { Trip, Vehicle } from "@/app/lib/types";

import { Progress } from "../ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface VehicleCostBreakdownProps {
  vehicles: Vehicle[];
  trips: Trip[];
}

export function VehicleCostBreakdown({
  vehicles,
  trips,
}: VehicleCostBreakdownProps) {
  const vehicleCosts = vehicles.map((vehicle) => {
    const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id);
    const totalCost = vehicleTrips.reduce((sum, t) => sum + t.amount, 0);

    return {
      vehicle,
      totalCost,
      tripCount: vehicleTrips.length,
    };
  });

  const maxCost = Math.max(...vehicleCosts.map((v) => v.totalCost), 1);
  const sortedVehicles = vehicleCosts.sort((a, b) => b.totalCost - a.totalCost);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi phí theo xe</CardTitle>
        <CardDescription>Top xe có chi phí cao nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedVehicles
            .slice(0, 5)
            .map(({ vehicle, totalCost, tripCount }) => (
              <div key={vehicle.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {vehicle.licensePlate} • {tripCount} giao dịch
                    </p>
                  </div>
                  <p className="font-semibold text-accent">
                    {totalCost.toLocaleString()}đ
                  </p>
                </div>
                <Progress value={(totalCost / maxCost) * 100} className="h-2" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
