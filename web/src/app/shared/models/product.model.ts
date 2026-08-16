export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  categoryId: number | null;
  userSalary: number | null;
  sortOrder: number;
}
