'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INT = 500;

  window.utils = {
    isEscPress: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    shuffleArray: function (list) {
      for (var i = list.length - 1; i > 0; i--) {
        var randomNum = Math.floor(Math.random() * (i + 1));
        var randomElement = list[randomNum];
        list[randomNum] = list[i];
        list[i] = randomElement;
      }
      return list;
    },
    createElem: function (elemTag, elemClass, elemParent) {
      var elem = document.createElement(elemTag);
      elem.className = elemClass;
      return elem;
    },
    setupStyleLeftTop: function (elem, x, y) {
      elem.style.left = x + 'px';
      elem.style.top = y + 'px';
    },
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    toggleDisableAttr: function (elementList, disable) {
      for (var i = 0; i < elementList.length; i++) {
        elementList[i].disabled = disable;
      }
    },
    toggleCheckedAttr: function (elementList, checked) {
      for (var i = 0; i < elementList.length; i++) {
        elementList[i].checked = checked;
      }
    },
    resetSelects: function (selectList, initialValues) {
      selectList.forEach(function (item) {
        item.value = initialValues[item.name];
      });
    },
    validateCoord: function (coord, minValue, maxValue) {
      coord = coord < minValue ? minValue : coord;
      coord = coord > maxValue ? maxValue : coord;

      return coord;
    },
    debounce: function (cb) {
      var lastTimeout = null;
      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          cb.apply(null, args);
        }, DEBOUNCE_INT);
      };
    }
  };
})();
