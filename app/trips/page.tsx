"use client";

import { useEffect, useState } from "react";
import type { Trip, Vehicle } from "@/app/lib/types";
import { getDatabase } from "@/app/lib/db";
import { useApp } from "@/app/components/providers/app-provider";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { TripCard } from "@/app/components/trip/trip-card";
import { ArrowLeft, Plus, Receipt } from "lucide-react";
import Link from "next/link";

export default function TripsPage() {
  const { currentUser } = useApp();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const loadData = () => {
    if (!currentUser) return;

    const db = getDatabase();
    const userVehicles =
      currentUser.role === "manager" || currentUser.role === "admin"
        ? db.getVehicles()
        : db.getVehiclesByOwner(currentUser.id);

    setVehicles(userVehicles);

    const vehicleIds = userVehicles.map((v) => v.id);
    const allTrips = db
      .getTrips()
      .filter((t) => vehicleIds.includes(t.vehicleId));
    setTrips(
      allTrips.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    );
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const handleDeleteTrip = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa chi phí này?")) {
      // In a real app, we'd have a delete method in the database
      // For now, we'll just reload
      loadData();
    }
  };

  const getVehicleById = (vehicleId: string) =>
    vehicles.find((v) => v.id === vehicleId);

  const maintenanceTrips = trips.filter((t) => t.type === "maintenance");
  const fuelTrips = trips.filter((t) => t.type === "fuel");
  const repairTrips = trips.filter((t) => t.type === "repair");
  const otherTrips = trips.filter((t) => t.type === "other");

  const totalSpent = trips.reduce((sum, trip) => sum + trip.amount, 0);
  const avgPerTrip = trips.length > 0 ? totalSpent / trips.length : 0;

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
                <h1 className="text-2xl font-bold">Chi phí</h1>
                <p className="text-sm text-muted-foreground">
                  {trips.length} giao dịch
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90">
              <Link href="/trip/new">
                <Plus className="h-4 w-4 mr-2" />
                Thêm mới
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">
                {totalSpent.toLocaleString()}đ
              </p>
              <p className="text-xs text-muted-foreground">Tổng chi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{trips.length}</p>
              <p className="text-xs text-muted-foreground">Giao dịch</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">
                {avgPerTrip.toLocaleString()}đ
              </p>
              <p className="text-xs text-muted-foreground">TB/giao dịch</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">
                {trips.filter((t) => t.receiptUrl).length}
              </p>
              <p className="text-xs text-muted-foreground">Có hóa đơn</p>
            </CardContent>
          </Card>
        </div>

        {/* Trips Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="maintenance">Bảo dưỡng</TabsTrigger>
            <TabsTrigger value="fuel">Nhiên liệu</TabsTrigger>
            <TabsTrigger value="repair">Sửa chữa</TabsTrigger>
            <TabsTrigger value="other">Khác</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {trips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Chưa có chi phí nào
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/trip/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm chi phí đầu tiên
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  vehicle={getVehicleById(trip.vehicleId)}
                  onDelete={handleDeleteTrip}
                  showVehicle
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            {maintenanceTrips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Chưa có chi phí bảo dưỡng
                  </p>
                </CardContent>
              </Card>
            ) : (
              maintenanceTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  vehicle={getVehicleById(trip.vehicleId)}
                  onDelete={handleDeleteTrip}
                  showVehicle
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="fuel" className="space-y-4">
            {fuelTrips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Chưa có chi phí nhiên liệu
                  </p>
                </CardContent>
              </Card>
            ) : (
              fuelTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  vehicle={getVehicleById(trip.vehicleId)}
                  onDelete={handleDeleteTrip}
                  showVehicle
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="repair" className="space-y-4">
            {repairTrips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Chưa có chi phí sửa chữa
                  </p>
                </CardContent>
              </Card>
            ) : (
              repairTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  vehicle={getVehicleById(trip.vehicleId)}
                  onDelete={handleDeleteTrip}
                  showVehicle
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            {otherTrips.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Chưa có chi phí khác</p>
                </CardContent>
              </Card>
            ) : (
              otherTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  vehicle={getVehicleById(trip.vehicleId)}
                  onDelete={handleDeleteTrip}
                  showVehicle
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
