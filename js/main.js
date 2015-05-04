$( document ).ready(function() {
  var history = window.history;
  var location = window.location;
  var url_nosdeputes_photo = 'http://www.nosdeputes.fr/depute/photo/';
  var deputes_promise = $.when($.ajax('/data/deputes.json'));


  var depute_email = function (depute) {
    var email = depute.emails[0];
    if (email)
      email = email.email;
    else
      email = [
        depute.prenom[0].toLowerCase(), depute.nom.toLowerCase(),
        '@assemblee-nationale.fr'
      ].join('');

    return email;
  }

  deputes_promise = deputes_promise.then(function (data) {
    var deputes = {};
    $.each(data.deputes, function (_, depute) {
      var circo, email;

      depute = depute.depute; // bad API design Yay!
      circo = deputes[depute.num_deptmt] || {};

      depute.url = '/#' + depute.slug;
      depute.photo_url = url_nosdeputes_photo + depute.slug + '/160';
      depute.email = depute_email(depute);

      circo[depute.num_circo] = depute;
      deputes[depute.num_deptmt] = circo;
    });
    $('.circo').each(function (_, circo) {
      getDepute(circo.id).then(function (depute) {
        if (!depute) return;
        depute.nom_dept = $(circo).children('title').html();
      });
    });
    return deputes;
  });

  function getDepute (id) {
    var dept, circ;
    id = id.split('-');

    dept = id[0].toUpperCase();
    circ = parseInt(id[1]);

    // need to trim starting 0 if exists
    dept = dept[0] === '0' && dept.length === 3 ? dept.slice(1, 3): dept;

    return deputes_promise.then(function (deputes){
      return deputes[dept][circ];
    });
  }

  function displayModal(depute) {
    var couleur = '#962E27';

    // TODO : rendre dynamique ( absent || abstention || pour || contre )
    var vote_PJLR = "absent";

    if(vote_PJLR === "absent") {
      var message_vote = "Ce deputé était <span style='color:" + couleur + "'>absent</span> lors du vote du 14 avril";

    } else if(vote_PJLR === "abstention") {
      var message_vote = "Ce deputé <span  style='color:" + couleur + "'>s'est abstenu</span> lors du vote du 14 avril";
    } else {
      var message_vote = "Ce deputé <span  style='color:" + couleur + "'>a voté " + vote_PJLR +"</span> lors du vote du 14 avril";
    }

    depute.vote_PJLR = vote_PJLR;
    depute.message_vote = message_vote;
    depute.couleur = couleur;

    var modal = $('#depute').render(depute).appendTo('body')
    modal.on($.modal.OPEN, function () {
      if (history) history.pushState(depute, '', depute.url);
    });
    modal.on($.modal.CLOSE, function () {
      if (history) history.pushState({}, '', '/');
    });
    modal.modal();

  }

  $('.circo').click(function () {
   getDepute(this.id).then(displayModal);
  });

  // load zoom and pane on svg
  $('svg').svgPan('France');

  // if history and state load the modal
  if (history && history.state)
    displayModal(history.state);
  //else if (location && location.hash)

});


/*
switch (new Date().getDay()) {
    case 0:
        day = "Sunday";
        break;
    case 1:
        day = "Monday";
        break;
    case 2:
        day = "Tuesday";
        break;
    case 3:
        day = "Wednesday";
        break;
    case 4:
        day = "Thursday";
        break;
    case 5:
        day = "Friday";
        break;
    case 6:
        day = "Saturday";
        break;
}
*/
