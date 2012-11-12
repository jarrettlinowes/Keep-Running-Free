$ ->
  $('#side_tab a:first').tab('show')

  $('#entertainment_books a:first').tab('show')
  $('#entertainment_other a:first').tab('show')

  $('.carousel').carousel()

  $(".collapse").collapse()

  if ($(window).width() < 1162)
    $(".social_bar").hide();

  $(window).resize ->
    if ($(window).width() < 1162)
      $(".social_bar").hide();
    else
      $(".social_bar").show();