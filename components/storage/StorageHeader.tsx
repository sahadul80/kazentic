import { StorageHeader as OriginalStorageHeader } from "./Header";

interface StorageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  title?: string;
  showBreadcrumb?: boolean;
}

export function StorageHeader({
  searchQuery,
  onSearchChange,
  title = "Storage",
  showBreadcrumb = true,
}: StorageHeaderProps) {
  if (showBreadcrumb) {
    return <OriginalStorageHeader searchQuery={searchQuery} onSearchChange={onSearchChange} />;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="relative w-64">
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