var data_Data = [];
var YearValue = 0;
var Residences = ["","","","",""];
var RefbyYear = [];

function resetmyForm(){
    
	// Resetting Form
	document.getElementById("consoleform").reset();
	
	// Enabling Draw Button
	if (document.getElementById("DrawBarButton") != null){
		document.getElementById("DrawBarButton").disabled = false;
		console.log(document.getElementById("DrawBarButton").disabled);
	}
	
	// Disabling Update Button
	if (document.getElementById("UpdateBarButton") != null){
			document.getElementById("UpdateBarButton").disabled = true;
	}
	
	// Removing all Figures
	d3.selectAll("svg").remove();
	
	// Resetting Export Button Console
	if (document.getElementById("c1") != null && document.getElementById("c2") != null){
		document.getElementById("c1").checked = false;
		document.getElementById("c2").checked = false;
	}
}

function fileLoader(){
	// Storing Data in a Global Variable upon "Loading the Data"
	d3.csv("dataset.csv", function(error,data){
		if(error){
			console.log(error);
		}
		else{
			console.log(data);
			data_Data = data; // Global variable which stores all the data.
		}
		console.log(data_Data[1]);
		console.log(data_Data.length);
		Intergerfy(); // Convert 'Year' and 'Refugees' to Integer
		console.log(data_Data[1]);
		uniqueYears(); // Calculates and displays (on console) all the unique years and updates Year Drop Down Menu
		uniqueResidences(); // Calculates and displays (on console) all the unique residence countries and updates Year Drop Down Menu
	});
}

// Calculates and displays (on console) all the unique years and updates Year Drop Down Menu
function uniqueYears(){
	var unq_Years_arr = [];
	var checker = 0;
	console.log(unq_Years_arr.length);
	unq_Years_arr.push(data_Data[0].Year);
	console.log(unq_Years_arr);
	for (var i = 0; i < data_Data.length; i++){
		checker = 0;
		for (var j = 0; j < unq_Years_arr.length; j++){
			if (data_Data[i].Year == unq_Years_arr[j]){
				checker = 1;
				break;
			}
		}
		if (checker == 0){
			unq_Years_arr.push(data_Data[i].Year);
		}
	}
	console.log(unq_Years_arr); // Display all the unique years
	updateDropDown("YearDrop",unq_Years_arr); // Updates drop down menu of Years
}

// Updates drop down menu of concerned element; Input: ID and Array
function updateDropDown(objectID,inputArray){
	var select = document.getElementById(objectID);
	for (var i = 0; i < inputArray.length; i++){
		var option = document.createElement('option');
		option.text = option.value = inputArray[i];
		select.add(option);
	}
}

// Convert 'Year' and 'Refugees' to Integer
function Intergerfy(){
	for (var i = 0; i < data_Data.length; i++){
		data_Data[i].Year = parseInt(data_Data[i].Year);
		data_Data[i].Refugees = parseInt(data_Data[i].Refugees);
	}
}

// Calculates and displays (on console) all the unique years and updates Year Drop Down Menu
function uniqueResidences(){
	var copy_RefbyYear = d3.nest() // Summarizing filtered array based on Residence Country
				.key(function(d){return d.Residence;})
				.rollup(function (v) { return d3.sum(v, function(d){return d.Refugees;});})
				.entries(data_Data);
	console.log(copy_RefbyYear);
	var Resids = []; // Array containing unique residences
	for (var i = 0; i < copy_RefbyYear.length; i++){
		Resids.push(copy_RefbyYear[i].key);
	}
	console.log(Resids);
	updateDropDown("Res1Drop",Resids);
	updateDropDown("Res2Drop",Resids);
	updateDropDown("Res3Drop",Resids);
	updateDropDown("Res4Drop",Resids);
	updateDropDown("Res5Drop",Resids);
}

// Listen to Year and Update the Data for Graph 1
function listenYear(){
	if (document.getElementById("YearDrop") != null){
		YearValue = document.getElementById("YearDrop").value;
		console.log(YearValue);
		RefbyYear = data_Data.filter(YearFilter); // Filtering data by specified Year
		console.log(RefbyYear);
	}
}

// year Filter: Aids Filtering data by specified Year
function YearFilter(d){
	return d.Year == YearValue;
}

