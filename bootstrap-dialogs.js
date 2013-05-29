(function() {
  var $, Bootstrap, ESC, RETURN, exports, mkbutton, normalizeButtons;

  $ = this.jQuery;

  Bootstrap = this.Bootstrap || (this.Bootstrap = {});

  RETURN = 13;

  ESC = 27;

  mkbutton = function(text, btnClass) {
    var $btn;

    $btn = $('<button type="button" class="btn">').html(text);
    if (btnClass) {
      $btn.addClass("btn-" + btnClass);
    }
    return $btn;
  };

  normalizeButtons = function(buttons) {
    var $btn, button, handler, _i, _len, _results;

    _results = [];
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      button = buttons[_i];
      if (button instanceof Array) {
        handler = button[1];
        button = button[0];
      }
      if (typeof button === 'string') {
        $btn = mkbutton(button);
      } else {
        $btn = $(button);
      }
      if (handler instanceof Function) {
        $btn.click(handler);
      }
      _results.push($btn);
    }
    return _results;
  };

  exports = Bootstrap.Dialogs = {
    alert: function(options) {
      var body, okClass, okText, promise, returnHandler, title;

      if (options == null) {
        options = {};
      }
      title = options.title || 'Alert';
      body = options.body;
      okText = options.ok || 'Ok';
      okClass = options.danger ? 'danger' : 'primary';
      promise = exports.dialog({
        title: title,
        body: body,
        buttons: [
          [
            mkbutton(okText, okClass), function() {
              return promise.resolve();
            }
          ]
        ]
      });
      returnHandler = function(e) {
        if (e.which === RETURN) {
          return promise.resolve();
        }
      };
      $('body').on('keyup', returnHandler);
      return promise.always(function() {
        return $('body').off('keyup', returnHandler);
      });
    },
    confirm: function(options) {
      var body, cancelText, okClass, okText, promise, returnHandler, title;

      if (options == null) {
        options = {};
      }
      title = options.title || 'Please confirm';
      body = options.body;
      okText = options.ok || 'Ok';
      okClass = options.danger ? 'danger' : 'primary';
      cancelText = options.cancel || 'Cancel';
      promise = exports.dialog({
        title: title,
        body: body,
        buttons: [
          [
            cancelText, function() {
              return promise.reject();
            }
          ], [
            mkbutton(okText, okClass), function() {
              return promise.resolve();
            }
          ]
        ]
      });
      if (options["return"]) {
        returnHandler = function(e) {
          if (e.which === RETURN) {
            return promise.resolve();
          }
        };
        $('body').on('keyup', returnHandler);
        promise.always(function() {
          return $('body').off('keyup', returnHandler);
        });
      }
      return promise;
    },
    dialog: function(options) {
      var $closeButton, $el, body, buttons, escHandler, promise, title, titleEls;

      if (options == null) {
        options = {};
      }
      title = options.title;
      body = options.body;
      buttons = options.buttons || [];
      titleEls = [$('<h3>').html(title)];
      if (!options.noButtons) {
        $closeButton = $('<button type="button" class="close" data-dismiss="modal"\n  aria-hidden="true">&times;</button>');
        titleEls.unshift($closeButton);
      }
      $el = $('<div class="modal hide fade">').html([$('<div class="modal-header">').html(titleEls), body ? $('<div class="modal-body">').html(body) : '', $('<div class="modal-footer">').html(normalizeButtons(buttons))]);
      promise = $.Deferred();
      promise.el = $el[0];
      promise.$el = $el;
      escHandler = function(e) {
        if (e.which === ESC) {
          return promise.reject();
        }
      };
      promise.always(function() {
        $('body').off('keyup', escHandler);
        $el.modal('hide');
        return $el.remove();
      });
      if ($closeButton != null) {
        $closeButton.click(function() {
          return promise.reject();
        });
      }
      $('body').on('keyup', escHandler);
      $el.modal({
        backdrop: 'static'
      });
      return promise;
    },
    prompt: function(options) {
      var $input, body, cancelText, keyup, okClass, okText, promise, reject, resolve, title;

      if (options == null) {
        options = {};
      }
      title = options.title || 'Please enter a value';
      body = options.body || '';
      okText = options.ok || 'Ok';
      okClass = options.danger ? 'danger' : 'primary';
      cancelText = options.cancel || 'Cancel';
      resolve = function() {
        return promise.resolve($input.val());
      };
      reject = function() {
        return promise.reject();
      };
      keyup = function(e) {
        if (e.which === RETURN) {
          return resolve();
        }
      };
      $input = $('<input type="text">');
      promise = exports.dialog({
        title: title,
        body: [body, $input],
        buttons: [[cancelText, reject], [mkbutton(okText, okClass), resolve]]
      });
      $('body').on('keyup', keyup);
      promise.always(function() {
        return $('body').off('keyup', keyup);
      });
      $input.focus();
      promise.$input = $input;
      return promise;
    }
  };

}).call(this);
