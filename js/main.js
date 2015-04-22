$( document ).ready(function() {
  var url_nosdeputes_photo = 'http://www.nosdeputes.fr/depute/photo/';
  var deputes_promise = $.when($.ajax('/data/deputes.json'));

  deputes_promise = deputes_promise.then(function (data) {
    var deputes = {};
    $.each(data.deputes, function(index, depute) {
      depute = depute.depute; // bad API design Yay!

      var circo = deputes[depute.num_deptmt] || {};

      depute.photo_url = url_nosdeputes_photo + depute.slug + '/160'
      circo[depute.num_circo] = depute;
      deputes[depute.num_deptmt] = circo;
    });
    return deputes;
  });

  $('.circo').click(function (e) {
    var id = $(this).attr('id').split('-'),
      dept = id[0].toUpperCase(), circ = parseInt(id[1]);

    // need to trim starting 0 if exists
    dept = dept[0] === '0' && dept.length === 3 ? dept.slice(1, 3): dept;

    deputes_promise.then(function (deputes){
      var depute = deputes[dept][circ];
      $('#depute').render(depute).appendTo('body').modal();
    });
  });
});
