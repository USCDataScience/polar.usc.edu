function load_piechart(){
	// var url='http://localhost:8983/solr/collection2/select?q=gs_journals%3A*&rows=180&fl=gs_journals&wt=json&indent=true';
 	// $.getJSON(url);
 	on_data();
}

function on_data(){
	 d3.json("../../data/manalishahenv/journals.json", function(error, data) {
            if (error) throw error;

        docs = data.response.docs;
    	var totaldocs = data.response.numFound;
		var journals = {};

		for(var i in docs){
			var j = docs[i]["gs_journals"];
			for(var k in j){
				if(j[k] != "null"){
					if(journals[j[k]])
						journals[j[k]] = journals[j[k]]+1;
					else
						journals[j[k]] = 1;
				}
			}
		}

		data = {"content":[]};
		var others = 0;
		for(var z in journals){
			if(journals[z] < 2)
				others++;
			var temp = {"label":z , "value": journals[z]};
			data["content"].push(temp);
		}
	
top15 = [];
		data["content"] = data["content"].sort(function (a, b) {
    return b.value - a.value;
});

		for(x in data["content"])
		{
			if(x==12){
				break;
			}
			else{
				temp = {"label": data["content"][x]["label"]  , "value": data["content"][x]["value"]}
				top15.push(temp);
			}
		}
		data["content"] = top15;
		 var pie = new d3pie("piechart", {
				"header": {
					      "title": {
							        "text": "Scientific Journals",
        							"fontSize": 35,
        							"font": "verdana"
								    },
    						},
						    "size": {
						      "canvasHeight": 800,
						      "canvasWidth": 1000
						    },
						    "data": {
						      "content": data["content"]
						    },
						    "labels": {
						      "outer": {
						        "pieDistance": 0
						      },
						      "mainLabel": {
									"color": "#333333",
									"font": "arial",
									"fontSize": 15
								}
						    }
						  });

		pied_arc = d3.svg.arc()
    .innerRadius(50)
    .outerRadius(130);
	});
}
