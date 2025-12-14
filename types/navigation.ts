export type SubItem = {
  title: string;
  url: string;
  Icon: React.ComponentType<{ active?: boolean; size?: string }>;
  isActive: boolean;
}

export type NavItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ active?: boolean; size?: string }>;
  isActive: boolean;
  items?: SubItem[];
}