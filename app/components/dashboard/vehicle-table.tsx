"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Vehicle, Trip } from "@/app/lib/types";

interface VehicleTableProps {
  vehicles: Vehicle[];
  trips: Trip[];
}

export function VehicleTable({ vehicles, trips }: VehicleTableProps) {
  const getVehicleCost = (vehicleId: string) => {
    return trips
      .filter((t) => t.vehicleId === vehicleId)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMaintenanceStatus = (vehicle: Vehicle) => {
    if (!vehicle.maintenanceSchedule.oilChange || !vehicle.mileage)
      return "unknown";

    const { intervalKm, lastServiceKm } = vehicle.maintenanceSchedule.oilChange;
    const kmUntilService = intervalKm - (vehicle.mileage - lastServiceKm);

    if (kmUntilService <= 0) return "overdue";
    if (kmUntilService <= 500) return "due-soon";
    return "good";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "overdue":
        return <Badge variant="destructive">Quá hạn</Badge>;
      case "due-soon":
        return <Badge className="bg-warning text-white">Sắp đến hạn</Badge>;
      case "good":
        return <Badge className="bg-success text-white">Tốt</Badge>;
      default:
        return <Badge variant="secondary">N/A</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Xe</TableHead>
            <TableHead>Biển số</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead className="text-right">Số km</TableHead>
            <TableHead className="text-right">Chi phí</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                Chưa có xe nào
              </TableCell>
            </TableRow>
          ) : (
            vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">
                  {vehicle.make} {vehicle.model}
                  <div className="text-xs text-muted-foreground">
                    {vehicle.year}
                  </div>
                </TableCell>
                <TableCell>{vehicle.licensePlate || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {vehicle.vehicleType === "motorbike" && "Xe máy"}
                    {vehicle.vehicleType === "car" && "Ô tô"}
                    {vehicle.vehicleType === "truck" && "Xe tải"}
                    {vehicle.vehicleType === "van" && "Xe van"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {vehicle.mileage?.toLocaleString() || "N/A"}
                </TableCell>
                <TableCell className="text-right font-medium text-accent">
                  {getVehicleCost(vehicle.id).toLocaleString()}đ
                </TableCell>
                <TableCell>
                  {getStatusBadge(getMaintenanceStatus(vehicle))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/vehicle/${vehicle.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
