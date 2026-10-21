import { IProduct } from "../../types";

export class ProductModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor() {}

  // Сохранение массива товаров в модель
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  // Получение массива товаров из модели
  getItems(): IProduct[] {
    return this.items;
  }

  // Получение одного товара по его уникальному id
  getProduct(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранение товара для подробного отображения
  setPreview(item: IProduct | null): void {
    this.preview = item;
  }

  // Получение товара для подробного отображения
  getPreview(): IProduct | null {
    return this.preview;
  }
}
