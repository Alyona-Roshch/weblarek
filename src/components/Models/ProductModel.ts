import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохранение массива товаров в модель и инициация события изменения каталога
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit("items:changed", { items: this.items });
  }

  // Получение массива товаров из модели
  getItems(): IProduct[] {
    return this.items;
  }

  // Получение одного товара по его уникальному id
  getProduct(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  // Сохранение товара для подробного отображения и генерация события открытия карточки
  setPreview(item: IProduct | null): void {
    this.preview = item;
    this.events.emit("preview:changed", { item: this.preview });
  }

  // Получение товара для подробного отображения
  getPreview(): IProduct | null {
    return this.preview;
  }
}
