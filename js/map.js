'use strict';

var OFFERS_NUMBER = 8;
var OFFER_TITILES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAX_PRICE = 1000000;
var MIN_PRICE = 1000;
var MAX_ROOM_NUM = 5;
var MIN_ROOM_NUM = 1;
var MAX_GUESTS_NUM = 15;
var MIN_GUESTS_NUM = 1;
var CHECKINS = ['12:00', '13:00', '14:00'];
var CHECKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var ESC_KEYCODE = 27;
var locationParams = {
  MIN_LOCATION_Y: 130,
  MAX_LOCATION_Y: 630,
  MIN_LOCATION_X: 0,
  MAX_LOCATION_X: 1200,
  INITIAL_LEFT_POS: 570,
  INITIAL_TOP_POS: 375
};

var offerTypeListMap = {
  'flat': 'Квартира',
  'palace': 'Дворец',
  'bungalo': 'Бунгало',
  'house': 'Дом'
};
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapFilters = document.querySelector('.map__filters-container');
var fieldsets = document.querySelectorAll('fieldset');
var selectItems = document.querySelectorAll('select');
var mainPin = document.querySelector('.map__pin--main');
var offerForm = document.querySelector('.ad-form');
var addressInput = offerForm.querySelector('input[name="address"]');
var isPageActivated;
var offers;
var activePin;
var activeCard;

function onEscPress(evt, callback) {
  if (evt.keyCode === ESC_KEYCODE) {
    callback();
  }
}

// typeSelect <--> priceinput
var offerTypePriceListMap = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
}
var priceInput = document.querySelector('input[name="price"]');
var typeSelect = document.querySelector('select[name="type"]');
function setPriceMin() {
  var typeValue = typeSelect.value;
  priceInput.min = offerTypePriceListMap[typeValue];
  priceInput.placeholder = offerTypePriceListMap[typeValue];
}
function typeSelectHandler() {
  setPriceMin();
}

// установка соответствия времени заезда и выезда
var checkinSelect = document.querySelector('select[name="timein"]');
var checkoutSelect = document.querySelector('select[name="timeout"]');
function validateCheckout() {
  if (checkoutSelect.value !== checkinSelect.value) {
    checkoutSelect.setCustomValidity('Время выезда должно быть ' + checkinSelect.value);
  } else {
    checkoutSelect.setCustomValidity('');
  }
}
function timeSelectHandler() {
  validateCheckout();
}

