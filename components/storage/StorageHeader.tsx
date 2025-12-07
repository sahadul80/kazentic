interface StorageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onUploadFile?: () => void;
  onUploadFolder?: () => void;
  onCreateFolder?: () => void;
  title?: string;
  showBreadcrumb?: boolean;
  showAddNew?: boolean;
}

export function StorageHeader({
  searchQuery,
  onSearchChange,
  onUploadFile,
  onUploadFolder,
  onCreateFolder,
  title = "Storage",
  showBreadcrumb = true,
}: StorageHeaderProps) {
  if (showBreadcrumb) {
    return (
      <StorageHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onUploadFile={onUploadFile}
        onUploadFolder={onUploadFolder}
        onCreateFolder={onCreateFolder}
      />
    );
  }

  return (
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              placeholder="Search items..."
              className="pl-4 pr-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <svg
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
  );
}