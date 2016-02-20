var continent = null,
    min_year = 1990,
    max_year = 2015 
    ff = d3.format('.2f,'),
    fd = d3.format('d'),
    gdp = 'NY.GDP.PCAP.CD',
    inet = 'IT.NET.USER.P2',
    pop = 'SP.POP.TOTL';

// Various accessors that specify the four dimensions of data to visualize.
function x(d) { return d[gdp] }
function y(d) { return d[inet] }
function radius(d) { return d[pop] }
function color(d) { return d.region }
function key(d) { return d.name }

// functions to return maximum for given country and data key
function getYearVal(d) { return d[1]; }
function getCountryMax(country_values, data_key, curr_max) {
    var new_max = d3.max(country_values[data_key].map(getYearVal));
    if (new_max > curr_max) {
        curr_max = new_max;
    }
    return curr_max;
}

// Load the data.
var xlabels = ["","Antartic","Sub-Antartic","SouthOcean","Arctic","Sub-Arctic","ArcticOcean","",""];
var ylabels = ["","climate change", "ozone depletion", "ice extent", "ice melting", "sea level", "greenhouse effect", "ocean temperature","","","","",""];
// var queryarray = ["global warming", "Ice Melting"];
var queryarray = ["climate change", "ozone depletion", "ice extent", "ice melt*", "sea level", "greenhouse effect", "ocean temperature"];
var nations = [];
var done = 0;
for(var index=0; index<queryarray.length; index++){
	$.getJSON("http://ec2-54-149-243-158.us-west-2.compute.amazonaws.com:9000/solr/polardatatest/select?q=content%3A"+queryarray[index]+"+AND+bbox__minX%3A*&sort=linkAnalysis+desc&wt=climatejson&indent=true&rows=500", function(data){
		nations = nations.concat(data);
		done = done+1;
		if(done == queryarray.length){

    var max_pop = 0, max_gdp = 0;
    for (idx in nations) {
        n = nations[idx];
        max_pop = getCountryMax(n, pop, max_pop);
        max_gdp = getCountryMax(n, gdp, max_gdp);
    }

    function position(dot) {
        dot.filter(function(d){
            if (x(d) && y(d) > 0 && radius(d) && (!continent || continent == d.region)) {
                return d
            }
        })
        .attr('cx', function(d) { return xScale(x(d)) })
        .attr('cy', function(d) { return yScale(y(d)) })
        .attr('r', function(d) { return radiusScale(radius(d)) });
    }

  // Defines a sort order so that the smallest dots are drawn on top.
  function order(a, b) {
    return radius(b) - radius(a);
  }

  // After the transition finishes, you can mouseover to change the year.
  function enableInteraction() {
    var yearScale = d3.scale.linear()
        .domain([min_year, max_year])
        .range([box.x + 10, box.x + box.width - 10])
        .clamp(true);

    // Cancel the current transition, if any.
    svg.transition().duration(0);

    overlay
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', mousemove)
        .on('touchmove', mousemove);

    function mouseover() {
      label.classed('active', true);
    }

    function mouseout() {
      label.classed('active', false);
    }

    function mousemove() {
      displayYear(yearScale.invert(d3.mouse(this)[0]));
    }
  }

  // Tweens the entire chart by first tweening the year, and then the data.
  // For the interpolated data, the dots and label are redrawn.
  function tweenYear() {
    var year = d3.interpolateNumber(min_year, max_year);
    return function(t) { displayYear(year(t)); };
  }

  // Updates the display to show the specified year.
  function displayYear(year) {
    dot.data(interpolateData(Math.round(year)), key)
        .call(position)
        .sort(order);
    label.text(Math.round(year));
  }


  // Finds (and possibly interpolates) the value for the specified year.
  function interpolateValues(values, year) {
    for (i in values) {
      if (year == values[i][0] && null != values[i][1]) {
        return values[i][1]
      }
    }
    return null
  }
  function interpolateData(year) {
    return nations.map(function(d) {
      return {
        name: d.name,
        region: d.region,
            'NY.GDP.PCAP.CD': interpolateValues(d[gdp], year),
            'IT.NET.USER.P2': interpolateValues(d[inet], year),
            'SP.POP.TOTL': interpolateValues(d[pop], year)
      };
    });
  }
    // Chart dimensions.
    var margin = {top: 5, right: 5, bottom: 25, left: 105},
        width = 800; 
        height = 300;

    // Various scales. These domains make assumptions of data, naturally.
    var xScale = d3.scale.linear().domain([0, 7]).range([0, width]),
        yScale = d3.scale.linear().domain([0, 8]).range([height, 0]),
        radiusScale = d3.scale.sqrt().domain([0, max_pop]).range([0, 40]),
        colorScale = d3.scale.category10();

    // The x & y axes.
    var xAxis = d3.svg.axis().orient('bottom').scale(xScale).ticks(10).tickFormat(function(d){return xlabels[d]}),
        yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(10).tickFormat(function(d){return ylabels[d]});

    // Create the SVG container and set the origin.
    var svg = d3.select('#vis').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Add the x-axis.
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    // Add the y-axis.
    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Add an x-axis label.
    svg.append('text')
        .attr('class', 'x label')
        .attr('text-anchor', 'end')
        .attr('x', width)
        .attr('y', height - 6)
        .text('Index code for Region of Interest');

    // Add a y-axis label.
    svg.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('y', 6)
        .attr('dy', '.75em')
        .attr('transform', 'rotate(-90)')
        .text('Index code for Query Type');

    // Add the year label; the value is set on transition.
    var label = svg.append('text')
        .attr('class', 'year label')
        .attr('text-anchor', 'end')
        .attr('y', height - 24)
        .attr('x', width)
        .text(min_year);

    // clipPath to hide part of circles outside of chart area
    svg.append('clipPath')
        .attr('id', 'chart-area')
    .append('rect')
        .attr('class', 'fillblue')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height);

    // A bisector since many nation's data is sparsely-defined.
    var bisect = d3.bisector(function(d) { return d[0]; });

    // Add a dot per nation. Initialize the data at   , and set the colors.
    var dot = svg.append('g')
        .attr('class', 'dots')
        .attr('clip-path', 'url(#chart-area)')
    .selectAll('.dot')
        .data(interpolateData(min_year))
    .enter().append('circle')
        .attr('class', 'dot')
        .style('fill', function(d) { return colorScale(color(d)); })
        .call(position)
        .sort(order);

    // Add a title.
    dot.append('title')
        .text(function(d) { return d.name });

    // Add an overlay for the year label.
    var box = label.node().getBBox();

    var overlay = svg.append('rect')
        .attr('class', 'overlay')
        .attr('x', box.x)
        .attr('y', box.y)
        .attr('width', box.width)
        .attr('height', box.height)
        .on('mouseover', enableInteraction);

    // Start a transition that interpolates the data based on year.
    svg.transition()
      .duration(5000)
      .ease('linear')
      .tween('year', tweenYear)
      .each('end', enableInteraction);

    // Positions the dots based on data.

		}
	});
}
