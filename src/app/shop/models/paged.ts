export interface Paged<T>{
  referenceAction: string;
  list: Array<T>;
  pageIndex: number;
  pageSize: number;
  query: string;
  totalResults: number;
  TotalPages: number;
}
