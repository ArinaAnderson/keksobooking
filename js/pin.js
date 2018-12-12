'use strict';
(function () {
  var OFFERS_NUMBER = 5;
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPins = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var activePin;

  function renderPin(offerData) {
    var pin = pinTemplate.cloneNode(true);
    pin.style = 'left: ' + (offerData.location.x - mainPin.offsetWidth * 0.5) +
    'px; top: ' + (offerData.location.y - mainPin.offsetHeight) + 'px';
    pin.querySelector('img').src = offerData.author.avatar;
    pin.querySelector('img').alt = offerData.offer.title;
    pin.addEventListener('click', function (evt) {
      activatePin(pin);
      window.card.remove();
      activePin = evt.currentTarget;
      window.card.add(offerData);
    });
    return pin;
  }

  function activatePin(pin) {
    window.pin.deactivate();
    pin.classList.add('map__pin--active');
  }

  window.pin = {
    render: function (offersData) {
      var fragment = document.createDocumentFragment();
      var offersNum = offersData.length > OFFERS_NUMBER ? OFFERS_NUMBER : offersData.length;
      for (var i = 0; i < offersNum; i++) {
        fragment.appendChild(renderPin(offersData[i]));
      }
      mapPins.appendChild(fragment);
    },
    deactivate: function () {
      if (activePin) {
        activePin.classList.remove('map__pin--active');
        activePin.focus();
      }
    },
    delete: function () {
      var nextPin = mainPin.nextElementSibling;
      while (nextPin) {
        nextPin.parentElement.removeChild(nextPin);
        nextPin = mainPin.nextElementSibling;
      }
    },
    update: function (loadedPins) {
      window.card.remove();
      window.pin.delete(mainPin);
      var selectedPins = window.filtering.filterPins(loadedPins);
      window.pin.render(selectedPins);
    }
  };
})();
