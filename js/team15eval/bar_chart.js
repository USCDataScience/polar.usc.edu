


function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000; // or 1024 for binary
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function parseLongName(name)
{
  var parsernames = name.split(",");
  var str = "";
  var delim = "";
  for(var i = 0 ; i <parsernames.length;i++)
  {
      var start = parsernames[i].lastIndexOf(".");
      var extracted_name = parsernames[i].substring(start+1) ;
      str+=delim+extracted_name
      delim = ",";
  }
  return str;

}

function getPercent(x,y)
{
  
  var k = (100 * x)/y;
  k=k.toFixed(2);
  var str =  k +"%";
  return str;
}

function load()
{
    
    var filename = document.getElementById( "fileType" ).value;
    document.getElementById("visualization").innerHTML = "";
    
    var margin = {top: 120, right: 20, bottom: 30, left: 500},
        width = 1920 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, 250], .1);
        
    var y = d3.scale.linear()
    .range([height, 0]);

    var dist =(width/255)-1;
        
    var svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.json("data/parser_extraction/"+filename+".json",function(error, data) {
      
       
       var xAxis = d3.svg.axis()
        .scale(x)
        .tickFormat(function(d,i) { console.log(data);return data.data[i].name; })
        .orient("bottom");


         y.domain([0, d3.max(data.data, function(d) { return d.raw_content; })]);

        var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        

      var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
            return '  <span class = "tip_h">Raw_size:</span>'+'<span class="tip_v">' + d.raw_content+" B"+'</span><br/><span class = "tip_h"> extracted_content: </span>'+'<span class="tip_v">' + d.extracted_content +" B"+"</span>"+   '<br/><span class = "tip_h"> extracted_content_percent: </span>'+'<span class="tip_v">' + getPercent(d.extracted_content,d.raw_content) +"</span>"+ '<br/><span class = "tip_h"> extracted_metadata:</span>'+'<span class="tip_v">' + d.extracted_metadata+" B"+"</span>"+'<br/><span class = "tip_h"> extracted_metadata_percent: </span>'+'<span class="tip_v">' + getPercent(d.extracted_metadata,d.raw_content)  +"</span>"+'<br/><span class = "tip_h"> name: </span>'+'<span class="tip_v">' +parseLongName(d.name)  +"</span>"
      })
      
      svg.call(tip);
      
      
      if (error) 
      {
            return console.warn(error);
      }
      x.domain(data.data.map(function(d,i) { return i; }));
      //var heightScale = d3.scale.linear()
      //                            .domain([0,70])
      //                            .range([height,0]);
      var heightScale = d3.scale.linear()
                     .domain([0, d3.max(data.data, function(d) { return d.raw_content; })])
                     .range([height,0]);
     
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Raw Byte Count");
      svg.selectAll(".bar")
          .data(data.data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d,i) { 
          //console.log(d.c);
          return 27; }
          )
          .attr("width", 90)
          .attr("y", function(d) { return heightScale(d.extracted_content); })
          .attr("height", function(d) { return height - heightScale(d.extracted_content); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);
    });
}