// Updated: Listen to Residence Countries and Update Graph 2
function listenResidenceUpdated(SelectID){
	
	if (document.getElementById(SelectID) != null){
		
		// Updating array containing selected residence countries
		if (SelectID == "Res1Drop"){
			Residences[0] = document.getElementById(SelectID).value;
			console.log(Residences);
		}
		else if (SelectID == "Res2Drop"){
			Residences[1] = document.getElementById(SelectID).value;
			console.log(Residences);
		}
		else if (SelectID == "Res3Drop"){
			Residences[2] = document.getElementById(SelectID).value;
			console.log(Residences);
		}
		else if (SelectID == "Res4Drop"){
			Residences[3] = document.getElementById(SelectID).value;
			console.log(Residences);
		}
		else if (SelectID == "Res5Drop"){
			Residences[4] = document.getElementById(SelectID).value;
			console.log(Residences);
		}
		
	}
}

// Residence Filter
function ResiFilter(d){
	var check = 0;
	for (var i = 0; i < Residences.length; i++){
		if (d.Residence == Residences[i]){
			check = 1;
			break;
		}
	}
	if (check == 1){
		return true;
	}
	else{
		return false;
	}
}

// Enter Stage for Simple Bar Chart (Updated Function)
function enterStageUpdate(Grph,width,height,InputArray){
	
	var lengthData = InputArray.length;
	var barHeight = Math.floor((height-20)/(lengthData));
	var widthScale = d3.scaleLinear().domain([0,d3.max(InputArray,function(d){return d.value;})]).range([0,width-20]);
	var colScale = d3.scaleSequential(d3.interpolateSpectral); // https://github.com/d3/d3-scale-chromatic#schemeAccent
	var xaxis = d3.axisBottom().scale(widthScale).ticks(5).tickFormat(d3.format(".2s")); // Defining X-Axis
	var canvas = d3.select(Grph).append("svg").attr("id","CumlFig").attr("width",width).attr("height",height).append("g").attr("transform","translate(15,0)"); // Creating Canvas
	
	var bars = canvas.selectAll("rect") // Adding DOM Elements with data directed attributes.
					.data(InputArray)
					.enter()
						.append("rect")
						.attr("width",function(d){return widthScale(d.value);})
						.attr("height",barHeight)
						.attr("y",function(d,i){return (barHeight*(i));})
						.attr("stroke","black")
						.attr("stroke-width",2)
						.attr("fill",function(d,i){return colScale((i+1)/lengthData);});
						
	var textsLabel = canvas.selectAll("text") // Adding DOM Elements with data directed attributes.
					.data(InputArray)
					.enter()
						.append("text")
						.text(function(d){return d.key;})
						.attr("y",function(d,i){return (barHeight*(i))+(barHeight/1.5);})
						.attr("class","tagLabels")
						.attr("x",5);
	
	canvas.append("g").attr("class","axis").attr("transform", "translate(0," + (height - 20) + ")").call(xaxis);
}

// Enter Stage for Simple Bar Chart (Updated Function)
function UpdateStage(Grph,width,height,InputArray){
	
	var lengthData = InputArray.length;
	var barHeight = Math.floor((height-20)/(lengthData));
	var widthScale = d3.scaleLinear().domain([0,d3.max(InputArray,function(d){return d.value;})]).range([0,width-20]);
	var colScale = d3.scaleSequential(d3.interpolateSpectral); // https://github.com/d3/d3-scale-chromatic#schemeAccent
	var xaxis = d3.axisBottom().scale(widthScale).ticks(5).tickFormat(d3.format(".2s")); // Defining X-Axis
	var canvas = d3.select(Grph).attr("width",width).attr("height",height).attr("transform","translate(15,0)"); // Updating Canvas
	
	var bars = canvas.selectAll("rect") // Updating DOM Elements with data directed attributes.
					.data(InputArray)
					.transition()
					.duration(1000)
					.ease(d3.easeLinear)
						.attr("width",function(d){return widthScale(d.value);})
						.attr("height",barHeight)
						.attr("y",function(d,i){return (barHeight*(i));})
						.attr("stroke","black")
						.attr("stroke-width",2)
						.attr("fill",function(d,i){return colScale((i+1)/lengthData);});
						
	var textsLabel = canvas.selectAll("text") // Updating DOM Elements with data directed attributes.
					.data(InputArray)
					.transition()
					.duration(1000)
					.ease(d3.easeLinear)
						.text(function(d){return d.key;})
						.attr("y",function(d,i){return (barHeight*(i))+(barHeight/1.5);})
						.attr("class","tagLabels")
						.attr("x",5);
	
	// Calling updated axis
	canvas.select(".axis")
		.transition()
		.duration(1000)
		.call(xaxis);
}

