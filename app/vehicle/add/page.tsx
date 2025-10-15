"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getDatabase } from "@/app/lib/db";
import { useApp } from "@/app/components/providers/app-provider";
import { VehicleTypeSelector } from "@/app/components/vehicle/vehicle-type-selector";
import { BrandSelector } from "@/app/components/vehicle/brand-selector";
import { ModelSelector } from "@/app/components/vehicle/model-selector";
import { VehicleDetailsForm } from "@/app/components/vehicle/vehicle-details-form";
import { Card, CardContent } from "@/app/components/ui/card";
import { getBrandById, getModelById } from "@/app/lib/vehicle-brands";
import { VehicleType } from "@/app/lib/types";

interface VehicleDetailsFormData {
  licensePlate?: string;
  color?: string;
  engineSize?: string;
  mileage?: number;
}

export default function AddVehiclePage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [step, setStep] = useState(1);
  const [vehicleType, setVehicleType] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");

  const handleTypeSelect = (type: string) => {
    setVehicleType(type);
    setBrandId("");
    setModelId("");
    setStep(2);
  };

  const handleBrandSelect = (brand: string) => {
    setBrandId(brand);
    setModelId("");
    setStep(3);
  };

  const handleModelSelect = (model: string) => {
    setModelId(model);
    setStep(4);
  };

  const handleDetailsSubmit = (details: VehicleDetailsFormData) => {
    try {
      const db = getDatabase();
      const brand = getBrandById(brandId);
      const model = getModelById(brandId, modelId);

      if (!brand || !model) {
        console.error("Missing brand or model info");
        return;
      }

      const vehicle = db.createVehicle({
        ownerId: currentUser?.id || "guest",
        vehicleType: vehicleType as VehicleType,
        brand: brand?.name || "",
        make: brand?.name || "",
        model: model?.name || "",
        photo: model?.photo || "",
        year: model?.year || new Date().getFullYear(),
        maintenanceSchedule: {
          oilChange: {
            intervalKm: 0,
            lastServiceKm: 0,
            lastServiceDate: new Date().toISOString(),
          },
          coolant: {
            intervalKm: 0,
            lastServiceKm: 0,
            lastServiceDate: new Date().toISOString(),
          },
          brakes: {
            intervalKm: 0,
            lastServiceKm: 0,
            lastServiceDate: new Date().toISOString(),
          },
          tires: {
            intervalKm: 0,
            lastServiceKm: 0,
            lastServiceDate: new Date().toISOString(),
          },
        },
        ...details,
      });

      router.push(`/vehicle/${vehicle.id}`);
    } catch (error) {
      console.error("Failed to create vehicle:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mobile/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    s === step
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/50"
                      : s < step
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 mx-1 rounded-full transition-all ${
                      s < step ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              {step === 1 && "Chọn loại xe"}
              {step === 2 && "Chọn hãng xe"}
              {step === 3 && "Chọn mẫu xe"}
              {step === 4 && "Thông tin chi tiết"}
            </h1>
            <p className="text-muted-foreground">
              {step === 1 && "Xe máy, ô tô, xe tải hay xe tay ga?"}
              {step === 2 && "Hãng xe nào bạn đang sử dụng?"}
              {step === 3 && "Chọn mẫu xe phù hợp với xe của bạn"}
              {step === 4 && "Hoàn tất thông tin để bắt đầu quản lý"}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-6 md:p-8">
            {step === 1 && (
              <VehicleTypeSelector
                selected={vehicleType}
                onSelect={handleTypeSelect}
              />
            )}

            {step === 2 && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Đổi loại xe
                </Button>
                <BrandSelector
                  vehicleType={vehicleType}
                  selected={brandId}
                  onSelect={handleBrandSelect}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(2)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Đổi hãng xe
                </Button>
                <ModelSelector
                  brandId={brandId}
                  vehicleType={vehicleType}
                  selected={modelId}
                  onSelect={handleModelSelect}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(3)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Đổi mẫu xe
                </Button>
                <VehicleDetailsForm
                  vehicleType={vehicleType}
                  brandId={brandId}
                  modelId={modelId}
                  onSubmit={handleDetailsSubmit}
                  onCancel={() => router.back()}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
