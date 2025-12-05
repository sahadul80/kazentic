"use client";

import { useState, useMemo, useCallback } from "react";
import { FilterType, SortConfig } from "@/types/storage";

export function useStorageFilters() {
  const [filters, setFilters] = useState<FilterType>({
    category: "all",
    lastModified: "all",
    dateAdded: "all",
    people: "all",
    search: "",
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const updateFilter = useCallback((key: keyof FilterType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      category: "all",
      lastModified: "all",
      dateAdded: "all",
      people: "all",
      search: "",
    });
    setSortConfig(null);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
      return { key, direction: "ascending" };
    });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.category !== "all" ||
      filters.lastModified !== "all" ||
      filters.dateAdded !== "all" ||
      filters.people !== "all" ||
      filters.search !== "" ||
      sortConfig !== null
    );
  }, [filters, sortConfig]);

  return {
    filters,
    sortConfig,
    updateFilter,
    clearFilters,
    handleSort,
    hasActiveFilters,
  };
}