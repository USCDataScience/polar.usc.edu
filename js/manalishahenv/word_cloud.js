function load_wordcloud(){
	console.log("in dendogram search");
	// var url='http://localhost:8983/solr/collection2/select?q=ner_units%3A*&rows=388&fl=ner_units&wt=json&indent=true';
 	// $.getJSON(url);
 	on_data();

}

function on_data(){

	d3.json("../../data/manalishahenv/units_word_cloud.json", function(error, data) {
        if (error) throw error;

        console.log("loaded data"); 
        docs = data.response.docs;
    	var totaldocs = data.response.numFound;
		console.log(totaldocs);
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
                        // console.log(unit + " :" +units[unit]);
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
        console.log(val+":" +max);
        console.log(units["year"]);
        
        frequency_list = []
        for(var z in units){
            // console.log(z + ": " + units[z]);
            word_strength = {};
            word_strength["text"] = z;
            word_strength["size"] = units[z];
            frequency_list.push(word_strength);
        }
        // console.log(frequency_list);

        // frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10},{"text":"electricity","size":15},{"text":"movement","size":10},{"text":"relation","size":5},{"text":"things","size":10},{"text":"force","size":5},{"text":"ad","size":5},{"text":"energy","size":85},{"text":"living","size":5},{"text":"nonliving","size":5},{"text":"laws","size":15},{"text":"speed","size":45},{"text":"velocity","size":30},{"text":"define","size":5},{"text":"constraints","size":5},{"text":"universe","size":10},{"text":"physics","size":120},{"text":"describing","size":5},{"text":"matter","size":90},{"text":"physics-the","size":5},{"text":"world","size":10},{"text":"works","size":10},{"text":"science","size":70},{"text":"interactions","size":30},{"text":"studies","size":5},{"text":"properties","size":45},{"text":"nature","size":40},{"text":"branch","size":30},{"text":"concerned","size":25},{"text":"source","size":40},{"text":"google","size":10},{"text":"defintions","size":5},{"text":"two","size":15},{"text":"grouped","size":15},{"text":"traditional","size":15},{"text":"fields","size":15},{"text":"acoustics","size":15},{"text":"optics","size":15},{"text":"mechanics","size":20},{"text":"thermodynamics","size":15},{"text":"electromagnetism","size":15},{"text":"modern","size":15},{"text":"extensions","size":15},{"text":"thefreedictionary","size":15},{"text":"interaction","size":15},{"text":"org","size":25},{"text":"answers","size":5},{"text":"natural","size":15},{"text":"objects","size":5},{"text":"treats","size":10},{"text":"acting","size":5},{"text":"department","size":5},{"text":"gravitation","size":5},{"text":"heat","size":10},{"text":"light","size":10},{"text":"magnetism","size":10},{"text":"modify","size":5},{"text":"general","size":10},{"text":"bodies","size":5},{"text":"philosophy","size":5},{"text":"brainyquote","size":5},{"text":"words","size":5},{"text":"ph","size":5},{"text":"html","size":5},{"text":"lrl","size":5},{"text":"zgzmeylfwuy","size":5},{"text":"subject","size":5},{"text":"distinguished","size":5},{"text":"chemistry","size":5},{"text":"biology","size":5},{"text":"includes","size":5},{"text":"radiation","size":5},{"text":"sound","size":5},{"text":"structure","size":5},{"text":"atoms","size":5},{"text":"including","size":10},{"text":"atomic","size":10},{"text":"nuclear","size":10},{"text":"cryogenics","size":10},{"text":"solid-state","size":10},{"text":"particle","size":10},{"text":"plasma","size":10},{"text":"deals","size":5},{"text":"merriam-webster","size":5},{"text":"dictionary","size":10},{"text":"analysis","size":5},{"text":"conducted","size":5},{"text":"order","size":5},{"text":"understand","size":5},{"text":"behaves","size":5},{"text":"en","size":5},{"text":"wikipedia","size":5},{"text":"wiki","size":5},{"text":"physics-","size":5},{"text":"physical","size":5},{"text":"behaviour","size":5},{"text":"collinsdictionary","size":5},{"text":"english","size":5},{"text":"time","size":35},{"text":"distance","size":35},{"text":"wheels","size":5},{"text":"revelations","size":5},{"text":"minute","size":5},{"text":"acceleration","size":20},{"text":"torque","size":5},{"text":"wheel","size":5},{"text":"rotations","size":5},{"text":"resistance","size":5},{"text":"momentum","size":5},{"text":"measure","size":10},{"text":"direction","size":10},{"text":"car","size":5},{"text":"add","size":5},{"text":"traveled","size":5},{"text":"weight","size":5},{"text":"electrical","size":5},{"text":"power","size":5}];

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
            d3.select("#word_cloud")
            .attr("width", 1100)
                .attr("height", 1200);

            d3.select("#word_cloud .panel-body").append("svg")
                .attr("width", 1100)
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