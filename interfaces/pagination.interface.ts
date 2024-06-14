export interface IPagination {
  limit: number;
  skip: number;
  sort: {    
    _timestamp?: number;
    _utimestamp?: number;
    _id?: number;    
  };
}