"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Bell, Menu } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/app/components/providers/app-provider";
import { Reminder, Vehicle } from "@/app/lib/types";
import { getDatabase } from "@/app/lib/db";
import { NotificationSimulator } from "@/app/components/reminders/notification-simulator";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { VehicleCard } from "@/app/components/vehicle/vehicle-card";

export default function MobileHomePage() {
  const router = useRouter();
  const { currentUser, loginGuest } = useApp();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<{
    reminder: Reminder;
    vehicle?: Vehicle;
  } | null>(null);

  useEffect(() => {
    if (!currentUser) {
      loginGuest();
    }
  }, [currentUser, loginGuest]);

  useEffect(() => {
    if (currentUser) {
      loadData();
      // Simulate notification for first pending reminder
      setTimeout(() => {
        const db = getDatabase();
        const userVehicles =
          currentUser.role === "manager" || currentUser.role === "admin"
            ? db.getVehicles()
            : db.getVehiclesByOwner(currentUser.id);

        const allReminders = userVehicles.flatMap((v) => db.getRemindersByVehicle(v.id));
        const pendingReminder = allReminders.find((r) => r.status === "pending" || r.status === "sent");

        if (pendingReminder) {
          const vehicle = userVehicles.find((v) => v.id === pendingReminder.vehicleId);
          setCurrentNotification({ reminder: pendingReminder, vehicle });
          setShowNotification(true);
        }
      }, 2000);
    }
  }, [currentUser]);

  const loadData = () => {
    if (!currentUser) return;

    const db = getDatabase();
    const userVehicles =
      currentUser.role === "manager" || currentUser.role === "admin"
        ? db.getVehicles()
        : db.getVehiclesByOwner(currentUser.id);

    setVehicles(userVehicles);

    const allReminders = userVehicles.flatMap((v) => db.getRemindersByVehicle(v.id));
    setReminders(allReminders.filter((r) => r.status === "pending" || r.status === "sent"));
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa xe này?")) {
      const db = getDatabase();
      db.deleteVehicle(id);
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  const handleNotificationAcknowledge = () => {
    if (currentNotification) {
      const db = getDatabase();
      db.updateReminder(currentNotification.reminder.id, {
        status: "acknowledged",
        acknowledgedAt: new Date().toISOString(),
      });
      setShowNotification(false);
      loadData();
    }
  };

  const handleNotificationDismiss = () => {
    setShowNotification(false);
  };

  const upcomingReminders = reminders
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Simulated Notification */}
      {showNotification && currentNotification && (
        <NotificationSimulator
          reminder={currentNotification.reminder}
          vehicle={currentNotification.vehicle}
          onAcknowledge={handleNotificationAcknowledge}
          onDismiss={handleNotificationDismiss}
        />
      )}

      {/* Header */}
      <div
        className="relative text-primary-foreground bg-no-repeat bg-center bg-cover w-full"
        style={{
          backgroundImage: "url('/header-bg.png')",
          height: "280px", // chỉnh chiều cao khớp ảnh
          backgroundSize: "100% auto", // phủ ngang toàn khung, không bóp méo
        }}
      >
        {/* Lớp phủ để chữ dễ đọc hơn, có thể chỉnh opacity hoặc bỏ nếu không cần */}
        <div className="bg-black/40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Xe Của Bạn</h1>
                <p className="text-primary-foreground/80 text-sm">Xin chào, {currentUser?.name || "Guest"}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10 relative"
                  asChild
                >
                  <Link href="/reminders">
                    <Bell className="h-5 w-5" />
                    {reminders.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                        {reminders.length}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link href="/manager/dashboard">
                    <Menu className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-primary-foreground/30 border-primary-foreground/20">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary-foreground">{vehicles.length}</p>
                  <p className="text-m text-primary-foreground/100">Xe</p>
                </CardContent>
              </Card>
              <Card className="bg-primary-foreground/30 border-primary-foreground/20">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary-foreground">{reminders.length}</p>
                  <p className="text-m text-primary-foreground/100">Nhắc nhở</p>
                </CardContent>
              </Card>
              <Card className="bg-primary-foreground/30 border-primary-foreground/20">
                <CardContent className="p-4 text-center">
                  Quản lý đội xe
                  <p className="text-3xl font-bold text-primary-foreground">
                    {vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-m text-primary-foreground/100">Tổng km</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-warning" />
                  Nhắc nhở sắp tới
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/reminders">Xem tất cả</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingReminders.map((reminder) => {
                const vehicle = vehicles.find((v) => v.id === reminder.vehicleId);
                return (
                  <div
                    key={reminder.id}
                    className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{reminder.message}</p>
                      {vehicle && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {vehicle.make} {vehicle.model} • {new Date(reminder.dueDate).toLocaleDateString("vi-VN")}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-warning text-white text-xs">
                      {Math.ceil((new Date(reminder.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Vehicles List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Xe của tôi</h2>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href="/vehicle/add">
                <Plus className="h-4 w-4 mr-2" />
                Thêm xe
              </Link>
            </Button>
          </div>

          {vehicles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">Bạn chưa có xe nào</p>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/vehicle/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm xe đầu tiên
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onDelete={handleDeleteVehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
