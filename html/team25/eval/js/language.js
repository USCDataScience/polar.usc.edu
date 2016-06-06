/**
 * Created by manishdwibedy on 4/5/16.
 */


$(function(){

    $(".dropdown-menu li a").click(function(){

        $(".btn:first-child").text('Selected MIME : '+$(this).text());
        $(".btn:first-child").val($(this).text());

        var mime = $(this).text();

        loadData(mime);
    });

});

function loadData(mime) {

    var chart = c3.generate({
        bindto: '#chart',
        data: {
            url: 'data/language/' + mime + '.json',
            mimeType: 'json',
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: mime.toUpperCase()
        }
    });

}
