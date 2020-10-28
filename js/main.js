'use strict';


const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');


let login = localStorage.getItem('pizza');


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
  console.log('авторизован');
  userName.textContent = login;

  const logOut = () => {
    login = null;
    localStorage.removeItem('pizza');
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
  console.log('не авторизован');

  const logIn = (e) => {
    e.preventDefault();
    login = loginInput.value;

    if (!login.trim()) {
      loginInput.style.border = '1px solid red';
    } else {
      localStorage.setItem('pizza', login);

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


const createCardRestaurant = () => {

  const card = `
    <a class="card card-restaurant">
      <img src="img/gusi-lebedi/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Гуси Лебеди</h3>
          <span class="card-tag tag">75 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 1 000 ₽</div>
          <div class="category">Русская кухня</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);

};


const createCardGood = () => {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
      <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">Пицца Классика</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями,
            грибы.
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">510 ₽</strong>
        </div>
      </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend' ,card)

};

const openGoods = (e) => {
  const target = e.target.closest('a');

  if (target) {
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    cardsMenu.textContent = '';

    createCardGood();
  }

};


cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', () => {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
});

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

checkAuth();

createCardRestaurant();










