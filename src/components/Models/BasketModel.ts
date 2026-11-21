import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[] = [];

  // Принимаем брокер событий в конструктор
  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  add(item: IProduct): void {
    this.items.push(item);
    this.events.emit('basket:changed'); // Уведомляем об изменении корзины
  }

  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:changed'); // Уведомляем об изменении корзины
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed'); // Уведомляем об очистке корзины
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getQuantity(): number {
    return this.items.length;
  }

  checkItemInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
