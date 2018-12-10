'use strict';
(function () {
  var ESC_KEYCODE = 27;

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
    }
  };
})();
