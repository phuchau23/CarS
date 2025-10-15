"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Car, Bike, Truck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleTypeSelectorProps {
  selected?: string;
  onSelect: (type: string) => void;
}

const VEHICLE_TYPES = [
  {
    id: "motorbike",
    name: "Xe máy",
    icon: Bike,
    description: "Xe máy số, xe côn tay",
  },
  {
    id: "scooter",
    name: "Xe tay ga",
    icon: Zap,
    description: "Xe tay ga, xe ga",
  },
  {
    id: "car",
    name: "Ô tô",
    icon: Car,
    description: "Sedan, SUV, MPV",
  },
  {
    id: "truck",
    name: "Xe tải",
    icon: Truck,
    description: "Xe bán tải, xe tải nhẹ",
  },
];

export function VehicleTypeSelector({
  selected,
  onSelect,
}: VehicleTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {VEHICLE_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.id;

        return (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2",
              isSelected
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSelect(type.id)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div
                className={cn(
                  "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{type.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {type.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
