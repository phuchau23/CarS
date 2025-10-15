"use client";

import { getBrandById } from "@/app/lib/vehicle-brands";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Badge } from "../ui/badge";

interface ModelSelectorProps {
  brandId: string;
  vehicleType: string;
  selected?: string;
  onSelect: (modelId: string) => void;
}

export function ModelSelector({
  brandId,
  vehicleType,
  selected,
  onSelect,
}: ModelSelectorProps) {
  const brand = getBrandById(brandId);
  const models = brand?.models.filter((m) => m.type === vehicleType) || [];

  if (models.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Không có mẫu xe phù hợp
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => {
        const isSelected = selected === model.id;

        return (
          <Card
            key={model.id}
            className={cn(
              "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-xl border-2 overflow-hidden",
              isSelected
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSelect(model.id)}
          >
            <div className="relative aspect-[4/3] bg-secondary/30">
              <img
                src={model.photo || "/placeholder.svg"}
                alt={model.name}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Check className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{model.name}</h3>
                <Badge variant="secondary">{model.year}</Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
