import { IBuyer, TFormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel {
  private payment: string = "";
  private address: string = "";
  private email: string = "";
  private phone: string = "";
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохранение данных в модели без затирания значений других полей
  setField(field: keyof IBuyer, value: string): void {
    this[field] = value;

    // После сохранения автоматически запускается метод валидации
    this.validate();
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

  // Очистка данных покупателя (сброс всех полей класса в начальное пустое состояние)
  clear(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  // Валидация данных. Проверяет каждое поле на заполненность
  validate(): boolean {
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

    // Передаем сформированный объект с ошибками в систему событий
    this.events.emit("formErrors:change", errors);

    // Метод возвращает true, если объект ошибок пустой (все поля заполнены верно)
    return Object.keys(errors).length === 0;
  }
}
