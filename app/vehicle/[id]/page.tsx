"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Vehicle, Trip, Reminder } from "@/app/lib/types";
import { getDatabase } from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { LubricantRecommendation } from "@/app/components/vehicle/lubricant-recommendation";
import {
  VehicleForm,
  type VehicleFormData,
} from "@/app/components/vehicle/vehicle-form";

export default function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const v = db.getVehicleById(id);
    if (!v) {
      router.push("/mobile/home");
      return;
    }

    setVehicle(v);
    setTrips(db.getTripsByVehicle(id));
    setReminders(db.getRemindersByVehicle(id));
  }, [id, router]);

  const handleUpdate = (data: VehicleFormData) => {
    const db = getDatabase();
    const updated = db.updateVehicle(id, data);
    if (updated) {
      setVehicle(updated);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa xe này?")) {
      const db = getDatabase();
      db.deleteVehicle(id);
      router.push("/mobile/home");
    }
  };

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Hủy chỉnh sửa
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Chỉnh sửa xe</h1>
          </div>
          <VehicleForm
            vehicle={vehicle}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  const totalSpent = trips.reduce((sum, trip) => sum + trip.amount, 0);
  const activeReminders = reminders.filter(
    (r) => r.status === "pending" || r.status === "sent"
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mobile/home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {vehicle.make} {vehicle.model}
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  {vehicle.year} • {vehicle.licensePlate || "Chưa có biển số"}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {vehicle.vehicleType === "motorbike" && "Xe máy"}
                {vehicle.vehicleType === "car" && "Ô tô"}
                {vehicle.vehicleType === "truck" && "Xe tải"}
                {vehicle.vehicleType === "van" && "Xe van"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Số km hiện tại</p>
                <p className="text-2xl font-bold">
                  {vehicle.mileage?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Chi phí tổng</p>
                <p className="text-2xl font-bold text-accent">
                  {totalSpent.toLocaleString()}đ
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nhắc nhở</p>
                <p className="text-2xl font-bold text-primary">
                  {activeReminders.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lubricant Recommendation */}
        <LubricantRecommendation vehicle={vehicle} />

        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Lịch bảo dưỡng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {vehicle.maintenanceSchedule.oilChange && (
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Thay dầu động cơ</p>
                  <p className="text-sm text-muted-foreground">
                    Mỗi{" "}
                    {vehicle.maintenanceSchedule.oilChange.intervalKm.toLocaleString()}{" "}
                    km
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Lần cuối</p>
                  <p className="font-medium">
                    {vehicle.maintenanceSchedule.oilChange.lastServiceKm.toLocaleString()}{" "}
                    km
                  </p>
                </div>
              </div>
            )}

            {vehicle.maintenanceSchedule.coolant && (
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Thay nước làm mát</p>
                  <p className="text-sm text-muted-foreground">
                    Mỗi{" "}
                    {vehicle.maintenanceSchedule.coolant.intervalKm.toLocaleString()}{" "}
                    km
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Lần cuối</p>
                  <p className="font-medium">
                    {vehicle.maintenanceSchedule.coolant.lastServiceKm.toLocaleString()}{" "}
                    km
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Lịch sử chi phí
              </CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href={`/trip/new?vehicleId=${vehicle.id}`}>Thêm mới</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {trips.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có chi phí nào
              </p>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 5).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {trip.description || trip.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trip.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <p className="font-semibold text-accent">
                      {trip.amount.toLocaleString()}đ
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Reminders */}
        {activeReminders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Nhắc nhở đang chờ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-start justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{reminder.message}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Đến hạn:{" "}
                        {new Date(reminder.dueDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <Badge className="bg-warning text-white">
                      {reminder.status === "sent" ? "Đã gửi" : "Chờ"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
