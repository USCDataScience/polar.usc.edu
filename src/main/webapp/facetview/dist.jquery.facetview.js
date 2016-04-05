/*
 * jquery.facetview.js
 *
 * displays faceted browse results by querying a specified elasticsearch index
 * can read config locally or can be passed in as variable when executed
 * or a config variable can point to a remote config
 *
 * created by Mark MacGillivray - mark@cottagelabs.com
 *
 * http://cottagelabs.com
 *
 * There is an explanation of the options below.
 *
 */

var line_chart = null;
var MONTHS = [
    null,
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var dd_width = 850;
var dd_height = 300;

// first define the bind with delay function from (saves loading it separately)
// https://github.com/bgrins/bindWithDelay/blob/master/bindWithDelay.js

(function($) {
    $.fn.bindWithDelay = function( type, data, fn, timeout, throttle ) {
        var wait = null;
        var that = this;

        if ( $.isFunction( data ) ) {
            throttle = timeout;
            timeout = fn;
            fn = data;
            data = undefined;
        }

        function cb() {
            var e = $.extend(true, { }, arguments[0]);
            var throttler = function() {
                wait = null;
                fn.apply(that, [e]);
            };

            if (!throttle) { clearTimeout(wait); }
            if (!throttle || !wait) { wait = setTimeout(throttler, timeout); }
        }

        return this.bind(type, data, cb);
    };
})(jQuery);

// add extension to jQuery with a function to get URL parameters
jQuery.extend({
    getUrlVars: function() {
        var params = new Object;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for ( var i = 0; i < hashes.length; i++ ) {
            hash = hashes[i].split('=');
            if ( hash.length > 1 ) {
                if ( hash[1].replace(/%22/gi,"")[0] == "[" || hash[1].replace(/%22/gi,"")[0] == "{" ) {
                    hash[1] = hash[1].replace(/^%22/,"").replace(/%22$/,"");
                    var newval = JSON.parse(unescape(hash[1].replace(/%22/gi,'"')));
                } else {
                    var newval = unescape(hash[1].replace(/%22/gi,'"'));
                }
                params[hash[0]] = newval;
            }
        }
        return params;
    },
    getUrlVar: function(name){
        return jQuery.getUrlVars()[name];
    }
});


// Deal with indexOf issue in <IE9
// provided by commentary in repo issue - https://github.com/okfn/facetview/issues/18
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}

/* EXPLAINING THE FACETVIEW OPTIONS
 Facetview options can be set on instantiation. The list below details which options are available.
 Options can also be set and retrieved externally via $.fn.facetview.options.
 Query values can also be read from the query parameters of the current page, or provided in
 the "source" option for initial search.
 Also, whilst facetview is executing a query, it will "show" any element with the "notify-loading" class.
 So that class can be applied to any element on a page that can be used to signify loading is taking place.
 Once facetview has executed a query, the querystring used is available under "options.querystring".
 And the result object as retrieved directly from the index is available under "options.rawdata".
 searchbox_class
 ---------------
 This should only be set if embedded_search is set to false, and if an alternative search box on the page should
 be used as the source of search terms. If so, this should be set to
 the class name (including preceding .) of the text input that should be used as the source of the search terms.
 It is only a class instead of an ID so that it can be applied to fields that may already have an ID -
 it should really identify a unique box on the page for entering search terms for this instance of facetview.
 So an ID could actually also be used - just precede with # instead of .
 This makes it possible to embed a search box anywhere on a page and have it be used as the source of simple
 search parameters for the facetview. Only the last text box with this clas will be used.
 embedded_search
 ---------------
 Default to true, in which case full search term functionality is created and displayed on the page.
 If this is false, the search term text box and options will be hidden, so that new search terms cannot
 be provided by the user.
 It is possible to set an alternative search term input box on the page instead, by setting this to false and
 also setting a searchbox_class value to identify the basic source of search terms, in which case such a box
 must be manually created elsewhere on the page.
 searchbox_shade
 ---------------
 The background colour to apply to the search box
 sharesave_link
 --------------
 Default to true, in which case the searchbox - if drawn by facetview - will be appended with a button that
 shows the full current search parameters as a URL.
 config_file
 -----------
 Specify as a URL from which to pull a JSON config file specifying these options.
 facets
 ------
 A list of facet objects which should be created as filter options on the page.
 As per elasticsearch facets settings, plus "display" as a display name for the facet, instead of field name.
 If these should be nested, define them with full scope e.g. nestedobj.nestedfield.
 extra_facets
 ------------
 An object of named extra facet objects that should be submitted and executed on each query.
 These will NOT be used to generate filters on the page, but the result object can be queried
 for their content for other purposes.
 searchbox_fieldselect
 ---------------------
 A list of objects specifying fields to which search terms should be restricted.
 Each object should have a "display" value for displaying as the name of the option,
 and a "field" option specifying the field to restrict the search to.
 search_sortby
 ----------------
 A list of objects describing sort option dropdowns.
 Each object requires a "display" value, and "field" value upon which to sort results.
 NOTE sort fields must be unique on the ES index, NOT lists. Otherwise it will fail silently. Choose wisely.
 enable_rangeselect
 ------------------
 RANGES NEED SOME WORK AFTER RECENT UPDATE, KEEP DISABLED FOR NOW
 Enable or disable the ability to select a range of filter values
 include_facets_in_querystring
 -----------------------------
 Default to false.
 Whether or not to include full facet settings in the querystring when it is requested for display.
 This makes it easier to get the querystring for other purposes, but does not change the query that is
 sent to the index.
 result_display
 --------------
 A display template for search results. It is a list of lists.
 Each list specifies a line. Within each list, specify the contents of the line using objects to describe
 them. Each content piece should pertain to a particular "field" of the result set, and should specify what
 to show "pre" and "post" the given field
 display_images
 --------------
 Default to true, in which case any image found in a given result object will be displayed to the left
 in the result object output.
 description
 -----------
 Just an option to provide a human-friendly description of the functionality of the instantiated facetview.
 Like "search my shop". Will be displayed on the page.
 search_url
 ----------
 The URL at the index to which searches should be submitted in order to retrieve JSON results.
 datatype
 --------
 The datatype that should be used when submitting a search to the index - e.g. JSON for local, JSONP for remote.
 initialsearch
 -------------
 Default to true, in which case a search-all will be submitted to the index on page load.
 Set to false to wait for user input before issuing the first search.
 fields
 ------
 A list of which fields the index should return in result objects (by default elasticsearch returns them all).
 partial_fields
 --------------
 A definition of which fields to return, as per elasticsearch docs http://www.elasticsearch.org/guide/reference/api/search/fields.html
 nested
 ------
 A list of keys for which the content should be considered nested for query and facet purposes.
 NOTE this requires that such keys be referenced with their full scope e.g. nestedobj.nestedfield.
 Only works on top-level keys so far.
 default_url_params
 ------------------
 Any query parameters that the index search URL needs by default.
 freetext_submit_delay
 ---------------------
 When search terms are typed in the search box, they are automatically submitted to the index.
 This field specifies in milliseconds how long to wait before sending another query - e.g. waiting
 for the user to finish typing a word.
 q
 -
 Specify a query value to start with when the page is loaded. Will be submitted as the initial search value
 if initialsearch is enabled. Will also be set as the value of the searchbox on page load.
 predefined_filters
 ------------------
 Facet / query values to apply to all searches. Give each one a reference key, then in each object define it
 as per an elasticsearch query for appending to the bool must.
 If these filters should be applied at the nested level, then prefix the name with the relevant nesting prefix.
 e.g. if the nested object is called stats, call the filter stats.MYFILTER.
 filter
 -------
 JSON document describing an `elasticsearch filter <http://www.elasticsearch.org/guide/reference/api/search/filter/>`_
 paging
 ------
 An object defining the paging settings:
 from
 ----
 Which result number to start displaying results from
 size
 ----
 How many results to get and display per "page" of results
 pager_on_top
 ------------
 Default to false, in which case the pager - e.g. result count and prev / next page buttons - only appear
 at the bottom of the search results.
 Set to true to show the pager at the top of the search results as well.
 pager_slider
 ------------
 If this is set to true, then the paging options will be a left and right arrow at the bottom, with the
 count in between, but a bit bigger and more slider-y than the standard one. Works well for displaying
 featured content, for example.
 sort
 ----
 A list of objects defining how to sort the results, as per elasticsearch sorting.
 searchwrap_start
 searchwrap_end
 ----------------
 HTML values in which to wrap the full result set, to style them into the page they are being injected into.
 resultwrap_start
 resultwrap_end
 ----------------
 HTML values in which to wrap each result object
 result_box_colours
 ------------------
 A list of background colours that will be randomly assigned to each result object that has the "result_box"
 class. To use this, specify the colours in this list and ensure that the "result_display" option uses the
 "result_box" class to wrap the result objects.
 fadein
 ------
 Define a fade-in delay in milliseconds so that whenever a new list of results is displays, it uses the fade-in effect.
 post_search_callback
 --------------------
 This can define or reference a function that will be executed any time new search results are retrieved and presented on the page.
 pushstate
 ---------
 Updates the URL string with the current query when the user changes the search terms
 linkify
 -------
 Makes any URLs in the result contents into clickable links
 default_operator
 ----------------
 Sets the default operator in text search strings - elasticsearch uses OR by default, but can also be AND
 default_freetext_fuzzify
 ------------------------
 If this exists and is not false, it should be either * or ~. If it is * then * will be prepended and appended
 to each string in the freetext search term, and if it is ~ then ~ will be appended to each string in the freetext
 search term. If * or ~ or : are already in the freetext search term, it will be assumed the user is already trying
 to do a complex search term so no action will be taken. NOTE these changes are not replicated into the freetext
 search box - the end user will not know they are happening.
 */


