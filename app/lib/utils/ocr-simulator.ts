// Simulated OCR functionality
import type { OCRData } from "../types"

export function simulateOCR(receiptUrl: string): OCRData {
  // Simulate OCR processing with random realistic data
  const vendors = ["Cửa hàng Phụ tùng Minh", "Garage Hoàng Long", "Trung tâm bảo dưỡng ABC", "Cửa hàng dầu nhớt XYZ"]
  const items = [
    { name: "Dầu nhớt Castrol 10W-40", quantity: 1, price: 180000 },
    { name: "Lọc dầu", quantity: 1, price: 50000 },
    { name: "Công thay dầu", quantity: 1, price: 30000 },
    { name: "Kiểm tra tổng quát", quantity: 1, price: 0 },
  ]

  const selectedItems = items.slice(0, Math.floor(Math.random() * 2) + 2)
  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    vendor: vendors[Math.floor(Math.random() * vendors.length)],
    date: new Date().toISOString().split("T")[0],
    items: selectedItems,
    total,
  }
}