// Enter Stage for Grouped Bar Chart (Updated Function)
function enterStageGr2(Grph,width,height,InputArrayofObjects){
				
	var y0 = d3.scaleBand().rangeRound([0,height-20]); // Constructing a band scale (for Origin Countries); Domain is not set now.
	y0.paddingInner(0.3); // Padding between bar groups
	y0.paddingOuter(0.1); // Padding before first group and after last group
	
	//var y1 = d3.scaleBand(); // Ordinal Scale for Residence Countries inside the groups // Domain and range is not yet set.
	
	var x = d3.scaleLinear().range([0,width-20]); // Linear Scale for the x-axis (refugee population)
	
	var colScale = d3.scaleOrdinal(["DarkGoldenRod","BurlyWood","Tan","Chocolate","SaddleBrown"]); // Colour Scale for the selected residence countries

	var canvas = d3.select(Grph).append("svg").attr("id","DistFig").attr("width",width).attr("height",height).append("g").attr("transform","translate(15,0)"); // Creating Canvas

	// Setting the domain of Major y-scale (y0)
	y0.domain(InputArrayofObjects.map(function (d){return d.key}));
	console.log(y0.domain());
		
	// Setting the domain of x-scale (x)
	x.domain([0,d3.max(InputArrayofObjects, function(d){return d3.max(d.values, function(v){return v.value;})})]);
	console.log(x.domain());
	var barHeight = Math.floor(y0.bandwidth()/Residences.length); // bar height
	
	// Setting up Axis
	var xAxis = d3.axisBottom().scale(x).ticks(5).tickFormat(d3.format(".2s")); // Defining X-Axis
	var yAxis0 = d3.axisRight().scale(y0); // Defining major Y-Axis
	//var yAxis1 = d3.axisRight().scale(y1); // Defining minor Y-Axis
	
	// Calling X-Axis
	canvas.append("g").attr("class","xaxis").attr("transform", "translate(0," + (height - 20) + ")").call(xAxis); // X-Axis
	

	// SVG Group Elements will be created and each one will have bound to it the data for each origin country.
	var origins = canvas.selectAll(".origins")
    .data(InputArrayofObjects)
	.enter().append("g")
		.attr("class", "origins")
		.attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
		
	// Adding rectangles for each origin country
	origins.selectAll("rect")
    .data(function(d) { return d.values; })
	.enter().append("rect")
		.attr("height", barHeight)
		.attr("x", 0)
		.attr("y", function(d,i){return (barHeight*(i));})
		.attr("class","Rectangles")
		.attr("width", function(d) { return x(d.value); })
		.style("fill", function(d) { return colScale(d.key); });
	  
	
	// Legends
	var legend = canvas.selectAll(".legend")
				.data(Residences)
				.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function(d, i) { return "translate(0,"+ i * 20 + ")"; });
	
	legend.append("text")
		.attr("class", "legendText")
		.attr("x", width - 45)
		.attr("y", 20)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
	legend.append("rect")
		.attr("class", "legendRects")
		.attr("x", width - 30)
		.attr("y", 15)
		.attr("width", 8)
		.attr("stroke","black")
		.attr("shape-rendering", "crispEdges")
		.attr("height", 18)
		.style("fill", colScale);
	  
	// Calling Y-Axis
	canvas.append("g").attr("class","yaxis").attr("transform",  "rotate(0)").call(yAxis0); // Major Y-Axis
	
}