// now the facetview function
(function($){
    $.fn.facetview = function(options) {

        // a big default value (pulled into options below)
        // demonstrates how to specify an output style based on the fields that can be found in the result object
        // where a specified field is not found, the pre and post for it are just ignored
        var resdisplay = [
            [
                {
                    "field": "author.name"
                },
                {
                    "pre": "(",
                    "field": "year",
                    "post": ")"
                }
            ],
            [
                {
                    "pre": "<strong>",
                    "field": "title",
                    "alternative_field": "booktitle",
                    "post": "</strong>"
                }
            ],
            [
                {
                    "field": "howpublished"
                },
                {
                    "pre": "in <em>",
                    "field": "journal.name",
                    "post": "</em>,"
                },
                {
                    "pre": "<em>",
                    "field": "booktitle",
                    "post": "</em>,"
                },
                {
                    "pre": "vol. ",
                    "field": "volume",
                    "post": ","
                },
                {
                    "pre": "p. ",
                    "field": "pages"
                },
                {
                    "field": "publisher"
                }
            ],
            [
                {
                    "field": "link.url"
                }
            ],
            [
                {
                    "pre": "<span class='highlightings'>",
                    "highlight_field": "text",
                    "post": "</span>"
                }
            ]
        ];

        // specify the defaults
        var defaults = {
            "config_file": false,
            "embedded_search": true,
            "searchbox_class": "",
            "searchbox_fieldselect": [],
            "searchbox_shade": "#ecf4ff",
            "search_sortby": [],
            "sharesave_link": true,
            "description":"",
            "facets":[],
            "default_url_params":{
                'facet.mincount':1,
                'wt':'json',
                'indent':'true'
            },
            "solr_paging_params":{
                "from":"start",
                "size":"rows"
            },
            "query_parameter":"q",
            "extra_facets": {},
            "enable_rangeselect": false,
            "include_facets_in_querystring": false,
            "result_display": resdisplay,
            "display_images": true,
            "search_url":"",
            "datatype":"jsonp",
            "initialsearch":true,
            "fields": false,
            "partial_fields": false,
            "nested": [],
            "default_url_params":{},
            "freetext_submit_delay":"500",
            "q":"",
            "sort":[],
            "predefined_filters":{},
            "paging":{
                "from":0,
                "size":10
            },
            "pager_on_top": false,
            "pager_slider": false,
            "searchwrap_start":'<table class="table table-striped table-bordered" id="facetview_results">',
            "searchwrap_end":"</table>",
            "resultwrap_start":"<tr><td>",
            "resultwrap_end":"</td></tr>",
            "result_box_colours":[],
            "fadein":800,
            "post_search_callback": false,
            "pushstate": true,
            "linkify": true,
            "default_operator": "OR",
            "default_freetext_fuzzify": false
        };


        // and add in any overrides from the call
        // these options are also overridable by URL parameters
        // facetview options are declared as a function so they are available externally
        // (see bottom of this file)
        var provided_options = $.extend(defaults, options);
        var url_options = $.getUrlVars();
        $.fn.facetview.options = $.extend(provided_options,url_options);
        var options = $.fn.facetview.options;


        // ===============================================
        // functions to do with filters
        // ===============================================

        // show the filter values
        var showfiltervals = function(event) {
            event.preventDefault();
            if ( $(this).hasClass('facetview_open') ) {
                $(this).children('i').removeClass('icon-minus');
                $(this).children('i').addClass('icon-plus');
                $(this).removeClass('facetview_open');
                $('[id="facetview_' + $(this).attr('rel') +'"]', obj ).children().find('.facetview_filtervalue').hide();
                $(this).siblings('.facetview_filteroptions').hide();
            } else {
                $(this).children('i').removeClass('icon-plus');
                $(this).children('i').addClass('icon-minus');
                $(this).addClass('facetview_open');
                $('[id="facetview_' + $(this).attr('rel') +'"]', obj ).children().find('.facetview_filtervalue').show();
                $(this).siblings('.facetview_filteroptions').show();
            }
        };

        // function to switch filters to OR instead of AND
        var orfilters = function(event) {
            event.preventDefault();
            if ( $(this).attr('rel') == 'AND' ) {
                $(this).attr('rel','OR');
                $(this).css({'color':'#333'});
                $('.facetview_filterselected[rel="' + $(this).attr('href') + '"]', obj).addClass('facetview_logic_or');
            } else {
                $(this).attr('rel','AND');
                $(this).css({'color':'#aaa'});
                $('.facetview_filterselected[rel="' + $(this).attr('href') + '"]', obj).removeClass('facetview_logic_or');
            }
            dosearch();
        }

        // function to perform for sorting of filters
        var sortfilters = function(event) {
            event.preventDefault();
            var sortwhat = $(this).attr('href');
            var which = 0;
            for ( var i = 0; i < options.facets.length; i++ ) {
                var item = options.facets[i];
                if ('field' in item) {
                    if ( item['field'] == sortwhat) {
                        which = i;
                    }
                }
            }
            // iterate to next sort type on click. order is term, rterm, count, rcount
            if ( $(this).hasClass('facetview_term') ) {
                options.facets[which]['order'] = 'reverse_term';
                $(this).html('a-z <i class="icon-arrow-up"></i>');
                $(this).removeClass('facetview_term').addClass('facetview_rterm');
            } else if ( $(this).hasClass('facetview_rterm') ) {
                options.facets[which]['order'] = 'count';
                $(this).html('count <i class="icon-arrow-down"></i>');
                $(this).removeClass('facetview_rterm').addClass('facetview_count');
            } else if ( $(this).hasClass('facetview_count') ) {
                options.facets[which]['order'] = 'reverse_count';
                $(this).html('count <i class="icon-arrow-up"></i>');
                $(this).removeClass('facetview_count').addClass('facetview_rcount');
            } else if ( $(this).hasClass('facetview_rcount') ) {
                options.facets[which]['order'] = 'term';
                $(this).html('a-z <i class="icon-arrow-down"></i>');
                $(this).removeClass('facetview_rcount').addClass('facetview_term');
            }
            dosearch();
        };

        // adjust how many results are shown
        var morefacetvals = function(event) {
            event.preventDefault();
            var morewhat = options.facets[ $(this).attr('rel') ];
            if ('size' in morewhat ) {
                var currentval = morewhat['size'];
            } else {
                var currentval = 10;
            }
            var newmore = prompt('Currently showing ' + currentval + '. How many would you like instead?');
            if (newmore) {
                options.facets[ $(this).attr('rel') ]['size'] = parseInt(newmore);
                $(this).html(newmore);
                dosearch();
            }
        };

        // insert a facet range once selected
        // TODO: UPDATE
        var dofacetrange = function(rel) {
            $('#facetview_rangeresults_' + rel, obj).remove();
            var range = $('#facetview_rangechoices_' + rel, obj).html();
            var newobj = '<div style="display:none;" class="btn-group" id="facetview_rangeresults_' + rel + '"> \
                <a class="facetview_filterselected facetview_facetrange facetview_clear \
                btn btn-info" rel="' + rel +
                '" alt="remove" title="remove"' +
                ' href="' + $(this).attr("href") + '">' +
                range + ' <i class="icon-white icon-remove"></i></a></div>';
            $('#facetview_selectedfilters', obj).append(newobj);
            $('.facetview_filterselected', obj).unbind('click',clearfilter);
            $('.facetview_filterselected', obj).bind('click',clearfilter);
            options.paging.from = 0;
            dosearch();
        };
        // clear a facet range
        var clearfacetrange = function(event) {
            event.preventDefault();
            $('#facetview_rangeresults_' + $(this).attr('rel'), obj).remove();
            $('#facetview_rangeplaceholder_' + $(this).attr('rel'), obj).remove();
            dosearch();
        };
        // build a facet range selector
        var facetrange = function(event) {
            // TODO: when a facet range is requested, should hide the facet list from the menu
            // should perhaps also remove any selections already made on that facet
            event.preventDefault();
            var rel = $(this).attr('rel');
            var rangeselect = '<div id="facetview_rangeplaceholder_' + rel + '" class="facetview_rangecontainer clearfix"> \
                <div class="clearfix"> \
                <h3 id="facetview_rangechoices_' + rel + '" style="margin-left:10px; margin-right:10px; float:left; clear:none;" class="clearfix"> \
                <span class="facetview_lowrangeval_' + rel + '">...</span> \
                <small>to</small> \
                <span class="facetview_highrangeval_' + rel + '">...</span></h3> \
                <div style="float:right;" class="btn-group">';
            rangeselect += '<a class="facetview_facetrange_remove btn" rel="' + rel + '" alt="remove" title="remove" \
                 href="#"><i class="icon-remove"></i></a> \
                </div></div> \
                <div class="clearfix" style="margin:20px;" id="facetview_slider_' + rel + '"></div> \
                </div>';
            $('#facetview_selectedfilters', obj).after(rangeselect);
            $('.facetview_facetrange_remove', obj).unbind('click',clearfacetrange);
            $('.facetview_facetrange_remove', obj).bind('click',clearfacetrange);
            var values = [];
            var valsobj = $( '#facetview_' + $(this).attr('href').replace(/\./gi,'_'), obj );
            valsobj.find('.facetview_filterchoice', obj).each(function() {
                values.push( $(this).attr('href') );
            });
            values = values.sort();
            $( "#facetview_slider_" + rel, obj ).slider({
                range: true,
                min: 0,
                max: values.length-1,
                values: [0,values.length-1],
                slide: function( event, ui ) {
                    $('#facetview_rangechoices_' + rel + ' .facetview_lowrangeval_' + rel, obj).html( values[ ui.values[0] ] );
                    $('#facetview_rangechoices_' + rel + ' .facetview_highrangeval_' + rel, obj).html( values[ ui.values[1] ] );
                    dofacetrange( rel );
                }
            });
            $('#facetview_rangechoices_' + rel + ' .facetview_lowrangeval_' + rel, obj).html( values[0] );
            $('#facetview_rangechoices_' + rel + ' .facetview_highrangeval_' + rel, obj).html( values[ values.length-1] );
        };

        // pass a list of filters to be displayed
        var buildfilters = function() {
            if ( options.facets.length > 0 ) {
                var filters = options.facets;
                var thefilters = '';
                for ( var idx = 0; idx < filters.length; idx++ ) {
                    var _filterTmpl = '<table id="facetview_{{FILTER_NAME}}" class="facetview_filters table table-bordered table-condensed table-striped"> \
                        <tr><td><a class="facetview_filtershow" title="filter by {{FILTER_DISPLAY}}" rel="{{FILTER_NAME}}" \
                        style="color:#333; font-weight:bold;" href=""><i class="icon-plus"></i> {{FILTER_DISPLAY}} \
                        </a> \
                        <div class="btn-group facetview_filteroptions" style="display:none; margin-top:5px;"> \
                            <a class="btn btn-small facetview_learnmore" title="click to view search help information" href="#"><b>?</b></a> \
                            <a class="btn btn-small facetview_morefacetvals" title="filter list size" rel="{{FACET_IDX}}" href="{{FILTER_EXACT}}">{{FILTER_HOWMANY}}</a> \
                            <a class="btn btn-small facetview_sort {{FILTER_SORTTERM}}" title="filter value order" href="{{FILTER_EXACT}}">{{FILTER_SORTCONTENT}}</a> \
                            <a class="btn btn-small facetview_or" title="select another option from this filter" rel="AND" href="{{FILTER_EXACT}}" style="color:#aaa;">OR</a> \
                            ';
                    if ( options.enable_rangeselect ) {
                        _filterTmpl += '<a class="btn btn-small facetview_facetrange" title="make a range selection on this filter" rel="{{FACET_IDX}}" href="{{FILTER_EXACT}}" style="color:#aaa;">range</a>';
                    }
                    _filterTmpl +='</div> \
                        </td></tr> \
                        </table>';
                    _filterTmpl = _filterTmpl.replace(/{{FILTER_NAME}}/g, filters[idx]['field'].replace(/\./gi,'_').replace(/\:/gi,'_')).replace(/{{FILTER_EXACT}}/g, filters[idx]['field']);
                    thefilters += _filterTmpl;
                    if ('size' in filters[idx] ) {
                        thefilters = thefilters.replace(/{{FILTER_HOWMANY}}/gi, filters[idx]['size']);
                    } else {
                        thefilters = thefilters.replace(/{{FILTER_HOWMANY}}/gi, 10);
                    };
                    if ( 'order' in filters[idx] ) {
                        if ( filters[idx]['order'] == 'term' ) {
                            thefilters = thefilters.replace(/{{FILTER_SORTTERM}}/g, 'facetview_term');
                            thefilters = thefilters.replace(/{{FILTER_SORTCONTENT}}/g, 'a-z <i class="icon-arrow-down"></i>');
                        } else if ( filters[idx]['order'] == 'reverse_term' ) {
                            thefilters = thefilters.replace(/{{FILTER_SORTTERM}}/g, 'facetview_rterm');
                            thefilters = thefilters.replace(/{{FILTER_SORTCONTENT}}/g, 'a-z <i class="icon-arrow-up"></i>');
                        } else if ( filters[idx]['order'] == 'count' ) {
                            thefilters = thefilters.replace(/{{FILTER_SORTTERM}}/g, 'facetview_count');
                            thefilters = thefilters.replace(/{{FILTER_SORTCONTENT}}/g, 'count <i class="icon-arrow-down"></i>');
                        } else if ( filters[idx]['order'] == 'reverse_count' ) {
                            thefilters = thefilters.replace(/{{FILTER_SORTTERM}}/g, 'facetview_rcount');
                            thefilters = thefilters.replace(/{{FILTER_SORTCONTENT}}/g, 'count <i class="icon-arrow-up"></i>');
                        };
                    } else {
                        thefilters = thefilters.replace(/{{FILTER_SORTTERM}}/g, 'facetview_count');
                        thefilters = thefilters.replace(/{{FILTER_SORTCONTENT}}/g, 'count <i class="icon-arrow-down"></i>');
                    };
                    thefilters = thefilters.replace(/{{FACET_IDX}}/gi,idx);
                    if ('display' in filters[idx]) {
                        thefilters = thefilters.replace(/{{FILTER_DISPLAY}}/g, filters[idx]['display']);
                    } else {
                        thefilters = thefilters.replace(/{{FILTER_DISPLAY}}/g, filters[idx]['field']);
                    };
                };
                $('#facetview_filters', obj).html("").append(thefilters);
                $('.facetview_morefacetvals', obj).bind('click',morefacetvals);
                $('.facetview_facetrange', obj).bind('click',facetrange);
                $('.facetview_sort', obj).bind('click',sortfilters);
                $('.facetview_or', obj).bind('click',orfilters);
                $('.facetview_filtershow', obj).bind('click',showfiltervals);
                $('.facetview_learnmore', obj).unbind('click',learnmore);
                $('.facetview_learnmore', obj).bind('click',learnmore);
                options.description ? $('#facetview_filters', obj).append('<div>' + options.description + '</div>') : "";
            };
        };

        // trigger a search when a filter choice is clicked
        // or when a source param is found and passed on page load
        var clickfilterchoice = function(event,rel,href) {
            if ( event ) {
                event.preventDefault();
                var rel = $(this).attr("rel");
                var href = $(this).attr("href");
            }
            var relclean = rel.replace(/\./gi,'_').replace(/\:/gi,'_');
            // Do nothing if element already exists.
            if( $('a.facetview_filterselected[href="'+href+'"][rel="'+rel+'"]').length ){
                return null;
            }

            var newobj = '<a class="facetview_filterselected facetview_clear btn btn-info';
            if ( $('.facetview_or[href="' + rel + '"]', obj).attr('rel') == 'OR' ) {
                newobj += ' facetview_logic_or';
            }
            newobj += '" rel="' + rel +
                '" alt="remove" title="remove"' +
                ' href="' + href + '">' +
                href + ' <i class="icon-white icon-remove" style="margin-top:1px;"></i></a>';

            if ( $('#facetview_group_' + relclean, obj).length ) {
                $('#facetview_group_' + relclean, obj).append(newobj);
            } else {
                var pobj = '<div id="facetview_group_' + relclean + '" class="btn-group">';
                pobj += newobj + '</div>';
                $('#facetview_selectedfilters', obj).append(pobj);
            };

            $('.facetview_filterselected', obj).unbind('click',clearfilter);
            $('.facetview_filterselected', obj).bind('click',clearfilter);
            if ( event ) {
                options.paging.from = 0;
                dosearch();
            };
        };

        // clear a filter when clear button is pressed, and re-do the search
        var clearfilter = function(event) {
            event.preventDefault();
            if ( $(this).siblings().length == 0 ) {
                $(this).parent().remove();
            } else {
                $(this).remove();
            }
            dosearch();
        };

        // ===============================================
        // functions to do with building results
        // ===============================================

        // read the result object and return useful vals
        // returns an object that contains things like ["data"] and ["facets"]
        var parseresults = function(dataobj) {
            var resultobj = new Object();
            resultobj["records"] = new Array();
            resultobj["start"] = "";
            resultobj["found"] = "";
            resultobj["facets"] = new Object();
            if (options.search_index == "elasticsearch"){
                for ( var item = 0; item < dataobj.hits.hits.length; item++ ) {
                    if ( options.fields ) {
                        resultobj["records"].push(dataobj.hits.hits[item].fields);
                    } else if ( options.partial_fields ) {
                        var keys = [];
                        for(var key in options.partial_fields){
                            keys.push(key);
                        }
                        resultobj["records"].push(dataobj.hits.hits[item].fields[keys[0]]);
                    } else {
                        resultobj["records"].push(dataobj.hits.hits[item]._source);
                    }
                }
                resultobj["start"] = "";
                resultobj["found"] = dataobj.hits.total;
                for (var item in dataobj.facets) {
                    var facetsobj = new Object();
                    for (var thing = 0; thing < dataobj.facets[item]["terms"].length; thing++) {
                        facetsobj[ dataobj.facets[item]["terms"][thing]["term"] ] = dataobj.facets[item]["terms"][thing]["count"];
                    }
                    resultobj["facets"][item] = facetsobj;
                }
            }
            else{
                resultobj["records"] = dataobj.response.docs;
                resultobj["start"] = dataobj.response.start;
                resultobj["found"] = dataobj.response.numFound;
                if (dataobj.facet_counts) {
                    for (var item in dataobj.facet_counts.facet_fields) {
                        var facetsobj = new Object();
                        var count = 0;
                        for ( var each in dataobj.facet_counts.facet_fields[item]) {
                            if ( count % 2 == 0 ) {
                                facetsobj[ dataobj.facet_counts.facet_fields[item][each] ] = dataobj.facet_counts.facet_fields[item][count + 1];
                            }
                            count += 1;
                        }
                        resultobj["facets"][item] = facetsobj;
                    }
                }
            }
            return resultobj;
        };

        // decrement result set
        var decrement = function(event) {
            event.preventDefault();
            if ( $(this).html() != '..' ) {
                options.paging.from = options.paging.from - options.paging.size;
                options.paging.from < 0 ? options.paging.from = 0 : "";
                dosearch();
            }
        };
        // increment result set
        var increment = function(event) {
            event.preventDefault();
            if ( $(this).html() != '..' ) {
                options.paging.from = parseInt($(this).attr('href'));
                dosearch();
            }
        };

        // used to get value by dotted notation in result_display
        var getvalue = function(obj, dotted_notation) {
            if(!dotted_notation) return;
            var parts = dotted_notation.split('.');
            parts.reverse();
            var ref = [parts.pop()];
            while (parts.length && !(ref.join(".") in obj)) {
                ref.push(parts.pop());
            }
            var addressed_ob = obj[ref.join(".")];
            var left = parts.reverse().join(".");

            if (addressed_ob && addressed_ob.constructor.toString().indexOf("Array") == -1) {
                if (parts.length)
                    return getvalue(addressed_ob, left);
                else
                    return addressed_ob;
            } else {
                if ( addressed_ob !== undefined ) {
                    var thevalue = [];
                    for ( var row = 0; row < addressed_ob.length; row++ ) {
                        thevalue.push(addressed_ob[row]);
                    }
                    return thevalue;
                } else {
                    return undefined;
                }
            }
        };

        // given a result record, build how it should look on the page
        var buildrecord = function(index) {
            var record = options.data['records'][index];
            var result = options.resultwrap_start;
            // add first image where available
            if (options.display_images) {

                // TODO: this is where we need to take the URL as stored in ID field, translate it to a web URL, and show it.

                var recstr = JSON.stringify(record);
                var regex = /(http:\/\/\S+?\.(jpg|png|gif|jpeg))/;
                var img = regex.exec(recstr);
                if (img) {
                    result += '<img class="thumbnail" style="float:left; width:100px; margin:0 5px 10px 0; max-height:150px;" src="' + img[0] + '" />';
                }
            }
            // add the record based on display template if available
            var display = options.result_display;
            var lines = '';
            for ( var lineitem = 0; lineitem < display.length; lineitem++ ) {
                line = "";
                for ( var object = 0; object < display[lineitem].length; object++ ) {
                    var thekey = display[lineitem][object]['field'];
                    var thevalue = getvalue(record, thekey);
                    if (thevalue && thevalue.toString().length) {
                        line += display[lineitem][object]['pre'] ? display[lineitem][object]['pre'] : false;
                        if ( typeof(thevalue) == 'object' ) {
                            for ( var val = 0; val < thevalue.length; val++ ) {
                                line += val != 0 ? ', ' : false;
                                line += thevalue[val];
                            }
                        } else {
                            line += thevalue;
                        }
                        display[lineitem][object]['post']
                            ? line += display[lineitem][object]['post'] : line += ' ';
                    }
                }
                if (line) {
                    lines += line.replace(/^\s/,'').replace(/\s$/,'').replace(/\,$/,'') + "<br />";
                }
            }
            lines ? result += lines : result += JSON.stringify(record,"","    ");
            result += options.resultwrap_end;
            return result;
        };

        // view a full record when selected
        var viewrecord = function(event) {
            event.preventDefault();
            var record = options.data['records'][$(this).attr('href')];
            alert(JSON.stringify(record,"","    "));

        }

        // put the results on the page
        var showresults = function(sdata) {
            options.rawdata = sdata;
            // get the data and parse from the es layout
            var data = parseresults(sdata);
            options.data = data;

            // initialize plot
            if (line_chart == null && options.linechart_field != null && options.linechart_field != "") {
                line_chart = c3.generate({
                    bindto: '#line_chart',
                    data: {
                        x: 'year',
                        columns: [
                        ]
                    }
                });
            }


            // for each filter setup, find the results for it and append them to the relevant filter
            for ( var each = 0; each < options.facets.length; each++ ) {
                var facet = options.facets[each]['field'];
                var facetclean = options.facets[each]['field'].replace(/\./gi,'_').replace(/\:/gi,'_');
                var facet_filter = $('[id="facetview_'+facetclean+'"]', obj);
                facet_filter.children().find('.facetview_filtervalue').remove();
                var records = data["facets"][ facet ];

                // compensate for Solr not being able to show facet results in reverse order
                if ("order" in options.facets[each] && options.facets[each]["order"].indexOf("reverse") > -1) {
                    // http://stackoverflow.com/questions/18977881/can-i-loop-through-a-javascript-object-in-reverse-order
                    function ReverseObject(Obj){
                        var TempArr = [];
                        var NewObj = {};
                        for (var Key in Obj){
                            TempArr.push(Key);
                        }
                        for (var i = TempArr.length-1; i >= 0; i--){
                            NewObj[TempArr[i]] = Obj[TempArr[i]];
                        }
                        return NewObj;
                    };
                    records = ReverseObject(records);
                }

                var years = ['year'];
                var year_hits = ['hits'];
                var lineChartFacet = false;
                var dendrogramFacet = false;
                if (facet == options.linechart_field){
                    lineChartFacet = true;
                }

                if (facet == options.dendrogram_field){
                    dendrogramFacet = true;
                }

                for ( var item in records ) {
                    var append = '<tr class="facetview_filtervalue" style="display:none;"><td><a class="facetview_filterchoice' +
                        '" rel="' + facet + '" href="' + item + '">' + item +
                        ' (' + records[item] + ')</a></td></tr>';
                    facet_filter.append(append);

                    if (lineChartFacet){
                        years.push(item);
                        year_hits.push(records[item]);
                    }

                }

                if ( $('.facetview_filtershow[rel="' + facetclean + '"]', obj).hasClass('facetview_open') ) {
                    facet_filter.children().find('.facetview_filtervalue').show();
                }

                if(lineChartFacet){
                    // clean the years and hits
                    var year_hash = {}
                    for (var i = 0; i < years.length; i++){
                        if (years[i] == "year") continue;
                        var year = years[i].substring(0,4);
                        if (year in year_hash){
                            hits = parseInt(years[year]);
                            hits += parseInt(year_hits[i]);
                        }
                        else{
                            year_hash[year] = year_hits[i];
                        }
                    }

                    years = [];
                    year_hits = [];
                    years.push('year');
                    year_hits.push('hits');
                    for (var year in year_hash){
                        years.push(year);
                        year_hits.push(year_hash[year]);
                    }

                    line_chart.load({
                        columns: [
                            years,
                            year_hits
                        ]
                    });
                }

                if (dendrogramFacet){
                    $('#dendrogram').empty();
                    dendrogram = null;
                    var facet_selected = $('a.facetview_filterselected[rel="'+facet+'"]');
                    var root = {};
                    if (facet_selected.length > 0) {
                        dd_cluster = d3.layout.cluster().size([dd_height, dd_width - 160]);
                        dd_diagonal = d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
                        dendrogram = d3.select("#dendrogram").append("svg:svg")
                            .attr("width", dd_width)
                            .attr("height", dd_height)
                            .append("svg:g")
                            .attr("transform", "translate(80, 0)");
                        var facet_text = facet_selected[0].text;
                        //alert(facet_text);
                        root = {
                            "name": facet_text,
                            "children": []
                        };
                        //alert(data.records);
                        var rel_nodes = [];
                        for ( var i = 0; i < data.records.length; i++ ) {
                            var drec = data.records[i];
                            var drec_length = 0;
                            var drec_facet = eval('drec.'+facet);
                            if (drec_facet != undefined){
                                drec_length = drec_facet.length;
                            }
                            for (var j = 0; j < drec_length; j++) {
                                var rel_node = eval('drec.'+facet+'[j]');
                                if (facet_text.toLowerCase().trim() != rel_node.toLowerCase().trim() && rel_nodes.indexOf(rel_node) == -1) {
                                    root.children.push({ "name": rel_node, "children": []});
                                    rel_nodes.push(rel_node);
                                }
                            }
                        }

                        var nodes = dd_cluster.nodes(root),
                            links = dd_cluster.links(nodes);

                        var link = dendrogram.selectAll(".link")
                            .data(links)
                            .enter().append("path")
                            .attr("class", "link")
                            .attr("d", dd_diagonal);

                        var node = dendrogram.selectAll(".node")
                            .data(nodes)
                            .enter().append("g")
                            .attr("class", "node")
                            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

                        node.append("circle")
                            .attr("r", 4.5);

                        node.append("text")
                            .attr("dx", function(d) { return d.children ? -8 : 8; })
                            .attr("dy", 3)
                            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
                            .text(function(d) { return d.name; });

                        d3.select(self.frameElement).style("height", dd_height + "px");

                    }

                }

            }
            $('.facetview_filterchoice', obj).bind('click',clickfilterchoice);
            $('.facetview_filters', obj).each(function() {
                $(this).find('.facetview_filtershow').css({'color':'#333','font-weight':'bold'}).children('i').show();
                if ( $(this).children().find('.facetview_filtervalue').length > 1 ) {
                    $(this).show();
                } else {
                    //$(this).hide();
                    $(this).find('.facetview_filtershow').css({'color':'#ccc','font-weight':'normal'}).children('i').hide();
                };
            });

            // put result metadata on the page
            if ( typeof(options.paging.from) != 'number' ) {
                options.paging.from = parseInt(options.paging.from);
            }
            if ( typeof(options.paging.size) != 'number' ) {
                options.paging.size = parseInt(options.paging.size);
            }
            if ( options.pager_slider ) {
                var metaTmpl = '<div style="font-size:20px;font-weight:bold;margin:5px 0 10px 0;padding:5px 0 5px 0;border:1px solid #eee;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;"> \
                    <a alt="previous" title="previous" class="facetview_decrement" style="color:#333;float:left;padding:0 40px 20px 20px;" href="{{from}}">&lt;</a> \
                    <span style="margin:30%;">{{from}} &ndash; {{to}} of {{total}}</span> \
                    <a alt="next" title="next" class="facetview_increment" style="color:#333;float:right;padding:0 20px 20px 40px;" href="{{to}}">&gt;</a> \
                </div>';
            } else {
                var metaTmpl = '<div class="pagination"> \
                    <ul> \
                        <li class="prev"><a class="facetview_decrement" href="{{from}}">&laquo; back</a></li> \
                        <li class="active"><a>{{from}} &ndash; {{to}} of {{total}}</a></li> \
                        <li class="next"><a class="facetview_increment" href="{{to}}">next &raquo;</a></li> \
                    </ul> \
                </div>';
            };
            $('.facetview_metadata', obj).first().html("Not found...");
            if (data.found) {
                var from = options.paging.from + 1;
                var size = options.paging.size;
                !size ? size = 100 : "";
                var to = options.paging.from+size;
                data.found < to ? to = data.found : "";
                var meta = metaTmpl.replace(/{{from}}/g, from);
                meta = meta.replace(/{{to}}/g, to);
                meta = meta.replace(/{{total}}/g, data.found);
                $('.facetview_metadata', obj).html("").append(meta);
                $('.facetview_decrement', obj).bind('click',decrement);
                from < size ? $('.facetview_decrement', obj).html('..') : "";
                $('.facetview_increment', obj).bind('click',increment);
                data.found <= to ? $('.facetview_increment', obj).html('..') : "";
            }

            // put the filtered results on the page
            $('#facetview_results',obj).html("");
            var infofiltervals = new Array();

            $.each(data.records, function(index, value) {
                // write them out to the results div
                $('#facetview_results', obj).append( buildrecord(index) );
                options.linkify ? $('#facetview_results tr:last-child', obj).linkify() : false;
            });
            if ( options.result_box_colours.length > 0 ) {
                jQuery('.result_box', obj).each(function () {
                    var colour = options.result_box_colours[Math.floor(Math.random()*options.result_box_colours.length)] ;
                    jQuery(this).css("background-color", colour);
                });
            }
            $('#facetview_results', obj).children().hide().fadeIn(options.fadein);
            $('.facetview_viewrecord', obj).bind('click',viewrecord);
            jQuery('.notify_loading').hide();
            // if a post search callback is provided, run it
            if (typeof options.post_search_callback == 'function') {
                options.post_search_callback.call(this);
            }
        };

        // ===============================================
        // functions to do with searching
        // ===============================================

        // fuzzify the freetext search query terms if required
        var fuzzify = function(querystr) {
            var rqs = querystr
            if ( options.default_freetext_fuzzify !== undefined ) {
                if ( options.default_freetext_fuzzify == "*" || options.default_freetext_fuzzify == "~" ) {
                    if ( querystr.indexOf('*') == -1 && querystr.indexOf('~') == -1 && querystr.indexOf(':') == -1 ) {
                        var optparts = querystr.split(' ');
                        pq = "";
                        for ( var oi = 0; oi < optparts.length; oi++ ) {
                            var oip = optparts[oi];
                            if ( oip.length > 0 ) {
                                oip = oip + options.default_freetext_fuzzify;
                                options.default_freetext_fuzzify == "*" ? oip = "*" + oip : false;
                                pq += oip + " ";
                            }
                        };
                        rqs = pq;
                    };

                };
            };
            return rqs;
        };

        // build the search query URL based on current params
        var elasticsearchquery = function() {
            var qs = {};
            var bool = false;
            var nested = false;
            var seenor = []; // track when an or group are found and processed
            $('.facetview_filterselected',obj).each(function() {
                !bool ? bool = {'must': [] } : "";
                if ( $(this).hasClass('facetview_facetrange') ) {
                    var rngs = {
                        'from': $('.facetview_lowrangeval_' + $(this).attr('rel'), this).html(),
                        'to': $('.facetview_highrangeval_' + $(this).attr('rel'), this).html()
                    };
                    var rel = options.facets[ $(this).attr('rel') ]['field'];
                    var robj = {'range': {}};
                    robj['range'][ rel ] = rngs;
                    // check if this should be a nested query
                    var parts = rel.split('.');
                    if ( options.nested.indexOf(parts[0]) != -1 ) {
                        !nested ? nested = {"nested":{"_scope":parts[0],"path":parts[0],"query":{"bool":{"must":[robj]}}}} : nested.nested.query.bool.must.push(robj);
                    } else {
                        bool['must'].push(robj);
                    }
                } else {
                    // TODO: check if this has class facetview_logic_or
                    // if so, need to build a should around it and its siblings
                    if ( $(this).hasClass('facetview_logic_or') ) {
                        if ( !($(this).attr('rel') in seenor) ) {
                            seenor.push($(this).attr('rel'));
                            var bobj = {'bool':{'should':[]}};
                            $('.facetview_filterselected[rel="' + $(this).attr('rel') + '"]').each(function() {
                                if ( $(this).hasClass('facetview_logic_or') ) {
                                    var ob = {'term':{}};
                                    ob['term'][ $(this).attr('rel') ] = $(this).attr('href');
                                    bobj.bool.should.push(ob);
                                };
                            });
                            if ( bobj.bool.should.length == 1 ) {
                                var spacer = {'match_all':{}};
                                bobj.bool.should.push(spacer);
                            }
                        }
                    } else {
                        var rel = $(this).attr('rel');
                        var facet = options.facets.filter(function(f) {
                            return f['field'] === rel && f['facet_filter'];
                        })[0];
                        var bobj = {'term':{}};
                        bobj['term'][rel] = $(this).attr('href');
                        if (facet) {
                            qs['filter'] = facet['facet_filter'];
                        }
                    }

                    // check if this should be a nested query
                    var parts = $(this).attr('rel').split('.');
                    if ( options.nested.indexOf(parts[0]) != -1 ) {
                        !nested ? nested = {"nested":{"_scope":parts[0],"path":parts[0],"query":{"bool":{"must":[bobj]}}}} : nested.nested.query.bool.must.push(bobj);
                    } else {
                        bool['must'].push(bobj);
                    }
                }
            });
            for (var item in options.predefined_filters) {
                !bool ? bool = {'must': [] } : "";
                var pobj = options.predefined_filters[item];
                var parts = item.split('.');
                if ( options.nested.indexOf(parts[0]) != -1 ) {
                    !nested ? nested = {"nested":{"_scope":parts[0],"path":parts[0],"query":{"bool":{"must":[pobj]}}}} : nested.nested.query.bool.must.push(pobj);
                } else {
                    bool['must'].push(pobj);
                }
            }
            if (bool) {
                if ( options.q != "" ) {
                    var qryval = { 'query': fuzzify(options.q) };
                    $('.facetview_searchfield', obj).val() != "" ? qryval.default_field = $('.facetview_searchfield', obj).val() : "";
                    options.default_operator !== undefined ? qryval.default_operator = options.default_operator : false;
                    bool['must'].push( {'query_string': qryval } );
                };
                nested ? bool['must'].push(nested) : "";
                qs['query'] = {'bool': bool};
            } else {
                if ( options.q != "" ) {
                    var qryval = { 'query': fuzzify(options.q) };
                    $('.facetview_searchfield', obj).val() != "" ? qryval.default_field = $('.facetview_searchfield', obj).val() : "";
                    options.default_operator !== undefined ? qryval.default_operator = options.default_operator : false;
                    qs['query'] = {'query_string': qryval };
                } else {
                    qs['query'] = {'match_all': {}};
                };
            };
            // set any paging
            options.paging.from != 0 ? qs['from'] = options.paging.from : "";
            options.paging.size != 100 ? qs['size'] = options.paging.size : "";
            // set any sort or fields options
            options.sort.length > 0 ? qs['sort'] = options.sort : "";
            options.fields ? qs['fields'] = options.fields : "";
            options.partial_fields ? qs['partial_fields'] = options.partial_fields : "";
            // set any facets
            qs['facets'] = {};
            for ( var item = 0; item < options.facets.length; item++ ) {
                var fobj = jQuery.extend(true, {}, options.facets[item] );
                var facet_filter = fobj['facet_filter'];
                delete fobj['display'];
                delete fobj['facet_filter'];
                var facet = {'terms': fobj};
                if (facet_filter || qs['filter']) {
                    facet['facet_filter'] = {'and': []};
                    if (facet_filter) {
                        facet['facet_filter']['and'].push(facet_filter);
                    }
                    if (qs['filter']) {
                        facet['facet_filter']['and'].push(qs['filter']);
                    }
                }
                var parts = fobj['field'].split('.');
                qs['facets'][fobj['field']] = facet;
                for (var ni; ni < options.nested.length; ni++ ) {
                    if (fobj['field'].indexOf(options.nested[i]) == 0) {
                        nested ? qs['facets'][fobj['field']]["scope"] = options.nested[i] : qs['facets'][fobj['field']]["nested"] = options.nested[i];
                    }
                }
            }
            jQuery.extend(true, qs['facets'], options.extra_facets );
            // set elasticsearch filter, if any
            // set any filter
            if (options.filter) {
                qs['filter'] = options.filter;
            }
            //alert(JSON.stringify(qs,"","    "));
            qy = JSON.stringify(qs);
            if ( options.include_facets_in_querystring ) {
                options.querystring = qy;
            } else {
                delete qs.facets;
                options.querystring = JSON.stringify(qs)
            }
            options.sharesave_link ? $('.facetview_sharesaveurl', obj).val('http://' + window.location.host + window.location.pathname + '?source=' + options.querystring) : "";
            return qy;
        };

        //Solr Search
        var solrsearchquery = function() {
            // set default URL params
            var urlparams = "wt=json&";
            for (var item in options.default_url_params) {
                urlparams += item + "=" + options.default_url_params[item] + "&";
            }
            // do paging params
            var pageparams = "";
            for (var item in options.paging) {
                pageparams += options.solr_paging_params[item] + "=" + options.paging[item] + "&";
            }
            // set facet params
            var urlfilters = "";
            for (var item in options.facets) {
                urlfilters += "facet.field=" + options.facets[item]['field'] + "&";
                var size = options.facets[item]['size'] ? options.facets[item]['size'] : 10;
                urlfilters += "f." + options.facets[item]['field'] + ".facet.limit=" + size + "&";
                var sort = 'count';
                if (options.facets[item]['order']) {
                    sort = options.facets[item]['order'];
                    if (sort === 'term' || sort === 'reverse_term') {
                        sort = 'index';
                    }
                    else {
                        sort = 'count';
                    };
                };
                urlfilters += "f." + options.facets[item]['field'] + ".facet.sort=" + sort + "&";
            }

            urlfilters += "facet.mincount=1&";

            if ( options.facets.length > 0 ) {
                urlfilters += "facet=on&";
            }
            // build starting URL
            var theurl = urlparams + pageparams + urlfilters;
            // add default query values
            // build the query, starting with default values
            var query = "";

            $('.facetview_filterselected',obj).each(function() {
                query += $(this).attr('rel') + ':"' +
                    $(this).attr('href') + '" AND ';
            });
            // add any freetext filter
            if (options.q != "") {
                query += options.q;
            }
            if (!query.endsWith('*')) {
                query += '*';
            }
            query = query.replace(/ AND $/,"");
            // set a default for blank search
            if (query == "") {
                query = "*:*";
            }
            theurl += options.query_parameter + '=' + query;
            return theurl;
        };
        // execute a search
        var dosearch = function() {
            jQuery('.notify_loading').show();
            // update the options with the latest q value
            if ( options.searchbox_class.length == 0 ) {
                options.q = $('.facetview_freetext', obj).val();
            } else {
                options.q = $(options.searchbox_class).last().val();
            };
            // make the search query
            var qrystr = '';
            var url_1 = options.search_url;;
            if ( options.search_index == "elasticsearch") {
                qrystr = elasticsearchquery();
            } else {
                qrystr = solrsearchquery();
            }

            // augment the URL bar if possible
            if ( options.pushstate ) {
                var currurl = '?source=' + options.querystring;
                window.history.pushState("","search",currurl);
            };
            $.ajax({
                type: "get",
                url: url_1,
                data: qrystr,
                processData: false,
                dataType: options.datatype,
                jsonp: "json.wrf",
                success: showresults
            });
        };

        // show search help
        var learnmore = function(event) {
            event.preventDefault();
            $('#facetview_learnmore', obj).toggle();
        };

        // adjust how many results are shown
        var howmany = function(event) {
            event.preventDefault();
            var newhowmany = prompt('Currently displaying ' + options.paging.size +
                ' results per page. How many would you like instead?');
            if (newhowmany) {
                options.paging.size = parseInt(newhowmany);
                options.paging.from = 0;
                $('.facetview_howmany', obj).html(options.paging.size);
                dosearch();
            }
        };

        // change the search result order
        var order = function(event) {
            event.preventDefault();
            if ( $(this).attr('href') == 'desc' ) {
                $(this).html('<i class="icon-arrow-up"></i>');
                $(this).attr('href','asc');
                $(this).attr('title','current order ascending. Click to change to descending');
            } else {
                $(this).html('<i class="icon-arrow-down"></i>');
                $(this).attr('href','desc');
                $(this).attr('title','current order descending. Click to change to ascending');
            };
            orderby();
        };
        var orderby = function(event) {
            event ? event.preventDefault() : "";
            var sortchoice = $('.facetview_orderby', obj).val();
            if ( sortchoice.length != 0 ) {
                var sorting = {};
                var sorton = sortchoice;
                sorting[sorton] = {'order': $('.facetview_order', obj).attr('href')};
                options.sort = [sorting];
            } else {
                options.sort = [];
            }
            options.paging.from = 0;
            dosearch();
        };

        // parse any source params out for an initial search
        var parsesource = function() {
            var qrystr = options.source.query;
            if (qrystr && 'bool' in qrystr ) {
                var qrys = [];
                // TODO: check for nested
                if ( 'must' in qrystr.bool ) {
                    qrys = qrystr.bool.must;
                } else if ( 'should' in qrystr.bool ) {
                    qrys = qrystr.bool.should;
                };
                for ( var qry = 0; qry < qrys.length; qry++ ) {
                    for ( var key in qrys[qry] ) {
                        if ( key == 'term' ) {
                            for ( var t in qrys[qry][key] ) {
                                if ( !(t in options.predefined_filters) ) {
                                    clickfilterchoice(false,t,qrys[qry][key][t]);
                                };
                            };
                        } else if ( key == 'query_string' ) {
                            typeof(qrys[qry][key]['query']) == 'string' ? options.q = qrys[qry][key]['query'] : "";
                        } else if ( key == 'bool' ) {
                            // TODO: handle sub-bools
                        };
                    };
                };
            } else if (qrystr &&  'query_string' in qrystr ) {
                typeof(qrystr.query_string.query) == 'string' ? options.q = qrystr.query_string.query : "";
            };
        }

        // show the current url with the result set as the source param
        var sharesave = function(event) {
            event.preventDefault();
            $('.facetview_sharesavebox', obj).toggle();
        };

        // adjust the search field focus
        var searchfield = function(event) {
            event.preventDefault();
            options.paging.from = 0;
            dosearch();
        };

        // a help box for embed in the facet view object below
        var thehelp = '<div id="facetview_learnmore" class="well" style="margin-top:10px; display:none;">'
        options.sharesave_link ? thehelp += '<p><b>Share</b> or <b>save</b> the current search by clicking the share/save arrow button on the right.</p>' : "";
        thehelp += '<p><b>Remove all</b> search values and settings by clicking the <b>X</b> icon at the left of the search box above.</p> \
            <p><b>Partial matches with wildcard</b> can be performed by using the asterisk <b>*</b> wildcard. For example, <b>einste*</b>, <b>*nstei*</b>.</p> \
            <p><b>Fuzzy matches</b> can be performed using tilde <b>~</b>. For example, <b>einsten~</b> may help find <b>einstein</b>.</p> \
            <p><b>Exact matches</b> can be performed with <b>"</b> double quotes. For example <b>"einstein"</b> or <b>"albert einstein"</b>.</p> \
            <p>Match all search terms by concatenating them with <b>AND</b>. For example <b>albert AND einstein</b>.</p> \
            <p>Match any term by concatenating them with <b>OR</b>. For example <b>albert OR einstein</b>.</p>';
        if ( !options.default_freetext_fuzzify ) {
            thehelp += '<p><b>Exclude</b> terms by prefixing them with <b>-</b> (minus sign). For example <b>albert -einstein</b>.</p> \
                        <p><b>Require</b> terms by prefixing them with <b>+</b> (plus sign). For example <b>albert -physics +einstein</b> (albert is now optional but increases relevance). <a href="http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_boolean_operators" target="_blank">Full details here</a>.</p>';
        }

        thehelp += '<p><b>Combinations</b> will work too, like <b>albert OR einste~</b>, or <b>"albert" "einstein"</b>.</p> \
            <p><b>Result set size</b> can be altered by clicking on the result size number preceding the search box above.</p>';

        if ( options.searchbox_fieldselect.length > 0 ) {
            thehelp += '<p>By default, terms are searched for across entire record entries. \
                This can be restricted to particular fields by selecting the field of interest from the <b>search field</b> dropdown</p>';
        };
        if ( options.search_sortby.length > 0 ) {
            thehelp += '<p>Choose a field to <b>sort the search results</b> by clicking the double arrow above.</p>';
        };
        if ( options.facets.length > 0 ) {
            thehelp += '<hr></hr>';
            thehelp += '<p>Use the <b>filters</b> on the left to directly select values of interest. \
                Click the filter name to open the list of available terms and show further filter options.</p> \
                <p><b>Filter list size</b> can be altered by clicking on the filter size number.</p> \
                <p><b>Filter list order </b> can be adjusted by clicking the order options - \
                from a-z ascending or descending, or by count ascending or descending.</p> \
                <p>Filters search for unique values by default; to do an <b>OR</b> search - e.g. to look for more than one value \
                for a particular filter - click the OR button for the relevant filter then choose your values.</p> \
                <p>To further assist discovery of particular filter values, use in combination \
                with the main search bar - search terms entered there will automatically adjust the available filter values.</p>';
            if ( options.enable_rangeselect ) {
                thehelp += '<p><b>Apply a filter range</b> rather than just selecting a single value by clicking on the <b>range</b> button. \
                    This enables restriction of result sets to within a range of values - for example from year 1990 to 2012.</p> \
                    <p>Filter ranges are only available across filter values already in the filter list; \
                    so if a wider filter range is required, first increase the filter size then select the filter range.</p>';
            }
        };
        thehelp += '<p><a class="facetview_learnmore label" href="#">close the help</a></p></div>';

        // the facet view object to be appended to the page
        var thefacetview = '<div id="facetview"><div class="row-fluid">';
        if ( options.facets.length > 0 ) {
            thefacetview += '<div class="span3"><div id="facetview_filters" style="padding-top:45px;"></div></div>';
            thefacetview += '<div class="span9" id="facetview_rightcol">';
        } else {
            thefacetview += '<div class="span12" id="facetview_rightcol">';
        }
        thefacetview += '<div class="facetview_plots_container"><div id="line_chart"/><div id="dendrogram"/></div>';
        thefacetview += '<div class="facetview_search_options_container">';
        thefacetview += '<div class="btn-group" style="display:inline-block; margin-right:10px; height:51px"> \
            <a class="btn" title="clear all search settings and start again" href=""><i class="icon-remove"></i></a> \
            <a class="btn  facetview_howmany" title="change result set size" href="#">{{HOW_MANY}}</a>';
        if ( options.search_sortby.length > 0 ) {
            thefacetview += '<a class="btn facetview_order" title="current order descending. Click to change to ascending" \
                href="desc"><i class="icon-arrow-down"></i></a>';
            thefacetview += '</div>';
            thefacetview += '<select class="facetview_orderby" style="border-radius:5px; \
                -moz-border-radius:5px; -webkit-border-radius:5px; width:150px; background:#eee; margin:0 5px 21px 0;"> \
                <option value="">order by</option>';
            for ( var each = 0; each < options.search_sortby.length; each++ ) {
                var obj = options.search_sortby[each];
                thefacetview += '<option value="' + obj['field'] + '">' + obj['display'] + '</option>';
            };
            thefacetview += '</select>';
        } else {
            thefacetview += '</div>';
        };
        if ( options.searchbox_fieldselect.length > 0 ) {
            thefacetview += '<select class="facetview_searchfield" style="border-radius:5px 0px 0px 5px; \
                -moz-border-radius:5px 0px 0px 5px; -webkit-border-radius:5px 0px 0px 5px; width:100px; margin:0 -2px 21px 0; background:' + options.searchbox_shade + ';">';
            thefacetview += '<option value="">search all</option>';
            for ( var each = 0; each < options.searchbox_fieldselect.length; each++ ) {
                var obj = options.searchbox_fieldselect[each];
                thefacetview += '<option value="' + obj['field'] + '">' + obj['display'] + '</option>';
            };
            thefacetview += '</select>';
        };
        thefacetview += '<input type="text" class="facetview_freetext span4" style="display:inline-block; margin:0 0 21px 0; width:400px; background:' + options.searchbox_shade + ';" name="q" \
            value="" placeholder="search term" />';
        if ( options.sharesave_link ) {
            thefacetview += '<a class="btn facetview_sharesave" title="share or save this search" style="margin:0 0 21px 5px;" href=""><i class="icon-share-alt"></i></a>';
            thefacetview += '<div class="facetview_sharesavebox alert alert-info" style="display:none;"> \
                <button type="button" class="facetview_sharesave close">Ã—</button> \
                <p>Share or save this search:</p> \
                <textarea class="facetview_sharesaveurl" style="width:100%;height:100px;">http://' + window.location.host +
                window.location.pathname + '?source=' + options.querystring + '</textarea> \
                </div>';
        }
        thefacetview += '</div>';
        thefacetview += thehelp;
        thefacetview += '<div style="clear:both;" class="btn-toolbar" id="facetview_selectedfilters"></div>';
        options.pager_on_top ? thefacetview += '<div class="facetview_metadata" style="margin-top:20px;"></div>' : "";
        thefacetview += options.searchwrap_start + options.searchwrap_end;
        thefacetview += '<div class="facetview_metadata"></div></div></div></div>';

        var obj = undefined;

        // ===============================================
        // now create the plugin on the page
        return this.each(function() {
            // get this object
            obj = $(this);

            // what to do when ready to go
            var whenready = function() {
                // append the facetview object to this object
                thefacetview = thefacetview.replace(/{{HOW_MANY}}/gi,options.paging.size);
                obj.append(thefacetview);
                !options.embedded_search ? $('.facetview_search_options_container', obj).hide() : "";


                // bind learn more and how many triggers
                $('.facetview_learnmore', obj).bind('click',learnmore);
                $('.facetview_howmany', obj).bind('click',howmany);
                $('.facetview_searchfield', obj).bind('change',searchfield);
                $('.facetview_orderby', obj).bind('change',orderby);
                $('.facetview_order', obj).bind('click',order);
                $('.facetview_sharesave', obj).bind('click',sharesave);

                // check paging info is available
                !options.paging.size && options.paging.size != 0 ? options.paging.size = 10 : "";
                !options.paging.from ? options.paging.from = 0 : "";

                // handle any source options
                if ( options.source ) {
                    parsesource();
                    delete options.source;
                }

                // set any default search values into the search bar and create any required filters
                if ( options.searchbox_class.length == 0 ) {
                    options.q != "" ? $('.facetview_freetext', obj).val(options.q) : "";
                    buildfilters();
                    $('.facetview_freetext', obj).bindWithDelay('keyup',dosearch,options.freetext_submit_delay);
                } else {
                    options.q != "" ? $(options.searchbox_class).last().val(options.q) : "";
                    buildfilters();
                    $(options.searchbox_class).bindWithDelay('keyup',dosearch,options.freetext_submit_delay);
                }

                options.source || options.initialsearch ? dosearch() : "";

            };

            // check for remote config options, then do first search
            if (options.config_file) {
                $.ajax({
                    type: "get",
                    url: options.config_file,
                    dataType: "jsonp",
                    success: function(data) {
                        options = $.extend(options, data);
                        whenready();
                    },
                    error: function() {
                        $.ajax({
                            type: "get",
                            url: options.config_file,
                            success: function(data) {
                                options = $.extend(options, $.parseJSON(data));
                                whenready();
                            },
                            error: function() {
                                whenready();
                            }
                        });
                    }
                });
            } else {
                whenready();
            }

        }); // end of the function


    };


    // facetview options are declared as a function so that they can be retrieved
    // externally (which allows for saving them remotely etc)
    $.fn.facetview.options = {};

})(jQuery);