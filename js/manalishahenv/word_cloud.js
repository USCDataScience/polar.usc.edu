function load_wordcloud(){
	// var url='http://localhost:8983/solr/collection2/select?q=ner_units%3A*&rows=388&fl=ner_units&wt=json&indent=true';
 	// $.getJSON(url);
 	on_data();

}

function on_data(){

	d3.json("../../data/manalishahenv/units_word_cloud.json", function(error, data) {
        if (error) throw error;
        docs = data.response.docs;
    	var totaldocs = data.response.numFound;
        var units = {};
        boost_ = ["http", "www.", "Article", "Signe", " %" ]
        boost = [" µg", " km", " cm", " m", " kV", " µ" , " eV" , " kg"," C"," °C" , " nm", " mg" , " µM" , " kbar", " kHz", " db"]
        for(var i=0; i<docs.length; i++) {
            var item = docs[i].ner_units;
            for(var j in item) {
                var unit = "";
                if(item[j].indexOf(' ') != -1){
                    unit =  item[j].substring(item[j].indexOf(' '));
                }
                else{
                    unit = item[j];
                }
               
                if(!units[unit]){
                    units[unit] = 1;  
                }
                else {
                    units[unit] =  units[unit] + 1;  
                }
                for(var k in boost) {
                    if(unit.indexOf(boost[k]) != -1) {
                        units[unit] = units[unit] + 3;
                        break;
                    }
                }
                for(var k in boost_) {
                    if(unit.indexOf(boost_[k]) != -1) {

                        units[unit] = units[unit]-5>0?units[unit]-5:1;
                      
                        break;
                    }
                }
                var demo =0;
            }
        }
        var max = 0;
        for(var z in units){
            if(units[z] > max){
                max = units[z];
                val = z
            }
        }
        
        frequency_list = []
        for(var z in units){
            word_strength = {};
            word_strength["text"] = z;
            word_strength["size"] = units[z];
            frequency_list.push(word_strength);
        }

        var color = d3.scale.linear()
            .domain([0, 15, 50, 100, 120, 150, 200, 280, 425, 520, 600])
            .range(["#66c2a4", "##2990b0", "#fa9fb5", "#fee391", "#dadaeb", "#fcbba1", "#ef3b2c", "#dadaeb", "#dd3497", "#a6d96a", "#777", "#99d8c9"]);
        d3.layout.cloud().size([screen.width - 50, screen.height])
            .words(frequency_list)
            .rotate(0)
            .fontSize(function(d) {
                return d.size;
            })
            .on("end", draw)
            .start();
        function draw(words) {
           

            d3.select("#word_cloud").append("svg")
                .attr("width", 1000)
                .attr("height", 1200)
                .attr("class", "wordcloud")
                .append("g")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate(450,410)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) {
                    return d.size + "px";
                })
                .style("fill", function(d, i) {
                    return color(i);
                })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) {
                    return d.text;
                });
        }
    });

}