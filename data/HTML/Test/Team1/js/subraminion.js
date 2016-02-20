
jQuery(document).ready(function($) {
  $('.facet-view-simple').facetview({
    search_url: 'http://52.11.224.239:9000/solr/select?',
    search_index: 'solr',
    facets: [
        {'field':'id', 'display': 'time'}, 
        {'field':'id', 'display': 'location'}
    ],
    paging: {
      from: 0,
      size: 10
    }
  });
  // set up form
  $('.demo-form').submit(function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var _data = {};
    $.each($form.serializeArray(), function(idx, item) {
      _data[item.name] = item.value;
    });
    $('.facet-view-here').facetview(_data);
  });
});
  
