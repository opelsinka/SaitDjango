/**
 * ============================================
 * La Douceur — Интернет-магазин женского нижнего белья
 * Основной JavaScript-файл (script.js)
 * ============================================
 * 
 * Этот файл содержит всю логику работы SPA-приложения:
 * - Инициализация и управление данными (localStorage)
 * - Роутинг (переключение страниц)
 * - Рендер всех разделов сайта
 * - Работа с корзиной, избранным, пользователями
 * - Админ-панель (CRUD товаров)
 * - Обработка cookies для согласия на обработку данных
 * 
 * Все данные хранятся в localStorage как имитация базы данных.
 */

// ============================================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================

/**
 * Основной объект приложения, хранящий все данные и методы
 */
const App = {
  // Текущий пользователь (null если гость)
  currentUser: null,
  
  // Текущая страница (роут)
  currentRoute: 'home',
  
  // Инициализация приложения
  init() {
    this.initDemoData(); // Создаём демо-данные при первом запуске
    this.loadUser(); // Загружаем данные пользователя из sessionStorage
    this.bindEvents(); // Привязываем обработчики событий
    this.checkCookieConsent(); // Проверяем согласие на cookies
    this.updateBadges(); // Обновляем бейджи корзины и избранного
    this.handleRoute(); // Обрабатываем текущий маршрут
  },

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ ДЕМО-ДАННЫХ
  // ============================================
  
  /**
   * Создаёт демо-данные при первом запуске сайта
   * Проверяет, есть ли уже товары в localStorage
   * Если нет — создаёт 5 демо-товаров, админа и обычного пользователя
   */
  initDemoData() {
    // Проверяем, есть ли уже товары (если есть — ничего не делаем)
    if (localStorage.getItem('products')) {
      return;
    }

    // Демо-товары с разными размерами и характеристиками
    const demoProducts = [
      {
        id: 1,
        name: 'Кружевной бюстгальтер «Жасмин»',
        price: 3490,
        oldPrice: 4990,
        description: 'Элегантный бюстгальтер из итальянского кружева с мягкой чашкой. Идеально подходит для повседневной носки и особых случаев. Регулируемые бретели и застёжка на крючках обеспечивают комфортную посадку.',
        category: 'Бюстгальтеры',
        isNew: true,
        isSale: true,
        images: [
          // Используем SVG-плейсхолдеры вместо реальных фото
          this.generatePlaceholder('Бюстгальтер Жасмин', '#e8b4b8'),
          this.generatePlaceholder('Вид сбоку', '#d49a9e'),
          this.generatePlaceholder('Деталь кружева', '#f5d5d8')
        ],
        sizes: {
          '70B': 5,
          '70C': 3,
          '75B': 8,
          '75C': 6,
          '80B': 4,
          '80C': 2
        }
      },
      {
        id: 2,
        name: 'Комплект «Лаванда»',
        price: 5990,
        oldPrice: null,
        description: 'Роскошный комплект из бюстгальтера и трусиков в нежном лавандовом оттенке. Гладкая чашка без косточек, бесшовные трусики с низкой посадкой. Мягкая эластичная ткань приятно облегает фигуру.',
        category: 'Комплекты',
        isNew: true,
        isSale: false,
        images: [
          this.generatePlaceholder('Комплект Лаванда', '#c9b1d4'),
          this.generatePlaceholder('Вид сзади', '#b39dbc')
        ],
        sizes: {
          'S': 10,
          'M': 15,
          'L': 8,
          'XL': 5
        }
      },
      {
        id: 3,
        name: 'Шёлковая сорочка «Ночь»',
        price: 7490,
        oldPrice: 8990,
        description: 'Утончённая сорочка из натурального шёлка с кружевной отделкой. Длина до колена, V-образный вырез, тонкие регулируемые бретели. Идеальный выбор для романтичного вечера.',
        category: 'Сорочки',
        isNew: false,
        isSale: true,
        images: [
          this.generatePlaceholder('Сорочка Ночь', '#3a3530'),
          this.generatePlaceholder('Деталь', '#6b6560')
        ],
        sizes: {
          'S': 3,
          'M': 7,
          'L': 4
        }
      },
      {
        id: 4,
        name: 'Бесшовные трусики «Облако» (набор 3 шт)',
        price: 1990,
        oldPrice: null,
        description: 'Набор из трёх бесшовных трусиков в нейтральных оттенках. Мягкая эластичная ткань без швов обеспечивает комфорт в течение всего дня. Подходит для ежедневной носки под любую одежду.',
        category: 'Трусики',
        isNew: false,
        isSale: false,
        images: [
          this.generatePlaceholder('Набор Облако', '#f5f3f0')
        ],
        sizes: {
          'S': 20,
          'M': 25,
          'L': 18,
          'XL': 12
        }
      },
      {
        id: 5,
        name: 'Бюстгальтер-балконет «Роза»',
        price: 4290,
        oldPrice: null,
        description: 'Сексуальный балконет с	push-up эффектом и открытой чашкой. Украшен вышивкой в виде роз. Создаёт красивое декольте и приподнимает грудь.',
        category: 'Бюстгальтеры',
        isNew: true,
        isSale: false,
        images: [
          this.generatePlaceholder('Балконет Роза', '#e57373'),
          this.generatePlaceholder('Вид спереди', '#ef9a9a'),
          this.generatePlaceholder('Деталь вышивки', '#ffcdd2')
        ],
        sizes: {
          '70A': 4,
          '70B': 6,
          '75A': 8,
          '75B': 10,
          '75C': 5,
          '80B': 3,
          '80C': 2
        }
      }
    ];

    // Сохраняем товары в localStorage
    localStorage.setItem('products', JSON.stringify(demoProducts));

    // Демо-пользователи
    const demoUsers = [
      {
        id: 1,
        email: 'admin@example.com',
        password: 'admin123', // В учебном проекте храним в открытом виде
        name: 'Администратор',
        isAdmin: true,
        cart: [],
        favorites: [],
        orders: []
      },
      {
        id: 2,
        email: 'user@example.com',
        password: 'user123',
        name: 'Тестовый пользователь',
        isAdmin: false,
        cart: [
          { productId: 1, size: '75B', quantity: 1 }
        ],
        favorites: [2],
        orders: []
      }
    ];

    // Сохраняем пользователей
    localStorage.setItem('users', JSON.stringify(demoUsers));

    // orders — хранит все заказы (общий массив)
    localStorage.setItem('orders', JSON.stringify([]));
  },

  /**
   * Генерирует SVG-плейсхолдер для изображений товаров
   * @param {string} text - Текст для отображения на плейсхолдере
   * @param {string} bgColor - Цвет фона (hex)
   * @returns {string} - DataURL с SVG-изображением
   */
  generatePlaceholder(text, bgColor = '#e8b4b8') {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
      <rect width="400" height="500" fill="${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial" font-size="24" fill="white">${text}</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  },

  // ============================================
  // РАБОТА С ПОЛЬЗОВАТЕЛЕМ
  // ============================================
  
  /**
   * Загружает данные текущего пользователя из sessionStorage
   * sessionStorage используется для хранения идентификатора сессии
   */
  loadUser() {
    const userId = sessionStorage.getItem('currentUserId');
    if (userId) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      this.currentUser = users.find(u => u.id === parseInt(userId)) || null;
    }
  },

  /**
   * Сохраняет данные пользователя в localStorage
   */
  saveUser() {
    if (!this.currentUser) return;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === this.currentUser.id);
    if (index !== -1) {
      users[index] = this.currentUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  },

  /**
   * Выполняет вход пользователя
   * @param {string} email - Email пользователя
   * @param {string} password - Пароль
   * @returns {object|null} - Данные пользователя или null при ошибке
   */
  login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      sessionStorage.setItem('currentUserId', user.id);
      
      // Если у пользователя есть гостевая корзина — объединяем
      this.mergeGuestCart();
      
      return user;
    }
    return null;
  },

  /**
   * Объединяет гостевую корзину с корзиной пользователя после входа
   */
  mergeGuestCart() {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const guestFavorites = JSON.parse(localStorage.getItem('guestFavorites') || '[]');
    
    if (guestCart.length > 0) {
      // Добавляем товары из гостевой корзины в пользовательскую
      guestCart.forEach(guestItem => {
        const existingItem = this.currentUser.cart.find(
          item => item.productId === guestItem.productId && item.size === guestItem.size
        );
        
        if (existingItem) {
          existingItem.quantity += guestItem.quantity;
        } else {
          this.currentUser.cart.push(guestItem);
        }
      });
      
      this.saveUser();
      // Очищаем гостевую корзину
      localStorage.removeItem('guestCart');
    }
    
    if (guestFavorites.length > 0) {
      // Объединяем избранное
      guestFavorites.forEach(id => {
        if (!this.currentUser.favorites.includes(id)) {
          this.currentUser.favorites.push(id);
        }
      });
      this.saveUser();
      localStorage.removeItem('guestFavorites');
    }
    
    this.updateBadges();
  },

  /**
   * Выполняет выход пользователя
   */
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('currentUserId');
    this.updateBadges();
    this.handleRoute(); // Перерисовываем текущую страницу
  },

  /**
   * Регистрирует нового пользователя
   * @param {object} data - Данные формы регистрации
   * @returns {object|null} - Новый пользователь или null при ошибке
   */
  register(data) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверяем, не занят ли email
    if (users.some(u => u.email === data.email)) {
      return { error: 'Пользователь с таким email уже существует' };
    }
    
    // Создаём нового пользователя
    const newUser = {
      id: Date.now(), // Генерируем уникальный ID
      email: data.email,
      password: data.password,
      name: data.name,
      isAdmin: false,
      cart: [],
      favorites: [],
      orders: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Автоматически выполняем вход
    this.currentUser = newUser;
    sessionStorage.setItem('currentUserId', newUser.id);
    
    // Объединяем с гостевой корзиной
    this.mergeGuestCart();
    
    return newUser;
  },

  /**
   * Проверяет, авторизован ли пользователь
   */
  isLoggedIn() {
    return this.currentUser !== null;
  },

  /**
   * Проверяет, является ли пользователь администратором
   */
  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin === true;
  },

  // ============================================
  // РАБОТА С КОРЗИНОЙ
  // ============================================
  
  /**
   * Получает корзину текущего пользователя (или гостевую)
   */
  getCart() {
    if (this.isLoggedIn()) {
      return this.currentUser.cart || [];
    }
    return JSON.parse(localStorage.getItem('guestCart') || '[]');
  },

  /**
   * Сохраняет корзину
   */
  saveCart(cart) {
    if (this.isLoggedIn()) {
      this.currentUser.cart = cart;
      this.saveUser();
    } else {
      localStorage.setItem('guestCart', JSON.stringify(cart));
    }
    this.updateBadges();
  },

  /**
   * Добавляет товар в корзину
   * @param {number} productId - ID товара
   * @param {string} size - Размер
   * @param {number} quantity - Количество
   */
  addToCart(productId, size, quantity) {
    const cart = this.getCart();
    
    // Проверяем, есть ли уже такой товар с таким размером
    const existingItem = cart.find(item => item.productId === productId && item.size === size);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ productId, size, quantity });
    }
    
    this.saveCart(cart);
    this.showToast('Товар добавлен в корзину', 'success');
  },

  /**
   * Удаляет товар из корзины
   */
  removeFromCart(productId, size) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.productId === productId && item.size === size));
    this.saveCart(cart);
  },

  /**
   * Обновляет количество товара в корзине
   */
  updateCartQuantity(productId, size, quantity) {
    const cart = this.getCart();
    const item = cart.find(item => item.productId === productId && item.size === size);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId, size);
      } else {
        item.quantity = quantity;
        this.saveCart(cart);
      }
    }
  },

  /**
   * Очищает корзину полностью
   */
  clearCart() {
    this.saveCart([]);
  },

  // ============================================
  // РАБОТА С ИЗБРАННЫМ
  // ============================================
  
  /**
   * Получает список избранного
   */
  getFavorites() {
    if (this.isLoggedIn()) {
      return this.currentUser.favorites || [];
    }
    return JSON.parse(localStorage.getItem('guestFavorites') || '[]');
  },

  /**
   * Сохраняет избранное
   */
  saveFavorites(favorites) {
    if (this.isLoggedIn()) {
      this.currentUser.favorites = favorites;
      this.saveUser();
    } else {
      localStorage.setItem('guestFavorites', JSON.stringify(favorites));
    }
    this.updateBadges();
  },

  /**
   * Переключает статус избранного (добавить/удалить)
   */
  toggleFavorite(productId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
      favorites.push(productId);
      this.saveFavorites(favorites);
      this.showToast('Добавлено в избранное', 'success');
    } else {
      favorites.splice(index, 1);
      this.saveFavorites(favorites);
      this.showToast('Удалено из избранного', 'success');
    }
  },

  /**
   * Проверяет, есть ли товар в избранном
   */
  isFavorite(productId) {
    return this.getFavorites().includes(productId);
  },

  // ============================================
  // ОБНОВЛЕНИЕ БЕЙДЖЕЙ
  // ============================================
  
  /**
   * Обновляет счётчики на иконках корзины и избранного
   */
  updateBadges() {
    const cart = this.getCart();
    const favorites = this.getFavorites();
    
    // Считаем общее количество товаров в корзине
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    
    if (cartCount > 0) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = 'flex';
    } else {
      cartBadge.style.display = 'none';
    }
    
    // Обновляем бейдж избранного
    const favBadge = document.getElementById('favoritesBadge');
    if (favorites.length > 0) {
      favBadge.textContent = favorites.length;
      favBadge.style.display = 'flex';
    } else {
      favBadge.style.display = 'none';
    }
  },

  // ============================================
  // РАБОТА С COOKIES
  // ============================================
  
  /**
   * Устанавливает cookie
   * @param {string} name - Имя cookie
   * @param {string} value - Значение
   * @param {number} days - Срок хранения в днях
   */
  setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  },

  /**
   * Получает значение cookie
   */
  getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  },

  /**
   * Проверяет согласие пользователя на обработку данных
   * Если согласия нет — показывает баннер
   */
  checkCookieConsent() {
    const consent = this.getCookie('cookieConsent');
    if (!consent) {
      document.getElementById('cookieBanner').classList.remove('hidden');
    }
  },

  /**
   * Принимает согласие на обработку данных
   */
  acceptCookieConsent() {
    this.setCookie('cookieConsent', 'true', 365); // Храним 1 год
    document.getElementById('cookieBanner').classList.add('hidden');
  },

  // ============================================
  // ОБРАБОТЧИКИ СОБЫТИЙ
  // ============================================
  
  /**
   * Привязывает все обработчики событий при инициализации
   */
  bindEvents() {
    // Навигация по хешу (роутинг)
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Бургер-меню
    document.getElementById('burger').addEventListener('click', () => {
      document.getElementById('nav').classList.toggle('active');
    });
    
    // Поиск
    document.getElementById('searchToggle').addEventListener('click', () => {
      document.getElementById('searchBar').style.display = 'block';
      document.getElementById('searchInput').focus();
    });
    
    document.getElementById('closeSearch').addEventListener('click', () => {
      document.getElementById('searchBar').style.display = 'none';
    });
    
    // Поиск при вводе текста
    document.getElementById('searchInput').addEventListener('input', (e) => {
      if (this.currentRoute === 'catalog') {
        this.renderCatalog(e.target.value);
      } else {
        window.location.hash = '#catalog';
      }
    });
    
    // Кнопка принятия cookies
    document.getElementById('acceptCookies').addEventListener('click', () => {
      this.acceptCookieConsent();
    });
    
    // Модальные окна — закрытие по крестику
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.target.closest('.modal').classList.remove('active');
      });
    });
    
    // Закрытие модалки по клику вне контента
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
    
    // Вкладки в модалке авторизации
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const tab = e.target.dataset.tab;
        document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
        document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
      });
    });
    
    // Форма входа
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const user = this.login(email, password);
      if (user) {
        document.getElementById('authModal').classList.remove('active');
        this.showToast(`Добро пожаловать, ${user.name}!`, 'success');
        this.handleRoute(); // Перерисовываем страницу
      } else {
        this.showToast('Неверный email или пароль', 'error');
      }
    });
    
    // Форма регистрации
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('regEmail').value;
      const name = document.getElementById('regName').value;
      const password = document.getElementById('regPassword').value;
      const passwordConfirm = document.getElementById('regPasswordConfirm').value;
      
      // Проверяем совпадение паролей
      if (password !== passwordConfirm) {
        this.showToast('Пароли не совпадают', 'error');
        return;
      }
      
      const result = this.register({ email, name, password });
      if (result.error) {
        this.showToast(result.error, 'error');
      } else {
        document.getElementById('authModal').classList.remove('active');
        this.showToast(`Добро пожаловать, ${name}!`, 'success');
        this.handleRoute();
      }
    });
    
    // Кнопка пользователя в шапке
    document.getElementById('userBtn').addEventListener('click', () => {
      if (this.isLoggedIn()) {
        this.showUserMenu();
      } else {
        document.getElementById('authModal').classList.add('active');
      }
    });
    
    // Форма оформления заказа
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.placeOrder();
    });
  },

  /**
   * Показывает меню пользователя (через alert для простоты)
   */
  showUserMenu() {
    if (!this.currentUser) return;
    
    const isLogout = confirm(
      `Вы вошли как: ${this.currentUser.name}\nEmail: ${this.currentUser.email}\n\nНажмите OK для выхода, или Отмена для отмены.`
    );
    
    if (isLogout) {
      this.logout();
      this.showToast('Вы вышли из аккаунта', 'success');
    }
  },

  // ============================================
  // РОУТИНГ (ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ)
  // ============================================
  
  /**
   * Обрабатывает текущий маршрут (hash в URL)
   * Определяет, какую страницу показать
   */
  handleRoute() {
    const hash = window.location.hash || '#home';
    const route = hash.replace('#', '');
    this.currentRoute = route;
    
    // Закрываем бургер-меню при навигации
    document.getElementById('nav').classList.remove('active');
    
    // Определяем, какую страницу отрендерить
    const app = document.getElementById('app');
    
    switch (route) {
      case 'home':
        this.renderHomePage();
        break;
      case 'catalog':
        this.renderCatalogPage();
        break;
      case 'product':
        this.renderProductPage();
        break;
      case 'cart':
        this.renderCartPage();
        break;
      case 'favorites':
        this.renderFavoritesPage();
        break;
      case 'contacts':
        this.renderContactsPage();
        break;
      case 'delivery':
        this.renderDeliveryPage();
        break;
      case 'privacy':
        this.renderPrivacyPage();
        break;
      case 'offer':
        this.renderOfferPage();
        break;
      case 'data-consent':
        this.renderDataConsentPage();
        break;
      case 'admin':
        this.renderAdminPage();
        break;
      case 'checkout':
        this.renderCheckoutPage();
        break;
      case 'order-success':
        this.renderOrderSuccessPage();
        break;
      default:
        this.renderHomePage();
    }
    
    // Прокручиваем страницу вверх
    window.scrollTo(0, 0);
  },

  // ============================================
  // РЕНДЕР: ГЛАВНАЯ СТРАНИЦА
  // ============================================
  
  /**
   * Рендерит главную страницу с секциями "Новинки" и "Скидки"
   */
  renderHomePage() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newProducts = products.filter(p => p.isNew);
    const saleProducts = products.filter(p => p.isSale);
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <!-- Герой-блок -->
      <section class="hero">
        <div class="container">
          <h1>La Douceur</h1>
          <p>Элегантность и комфорт каждый день. Откройте для себя коллекцию женского нижнего белья, созданную для настоящих ценительниц красоты.</p>
          <a href="#catalog" class="btn btn-primary">Перейти в каталог</a>
        </div>
      </section>
      
      <!-- Секция: Новинки -->
      ${newProducts.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Новинки</h2>
          <div class="products-grid">
            ${newProducts.map(p => this.renderProductCard(p)).join('')}
          </div>
        </section>
      ` : ''}
      
      <!-- Секция: Скидки -->
      ${saleProducts.length > 0 ? `
        <section class="section">
          <h2 class="section-title">Скидки</h2>
          <div class="products-grid">
            ${saleProducts.map(p => this.renderProductCard(p)).join('')}
          </div>
        </section>
      ` : ''}
      
      <!-- Все товары -->
      <section class="section">
        <h2 class="section-title">Все товары</h2>
        <div class="products-grid">
          ${products.map(p => this.renderProductCard(p)).join('')}
        </div>
      </section>
    `;
    
    // Привязываем обработчики для кнопок на карточках
    this.bindProductCardEvents();
  },

  // ============================================
  // РЕНДЕР: СТРАНИЦА КАТАЛОГА
  // ============================================
  
  /**
   * Рендерит страницу каталога с фильтрами
   * @param {string} searchQuery - Строка поиска (опционально)
   */
  renderCatalogPage(searchQuery = '') {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Получаем уникальные категории
    const categories = [...new Set(products.map(p => p.category))];
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Каталог</h2>
        
        <!-- Фильтры -->
        <div class="catalog-filters">
          <div class="filter-group">
            <label for="categoryFilter">Категория</label>
            <select id="categoryFilter">
              <option value="">Все категории</option>
              ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="filter-group">
            <label for="sortSelect">Сортировка</label>
            <select id="sortSelect">
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="name">По названию</option>
            </select>
          </div>
        </div>
        
        <!-- Сетка товаров -->
        <div class="products-grid" id="catalogGrid">
          ${products.map(p => this.renderProductCard(p)).join('')}
        </div>
      </section>
    `;
    
    // Если передан поисковый запрос — вставляем его в поле
    if (searchQuery) {
      document.getElementById('searchInput').value = searchQuery;
      this.filterCatalog(searchQuery, '', 'default');
    }
    
    // Привязываем обработчики фильтров
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      this.filterCatalog(searchQuery, e.target.value, document.getElementById('sortSelect').value);
    });
    
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      this.filterCatalog(searchQuery, document.getElementById('categoryFilter').value, e.target.value);
    });
    
    // Привязываем обработчики карточек
    this.bindProductCardEvents();
  },

  /**
   * Фильтрует и сортирует каталог
   */
  filterCatalog(searchQuery = '', category = '', sort = 'default') {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Фильтр по поисковому запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(query));
    }
    
    // Фильтр по категории
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    // Сортировка
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    
    // Перерендериваем сетку
    const grid = document.getElementById('catalogGrid');
    if (grid) {
      grid.innerHTML = products.length > 0
        ? products.map(p => this.renderProductCard(p)).join('')
        : '<p class="cart-empty">Товары не найдены</p>';
      
      this.bindProductCardEvents();
    }
  },

  // ============================================
  // РЕНДЕР: КАРТОЧКА ТОВАРА
  // ============================================
  
  /**
   * Создаёт HTML карточки товара
   */
  renderProductCard(product) {
    const favorites = this.getFavorites();
    const isFav = favorites.includes(product.id);
    const availableSizes = Object.keys(product.sizes).filter(s => product.sizes[s] > 0);
    
    return `
      <article class="product-card">
        <div class="product-image" data-product-id="${product.id}">
          ${product.isNew ? '<span class="product-badge badge-new">Новинка</span>' : ''}
          ${product.isSale ? '<span class="product-badge badge-sale">Скидка</span>' : ''}
          <button class="product-favorite ${isFav ? 'active' : ''}" data-product-id="${product.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-name" data-product-id="${product.id}">${product.name}</h3>
          <div class="product-sizes">
            ${availableSizes.map(s => `<span class="size-tag">${s}</span>`).join('')}
          </div>
          <div class="product-price">
            <span class="price-current">${product.price.toLocaleString()} ₽</span>
            ${product.oldPrice ? `<span class="price-old">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
          </div>
          <div class="product-actions">
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${product.id}">В корзину</button>
            <a href="#product-${product.id}" class="btn btn-secondary btn-sm">Подробнее</a>
          </div>
        </div>
      </article>
    `;
  },

  /**
   * Привязывает обработчики для кнопок на карточках товаров
   */
  bindProductCardEvents() {
    // Клик по изображению или названию — открываем товар
    document.querySelectorAll('[data-product-id]').forEach(el => {
      if (el.classList.contains('product-image') || el.classList.contains('product-name')) {
        el.addEventListener('click', (e) => {
          const productId = parseInt(e.currentTarget.dataset.productId);
          window.location.hash = `#product-${productId}`;
        });
      }
    });
    
    // Кнопка избранного
    document.querySelectorAll('.product-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Чтобы не срабатывал клик по карточке
        const productId = parseInt(btn.dataset.productId);
        this.toggleFavorite(productId);
        btn.classList.toggle('active');
      });
    });
    
    // Кнопка "В корзину" — открывает модалку товара
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productId = parseInt(btn.dataset.productId);
        this.openProductModal(productId);
      });
    });
  },

  /**
   * Открывает модалку товара с выбором размера и количества
   */
  openProductModal(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const content = document.getElementById('productModalContent');
    const availableSizes = Object.entries(product.sizes).filter(([_, qty]) => qty > 0);
    
    content.innerHTML = `
      <div class="product-detail">
        <div class="product-detail-gallery">
          <div class="image-carousel" id="imageCarousel">
            ${product.images.map((img, i) => `
              <img src="${img}" alt="${product.name}" class="${i === 0 ? 'active' : ''}" data-index="${i}">
            `).join('')}
            ${product.images.length > 1 ? `
              <button class="carousel-btn carousel-prev" id="carouselPrev">&#10094;</button>
              <button class="carousel-btn carousel-next" id="carouselNext">&#10095;</button>
              <div class="carousel-dots">
                ${product.images.map((_, i) => `
                  <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
        <div class="product-detail-info">
          <h2>${product.name}</h2>
          <div class="product-price">
            <span class="price-current">${product.price.toLocaleString()} ₽</span>
            ${product.oldPrice ? `<span class="price-old">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
          </div>
          <p class="product-detail-description">${product.description}</p>
          
          <div class="form-group">
            <label>Выберите размер:</label>
            <div class="size-selector" id="sizeSelector">
              ${Object.entries(product.sizes).map(([size, qty]) => `
                <button class="size-btn" data-size="${size}" data-qty="${qty}" ${qty === 0 ? 'disabled' : ''}>
                  ${size} ${qty > 0 ? `(${qty} шт)` : '(нет в наличии)'}
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="quantity-selector">
            <label for="productQuantity">Количество:</label>
            <div class="cart-item-quantity">
              <button class="qty-btn" id="qtyMinus">−</button>
              <input type="number" id="productQuantity" value="1" min="1" max="1" style="width: 60px; text-align: center;">
              <button class="qty-btn" id="qtyPlus">+</button>
            </div>
          </div>
          
          <div class="product-actions">
            <button class="btn btn-primary" id="modalAddToCart">Добавить в корзину</button>
            <button class="btn btn-outline" id="modalBuyNow">Купить сейчас</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('productModal').classList.add('active');
    
    // Обработчик карусели
    let currentImageIndex = 0;
    const images = content.querySelectorAll('.image-carousel img');
    const dots = content.querySelectorAll('.carousel-dot');
    
    const showImage = (index) => {
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      images[index]?.classList.add('active');
      dots[index]?.classList.add('active');
      currentImageIndex = index;
    };
    
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showImage((currentImageIndex - 1 + images.length) % images.length);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showImage((currentImageIndex + 1) % images.length);
      });
    }
    
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        showImage(parseInt(dot.dataset.index));
      });
    });
    
    // Выбор размера
    let selectedSize = null;
    content.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        content.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        
        // Обновляем максимальное количество
        const maxQty = parseInt(btn.dataset.qty);
        const qtyInput = document.getElementById('productQuantity');
        qtyInput.max = maxQty;
        if (parseInt(qtyInput.value) > maxQty) {
          qtyInput.value = maxQty;
        }
      });
    });
    
    // Кнопки +/- для количества
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
      const qtyInput = document.getElementById('productQuantity');
      if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
      }
    });
    
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
      const qtyInput = document.getElementById('productQuantity');
      const maxQty = parseInt(qtyInput.max);
      if (parseInt(qtyInput.value) < maxQty) {
        qtyInput.value = parseInt(qtyInput.value) + 1;
      }
    });
    
    // Добавление в корзину
    document.getElementById('modalAddToCart')?.addEventListener('click', () => {
      if (!selectedSize) {
        this.showToast('Пожалуйста, выберите размер', 'error');
        return;
      }
      const quantity = parseInt(document.getElementById('productQuantity').value);
      this.addToCart(productId, selectedSize, quantity);
      document.getElementById('productModal').classList.remove('active');
    });
    
    // Покупка сейчас — переход к оформлению
    document.getElementById('modalBuyNow')?.addEventListener('click', () => {
      if (!selectedSize) {
        this.showToast('Пожалуйста, выберите размер', 'error');
        return;
      }
      const quantity = parseInt(document.getElementById('productQuantity').value);
      this.addToCart(productId, selectedSize, quantity);
      document.getElementById('productModal').classList.remove('active');
      window.location.hash = '#checkout';
    });
  },

  // ============================================
  // РЕНДЕР: СТРАНИЦА ТОВАРА (отдельная страница)
  // ============================================
  
  /**
   * Рендерит отдельную страницу товара (при переходе по #product-1)
   */
  renderProductPage() {
    const hash = window.location.hash;
    const productId = parseInt(hash.split('-')[1]);
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      this.renderHomePage();
      return;
    }
    
    const app = document.getElementById('app');
    const availableSizes = Object.entries(product.sizes).filter(([_, qty]) => qty > 0);
    
    app.innerHTML = `
      <section class="section">
        <a href="#catalog" class="btn btn-secondary" style="margin-bottom: 1rem;">← Назад в каталог</a>
        <div class="product-detail" style="background-color: var(--color-white); padding: var(--spacing-xl); border-radius: var(--border-radius-lg);">
          <div class="product-detail-gallery">
            <div class="image-carousel" id="imageCarousel">
              ${product.images.map((img, i) => `
                <img src="${img}" alt="${product.name}" class="${i === 0 ? 'active' : ''}" data-index="${i}">
              `).join('')}
              ${product.images.length > 1 ? `
                <button class="carousel-btn carousel-prev" id="carouselPrev">&#10094;</button>
                <button class="carousel-btn carousel-next" id="carouselNext">&#10095;</button>
                <div class="carousel-dots">
                  ${product.images.map((_, i) => `
                    <button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
          <div class="product-detail-info">
            <h2>${product.name}</h2>
            <p style="color: var(--color-dark-gray); margin-bottom: var(--spacing-md);">Категория: ${product.category}</p>
            <div class="product-price">
              <span class="price-current">${product.price.toLocaleString()} ₽</span>
              ${product.oldPrice ? `<span class="price-old">${product.oldPrice.toLocaleString()} ₽</span>` : ''}
            </div>
            <p class="product-detail-description">${product.description}</p>
            
            <div class="form-group">
              <label>Выберите размер:</label>
              <div class="size-selector" id="sizeSelector">
                ${Object.entries(product.sizes).map(([size, qty]) => `
                  <button class="size-btn" data-size="${size}" data-qty="${qty}" ${qty === 0 ? 'disabled' : ''}>
                    ${size} ${qty > 0 ? `(${qty} шт)` : '(нет в наличии)'}
                  </button>
                `).join('')}
              </div>
            </div>
            
            <div class="quantity-selector">
              <label for="productQuantity">Количество:</label>
              <div class="cart-item-quantity">
                <button class="qty-btn" id="qtyMinus">−</button>
                <input type="number" id="productQuantity" value="1" min="1" max="1" style="width: 60px; text-align: center;">
                <button class="qty-btn" id="qtyPlus">+</button>
              </div>
            </div>
            
            <div class="product-actions">
              <button class="btn btn-primary" id="addToCartBtn">Добавить в корзину</button>
              <button class="btn btn-outline" id="buyNowBtn">Купить сейчас</button>
            </div>
            
            <button class="btn btn-secondary" style="margin-top: var(--spacing-md);" id="addToFavoriteBtn">
              ♡ В избранное
            </button>
          </div>
        </div>
      </section>
    `;
    
    // Обработчик карусели
    let currentImageIndex = 0;
    const images = document.querySelectorAll('#imageCarousel img');
    const dots = document.querySelectorAll('.carousel-dot');
    
    const showImage = (index) => {
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      images[index]?.classList.add('active');
      dots[index]?.classList.add('active');
      currentImageIndex = index;
    };
    
    document.getElementById('carouselPrev')?.addEventListener('click', () => {
      showImage((currentImageIndex - 1 + images.length) % images.length);
    });
    
    document.getElementById('carouselNext')?.addEventListener('click', () => {
      showImage((currentImageIndex + 1) % images.length);
    });
    
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        showImage(parseInt(dot.dataset.index));
      });
    });
    
    // Выбор размера
    let selectedSize = null;
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
        
        const maxQty = parseInt(btn.dataset.qty);
        const qtyInput = document.getElementById('productQuantity');
        qtyInput.max = maxQty;
        if (parseInt(qtyInput.value) > maxQty) {
          qtyInput.value = maxQty;
        }
      });
    });
    
    // Кнопки +/- для количества
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
      const qtyInput = document.getElementById('productQuantity');
      if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
      }
    });
    
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
      const qtyInput = document.getElementById('productQuantity');
      const maxQty = parseInt(qtyInput.max);
      if (parseInt(qtyInput.value) < maxQty) {
        qtyInput.value = parseInt(qtyInput.value) + 1;
      }
    });
    
    // Добавление в корзину
    document.getElementById('addToCartBtn')?.addEventListener('click', () => {
      if (!selectedSize) {
        this.showToast('Пожалуйста, выберите размер', 'error');
        return;
      }
      const quantity = parseInt(document.getElementById('productQuantity').value);
      this.addToCart(productId, selectedSize, quantity);
    });
    
    // Покупка сейчас
    document.getElementById('buyNowBtn')?.addEventListener('click', () => {
      if (!selectedSize) {
        this.showToast('Пожалуйста, выберите размер', 'error');
        return;
      }
      const quantity = parseInt(document.getElementById('productQuantity').value);
      this.addToCart(productId, selectedSize, quantity);
      window.location.hash = '#checkout';
    });
    
    // Добавление в избранное
    document.getElementById('addToFavoriteBtn')?.addEventListener('click', () => {
      this.toggleFavorite(productId);
    });
  },

  // ============================================
  // РЕНДЕР: СТРАНИЦА КОРЗИНЫ
  // ============================================
  
  /**
   * Рендерит страницу корзины
   */
  renderCartPage() {
    const cart = this.getCart();
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const app = document.getElementById('app');
    
    if (cart.length === 0) {
      app.innerHTML = `
        <section class="section">
          <h2 class="section-title">Корзина</h2>
          <div class="cart-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3>Корзина пуста</h3>
            <p>Добавьте товары из каталога</p>
            <a href="#catalog" class="btn btn-primary" style="margin-top: var(--spacing-lg);">Перейти в каталог</a>
          </div>
        </section>
      `;
      return;
    }
    
    // Считаем общую сумму
    let total = 0;
    const cartItemsHTML = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return '';
      
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      
      return `
        <div class="cart-item">
          <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image">
          <div class="cart-item-info">
            <h3 class="cart-item-name">${product.name}</h3>
            <p class="cart-item-details">Размер: ${item.size}</p>
            <p class="cart-item-price">${product.price.toLocaleString()} ₽ × ${item.quantity} = ${itemTotal.toLocaleString()} ₽</p>
            <div class="cart-item-quantity">
              <button class="qty-btn cart-qty-minus" data-product-id="${item.productId}" data-size="${item.size}">−</button>
              <input type="number" value="${item.quantity}" min="1" max="${product.sizes[item.size] || 1}" 
                     class="cart-qty-input" data-product-id="${item.productId}" data-size="${item.size}">
              <button class="qty-btn cart-qty-plus" data-product-id="${item.productId}" data-size="${item.size}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-product-id="${item.productId}" data-size="${item.size}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');
    
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Корзина</h2>
        <div class="cart-items">
          ${cartItemsHTML}
        </div>
        <div class="cart-summary">
          <h3>Итого</h3>
          <p class="cart-total">${total.toLocaleString()} ₽</p>
          <a href="#checkout" class="btn btn-primary">Оформить заказ</a>
        </div>
      </section>
    `;
    
    // Привязываем обработчики
    this.bindCartEvents();
  },

  /**
   * Привязывает обработчики для кнопок в корзине
   */
  bindCartEvents() {
    // Кнопки +/- для количества
    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.productId);
        const size = btn.dataset.size;
        const cart = this.getCart();
        const item = cart.find(i => i.productId === productId && i.size === size);
        if (item && item.quantity > 1) {
          item.quantity--;
          this.saveCart(cart);
          this.renderCartPage();
        }
      });
    });
    
    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.productId);
        const size = btn.dataset.size;
        const cart = this.getCart();
        const item = cart.find(i => i.productId === productId && i.size === size);
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (item && product && item.quantity < product.sizes[size]) {
          item.quantity++;
          this.saveCart(cart);
          this.renderCartPage();
        } else {
          this.showToast('Достигнут лимит наличия', 'error');
        }
      });
    });
    
    // Удаление товара
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.productId);
        const size = btn.dataset.size;
        this.removeFromCart(productId, size);
        this.renderCartPage();
        this.showToast('Товар удалён из корзины', 'success');
      });
    });
  },

  // ============================================
  // РЕНДЕР: СТРАНИЦА ИЗБРАННОГО
  // ============================================
  
  /**
   * Рендерит страницу избранного
   */
  renderFavoritesPage() {
    const favorites = this.getFavorites();
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const favoriteProducts = products.filter(p => favorites.includes(p.id));
    const app = document.getElementById('app');
    
    if (favoriteProducts.length === 0) {
      app.innerHTML = `
        <section class="section">
          <h2 class="section-title">Избранное</h2>
          <div class="cart-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h3>Список избранного пуст</h3>
            <p>Добавьте понравившиеся товары</p>
            <a href="#catalog" class="btn btn-primary" style="margin-top: var(--spacing-lg);">Перейти в каталог</a>
          </div>
        </section>
      `;
      return;
    }
    
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Избранное</h2>
        <div class="favorites-grid">
          ${favoriteProducts.map(p => this.renderProductCard(p)).join('')}
        </div>
      </section>
    `;
    
    this.bindProductCardEvents();
  },

  // ============================================
  // РЕНДЕР: СТРАНИЦА ОФОРМЛЕНИЯ ЗАКАЗА
  // ============================================
  
  /**
   * Рендерит страницу оформления заказа
   */
  renderCheckoutPage() {
    const cart = this.getCart();
    
    if (cart.length === 0) {
      window.location.hash = '#cart';
      return;
    }
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    let total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    // Заполняем форму данными пользователя если авторизован
    if (this.isLoggedIn()) {
      document.getElementById('checkoutName').value = this.currentUser.name || '';
      document.getElementById('checkoutEmail').value = this.currentUser.email || '';
    }
    
    document.getElementById('checkoutTotal').textContent = `${total.toLocaleString()} ₽`;
    document.getElementById('checkoutModal').classList.add('active');
    
    // После закрытия модалки — возвращаемся на предыдущую страницу
    document.getElementById('checkoutModal').querySelector('.modal-close').addEventListener('click', () => {
      window.location.hash = '#cart';
    });
  },

  /**
   * Оформляет заказ
   */
  placeOrder() {
    const cart = this.getCart();
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Собираем данные формы
    const orderData = {
      id: Date.now(),
      userId: this.currentUser ? this.currentUser.id : null,
      userName: document.getElementById('checkoutName').value,
      email: document.getElementById('checkoutEmail').value,
      phone: document.getElementById('checkoutPhone').value,
      address: document.getElementById('checkoutAddress').value,
      delivery: document.getElementById('checkoutDelivery').value,
      payment: document.getElementById('checkoutPayment').value,
      comment: document.getElementById('checkoutComment').value,
      items: cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product ? product.name : 'Неизвестный товар',
          size: item.size,
          quantity: item.quantity,
          price: product ? product.price : 0
        };
      }),
      total: cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
      status: 'new', // new, processing, shipped, completed, cancelled
      date: new Date().toISOString(),
      // ЗАГУШКА: Здесь будет информация об оплате после интеграции с платёжным шлюзом
      paymentStatus: 'pending' // pending, paid, refunded
    };
    
    // Уменьшаем остатки товаров
    cart.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product && product.sizes[item.size]) {
        product.sizes[item.size] -= item.quantity;
      }
    });
    localStorage.setItem('products', JSON.stringify(products));
    
    // Сохраняем заказ
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Если пользователь авторизован — добавляем заказ в его профиль
    if (this.currentUser) {
      if (!this.currentUser.orders) {
        this.currentUser.orders = [];
      }
      this.currentUser.orders.push(orderData.id);
      this.saveUser();
    }
    
    // Очищаем корзину
    this.clearCart();
    
    // Закрываем модалку и показываем успех
    document.getElementById('checkoutModal').classList.remove('active');
    window.location.hash = '#order-success';
  },

  /**
   * Рендерит страницу успешного оформления заказа
   */
  renderOrderSuccessPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <div class="text-page" style="text-align: center;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h2 style="font-family: var(--font-heading); margin: var(--spacing-lg) 0;">Заказ оформлен!</h2>
          <p>Спасибо за покупку! Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
          <p class="payment-note">Оплата будет доступна после подключения платёжного шлюза (ЮKassa, Stripe и т.п.)</p>
          <a href="#home" class="btn btn-primary" style="margin-top: var(--spacing-lg);">На главную</a>
        </div>
      </section>
    `;
  },

  // ============================================
  // РЕНДЕР: ТЕКСТОВЫЕ СТРАНИЦЫ
  // ============================================
  
  /**
   * Рендерит страницу контактов
   */
  renderContactsPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Контакты</h2>
        <div class="text-page">
          <h3>Свяжитесь с нами</h3>
          <p>Мы всегда рады помочь вам с выбором и ответить на любые вопросы.</p>
          
          <ul>
            <li><strong>Телефон:</strong> +7 (999) 123-45-67</li>
            <li><strong>Email:</strong> info@ladouceur.ru</li>
            <li><strong>Адрес:</strong> г. Москва, ул. Цветочная, д. 15</li>
          </ul>
          
          <h3>Режим работы</h3>
          <ul>
            <li>Понедельник — Пятница: 10:00 — 20:00</li>
            <li>Суббота: 11:00 — 18:00</li>
            <li>Воскресенье: выходной</li>
          </ul>
          
          <h3>Мы в социальных сетях</h3>
          <p>Подписывайтесь на нас, чтобы первыми узнавать о новинках и акциях:</p>
          <ul>
            <li>Instagram: @ladouceur_lingerie</li>
            <li>VK: vk.com/ladouceur</li>
            <li>Telegram: @ladouceur_shop</li>
          </ul>
        </div>
      </section>
    `;
  },

  /**
   * Рендерит страницу доставки
   */
  renderDeliveryPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Доставка</h2>
        <div class="text-page">
          <h3>Способы доставки</h3>
          
          <h3>1. Курьерская доставка</h3>
          <p>Доставка курьером до двери по Москве и Московской области.</p>
          <ul>
            <li>Срок: 1-2 рабочих дня</li>
            <li>Стоимость: бесплатно при заказе от 5000 ₽, иначе 350 ₽</li>
            <li>Время доставки согласовывается с менеджером</li>
          </ul>
          
          <h3>2. Самовывоз</h3>
          <p>Вы можете забрать заказ самостоятельно из нашего магазина.</p>
          <ul>
            <li>Адрес: г. Москва, ул. Цветочная, д. 15</li>
            <li>Готовность заказа: в течение 2 часов после оформления</li>
            <li>Стоимость: бесплатно</li>
          </ul>
          
          <h3>3. Почта России</h3>
          <p>Доставка в любой регион России.</p>
          <ul>
            <li>Срок: 5-14 рабочих дней</li>
            <li>Стоимость: рассчитывается индивидуально</li>
            <li>Трек-номер предоставляется</li>
          </ul>
          
          <h3>Возврат и обмен</h3>
          <p>Вы можете вернуть товар в течение 14 дней с момента получения, при сохранении товарного вида и бирок. Нижнее бельё подлежит возврату только в случае фабричного брака.</p>
        </div>
      </section>
    `;
  },

  /**
   * Рендерит страницу политики конфиденциальности
   */
  renderPrivacyPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Политика конфиденциальности</h2>
        <div class="text-page">
          <h3>1. Общие положения</h3>
          <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей интернет-магазина La Douceur.</p>
          
          <h3>2. Сбор данных</h3>
          <p>Мы собираем следующие персональные данные:</p>
          <ul>
            <li>Имя и фамилия</li>
            <li>Адрес электронной почты</li>
            <li>Номер телефона</li>
            <li>Адрес доставки</li>
            <li>История заказов</li>
          </ul>
          
          <h3>3. Цели обработки данных</h3>
          <p>Ваши данные используются для:</p>
          <ul>
            <li>Обработки и доставки заказов</li>
            <li>Связи с вами для подтверждения заказа</li>
            <li>Улучшения качества обслуживания</li>
            <li>Информирования о новинках и акциях (с вашего согласия)</li>
          </ul>
          
          <h3>4. Защита данных</h3>
          <p>Мы принимаем все необходимые меры для защиты ваших персональных данных от несанкционированного доступа, утраты или изменения.</p>
          
          <h3>5. Передача данных третьим лицам</h3>
          <p>Мы не передаём ваши персональные данные третьим лицам, за исключением случаев, необходимых для исполнения заказа (курьерские службы, платёжные системы).</p>
          
          <h3>6. Файлы cookie</h3>
          <p>Сайт использует файлы cookie для обеспечения работоспособности и улучшения качества обслуживания. Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookie.</p>
        </div>
      </section>
    `;
  },

  /**
   * Рендерит страницу оферты
   */
  renderOfferPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Публичная оферта</h2>
        <div class="text-page">
          <h3>1. Предмет оферты</h3>
          <p>Настоящий документ является официальным предложением (публичной офертой) интернет-магазина La Douceur и содержит все существенные условия продажи товаров.</p>
          
          <h3>2. Оформление заказа</h3>
          <p>Оформляя заказ на сайте, Покупатель соглашается с условиями настоящей оферты. Заказ является офертой Покупателя на приобретение товара.</p>
          
          <h3>3. Цена и оплата</h3>
          <p>Цена товара указывается на сайте магазина. Оплата производится в рублях РФ. После подтверждения заказа Покупатель получает информацию о способах оплаты.</p>
          
          <h3>4. Доставка</h3>
          <p>Доставка осуществляется способами, указанными на сайте. Сроки доставки зависят от выбранного способа и региона.</p>
          
          <h3>5. Возврат товара</h3>
          <p>Покупатель вправе отказаться от товара в течение 14 дней с момента получения, при соблюдении условий:</p>
          <ul>
            <li>Сохранён товарный вид</li>
            <li>Сохранены ярлыки и бирки</li>
            <li>Имеется документ, подтверждающий покупку</li>
          </ul>
          <p>В соответствии с Постановлением Правительства РФ №2463, нижнее бельё надлежащего качества не подлежит возврату.</p>
          
          <h3>6. Ответственность</h3>
          <p>Магазин не несёт ответственности за задержки, связанные с работой курьерских служб и почтовых операторов.</p>
        </div>
      </section>
    `;
  },

  /**
   * Рендерит страницу согласия на обработку данных
   */
  renderDataConsentPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <h2 class="section-title">Согласие на обработку персональных данных</h2>
        <div class="text-page">
          <p>Я, пользователь, оставляя свои персональные данные на сайте интернет-магазина La Douceur, даю согласие на обработку моих персональных данных в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».</p>
          
          <h3>Перечень персональных данных</h3>
          <ul>
            <li>Имя</li>
            <li>Адрес электронной почты</li>
            <li>Номер телефона</li>
            <li>Адрес доставки</li>
            <li>Данные о заказах</li>
          </ul>
          
          <h3>Цели обработки</h3>
          <ul>
            <li>Идентификация пользователя</li>
            <li>Обработка заказов</li>
            <li>Связь с пользователем</li>
            <li>Доставка товаров</li>
            <li>Информирование о статусе заказа</li>
          </ul>
          
          <h3>Действия с данными</h3>
          <p>Оператор вправе осуществлять следующие действия с персональными данными: сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, блокирование, удаление и уничтожение.</p>
          
          <h3>Срок действия согласия</h3>
          <p>Настоящее согласие действует в течение 5 лет с момента предоставления или до момента отзыва согласия путём направления письменного заявления.</p>
        </div>
      </section>
    `;
  },

  // ============================================
  // РЕНДЕР: АДМИН-ПАНЕЛЬ
  // ============================================
  
  /**
   * Рендерит админ-панель
   * Доступна только после входа как администратор
   */
  renderAdminPage() {
    // Проверяем, авторизован ли пользователь как админ
    if (!this.isAdmin()) {
      // Если не админ — показываем форму входа
      const app = document.getElementById('app');
      app.innerHTML = `
        <section class="section">
          <h2 class="section-title">Панель администратора</h2>
          <div class="text-page">
            <p>Для доступа к панели администратора необходимо войти под учётной записью администратора.</p>
            <p><strong>Email:</strong> admin@example.com</p>
            <p><strong>Пароль:</strong> admin123</p>
            <button class="btn btn-primary" id="adminLoginBtn" style="margin-top: var(--spacing-lg);">Войти как администратор</button>
          </div>
        </section>
      `;
      
      document.getElementById('adminLoginBtn').addEventListener('click', () => {
        document.getElementById('authModal').classList.add('active');
      });
      
      return;
    }
    
    // Если админ — показываем панель управления
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="section">
        <div class="admin-header">
          <h2 class="section-title" style="margin-bottom: 0;">Панель администратора</h2>
          <div>
            <span style="margin-right: var(--spacing-md);">Заказов: ${orders.length}</span>
            <span>Товаров: ${products.length}</span>
          </div>
        </div>
        
        <!-- Форма добавления/редактирования товара -->
        <div class="admin-form">
          <h3 id="adminFormTitle">Добавить товар</h3>
          <form id="adminProductForm">
            <input type="hidden" id="editProductId" value="">
            
            <div class="form-group">
              <label for="adminProductName">Название товара</label>
              <input type="text" id="adminProductName" required placeholder="Введите название">
            </div>
            
            <div class="form-group">
              <label for="adminProductPrice">Цена (₽)</label>
              <input type="number" id="adminProductPrice" required min="0" placeholder="3490">
            </div>
            
            <div class="form-group">
              <label for="adminProductOldPrice">Старая цена (₽) — необязательно</label>
              <input type="number" id="adminProductOldPrice" min="0" placeholder="4990">
            </div>
            
            <div class="form-group">
              <label for="adminProductCategory">Категория</label>
              <input type="text" id="adminProductCategory" list="categoriesList" placeholder="Бюстгальтеры, Трусики, Комплекты...">
              <datalist id="categoriesList">
                ${[...new Set(products.map(p => p.category))].map(c => `<option value="${c}">`).join('')}
              </datalist>
            </div>
            
            <div class="form-group">
              <label for="adminProductDescription">Описание</label>
              <textarea id="adminProductDescription" rows="4" required placeholder="Описание товара"></textarea>
            </div>
            
            <div class="form-group checkbox-inline">
              <input type="checkbox" id="adminProductNew">
              <label for="adminProductNew">Новинка</label>
            </div>
            
            <div class="form-group checkbox-inline">
              <input type="checkbox" id="adminProductSale">
              <label for="adminProductSale">Скидка</label>
            </div>
            
            <!-- Размерная сетка -->
            <div class="form-group">
              <label>Размерная сетка</label>
              <div class="size-grid" id="adminSizeGrid">
                <!-- Динамически добавляемые поля размеров -->
              </div>
              <button type="button" class="btn btn-secondary btn-sm" id="addSizeBtn">+ Добавить размер</button>
            </div>
            
            <!-- Загрузка фото -->
            <div class="form-group">
              <label>Фото товара</label>
              <input type="file" id="adminProductPhotos" accept="image/*" multiple>
              <div class="photo-preview" id="adminPhotoPreview">
                <!-- Превью загруженных фото -->
              </div>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="adminSaveBtn">Сохранить товар</button>
            <button type="button" class="btn btn-secondary btn-block hidden" id="adminCancelEditBtn" style="margin-top: var(--spacing-sm);">Отменить редактирование</button>
          </form>
        </div>
        
        <!-- Список товаров -->
        <div class="admin-products-list">
          <h3>Все товары</h3>
          ${products.map(p => `
            <div class="admin-product-item" data-product-id="${p.id}">
              <img src="${p.images[0]}" alt="${p.name}" class="admin-product-image">
              <div class="admin-product-info">
                <strong>${p.name}</strong>
                <p style="font-size: 0.875rem; color: var(--color-dark-gray);">
                  ${p.price.toLocaleString()} ₽ | Категория: ${p.category} | Размеры: ${Object.keys(p.sizes).join(', ')}
                </p>
              </div>
              <div class="admin-product-actions">
                <button class="btn btn-secondary btn-sm admin-edit-btn" data-product-id="${p.id}">Редактировать</button>
                <button class="btn btn-danger btn-sm admin-delete-btn" data-product-id="${p.id}">Удалить</button>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Список заказов -->
        ${orders.length > 0 ? `
          <div class="admin-products-list" style="margin-top: var(--spacing-lg);">
            <h3>Заказы</h3>
            ${orders.map(o => `
              <div class="admin-product-item">
                <div class="admin-product-info">
                  <strong>Заказ #${o.id}</strong>
                  <p style="font-size: 0.875rem; color: var(--color-dark-gray);">
                    ${new Date(o.date).toLocaleDateString('ru-RU')} | ${o.userName} | ${o.email} | ${o.total.toLocaleString()} ₽ | Статус: ${o.status}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </section>
    `;
    
    // Привязываем обработчики админки
    this.bindAdminEvents();
  },

  /**
   * Привязывает обработчики для админ-панели
   */
  bindAdminEvents() {
    // Массив для хранения загруженных фото (DataURL)
    let uploadedPhotos = [];
    
    // Добавление размера
    document.getElementById('addSizeBtn').addEventListener('click', () => {
      const sizeGrid = document.getElementById('adminSizeGrid');
      const div = document.createElement('div');
      div.className = 'size-input-group';
      div.innerHTML = `
        <input type="text" placeholder="Размер (S, M, 75B...)" class="size-name-input">
        <input type="number" placeholder="Кол-во" class="size-qty-input" min="0">
        <button type="button" class="btn btn-danger btn-sm remove-size-btn">×</button>
      `;
      sizeGrid.appendChild(div);
      
      // Обработчик удаления размера
      div.querySelector('.remove-size-btn').addEventListener('click', () => {
        div.remove();
      });
    });
    
    // Загрузка фото через FileReader
    document.getElementById('adminProductPhotos').addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedPhotos.push(event.target.result);
          this.renderAdminPhotoPreview(uploadedPhotos);
        };
        reader.readAsDataURL(file);
      });
    });
    
    // Сохранение товара
    document.getElementById('adminProductForm').addEventListener('submit', (e) => {
      e.preventDefault();
      
      const editId = document.getElementById('editProductId').value;
      const name = document.getElementById('adminProductName').value;
      const price = parseInt(document.getElementById('adminProductPrice').value);
      const oldPrice = parseInt(document.getElementById('adminProductOldPrice').value) || null;
      const category = document.getElementById('adminProductCategory').value;
      const description = document.getElementById('adminProductDescription').value;
      const isNew = document.getElementById('adminProductNew').checked;
      const isSale = document.getElementById('adminProductSale').checked;
      
      // Собираем размерную сетку
      const sizes = {};
      document.querySelectorAll('.size-input-group').forEach(group => {
        const sizeName = group.querySelector('.size-name-input').value.trim();
        const sizeQty = parseInt(group.querySelector('.size-qty-input').value) || 0;
        if (sizeName) {
          sizes[sizeName] = sizeQty;
        }
      });
      
      // Если фото не загружено — используем плейсхолдер
      const images = uploadedPhotos.length > 0
        ? uploadedPhotos
        : [this.generatePlaceholder(name, '#e8b4b8')];
      
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      
      if (editId) {
        // Редактирование существующего товара
        const product = products.find(p => p.id === parseInt(editId));
        if (product) {
          product.name = name;
          product.price = price;
          product.oldPrice = oldPrice;
          product.category = category;
          product.description = description;
          product.isNew = isNew;
          product.isSale = isSale;
          product.sizes = sizes;
          // Если загружены новые фото — заменяем, иначе оставляем старые
          if (uploadedPhotos.length > 0) {
            product.images = images;
          }
          
          localStorage.setItem('products', JSON.stringify(products));
          this.showToast('Товар обновлён', 'success');
        }
      } else {
        // Создание нового товара
        const newProduct = {
          id: Date.now(),
          name,
          price,
          oldPrice,
          category,
          description,
          isNew,
          isSale,
          sizes,
          images
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        this.showToast('Товар добавлен', 'success');
      }
      
      // Очищаем форму и перерендериваем
      this.resetAdminForm();
      this.renderAdminPage();
    });
    
    // Отмена редактирования
    document.getElementById('adminCancelEditBtn')?.addEventListener('click', () => {
      this.resetAdminForm();
    });
    
    // Кнопки редактирования
    document.querySelectorAll('.admin-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.productId);
        this.editProduct(productId);
      });
    });
    
    // Кнопки удаления
    document.querySelectorAll('.admin-delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.productId);
        if (confirm('Вы уверены, что хотите удалить этот товар?')) {
          this.deleteProduct(productId);
        }
      });
    });
  },

  /**
   * Рендерит превью загруженных фото в админке
   */
  renderAdminPhotoPreview(photos) {
    const preview = document.getElementById('adminPhotoPreview');
    if (!preview) return;
    
    preview.innerHTML = photos.map((img, i) => `
      <div class="photo-item">
        <img src="${img}" alt="Фото ${i + 1}">
        <button type="button" class="photo-remove" data-index="${i}">×</button>
      </div>
    `).join('');
    
    // Обработчики удаления фото
    preview.querySelectorAll('.photo-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        photos.splice(index, 1);
        this.renderAdminPhotoPreview(photos);
      });
    });
  },

  /**
   * Заполняет форму редактирования товара
   */
  editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Заполняем поля формы
    document.getElementById('editProductId').value = product.id;
    document.getElementById('adminProductName').value = product.name;
    document.getElementById('adminProductPrice').value = product.price;
    document.getElementById('adminProductOldPrice').value = product.oldPrice || '';
    document.getElementById('adminProductCategory').value = product.category;
    document.getElementById('adminProductDescription').value = product.description;
    document.getElementById('adminProductNew').checked = product.isNew;
    document.getElementById('adminProductSale').checked = product.isSale;
    
    // Заполняем размерную сетку
    const sizeGrid = document.getElementById('adminSizeGrid');
    sizeGrid.innerHTML = Object.entries(product.sizes).map(([size, qty]) => `
      <div class="size-input-group">
        <input type="text" value="${size}" placeholder="Размер" class="size-name-input">
        <input type="number" value="${qty}" placeholder="Кол-во" class="size-qty-input" min="0">
        <button type="button" class="btn btn-danger btn-sm remove-size-btn">×</button>
      </div>
    `).join('');
    
    // Привязываем обработчики удаления размеров
    sizeGrid.querySelectorAll('.remove-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.size-input-group').remove();
      });
    });
    
    // Показываем превью фото
    this.renderAdminPhotoPreview([...product.images]);
    
    // Меняем заголовок и кнопки
    document.getElementById('adminFormTitle').textContent = 'Редактировать товар';
    document.getElementById('adminSaveBtn').textContent = 'Сохранить изменения';
    document.getElementById('adminCancelEditBtn').classList.remove('hidden');
    
    // Прокручиваем к форме
    document.getElementById('adminProductForm').scrollIntoView({ behavior: 'smooth' });
  },

  /**
   * Удаляет товар
   */
  deleteProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    this.showToast('Товар удалён', 'success');
    this.renderAdminPage();
  },

  /**
   * Сбрасывает форму админки к начальному состоянию
   */
  resetAdminForm() {
    document.getElementById('adminProductForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('adminSizeGrid').innerHTML = '';
    document.getElementById('adminPhotoPreview').innerHTML = '';
    document.getElementById('adminFormTitle').textContent = 'Добавить товар';
    document.getElementById('adminSaveBtn').textContent = 'Сохранить товар';
    document.getElementById('adminCancelEditBtn').classList.add('hidden');
  },

  // ============================================
  // УТИЛИТЫ
  // ============================================
  
  /**
   * Показывает всплывающее уведомление
   * @param {string} message - Текст сообщения
   * @param {string} type - Тип: 'success' или 'error'
   */
  showToast(message, type = 'success') {
    // Создаём контейнер для тостов если нет
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    
    // Создаём тост
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

// ============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// ============================================

// Дожидаемся загрузки DOM и инициализируем приложение
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
