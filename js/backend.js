'use strict';
(function () {
  var SUCCESS_RESP_STATUS = 200;

  function createXhrRequest(onLoad, onError, badStatusText) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_RESP_STATUS) {
        onLoad(xhr.response);
      } else {
        onError(badStatusText + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    return xhr;
  }

  window.backend = {
    save: function (data, onLoad, onError, URL) {
      var badStatusText = 'Ошибка загрузки объявления: ';
      var xhr = createXhrRequest(onLoad, onError, badStatusText);
      xhr.open('POST', URL);
      xhr.send(data);
    },
    load: function (onLoad, onError, URL) {
      var badStatusText = 'Статус загрузки похожих объявлений: ';
      var xhr = createXhrRequest(onLoad, onError, badStatusText);
      xhr.open('GET', URL);
      xhr.send();
    }
  };
})();
