$( document ).ready(function() {
  $('.circo').click(function (e) {
    console.log($(this).attr('id'));
    $('<h1>Hello World</h1>').appendTo('body').modal();
  });
});
