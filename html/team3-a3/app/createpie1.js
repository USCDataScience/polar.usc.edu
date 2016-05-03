function getPieData(data) {
	piedata = []
	$.each(data, function(index){
		$.each(data[index], function(key, value) {
			var rgb = [];
			for(var i = 0; i < 3; i++)
	    		rgb.push(Math.floor(Math.random() * 255));
			labelobject = {};
			labelobject["label"] = key;
			labelobject["value"] = parseInt(value);
			labelobject["color"] = 'rgb('+ rgb.join(',') +')';
			piedata.push(labelobject);
		});
	});
	return piedata;
}

function createPie(data) {
	var pie = new d3pie("pieChart1", { 
		data: { 
				content: data 
		},
		tooltips: {
		    enabled: true,
		    type: "placeholder",
		    string: "{label}: {percentage}% ({value})",
		},
		callbacks: {
			onClickSegment: function(a) {
				//alert("Segment clicked! See the console for all data passed to the click handler.");
				//console.log(getPieData(datadic[a.data.label]));
				if(getPieData(datadic[a.data.label]).length>0) {
					pie.destroy();
					pie = null;
					createPie(getPieData(datadic[a.data.label]));
				}
			}
		}
	});
}


$.get("data1.json", function(data, status) {
	datadic = {};
	$.each(data, function(key, value) {
		var keyarr = key.split("/");
		if (datadic[keyarr[0]] != undefined) {
			keyvalue = datadic[keyarr[0]];
			//console.log(keyvalue);
			keyvalueobj = {};
			keyvalueobj[keyarr[1]] = value;
			keyvalue.push(keyvalueobj);
			datadic[keyarr[0]] = keyvalue;
		} else {
			keyvalue = [];
			keyvalueobj = {};
			keyvalueobj[keyarr[1]] = value;
			keyvalue.push(keyvalueobj);
			datadic[keyarr[0]] = keyvalue;
			//console.log("wenthere");
		}
	});
	//console.log(datadic);
	parentdata = []
	$.each(datadic, function(key, value){
		var label = key;
		var labelvalue = 0;
		$.each(value, function(index){
			$.each(value[index], function(childkey, childvalue) {
				labelvalue+=parseInt(childvalue);
			});
		});
		var rgb = [];
		for(var i = 0; i < 3; i++)
    		rgb.push(Math.floor(Math.random() * 255));
		labelobject = {};
		labelobject["label"] = label;
		labelobject["value"] = labelvalue;
		labelobject["color"] = 'rgb('+ rgb.join(',') +')';
		parentdata.push(labelobject);
	});
	//console.log(parentdata);
	createPie(parentdata);
});