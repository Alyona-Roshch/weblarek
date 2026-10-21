import { IBuyer, TFormErrors } from "../../types";

export class BuyerModel {
  private payment: string = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  constructor() {}

  // Сохранение данных
  setField(field: keyof IBuyer, value: string): void {
    this[field] = value;
  }

  // Получение всех данных покупателя в виде единого объекта
  getBuyerData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  // Очистка данных покупателя
  clear(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  // Валидация данных.
  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment.trim()) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address.trim()) {
      errors.address = "Укажите адрес";
    }
    if (!this.email.trim()) {
      errors.email = "Укажите емэйл";
    }
    if (!this.phone.trim()) {
      errors.phone = "Укажите телефон";
    }

    return errors;
  }
}
