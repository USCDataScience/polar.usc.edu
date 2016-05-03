var margin = {top: 1, right: 1, bottom: 6, left: 1},
            width = 1200 - margin.left - margin.right, // was 960
            //height = 1500 - margin.top - margin.bottom; // was 500
            height = 650; 

        var formatNumber = d3.format(",.0f"),
            format = function(d) { return formatNumber(d); },
            color = d3.scale.category20();

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var sankey = d3.sankey()
            .nodeWidth(15) // was 15
            .nodePadding(10) // was 10
            .size([width, height]);

        var path = sankey.link();

        d3.json("data/nerdata.json", function(energy) {  

          sankey
              .nodes(energy.nodes)
              .links(energy.links)
              .layout(32); // what is this? iterations

          var link = svg.append("g").selectAll(".link")
              .data(energy.links)
            .enter().append("path")
              .attr("class", "link")
              .attr("d", path)
              .style("stroke-width", function(d) { return Math.max(1, d.dy); })
              .style("stroke", function(d) { return d.source.color = color(d.source.name.replace(/ .*/, "")); })
              .sort(function(a, b) { return b.dy - a.dy; });

          link.append("title")
              .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });
              // title is an SVG standard way of providing tooltips, up to the browser how to render this, so changing the style is tricky
            
          var node = svg.append("g").selectAll(".node")
              .data(energy.nodes)
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")"; 
              })
              .call(d3.behavior.drag()
              .origin(function(d) { return d; })
              .on("dragstart", function() { this.parentNode.appendChild(this); })
              .on("drag", dragmove));

          node.append("rect")
              .attr("height", sankey.nodeWidth())
              .attr("width", function(d) { return d.dy; })
              .style("fill", function(d) { return d.color = color(d.name.replace(/ .*/, "")); })
              .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
            .append("title")
              .text(function(d) { return d.name + "\n" + format(d.value); });
            
          node.append("text")
              .attr("text-anchor", "middle")
              .attr("x", function (d) { return d.dy / 2 })
              .attr("y", sankey.nodeWidth() / 2)
              .attr("dy", ".35em")
              .text(function(d) { return d.name; })
              .filter(function(d) { return d.x < width / 2; });
                        
          function dragmove(d) {
            //d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
            d3.select(this).attr("transform", "translate(" + (d.x = Math.max(0, Math.min(width - d.dy, d3.event.x))) + "," + d.y + ")");
            sankey.relayout();
            link.attr("d", path);
          }
        });