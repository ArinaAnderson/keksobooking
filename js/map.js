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
var locationParams = {
  MIN_LOCATION_Y: 130,
  MAX_LOCATION_Y: 630,
  MIN_LOCATION_X: 0,
  MAX_LOCATION_X: 1200
};
var pinParams = {
  WIDTH: 50,
  HEIGHT: 70
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

function activateMap() {
  map.classList.remove('map--faded');
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

  return guestsNum[guestsNum.length - 1] === '1' ? 'гостя' : 'гостей';
}

function defineRoomEnding(rooms) {
  var roomsNum = rooms.toString();
  var roomWord;
  /*switch (roomsNum[roomsNum.length - 1]) {
    case '1':
      roomWord = 'комната';
      break;
    case '2' || '3' || '4':
      roomWord = 'комнаты';
      break;
    default:
      roomWord = 'комнат';
  }*/
  roomWord = roomsNum[roomsNum.length - 1] === '1' ? 'комната' : (roomsNum[roomsNum.length - 1] === '2' ||
    roomsNum[roomsNum.length - 1] === '3' || roomsNum[roomsNum.length - 1] === '4') ? 'комнаты' :'комнат';
  return roomWord;
}

function createOfferData(num) {
  var x = getRandomNumber(pinParams.WIDTH / 2, locationParams.MAX_LOCATION_X + 1 - pinParams.WIDTH / 2);
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
  pin.style = 'left: ' + (offerData.location.x - pinParams.WIDTH / 2) +
  'px; top: ' + (offerData.location.y - pinParams.HEIGHT) + 'px';
  pin.querySelector('img').src = offerData.author.avatar;
  pin.querySelector('img').alt = offerData.offer.title;

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
  var offers = [];
  for (var i = 0; i < number; i++) {
    offers.push(createOfferData(i));
  }

  return offers;
}

function renderPins(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderPin(offersData[i]));
  }
  mapPins.appendChild(fragment);
}

function renderCards(offersData) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < offersData.length; i++) {
    fragment.appendChild(renderCard(offersData[i]));
  }
  map.insertBefore(fragment, mapFilters);
}

var offers = createOffersList(OFFERS_NUMBER);
renderPins(offers);
renderCards(offers);
activateMap();
