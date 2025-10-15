"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Edit, Trash2, Gauge } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Vehicle } from "@/app/lib/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function VehicleCard({ vehicle, onDelete, showActions = true }: VehicleCardProps) {
  const getMaintenanceStatus = () => {
    if (!vehicle.maintenanceSchedule.oilChange || !vehicle.mileage) return null;

    const { intervalKm, lastServiceKm } = vehicle.maintenanceSchedule.oilChange;
    const kmUntilService = intervalKm - (vehicle.mileage - lastServiceKm);

    if (kmUntilService <= 0) {
      return <Badge variant="destructive">Quá hạn bảo dưỡng</Badge>;
    } else if (kmUntilService <= 500) {
      return <Badge className="bg-warning text-white">Sắp bảo dưỡng</Badge>;
    } else {
      return <Badge className="bg-success text-white">Tốt</Badge>;
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02] border-border/50 bg-card">
      {/* Vehicle Image */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-secondary/50 to-secondary/20">
        <img
          src={vehicle.photo || "/placeholder.svg?height=300&width=500"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">{getMaintenanceStatus()}</div>
      </div>

      {/* Nội dung chính */}
      <CardContent className="flex flex-col flex-grow p-5 justify-between">
        <div className="space-y-4 flex-grow">
          {/* Vehicle Info */}
          <div>
            <h3 className="text-xl font-bold">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {vehicle.year} • {vehicle.licensePlate || "Chưa có biển số"}
            </p>
            {vehicle.color && <p className="text-xs text-muted-foreground">Màu: {vehicle.color}</p>}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-sm">
            <Gauge className="h-4 w-4 text-primary" />
            <span className="font-medium">{vehicle.mileage?.toLocaleString() || "0"} km</span>
            {vehicle.maintenanceSchedule.oilChange && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Thay dầu lần cuối: {vehicle.maintenanceSchedule.oilChange.lastServiceKm.toLocaleString()} km
                </span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4">
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link href={`/vehicle/${vehicle.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Chi tiết
              </Link>
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(vehicle.id)}
                className="text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
