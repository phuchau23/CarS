"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Download, FileSpreadsheet } from "lucide-react";
import { Vehicle } from "@/app/lib/types";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "@radix-ui/react-checkbox";

interface ExportFormProps {
  vehicles: Vehicle[];
  onExport: (params: ExportFormData) => void;
}

export interface ExportFormData {
  exportType: "trips" | "vehicles" | "reminders" | "all";
  startDate?: string;
  endDate?: string;
  vehicleIds: string[];
}

export function ExportForm({ vehicles, onExport }: ExportFormProps) {
  const [formData, setFormData] = useState<ExportFormData>({
    exportType: "trips",
    vehicleIds: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExport(formData);
  };

  const toggleVehicle = (vehicleId: string) => {
    setFormData((prev) => ({
      ...prev,
      vehicleIds: prev.vehicleIds.includes(vehicleId)
        ? prev.vehicleIds.filter((id) => id !== vehicleId)
        : [...prev.vehicleIds, vehicleId],
    }));
  };

  const selectAllVehicles = () => {
    setFormData((prev) => ({
      ...prev,
      vehicleIds: vehicles.map((v) => v.id),
    }));
  };

  const clearAllVehicles = () => {
    setFormData((prev) => ({
      ...prev,
      vehicleIds: [],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Xuất báo cáo CSV
        </CardTitle>
        <CardDescription>
          Chọn loại dữ liệu và khoảng thời gian để xuất
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="exportType">Loại báo cáo *</Label>
            <Select
              value={formData.exportType}
              onValueChange={(value: ExportFormData["exportType"]) =>
                setFormData({ ...formData, exportType: value })
              }
            >
              <SelectTrigger id="exportType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trips">Chi phí và giao dịch</SelectItem>
                <SelectItem value="vehicles">Thông tin xe</SelectItem>
                <SelectItem value="reminders">Nhắc nhở</SelectItem>
                <SelectItem value="all">Tất cả (3 file)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Từ ngày</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Chọn xe</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllVehicles}
                >
                  Chọn tất cả
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAllVehicles}
                >
                  Bỏ chọn
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={vehicle.id}
                    checked={formData.vehicleIds.includes(vehicle.id)}
                    onCheckedChange={() => toggleVehicle(vehicle.id)}
                  />
                  <label
                    htmlFor={vehicle.id}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo CSV
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
