import type { UserDashboardViewDto } from "../../types";

// Placeholder — will be replaced by a React Query fetch
export const mockUser: UserDashboardViewDto = {
  id: "c5f5b510-6bbd-4a3d-b4b2-30f67d5c9133",
  name: "Jane Doe",
  email: "jane@email.com",
  birthDate: "1992-05-18T00:00:00.000Z",
  gender: "FEMALE",
  role: "USER",
  createdAt: "2025-01-01T12:00:00.000Z",
  updatedAt: "2025-01-01T12:00:00.000Z",
  isActive: true,
  ledgers: [
    {
      id: 1,
      name: "Home Budget 2025",
      description: "Tracks monthly family expenses and shared utilities.",
      currency: "ARS",
      baseCpiIndex: 253.6538,
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-02T00:00:00.000Z",
    },
    {
      id: 2,
      name: "Personal Savings",
      description: "Personal savings and dollar-cost averaging investments.",
      currency: "USD",
      baseCpiIndex: 310.4201,
      createdAt: "2025-03-01T00:00:00.000Z",
      updatedAt: "2025-03-15T00:00:00.000Z",
    },
    {
      id: 3,
      name: "Side Project Income",
      currency: "USD",
      baseCpiIndex: 314.175,
      createdAt: "2025-06-01T00:00:00.000Z",
      updatedAt: "2025-06-01T00:00:00.000Z",
    },
  ],
};
