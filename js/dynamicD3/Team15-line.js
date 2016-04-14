;( function() {
	
	
var promises = [];
  var data = [];
for (year = 1999; year < 2016; year++) {
	promises.push(getData(year));
  }

  
  function getData(year) {
	 var dfd = $.Deferred();
	  var GW_url = "http://polar.usc.edu/solr/temporal/select?q=%22global+warming%22%0A&fq=extracted_dates%3A%5B" + year + "-01-01T00%3A00%3A00Z+TO+" + year + "-12-31T23%3A59%3A59Z%5D&wt=json&json.wrf=?&indent=true";
	  var CC_url = "http://polar.usc.edu/solr/temporal/select?q=%22climate+change%22%0A&fq=extracted_dates%3A%5B" + year + "-01-01T00%3A00%3A00Z+TO+" + year + "-12-31T23%3A59%3A59Z%5D&wt=json&json.wrf=?&indent=true";
	
	var temp = {
		year: 0,
		"GlobalWarming": 0,
		"ClimateChange": 0
	};
	 temp.year = year;
	 $.when(
		$.getJSON(GW_url, function(response) {
			temp["GlobalWarming"] = response['response']['numFound'];
		}),
		$.getJSON(CC_url, function(response) {
			temp["ClimateChange"] = response['response']['numFound'];
		})
	).then(function() {
		data.push(temp);
		dfd.resolve();
	});
	return dfd.promise();
  }	
  
function drawLineChart( data ) {  
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var parseDate = d3.time.format("%Y%m%d").parse;

	var x = d3.scale.linear()
		.range([0, width]);


	var y = d3.scale.linear()
		.range([height, 0]);

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

  x.domain([1999, 2015]);

  y.domain([
    d3.min(data, function(d) {
		return Math.min(d["GlobalWarming"], d["ClimateChange"]);
	}),
    d3.max(data, function(d) { return Math.max(d["GlobalWarming"], d["ClimateChange"]); })
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
      .attr("d", area.y0(function(d) { return y(d["ClimateChange"]); }));

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
	 
}; 
  
  $.when.apply($, promises).then(function() {
	 drawLineChart(  data );
  });


})();