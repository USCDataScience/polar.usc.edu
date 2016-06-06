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

    $.getJSON( 'data/measurements/units/' + mime + '_units.json', function( measurement_units ) {
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                url: 'data/measurements/measure/' + mime + '.json',
                mimeType: 'json'
            },
            donut: {
                title: mime.toUpperCase()
            },
            axis: {
                x: {
                    type: 'category',
                    categories: measurement_units
                }
            },
            zoom: {
                enabled: true
            }

        });
    });
}
