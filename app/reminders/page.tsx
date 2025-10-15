"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/app/components/providers/app-provider";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { ReminderCard } from "@/app/components/reminders/reminder-card";
import { ArrowLeft, Bell, RefreshCw } from "lucide-react";
import Link from "next/link";
import { getDatabase } from "@/app/lib/db";
import { Reminder, Vehicle } from "@/app/lib/types";
import { checkAndCreateReminders } from "@/app/lib/reminder-generator";

export default function RemindersPage() {
  const { currentUser } = useApp();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = () => {
    if (!currentUser) return;

    const db = getDatabase();
    const userVehicles =
      currentUser.role === "manager" || currentUser.role === "admin"
        ? db.getVehicles()
        : db.getVehiclesByOwner(currentUser.id);

    setVehicles(userVehicles);

    const allReminders = userVehicles.flatMap((v) =>
      db.getRemindersByVehicle(v.id)
    );
    setReminders(
      allReminders.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
    );
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    checkAndCreateReminders();
    setTimeout(() => {
      loadData();
      setIsRefreshing(false);
    }, 500);
  };

  const getVehicleById = (vehicleId: string) =>
    vehicles.find((v) => v.id === vehicleId);

  const activeReminders = reminders.filter(
    (r) => r.status === "pending" || r.status === "sent"
  );
  const acknowledgedReminders = reminders.filter(
    (r) => r.status === "acknowledged"
  );
  const completedReminders = reminders.filter((r) => r.status === "completed");
  const dismissedReminders = reminders.filter((r) => r.status === "dismissed");

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
                <h1 className="text-2xl font-bold">Nhắc nhở</h1>
                <p className="text-sm text-muted-foreground">
                  {reminders.length} nhắc nhở
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">
                {activeReminders.length}
              </p>
              <p className="text-xs text-muted-foreground">Đang chờ</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {acknowledgedReminders.length}
              </p>
              <p className="text-xs text-muted-foreground">Đã xác nhận</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {completedReminders.length}
              </p>
              <p className="text-xs text-muted-foreground">Hoàn thành</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                {dismissedReminders.length}
              </p>
              <p className="text-xs text-muted-foreground">Đã bỏ qua</p>
            </CardContent>
          </Card>
        </div>

        {/* Reminders Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="active">
              Đang chờ
              {activeReminders.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-warning text-white text-xs rounded-full">
                  {activeReminders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="acknowledged">Đã xác nhận</TabsTrigger>
            <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
            <TabsTrigger value="dismissed">Đã bỏ qua</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeReminders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Không có nhắc nhở nào đang chờ
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  vehicle={getVehicleById(reminder.vehicleId)}
                  onUpdate={loadData}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="acknowledged" className="space-y-4">
            {acknowledgedReminders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Chưa có nhắc nhở nào được xác nhận
                  </p>
                </CardContent>
              </Card>
            ) : (
              acknowledgedReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  vehicle={getVehicleById(reminder.vehicleId)}
                  onUpdate={loadData}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedReminders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Chưa có nhắc nhở nào hoàn thành
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  vehicle={getVehicleById(reminder.vehicleId)}
                  onUpdate={loadData}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="dismissed" className="space-y-4">
            {dismissedReminders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Chưa có nhắc nhở nào bị bỏ qua
                  </p>
                </CardContent>
              </Card>
            ) : (
              dismissedReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  vehicle={getVehicleById(reminder.vehicleId)}
                  onUpdate={loadData}
                />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Về nhắc nhở tự động</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Hệ thống sẽ tự động tạo nhắc nhở dựa trên lịch bảo dưỡng của xe.
              Nhắc nhở sẽ được gửi qua Push Notification và Zalo (mô phỏng).
            </p>
            <p>
              Bạn có thể xác nhận, hoàn thành hoặc bỏ qua nhắc nhở bất kỳ lúc
              nào.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
