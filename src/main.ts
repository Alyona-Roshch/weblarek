// 1. СТРОГО В НАЧАЛЕ ФАЙЛА: Все импорты стилей, базовых классов, моделей и констант
import "./scss/styles.scss";
import { EventEmitter } from "./components/base/Events";
import { ProductModel } from "./components/Models/ProductModel";
import { BasketModel } from "./components/Models/BasketModel";
import { BuyerModel } from "./components/Models/BuyerModel";
import { Api } from "./components/base/Api";
import { LarekApi } from "./components/LarekApi";
import { apiProducts } from "./utils/data";
import { API_URL } from "./utils/constants";

// 2. Инициализируем брокер событий, необходимый для работы моделей
const events = new EventEmitter();

// Включаем логгер всех событий в консоли для отслеживания триггеров
events.onAll((event) => {
  console.log(`[Событие] Сгенерировано:`, event);
});

console.log("=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ДАННЫХ ===");

// ==========================================
// 1. ТЕСТИРОВАНИЕ PRODUCT MODEL (КАТАЛОГ)
// ==========================================
console.log("\n--- 1. Тестирование ProductModel ---");
const productModel = new ProductModel(events);

// Проверяем setItems и getItems на мок-данных
productModel.setItems(apiProducts.items);
console.log("Массив товаров из каталога:", productModel.getItems());

// Проверяем получение товара по id
const firstProductId = apiProducts.items?.[0]?.id;
if (firstProductId) {
  const foundProduct = productModel.getProduct(firstProductId);
  console.log(`Поиск товара по ID "${firstProductId}":`, foundProduct);
}

// Проверяем установку и получение превью
const testProductForPreview = apiProducts.items?.[0];
if (testProductForPreview) {
  productModel.setPreview(testProductForPreview);
  console.log("Товар в режиме превью:", productModel.getPreview());
}

// ==========================================
// 2. ТЕСТИРОВАНИЕ BASKET MODEL (КОРЗИНА)
// ==========================================
console.log("\n--- 2. Тестирование BasketModel ---");
const basketModel = new BasketModel(events);

const product1 = apiProducts.items?.[0];
const product2 = apiProducts.items?.[1];

if (product1 && product2) {
  // Добавление товаров
  basketModel.add(product1);
  basketModel.add(product2);
  console.log(
    "Товары в корзине после добавления двух штук:",
    basketModel.getItems(),
  );

  // Проверка количества и стоимости
  console.log("Количество товаров в корзине:", basketModel.getQuantity());
  console.log(
    "Общая стоимость товаров в корзине:",
    basketModel.getTotalPrice(),
  );

  // Проверка наличия по ID
  console.log(
    `Есть ли товар "${product1.id}" в корзине?:`,
    basketModel.checkItemInBasket(product1.id),
  );

  // Удаление товара
  basketModel.remove(product1.id);
  console.log(
    `Содержимое корзины после удаления товара "${product1.id}":`,
    basketModel.getItems(),
  );
  console.log("Новое количество товаров:", basketModel.getQuantity());
  console.log("Новая стоимость:", basketModel.getTotalPrice());

  // Очистка корзины
  basketModel.clear();
  console.log("Корзина после полной очистки clear():", basketModel.getItems());
}

// ==========================================
// 3. ТЕСТИРОВАНИЕ BUYER MODEL (ПОКУПАТЕЛЬ)
// ==========================================
console.log("\n--- 3. Тестирование BuyerModel ---");
const buyerModel = new BuyerModel(events);

// Проверяем частичное заполнение полей
console.log("Заполняем адрес...");
buyerModel.setField("address", "г. Пермь, ул. Ленина, д. 1");

console.log("Заполняем email...");
buyerModel.setField("email", "test@yandex.ru");

// Проверяем получение промежуточных данных
console.log(
  "Текущие накопленные данные покупателя:",
  buyerModel.getBuyerData(),
);

// Проверяем валидацию при неполных данных
const isFirstValidationValid = buyerModel.validate();
console.log(
  "Результат валидации (при пустых полях payment и phone):",
  isFirstValidationValid,
);

// Дозаполняем оставшиеся поля
console.log("Заполняем телефон и способ оплаты...");
buyerModel.setField("phone", "+79991112233");
buyerModel.setField("payment", "card");

// Повторная валидация полных данных
const isFinalValidationValid = buyerModel.validate();
console.log(
  "Результат валидации (все поля заполнены):",
  isFinalValidationValid,
);
console.log("Итоговый объект данных покупателя:", buyerModel.getBuyerData());

// Очистка данных
buyerModel.clear();
console.log(
  "Данные покупателя после сброса clear():",
  buyerModel.getBuyerData(),
);

console.log("\n=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ ЗАВЕРШЕНО ===");

// ==========================================
// 4. ПОДКЛЮЧЕНИЕ РАБОТЫ С СЕРВЕРОМ
// ==========================================
console.log("\n==========================================");
console.log("Шаг 4. ЗАГРУЗКА РЕАЛЬНЫХ ДАННЫХ С СЕРВЕРА");
console.log("==========================================");

// Инициализируем сетевые классы
const baseApi = new Api(API_URL);
const larekApi = new LarekApi(baseApi);

console.log("Отправка GET-запроса на сервер...");

// Выполняем асинхронный запрос на получение списка товаров
larekApi
  .getProductList()
  .then((serverProducts) => {
    console.log(" Данные успешно получены с сервера!");
    console.log("Массив товаров напрямую из сети:", serverProducts);

    // Сохраняем полученный массив товаров в модель данных каталога
    productModel.setItems(serverProducts);

    // Выводим только что сохранённый каталог из модели в консоль для финальной проверки
    console.log(" Проверка! Каталог товаров, сохраненный внутри ProductModel:");
    console.log(productModel.getItems());

    console.log("\n Первая часть проекта «Web-Larёк» полностью завершена!");
  })
  .catch((error) => {
    console.error(" Ошибка при работе с сервером:", error);
  });
