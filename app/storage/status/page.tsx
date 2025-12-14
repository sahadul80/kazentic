// StatusPage.tsx
"use client";

import { useState } from "react";
import StorageStatusView from "@/components/storage/StorageStatusView";
import { FilterType } from "@/types/storage";

export default function StatusPage() {
  // Initialize filters state with all required properties
  const [filters, setFilters] = useState<FilterType>({
    category: "",
    lastModified: "",
    dateAdded: "",
    people: "",
    search: "",
    fileType: "",
    size: "",
  });

  // Handle search
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    console.log("Searching for:", query);
    // Implement actual search logic here
  };

  // Handle add new
  const handleAddNew = () => {
    console.log("Add new clicked");
    // Implement add new logic here
  };

  return (
    <div className="h-screen w-full">
      <StorageStatusView 
        filters={filters}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        showAddNewButton={false}
        showBreadcrumbs={true}
      />
    </div>
  );
}