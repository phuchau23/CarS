"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Vehicle, OCRData, TripType } from "@/app/lib/types";
import { simulateOCR } from "@/app/lib/utils/ocr-simulator";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// ======================
// 🎯 Interface Definitions
// ======================

interface TripFormProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  onSubmit: (data: TripFormData) => void;
  onCancel?: () => void;
}

export interface TripFormData {
  vehicleId: string;
  type: TripType;
  amount: number;
  description: string;
  receiptUrl?: string;
  ocrParsed?: OCRData;
}

// ======================
// 🧾 Component
// ======================

export function TripForm({
  vehicles,
  selectedVehicleId,
  onSubmit,
  onCancel,
}: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    vehicleId: selectedVehicleId || "",
    type: "maintenance",
    amount: 0,
    description: "",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setReceiptPreview(result);

        // Simulate OCR
        setIsProcessingOCR(true);
        setTimeout(() => {
          const ocr = simulateOCR(result) as OCRData;
          setOcrResult(ocr);
          setFormData((prev) => ({
            ...prev,
            amount: ocr.total ?? prev.amount,
            description: ocr.vendor ?? prev.description,
            receiptUrl: result,
            ocrParsed: ocr,
          }));
          setIsProcessingOCR(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setOcrResult(null);
    setFormData((prev) => ({
      ...prev,
      receiptUrl: undefined,
      ocrParsed: undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleId) {
      alert("Vui lòng chọn xe");
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin chi phí */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chi phí</CardTitle>
          <CardDescription>
            Nhập thông tin về chi phí hoặc tải lên hóa đơn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Xe */}
          <div className="space-y-2">
            <Label htmlFor="vehicle">Xe *</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) =>
                setFormData({ ...formData, vehicleId: value })
              }
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Chọn xe" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loại chi phí */}
          <div className="space-y-2">
            <Label htmlFor="type">Loại chi phí *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: TripType) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Chọn loại chi phí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance">Bảo dưỡng</SelectItem>
                <SelectItem value="fuel">Nhiên liệu</SelectItem>
                <SelectItem value="repair">Sửa chữa</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Số tiền */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (VNĐ) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number.parseInt(e.target.value) || 0,
                })
              }
              min={0}
              required
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Thay dầu, rửa xe, sửa phanh..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload hóa đơn */}
      <Card>
        <CardHeader>
          <CardTitle>Hóa đơn / Biên lai</CardTitle>
          <CardDescription>
            Tải lên ảnh hóa đơn để tự động trích xuất thông tin (OCR mô phỏng)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!receiptPreview ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                id="receipt"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label htmlFor="receipt" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Tải lên hóa đơn</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG lên đến 10MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Chọn ảnh
                  </Button>
                </div>
              </Label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Ảnh preview */}
              <div className="relative">
                <img
                  src={receiptPreview || "/placeholder.svg"}
                  alt="Receipt preview"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveReceipt}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Trạng thái OCR */}
              {isProcessingOCR && (
                <div className="flex items-center justify-center gap-2 p-4 bg-primary/10 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-sm font-medium">Đang xử lý OCR...</p>
                </div>
              )}

              {/* Kết quả OCR */}
              {ocrResult && !isProcessingOCR && (
                <div className="p-4 bg-success/10 border border-success/20 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-success" />
                    <p className="font-medium text-success">
                      Đã trích xuất thông tin
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    {ocrResult.vendor && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cửa hàng:</span>
                        <span className="font-medium">{ocrResult.vendor}</span>
                      </div>
                    )}
                    {ocrResult.date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày:</span>
                        <span className="font-medium">{ocrResult.date}</span>
                      </div>
                    )}
                    {ocrResult.total && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Tổng tiền:
                        </span>
                        <span className="font-medium text-accent">
                          {ocrResult.total.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                  </div>

                  {ocrResult.items && ocrResult.items.length > 0 && (
                    <div className="pt-2 border-t space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        Các mục:
                      </p>
                      {ocrResult.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-xs"
                        >
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>{item.price.toLocaleString()}đ</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nút hành động */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          disabled={isProcessingOCR}
        >
          Lưu chi phí
        </Button>
      </div>
    </form>
  );
}
