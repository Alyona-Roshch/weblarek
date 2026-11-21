export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: 'POST' | 'PUT' | 'DELETE'): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export type TPayment = 'card' | 'cash' | '';

export interface IBuyer {
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
}

export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

export interface IOrderResult {
  id: string;
  total: number;
}