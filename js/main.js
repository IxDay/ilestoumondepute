$( document ).ready(function() {

  var deputes_promise = $.when($.ajax('/data/deputes.json'));

  deputes_promise = deputes_promise.then(function (data) {
    var deputes = {};
    $.each(data.deputes, function(index, depute) {
      var circo = deputes[depute.depute.num_deptmt] || {};
      circo[depute.depute.num_circo] = depute.depute;
      deputes[depute.depute.num_deptmt] = circo;
    });
    return deputes;
  });


  $('.circo').click(function (e) {
    var id = $(this).attr('id').split('-'),
      dept = parseInt(id[0]), circ = parseInt(id[1]);

    deputes_promise.then(function (data) {
      $('<div>' + JSON.stringify(data[dept][circ]) + '</div>').appendTo('body').modal();
    });
  });


});
