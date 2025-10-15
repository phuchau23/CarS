import type { VehicleBrand, VehicleModel, VehicleType } from "./types";

// ================================
// 🚘 Danh sách thương hiệu & mẫu xe
// ================================

export const VEHICLE_BRANDS: VehicleBrand[] = [
  {
    id: "honda",
    name: "Honda",
    logo: "/honda-logo.png",
    vehicleTypes: ["motorbike", "car", "scooter"],
    models: [
      {
        id: "wave-alpha",
        name: "Wave Alpha",
        photo: "/honda-wave-alpha-motorcycle-red.jpg",
        year: 2024,
        type: "motorbike",
      },
      {
        id: "winner-x",
        name: "Winner X",
        photo: "/honda-winner-x-sport-motorcycle-black.jpg",
        year: 2024,
        type: "motorbike",
      },
      { id: "civic", name: "Civic", photo: "/honda-civic-sedan-silver.jpg", year: 2024, type: "car" },
      { id: "city", name: "City", photo: "/honda-city-sedan-white.jpg", year: 2024, type: "car" },
      { id: "crv", name: "CR-V", photo: "/honda-crv-suv-black.jpg", year: 2024, type: "car" },

      {
        id: "vision",
        name: "Vision",
        photo: "/honda-vision-scooter-white.jpg",
        year: 2024,
        type: "scooter",
      },
      {
        id: "sh150i",
        name: "SH 150i",
        photo: "/honda-sh150i-scooter-black.jpg",
        year: 2024,
        type: "scooter",
      },
    ],
  },
  {
    id: "yamaha",
    name: "Yamaha",
    logo: "/yamaha-logo.png",
    vehicleTypes: ["motorbike", "scooter"],
    models: [
      {
        id: "exciter-155",
        name: "Exciter 155",
        photo: "/yamaha-exciter-155-sport-motorcycle-blue.jpg",
        year: 2024,
        type: "motorbike",
      },
      { id: "sirius", name: "Sirius", photo: "/yamaha-sirius-motorcycle-black.jpg", year: 2024, type: "motorbike" },
      {
        id: "grande",
        name: "Grande",
        photo: "/yamaha-grande-scooter-blue.jpg",
        year: 2024,
        type: "scooter",
      },
      {
        id: "janus",
        name: "Janus",
        photo: "/yamaha-janus-scooter-white.jpg",
        year: 2024,
        type: "scooter",
      },
    ],
  },
  {
    id: "toyota",
    name: "Toyota",
    logo: "/toyota-logo.png",
    vehicleTypes: ["car", "truck"],
    models: [
      { id: "vios", name: "Vios", photo: "/toyota-vios-sedan-silver.jpg", year: 2024, type: "car" },
      { id: "camry", name: "Camry", photo: "/black-toyota-camry-sedan.png", year: 2024, type: "car" },
      { id: "fortuner", name: "Fortuner", photo: "/toyota-fortuner-suv-white.jpg", year: 2024, type: "car" },
      { id: "hilux", name: "Hilux", photo: "/toyota-hilux-pickup-truck-gray.jpg", year: 2024, type: "truck" },
    ],
  },
  {
    id: "suzuki",
    name: "Suzuki",
    logo: "/suzuki-logo.png",
    vehicleTypes: ["motorbike", "car"],
    models: [
      { id: "raider", name: "Raider", photo: "/suzuki-raider-motorcycle-red.jpg", year: 2024, type: "motorbike" },
      { id: "gsx-r150", name: "GSX-R150", photo: "/suzuki-gsx-r150-sport-bike.jpg", year: 2024, type: "motorbike" },
      { id: "ertiga", name: "Ertiga", photo: "/suzuki-ertiga-mpv.jpg", year: 2024, type: "car" },
    ],
  },
  {
    id: "mazda",
    name: "Mazda",
    logo: "/mazda-logo.jpg",
    vehicleTypes: ["car"],
    models: [
      { id: "mazda3", name: "Mazda3", photo: "/mazda3-sedan.jpg", year: 2024, type: "car" },
      { id: "cx5", name: "CX-5", photo: "/mazda-cx5-suv.jpg", year: 2024, type: "car" },
    ],
  },
  {
    id: "hyundai",
    name: "Hyundai",
    logo: "/hyundai-logo.jpg",
    vehicleTypes: ["car"],
    models: [
      { id: "accent", name: "Accent", photo: "/hyundai-accent-sedan.jpg", year: 2024, type: "car" },
      { id: "tucson", name: "Tucson", photo: "/hyundai-tucson-suv.jpg", year: 2024, type: "car" },
    ],
  },

  {
    id: "piaggio",
    name: "Piaggio",
    logo: "/piaggio-logo.png",
    vehicleTypes: ["scooter"],
    models: [
      {
        id: "liberty",
        name: "Liberty",
        photo: "/piaggio-liberty-scooter-white.jpg",
        year: 2024,
        type: "scooter",
      },
      {
        id: "medley",
        name: "Medley",
        photo: "/piaggio-medley-scooter-blue.jpg",
        year: 2024,
        type: "scooter",
      },
    ],
  },
  {
    id: "vespa",
    name: "Vespa",
    logo: "/vespa-logo.png",
    vehicleTypes: ["scooter"],
    models: [
      {
        id: "primavera",
        name: "Primavera",
        photo: "/vespa-primavera-scooter-yellow.jpg",
        year: 2024,
        type: "scooter",
      },
      {
        id: "sprint",
        name: "Sprint",
        photo: "/vespa-sprint-scooter-red.jpg",
        year: 2024,
        type: "scooter",
      },
    ],
  },
];

// ================================
// 🧭 Helper functions
// ================================

/** Lấy thông tin hãng xe theo ID */
export function getBrandById(brandId: string): VehicleBrand | undefined {
  return VEHICLE_BRANDS.find((brand) => brand.id === brandId);
}

/** Lấy model xe theo brand + model ID */
export function getModelById(brandId: string, modelId: string): VehicleModel | undefined {
  return getBrandById(brandId)?.models.find((model) => model.id === modelId);
}

/** Lọc danh sách hãng xe theo loại phương tiện (car, motorbike, v.v.) */
export function getBrandsByVehicleType(type: VehicleType): VehicleBrand[] {
  return VEHICLE_BRANDS.filter((brand) => brand.vehicleTypes.includes(type));
}
