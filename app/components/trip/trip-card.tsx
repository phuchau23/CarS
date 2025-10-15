"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Fuel, Wrench, DollarSign, ImageIcon, Trash2 } from "lucide-react";
import { Trip, Vehicle } from "@/app/lib/types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface TripCardProps {
  trip: Trip;
  vehicle?: Vehicle;
  onDelete?: (id: string) => void;
  showVehicle?: boolean;
}

export function TripCard({
  trip,
  vehicle,
  onDelete,
  showVehicle = false,
}: TripCardProps) {
  const [showReceipt, setShowReceipt] = useState(false);

  const getTypeIcon = () => {
    switch (trip.type) {
      case "maintenance":
        return <Wrench className="h-5 w-5" />;
      case "fuel":
        return <Fuel className="h-5 w-5" />;
      case "repair":
        return <Wrench className="h-5 w-5" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getTypeBadge = () => {
    switch (trip.type) {
      case "maintenance":
        return <Badge variant="secondary">Bảo dưỡng</Badge>;
      case "fuel":
        return <Badge className="bg-warning text-white">Nhiên liệu</Badge>;
      case "repair":
        return <Badge className="bg-destructive text-white">Sửa chữa</Badge>;
      default:
        return <Badge variant="outline">Khác</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {getTypeIcon()}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium">{trip.description || trip.type}</p>
                {showVehicle && vehicle && (
                  <p className="text-sm text-muted-foreground">
                    {vehicle.make} {vehicle.model} • {vehicle.licensePlate}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(trip.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-accent">
                  {trip.amount.toLocaleString()}đ
                </p>
                {getTypeBadge()}
              </div>
            </div>

            {trip.receiptUrl && (
              <div className="pt-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReceipt(!showReceipt)}
                  className="w-full bg-transparent"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {showReceipt ? "Ẩn hóa đơn" : "Xem hóa đơn"}
                </Button>

                {showReceipt && (
                  <div className="space-y-3">
                    <img
                      src={trip.receiptUrl || "/placeholder.svg"}
                      alt="Receipt"
                      className="w-full h-48 object-cover rounded-lg border"
                    />

                    {trip.ocrParsed && (
                      <div className="p-3 bg-secondary/50 rounded-lg space-y-2 text-sm">
                        <p className="font-medium">Thông tin OCR:</p>
                        {trip.ocrParsed.vendor && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Cửa hàng:
                            </span>
                            <span>{trip.ocrParsed.vendor}</span>
                          </div>
                        )}
                        {trip.ocrParsed.date && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ngày:</span>
                            <span>{trip.ocrParsed.date}</span>
                          </div>
                        )}
                        {trip.ocrParsed.items &&
                          trip.ocrParsed.items.length > 0 && (
                            <div className="pt-2 border-t space-y-1">
                              {trip.ocrParsed.items.map(
                                (
                                  item: {
                                    name: string;
                                    quantity: number;
                                    price: number;
                                  },
                                  index: number
                                ) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-xs"
                                  >
                                    <span>
                                      {item.name} ×{item.quantity}
                                    </span>
                                    <span>{item.price.toLocaleString()}đ</span>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(trip.id)}
                className="w-full text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
