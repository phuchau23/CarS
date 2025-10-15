"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";
import { getBrandsByVehicleType } from "@/app/lib/vehicle-brands";
import { VehicleType } from "@/app/lib/types";

interface BrandSelectorProps {
  vehicleType: string;
  selected?: string;
  onSelect: (brandId: string) => void;
}

export function BrandSelector({
  vehicleType,
  selected,
  onSelect,
}: BrandSelectorProps) {
  const brands = getBrandsByVehicleType(vehicleType as VehicleType);

  if (brands.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Vui lòng chọn loại xe trước
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {brands.map((brand) => {
        const isSelected = selected === brand.id;

        return (
          <Card
            key={brand.id}
            className={cn(
              "cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2",
              isSelected
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSelect(brand.id)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-20 h-20 bg-secondary/50 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-semibold text-lg">{brand.name}</h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
