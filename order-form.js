(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var order = document.querySelector('.order');
  var oderCloseBtn = document.querySelector('.order__close-btn');
  var datePicker = document.querySelector('.date-picker');

  oderCloseBtn.classList.remove('order__close-btn--no-js');

  oderCloseBtn.addEventListener('click', function () {
    order.classList.add('order--none');
  });

  /*document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE && !order.classList.contains('order--none')
      && datePicker.classList.contains('date-picker--none')) {console.log(datePicker.classList.contains('date-picker--none'));
      evt.preventDefault();
      order.classList.add('order--none');
    }
  });*/


  var messageTextToFieldId = {
    'name': 'Как к вам можно обращаться?',
    'phone': 'Нам нужен ваш телефон для связи',
    'email': 'Неверный формат. Пример: example@example.com'
  }
  var nameInput = document.querySelector('input[name="name"]');
  var nameMessage = document.querySelector('.order__message--name');
  var phoneInput = document.querySelector('input[name="phone"]');
  var phoneMessage = document.querySelector('.order__message--phone');
  var emailInput = document.querySelector('input[name="email"]');
  var emailMessage = document.querySelector('.order__message--email');
  var submitBtn = document.querySelector('.order__submit');
  var orderForm = document.querySelector('.order__form');
  var orderSelect = document.querySelector('.order__select');
  var orderCountInput = document.querySelector('.order__count');
  var orderBuffer = document.querySelector('.order__buffer');

  orderCountInput.readOnly = true;
  // автоматическая ширина поля ввода количества людей:
  var orderCountInitWidth = orderCountInput.offsetWidth;
  orderCountInput.addEventListener('input', function () {
    orderBuffer.textContent = orderCountInput.value;
    orderCountInput.style.width = (orderCountInitWidth + orderBuffer.offsetWidth) + 'px';
  });
  // стилизация option (цвет текста):
  orderSelect.addEventListener('change', function (evt) {
    if (evt.target.firstElementChild.selected) {
      evt.target.style.color = '#a36100';
    } else {
      evt.target.style.color = '#000000';
    }
  });

  // валидация полей Эмейл, Имя, Телефон:
  function clearErrorStatus(evt) {
    evt.target.classList.remove('order__input--error');
    evt.target.parentNode.nextElementSibling.textContent = "";
  }
  nameInput.addEventListener('focus', clearErrorStatus);
  phoneInput.addEventListener('focus', clearErrorStatus);
  emailInput.addEventListener('focus', clearErrorStatus);

  function customizeValidation(evt) {
    //prevent browser from showing native validation message
    evt.preventDefault();
    evt.target.classList.add('order__input--error');
    evt.target.parentNode.nextElementSibling.textContent = messageTextToFieldId[evt.target.id];
  }
  nameInput.addEventListener('invalid', customizeValidation, false);
  phoneInput.addEventListener('invalid', customizeValidation, false);
  emailInput.addEventListener('invalid', customizeValidation, false);

  // обработчики для кнопок увеличения/уменьшения количества людей:
  var minusBtn = document.querySelector('.order__count-btn--minus');
  var plusBtn = document.querySelector('.order__count-btn--plus');
  var countBtns = document.querySelectorAll('.order__count-btn');
  var personNum = document.querySelector('.order__count');

  function minusBtnPressHandler() {
    if (parseInt(personNum.textContent) !== 1) {
      if (parseInt(personNum.textContent) - 1 === 1) {
        minusBtn.disabled = true;
        minusBtn.classList.add('order__count-btn--disabled');
      }
      //personNum.textContent = (parseInt(personNum.textContent) - 1) + '';
      personNum.value = (parseInt(personNum.value) - 1) + '';
      orderBuffer.textContent = orderCountInput.value;
      orderCountInput.style.width = (orderCountInitWidth + orderBuffer.offsetWidth) + 'px';
    }
  }

  function plusBtnPressHandler() {
    if (minusBtn.disabled) {
      minusBtn.disabled = false;
      minusBtn.classList.remove('order__count-btn--disabled');
    }
    //personNum.textContent = (parseInt(personNum.textContent) + 1) + '';
    personNum.value = (parseInt(personNum.value) + 1) + '';
    orderBuffer.textContent = orderCountInput.value;
    orderCountInput.style.width = (orderCountInitWidth + orderBuffer.offsetWidth) + 'px';
  }

  minusBtn.addEventListener('click', minusBtnPressHandler);
  plusBtn.addEventListener('click', plusBtnPressHandler);
  plusBtn.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      plusBtnPressHandler();
    }
  });
  minusBtn.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      minusBtnPressHandler();
    }
  });
})();



