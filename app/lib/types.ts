// ================================
// 🔐 User & Role
// ================================

/** Danh sách vai trò của người dùng trong hệ thống */
export type UserRole = "guest" | "driver" | "manager" | "admin";

/** Thông tin người dùng */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  createdAt: string;
}

// ================================
// 🚗 Vehicle & Maintenance
// ================================

/** Loại phương tiện được hỗ trợ */
export type VehicleType = "motorbike" | "car" | "truck" | "van" | "scooter";

/** Lịch bảo dưỡng của xe */
export interface MaintenanceSchedule {
  oilChange?: MaintenanceItem;
  coolant?: MaintenanceItem;
  brakes?: MaintenanceItem;
  tires?: MaintenanceItem;
}

/** Mục bảo dưỡng riêng lẻ (nhớ quãng đường & ngày gần nhất) */
export interface MaintenanceItem {
  intervalKm: number;
  lastServiceKm: number;
  lastServiceDate: string;
}

/** Thông tin phương tiện */
export interface Vehicle {
  id: string;
  ownerId: string;
  brand: string;
  make: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  licensePlate?: string;
  color?: string;
  photo?: string;
  engineSize?: string;
  mileage?: number;
  maintenanceSchedule: MaintenanceSchedule;
  createdAt: string;
  updatedAt: string;
}

// ================================
// 🧾 Trip & Expenses
// ================================

/** Loại chuyến đi hoặc chi phí phát sinh */
export type TripType = "maintenance" | "fuel" | "repair" | "other";

/** Dữ liệu chi tiết hóa đơn được OCR trích xuất */
export interface OCRData {
  vendor?: string;
  date?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total?: number;
}

/** Ghi nhận 1 chuyến đi hoặc chi phí */
export interface Trip {
  id: string;
  vehicleId: string;
  driverId: string;
  type: TripType;
  amount: number;
  description?: string;
  receiptUrl?: string;
  ocrParsed?: OCRData;
  createdAt: string;
}

// ================================
// ⏰ Reminder System
// ================================

/** Loại nhắc nhở */
export type ReminderType = "oil" | "coolant" | "brakes" | "tires" | "inspection";

/** Trạng thái nhắc nhở */
export type ReminderStatus = "pending" | "sent" | "acknowledged" | "completed" | "dismissed";

/** Thông tin nhắc nhở bảo dưỡng */
export interface Reminder {
  id: string;
  vehicleId: string;
  type: ReminderType;
  dueDate: string;
  status: ReminderStatus;
  message: string;
  sentAt?: string;
  acknowledgedAt?: string;
}

// ================================
// 📤 Export History
// ================================

/** Thông tin file xuất báo cáo */
export interface Export {
  id: string;
  managerId: string;
  fileUrl: string;
  params: {
    startDate?: string;
    endDate?: string;
    vehicleIds?: string[];
    type?: string;
  };
  createdAt: string;
}

// ================================
// 🛢️ Lubricant Recommendation
// ================================

/** Gợi ý dầu nhớt phù hợp cho xe */
export interface LubricantRecommendation {
  id: string;
  vehicleId: string;
  productName: string;
  productType: string;
  viscosity: string;
  brand: string;
  price: number;
  reason: string;
  createdAt: string;
}

// ================================
// 🏷️ Vehicle Brand & Model
// ================================

export interface VehicleModel {
  id: string;
  name: string;
  photo: string;
  year: number;
  type: VehicleType;
}

/** Hãng xe và danh sách model */
export interface VehicleBrand {
  id: string;
  name: string;
  logo: string;
  vehicleTypes: VehicleType[];
  models: VehicleModel[];
}
