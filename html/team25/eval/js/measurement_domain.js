/**
 * Created by manishdwibedy on 4/5/16.
 */


$(function(){



    loadData('pub.usgs.gov');

});

function loadData(mime) {

    $.getJSON( 'data/measurements/domain/' + mime + '_units.json', function( measurement_units ) {
        var chart = c3.generate({
            bindto: '#chart',
            data: {
                url: 'data/measurements/domain/' + mime + '.json',
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
