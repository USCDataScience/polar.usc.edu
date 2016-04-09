d3.json("histogram_json_files/22_video_mp4_histogram.json", function(data){
var bardata = [];

for (var i=0; i < 15; i++) {
    bardata.push(Math.random())
}

var colors = d3.scale.linear()
.domain([0, bardata.length*.1, bardata.length*.43, bardata.length])
.range(['#B58929','#C61C6F', '#268BD2', '#85992C'])


var margin = {top: 20, right: 30, bottom: 40, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(data.map(function(d) { return d.name; }))
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    /* .domain([0, d3.max(data, function(d) { return d.value; })]) */
	.domain([0, 100])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add data
chart.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
		.style('fill', function(d,i) {
            return colors(i);
        })
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", x.rangeBand());

// y axis and label
chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", -margin.bottom)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Percentage of Number of Files [0 100]");
// x axis and label
chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Metadata Score - [0 1]");
// chart title
chart.append("text")
  .text("video_mp4 Mimetype Metadata Score Histogram")
  .attr("x", width/2)
  .attr("class","title");
});