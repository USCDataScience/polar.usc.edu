/**
 * Created by manishdwibedy on 5/3/16.
 */


$(function(){

    var frequency_list = [{"text":"CoronalPhenomena","size":99},{"text":"SystemStateChange","size":37},{"text":"HighPressure","size":20},{"text":"EarthOceanCurrent","size":21},{"text":"Steam","size":34},{"text":"AtmosphericBoundaryLayer","size":40},{"text":"Temperature","size":29},{"text":"Variation","size":40},{"text":"EnergyFrom","size":35},{"text":"Calibration","size":83},{"text":"EquilibriumState","size":87},{"text":"EmissionInventory","size":10},{"text":"PhysicalQuantity","size":16},{"text":"Tension","size":72},{"text":"Dimension","size":70},{"text":"PhysicalProcess","size":35},{"text":"HeavyRainfall","size":56}];

    var color = d3.scale.linear()
        .domain([0,1,2,3,4,5,6,10,15,20,100])
        .range(["red", "gold", "orange", "blue", "cyan", "lightblue", "black", "green", "pink", "purple", "yellow", "grey"]);

    d3.layout.cloud().size([700, 300])
        .words(frequency_list)
        .rotate(0)
        .fontSize(function(d) { return d.size; })
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select("body").append("svg")
            .attr("height", 350)
            .attr("width", 750)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(550,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }

});
