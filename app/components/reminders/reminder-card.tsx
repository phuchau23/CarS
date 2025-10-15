"use client";

import { getDatabase } from "@/app/lib/db";
import { Reminder, Vehicle } from "@/app/lib/types";
import { Bell, Check, X, Calendar } from "lucide-react";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ReminderCardProps {
  reminder: Reminder;
  vehicle?: Vehicle;
  onUpdate?: () => void;
}

export function ReminderCard({
  reminder,
  vehicle,
  onUpdate,
}: ReminderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleAcknowledge = () => {
    setIsUpdating(true);
    const db = getDatabase();
    db.updateReminder(reminder.id, {
      status: "acknowledged",
      acknowledgedAt: new Date().toISOString(),
    });
    setTimeout(() => {
      setIsUpdating(false);
      onUpdate?.();
    }, 300);
  };

  const handleDismiss = () => {
    setIsUpdating(true);
    const db = getDatabase();
    db.updateReminder(reminder.id, {
      status: "dismissed",
    });
    setTimeout(() => {
      setIsUpdating(false);
      onUpdate?.();
    }, 300);
  };

  const handleComplete = () => {
    setIsUpdating(true);
    const db = getDatabase();
    db.updateReminder(reminder.id, {
      status: "completed",
    });
    setTimeout(() => {
      setIsUpdating(false);
      onUpdate?.();
    }, 300);
  };

  const getStatusBadge = () => {
    switch (reminder.status) {
      case "pending":
        return <Badge variant="secondary">Chờ gửi</Badge>;
      case "sent":
        return <Badge className="bg-warning text-white">Đã gửi</Badge>;
      case "acknowledged":
        return <Badge className="bg-primary text-white">Đã xác nhận</Badge>;
      case "completed":
        return <Badge className="bg-success text-white">Hoàn thành</Badge>;
      case "dismissed":
        return <Badge variant="outline">Đã bỏ qua</Badge>;
      default:
        return null;
    }
  };

  const daysUntilDue = Math.ceil(
    (new Date(reminder.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isOverdue = daysUntilDue < 0;
  const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;

  return (
    <Card
      className={`${
        isOverdue ? "border-destructive" : isUrgent ? "border-warning" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${
              isOverdue
                ? "bg-destructive/10"
                : isUrgent
                ? "bg-warning/10"
                : "bg-primary/10"
            }`}
          >
            <Bell
              className={`h-5 w-5 ${
                isOverdue
                  ? "text-destructive"
                  : isUrgent
                  ? "text-warning"
                  : "text-primary"
              }`}
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium">{reminder.message}</p>
                {vehicle && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
                  </p>
                )}
              </div>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {isOverdue
                  ? `Quá hạn ${Math.abs(daysUntilDue)} ngày`
                  : daysUntilDue === 0
                  ? "Hôm nay"
                  : `Còn ${daysUntilDue} ngày`}
              </span>
              <span>•</span>
              <span>
                {new Date(reminder.dueDate).toLocaleDateString("vi-VN")}
              </span>
            </div>

            {(reminder.status === "sent" || reminder.status === "pending") && (
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={handleAcknowledge}
                  disabled={isUpdating}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Xác nhận
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  disabled={isUpdating}
                >
                  <X className="h-4 w-4 mr-1" />
                  Bỏ qua
                </Button>
              </div>
            )}

            {reminder.status === "acknowledged" && (
              <Button
                size="sm"
                onClick={handleComplete}
                disabled={isUpdating}
                className="bg-success hover:bg-success/90 text-white"
              >
                <Check className="h-4 w-4 mr-1" />
                Đánh dấu hoàn thành
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
