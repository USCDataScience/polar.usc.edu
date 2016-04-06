var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.scale.linear()
    .range([0, width]);


var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d["GlobalWarming"]); });

var area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y1(function(d) { return y(d["GlobalWarming"]); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("../../data/team15-line-data.tsv", function(error, data) {
  data.forEach(function(d) {
    d.year = d.year;
    d["GlobalWarming"]= +d["GlobalWarming"];
    d["CimateChange"] = +d["CimateChange"];
  });

  x.domain([1999, 2015]);

  y.domain([
    d3.min(data, function(d) { return Math.min(d["GlobalWarming"], d["CimateChange"]); }),
    d3.max(data, function(d) { return Math.max(d["GlobalWarming"], d["CimateChange"]); })
  ]);

  svg.datum(data);

  svg.append("clipPath")
      .attr("id", "clip-below")
    .append("path")
      .attr("d", area.y0(height));

  svg.append("clipPath")
      .attr("id", "clip-above")
    .append("path")
      .attr("d", area.y0(0));

  svg.append("path")
      .attr("class", "area above")
      .attr("clip-path", "url(#clip-above)")
      .attr("d", area.y0(function(d) { return y(d["CimateChange"]); }));

  svg.append("path")
      .attr("class", "area below")
      .attr("clip-path", "url(#clip-below)")
      .attr("d", area);

  svg.append("path")
      .attr("class", "line")
      .attr("d", line);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
	  .append("text")
	  .attr("x", 6)
      .attr("dx", ".71em")
      .style("text-anchor", "start")
	  .text("Year");
      
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of mentions");
});