// In-memory database with localStorage persistence
import type { User, Vehicle, Trip, Reminder, Export, LubricantRecommendation } from "./types"

const STORAGE_KEYS = {
  USERS: "xecuaban_users",
  VEHICLES: "xecuaban_vehicles",
  TRIPS: "xecuaban_trips",
  REMINDERS: "xecuaban_reminders",
  EXPORTS: "xecuaban_exports",
  RECOMMENDATIONS: "xecuaban_recommendations",
  CURRENT_USER: "xecuaban_current_user",
}

// Helper functions for localStorage
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

// Database class
class Database {
  private users: User[] = []
  private vehicles: Vehicle[] = []
  private trips: Trip[] = []
  private reminders: Reminder[] = []
  private exports: Export[] = []
  private recommendations: LubricantRecommendation[] = []

  constructor() {
    this.loadFromStorage()
    if (this.users.length === 0) {
      this.seedData()
    }
  }

  private loadFromStorage() {
    this.users = getFromStorage(STORAGE_KEYS.USERS, [])
    this.vehicles = getFromStorage(STORAGE_KEYS.VEHICLES, [])
    this.trips = getFromStorage(STORAGE_KEYS.TRIPS, [])
    this.reminders = getFromStorage(STORAGE_KEYS.REMINDERS, [])
    this.exports = getFromStorage(STORAGE_KEYS.EXPORTS, [])
    this.recommendations = getFromStorage(STORAGE_KEYS.RECOMMENDATIONS, [])
  }

