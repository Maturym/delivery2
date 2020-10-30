'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'



const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const swiperContainer = document.querySelector('.swiper-container');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

let returnObj = JSON.parse(localStorage.getItem("myKey"));

let login = returnObj? returnObj.login: '';

let password = returnObj? returnObj.password: '';

let cart = JSON.parse(localStorage.getItem('cartInfo')) || [];

function saveCart() {
  localStorage.setItem('cartInfo' , JSON.stringify(cart))
};


const validName = (str) => {
  const regName = /^[a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
};

// const validPassword = (str) => {
//   const regName = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
//   return regName.test(str);
// };

const getData = async function(url) {

  const response =  await fetch(url);

  if (!response.ok) {
      throw new Error(`Ошибка по адресу ${url},
       статус ошибки ${response.status}`)
  } 

  return await response.json();

};

function toggleModal() {
  modal.classList.toggle("is-open");
};

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
  if (modalAuth.classList.contains('is-open')) {
    disablescroll();
  } else {
    enablesroll();
  }
};

const authorized = () => {
  userName.textContent = login;

  const logOut = () => {
    login = null;
    localStorage.removeItem('cart');
    localStorage.removeItem('myKey');
    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';
    cartButton.style.display = 'flex';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'flex';
  userName.style.display = 'inline';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
};


const notAuthorized = () => {
  const logIn = (e) => {
    e.preventDefault();
    login = loginInput.value;
    password = passwordInput.value;
    const obj = {
      login:loginInput.value,
      password:passwordInput.value,
    };

    if (!validName(obj.login) || !validName(obj.password)) {
      loginInput.style.border = '1px solid red';
      passwordInput.style.border = '1px solid red';
    } else {
      const userData = JSON.stringify(obj);

      localStorage.setItem("myKey", userData);

      //localStorage.setItem("cart", []);
      // localStorage.setItem('pizza', login);
      // localStorage.setItem('pizza', password);

      toggleModalAuth();
      logInForm.removeEventListener('submit', logIn);
      buttonAuth.removeEventListener('click', toggleModalAuth);  
      closeAuth.removeEventListener('click', toggleModalAuth);
      checkAuth();
    }
  };

  logInForm.addEventListener('submit', logIn);
  buttonAuth.addEventListener('click', toggleModalAuth); 
  closeAuth.addEventListener('click', toggleModalAuth);
  modalAuth.addEventListener('click', (e) => {
    if (e.target.classList.contains('is-open')){
      toggleModalAuth();
    }
  });
};

const checkAuth = () => {
  if (login) {

    authorized();
  } else {
    notAuthorized();
  }
};


const createCardRestaurant = ({ name, time_of_delivery, stars,
   price, kitchen, image, products }) => {

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = "card card-restaurant";
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, price, name, stars };


  const card = `
      <img src=${image} alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${time_of_delivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
  `;

  cardRestaurant.insertAdjacentHTML('beforeend', card)

  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
};


const createCardGood = ({ description, id, image, name, price }) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = id;

  card.insertAdjacentHTML('beforeend', `
      <img src=${image} alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend' ,card)

};

const openGoods = (e) => {
  const target = e.target.closest('.card-restaurant');

  if (target) {

    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    swiperContainer.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    restaurantTitle.textContent = `${target.info.name}`;
    restaurantRating.textContent = `${target.info.stars}`;
    restaurantPrice.textContent = `от ${target.info.price} ₽`;
    restaurantCategory.textContent = `${target.info.kitchen}`;

    // location.hash = `#${target.info.name}`;

    getData(`./db/${target.products}`).then(data => {
      data.forEach(createCardGood);
    });
  }
};

const addToCart = (e) => {

  const target = e.target.closest('button');
  

  if (target) {
    const card = e.target.closest('.card');
    const title = card.querySelector('.card-title').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = card.id;

    const food = cart.find((item) => {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({ id, cost, title, count: 1 });
    };

  };
  // const cartData = JSON.stringify(cart);
  // localStorage.setItem("cart", cartData);

};

const renderCart = () => {
  modalBody.textContent = '';

  cart.forEach((item) => {
    const itemCart = `
      <div class="food-row">
      <span class="food-name">${item.title}</span>
        <strong class="food-price">${item.cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${item.id}>-</button>
          <span class="counter">${item.count}</span>
          <button class="counter-button counter-plus" data-id=${item.id}>+</button>
        </div>
      </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => {
    return result + parseFloat(item.cost)*item.count;
  }, 0); 

  modalPrice.textContent = totalPrice + " ₽";

  console.log(cart);
  saveCart();

  // const cartData = JSON.stringify(cart);
  // localStorage.setItem("cart", cartData);
};

const changeCount = (e) => {
  const target = e.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find((item) => {
    return item.id === target.dataset.id;
    });

    if (target.classList.contains('counter-minus')) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1)
      }
    };

    if (target.classList.contains('counter-plus')) food.count++;

    renderCart();  
  }
};

function init() {
  getData('./db/partners.json').then(data => {
    data.forEach(createCardRestaurant)
  });

  buttonClearCart.addEventListener('click', () => {
    cart.length = 0;
    localStorage.removeItem('cart');
    renderCart();
  });

  cardsMenu.addEventListener('click', addToCart);
  
  cardsRestaurants.addEventListener('click', () => {
    if (!login) {
      toggleModalAuth();
    } else {
      openGoods(event);
    }
  });
  
  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
    swiperContainer.classList.remove('hide');
  });
  
  cartButton.addEventListener("click", () => {
    renderCart();
    toggleModal();
  });
  
  close.addEventListener("click", toggleModal);
  
  checkAuth();

  modalBody.addEventListener('click', changeCount);

  inputSearch.addEventListener('keypress', (e) => {

    if (e.charCode === 13 ) {

      const value = e.target.value.trim();

      if (!value) {
        e.target.style.border = '5px solid red';
        e.target.value = '';
        setTimeout(() => {
          e.target.style.border = '';
        }, 1500);
        return;
      };

      getData('../db/partners.json')
        .then(data => {
          return data.map((partner) => {
            return partner.products;
          });
        })
        .then((linksProduct) => {
          cardsMenu.textContent = '';

          linksProduct.forEach(link => {
            getData(`./db/${link}`)
              .then(data => {

                const resultSearch = data.filter((item) => {
                  return item.name.toLowerCase().includes(value.toLowerCase());
                });

                containerPromo.classList.add('hide');
                swiperContainer.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                restaurantTitle.textContent = 'Результаты поиска';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = '';
                restaurantCategory.textContent = '';

                resultSearch.forEach(createCardGood)

              })
          })
        })
    }
  });
  
  
  //slider
  
  new Swiper('.swiper-container', {
    sliderPerView: 1,
    effect: 'fade',
    loop: true,
    mousewheel: false,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
    },
    keyboard: {
      enabled: true,
    },
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
};



init();












