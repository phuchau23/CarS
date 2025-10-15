"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Bell, X, Smartphone } from "lucide-react";
import { Reminder, Vehicle } from "@/app/lib/types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface NotificationSimulatorProps {
  reminder: Reminder;
  vehicle?: Vehicle;
  onAcknowledge?: () => void;
  onDismiss?: () => void;
}

export function NotificationSimulator({
  reminder,
  vehicle,
  onAcknowledge,
  onDismiss,
}: NotificationSimulatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationType, setNotificationType] = useState<"push" | "zalo">(
    "push"
  );

  useEffect(() => {
    // Simulate notification appearing after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcknowledge = () => {
    setIsVisible(false);
    onAcknowledge?.();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5 max-w-sm">
      <Card className="shadow-lg border-primary">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {notificationType === "zalo" ? (
                <Smartphone className="h-5 w-5 text-primary" />
              ) : (
                <Bell className="h-5 w-5 text-primary" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm">Xe Của Bạn</p>
                    <Badge variant="secondary" className="text-xs">
                      {notificationType === "zalo" ? "Zalo" : "Push"}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{reminder.message}</p>
                  {vehicle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {vehicle.make} {vehicle.model}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleDismiss}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAcknowledge}
                  className="bg-primary hover:bg-primary/90 text-xs h-7"
                >
                  Xác nhận
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setNotificationType(
                      notificationType === "push" ? "zalo" : "push"
                    )
                  }
                  className="text-xs h-7"
                >
                  Chuyển sang {notificationType === "push" ? "Zalo" : "Push"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
