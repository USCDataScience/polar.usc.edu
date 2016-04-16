function load_radial(){
	// var url='http://localhost:8983/solr/collection2/select?q=Title%3A*&rows=180&fl=Title%2C+Album&wt=json&indent=true';
 	// $.getJSON(url);
 	on_data();

}

function on_data(){
var radius = 960 / 2;

var cluster = d3.layout.cluster()
    .size([360, radius - 120]);

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("#radial").append("svg")
    .attr("width", radius * 2)
    .attr("height", radius * 2)
  .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")");

d3.json("../../data/manalishahenv/radial_flare.json", function(error, root) {
  if (error) throw error;





//added by me
	 var albums ={};
 	 var titles = {};
 	 var radial = {name:"mpeg files", children:[]};
   docs = root.response.docs;
	 var totaldocs = root.response.numFound;
  	for(var i=0; i<docs.length/3; i++){
  		var item = docs[i];
  		if(item["Title"]==""){
  			continue;
  		}
  		else if(item["Album"]){
  			if(!albums[item["Album"]]){
  				var children = [];
  				children.push(item["Title"]);
  				albums[item["Album"]] = children;
  			}
  		}
  		else{
  			if(!titles[item["Title"]]){
  				titles[item["Title"]] = 1;
  			}
  		}
  	}
  	for(var t in titles){
  		var temp = {"name":t, "size":1};
  		radial["children"].push(temp);
  	}
  	for(var a in albums){
  		var c  = albums[a];
  		var children = [];
  		for(i in c){
  			var temp = {"name":c[i], "size":1};
  			children.push(temp);
  		}
  		var temp = {"name":a, "children":children};
  		radial["children"].push(temp);
  	}


    root = radial;

  var nodes = cluster.nodes(root);

  var link = svg.selectAll("path.link")
      .data(cluster.links(nodes))
    .enter().append("path")
      .attr("class", "link")
      .attr("d", diagonal);

  var node = svg.selectAll("g.node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })

  node.append("circle")
      .attr("r", 4.5);

  node.append("text")
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
      .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
      .text(function(d) { return d.name; });
});

d3.select(self.frameElement).style("height", radius * 2 + "px");
}



















