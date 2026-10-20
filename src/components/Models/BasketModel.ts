import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class BasketModel {
  private items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Получение массива товаров, которые находятся в корзине в данный момент
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара, который был получен в параметре, в массив корзины
  add(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed", { items: this.items });
  }

  // Удаление товара, полученного в параметре, из массива корзины по его id
  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed", { items: this.items });
  }

  // Очистка корзины (полное удаление всех товаров)
  clear(): void {
    this.items = [];
    this.events.emit("basket:changed", { items: this.items });
  }

  // Получение стоимости всех товаров в корзине (расчет суммарной стоимости)
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // Получение количества товаров в корзине (возвращает длину массива)
  getQuantity(): number {
    return this.items.length;
  }

  // Проверка наличия товара в корзине по его id, полученного в параметр метода
  checkItemInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
