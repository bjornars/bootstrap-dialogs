$ = this.jQuery
Bootstrap = this.Bootstrap or= {}


exports = Bootstrap.Dialogs =

  alert: (title='Alert', body) ->
    promise = exports.dialog(title, body, [
      [ 'Ok', -> promise.resolve() ]
    ])

  confirm: (title='Please confirm', body) ->
    promise = exports.dialog(title, body, [
      [ 'Cancel', -> promise.reject() ]
      [ 'Ok', -> promise.resolve() ]
    ])

  dialog: (title, body, buttons=[]) ->
    body =
      if body
        """<div class="modal-body">#{body}</div>"""
      else
        ''

    buttons = for button in buttons
      if typeof button is 'string'
        text = button
        handler = null
      else
        text = button[0]
        handler = button[1]
      $btn = $("""<button class="btn">#{text}</button>""")
      $btn.click(handler) if handler instanceof Function
      $btn[0]

    $el = $('<div class="modal hide fade">')
      .html([
        $('<div class="modal-header">').html(title)[0]
        body
        $('<div class="modal-footer">').html(buttons)[0]
      ])

    promise = $.Deferred()
    promise.el = $el[0]
    promise.$el = $el

    promise.always ->
      $el.modal('hide')
      $el.remove()

    $el.modal(backdrop: 'static')

    promise

  prompt: (title='Please enter a value', body) ->
    promise = exports.dialog(title, body, [
      [ 'Cancel', -> promise.reject() ]
      [ 'Ok', -> promise.resolve() ]
    ])
