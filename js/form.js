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
  var initialOfferSelectValues = {
    'type': 'flat',
    'timein': '12:00',
    'timeout': '12:00',
    'rooms': '1',
    'capacity': '1'
  };
  var map = document.querySelector('.map');
  // var filterForm = document.querySelector('.map__filters');
  var fieldsets = document.querySelectorAll('fieldset');
  var selectItems = document.querySelectorAll('select');
  var priceInput = document.querySelector('input[name="price"]');
  var typeSelect = document.querySelector('select[name="type"]');
  var checkinSelect = document.querySelector('select[name="timein"]');
  var checkoutSelect = document.querySelector('select[name="timeout"]');
  var roomsSelect = document.querySelector('select[name="rooms"]');
  var guestsSelect = document.querySelector('select[name="capacity"]');
  var offerForm = document.querySelector('.ad-form');
  var offerSelects = offerForm.querySelectorAll('select');
  var offerTitle = offerForm.querySelector('input[name="title"]');
  var offerFeatures = offerForm.querySelectorAll('[name="features"]');
  var offerDescription = offerForm.querySelector('[name="description"]');
  var addressInput = offerForm.querySelector('input[name="address"]');
  var resetBtn = offerForm.querySelector('.ad-form__reset');

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

  function validateFormFields() {
    typeSelect.addEventListener('change', typeSelectHandler);
    checkinSelect.addEventListener('change', timeSelectHandler);
    checkoutSelect.addEventListener('change', timeSelectHandler);
    roomsSelect.addEventListener('change', guestNumSelectHandler);
    guestsSelect.addEventListener('change', guestNumSelectHandler);
  }

  function formSubmitHandler() {
    window.main.deactivate();
    window.notifications.notifyOfSuccess();
  }
  offerForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(offerForm), formSubmitHandler, window.notifications.notifyOfError);
  });


  function resetSelects(selectList) {
    selectList.forEach(function (item) {
      item.value = initialOfferSelectValues[item.name];
    });
  }
  function resetForm() {
    resetSelects(offerSelects);
    offerTitle.value = '';
    priceInput.value = '';
    setPriceMin();
    offerDescription.value = '';
    window.utils.toggleCheckedAttr(offerFeatures, false);
    /* photosUpload;
    avatarUpload*/
  }
  function resetBtnClickHandler(evt) {
    evt.preventDefault();
    // resetForm();
    // resetFilters();
    window.main.deactivate();
  }
  resetBtn.addEventListener('click', resetBtnClickHandler);
  // resetBtn.addEventListener('keydown', resetBtnEnterHandler);


  window.form = {
    activate: function () {
      validateFormFields();
      window.utils.toggleDisableAttr(fieldsets, false);
      window.utils.toggleDisableAttr(selectItems, false);
      map.classList.remove('map--faded');
      offerForm.classList.remove('ad-form--disabled');
    },
    deactivate: function () {
      window.utils.toggleDisableAttr(fieldsets, true);
      window.utils.toggleDisableAttr(selectItems, true);
      offerForm.classList.add('ad-form--disabled');
      resetForm();
      // setPriceMin();
      map.classList.add('map--faded');
    },
    fillAddressField: function (x, y) {
      addressInput.value = x + ', ' + y;
    }
  };
})();
