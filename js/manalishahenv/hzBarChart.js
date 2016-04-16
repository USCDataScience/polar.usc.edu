
function refreshHzBarChart(){
    // var url='http://localhost:8983/solr/collection2/select?q=geotopic_locations%3A*&rows=180&fl=geotopic_locations&wt=json&indent=true';
    // $.getJSON(url);
    on_data();
}


function on_data(){

    d3.json('../../data/manalishahenv/locations.json', function(error, data) {
    if (error) throw error;


       docs = data.response.docs;
        var dict = {};
        var item, location;
        var count = 0, countunique = 0;
        for(var i=0; i<docs.length; i++){
            item = docs[i];
            location = item.geotopic_location;
            if(!dict[location]){
                dict[location] = 1;
            }
            else
                dict[location] = dict[location] + 1;
        }

        var series=[];
        var labels=[];

        content = [];
        for(var x in dict){
            temp = {"labels": x, "value": dict[x]};
            content.push(temp);
        }

        top50 = [];
        top50 = content.sort(function (a, b) {
            return b.value - a.value;
        });

        for(var x in top50){
            labels[x] = top50[x]["labels"];
            series[x] = top50[x]["value"];
            if(x==50)
                break;
        }
        data = {};
        data["labels"]=labels;
        data["series"]=[{"name":"docs", "value":series}];

    var chartWidth       = 800,
        barHeight        = 14,
        groupHeight      = barHeight * data.series.length,
        gapBetweenGroups = 10,
        spaceForLabels   = 300,
        spaceForLegend   = 10;

    // Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i=0; i<data.labels.length; i++) {
      for (var j=0; j<data.series.length; j++) {
        zippedData.push(data.series[j].value[i]);
      }
    }

    var mylabels = [" docs"];
    var colors = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'];
    var color = d3.scale.linear()
             .range(['#2171b5']);

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
    var chart = d3.select("#hzBarChart").append("svg")
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
        .attr("fill", function(d,i) { return '#6baed6'; })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1);

    bar.append('rect')
        .attr("x", function(d) {
        if(x(d) < 80) return x(d) + 5; else if(x(d) < 300) return x(d); else return x(d) - 65; })
        .attr("y", 1)
        .attr('width', 65)
        .attr('height', barHeight-2)
        .attr('fill', 'white')

    // Add text label in bar
    bar.append("text")
        .attr("x", function(d) { i=0; while(i!=Math.floor(x(d))){i++}; console.log(x(d) + " i="+ i); if(x(d)<80) return x(d)+80; else if(x(d) < 160) return x(d)+ i - 50; else if(x(d) < 300) return x(d)+ i; else return x(d) - 3;})
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
        });
}
