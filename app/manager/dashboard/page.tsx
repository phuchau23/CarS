"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard, ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/app/components/providers/app-provider";
import { Reminder, Trip, User, Vehicle } from "@/app/lib/types";
import { getDatabase } from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { FleetStats } from "@/app/components/dashboard/fleet-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { MaintenanceOverview } from "@/app/components/dashboard/maintenance-overview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { VehicleTable } from "@/app/components/dashboard/vehicle-table";
import { DriverAssignment } from "@/app/components/dashboard/driver-assignment";

export default function ManagerDashboardPage() {
  const { currentUser } = useApp();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);

  const loadData = () => {
    const db = getDatabase();
    setVehicles(db.getVehicles());
    setTrips(db.getTrips());
    setReminders(db.getReminders());
    setDrivers(db.getUsers().filter((u) => u.role === "driver"));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/mobile/home">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  Quản lý đội xe
                </h1>
                <p className="text-sm text-muted-foreground">Tổng quan và quản lý toàn bộ đội xe</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/manager/export">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Fleet Stats */}
        <FleetStats vehicles={vehicles} trips={trips} reminders={reminders} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="vehicles">Danh sách xe</TabsTrigger>
            <TabsTrigger value="drivers">Tài xế</TabsTrigger>
            <TabsTrigger value="maintenance">Bảo dưỡng</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <MaintenanceOverview vehicles={vehicles} reminders={reminders} />

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>Chi phí và bảo dưỡng trong 30 ngày qua</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trips
                    .slice(0, 5)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((trip) => {
                      const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
                      return (
                        <div key={trip.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{trip.description || trip.type}</p>
                            {vehicle && (
                              <p className="text-xs text-muted-foreground">
                                {vehicle.make} {vehicle.model} • {new Date(trip.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-accent">{trip.amount.toLocaleString()}đ</p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh sách xe</CardTitle>
                    <CardDescription>{vehicles.length} xe trong đội</CardDescription>
                  </div>
                  <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                    <Link href="/vehicle/add">Thêm xe mới</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <VehicleTable vehicles={vehicles} trips={trips} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <DriverAssignment vehicles={vehicles} drivers={drivers} onUpdate={loadData} />
          </TabsContent>

          <TabsContent value="maintenance">
            <MaintenanceOverview vehicles={vehicles} reminders={reminders} />

            <Card>
              <CardHeader>
                <CardTitle>Lịch sử bảo dưỡng</CardTitle>
                <CardDescription>Tất cả các lần bảo dưỡng đã thực hiện</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trips
                    .filter((t) => t.type === "maintenance")
                    .slice(0, 10)
                    .map((trip) => {
                      const vehicle = vehicles.find((v) => v.id === trip.vehicleId);
                      return (
                        <div key={trip.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{trip.description || "Bảo dưỡng"}</p>
                            {vehicle && (
                              <p className="text-xs text-muted-foreground">
                                {vehicle.make} {vehicle.model} • {new Date(trip.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-accent">{trip.amount.toLocaleString()}đ</p>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
