
$(document).ready(function () {
	var my_data = {items: []};
	
	$.when(
    $.getJSON("http://polar.usc.edu/solr/geo/select?q=Arctic&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Arctic";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	  $.getJSON("http://polar.usc.edu/solr/geo/select?q=%22United+States%22&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "United States";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	  $.getJSON("http://polar.usc.edu/solr/geo/select?q=%22Arctic+Ocean%22&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Arctic Ocean";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	  $.getJSON("http://polar.usc.edu/solr/geo/select?q=Alaska&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Alaska";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	  $.getJSON("http://polar.usc.edu/solr/geo/select?q=%22Republic+of+Benin%22&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Republic of Benin";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	  $.getJSON("http://polar.usc.edu/solr/geo/select?q=Canada&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Canada";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	 $.getJSON("http://polar.usc.edu/solr/geo/select?q=&22Australia%22&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Commonwealth of Australia";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	 $.getJSON("http://polar.usc.edu/solr/geo/select?q=Colorado&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Colorado";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 }),
	 $.getJSON("http://polar.usc.edu/solr/geo/select?q=Tennessee&wt=json&json.wrf=?&indent=true", function(response) {
	   var temp = {text: "", count: ""};
	   temp.text = "Tennessee";
	   temp.count =  response['response']['numFound'];
	   my_data.items.push(temp);
	 })
	 
	).then(function() {
		drawBubbleChart();
	});
	
	function drawBubbleChart() {
	  var bubbleChart = new d3.svg.BubbleChart({
		supportResponsive: true,
		size: 600,
		innerRadius: 600 / 3.5,
		radiusMin: 50,
	
		data: {
		  items: my_data.items,
		  eval: function (item) {return item.count;},
		  classed: function (item) {return item.text.split(" ").join("");}
		},
		plugins: [
		  {
			name: "central-click",
			options: {
			  
			  style: {
				"font-size": "12px",
				"font-style": "italic",
				"font-family": "Source Sans Pro, sans-serif",
				//"font-weight": "700",
				"text-anchor": "middle",
				"fill": "white"
			  },
			  attr: {dy: "65px"},
			  
			}
		  },
		  {
			name: "lines",
			options: {
			  format: [
				{// Line #0
				  textField: "count",
				  classed: {count: true},
				  style: {
					"font-size": "28px",
					"font-family": "Source Sans Pro, sans-serif",
					"text-anchor": "middle",
					fill: "white"
				  },
				  attr: {
					dy: "0px",
					x: function (d) {return d.cx;},
					y: function (d) {return d.cy;}
				  }
				},
				{// Line #1
				  textField: "text",
				  classed: {text: true},
				  style: {
					"font-size": "14px",
					"font-family": "Source Sans Pro, sans-serif",
					"text-anchor": "middle",
					fill: "white"
				  },
				  attr: {
					dy: "20px",
					x: function (d) {return d.cx;},
					y: function (d) {return d.cy;}
				  }
				}
			  ],
			  centralFormat: [
				{// Line #0
				  style: {"font-size": "50px"},
				  attr: {}
				},
				{// Line #1
				  style: {"font-size": "30px"},
				  attr: {dy: "40px"}
				}
			  ]
			}
		  }]
	  });
	}
});
