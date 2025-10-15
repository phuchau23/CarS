"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { MaintenanceSchedule, Vehicle, VehicleType } from "@/app/lib/types";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: VehicleFormData) => void;
  onCancel?: () => void;
}

export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vehicleType: "motorbike" | "car" | "truck" | "van";
  mileage: number;
  maintenanceSchedule: MaintenanceSchedule;
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    licensePlate: vehicle?.licensePlate || "",
    vehicleType: vehicle?.vehicleType || "motorbike",
    mileage: vehicle?.mileage || 0,
    maintenanceSchedule: vehicle?.maintenanceSchedule || {
      oilChange: {
        intervalKm: 2000,
        lastServiceKm: 0,
        lastServiceDate: new Date().toISOString(),
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateMaintenanceSchedule = (
    type: keyof MaintenanceSchedule,
    field: string,
    value: number | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      maintenanceSchedule: {
        ...prev.maintenanceSchedule,
        [type]: {
          ...prev.maintenanceSchedule[type],
          [field]: value,
        },
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin xe</CardTitle>
          <CardDescription>
            Nhập thông tin cơ bản về phương tiện của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Hãng xe *</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) =>
                  setFormData({ ...formData, make: e.target.value })
                }
                placeholder="Honda, Toyota, Yamaha..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Dòng xe *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Wave Alpha, Vios, Exciter..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Năm sản xuất *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: Number.parseInt(e.target.value),
                  })
                }
                min={1990}
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">Biển số xe</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
                placeholder="29A1-12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Loại xe *</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(value: VehicleType) =>
                  setFormData({ ...formData, vehicleType: value })
                }
              >
                <SelectTrigger id="vehicleType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motorbike">Xe máy</SelectItem>
                  <SelectItem value="car">Ô tô</SelectItem>
                  <SelectItem value="truck">Xe tải</SelectItem>
                  <SelectItem value="van">Xe van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Số km hiện tại *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mileage: Number.parseInt(e.target.value),
                  })
                }
                min={0}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lịch bảo dưỡng</CardTitle>
          <CardDescription>
            Thiết lập lịch bảo dưỡng định kỳ cho xe của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Oil Change Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium">Thay dầu động cơ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="oilInterval">Chu kỳ thay dầu (km)</Label>
                <Input
                  id="oilInterval"
                  type="number"
                  value={
                    formData.maintenanceSchedule.oilChange?.intervalKm || 0
                  }
                  onChange={(e) =>
                    updateMaintenanceSchedule(
                      "oilChange",
                      "intervalKm",
                      Number.parseInt(e.target.value)
                    )
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="oilLastService">Thay dầu lần cuối (km)</Label>
                <Input
                  id="oilLastService"
                  type="number"
                  value={
                    formData.maintenanceSchedule.oilChange?.lastServiceKm || 0
                  }
                  onChange={(e) =>
                    updateMaintenanceSchedule(
                      "oilChange",
                      "lastServiceKm",
                      Number.parseInt(e.target.value)
                    )
                  }
                  min={0}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Coolant Schedule */}
          <div className="space-y-4">
            <h4 className="font-medium">Thay nước làm mát (chỉ ô tô)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coolantInterval">Chu kỳ thay (km)</Label>
                <Input
                  id="coolantInterval"
                  type="number"
                  value={formData.maintenanceSchedule.coolant?.intervalKm || 0}
                  onChange={(e) =>
                    updateMaintenanceSchedule(
                      "coolant",
                      "intervalKm",
                      Number.parseInt(e.target.value)
                    )
                  }
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coolantLastService">Thay lần cuối (km)</Label>
                <Input
                  id="coolantLastService"
                  type="number"
                  value={
                    formData.maintenanceSchedule.coolant?.lastServiceKm || 0
                  }
                  onChange={(e) =>
                    updateMaintenanceSchedule(
                      "coolant",
                      "lastServiceKm",
                      Number.parseInt(e.target.value)
                    )
                  }
                  min={0}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          {vehicle ? "Cập nhật xe" : "Thêm xe"}
        </Button>
      </div>
    </form>
  );
}
