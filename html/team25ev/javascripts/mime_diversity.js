/**
 * Created by manishdwibedy on 4/5/16.
 */


$(function(){
    loadData();
});

function loadData() {

    var chart = c3.generate({
        bindto: '#chart',
        data: {
            url: 'data/mime_diversity.json',
            mimeType: 'json',
            type : 'donut',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "MIME diversity"
        }
    });

}
