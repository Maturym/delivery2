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


let returnObj = JSON.parse(localStorage.getItem("myKey"));

let login = returnObj? returnObj.login: '';

let password = returnObj? returnObj.password: '';

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
    localStorage.removeItem('myKey');
    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  userName.style.display = 'inline';

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

  const card = `
    <a class="card card-restaurant" data-products="${products}">
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
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);

};


const createCardGood = ({ description, id, image, name, price }) => {
  const card = document.createElement('div');
  card.className = 'card';

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
          <strong class="card-price-bold">${price} ₽</strong>
        </div>
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend' ,card)

};

const openGoods = (e) => {
  const target = e.target.closest('a');

  if (target) {

    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    swiperContainer.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    getData(`./db/${target.dataset.products}`).then(data => {
      data.forEach(createCardGood)
    });
  }

};

function init() {
  getData('./db/partners.json').then(data => {
    data.forEach(createCardRestaurant)
  });
  
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
  
  cartButton.addEventListener("click", toggleModal);
  
  close.addEventListener("click", toggleModal);
  
  checkAuth();
  
  
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
}

init();












