/**
 * Created by manishdwibedy on 4/5/16.
 */


$(function(){

    $.getJSON( "data/size/ratio/ratio_units.json", function( data ) {

        loadData(data)

    });



});

function loadData(data) {

    var chart = c3.generate({
        bindto: '#chart',
        data: {
            url: 'data/size/ratio/ratio.json',
            mimeType: 'json'
        },
        axis: {
            x: {
                type: 'category',
                categories: data
            }
        },
        zoom: {
            enabled: true
        }
    });

}
