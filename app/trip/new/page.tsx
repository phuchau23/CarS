"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Vehicle } from "@/app/lib/types";
import { getDatabase } from "@/app/lib/db";
import { useApp } from "@/app/components/providers/app-provider";
import { TripForm, type TripFormData } from "@/app/components/trip/trip-form";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTripPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useApp();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const vehicleId = searchParams.get("vehicleId");

  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const userVehicles =
        currentUser.role === "manager" || currentUser.role === "admin"
          ? db.getVehicles()
          : db.getVehiclesByOwner(currentUser.id);
      setVehicles(userVehicles);
    }
  }, [currentUser]);

  const handleSubmit = (data: TripFormData) => {
    setIsSubmitting(true);

    try {
      const db = getDatabase();
      db.createTrip({
        vehicleId: data.vehicleId,
        driverId: currentUser?.id || "guest",
        type: data.type,
        amount: data.amount,
        description: data.description,
        receiptUrl: data.receiptUrl,
        ocrParsed: data.ocrParsed,
      });

      // Redirect back to vehicle detail or home
      if (vehicleId) {
        router.push(`/vehicle/${vehicleId}`);
      } else {
        router.push("/trips");
      }
    } catch (error) {
      console.error("Failed to create trip:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={vehicleId ? `/vehicle/${vehicleId}` : "/mobile/home"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Thêm chi phí mới</h1>
          <p className="text-muted-foreground mt-2">
            Ghi lại chi phí bảo dưỡng, nhiên liệu hoặc sửa chữa
          </p>
        </div>

        <TripForm
          vehicles={vehicles}
          selectedVehicleId={vehicleId || undefined}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
