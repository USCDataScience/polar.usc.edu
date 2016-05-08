function refreshHzBarChart(){

    console.log("entered refreshHzBarChart");
    d3.json('../../data/team22-spring-2016-data/content-evaluation/nerAgreementTTR.json', function(error, data) {
    if (error) throw error;

    var chartWidth       = 600,
        barHeight        = 14,
        groupHeight      = barHeight * data.series.length,
        gapBetweenGroups = 25,
        spaceForLabels   = 400,
        spaceForLegend   = 100;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i=0; i<data.labels.length; i++) {
      for (var j=0; j<data.series.length; j++) {
        zippedData.push(data.series[j].value[i]);
      }
    }
  
    var mylabels = [];
    for(var i=0; i<data["series"].length; i++){
        mylabels.push(data["series"][i]["name"]);
    }

    var colorbar = ['#31a354','#dd1c77', '#2c7fb8']

    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(zippedData)])
        .range([0, chartWidth-100]);

    var y = d3.scale.linear()
        .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat('')
        .tickSize(0)
        .orient("left");

    // Specify the chart area and dimensions
    var chart = d3.select("#hzBarChart .panel-body").append("svg")
        .attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .attr("height", chartHeight);

    // Create bars
    var bar = chart.selectAll("g")
        .data(zippedData)
        .enter().append("g")
        .attr("transform", function(d, i) {
          return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
        });

    // Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function(d,i) { return colorbar[i % data.series.length]; })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1);

    // console.log(barHeight - 1);
    bar.append('rect')
        .attr("x", function(d) {
         if(x(d) < 80) return x(d) + 5; else if(x(d) < 300) return x(d) + 5 ; else return x(d) - 65; })
        .attr("y", 1)
        .attr('width', 65)
        .attr('height', barHeight-2)
        .attr('fill', 'white')

    // Add text label in bar
    bar.append("text")
        .attr("x", function(d) { if(x(d)<80) return x(d)+80; else if(x(d) < 160) return x(d)+ i +80; else if(x(d) < 300) return x(d)+ i + 80; else return x(d) + 10;})
        .attr("y", barHeight / 2)
        .attr("fill", function(d,i) { return colorbar[i % data.series.length]; })
        .attr("dy", ".35em")
        .text(function(d, i) { return d + " " + mylabels[i % data.series.length]; });


    // Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function(d) { return - 10; })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .text(function(d,i) {
          if (i % data.series.length === 0)
            return data.labels[Math.floor(i/data.series.length)];
          else
            return ""});

    chart.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
          .call(yAxis);

    // Draw legend
    var legendRectSize = 18,
        legendSpacing  = 4;

    var legend = chart.selectAll('.legend')
        .data(data.series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups/2;
            var horz = spaceForLabels + chartWidth + 10 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return colorbar[i % data.series.length]; })
        .style('stroke', function (d, i) { return colorbar[i % data.series.length]; });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d,i) { return mylabels[i % data.series.length]; });

        });
}
