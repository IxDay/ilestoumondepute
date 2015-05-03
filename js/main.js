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

  $('svg').svgPan('France');

  $('.circo').click(function (e) {
    var id = $(this).attr('id').split('-'),
      dept = id[0].toUpperCase(), circ = parseInt(id[1]),
      nom_dept = $(this).children('title').html();

    // TODO : rendre dynamique ( absent || abstention || pour || contre )
    var vote_PJLR = "absent";

    // need to trim starting 0 if exists
    dept = dept[0] === '0' && dept.length === 3 ? dept.slice(1, 3): dept;

    deputes_promise.then(function (deputes){
      var depute = deputes[dept][circ],
        email = depute.emails[0].email,
        couleur = '#962E27';

      if(vote_PJLR === "absent") {
        var message_vote = "Ce deputé était <span style='color:" + couleur + "'>absent</span> lors du vote du 14 avril"; 

      } else if(vote_PJLR === "abstention") {
        var message_vote = "Ce deputé <span  style='color:" + couleur + "'>s'est abstenu</span> lors du vote du 14 avril"; 
      } else {
        var message_vote = "Ce deputé <span  style='color:" + couleur + "'>a voté " + vote_PJLR +"</span> lors du vote du 14 avril"; 
      }

      depute.nom_dept = nom_dept;
      depute.vote_PJLR = vote_PJLR;
      depute.message_vote = message_vote;
      depute.displayMail = email;
      depute.couleur = couleur;

      $('#depute').render(depute).appendTo('body').modal();
    });
  });
});
