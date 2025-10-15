// Automatic reminder generation based on maintenance schedules
import { getDatabase } from "./db"
import { Vehicle } from "./types"
import { Reminder } from "./types"

export function generateRemindersForVehicle(vehicle: Vehicle): Reminder[] {
  const reminders: Reminder[] = []
  const now = new Date()
  const { maintenanceSchedule, mileage = 0 } = vehicle

  // Oil change reminder
  if (maintenanceSchedule.oilChange) {
    const { intervalKm, lastServiceKm } = maintenanceSchedule.oilChange
    const kmUntilService = intervalKm - (mileage - lastServiceKm)

    if (kmUntilService <= 500 && kmUntilService > 0) {
      const daysUntil = Math.ceil(kmUntilService / 30) // Assume 30km/day average
      const dueDate = new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000)

      reminders.push({
        id: "",
        vehicleId: vehicle.id,
        type: "oil",
        dueDate: dueDate.toISOString(),
        status: "pending",
        message: `Sắp đến lịch thay dầu cho ${vehicle.make} ${vehicle.model} (còn ${kmUntilService}km)`,
      })
    }
  }

  // Coolant reminder
  if (maintenanceSchedule.coolant) {
    const { intervalKm, lastServiceKm } = maintenanceSchedule.coolant
    const kmUntilService = intervalKm - (mileage - lastServiceKm)

    if (kmUntilService <= 2000 && kmUntilService > 0) {
      const daysUntil = Math.ceil(kmUntilService / 30)
      const dueDate = new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000)

      reminders.push({
        id: "",
        vehicleId: vehicle.id,
        type: "coolant",
        dueDate: dueDate.toISOString(),
        status: "pending",
        message: `Sắp đến lịch thay nước làm mát cho ${vehicle.make} ${vehicle.model} (còn ${kmUntilService}km)`,
      })
    }
  }

  return reminders
}

export function checkAndCreateReminders(): void {
  const db = getDatabase()
  const vehicles = db.getVehicles()

  vehicles.forEach((vehicle) => {
    const newReminders = generateRemindersForVehicle(vehicle)
    const existingReminders = db.getRemindersByVehicle(vehicle.id)

    newReminders.forEach((reminder) => {
      // Check if similar reminder already exists
      const exists = existingReminders.some(
        (existing) =>
          existing.type === reminder.type && existing.status !== "completed" && existing.status !== "dismissed",
      )

      if (!exists) {
        db.createReminder(reminder)
      }
    })
  })
}
