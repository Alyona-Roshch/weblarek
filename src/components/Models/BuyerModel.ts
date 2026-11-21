import { IBuyer, TFormErrors, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: TPayment = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";

  // Принимаем брокер событий в конструктор
  constructor(protected events: IEvents) {}

  // Сохранение данных
  setField(field: keyof IBuyer, value: string): void {
    if (field === 'payment') {
      this.payment = value as TPayment;
    } else {
      this[field] = value;
    }
    this.events.emit('buyer:changed');
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
    this.events.emit('buyer:changed');
  }

  // Валидация данных
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
