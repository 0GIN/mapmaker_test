// Common types used throughout the application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Material-UI theme extensions
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      layout: {
        headerHeight: number;
        sidebarWidth: number;
      };
    };
  }

  interface ThemeOptions {
    custom?: {
      layout?: {
        headerHeight?: number;
        sidebarWidth?: number;
      };
    };
  }
}