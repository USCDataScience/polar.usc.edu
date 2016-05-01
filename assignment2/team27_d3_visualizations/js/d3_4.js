 function d34_on_click(){

  document.getElementById('d3').innerHTML = "";

  document.getElementById('description').innerHTML = "MIME types diversity2";


// var width = 960,
//     height = 500,
//     radius = Math.min(width, height) / 2;

// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#8a89a6", "#4b6789", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// var arc = d3.svg.arc()
//     .outerRadius(radius - 10)
//     .innerRadius(radius - 70);

// var pie = d3.layout.pie()
//     .sort(null)
//     .value(function(d) { return d.value; });

// var svg = d3.select("#d3").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// d3.json("stat_json1.json", type, function(error, data) {
//   if (error) throw error;
//   console.log(data)

//   var g = svg.selectAll(".arc")
//       .data(pie(data))
//     .enter().append("g")
//       .attr("class", "arc");

//   g.append("path")
//       .attr("d", arc)
//       .style("fill", function(d) { return color(d.data.label); });

//   g.append("text")
//       .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
//       .attr("dy", ".35em")
//       .text(function(d) { return d.data.label; });
// });

// function type(d) {
//   d.value = +d.value;
//   // alert(d.value)
//   return d;
// }




  var w = 500;
  var h = 500;
  var r = h/2;
  var color = d3.scale.category20c();


  d3.json("stat_json1.json", function(data){
  // data = [{"value":20, "label":"Category A"}, 
  //            {"value":50, "label":"Category B" }, 
  //            {"value":30, "label":"Category C"}];


// data = [{"value": 37586, "label": "other type"}, {"value": 37997, "label": "image/png"}, {"value": 739588, "label": "text/html"}, {"value": 21000, "label": "application/xml"}, {"value": 211687, "label": "application/octet-stream"}, {"value": 137335, "label": "text/plain"}, {"value": 44658, "label": "application/pdf"}, {"value": 40049, "label": "image/gif"}, {"value": 385751, "label": "application/xhtml+xml"}, {"value": 85879, "label": "image/jpeg"}];

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
console.log(arc(d));
return arc(d);
});

// add the text
arcs.append("svg:text").attr("transform", function(d){
  d.innerRadius = 0;
  d.outerRadius = r;
  return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].label;}
    );

})







// var data = [{"label":"Category A", "value":20}, 
//              {"label":"Category B", "value":50}, 
//              {"label":"Category C", "value":30}];

}