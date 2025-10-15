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
import { getBrandById, getModelById } from "@/app/lib/vehicle-brands";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// 🧩 Định nghĩa type rõ ràng
interface MaintenanceSchedule {
  oilChange: {
    intervalKm: number;
    lastServiceKm: number;
    lastServiceDate: string;
  };
}

export interface VehicleDetailsData {
  licensePlate: string;
  color: string;
  engineSize: string;
  mileage: number;
  maintenanceSchedule: MaintenanceSchedule;
}

interface VehicleDetailsFormProps {
  vehicleType: string;
  brandId: string;
  modelId: string;
  onSubmit: (data: VehicleDetailsData) => void;
  onCancel: () => void;
}

export function VehicleDetailsForm({
  vehicleType,
  brandId,
  modelId,
  onSubmit,
  onCancel,
}: VehicleDetailsFormProps) {
  const brand = getBrandById(brandId);
  const model = getModelById(brandId, modelId);

  const [formData, setFormData] = useState({
    licensePlate: "",
    color: "",
    engineSize: "",
    mileage: 0,
    oilIntervalKm: vehicleType === "car" ? 5000 : 2000,
    oilLastServiceKm: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vehicleData: VehicleDetailsData = {
      licensePlate: formData.licensePlate,
      color: formData.color,
      engineSize: formData.engineSize,
      mileage: formData.mileage,
      maintenanceSchedule: {
        oilChange: {
          intervalKm: formData.oilIntervalKm,
          lastServiceKm: formData.oilLastServiceKm,
          lastServiceDate: new Date().toISOString(),
        },
      },
    };
    onSubmit(vehicleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Preview */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-xl overflow-hidden bg-secondary/50 flex-shrink-0">
              <img
                src={model?.photo || "/placeholder.svg"}
                alt={model?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {brand?.name} {model?.name}
              </h3>
              <p className="text-muted-foreground mt-1">
                Năm sản xuất: {model?.year}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Hoàn tất thông tin để bắt đầu theo dõi bảo dưỡng xe của bạn
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>
            Nhập thông tin chi tiết về xe của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Biển số xe *</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value })
                }
                placeholder="29A1-12345"
                required
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Màu xe</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                placeholder="Đỏ, Đen, Trắng..."
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="engineSize">Dung tích động cơ</Label>
              <Input
                id="engineSize"
                value={formData.engineSize}
                onChange={(e) =>
                  setFormData({ ...formData, engineSize: e.target.value })
                }
                placeholder="110cc, 1.5L..."
                className="bg-secondary/50"
              />
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
                className="bg-secondary/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch bảo dưỡng</CardTitle>
          <CardDescription>Thiết lập chu kỳ bảo dưỡng định kỳ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oilInterval">Chu kỳ thay dầu (km) *</Label>
              <Input
                id="oilInterval"
                type="number"
                value={formData.oilIntervalKm}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oilIntervalKm: Number.parseInt(e.target.value),
                  })
                }
                min={0}
                required
                className="bg-secondary/50"
              />
              <p className="text-xs text-muted-foreground">
                Khuyến nghị: {vehicleType === "car" ? "5,000 km" : "2,000 km"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oilLastService">Thay dầu lần cuối (km)</Label>
              <Input
                id="oilLastService"
                type="number"
                value={formData.oilLastServiceKm}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oilLastServiceKm: Number.parseInt(e.target.value),
                  })
                }
                min={0}
                className="bg-secondary/50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90 px-8">
          Hoàn tất
        </Button>
      </div>
    </form>
  );
}
