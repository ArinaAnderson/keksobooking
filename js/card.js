'use strict';
(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var map = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters-container');
  var activeCard;
  var offerTypeEngToRus = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'bungalo': 'Бунгало',
    'house': 'Дом'
  };

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

  function addNewImage(src) {
    var image = document.createElement('img');
    image.src = src;
    image.alt = 'Фотография жилья';
    image.width = '45';
    image.height = '40';
    image.classList.add('popup__photo');

    return image;
  }

  function addListItem(elemClass, modifier) {
    var li = document.createElement('li');
    li.classList.add(elemClass);
    elemClass += '--' + modifier;
    li.classList.add(elemClass);

    return li;
  }

  function renderCard(offerData) {
    var card = cardTemplate.cloneNode(true);
    card.querySelector('.popup__title').textContent = offerData.offer.title;
    card.querySelector('.popup__text--address').textContent = offerData.offer.address;
    card.querySelector('.popup__text--price').textContent = offerData.offer.price + ' ₽/ночь';
    card.querySelector('.popup__text--capacity').textContent = offerData.offer.rooms + ' ' + defineRoomEnding(offerData.offer.rooms) + ' для '
      + offerData.offer.guests + ' ' + defineGuestEnding(offerData.offer.guests);
    card.querySelector('.popup__type').textContent = offerTypeEngToRus[offerData.offer.type];
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

  function cardEscPressHandler(evt) {
    window.utils.isEscPress(evt, function () {
      window.card.remove();
      window.pin.deactivate();
    });
  }

  function clickCardBtnHandler() {
    window.card.remove();
    window.pin.deactivate();
  }

  window.card = {
    add: function (offerData) {
      var fragment = document.createDocumentFragment();
      activeCard = fragment.appendChild(renderCard(offerData));
      map.insertBefore(fragment, mapFilters);
      var btn = activeCard.querySelector('.popup__close');
      btn.focus();
      btn.addEventListener('click', clickCardBtnHandler);
      document.addEventListener('keydown', cardEscPressHandler);
    },
    remove: function () {
      if (activeCard) {
        activeCard.parentElement.removeChild(activeCard);
        document.removeEventListener('keydown', cardEscPressHandler);
      }
      activeCard = null;
    }
  };
})();
