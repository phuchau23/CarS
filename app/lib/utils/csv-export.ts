// CSV export utilities

import { Trip, Vehicle, Reminder } from "../types"



export interface ExportParams {
  startDate?: string
  endDate?: string
  vehicleIds?: string[]
  type?: string
}

export function generateTripsCSV(trips: Trip[], vehicles: Vehicle[]): string {
  const headers = ["Ngày", "Xe", "Biển số", "Loại", "Mô tả", "Số tiền (VNĐ)", "Có hóa đơn"]

  const rows = trips.map((trip) => {
    const vehicle = vehicles.find((v) => v.id === trip.vehicleId)
    return [
      new Date(trip.createdAt).toLocaleDateString("vi-VN"),
      vehicle ? `${vehicle.make} ${vehicle.model}` : "N/A",
      vehicle?.licensePlate || "N/A",
      trip.type === "maintenance"
        ? "Bảo dưỡng"
        : trip.type === "fuel"
          ? "Nhiên liệu"
          : trip.type === "repair"
            ? "Sửa chữa"
            : "Khác",
      trip.description || "",
      trip.amount.toString(),
      trip.receiptUrl ? "Có" : "Không",
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csvContent
}

export function generateVehiclesCSV(vehicles: Vehicle[], trips: Trip[]): string {
  const headers = ["Hãng", "Dòng xe", "Năm", "Biển số", "Loại xe", "Số km", "Tổng chi phí (VNĐ)", "Số lần bảo dưỡng"]

  const rows = vehicles.map((vehicle) => {
    const vehicleTrips = trips.filter((t) => t.vehicleId === vehicle.id)
    const totalCost = vehicleTrips.reduce((sum, t) => sum + t.amount, 0)
    const maintenanceCount = vehicleTrips.filter((t) => t.type === "maintenance").length

    return [
      vehicle.make,
      vehicle.model,
      vehicle.year.toString(),
      vehicle.licensePlate || "N/A",
      vehicle.vehicleType === "motorbike"
        ? "Xe máy"
        : vehicle.vehicleType === "car"
          ? "Ô tô"
          : vehicle.vehicleType === "truck"
            ? "Xe tải"
            : "Xe van",
      vehicle.mileage?.toString() || "0",
      totalCost.toString(),
      maintenanceCount.toString(),
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csvContent
}

export function generateRemindersCSV(reminders: Reminder[], vehicles: Vehicle[]): string {
  const headers = ["Xe", "Biển số", "Loại nhắc nhở", "Ngày đến hạn", "Trạng thái", "Tin nhắn"]

  const rows = reminders.map((reminder) => {
    const vehicle = vehicles.find((v) => v.id === reminder.vehicleId)
    return [
      vehicle ? `${vehicle.make} ${vehicle.model}` : "N/A",
      vehicle?.licensePlate || "N/A",
      reminder.type === "oil"
        ? "Thay dầu"
        : reminder.type === "coolant"
          ? "Nước làm mát"
          : reminder.type === "brakes"
            ? "Phanh"
            : reminder.type === "tires"
              ? "Lốp xe"
              : "Kiểm tra",
      new Date(reminder.dueDate).toLocaleDateString("vi-VN"),
      reminder.status === "pending"
        ? "Chờ"
        : reminder.status === "sent"
          ? "Đã gửi"
          : reminder.status === "acknowledged"
            ? "Đã xác nhận"
            : reminder.status === "completed"
              ? "Hoàn thành"
              : "Đã bỏ qua",
      reminder.message,
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  return csvContent
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
