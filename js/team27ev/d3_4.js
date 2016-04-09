 function d34_on_click(){

  document.getElementById('d3').innerHTML = "";

  document.getElementById('description').innerHTML = "MIME types diversity2";

  var w = 500;
  var h = 500;
  var r = h/2;
  var color = d3.scale.category20c();


  d3.json("../../data/team27ev/stat_json1.json", function(data){

var vis = d3.select('#d3').append("svg:svg").data([data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
var pie = d3.layout.pie().value(function(d){return d.value;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
arcs.append("svg:path")
.attr("fill", function(d, i){
  return color(i);
})
.attr("d", function (d) {
        // log the result of the arc generator to show how cool it is :)
return arc(d);
});

// add the text
arcs.append("svg:text").attr("transform", function(d){
  d.innerRadius = 0;
  d.outerRadius = r;
  return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].label;}
    );

});


}