import { Request } from 'express';

export interface AdminRole {
  type: string;
  permissions: { can: string }[];
}

export interface AdminData {
  id: number;
  name: string;
  email: string;
  roles: AdminRole[];
}

export interface AdminFormattedObject {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface RequestInteface extends Request {
  admin: AdminFormattedObject;
}

export interface BeforeQueryParamsInterface {
  page: string;
  itemsPerPage: string;
  getAll: string;
  searchText?: string;
  startDate?: string;
  endDate?: string;
  sort?: 'asc' | 'desc' | 'latest' | 'earliest';
  roleType?: string | number;
}
export interface AfterQueryParamsInterface {
  page: number;
  itemsPerPage: number;
  getAll: boolean;
  searchText?: string;
  startDate?: Date;
  endDate?: Date;
  sort?: 'asc' | 'desc' | 'latest' | 'earliest';
  roleType?: string | number;
}

export interface PaginationResult {
  items: any[];
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  totalItems: number;
}