// Update Stage for Grouped Bar Chart (Updated Function)
function UpdateStageGr2(Grph,width,height,InputArrayofObjects){
				
	var y0 = d3.scaleBand().rangeRound([0,height-20]); // Constructing a band scale (for Origin Countries); Domain is not set now.
		y0.paddingInner(0.3); // Padding between bar groups
		y0.paddingOuter(0.1); // Padding before first group and after last group
	
	var x = d3.scaleLinear().range([0,width-20]); // Linear Scale for the x-axis (refugee population)
	
	var colScale = d3.scaleOrdinal(["DarkGoldenRod","BurlyWood","Tan","Chocolate","SaddleBrown"]); // Colour Scale for the selected residence countries

	var canvas = d3.select(Grph); // Selecting Graph and storing it in variable Canvas

	// Setting the domain of Major y-scale (y0)
	y0.domain(InputArrayofObjects.map(function (d){return d.key}));
	console.log(y0.domain());
		
	// Setting the domain of x-scale (x)
	x.domain([0,d3.max(InputArrayofObjects, function(d){return d3.max(d.values, function(v){return v.value;})})]);
	console.log(x.domain());
	var barHeight = Math.floor(y0.bandwidth()/Residences.length); // bar height
	
	// Setting up Axis
	var xAxis = d3.axisBottom().scale(x).ticks(5).tickFormat(d3.format(".2s")); // Defining X-Axis
	var yAxis0 = d3.axisRight().scale(y0); // Defining major Y-Axis
	
	// Calling Updated X-Axis
	canvas.select(".xaxis").transition().duration(1000).call(xAxis); // X-Axis
	
	// Data Binding

	var origins = canvas.selectAll(".origins")
    .data(InputArrayofObjects);
	
	var reggys = origins.selectAll("rect")
    .data(function(d) { return d.values; });
	
	// Enter Stage
	origins.enter().append("g");
	reggys.enter().append("rect");
	
	// Update Stage
	canvas.selectAll(".origins")
		.attr("class", "origins")
		.attr("transform", function(d) { return "translate(0," + y0(d.key) + ")"; });
			
	origins.selectAll("rect")
		.transition().duration(1000)
		.attr("height", barHeight)
		.attr("x", 0)
		.attr("y", function(d,i){return (barHeight*(i));})
		.attr("class","Rectangles")
		.attr("width", function(d) { return x(d.value); })
		.style("fill", function(d) { return colScale(d.key); });
	
	// Exit Stage
	origins.exit().remove(); // Updating groups (Why? Because: Origins contain the data related to different residence countries. Upon data-change, if DOM Elements > Data Elements, exit() needs to be employed.)
	reggys.exit().transition().duration(1000).attr("y", height).remove();
			
	// Legends
	var legend = canvas.selectAll(".legend")
				.data(Residences);
				
	legend.selectAll("text").remove();
	legend.selectAll("rect").remove();
	
	legend.append("text")
		.attr("class", "legendText")
		.attr("x", width - 45)
		.attr("y", 20)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
	
	legend.append("rect")
		.attr("class", "legendRects")
		.attr("x", width - 30)
		.attr("y", 15)
		.attr("width", 8)
		.attr("stroke","black")
		.attr("shape-rendering", "crispEdges")
		.attr("height", 18)
		.style("fill", colScale);
	  
	// Calling Updated Y-Axis
	canvas.select("yaxis").transition().duration(1000).call(yAxis0); // Major Y-Axis
	
}

function updateVisual(){
	
	if (YearValue!=0){
		var copy_RefbyYear = d3.nest() // Summarizing filtered array based on Origin Country
								.key(function(d){return d.Origin;})
								.rollup(function (v) { return d3.sum(v, function(d){return d.Refugees;});})
								.entries(RefbyYear);
		console.log(copy_RefbyYear);
		UpdateStage("#Grph1",580,380,copy_RefbyYear); // Updating Graph 1
		
		if (document.getElementById("Res1Drop").value != 0 && document.getElementById("Res2Drop").value != 0 && document.getElementById("Res3Drop").value != 0 && document.getElementById("Res4Drop").value != 0 && document.getElementById("Res5Drop").value != 0){
			// Draw Graph 2
			var copy_RefbyYear = RefbyYear.filter(ResiFilter);
			console.log(copy_RefbyYear);
			copy_RefbyYear = d3.nest() // Summarizing filtered array based on Origin Country
								.key(function(d){return d.Origin;})
								.key(function(d){return d.Residence;})
								.rollup(function (v) { return d3.sum(v, function(d){return d.Refugees;});})
								.entries(copy_RefbyYear);
			console.log(copy_RefbyYear); // Desired array printed on Console.
			console.log(copy_RefbyYear[0]); // Desired array printed on Console.
			console.log(copy_RefbyYear[0].values); // Desired array printed on Console.
			UpdateStageGr2("#Grph2",580,380,copy_RefbyYear);
		}
	}
	
}

