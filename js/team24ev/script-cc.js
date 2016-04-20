var points = 256;
var maxValue = 32;

window.onload = function(){
		json.nodes= [];
		for (var i = 0; i < points; i++) {
				json.nodes[i] = {};
		};
		createAdjacencyMatrix(json);
		d3.select("svg")
				.style("width",(points*10+80)+"px")
				.style("height",(points*10+80)+"px")
				.style("border","1px solid gray");
}



function createAdjacencyMatrix(data) {

		var adjacencyMatrix = layout_adjacencyMatrix()
				.size([points*10,points*10])
				.nodes(data.nodes)
				.links(data.links)
				.directed(false)
				.nodeID(function (d) {return d.sortedIndex;});

		var matrixData = adjacencyMatrix();

		//console.log(matrixData)

		//var someColors = d3.scale.category20c();
		var someColors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
		var tempColor;
		var tooltip= d3.select('body').append('div')
				.style('position','absolute')
				.style('padding','0 10px')
				.style('background', 'white')
				.style('opacity',0)

				var getColorForValue = function(val){
						 var colorScale = d3.scale.quantile()
						 .domain([0, buckets - 1, d3.max(data,val)])
						 .range(someColors);
						 return colorScale

						var r = Math.floor((255 * val) / maxValue),
							g = Math.floor((255 * (maxValue - val)) / maxValue),
							b = 100;
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
				.attr("width", function (d) {return d.width})
				.attr("height", function (d) {return d.height})
				.attr("x", function (d) {return d.x})
				.attr("y", function (d) {return d.y})
				.style("stroke", "black")
				.style("stroke-width", "1px")
				.style("stroke-opacity", .1)
				.style("fill", function (d) {return getColorForValue(d.value)})
				.style("fill-opacity", function (d) {return d.value * .8})

				.on('mouseover', function(d) {
								if(d.value <=0) {tooltip.style('display','none'); return;}

								tooltip.transition()
								.style('opacity',.9)

								tooltip.html(d.value)
								.style('left', (d3.event.pageX -35) + 'px')
								.style('top', (d3.event.pageY - 30) + 'px')

								tempColor = this.style.fill;
								d3.select(this)
								.style('opacity',.5)
								.style('fill','yellow')
								tooltip.style('display','block'); 
								})
		.on('mouseout', function(d) {

						d3.select(this)
						.style('opacity',1)
						.style('fill',tempColor)
						});

		d3.select("#adjacencyG")
				.call(adjacencyMatrix.xAxis);

		d3.select("#adjacencyG")
				.call(adjacencyMatrix.yAxis);

}

//Adjacency Matrix

(function() {
 layout_adjacencyMatrix = function() {
 var directed = true,
 size = [1,1],
 nodes = [],
 edges = [],
 //edgeWeight = function (d) {return 1},
 nodeID = function (d) {return d.id};

 function matrix() {
 var width = size[0],
 height = size[1],
 nodeWidth = width / nodes.length,
 nodeHeight = height / nodes.length,
 constructedMatrix = [],
 matrix = [],
 edgeHash = {},
 xScale = d3.scale.linear().domain([0,nodes.length]).range([0,width]),
 yScale = d3.scale.linear().domain([0,nodes.length]).range([0,height]);

 nodes.forEach(function(node, i) {
		 node.sortedIndex = i;
		 })

 edges.forEach(function(edge) {
				 var constructedEdge = {source: edge.source, target: edge.target, 
				 // weight: edgeWeight(edge), 
				 value: edge.value};
				 if (typeof edge.source == "number") {
				 constructedEdge.source = nodes[edge.source];
				 }
				 if (typeof edge.target == "number") {
				 constructedEdge.target = nodes[edge.target];
				 }
				 var id = nodeID(constructedEdge.source) + "-" + nodeID(constructedEdge.target);

				 if (directed === false && constructedEdge.source.sortedIndex < constructedEdge.target.sortedIndex) {
				 id = nodeID(constructedEdge.target) + "-" + nodeID(constructedEdge.source);
				 }
				 if (!edgeHash[id]) {
				 edgeHash[id] = constructedEdge;
				 }
				 // else {
				 //   edgeHash[id].weight = edgeHash[id].weight + constructedEdge.weight;
				 // }
 });

 //      console.log("nodes", nodes, nodes.length)

 nodes.forEach(function (sourceNode, a) {
				 nodes.forEach(function (targetNode, b) {
						 var grid = {id: nodeID(sourceNode) + "-" + nodeID(targetNode), source: sourceNode, target: targetNode, x: xScale(b), y: yScale(a),
						 // weight: 0, 
						 height: nodeHeight, width: nodeWidth, value:0};
						 var edgeWeight = 0;
						 var edgeValue = 0;
						 if (edgeHash[grid.id]) {
						 // edgeWeight = edgeHash[grid.id].weight;
						 // grid.weight = edgeWeight;
						 edgeValue = edgeHash[grid.id].value;
						 grid.value = edgeValue;
						 };
						 if (directed === true || b < a) {
						 matrix.push(grid);
						 if (directed === false) {
						 var mirrorGrid = {id: nodeID(sourceNode) + "-" + nodeID(targetNode), source: sourceNode, target: targetNode, x: xScale(a), y: yScale(b),
						 // weight: 0, 
						 height: nodeHeight, width: nodeWidth, value:0};
						 // mirrorGrid.weight = edgeWeight;
						 mirrorGrid.value = edgeValue;
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

 matrix.edgeWeight = function(x) {
		 if (!arguments.length) return edgeWeight;
		 if (typeof x === "function") {
				 edgeWeight = x;
		 }
		 else {
				 edgeWeight = function () {return x};
		 }
		 return matrix;
 }

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
				 .rangePoints([0,size[0]],1);

		 var xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);

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
				 .rangePoints([0,size[1]],1);

		 yAxis = d3.svg.axis().scale(nameScale)
				 .orient("left")
				 .tickSize(4);

		 calledG.append("g")
				 .attr("class", "am-yAxis am-axis")
				 .call(yAxis);
 }

 return matrix;
 }

})();var points = 256;
var maxValue = 32;

window.onload = function(){
		json.nodes= [];
		for (var i = 0; i < points; i++) {
				json.nodes[i] = {};
		};
		createAdjacencyMatrix(json);
		d3.select("svg")
				.style("width",(points*10+80)+"px")
				.style("height",(points*10+80)+"px")
				.style("border","1px solid gray");
}



function createAdjacencyMatrix(data) {

		var adjacencyMatrix = layout_adjacencyMatrix()
				.size([points*10,points*10])
				.nodes(data.nodes)
				.links(data.links)
				.directed(false)
				.nodeID(function (d) {return d.sortedIndex;});

		var matrixData = adjacencyMatrix();

		//console.log(matrixData)

		//var someColors = d3.scale.category20c();
		var someColors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
		var tempColor;
		var tooltip= d3.select('body').append('div')
				.style('position','absolute')
				.style('padding','0 10px')
				.style('background', 'white')
				.style('opacity',0)

				var getColorForValue = function(val){
						 var colorScale = d3.scale.linear()
						 .domain([0, buckets - 1, d3.max(data,val)])
						 .range(someColors);
						 return colorScale

						var r = Math.floor((255 * val) / maxValue),
							g = Math.floor((255 * (maxValue - val)) / maxValue),
							b = 100;
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
				.attr("width", function (d) {return d.width})
				.attr("height", function (d) {return d.height})
				.attr("x", function (d) {return d.x})
				.attr("y", function (d) {return d.y})
				.style("stroke", "black")
				.style("stroke-width", "1px")
				.style("stroke-opacity", .1)
				.style("fill", function (d) {return getColorForValue(d.value)})
				.style("fill-opacity", function (d) {return d.value * .8})

				.on('mouseover', function(d) {
								if(d.value <=0) {tooltip.style('display','none'); return;}

								tooltip.transition()
								.style('opacity',.9)

								tooltip.html(d.value)
								.style('left', (d3.event.pageX -35) + 'px')
								.style('top', (d3.event.pageY - 30) + 'px')

								tempColor = this.style.fill;
								d3.select(this)
								.style('opacity',.5)
								.style('fill','yellow')
								tooltip.style('display','block'); 
								})
		.on('mouseout', function(d) {

						d3.select(this)
						.style('opacity',1)
						.style('fill',tempColor)
						});

		d3.select("#adjacencyG")
				.call(adjacencyMatrix.xAxis);

		d3.select("#adjacencyG")
				.call(adjacencyMatrix.yAxis);

}

//Adjacency Matrix

(function() {
 layout_adjacencyMatrix = function() {
 var directed = true,
 size = [1,1],
 nodes = [],
 edges = [],
 //edgeWeight = function (d) {return 1},
 nodeID = function (d) {return d.id};

 function matrix() {
 var width = size[0],
 height = size[1],
 nodeWidth = width / nodes.length,
 nodeHeight = height / nodes.length,
 constructedMatrix = [],
 matrix = [],
 edgeHash = {},
 xScale = d3.scale.linear().domain([0,nodes.length]).range([0,width]),
 yScale = d3.scale.linear().domain([0,nodes.length]).range([0,height]);

 nodes.forEach(function(node, i) {
		 node.sortedIndex = i;
		 })

 edges.forEach(function(edge) {
				 var constructedEdge = {source: edge.source, target: edge.target, 
				 // weight: edgeWeight(edge), 
				 value: edge.value};
				 if (typeof edge.source == "number") {
				 constructedEdge.source = nodes[edge.source];
				 }
				 if (typeof edge.target == "number") {
				 constructedEdge.target = nodes[edge.target];
				 }
				 var id = nodeID(constructedEdge.source) + "-" + nodeID(constructedEdge.target);

				 if (directed === false && constructedEdge.source.sortedIndex < constructedEdge.target.sortedIndex) {
				 id = nodeID(constructedEdge.target) + "-" + nodeID(constructedEdge.source);
				 }
				 if (!edgeHash[id]) {
				 edgeHash[id] = constructedEdge;
				 }
				 // else {
				 //   edgeHash[id].weight = edgeHash[id].weight + constructedEdge.weight;
				 // }
 });

 //      console.log("nodes", nodes, nodes.length)

 nodes.forEach(function (sourceNode, a) {
				 nodes.forEach(function (targetNode, b) {
						 var grid = {id: nodeID(sourceNode) + "-" + nodeID(targetNode), source: sourceNode, target: targetNode, x: xScale(b), y: yScale(a),
						 // weight: 0, 
						 height: nodeHeight, width: nodeWidth, value:0};
						 var edgeWeight = 0;
						 var edgeValue = 0;
						 if (edgeHash[grid.id]) {
						 // edgeWeight = edgeHash[grid.id].weight;
						 // grid.weight = edgeWeight;
						 edgeValue = edgeHash[grid.id].value;
						 grid.value = edgeValue;
						 };
						 if (directed === true || b < a) {
						 matrix.push(grid);
						 if (directed === false) {
						 var mirrorGrid = {id: nodeID(sourceNode) + "-" + nodeID(targetNode), source: sourceNode, target: targetNode, x: xScale(a), y: yScale(b),
						 // weight: 0, 
						 height: nodeHeight, width: nodeWidth, value:0};
						 // mirrorGrid.weight = edgeWeight;
						 mirrorGrid.value = edgeValue;
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

 matrix.edgeWeight = function(x) {
		 if (!arguments.length) return edgeWeight;
		 if (typeof x === "function") {
				 edgeWeight = x;
		 }
		 else {
				 edgeWeight = function () {return x};
		 }
		 return matrix;
 }

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
				 .rangePoints([0,size[0]],1);

		 var xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);

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
				 .rangePoints([0,size[1]],1);

		 yAxis = d3.svg.axis().scale(nameScale)
				 .orient("left")
				 .tickSize(4);

		 calledG.append("g")
				 .attr("class", "am-yAxis am-axis")
				 .call(yAxis);
 }

 return matrix;
 }

})();var points = 256;
var maxValue = 32;

window.onload = function(){
		json.nodes= [];
		for (var i = 0; i < points; i++) {
				json.nodes[i] = {};
		};
		createAdjacencyMatrix(json);
		d3.select("svg")
				.style("width",(points*10+80)+"px")
				.style("height",(points*10+80)+"px")
				.style("border","1px solid gray");
}



function createAdjacencyMatrix(data) {

		var adjacencyMatrix = layout_adjacencyMatrix()
				.size([points*10,points*10])
				.nodes(data.nodes)
				.links(data.links)
				.directed(false)
				.nodeID(function (d) {return d.sortedIndex;});

		var matrixData = adjacencyMatrix();

		//console.log(matrixData)

		//var someColors = d3.scale.category20c();
		var someColors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]
		var tempColor;
		var tooltip= d3.select('body').append('div')
				.style('position','absolute')
				.style('padding','0 10px')
				.style('background', 'white')
				.style('opacity',0)

				var getColorForValue = function(val){
						 var colorScale = d3.scale.linear()
						 .domain([0, buckets - 1, d3.max(data,val)])
						 .range(someColors);
						 return colorScale

						var r = Math.floor((255 * val) / maxValue),
							g = Math.floor((255 * (maxValue - val)) / maxValue),
							b = 100;
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
				.attr("width", function (d) {return d.width})
				.attr("height", function (d) {return d.height})
				.attr("x", function (d) {return d.x})
				.attr("y", function (d) {return d.y})
				.style("stroke", "black")
				.style("stroke-width", "1px")
				.style("stroke-opacity", .1)
				.style("fill", function (d) {return getColorForValue(d.value)})
				.style("fill-opacity", function (d) {return d.value * .8})

				.on('mouseover', function(d) {
								if(d.value <=0) {tooltip.style('display','none'); return;}

								tooltip.transition()
								.style('opacity',.9)

								tooltip.html(d.value)
								.style('left', (d3.event.pageX -35) + 'px')
								.style('top', (d3.event.pageY - 30) + 'px')

								tempColor = this.style.fill;
								d3.select(this)
								.style('opacity',.5)
								.style('fill','yellow')
								tooltip.style('display','block'); 
								})
		.on('mouseout', function(d) {

						d3.select(this)
						.style('opacity',1)
						.style('fill',tempColor)
						});

		d3.select("#adjacencyG")
				.call(adjacencyMatrix.xAxis);

		d3.select("#adjacencyG")
				.call(adjacencyMatrix.yAxis);

}

//Adjacency Matrix

(function() {
 layout_adjacencyMatrix = function() {
 var directed = true,
 size = [1,1],
 nodes = [],
 edges = [],
 //edgeWeight = function (d) {return 1},
 nodeID = function (d) {return d.id};

 function matrix() {
 var width = size[0],
 height = size[1],
 nodeWidth = width / nodes.length,
 nodeHeight = height / nodes.length,
 constructedMatrix = [],
 matrix = [],
 edgeHash = {},
 xScale = d3.scale.linear().domain([0,nodes.length]).range([0,width]),
 yScale = d3.scale.linear().domain([0,nodes.length]).range([0,height]);

 nodes.forEach(function(node, i) {
		 node.sortedIndex = i;
		 })

 edges.forEach(function(edge) {
				 var constructedEdge = {source: edge.source, target: edge.target, 
				 // weight: edgeWeight(edge), 
				 value: edge.value};
				 if (typeof edge.source == "number") {
				 constructedEdge.source = nodes[edge.source];
				 }
				 if (typeof edge.target == "number") {
				 constructedEdge.target = nodes[edge.target];
				 }
				 var id = nodeID(constructedEdge.source) + "-" + nodeID(constructedEdge.target);

				 if (directed === false && constructedEdge.source.sortedIndex < constructedEdge.target.sortedIndex) {
				 id = nodeID(constructedEdge.target) + "-" + nodeID(constructedEdge.source);
				 }
				 if (!edgeHash[id]) {
				 edgeHash[id] = constructedEdge;
				 }
				 // else {
				 //   edgeHash[id].weight = edgeHash[id].weight + constructedEdge.weight;
				 // }
 });

 //      console.log("nodes", nodes, nodes.length)

 nodes.forEach(function (sourceNode, a) {
				 nodes.forEach(function (targetNode, b) {
						 var grid = {id: nodeID(sourceNode) + "-" + nodeID(targetNode), source: sourceNode, target: targetNode, x: xScale(b), y: yScale(a),
						 // weight: 0, 
						 height: nodeHeight, width: nodeWidth, value:0};
						 var edgeWeight = 0;
						 var edgeValue = 0;
						 if (edgeHash[grid.id]) {
						 // edgeWeight = edgeHash[grid.id].weight;
						 // grid.weight = edgeWeight;
						 edgeValue = edgeHash[grid.id].value;
						 grid.value = edgeValue;
						 };
						 if (directed === true || b < a) {
						 matrix.push(grid);
						 if (directed === false) {
						 var mirrorGrid = {id: nodeID(sourceNode) + "-" + nodeID(targetNode), source: sourceNode, target: targetNode, x: xScale(a), y: yScale(b),
						 // weight: 0, 
						 height: nodeHeight, width: nodeWidth, value:0};
						 // mirrorGrid.weight = edgeWeight;
						 mirrorGrid.value = edgeValue;
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

 matrix.edgeWeight = function(x) {
		 if (!arguments.length) return edgeWeight;
		 if (typeof x === "function") {
				 edgeWeight = x;
		 }
		 else {
				 edgeWeight = function () {return x};
		 }
		 return matrix;
 }

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
				 .rangePoints([0,size[0]],1);

		 var xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);

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
				 .rangePoints([0,size[1]],1);

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
