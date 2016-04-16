function load_dendrogram(){
	console.log("in dendogram search");
	// var url='http://localhost:8983/solr/collection2/select?q=gs_results%3A*&rows=200&fl=id%2C+gs_authors%2C+gs_citations%2C+gs_years%2C+gs_related_titles&wt=jsonp&indent=true';
 	// $.getJSON(url);
 	on_data();

}


function on_data(){

	console.log("in collapsible tree ");
 	var authors ={};
 	var years = {};
 	var title = {};
	var margin = {top: 20, right: 10, bottom: 20, left: 50},
	    width = 960 - margin.right - margin.left,
	    height = 1600 - margin.top - margin.bottom;

	var i = 0,
	    duration = 750,
	    root;

	var tree = d3.layout.tree()
	    .size([height, width]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#tree").append("svg")
	    .attr("width", width + margin.right + margin.left)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	 	d3.json('../../data/manalishahenv/polar_index.json', function(error, data) {
	    if (error) throw index;

	       docs = data.response.docs;
	    	var totaldocs = data.response.numFound;
	    	for(var i=0; i<docs.length; i++){
	    		item = docs[i];
	    		if(item.gs_years != undefined && item.gs_related_titles != undefined && item.gs_authors.length != undefined){
	    			for(var j=0; j<item.gs_authors.length; j++){
	    				each_author = item.gs_authors[j].split(",");
	    				time = item.gs_years[j];
	    				for(var a in each_author){
	    					if(time != "null" && years[time]){
	    						years[time].push(each_author[a]);
	    					}
	    					else if(time!="null" && !years[time]){
	    						years[time] = [];
	    						years[time].push(each_author[a]);
	    					}
		    				if(!authors[each_author[a]]) {
		    					var paper = {};
		    					paper["name"] = item.gs_related_titles[j];
		    					if(item.gs_citations[j] != undefined)
		    						paper["citations"] = item.gs_citations[j];
		    					paper[time] = 0;
		    					authors[each_author[a]] = [];
		    					authors[each_author[a]].push(paper);
		    				}
		    				else {
		    					var paper = {};
		    					paper["name"] = item.gs_related_titles[j];
		    					paper["citations"] = item.gs_citations[j];
		    					paper[time] = 0;
		    					authors[each_author[a]].push(paper);
		    				}
	    				}
	    			}
	    		}
	    	}
  

    	flare_json = {"name":"Papers", "children":[]};
    	for(var year in years){
    		child = {"name": year, "children":[]};
    		for(var a in years[year]){
    			author_name = years[year][a];
    			author = {"name": author_name, "children":[]};
    			for(var i in authors[author_name]){
    				authors[author_name][i][year];
    				if(authors[author_name][i][year] == 0){
    					author.children.push(authors[author_name][i]);
    				}
    			}
    			child.children.push(author);
    		}
    		flare_json.children.push(child);
    		
    	}
	
	  root = flare_json;
	  console.log(root);
	  root.x0 = height / 2;
	  root.y0 = 0;

	  function collapse(d) {
	    if (d.children) {
	      d._children = d.children;
	      d._children.forEach(collapse);
	      d.children = null;
	    }
	  }

	  root.children.forEach(collapse);
	  update(root);

	   });
	d3.select(self.frameElement).style("height", "800px");

	function update(source) {

	  // Compute the new tree layout.
	  var nodes = tree.nodes(root).reverse(),
	      links = tree.links(nodes);

	  // Normalize for fixed-depth.
	  nodes.forEach(function(d) { d.y = d.depth * 180; });

	  // Update the nodes…
	  var node = svg.selectAll("g.node")
	      .data(nodes, function(d) { return d.id || (d.id = ++i); });

	  // Enter any new nodes at the parent's previous position.
	  var nodeEnter = node.enter().append("g")
	      .attr("class", "node")
	      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	      .on("click", click);

	  nodeEnter.append("circle")
	      .attr("r", 1e-6)
	      .style("fill", function(d) { return d._children ? "#fde0dd" : "#fff"; });

	  nodeEnter.append("text")
	      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
	      .attr("dy", ".35em")
	      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
	      .text(function(d) { return d.name; })
	      .style("fill-opacity", 1e-6);

	  // Transition nodes to their new position.
	  var nodeUpdate = node.transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	  nodeUpdate.select("circle")
	      .attr("r", 4.5)
	      .style("fill", function(d) { return d._children ? "fde0dd" : "#fff"; });

	  nodeUpdate.select("text")
	      .style("fill-opacity", 1);

	  // Transition exiting nodes to the parent's new position.
	  var nodeExit = node.exit().transition()
	      .duration(duration)
	      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	      .remove();

	  nodeExit.select("circle")
	      .attr("r", 1e-6);

	  nodeExit.select("text")
	      .style("fill-opacity", 1e-6);

	  // Update the links…
	  var link = svg.selectAll("path.link")
	      .data(links, function(d) { return d.target.id; });

	  // Enter any new links at the parent's previous position.
	  link.enter().insert("path", "g")
	      .attr("class", "link")
	      .attr("d", function(d) {
	        var o = {x: source.x0, y: source.y0};
	        return diagonal({source: o, target: o});
	      });

	  // Transition links to their new position.
	  link.transition()
	      .duration(duration)
	      .attr("d", diagonal);

	  // Transition exiting nodes to the parent's new position.
	  link.exit().transition()
	      .duration(duration)
	      .attr("d", function(d) {
	        var o = {x: source.x, y: source.y};
	        return diagonal({source: o, target: o});
	      })
	      .remove();

	  // Stash the old positions for transition.
	  nodes.forEach(function(d) {
	    d.x0 = d.x;
	    d.y0 = d.y;
	  });
	}

	// Toggle children on click.
	function click(d) {
	  if (d.children) {
	    d._children = d.children;
	    d.children = null;
	  } else {
	    d.children = d._children;
	    d._children = null;
	  }
	  update(d);
	}


}