// гости - количество комнат:
var roomsSelect = document.querySelector('select[name="rooms"]');
var guestsSelect = document.querySelector('select[name="capacity"]');
var roomsGuestsListMap = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};
function getErrorText() {
  var errorText = [];
  for (var i = 0; i < roomsGuestsListMap[roomsSelect.value].length; i++) {
    errorText.push(guestsSelect.querySelector('option[value="' + roomsGuestsListMap[roomsSelect.value][i] + '"]').textContent);
  }

  return errorText;
}
function validateGuestNum() {
  if (roomsGuestsListMap[roomsSelect.value].indexOf(guestsSelect.value) < 0) {
    guestsSelect.setCustomValidity('Такое количество комнат предусмотрено ' + getErrorText().join(', или '));
  } else {
    guestsSelect.setCustomValidity('');
  }
}
function guestNumSelectHandler() {
  validateGuestNum();
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getImageAddress(varPart) {
  var constPartNumber = varPart < 10 ? '0' : '';

  return 'img/avatars/user' + constPartNumber + varPart + '.png';
}

// создание нового элемента изображения
function addNewImage(src) {
  var image = document.createElement('img');
  image.src = src;
  image.alt = 'Фотография жилья';
  image.width = '45';
  image.height = '40';
  image.classList.add('popup__photo');

  return image;
}

// создание нового элемента нового пункта списка
function addListItem(elemClass, modifier) {
  var li = document.createElement('li');
  li.classList.add(elemClass);
  elemClass += '--' + modifier;
  li.classList.add(elemClass);

  return li;
}

function shuffleArray(list) {
  for (var i = list.length - 1; i > 0; i--) {
    var randomNum = Math.floor(Math.random() * (i + 1));
    var randomElement = list[randomNum];
    list[randomNum] = list[i];
    list[i] = randomElement;
  }

  return list;
}

function defineGuestEnding(guests) {
  var guestsNum = guests.toString();
  if (guestsNum[guestsNum.length - 1] === '1' &&
      guestsNum.substring(guestsNum.length - 2, guestsNum.length) !== '11') {
    return 'гостя';
  }
  return 'гостей';
}

function defineRoomEnding(rooms) {
  var roomsNum = rooms.toString();
  if (roomsNum[roomsNum.length - 1] === '1' && roomsNum.substring(roomsNum.length - 2, roomsNum.length) !== '11') {
    return 'комната';
  }
  if (roomsNum[roomsNum.length - 1] === '2' && roomsNum.substring(roomsNum.length - 2, roomsNum.length) !== '12' ||
      roomsNum[roomsNum.length - 1] === '3' && roomsNum.substring(roomsNum.length - 2, roomsNum.length) !== '13' ||
      roomsNum[roomsNum.length - 1] === '4' && roomsNum.substring(roomsNum.length - 2, roomsNum.length) !== '14') {
    return 'комнаты';
  }
  return 'комнат';
}

function createOfferData(num) {
  var x = getRandomNumber(mainPin.offsetWidth * 0.5, locationParams.MAX_LOCATION_X + 1 - mainPin.offsetWidth * 0.5);
  var y = getRandomNumber(locationParams.MIN_LOCATION_Y, locationParams.MAX_LOCATION_Y + 1);
  return {
    author: {
      avatar: getImageAddress(num + 1)
    },
    offer: {
      title: OFFER_TITILES[num],
      address: x + ', ' + y,
      price: getRandomNumber(MIN_PRICE, MAX_PRICE + 1),
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
      rooms: getRandomNumber(MIN_ROOM_NUM, MAX_ROOM_NUM + 1),
      guests: getRandomNumber(MIN_GUESTS_NUM, MAX_GUESTS_NUM + 1),
      checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
      checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
      features: shuffleArray(FEATURES).slice(0, getRandomNumber(1, num)),
      description: '',
      photos: shuffleArray(PHOTOS)
    },
    location: {
      x: x,
      y: y
    }
  };
}

function renderPin(offerData) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: ' + (offerData.location.x - mainPin.offsetWidth * 0.5) +
  'px; top: ' + (offerData.location.y - mainPin.offsetHeight) + 'px';
  pin.querySelector('img').src = offerData.author.avatar;
  pin.querySelector('img').alt = offerData.offer.title;
  pin.addEventListener('click', function (evt) {
    activatePin(pin);
    removeCard();
    activePin = evt.currentTarget;
    addCard(offerData);
  });
  return pin;
}

function renderCard(offerData) {
  var card = cardTemplate.cloneNode(true);
  card.querySelector('.popup__title').textContent = offerData.offer.title;
  card.querySelector('.popup__text--address').textContent = offerData.offer.address;
  card.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
  card.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' ' + defineRoomEnding(offerData.offer.rooms) + ' для '
    + offerData.offer.guests + ' ' + defineGuestEnding(offerData.offer.guests);
  card.querySelector('.popup__type').textContent = offerTypeListMap[offerData.offer.type];
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + offerData.offer.checkin + ', выезд до ' + offerData.offer.checkout;

  var featuresFragment = document.createDocumentFragment();
  for (var i = 0; i < offerData.offer.features.length; i++) {
    var newLi = addListItem('popup__feature', offerData.offer.features[i]);
    featuresFragment.appendChild(newLi);
  }
  card.querySelector('.popup__features').appendChild(featuresFragment);

  card.querySelector('.popup__description').textContent = offerData.offer.description;

  var photosFragment = document.createDocumentFragment();
  for (var j = 0; j < offerData.offer.photos.length; j++) {
    var newImg = addNewImage(offerData.offer.photos[j]);
    photosFragment.appendChild(newImg);
  }
  card.querySelector('.popup__photos').appendChild(photosFragment);

  card.querySelector('.popup__avatar').src = offerData.author.avatar;

  return card;
}

