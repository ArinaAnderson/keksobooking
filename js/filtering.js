'use strict';
(function () {
  var filtersArea = document.querySelector('.map__filters-container');
  var typeSelect = filtersArea.querySelector('#housing-type');
  var roomSelect = filtersArea.querySelector('#housing-rooms');
  var guestSelect = filtersArea.querySelector('#housing-guests');
  var priceSelect = filtersArea.querySelector('#housing-price');
  var filterCheckboxes = filtersArea.querySelectorAll('[name="features"]');
  var filterSelects = filtersArea.querySelectorAll('select');
  var features = [];

  var fieldIdToPinProperty = {
    'housing-type': 'type',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };
  var filterSelectNameToInitialValue = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any'
  };

  function filterTypeRoomGuest(pin, field) {
    return field.value !== 'any' ? pin.offer[fieldIdToPinProperty[field.id]].toString() === field.value : true;
  }

  var priceValueToPriceRange = {
    'low': function (pin) {
      return pin.offer.price < 10000;
    },
    'middle': function (pin) {
      return pin.offer.price >= 10000 && pin.offer.price <= 50000;
    },
    'high': function (pin) {
      return pin.offer.price > 50000;
    },
    'any': function () {
      return true;
    }
  };

  function filterFeatures(pin) {
    for (var i = 0; i < features.length; i++) {
      if (pin.offer.features.indexOf(features[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  function resetFilters() {
    window.utils.resetSelects(filterSelects, filterSelectNameToInitialValue);
    window.utils.toggleCheckedAttr(filterCheckboxes, false);
  }

  window.filtering = {
    filterPins: function (loadedData) {
      return loadedData.filter(function (pin) {
        return filterTypeRoomGuest(pin, typeSelect) && priceValueToPriceRange[priceSelect.value](pin) && filterTypeRoomGuest(pin, roomSelect)
          && filterTypeRoomGuest(pin, guestSelect) && filterFeatures(pin);
      });
    },
    deactivate: function () {
      window.utils.toggleDisableAttr(filterCheckboxes, true);
      window.utils.toggleDisableAttr(filterSelects, true);
      resetFilters();
    },
    activate: function () {
      window.utils.toggleDisableAttr(filterCheckboxes, false);
      window.utils.toggleDisableAttr(filterSelects, false);
    },
    filterSelectChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      window.pin.update(loadedPins);
    }),
    filterFeatureChangeHandler: window.utils.debounce(function (evt, loadedPins) {
      if (evt.target.checked) {
        features.push(evt.target.value);
      } else {
        features.splice(features.indexOf(evt.target.value), 1);
      }
      window.pin.update(loadedPins);
    })
  };
})();
