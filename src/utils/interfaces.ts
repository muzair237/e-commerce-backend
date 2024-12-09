export interface QueryParamsInterface {
  page: number;
  itemsPerPage: number;
  getAll: boolean;
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
