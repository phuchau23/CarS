"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Vehicle } from "@/app/lib/types";
import { Reminder } from "@/app/lib/types";

interface MaintenanceOverviewProps {
  vehicles: Vehicle[];
  reminders: Reminder[];
}

export function MaintenanceOverview({
  vehicles,
  reminders,
}: MaintenanceOverviewProps) {
  const getMaintenanceProgress = (vehicle: Vehicle) => {
    if (!vehicle.maintenanceSchedule.oilChange || !vehicle.mileage) return 0;

    const { intervalKm, lastServiceKm } = vehicle.maintenanceSchedule.oilChange;
    const kmSinceService = vehicle.mileage - lastServiceKm;
    const progress = (kmSinceService / intervalKm) * 100;

    return Math.min(progress, 100);
  };

  const vehiclesNeedingMaintenance = vehicles.filter((v) => {
    const progress = getMaintenanceProgress(v);
    return progress >= 80;
  });

  const activeReminders = reminders.filter(
    (r) => r.status === "pending" || r.status === "sent"
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vehicles Needing Maintenance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Xe cần bảo dưỡng
            </CardTitle>
            <Badge className="bg-warning text-white">
              {vehiclesNeedingMaintenance.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {vehiclesNeedingMaintenance.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Tất cả xe đều trong tình trạng tốt
            </p>
          ) : (
            <div className="space-y-4">
              {vehiclesNeedingMaintenance.map((vehicle) => {
                const progress = getMaintenanceProgress(vehicle);
                return (
                  <div key={vehicle.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {vehicle.make} {vehicle.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.licensePlate}
                        </p>
                      </div>
                      <Badge
                        variant={progress >= 100 ? "destructive" : "secondary"}
                      >
                        {progress >= 100 ? "Quá hạn" : "Sắp đến"}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {vehicle.mileage?.toLocaleString()} km /{" "}
                      {vehicle.maintenanceSchedule.oilChange?.intervalKm.toLocaleString()}{" "}
                      km
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Reminders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Nhắc nhở đang chờ</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/reminders">Xem tất cả</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeReminders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Không có nhắc nhở nào
            </p>
          ) : (
            <div className="space-y-3">
              {activeReminders.slice(0, 5).map((reminder) => {
                const vehicle = vehicles.find(
                  (v) => v.id === reminder.vehicleId
                );
                const daysUntil = Math.ceil(
                  (new Date(reminder.dueDate).getTime() - Date.now()) /
                    (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={reminder.id}
                    className="p-3 bg-warning/10 border border-warning/20 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {reminder.message}
                        </p>
                        {vehicle && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {vehicle.make} {vehicle.model}
                          </p>
                        )}
                      </div>
                      <Badge className="bg-warning text-white text-xs">
                        {daysUntil <= 0 ? "Hôm nay" : `${daysUntil} ngày`}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
