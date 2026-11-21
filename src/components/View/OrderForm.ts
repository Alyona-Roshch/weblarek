import { Form } from "./Form";
import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";
import { ensureAllElements, ensureElement } from "../../utils/utils";

export class OrderForm extends Form<IBuyer> {
  protected _buttons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
    this._addressInput = ensureElement<HTMLInputElement>('input[name=address]', container);

    this._buttons.forEach((button) => {
      button.addEventListener('click', () => {
        this.onInputChange('payment', button.name);
      });
    });
  }

  set payment(name: TPayment) {
    this._buttons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === name);
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}