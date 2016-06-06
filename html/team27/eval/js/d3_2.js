 function d32_on_click(){

  document.getElementById('d3').innerHTML = "";

  document.getElementById('description').innerHTML = "Numbers of the related publications in each year return by Google Scholar API";


  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;

  var formatPercent = d3.format(".0%");

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1, 1);

  var y = d3.scale.linear()
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");
  // .tickFormat(formatPercent);

  var svg = d3.select("#d3").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json("year_paper.json", function(error, data) {

    data.forEach(function(d) {
      d.value = +d.value;
    });

    x.domain(data.map(function(d) { return d.label; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number");

    svg.selectAll(".bar_sort")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar_sort")
    .attr("x", function(d) { return x(d.label); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.value) ; })
    .attr("height", function(d) { return height -  y(d.value) ; });

    d3.select("input").on("change", change);

    var sortTimeout = setTimeout(function() {
      d3.select("input").property("checked", true).each(change);
    }, 2000);

    function change() {
      clearTimeout(sortTimeout);

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
      ? function(a, b) { return b.value - a.value; }
      : function(a, b) { return d3.ascending(a.label, b.label); })
    .map(function(d) { return d.label; }))
    .copy();

    svg.selectAll(".bar_sort")
    .sort(function(a, b) { return x0(a.label) - x0(b.label); });

    var transition = svg.transition().duration(750),
    delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar_sort")
    .delay(delay)
    .attr("x", function(d) { return x0(d.label); });

    transition.select(".x.axis")
    .call(xAxis)
    .selectAll("g")
    .delay(delay);
  }
});


}
