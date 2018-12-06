'use strict';

(function () {
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

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');

  function getImageAddress(varPart) {
    var constPartNumber = varPart < 10 ? '0' : '';

    return 'img/avatars/user' + constPartNumber + varPart + '.png';
  }

  function createOffer(num) {
    var x = window.utils.getRandomNumber(mainPin.offsetWidth * 0.5, locationParams.MAX_LOCATION_X + 1 - mainPin.offsetWidth * 0.5);
    var y = window.utils.getRandomNumber(locationParams.MIN_LOCATION_Y, locationParams.MAX_LOCATION_Y + 1);
    return {
      author: {
        avatar: getImageAddress(num + 1)
      },
      offer: {
        title: OFFER_TITILES[num],
        address: x + ', ' + y,
        price: window.utils.getRandomNumber(MIN_PRICE, MAX_PRICE + 1),
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        rooms: window.utils.getRandomNumber(MIN_ROOM_NUM, MAX_ROOM_NUM + 1),
        guests: window.utils.getRandomNumber(MIN_GUESTS_NUM, MAX_GUESTS_NUM + 1),
        checkin: CHECKINS[Math.floor(Math.random() * CHECKINS.length)],
        checkout: CHECKOUTS[Math.floor(Math.random() * CHECKOUTS.length)],
        features: window.utils.shuffleArray(FEATURES).slice(0, window.utils.getRandomNumber(1, num)),
        description: '',
        photos: window.utils.shuffleArray(PHOTOS)
      },
      location: {
        x: x,
        y: y
      }
    };
  }

  window.createData = function (number) {
    var offersArray = [];
    for (var i = 0; i < number; i++) {
      offersArray.push(createOffer(i));
    }
    return offersArray;
  };
})();
