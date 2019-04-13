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

  /* PHOTO UPLOAD */
  var previewParams = {
    defaultSrc: '',
    src: '',
    alt: 'Фотография жилья',
    width: '70',
    height: '70',
    imgClasses: ['popup__photo', 'popup__photo--edit'],
    addNewImage: function () {
      var img = document.createElement('img');
      img.alt = this.alt;
      img.width = this.width;
      img.height = this.height;
      img.className = this.imgClasses.join(' ');
      img.src = this.src;
      return img;
    },
    box: {
      tag: 'div',
      classes: 'ad-form__photo',
      initialAmount: 1,
      amount: 1,
      imgLimit: true
    },

    resetPreviews: function (selections) {
      for (var i = selections.length - 1; i >= this.box.initialAmount; i--) {
        selections[i].parentNode.removeChild(selections[i]);
        selections.pop();
      }
      this.box.amount = 1;
      selections.forEach(function (item) {
        var img = item.querySelector('img');
        img.src = this.defaultSrc;
        if (!this.defaultSrc) {
          img.removeAttribute('width');
          img.removeAttribute('height');
          img.removeAttribute('alt');
        }
      }, this);
    }
  };

  var avaParams = {
    defaultSrc: 'img/muffin-grey.svg',
    src: '',
    alt: 'Аватар пользователя',
    width: '40',
    height: '44',
    classes: ['ad-form-header__preview-img'],
    addNewImage: function () {
      var img = document.createElement('img');
      img.alt = this.alt;
      img.width = this.width;
      img.height = this.height;
      img.className = this.classes.join(' ');
      img.src = this.src;
      return img;
    },
    box: {
      tag: 'div',
      classes: 'ad-form-header__preview',
      initialAmount: 1,
      amount: 1,
      imgLimit: false
    },
    resetPreviews: function (selections) {
      for (var i = selections.length - 1; i >= this.box.initialAmount; i--) {
        selections[i].parentNode.removeChild(selections[i]);
        selections.pop();
      }
      this.box.amount = 1;
      selections.forEach(function (item) {
        var img = item.querySelector('img');
        img.src = this.defaultSrc;
        if (!this.defaultSrc) {
          img.removeAttribute('width');
          img.removeAttribute('height');
          img.removeAttribute('alt');
        }
      }, this);
    }
  };

  function getPreviewList(imgObj) {
    var previewList = Array.prototype.slice.call(document.querySelectorAll('.' + imgObj.box.classes));//[0]
    return previewList;
  }
  var previewSelections = getPreviewList(previewParams);
  previewParams.box.initialAmount = previewSelections.length;
  var photoChooser = document.querySelector('[name="images"]');

  var avaSelections = getPreviewList(avaParams);
  avaParams.box.initialAmount = avaSelections.length;
  var avaChooser = document.querySelector('[name = "avatar"]');

  function readFile(selection, imgObj) {
    if (selection) {
      var selectionName = selection.name.toLowerCase();
      var matches = FILE_TYPES.some(function (it) {
        return selectionName.endsWith(it);
      });
    }
    var image = imgObj.addNewImage();
    
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
          imgObj.src = reader.result;
          image.src = imgObj.src;
      });
      reader.readAsDataURL(selection);
    }
    return image;
  }

  // start of handler:
  function markerMouseDownHandler(evt) {
    evt.target.draggable = false;
    var evtParent = evt.target.parentNode;
    var nextEl = evt.target.nextElementSibling;

    var initCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    function markerMouseMoveHandler(moveEvt) {
      evt.target.classList.add('popup__marker--hover');

      var shiftCoords = {
        x: initCoords.x - moveEvt.clientX,
        y: initCoords.y - moveEvt.clientY,
      };

      // validate!!!!!! the picture should not decrease to nothing
      nextEl.style.width = (nextEl.offsetWidth + shiftCoords.x) + 'px';
      nextEl.style.height = 'auto';

      initCoords.x = moveEvt.clientX;
      initCoords.y = moveEvt.clientY;
    }
    function markerMouseUpHandler(upEvt) {
      evt.target.classList.remove('popup__marker--hover');

      document.removeEventListener('mousemove', markerMouseMoveHandler);
      document.removeEventListener('mouseup', markerMouseUpHandler);
    }
    document.addEventListener('mousemove', markerMouseMoveHandler);
    document.addEventListener('mouseup', markerMouseUpHandler);
  }

  function imgMouseDownHandler(evt) {
    evt.target.draggable = false;
    var initCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    var evtParent = evt.target.parentNode;

    function imgMouseMoveHandler(moveEvt) {
      evtParent.classList.add('ad-form__photo--hover');

      var shiftCoords = {
        x: initCoords.x - moveEvt.clientX,
        y: initCoords.y - moveEvt.clientY,
      };
      var styleLeft = utils.validateCoord(evt.target.offsetLeft - shiftCoords.x, evtParent.offsetWidth - evt.target.offsetWidth, 0);
      var styleTop = utils.validateCoord(evt.target.offsetTop - shiftCoords.y, evtParent.offsetHeight - evt.target.offsetHeight, 0);
      evt.target.style.left = styleLeft + 'px';
      evt.target.style.top = styleTop + 'px';

      initCoords.x = moveEvt.clientX;
      initCoords.y = moveEvt.clientY;
    }
    function imgMouseUpHandler(upEvt) {
      evt.target.style.left = evt.target.offsetLeft + 'px';
      evt.target.style.top = evt.target.offsetTop + 'px';

      evtParent.classList.remove('ad-form__photo--hover');

      document.removeEventListener('mousemove', imgMouseMoveHandler);
      document.removeEventListener('mouseup', imgMouseUpHandler);
    }
    document.addEventListener('mousemove', imgMouseMoveHandler);
    document.addEventListener('mouseup', imgMouseUpHandler);
  }

  function renderImg(file, selections, imgParams) {
    if (file) {
      var previewImg = readFile(file, imgParams);
      previewImg.addEventListener('mousedown', imgMouseDownHandler);

      if (imgParams.box.amount > imgParams.box.initialAmount && imgParams.box.imgLimit) {
        var nextPreviewBox = utils.createElem(imgParams.box.tag, imgParams.box.classes);
        selections[imgParams.box.amount - 2].insertAdjacentElement('afterend', nextPreviewBox);
        nextPreviewBox.appendChild(previewImg);
        selections.push(nextPreviewBox);
      }

      if ((!imgParams.box.imgLimit) || selections.length <= imgParams.box.initialAmount) {
        var oldImg = selections[imgParams.box.amount - 1].querySelector('img');
        selections[imgParams.box.amount - 1].replaceChild(previewImg, oldImg);
      }

      if (imgParams.box.imgLimit || imgParams.box.amount < imgParams.box.initialAmount) {
        imgParams.box.amount++;
      }

      var marker = utils.createElem('span', 'popup__marker');
      marker.addEventListener('mousedown', markerMouseDownHandler);
      previewImg.insertAdjacentElement('beforebegin', marker);
    } 
  }

  photoChooser.addEventListener('change', function(evt) {
    for (var i = 0; i < evt.target.files.length; i++) {
      renderImg(evt.target.files[i], previewSelections, previewParams);
    }
  });

  avaChooser.addEventListener('change', function(evt) {
    for (var i = 0; i < evt.target.files.length; i++) {
      renderImg(evt.target.files[i], avaSelections, avaParams);
    }
  });  



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
      checkoutSelect.setCustomValidity('Time of checkout should be ' + checkinSelect.value);
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
      guestSelect.setCustomValidity('This number of rooms is for ' + getErrorText().join(', or '));
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
    previewParams.resetPreviews(previewSelections);
    avaParams.resetPreviews(avaSelections);
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
    previewParams.resetPreviews(previewSelections);
    avaParams.resetPreviews(avaSelections);
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
