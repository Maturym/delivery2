const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}


///day 1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('pizza');

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

checkAuth();










