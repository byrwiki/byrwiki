// customize.js

$(document)
  .ready(function() {

    // fix menu when passed
    $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      })
    ;

    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item')
    ;

  })
;

// copyright
$('#copyright')
  .html(
   function(){
     var date = new Date();
     return '&copy; ' +  date.getFullYear() + ' BYR Wiki';
   }
  )
;

// search
for (var id in searchServices) {
  $('#search-services').append(
    $('<option>')
      .attr('value', id)
      .html(searchServices[id].name)
  );
};

$('#search-services')
  .dropdown()
;

$('#search-button').click(function() {
  var service = $('#search-services').val();
  var query = $('#search-query').val();
  if ( query ) {
    window.open(searchServices[service].url + query, '_blank');
  };
});

$('#search-query').keyup(function( event ) {
  if (event.key == 'Enter') {
    var service = $('#search-services').val();
    var query = $('#search-query').val();
    console.log(query);
    if ( query ) {
      window.open(searchServices[service].url + query, '_blank');
    };
  };
});

// links
var count = 0;
for (var pubLinkGroupName in pubLinks) {
  ++count;
  var pubLinksHolderId = 'pub-links-' + count;
  $('#pub-links').append(
    $('<div>').addClass('column')
      .attr('id', pubLinksHolderId)
      .append($('<h3>').addClass('ui header').html(pubLinkGroupName))
  );
  for (var pubLinkName in pubLinks[pubLinkGroupName]) {
    $('#' + pubLinksHolderId).append(
      $('<a>').addClass('ui button')
        .attr('href', pubLinks[pubLinkGroupName][pubLinkName].url)
        .attr('target', '_blank')
        .html(pubLinkName)
    );
  };
};

var count = 0;
for (var byrLinkGroupName in byrLinks) {
  ++count;
  var byrLinksHolderId = 'byr-links-' + count;
  $('#byr-links').append(
    $('<div>').addClass('column')
      .attr('id', byrLinksHolderId)
      .append($('<h3>').addClass('ui header').html(byrLinkGroupName))
  );
  for (var byrLinkName in byrLinks[byrLinkGroupName]) {
    $('#' + byrLinksHolderId).append(
      $('<a>').addClass('ui button')
        .attr('href', byrLinks[byrLinkGroupName][byrLinkName].url)
        .attr('target', '_blank')
        .html(byrLinkName)
    );
  };
};

// var count = 0;
// for (var linkGroupName in links) {
//   ++count;
//   var linksHolderId = 'links-' + count;
//   $('#links').append(
//     $('<div>').addClass('ui vertical stripe segment').append(
//       $('<div>').addClass('ui middle aligned stackable grid container').append(
//         $('<div>').addClass('row').append(
//           $('<div>').addClass('center aligned column')
//             .attr('id', linksHolderId)
//             .append($('<h3>').addClass('ui header').html(linkGroupName))
//         )
//       )
//     )
//   );
//   for (var linkName in links[linkGroupName]) {
//     $('#' + linksHolderId).append(
//       $('<a>').addClass('ui black basic button')
//         .attr('href', links[linkGroupName][linkName].url)
//         .attr('target', '_blank')
//         .html(linkName)
//     );
//   };
// };