$(document).ready(function () {
  'use strict';

  var history = window.history;
  var location = window.location;
  var url_nosdeputes_photo = 'http://www.nosdeputes.fr/depute/photo/';
  var deputes_json = $.when($.ajax('/data/deputes.json'));
  var depute_tplt = $('#depute');
  var search_result_tplt = $('#search-result');
  var result_field = $('#results');

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

  var deputes_promise = deputes_json.then(function (data) {
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
      deputes[depute.slug] = depute;
    });

    $('.circo').each(function (_, circo) {
      get_depute(circo.id).then(function (depute) {
        if (!depute) return;
        depute.nom_dept = $(circo).children('title').html();
      });
    });
    return deputes;
  });

  var get_depute = function (id) {
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

  var display_depute = window.display_depute = function (depute_slug) {
    deputes_promise.then(function (deputes) {
      display_modal(deputes[depute_slug]);
    });
  }

  var display_modal = function (depute) {
    if (!depute) return;

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

    var modal = depute_tplt.render(depute).appendTo('body')
    modal.on($.modal.OPEN, function () {
      if (history) history.pushState(depute, '', depute.url);
    });
    modal.on($.modal.CLOSE, function () {
      if (history) history.pushState({}, '', '/');
    });
    modal.modal({'zIndex':20});
  }

  $('.circo').click(function () {
   get_depute(this.id).then(display_modal);
  });

  $('#search').keyup(function (){
    var searchField = $('#search').val();
    var regex = new RegExp(searchField, "i");

    $('#results').empty();
    if (searchField === '') return;

    deputes_json.then(function(data){
      $.each(data.deputes, function (_, depute) {
        depute = depute.depute;
        if (depute.nom.search(regex) != -1 ||
            depute.num_deptmt.search(regex) != -1) {
          result_field.append(search_result_tplt.render(depute));
        }
      });
    });
  });

  // load zoom and pane on svg
  $('svg').svgPan('France');

  if (location && location.hash) display_depute(location.hash.slice(1));
});

