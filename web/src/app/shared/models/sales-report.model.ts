export interface SalesReportRow {
  userId: number;
  userName: string;
  email: string;
  productsSold: number;
  salesAmount: number;
  salaryAmount: number;
}

export interface SalesReportDetailRow {
  saleId: number;
  createdAt: string;
  productName: string;
  sellerName: string;
  quantity: number;
  salesAmount: number;
}
