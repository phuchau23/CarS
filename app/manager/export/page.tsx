"use client";

import { useEffect, useState } from "react";

import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import { Export, Reminder, Trip, Vehicle } from "@/app/lib/types";
import { getDatabase } from "@/app/lib/db";
import {
  ExportForm,
  ExportFormData,
} from "@/app/components/export/export-form";
import {
  downloadCSV,
  generateRemindersCSV,
  generateTripsCSV,
  generateVehiclesCSV,
} from "@/app/lib/utils/csv-export";
import { Button } from "@/app/components/ui/button";
import { CostChart } from "@/app/components/analytics/cost-chart";
import { VehicleCostBreakdown } from "@/app/components/analytics/vehicle-cost-breakdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function ExportPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [exportHistory, setExportHistory] = useState<Export[]>([]);

  useEffect(() => {
    const db = getDatabase();
    setVehicles(db.getVehicles());
    setTrips(db.getTrips());
    setReminders(db.getReminders());
    setExportHistory(db.getExports());
  }, []);

  const handleExport = (params: ExportFormData) => {
    const db = getDatabase();

    // Filter data based on params
    let filteredTrips = trips;
    let filteredVehicles = vehicles;
    let filteredReminders = reminders;

    // Filter by date range
    if (params.startDate) {
      const startDate = new Date(params.startDate);
      filteredTrips = filteredTrips.filter(
        (t) => new Date(t.createdAt) >= startDate
      );
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      filteredTrips = filteredTrips.filter(
        (t) => new Date(t.createdAt) <= endDate
      );
    }

    // Filter by vehicles
    if (params.vehicleIds.length > 0) {
      filteredTrips = filteredTrips.filter((t) =>
        params.vehicleIds.includes(t.vehicleId)
      );
      filteredVehicles = filteredVehicles.filter((v) =>
        params.vehicleIds.includes(v.id)
      );
      filteredReminders = filteredReminders.filter((r) =>
        params.vehicleIds.includes(r.vehicleId)
      );
    }

    const timestamp = new Date().toISOString().split("T")[0];

    // Generate and download CSV
    if (params.exportType === "trips" || params.exportType === "all") {
      const csv = generateTripsCSV(filteredTrips, filteredVehicles);
      downloadCSV(csv, `chi-phi-${timestamp}.csv`);
    }

    if (params.exportType === "vehicles" || params.exportType === "all") {
      const csv = generateVehiclesCSV(filteredVehicles, filteredTrips);
      downloadCSV(csv, `danh-sach-xe-${timestamp}.csv`);
    }

    if (params.exportType === "reminders" || params.exportType === "all") {
      const csv = generateRemindersCSV(filteredReminders, filteredVehicles);
      downloadCSV(csv, `nhac-nho-${timestamp}.csv`);
    }

    // Save export record
    const exportRecord = db.createExport({
      managerId: "current-user",
      fileUrl: `export-${timestamp}.csv`,
      params: {
        startDate: params.startDate,
        endDate: params.endDate,
        vehicleIds: params.vehicleIds,
        type: params.exportType,
      },
    });

    setExportHistory([exportRecord, ...exportHistory]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/manager/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Báo cáo & Phân tích</h1>
              <p className="text-sm text-muted-foreground">
                Xuất dữ liệu và xem phân tích chi tiết
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CostChart trips={trips} />
          <VehicleCostBreakdown vehicles={vehicles} trips={trips} />
        </div>

        {/* Export Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExportForm vehicles={vehicles} onExport={handleExport} />
          </div>

          {/* Export History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Lịch sử xuất
              </CardTitle>
              <CardDescription>Các lần xuất gần đây</CardDescription>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  Chưa có lịch sử xuất
                </p>
              ) : (
                <div className="space-y-3">
                  {exportHistory.slice(0, 10).map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 bg-secondary/50 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {exp.params.type === "trips"
                              ? "Chi phí"
                              : exp.params.type === "vehicles"
                              ? "Danh sách xe"
                              : exp.params.type === "reminders"
                              ? "Nhắc nhở"
                              : "Tất cả"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(exp.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tổng chi phí</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {trips.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}đ
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {trips.length} giao dịch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chi phí TB/xe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {vehicles.length > 0
                  ? Math.round(
                      trips.reduce((sum, t) => sum + t.amount, 0) /
                        vehicles.length
                    ).toLocaleString()
                  : 0}
                đ
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {vehicles.length} xe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Chi phí bảo dưỡng</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">
                {trips
                  .filter((t) => t.type === "maintenance")
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()}
                đ
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {trips.filter((t) => t.type === "maintenance").length} lần
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
