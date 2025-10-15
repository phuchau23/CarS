// Rule-based lubricant recommendation system
import type { Vehicle } from "../types"

interface LubricantProduct {
  productName: string
  productType: string
  viscosity: string
  brand: string
  price: number
  reason: string
}

export function recommendLubricant(vehicle: Vehicle): LubricantProduct {
  const { vehicleType, year, make } = vehicle
  const currentYear = new Date().getFullYear()
  const vehicleAge = currentYear - year

  // Rule-based recommendations
  if (vehicleType === "motorbike") {
    if (vehicleAge <= 2) {
      return {
        productName: "Castrol Power1 4T 10W-40",
        productType: "Synthetic Blend",
        viscosity: "10W-40",
        brand: "Castrol",
        price: 180000,
        reason: "Xe mới, nên dùng dầu tổng hợp cao cấp để bảo vệ động cơ tốt nhất",
      }
    } else if (vehicleAge <= 5) {
      return {
        productName: "Motul 5100 4T 10W-40",
        productType: "Semi-Synthetic",
        viscosity: "10W-40",
        brand: "Motul",
        price: 150000,
        reason: "Xe từ 2-5 năm, dầu bán tổng hợp phù hợp và tiết kiệm",
      }
    } else {
      return {
        productName: "Shell Advance AX7 10W-40",
        productType: "Mineral",
        viscosity: "10W-40",
        brand: "Shell",
        price: 120000,
        reason: "Xe trên 5 năm, dầu khoáng chất lượng tốt, giá hợp lý",
      }
    }
  } else {
    // Car recommendations
    if (vehicleAge <= 3) {
      return {
        productName: "Castrol Edge 5W-30",
        productType: "Full Synthetic",
        viscosity: "5W-30",
        brand: "Castrol",
        price: 450000,
        reason: "Xe ô tô mới, dầu tổng hợp hoàn toàn bảo vệ động cơ tối ưu",
      }
    } else if (vehicleAge <= 7) {
      return {
        productName: "Shell Helix HX7 10W-40",
        productType: "Semi-Synthetic",
        viscosity: "10W-40",
        brand: "Shell",
        price: 350000,
        reason: "Xe từ 3-7 năm, dầu bán tổng hợp cân bằng giữa chất lượng và giá",
      }
    } else {
      return {
        productName: "Caltex Havoline 15W-40",
        productType: "Mineral",
        viscosity: "15W-40",
        brand: "Caltex",
        price: 280000,
        reason: "Xe trên 7 năm, dầu khoáng phù hợp với động cơ đã qua sử dụng",
      }
    }
  }
}
