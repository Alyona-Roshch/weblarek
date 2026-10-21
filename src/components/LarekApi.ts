import {
  IApi,
  IProduct,
  IOrder,
  IOrderResult,
  IProductResponse,
} from "../types";

export class LarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  // Делает GET-запрос
  getProductList(): Promise<IProductResponse> {
    return this._api
      .get<IProductResponse>("product/")
      .then((response) => response);
  }

  // Делает POST-запрос
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("order", order);
  }
}
