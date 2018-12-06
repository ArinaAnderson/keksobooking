'use strict';
(function () {
  var offerTypePriceListMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var roomsGuestsListMap = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var map = document.querySelector('.map');
  var fieldsets = document.querySelectorAll('fieldset');
  var selectItems = document.querySelectorAll('select');
  var priceInput = document.querySelector('input[name="price"]');
  var typeSelect = document.querySelector('select[name="type"]');
  var checkinSelect = document.querySelector('select[name="timein"]');
  var checkoutSelect = document.querySelector('select[name="timeout"]');
  var roomsSelect = document.querySelector('select[name="rooms"]');
  var guestsSelect = document.querySelector('select[name="capacity"]');
  var offerForm = document.querySelector('.ad-form');
  var addressInput = offerForm.querySelector('input[name="address"]');

  function setPriceMin() {
    var typeValue = typeSelect.value;
    priceInput.min = offerTypePriceListMap[typeValue];
    priceInput.placeholder = offerTypePriceListMap[typeValue];
  }
  function typeSelectHandler() {
    setPriceMin();
  }

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

  window.form = {
    activate: function () {
      window.utils.toggleDisableAttr(fieldsets, false);
      window.utils.toggleDisableAttr(selectItems, false);
      map.classList.remove('map--faded');
      offerForm.classList.remove('ad-form--disabled');
    },
    deactivate: function () {
      window.utils.toggleDisableAttr(fieldsets, true);
      window.utils.toggleDisableAttr(selectItems, true);
      map.classList.add('map--faded');
      offerForm.classList.add('ad-form--disabled');
    },
    validate: function () {
      typeSelect.addEventListener('change', typeSelectHandler);
      checkinSelect.addEventListener('change', timeSelectHandler);
      checkoutSelect.addEventListener('change', timeSelectHandler);
      roomsSelect.addEventListener('change', guestNumSelectHandler);
      guestsSelect.addEventListener('change', guestNumSelectHandler);
    },
    fillAddressField: function (x, y) {
      addressInput.value = x + ', ' + y;
    }
  };
})();
