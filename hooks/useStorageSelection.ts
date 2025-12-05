"use client";

import { useState, useCallback } from "react";

export function useStorageSelection() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const toggleItemSelection = useCallback((id: number) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      setIsSelecting(newSelection.length > 0);
      return newSelection;
    });
  }, []);

  const selectAll = useCallback((allIds: number[]) => {
    if (selectedItems.length === allIds.length) {
      setSelectedItems([]);
      setIsSelecting(false);
    } else {
      setSelectedItems(allIds);
      setIsSelecting(true);
    }
  }, [selectedItems.length]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setIsSelecting(false);
  }, []);

  return {
    selectedItems,
    isSelecting,
    toggleItemSelection,
    selectAll,
    clearSelection,
  };
}