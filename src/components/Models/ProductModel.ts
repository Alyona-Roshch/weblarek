import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductModel {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  // Принимаем брокер событий в конструктор
  constructor(protected events: IEvents) {}

  // Сохранение массива товаров в модель
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('items:changed'); // Сообщаем, что каталог обновился
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
    this.events.emit('preview:changed'); // Сообщаем, что выбран товар для просмотра
  }

  // Получение товара для подробного отображения
  getPreview(): IProduct | null {
    return this.preview;
  }
}
