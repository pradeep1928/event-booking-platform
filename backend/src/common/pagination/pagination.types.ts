export interface PaginationResult<T> {
  items: T[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
