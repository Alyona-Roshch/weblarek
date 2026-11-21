import {
  IApi,
  IOrder,
  IOrderResult,
  IProductResponse,
} from "../types";

export class LarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  getProductList(): Promise<IProductResponse> {
    return this._api.get<IProductResponse>("/product/");
  }

  createOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>("/order", order);
  }
}
