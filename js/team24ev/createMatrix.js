var points = 256;
var maxValue = 32;

window.onload = function() {
    var selection = $("#matrix_select")
    for (key in json) {
        selection.append($("<option>").val(key).html(key))
    }
    selection.on('change', function(e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        $("svg").html('')
        create_mime_matrix(valueSelected);
    });
    create_mime_matrix(selection.val())
}

var create_mime_matrix = function(mime) {
    var mime_json = {}
    mime_json.nodes = [];
    mime_json.links = json[mime];
    for (var i = 0; i < points; i++) {
        mime_json.nodes[i] = {};
    };
    createAdjacencyMatrix(mime_json);
    d3.select("svg")
        .style("width", (points * 10 + 80) + "px")
        .style("height", (points * 10 + 80) + "px")
        .style("border", "1px solid gray");
}



function createAdjacencyMatrix(data) {

    var adjacencyMatrix = layout_adjacencyMatrix()
        .size([points * 10, points * 10])
        .nodes(data.nodes)
        .links(data.links)
        .directed(true)   // no mirror 
        .absolute(false)  // leave negative values as is 
        .nodeID(function(d) {
            return d.si;
        });

    var matrixData = adjacencyMatrix();

    //console.log(matrixData)

    var someColors = d3.scale.category20c();
    var tempColor;
    var tooltip = d3.select('body').append('div')
        .style('position', 'absolute')
        .style('padding', '0 10px')
        .style('background', 'white')
        .style('opacity', 0)

    var getColorForValue = function(val) {
        //return someColors(val);
        absval = Math.abs(val);
        var r = Math.floor((255 * absval) / maxValue),
            g = val<0 ? 100 : Math.floor((255 * (maxValue - absval)) / maxValue),
            b = val<0 ? Math.floor((255 * (maxValue - absval)) / maxValue) : 100
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    d3.select("svg")
        .append("g")
        .attr("transform", "translate(50,50)")
        .attr("id", "adjacencyG")
        .selectAll("rect")
        .data(matrixData)
        .enter()
        .append("rect")
        .attr("width", function(d) {
            return d.w
        })
        .attr("height", function(d) {
            return d.h
        })
        .attr("x", function(d) {
            return d.x
        })
        .attr("y", function(d) {
            return d.y
        })
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("stroke-opacity", .1)
        .style("fill", function(d) {
            return getColorForValue(d.v)
        })
        .style("fill-opacity", function(d) {
            return Math.abs(d.v) * .7
        })

    .on('mouseover', function(d) {
        // We need negative values too.
        if (d.v == 0) {
            tooltip.style('display', 'none');
            return;
        }

        tooltip.transition()
            .style('opacity', .9)

        tooltip.html(d.v)
            .style('left', (d3.event.pageX - 35) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px')

        tempColor = this.style.fill;
        d3.select(this)
            .style('opacity', .5)
            .style('fill', 'yellow')
        tooltip.style('display', 'block');
    })
        .on('mouseout', function(d) {

            d3.select(this)
                .style('opacity', 1)
                .style('fill', tempColor)
        });

    d3.select("#adjacencyG")
        .call(adjacencyMatrix.xAxis);

    d3.select("#adjacencyG")
        .call(adjacencyMatrix.yAxis);

}

//Adjacency Matrix

(function() {
    layout_adjacencyMatrix = function() {
        var directed = false,
            absolute = false,
            size = [1, 1],
            nodes = [],
            edges = [],
            //edgeWeight = function (d) {return 1},
            nodeID = function(d) {
                return d.id
            };

        function matrix() {
            var width = size[0],
                height = size[1],
                nodeWidth = width / nodes.length,
                nodeHeight = height / nodes.length,
                //constructedMatrix = [],
                matrix = [],
                edgeHash = {},
                xScale = d3.scale.linear().domain([0, nodes.length]).range([0, width]),
                yScale = d3.scale.linear().domain([0, nodes.length]).range([0, height]);

            nodes.forEach(function(node, i) {
                node.si = i;
            })

            edges.forEach(function(edge) {
                var constructedEdge = {
                    s: edge.s,
                    t: edge.t,
                    v: absolute ? Math.abs(edge.v) : edge.v
                };
                if (typeof edge.s == "number") {
                    constructedEdge.s = nodes[edge.s];
                }
                if (typeof edge.t == "number") {
                    constructedEdge.t = nodes[edge.t];
                }
                var id = nodeID(constructedEdge.s) + "-" + nodeID(constructedEdge.t);

                if (directed === false && constructedEdge.s.si < constructedEdge.t.si) {
                    id = nodeID(constructedEdge.t) + "-" + nodeID(constructedEdge.s);
                }
                if (!edgeHash[id]) {
                    edgeHash[id] = constructedEdge;
                }
                // else {
                //   edgeHash[id].weight = edgeHash[id].weight + constructedEdge.weight;
                // }
            });

            //      console.log("nodes", nodes, nodes.length)

            nodes.forEach(function(sourceNode, a) {
                nodes.forEach(function(targetNode, b) {
                    var id = nodeID(sourceNode) + "-" + nodeID(targetNode);
                    var grid = {
                        // id: id,
                        // s: sourceNode,
                        // t: targetNode,
                        x: xScale(b),
                        y: yScale(a),
                        // weight: 0, 
                        h: nodeHeight,
                        w: nodeWidth,
                        v: 0
                    };

                    //var edgeWeight = 0;
                    var edgeValue = 0;
                    if (edgeHash[id]) {
                        // edgeWeight = edgeHash[grid.id].weight;
                        // grid.weight = edgeWeight;
                        edgeValue = edgeHash[id].v;
                        grid.v = edgeValue;
                    };

                    if (directed === true || b < a) {
                        matrix.push(grid);

                        if (directed === false) {
                            var mirrorGrid = {
                                // id: nodeID(sourceNode) + "-" + nodeID(targetNode),
                                // s: sourceNode,
                                // t: targetNode,
                                x: xScale(a),
                                y: yScale(b),
                                // weight: 0, 
                                h: nodeHeight,
                                w: nodeWidth,
                                v: edgeValue
                            };
                            // mirrorGrid.weight = edgeWeight;
                            matrix.push(mirrorGrid);
                        }
                    }
                });
            });

            //      console.log("matrix", matrix, matrix.length)

            return matrix;
        }

        matrix.directed = function(x) {
            if (!arguments.length) return directed;
            directed = x;
            return matrix;
        }

        matrix.absolute = function(x) {
            if (!arguments.length) return absolute;
            absolute = x;
            return matrix;
        }

        matrix.size = function(x) {
            if (!arguments.length) return size;
            size = x;
            return matrix;
        }

        matrix.nodes = function(x) {
            if (!arguments.length) return nodes;
            nodes = x;
            return matrix;
        }

        matrix.links = function(x) {
            if (!arguments.length) return edges;
            edges = x;
            return matrix;
        }

        // matrix.edgeWeight = function(x) {
        //     if (!arguments.length) return edgeWeight;
        //     if (typeof x === "function") {
        //         edgeWeight = x;
        //     } else {
        //         edgeWeight = function() {
        //             return x
        //         };
        //     }
        //     return matrix;
        // }

        matrix.nodeID = function(x) {
            if (!arguments.length) return nodeID;
            if (typeof x === "function") {
                nodeID = x;
            }
            return matrix;
        }

        matrix.xAxis = function(calledG) {
            var nameScale = d3.scale.ordinal()
                .domain(nodes.map(nodeID))
                .rangePoints([0, size[0]], 1);

            var xAxis = d3.svg.axis().scale(nameScale)
                .orient("top")
                .tickSize(4);

            calledG
                .append("g")
                .attr("class", "am-xAxis am-axis")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "translate(-10,-10) rotate(90)");

        }

        matrix.yAxis = function(calledG) {
            var nameScale = d3.scale.ordinal()
                .domain(nodes.map(nodeID))
                .rangePoints([0, size[1]], 1);

            yAxis = d3.svg.axis().scale(nameScale)
                .orient("left")
                .tickSize(4);

            calledG.append("g")
                .attr("class", "am-yAxis am-axis")
                .call(yAxis);
        }

        return matrix;
    }

})();