function drawVisual(){
	
	if (document.getElementById("DrawBarButton") != null){
		document.getElementById("DrawBarButton").disabled = true;
		console.log(document.getElementById("DrawBarButton").disabled);
	}
	
	if (document.getElementById("UpdateBarButton") != null){
			document.getElementById("UpdateBarButton").disabled = false;
	}
	
	if (YearValue!=0){
		var copy_RefbyYear = d3.nest() // Summarizing filtered array based on Origin Country
								.key(function(d){return d.Origin;})
								.rollup(function (v) { return d3.sum(v, function(d){return d.Refugees;});})
								.entries(RefbyYear);
		console.log(copy_RefbyYear);
		enterStageUpdate("#Grph1",580,380,copy_RefbyYear); // Adding Graph 1
	
		if (document.getElementById("Res1Drop").value != 0 && document.getElementById("Res2Drop").value != 0 && document.getElementById("Res3Drop").value != 0 && document.getElementById("Res4Drop").value != 0 && document.getElementById("Res5Drop").value != 0){
			// Draw Graph 2
			var copy_RefbyYear = RefbyYear.filter(ResiFilter);
			console.log(copy_RefbyYear);
			copy_RefbyYear = d3.nest() // Summarizing filtered array based on Origin Country
								.key(function(d){return d.Origin;})
								.key(function(d){return d.Residence;})
								.rollup(function (v) { return d3.sum(v, function(d){return d.Refugees;});})
								.entries(copy_RefbyYear);
			console.log(copy_RefbyYear); // Desired array printed on Console.
			console.log(copy_RefbyYear[0]); // Desired array printed on Console.
			console.log(copy_RefbyYear[0].values); // Desired array printed on Console.
			enterStageGr2("#Grph2",580,380,copy_RefbyYear);
		}	
	
	}
	
}

function exportPNG(){
	if (document.getElementById("c1") != null ){
		if (document.getElementById("c1").checked == true){
			//Export Graph 1
			if (document.getElementById("CumlFig") != null){
				PNGhandler("#CumlFig",580,380);
			}
		}
	}
	if (document.getElementById("c2") != null){
		if (document.getElementById("c2").checked == true){
			//Export Graph 2
			if (document.getElementById("DistFig") != null){
				PNGhandler("#DistFig",580,380);
			}
		}
	}
}

function PNGhandler(SVGelement,width,height){
	
	var svg = document.querySelector(SVGelement); // Getting the Element
	
	var svgData = new XMLSerializer().serializeToString(svg); // XMLSerializer can be used to convert a DOM subtree or DOM document into text. 

	var canvas = document.createElement("canvas"); // Creating Canvas Element
	canvas.setAttribute("width",width+10); // Setting Attribute for Canvas Element
	canvas.setAttribute("height",height+10); // Setting Attribute for Canvas Element
	var ctx = canvas.getContext("2d"); //  HTMLCanvasElement.getContext() method returns a drawing context on the canvas
	// "2d", leading to the creation of a CanvasRenderingContext2D object representing a two-dimensional rendering context.
	
	var img = new Image(); // Creating Image Element

	img.onload = function() { // Once the image loads, execute this anonymous function
    ctx.drawImage( img, 5, 5 ); // Second and Third Parameters denote Position (x,y) within the canvas element
    
    var urlURL = canvas.toDataURL( "image/png" ); // returns a data URI containing a representation of the image in the format specified by the type parameter
	// (defaults to PNG). The returned image is in a resolution of 96 dpi.
	
	var a = document.createElement("a"); // Creating a Link Element
	document.body.appendChild(a);
	a.download = SVGelement.slice(1, SVGelement.length)+".png"; // Assigning value to the download attribute(file name).
	//The download property sets or returns the value of the download attribute of a link.
	//The download attribute specifies that the target will be downloaded when a user clicks on the hyperlink.
	
	a.href = urlURL; // Assigning desired URL to the link (anchor)
	a.click(); // Simulating a Mouse Click
	
	}

	img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData))); // Defining Source for the Image
	//  WindowOrWorkerGlobalScope.btoa() method creates a base-64 encoded ASCII string from a String object in which each character in the string is treated as a byte of binary data.
	
}
