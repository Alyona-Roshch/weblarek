import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICardImage {
  src: string;
  alt?: string;
}

export interface ICard {
  title: string;
  price: number | null;
  image?: ICardImage;
  category?: string;
  description?: string;
  index?: number;
  buttonText?: string;
  buttonDisabled?: boolean;
}

// Базовый класс карточки
export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this._title = ensureElement<HTMLElement>(".card__title", container);
    this._price = ensureElement<HTMLElement>(".card__price", container);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value === null ? "Бесценно" : `${value} синапсов`;
  }
}

// 1. Карточка в каталоге на главной
export class CardCatalog extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);

    if (actions?.onClick) {
      container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this._category.textContent = value;
    Object.values(categoryMap).forEach((className) => {
      this._category.classList.remove(className);
    });
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this._category.classList.add(modifier);
    }
  }

  set image(value: ICardImage) {
    this.setImage(this._image, value.src, value.alt);
  }
}

// 2. Детальная карточка в модальном окне
export class CardPreview extends Card {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._description = ensureElement<HTMLElement>(".card__text", container);
    this._button = ensureElement<HTMLButtonElement>(".card__button", container);

    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this._category.textContent = value;
    Object.values(categoryMap).forEach((className) => {
      this._category.classList.remove(className);
    });
    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this._category.classList.add(modifier);
    }
  }

  set image(value: ICardImage) {
    this.setImage(this._image, value.src, value.alt);
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    this._button.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this._button.disabled = value;
  }
}

// 3. Компактная карточка в корзине
export class CardBasket extends Card {
  protected _index: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._button = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    if (actions?.onClick) {
      this._button.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}
