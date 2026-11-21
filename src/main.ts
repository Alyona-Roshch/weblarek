import './scss/styles.scss';

import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { ProductModel } from './components/Models/ProductModel';
import { BasketModel } from './components/Models/BasketModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { IBuyer } from './types';

// Инициализация брокера событий и API
const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekApi(baseApi);

// Инициализация моделей данных
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// Поиск HTML-шаблонов
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация постоянных компонентов View
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

// --- ОБРАБОТЧИКИ СОБЫТИЙ (ПРЕЗЕНТЕР) ---

// 1. Обновился список товаров в каталоге -> рендерим главную страницу
events.on('items:changed', () => {
  const cards = productModel.getItems().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => productModel.setPreview(item),
    });
    return card.render({
      id: item.id,
      title: item.title,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      price: item.price,
    });
  });

  page.render({ catalog: cards });
});

// 2. Выбран товар для предпросмотра -> открываем модальное окно с карточкой
events.on('preview:changed', () => {
  const item = productModel.getPreview();
  if (!item) return;

  const isInBasket = basketModel.checkItemInBasket(item.id);

  const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      if (isInBasket) {
        basketModel.remove(item.id);
      } else {
        basketModel.add(item);
      }
      modal.close();
    },
  });

  modal.render({
    content: cardPreview.render({
      id: item.id,
      title: item.title,
      image: `${CDN_URL}${item.image}`,
      category: item.category,
      description: item.description,
      price: item.price,
      buttonText: isInBasket ? 'Удалить из корзины' : 'Купить',
    }),
  });
});

// 3. Изменилась корзина -> обновляем счётчик на главной и содержимое корзины
events.on('basket:changed', () => {
  page.counter = basketModel.getQuantity();

  const basketItems = basketModel.getItems().map((item, index) => {
    const cardBasket = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => basketModel.remove(item.id),
    });
    return cardBasket.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  basket.render({
    items: basketItems,
    total: basketModel.getTotalPrice(),
  });
});

// 4. Открытие корзины по клику на иконку в шапке
events.on('basket:open', () => {
  modal.render({
    content: basket.render(),
  });
});

// 5. Переход к первому шагу оформления заказа (оплата и адрес)
events.on('order:open', () => {
  const buyerData = buyerModel.getBuyerData();
  const errors = buyerModel.validate();
  const stepErrors = [errors.payment, errors.address].filter(Boolean).join('; ');

  modal.render({
    content: orderForm.render({
      payment: buyerData.payment,
      address: buyerData.address,
      valid: !errors.payment && !errors.address,
      errors: stepErrors,
    }),
  });
});

// 6. Изменение полей в формах -> сохраняем в модель покупателя
events.on(/^(order|contacts)\..*:change/, (data: { field: keyof IBuyer; value: string }) => {
  buyerModel.setField(data.field, data.value);
});

// 7. Изменились данные покупателя -> обновляем валидацию обеих форм
events.on('buyer:changed', () => {
  const buyerData = buyerModel.getBuyerData();
  const errors = buyerModel.validate();

  // Обновляем форму шага 1
  const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
  orderForm.payment = buyerData.payment;
  orderForm.valid = !errors.payment && !errors.address;
  orderForm.errors = orderErrors;

  // Обновляем форму шага 2
  const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');
  contactsForm.valid = !errors.email && !errors.phone;
  contactsForm.errors = contactsErrors;
});

// 8. Отправка первой формы -> переход ко второму шагу (email и телефон)
events.on('order:submit', () => {
  const buyerData = buyerModel.getBuyerData();
  const errors = buyerModel.validate();
  const stepErrors = [errors.email, errors.phone].filter(Boolean).join('; ');

  modal.render({
    content: contactsForm.render({
      email: buyerData.email,
      phone: buyerData.phone,
      valid: !errors.email && !errors.phone,
      errors: stepErrors,
    }),
  });
});

// 9. Отправка второй формы -> отправка заказа на сервер и вывод экрана успеха
events.on('contacts:submit', () => {
  const orderData = {
    ...buyerModel.getBuyerData(),
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((item) => item.id),
  };

  api
    .createOrder(orderData)
    .then((result) => {
      basketModel.clear();
      buyerModel.clear();

      const success = new Success(cloneTemplate(successTemplate), {
        onClick: () => modal.close(),
      });

      modal.render({
        content: success.render({
          total: result.total,
        }),
      });
    })
    .catch((err) => {
      console.error('Ошибка при оформлении заказа:', err);
    });
});

// 10. Блокировка и разблокировка скролла при открытии/закрытии модального окна
events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

// --- ЗАГРУЗКА ДАННЫХ С СЕРВЕРА ПРИ СТАРТЕ ---
api
  .getProductList()
  .then((data) => {
    productModel.setItems(data.items);
  })
  .catch((err) => {
    console.error('Ошибка при загрузке каталога товаров:', err);
  });