function createOffersList(number) {
  var offersArray = [];
  for (var i = 0; i < number; i++) {
    offersArray.push(createOfferData(i));
  }
  return offersArray;
}

function renderPins(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderPin(offersData[i]));
  }
  mapPins.appendChild(fragment);
}

function activatePin(pin) {
  deactivatePin();
  pin.classList.add('map__pin--active');
}

function deactivatePin() {
  if (activePin) {
    activePin.classList.remove('map__pin--active');
    activePin.focus();
  }
}

function addCard(offerData) {
  var fragment = document.createDocumentFragment();
  activeCard = fragment.appendChild(renderCard(offerData));
  map.insertBefore(fragment, mapFilters);
  var btn = activeCard.querySelector('.popup__close');
  btn.focus();
  btn.addEventListener('click', clickCardBtnHandler);
  document.addEventListener('keydown', cardEscPressHandler);
}

function cardEscPressHandler(evt) {
  onEscPress(evt, function () {
    removeCard();
    deactivatePin();
  });
}

function removeCard() {
  if (activeCard) {
    activeCard.parentElement.removeChild(activeCard);
    document.removeEventListener('keydown', cardEscPressHandler);
  }
  activeCard = null;
}

function clickCardBtnHandler() {
  removeCard();
  deactivatePin();
}

function manageFormElems(elementList, disable) {
  for (var i = 0; i < elementList.length; i++) {
    elementList[i].disabled = disable;
  }
}

function activateForms() {
  manageFormElems(fieldsets, false);
  manageFormElems(selectItems, false);
  map.classList.remove('map--faded');
  offerForm.classList.remove('ad-form--disabled');
}

function deactivateForms() {
  manageFormElems(fieldsets, true);
  manageFormElems(selectItems, true);
  map.classList.add('map--faded');
  offerForm.classList.add('ad-form--disabled');
}

function validateForms() {
  typeSelect.addEventListener('change', typeSelectHandler);
  checkinSelect.addEventListener('change', timeSelectHandler);
  checkoutSelect.addEventListener('change', timeSelectHandler);
  roomsSelect.addEventListener('change', guestNumSelectHandler);
  guestsSelect.addEventListener('change', guestNumSelectHandler);
}

function fillAddressField(x, y) {
  addressInput.value = x + ', ' + y;
}

function setupMainPin(x, y) {
  mainPin.style.left = x + 'px';
  mainPin.style.top = y + 'px';
}

function deletePins() {
  var nextBtn = mainPin.nextElementSibling;
  while (nextBtn) {
    nextBtn.parentElement.removeChild(nextBtn);
    nextBtn = mainPin.nextElementSibling;
  }
}

function deactivatePage() {
  isPageActivated = true;
  offers = createOffersList(OFFERS_NUMBER);
  deactivateForms();
  setupMainPin(locationParams.INITIAL_LEFT_POS, locationParams.INITIAL_TOP_POS);
  fillAddressField(Math.floor(parseInt(mainPin.style.left, 10) + 0.5 * parseInt(mainPin.offsetWidth, 10)),
      Math.floor(parseInt(mainPin.style.top, 10) + 0.5 * parseInt(mainPin.offsetHeight, 10)));
  deletePins();
  removeCard();
}

deactivatePage();

mainPin.addEventListener('mouseup', function () {
  if (isPageActivated) {
    activateForms();
    validateForms();
    renderPins(offers);
    fillAddressField(Math.floor(parseInt(mainPin.style.left, 10) + 0.5 * mainPin.offsetWidth),
        Math.floor(parseInt(mainPin.style.top, 10) + 0.5 * mainPin.offsetHeight));
  }
  isPageActivated = false;
});
