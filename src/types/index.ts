export interface Student {
  [key: string]: any;
}

export interface Statistics {
  totalStudents: number;
  searchesToday: number;
}

export interface BTEBResult {
  // Define based on what the API returns
  [key: string]: any;
}