  private saveAll() {
    saveToStorage(STORAGE_KEYS.USERS, this.users)
    saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles)
    saveToStorage(STORAGE_KEYS.TRIPS, this.trips)
    saveToStorage(STORAGE_KEYS.REMINDERS, this.reminders)
    saveToStorage(STORAGE_KEYS.EXPORTS, this.exports)
    saveToStorage(STORAGE_KEYS.RECOMMENDATIONS, this.recommendations)
  }

  private seedData() {
    const now = new Date().toISOString()

    // Seed users
    this.users = [
      {
        id: "user-admin-1",
        name: "Admin User",
        role: "admin",
        phone: "+84901234567",
        email: "admin@xecuaban.vn",
        createdAt: now,
      },
      {
        id: "user-driver-1",
        name: "Mai Nguyen",
        role: "driver",
        phone: "+84912345678",
        email: "mai@example.com",
        createdAt: now,
      },
      {
        id: "user-driver-2",
        name: "Tuan Le",
        role: "driver",
        phone: "+84923456789",
        email: "tuan@example.com",
        createdAt: now,
      },
      {
        id: "user-manager-1",
        name: "Linh Tran",
        role: "manager",
        phone: "+84934567890",
        email: "linh@example.com",
        createdAt: now,
      },
    ]

    // Seed vehicles
    this.vehicles = [
  {
    id: "veh-1",
    ownerId: "user-driver-1",
    brand: "Honda", // ✅ thêm dòng này
    make: "Honda",
    model: "Wave Alpha",
    year: 2022,
    licensePlate: "29A1-12345",
    vehicleType: "motorbike",
    mileage: 15000,
    maintenanceSchedule: {
      oilChange: {
        intervalKm: 2000,
        lastServiceKm: 14000,
        lastServiceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "veh-2",
    ownerId: "user-driver-2",
    brand: "Toyota", // ✅ thêm dòng này
    make: "Toyota",
    model: "Vios",
    year: 2021,
    licensePlate: "30B2-67890",
    vehicleType: "car",
    mileage: 45000,
    maintenanceSchedule: {
      oilChange: {
        intervalKm: 5000,
        lastServiceKm: 42000,
        lastServiceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      coolant: {
        intervalKm: 40000,
        lastServiceKm: 40000,
        lastServiceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "veh-3",
    ownerId: "user-manager-1",
    brand: "Yamaha", // ✅ thêm dòng này
    make: "Yamaha",
    model: "Exciter 155",
    year: 2023,
    licensePlate: "29C3-11111",
    vehicleType: "motorbike",
    mileage: 8000,
    maintenanceSchedule: {
      oilChange: {
        intervalKm: 2000,
        lastServiceKm: 6000,
        lastServiceDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
    createdAt: now,
    updatedAt: now,
  },
]


    // Seed trips
    this.trips = [
      {
        id: "trip-1",
        vehicleId: "veh-1",
        driverId: "user-driver-1",
        type: "maintenance",
        amount: 150000,
        description: "Oil change service",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "trip-2",
        vehicleId: "veh-2",
        driverId: "user-driver-2",
        type: "fuel",
        amount: 500000,
        description: "Fuel refill",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Seed reminders
    this.reminders = [
      {
        id: "rem-1",
        vehicleId: "veh-1",
        type: "oil",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "sent",
        message: "Time for oil change - Wave Alpha",
        sentAt: now,
      },
      {
        id: "rem-2",
        vehicleId: "veh-2",
        type: "oil",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: "pending",
        message: "Upcoming oil change - Vios",
      },
    ]

    this.saveAll()
  }

  // User methods
  getUsers(): User[] {
    return [...this.users]
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    this.saveAll()
    return newUser
  }

  // Vehicle methods
  getVehicles(): Vehicle[] {
    return [...this.vehicles]
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.id === id)
  }

  getVehiclesByOwner(ownerId: string): Vehicle[] {
    return this.vehicles.filter((v) => v.ownerId === ownerId)
  }

  createVehicle(vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Vehicle {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.vehicles.push(newVehicle)
    this.saveAll()
    return newVehicle
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | undefined {
    const index = this.vehicles.findIndex((v) => v.id === id)
    if (index === -1) return undefined

    this.vehicles[index] = {
      ...this.vehicles[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    }
    this.saveAll()
    return this.vehicles[index]
  }

  deleteVehicle(id: string): boolean {
    const index = this.vehicles.findIndex((v) => v.id === id)
    if (index === -1) return false

    this.vehicles.splice(index, 1)
    this.saveAll()
    return true
  }

  // Trip methods
  getTrips(): Trip[] {
    return [...this.trips]
  }

  getTripsByVehicle(vehicleId: string): Trip[] {
    return this.trips.filter((t) => t.vehicleId === vehicleId)
  }

  getTripsByDriver(driverId: string): Trip[] {
    return this.trips.filter((t) => t.driverId === driverId)
  }

  createTrip(trip: Omit<Trip, "id" | "createdAt">): Trip {
    const newTrip: Trip = {
      ...trip,
      id: `trip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.trips.push(newTrip)
    this.saveAll()
    return newTrip
  }

  // Reminder methods
  getReminders(): Reminder[] {
    return [...this.reminders]
  }

  getRemindersByVehicle(vehicleId: string): Reminder[] {
    return this.reminders.filter((r) => r.vehicleId === vehicleId)
  }

  createReminder(reminder: Omit<Reminder, "id">): Reminder {
    const newReminder: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    this.reminders.push(newReminder)
    this.saveAll()
    return newReminder
  }

  updateReminder(id: string, updates: Partial<Reminder>): Reminder | undefined {
    const index = this.reminders.findIndex((r) => r.id === id)
    if (index === -1) return undefined

    this.reminders[index] = {
      ...this.reminders[index],
      ...updates,
      id,
    }
    this.saveAll()
    return this.reminders[index]
  }

  // Export methods
  createExport(exportData: Omit<Export, "id" | "createdAt">): Export {
    const newExport: Export = {
      ...exportData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.exports.push(newExport)
    this.saveAll()
    return newExport
  }

  getExports(): Export[] {
    return [...this.exports]
  }

  // Recommendation methods
  createRecommendation(rec: Omit<LubricantRecommendation, "id" | "createdAt">): LubricantRecommendation {
    const newRec: LubricantRecommendation = {
      ...rec,
      id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    this.recommendations.push(newRec)
    this.saveAll()
    return newRec
  }

  getRecommendationsByVehicle(vehicleId: string): LubricantRecommendation[] {
    return this.recommendations.filter((r) => r.vehicleId === vehicleId)
  }
}

// Singleton instance
let dbInstance: Database | null = null

export function getDatabase(): Database {
  if (!dbInstance) {
    dbInstance = new Database()
  }
  return dbInstance
}

// Current user management
export function getCurrentUser(): User | null {
  const userId = getFromStorage<string | null>(STORAGE_KEYS.CURRENT_USER, null)
  if (!userId) return null
  return getDatabase().getUserById(userId) || null
}

export function setCurrentUser(userId: string | null): void {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, userId)
}

export function loginAsGuest(): User {
  const db = getDatabase()
  let guest = db.getUsers().find((u) => u.role === "guest")

  if (!guest) {
    guest = db.createUser({
      name: "Guest User",
      role: "guest",
      phone: "",
    })
  }

  setCurrentUser(guest.id)
  return guest
}
