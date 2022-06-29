'use strict';
(function () {
  var URL_GET = 'https://gvenya.github.io/keksby-data-new/pins-data.json';//'https://js.dump.academy/keksobooking/data';
  var locationParams = {
    MIN_LOCATION_Y: 130,
    MAX_LOCATION_Y: 630,
    MIN_LOCATION_X: 0,
    MAX_LOCATION_X: 1200,
    INITIAL_LEFT_POS: 570,
    INITIAL_TOP_POS: 375
  };

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var isPageActivated;
  var loadedPins = [];
  var filterForm = document.querySelector('.map__filters');
  var selectFeaturesArea = document.querySelector('#housing-features');

  // функция проверяет, не выходит ли за границы доступной области main-pin
  function validateCoord(coord, minValue, maxValue) {
    coord = coord < minValue ? minValue : coord;
    coord = coord > maxValue ? maxValue : coord;

    return coord;
  }

  // обработчик удачной загрузки похожих объявлений
  function successLoadHandler(data) {
    loadedPins = data;
    window.pin.render(window.utils.shuffleArray(loadedPins));
  }

  function mainPinMouseDownHandler(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function mainPinMouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var validatedX = validateCoord(mainPin.offsetLeft - shift.x, locationParams.MIN_LOCATION_X - 0.5 * mainPin.offsetWidth,
          locationParams.MAX_LOCATION_X - 0.5 * mainPin.offsetWidth);
      var validatedY = validateCoord(mainPin.offsetTop - shift.y, locationParams.MIN_LOCATION_Y - mainPin.offsetHeight,
          locationParams.MAX_LOCATION_Y - mainPin.offsetHeight);
      window.utils.setupStyleLeftTop(mainPin, validatedX, validatedY);

      window.form.fillAddressField(Math.round(parseInt(mainPin.style.left, 10) + 0.5 * mainPin.offsetWidth),
          Math.round(parseInt(mainPin.style.top, 10) + mainPin.offsetHeight));
    }

    function mainPinMouseUpHandler(upEvt) {
      upEvt.preventDefault();
      if (isPageActivated) {
        /*
        window.form.activate();
        window.filtering.activate();
        window.backend.load(successLoadHandler, window.notifications.notifyOfError, URL_GET);
        map.classList.remove('map--faded');
        isPageActivated = false;
        */
        fetch(URL_GET).then(response => response.json())
        .then(function (data)  {
          loadedPins = data;
          window.pin.render(window.utils.shuffleArray(loadedPins));
          window.form.activate();
          isPageActivated = false;
        });
      }

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      document.removeEventListener('mouseup', mainPinMouseUpHandler);
    }

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  window.main = {
    deactivate: function () {
      isPageActivated = true;
      window.form.deactivate();
      // window.filtering.reset();
      window.filtering.deactivate();
      window.utils.setupStyleLeftTop(mainPin, locationParams.INITIAL_LEFT_POS, locationParams.INITIAL_TOP_POS);
      window.form.fillAddressField(Math.floor(parseInt(mainPin.style.left, 10) + 0.5 * mainPin.offsetWidth),
          Math.floor(parseInt(mainPin.style.top, 10) + 0.5 * mainPin.offsetHeight, 10));
      window.pin.delete();
      window.card.remove();
      map.classList.add('map--faded');
    }
  };

  window.main.deactivate();
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);

  filterForm.addEventListener('change', function (evt) {
    window.filtering.filterSelectChangeHandler(evt, loadedPins);
  });
  selectFeaturesArea.addEventListener('change', function (evt) {
    window.filtering.filterFeatureChangeHandler(evt, loadedPins);
  });
})();
