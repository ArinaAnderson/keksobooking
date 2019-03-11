'use strict';
(function () {
  var URL_POST = 'https://js.dump.academy/keksobooking';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var offerTypeToPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var roomNumToGuestNum = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
    '100': ['0']
  };
  var offerSelectNameToInitialValue = {
    'type': 'flat',
    'timein': '12:00',
    'timeout': '12:00',
    'rooms': '1',
    'capacity': '1'
  };
  var priceInput = document.querySelector('input[name="price"]');
  var typeSelect = document.querySelector('select[name="type"]');
  var checkinSelect = document.querySelector('select[name="timein"]');
  var checkoutSelect = document.querySelector('select[name="timeout"]');
  var roomSelect = document.querySelector('select[name="rooms"]');
  var guestSelect = document.querySelector('select[name="capacity"]');
  var offerForm = document.querySelector('.ad-form');
  var offerSelects = offerForm.querySelectorAll('select');
  var offerFieldsets = offerForm.querySelectorAll('fieldset');
  var offerTitle = offerForm.querySelector('input[name="title"]');
  var offerFeatures = offerForm.querySelectorAll('[name="features"]');
  var offerDescription = offerForm.querySelector('[name="description"]');
  var addressInput = offerForm.querySelector('input[name="address"]');
  var resetBtn = offerForm.querySelector('.ad-form__reset');

  function setPriceMin() {
    var typeValue = typeSelect.value;
    priceInput.min = offerTypeToPrice[typeValue];
    priceInput.placeholder = offerTypeToPrice[typeValue];
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
    for (var i = 0; i < roomNumToGuestNum[roomSelect.value].length; i++) {
      errorText.push(guestSelect.querySelector('option[value="' + roomNumToGuestNum[roomSelect.value][i] + '"]').textContent);
    }

    return errorText;
  }
  function validateGuestNum() {
    if (roomNumToGuestNum[roomSelect.value].indexOf(guestSelect.value) < 0) {
      guestSelect.setCustomValidity('Такое количество комнат предусмотрено ' + getErrorText().join(', или '));
    } else {
      guestSelect.setCustomValidity('');
    }
  }
  function guestNumSelectHandler() {
    validateGuestNum();
  }

  function validateFormFields() {
    typeSelect.addEventListener('change', typeSelectHandler);
    checkinSelect.addEventListener('change', timeSelectHandler);
    checkoutSelect.addEventListener('change', timeSelectHandler);
    roomSelect.addEventListener('change', guestNumSelectHandler);
    guestSelect.addEventListener('change', guestNumSelectHandler);
  }

  function formSubmitHandler() {
    window.main.deactivate();
    window.notifications.notifyOfSuccess();
  }
  offerForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(offerForm), formSubmitHandler, window.notifications.notifyOfError, URL_POST);
  });

  function resetForm() {
    window.utils.resetSelects(offerSelects, offerSelectNameToInitialValue);
    window.utils.toggleCheckedAttr(offerFeatures, false);
    offerTitle.value = '';
    priceInput.value = '';
    setPriceMin();
    offerDescription.value = '';
  }
  function resetBtnClickHandler(evt) {
    evt.preventDefault();
    window.main.deactivate();
  }
  resetBtn.addEventListener('click', resetBtnClickHandler);


  window.form = {
    activate: function () {
      validateFormFields();
      window.utils.toggleDisableAttr(offerFieldsets, false);
      window.utils.toggleDisableAttr(offerSelects, false);
      offerForm.classList.remove('ad-form--disabled');
    },
    deactivate: function () {
      window.utils.toggleDisableAttr(offerFieldsets, true);
      window.utils.toggleDisableAttr(offerSelects, true);
      offerForm.classList.add('ad-form--disabled');
      resetForm();
    },
    fillAddressField: function (x, y) {
      addressInput.value = x + ', ' + y;
    }
  };
})();
