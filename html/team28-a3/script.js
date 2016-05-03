(function () {
    var menuItems = [
        { id: 'home', label: 'Home' },
        { id: 'measurement', label: 'Measurement'},
        { id: 'language', label: 'Language'},
        { id: 'filediversity', label: 'File Diversity'},
        { id: 'parsers', label: 'Parser call chains' },
        { id: 'topics', label: 'Topics'},
        { id: 'neranalysis', label:'NER Analysis'},
    ];

    function renderMenu(items) {
        var elems = _.map(items, function (d) {
            return $('<li data-menu-id="' + d.id + '"><a href="#/' + d.id + '">' + d.label + '</a></li>')[0];
        })
        $('#navSidebar').html(elems);
    }

    function getCurrentPage() {
        var page = _.find(menuItems, { id: window.location.hash.substr(2) });
        return page || menuItems[0];
    }

    var loadCounter = 0;
    function loadContent() {
        var currentPage = getCurrentPage();

        $('#navSidebar li').removeClass('active');
        $('#navSidebar li[data-menu-id="' + currentPage.id + '"]').addClass('active');

        var c = ++loadCounter;
        $('#loading').show();
        $('#contentContainer').empty();

        $.ajax({
            url: 'vis/' + currentPage.id + '.html',
            type: 'GET',
            dataType: 'html',
        }).done(function(responseText) {
            if (c !== loadCounter) { return; }
            $('#contentContainer').html(responseText);
        }).always(function () {
            if (c !== loadCounter) { return; }
            $('#loading').hide();
        });

    }

    function bindEvents() {
        window.onhashchange = loadContent;
    }

    function init() {
        renderMenu(menuItems);
        bindEvents();
        loadContent();
    }

    $(document).ready(init);
}());
