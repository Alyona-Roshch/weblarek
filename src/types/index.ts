export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Новый именованный тип для способов оплаты по брифу проекта
export type TPaymentMethod = "card" | "cash";

export interface IBuyer {
  payment: TPaymentMethod | "";
  email: string;
  phone: string;
  address: string;
}

export type TFormErrors = Partial<Record<keyof IBuyer, string>>;

// Объект, который мы отправляем на сервер при покупке (данные покупателя + товары + сумма)
export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}

// Объект, который сервер возвращает при успешном оформлении заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Структура ответа сервера при GET-запросе списка товаров
export interface IProductResponse {
  total: number;
  items: IProduct[];
}
