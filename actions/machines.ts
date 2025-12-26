"use server";

import { machines } from "@/data/machines";
import { Machine } from "@/lib/types";

export interface SearchFilters {
  query?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  sortBy?: "price-asc" | "price-desc" | "rating" | "name";
}

export async function searchMachines(
  filters: SearchFilters = {}
): Promise<Machine[]> {
  let results = [...machines];

  // Filter by search query
  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase();
    results = results.filter(
      (machine) =>
        machine.name.toLowerCase().includes(query) ||
        machine.description.toLowerCase().includes(query) ||
        machine.manufacturer.toLowerCase().includes(query) ||
        machine.model.toLowerCase().includes(query) ||
        machine.category.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (filters.category && filters.category !== "all") {
    results = results.filter((machine) => machine.category === filters.category);
  }

  // Filter by location
  if (filters.location && filters.location !== "all") {
    results = results.filter((machine) => machine.location === filters.location);
  }

  // Filter by availability
  if (filters.available !== undefined) {
    results = results.filter((machine) => machine.available === filters.available);
  }

  // Filter by price range
  if (filters.minPrice !== undefined) {
    results = results.filter((machine) => machine.dailyRate >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    results = results.filter((machine) => machine.dailyRate <= filters.maxPrice!);
  }

  // Sort results
  switch (filters.sortBy) {
    case "price-asc":
      results.sort((a, b) => a.dailyRate - b.dailyRate);
      break;
    case "price-desc":
      results.sort((a, b) => b.dailyRate - a.dailyRate);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "name":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // Default: show available first, then by rating
      results.sort((a, b) => {
        if (a.available !== b.available) {
          return a.available ? -1 : 1;
        }
        return b.rating - a.rating;
      });
  }

  return results;
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const machine = machines.find((m) => m.id === id);
  return machine || null;
}

export async function getCategories(): Promise<string[]> {
  const categories = [...new Set(machines.map((m) => m.category))];
  return categories.sort();
}

export async function getLocations(): Promise<string[]> {
  const locations = [...new Set(machines.map((m) => m.location))];
  return locations.sort();
}

export async function getFeaturedMachines(): Promise<Machine[]> {
  return machines
    .filter((m) => m.available && m.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}
