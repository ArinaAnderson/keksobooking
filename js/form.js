'use strict';
(function () {
  var URL_POST = 'https://js.dump.academy/keksobooking';//'https://javascript.pages.academy/keksobooking/data/allow-cors';//'https://js.dump.academy/keksobooking/allow-cors';//'https://gvenya.github.io/keksby-data/data-JSN.json';//'https://js.dump.academy/keksobooking';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var offerTypeToPrice = {
    'villa': 300,
    'apartment': 100,
    'house': 200,
  };
  var roomNumToGuestNum = {
    '1': ['1'],
    '2': ['1', '2'],
    '3': ['1', '2', '3'],
  };
  var offerSelectNameToInitialValue = {
    'type': 'apartment',
    'timein': '12:00',
    'timeout': '12:00',
    'rooms': '1',
    'capacity': '1'
  };

  var map = document.querySelector('.map');
  var mapFilters = document.querySelectorAll('.map__filter');
  var mapCheckBoxes = document.querySelectorAll('.map__checkbox');
  var filterForm = document.querySelector('.map__filters');

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
    imgClasses: ['popup__photo'],
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
    /*resetPreview: function (item) {
      var img = item.querySelector('img');
      var initialSrc = this.defaultSrc;
      if (!initialSrc) {
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.removeAttribute('alt');
      }
    },*/
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
    var previewList = Array.prototype.slice.call(document.querySelectorAll('.' + imgObj.box.classes));
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

  function renderImg(file, selections, imgParams) {
    if (file) {
      var previewImg = readFile(file, imgParams);

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
    formSubmitHandler();
    //window.backend.save(new FormData(offerForm), formSubmitHandler, window.notifications.notifyOfError, URL_POST);
  });

  function resetForm() {
    window.utils.resetSelects(offerSelects, offerSelectNameToInitialValue);
    window.utils.toggleCheckedAttr(offerFeatures, false);
    offerTitle.value = '';
    priceInput.value = '';
    setPriceMin();
    filterForm.reset();
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
      window.utils.toggleDisableAttr(mapFilters, false);
      window.utils.toggleDisableAttr(mapCheckBoxes, false);
      map.classList.remove('map--faded');
      offerForm.classList.remove('ad-form--disabled');
    },
    deactivate: function () {
      window.utils.toggleDisableAttr(offerFieldsets, true);
      window.utils.toggleDisableAttr(offerSelects, true);
      window.utils.toggleDisableAttr(mapFilters, true);
      window.utils.toggleDisableAttr(mapCheckBoxes, false);
      map.classList.add('map--faded');
      offerForm.classList.add('ad-form--disabled');
      // filterForm.reset();
      resetForm();
    },
    fillAddressField: function (x, y) {
      addressInput.value = x + ', ' + y;
    }
  };
})();
