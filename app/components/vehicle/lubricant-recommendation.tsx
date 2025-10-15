"use client";

import { useState } from "react";

import { Droplet, Info, Sparkles } from "lucide-react";
import { recommendLubricant } from "@/app/lib/utils/lubriant-recommender";
import { Vehicle } from "@/app/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { getDatabase } from "@/app/lib/db";
interface LubricantRecommendationProps {
  vehicle: Vehicle;
}

export function LubricantRecommendation({
  vehicle,
}: LubricantRecommendationProps) {
  const [recommendation, setRecommendation] = useState<ReturnType<
    typeof recommendLubricant
  > | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendation = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const rec = recommendLubricant(vehicle);
      setRecommendation(rec);

      // Save to database
      const db = getDatabase();
      db.createRecommendation({
        vehicleId: vehicle.id,
        productName: rec.productName,
        productType: rec.productType,
        viscosity: rec.viscosity,
        brand: rec.brand,
        price: rec.price,
        reason: rec.reason,
      });

      setLoading(false);
    }, 800);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Gợi ý dầu nhớt
            </CardTitle>
            <CardDescription>Dựa trên thông tin xe của bạn</CardDescription>
          </div>
          <Button
            onClick={handleGetRecommendation}
            disabled={loading}
            size="sm"
            className="bg-accent hover:bg-accent/90"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {loading ? "Đang phân tích..." : "Nhận gợi ý"}
          </Button>
        </div>
      </CardHeader>

      {recommendation && (
        <CardContent className="space-y-4">
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-muted-foreground">
              Đây là gợi ý dựa trên quy tắc tự động. Vui lòng tham khảo ý kiến
              chuyên gia trước khi quyết định.
            </AlertDescription>
          </Alert>

          <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">
                  {recommendation.productName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {recommendation.brand}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg font-semibold">
                {recommendation.price.toLocaleString()}đ
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Loại:</span>
                <p className="font-medium">{recommendation.productType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Độ nhớt:</span>
                <p className="font-medium">{recommendation.viscosity}</p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Lý do:</span>{" "}
                {recommendation.reason}
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
