'use strict';

(function () {
  var OFFERS_NUMBER = 8;
  var locationParams = {
    MIN_LOCATION_Y: 130,
    MAX_LOCATION_Y: 630,
    MIN_LOCATION_X: 0,
    MAX_LOCATION_X: 1200,
    INITIAL_LEFT_POS: 570,
    INITIAL_TOP_POS: 375
  };

  var mainPin = document.querySelector('.map__pin--main');
  var isPageActivated;
  var offers;

  function deactivatePage() {
    isPageActivated = true;
    offers = window.createData(OFFERS_NUMBER);
    window.form.deactivate();
    window.utils.setupStyleLeftTop(mainPin, locationParams.INITIAL_LEFT_POS, locationParams.INITIAL_TOP_POS);
    window.form.fillAddressField(Math.floor(parseInt(mainPin.style.left, 10) + 0.5 * mainPin.offsetWidth),
        Math.floor(parseInt(mainPin.style.top, 10) + 0.5 * mainPin.offsetHeight, 10));
    window.pin.delete();
    window.card.remove();
  }

  function validateCoord(coord, minValue, maxValue) {
    coord = coord < minValue ? minValue : coord;
    coord = coord > maxValue ? maxValue : coord;

    return coord;
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
        window.form.activate();
        window.form.validate();
        window.pin.render(offers);
      }

      document.removeEventListener('mousemove', mainPinMouseMoveHandler);
      isPageActivated = false;
    }

    document.addEventListener('mousemove', mainPinMouseMoveHandler);
    document.addEventListener('mouseup', mainPinMouseUpHandler);
  }

  deactivatePage();
  mainPin.addEventListener('mousedown', mainPinMouseDownHandler);
})();
