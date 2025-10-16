"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Users, Check } from "lucide-react";
import { User, Vehicle } from "@/app/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { getDatabase } from "@/app/lib/db";
import { Badge } from "../ui/badge";

interface DriverAssignmentProps {
  vehicles: Vehicle[];
  drivers: User[];
  onUpdate?: () => void;
}

export function DriverAssignment({ vehicles, drivers, onUpdate }: DriverAssignmentProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = () => {
    if (!selectedVehicle || !selectedDriver) return;

    setIsAssigning(true);
    const db = getDatabase();

    // Update vehicle owner
    db.updateVehicle(selectedVehicle, {
      ownerId: selectedDriver,
    });

    setTimeout(() => {
      setIsAssigning(false);
      setSelectedVehicle("");
      setSelectedDriver("");
      onUpdate?.();
    }, 500);
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    return driver?.name || "Chưa gán";
  };

  const getDriverVehicleCount = (driverId: string) => {
    return vehicles.filter((v) => v.ownerId === driverId).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Gán tài xế
          </CardTitle>
          <CardDescription>Gán xe cho tài xế trong đội</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn xe</label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn xe cần gán" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-gray-700">
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id} className="hover:bg-gray-800 focus:bg-gray-800">
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Chọn tài xế</label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn tài xế" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-gray-700">
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id} className="hover:bg-gray-800 focus:bg-gray-800">
                    {driver.name} ({getDriverVehicleCount(driver.id)} xe)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAssign}
            disabled={!selectedVehicle || !selectedDriver || isAssigning}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4 mr-2" />
            {isAssigning ? "Đang gán..." : "Gán tài xế"}
          </Button>
        </CardContent>
      </Card>

      {/* Driver List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài xế</CardTitle>
          <CardDescription>{drivers.length} tài xế trong đội</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {drivers.map((driver) => {
              const vehicleCount = getDriverVehicleCount(driver.id);
              const driverVehicles = vehicles.filter((v) => v.ownerId === driver.id);

              return (
                <div key={driver.id} className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.phone}</p>
                    </div>
                    <Badge variant="secondary">{vehicleCount} xe</Badge>
                  </div>
                  {driverVehicles.length > 0 && (
                    <div className="mt-2 pt-2 border-t space-y-1">
                      {driverVehicles.map((vehicle) => (
                        <p key={vehicle.id} className="text-xs text-muted-foreground">
                          • {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
