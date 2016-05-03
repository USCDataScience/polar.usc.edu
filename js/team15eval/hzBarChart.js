function refreshHzBarChart(){

    console.log("entered refreshHzBarChart");
    d3.json('data/ner_comparison.json', function(error, data) {

    if (error) throw error;
    console.log(data.labels);
    
    var chartWidth       = 600,
        barHeight        = 14,
        groupHeight      = barHeight * data.series.length,
        gapBetweenGroups = 25,
        spaceForLabels   = 250,
        spaceForLegend   = 100;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i=0; i<data.labels.length; i++) {
      for (var j=0; j<data.series.length; j++) {
        zippedData.push(data.series[j].value[i]);
      }
    }

    var labelNames = []
    for(var i =0; i<data.series.length;i++)
    {
        labelNames.push(data.series[i].name)
    }

    // Color scale
    // var color = d3.scale.category10();
    var mylabels = labelNames;//["CORENLP","OPENNLP", "NLTK","GROBIDQUANTITIES","AGREED"];
    
    var color = d3.scale.category10()



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
        .attr("fill", function(d,i) { return color(i % data.series.length); })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1);

    console.log(barHeight - 1);
    bar.append('rect')
        .attr("x", function(d) {if(x(d) < 80) return x(d) + 5; else if(x(d) < 300) return x(d); else return x(d) - 65; })
        .attr("y", 1)
        .attr('width', 65)
        .attr('height', barHeight-2)
        .attr('fill', 'white')

    // Add text label in bar
    bar.append("text")
        //.attr("x", function(d) {i=0; while(i!=Math.floor(x(d))){i++}; if(x(d) < 80) return x(d) + 80;else if(x(d) < 160) return x(d)+ i - 50; else if(x(d) < 300) return x(d)+ i; else return x(d) - 3;})
        .attr("x",550)
        //.attr("x", function(d) {i=0; while(i!=Math.floor(x(d))){i++}; if(x(d) < 80) return x(d) + 80;else if(x(d) < 160) return x(d)+ i - 50; else if(x(d) < 300) return x(d)+ i; else return x(d) - 3;})

        .attr("y", barHeight / 2)
        .attr("fill", function(d,i) { return color(i % data.series.length); })
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
            var horz = spaceForLabels + chartWidth + 30 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return color(i); })
        .style('stroke', function (d, i) { return color(i); });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d,i) { return mylabels[i % data.series.length]; });

        });
}
