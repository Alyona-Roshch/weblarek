import { IProduct } from "../../types";

export class BasketModel {
  private items: IProduct[] = [];

  constructor() {}

  // Получение массива товаров, которые находятся в корзине в данный момент
  getItems(): IProduct[] {
    return this.items;
  }

  // Добавление товара в массив корзины
  add(item: IProduct): void {
    this.items.push(item);
  }

  // Удаление товара из массива корзины по его id
  remove(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  // Очистка корзины (полное удаление всех товаров)
  clear(): void {
    this.items = [];
  }

  // Получение стоимости всех товаров в корзине (расчет суммарной стоимости)
  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // Получение количества товаров в корзине (возвращает длину массива)
  getQuantity(): number {
    return this.items.length;
  }

  // Проверка наличия товара в корзине по его id
  checkItemInBasket(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
