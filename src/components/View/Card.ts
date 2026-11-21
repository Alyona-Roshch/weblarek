import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  price: number | null;
  index?: number;
  buttonText?: string;
}

// Базовый класс карточки
export class Card extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image') || undefined;
    this._category = container.querySelector('.card__category') || undefined;
    this._button = container.querySelector('.card__button') || undefined;

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this._price.textContent = 'Бесценно';
      if (this._button) {
        this._button.disabled = true;
        this._button.textContent = 'Недоступно';
      }
    } else {
      this._price.textContent = `${value} синапсов`;
      if (this._button) {
        this._button.disabled = false;
      }
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      // Очищаем старые модификаторы категорий
      Object.values(categoryMap).forEach((className) => {
        this._category?.classList.remove(className);
      });
      const modifier = categoryMap[value as keyof typeof categoryMap];
      if (modifier) {
        this._category.classList.add(modifier);
      }
    }
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this._title.textContent || '');
    }
  }
}

// 1. Карточка в каталоге на главной
export class CardCatalog extends Card {
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
  }
}

// 2. Детальная карточка в модальном окне
export class CardPreview extends Card {
  protected _description: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._description = ensureElement<HTMLElement>('.card__text', container);
  }

  set description(value: string) {
    this._description.textContent = value;
  }

  set buttonText(value: string) {
    if (this._button && !this._button.disabled) {
      this._button.textContent = value;
    }
  }
}

// 3. Компактная карточка в корзине
export class CardBasket extends Card {
  protected _index: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container, actions);
    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
}