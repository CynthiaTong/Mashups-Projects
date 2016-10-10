var w;

function makeBarChart(dataset){
	//Get data about page
	var h = 400;
	var barPadding = 5;

	//Create SVG element
	var svg = d3.select("#container")
		.append("svg")
		// .attr("viewBox", "0 0 850 400");
		.attr("width", w)
		.attr("height", h);

	var dataLabel = [" Points", " Assists", " Rebounds", " Blocks", " Steals"];

	if (dataset[0] === "26.3") {
		svg.selectAll("rect")
		   .data(dataset)
		   .enter()
		   .append("rect")
		   .attr("x", function(d){
			// return w-d*10-barPadding;
			return w;
		   })
		   .attr("y", function(d, i){
		   	return i*(h/dataset.length) + barPadding/2;
		   })
		   .attr("width", function(d,i){
		   	return 0;
		   	// return d*10;
		   })
		   .attr("height", function(d,i){
		   	return h/dataset.length-barPadding;
		   })
		   .attr("class", "JamesData")
		   .transition()
			.attr("x", function(d,i){
				return w-d*10-barPadding;
			})
			.attr("width", function(d,i){
				return d*10;
			})
			.duration(1500)
			;

		svg.selectAll("text")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d, i) {
				return d.toString()+dataLabel[i];
			})
			.attr("text-anchor", "middle")
			.attr("x", function(d) {
				return w - (d*10+65);
				// return w;
			})
			.attr("y", function(d,i) {
				// return h - d.day + 20;
				return i * (h / dataset.length) + (h / dataset.length - barPadding) / 2;

			})
			.attr("class", "dataText")
			.attr("fill", "black");
		} 

	if (dataset[0] === "23.7") {
		svg.selectAll("rect")
		   .data(dataset)
		   .enter()
		   .append("rect")
		   .attr("x", function(d){
			return 0;
		   })
		   .attr("y", function(d, i){
		   	return i*(h/dataset.length) + barPadding/2;
		   })
		   .attr("width", function(d,i){
		   	return 0;
		   	// return d*10;
		   })
		   .attr("height", function(d,i){
		   	return h/dataset.length-barPadding;
		   })
		   .attr("class", "CurryData")
		   .transition()
			// .attr("x", function(d,i){
			// 	return w-d*10-barPadding;
			// })
			.attr("width", function(d,i){
				return d*10;
			})
			.duration(1500)
			;

		svg.selectAll("text")
			.data(dataset)
			.enter()
			.append("text")
			.text(function(d,i) {
				return d.toString()+dataLabel[i];
			})
			.attr("text-anchor", "middle")
			.attr("x", function(d) {
				return d*10+60;
				// return w;
			})
			.attr("y", function(d,i) {
				// return h - d.day + 20;
				return i * (h / dataset.length) + (h / dataset.length - barPadding) / 2;

			})
			.attr("class", "dataText")
			.attr("fill", "black");
		}

}

function requestNBAData(){
	var sportsFeedUrl = "https://www.mysportsfeeds.com/api/feed/pull/nba/2016-playoff/cumulative_player_stats.json";

	$.ajax({
		url: sportsFeedUrl,
		type: "GET",
		dataType: "jsonp", 
		error: function(err){
			console.log("Error getting data!");
			console.log(err);
		},
		success: function(data){
			// console.log(data);

			var playersData = data.cumulativeplayerstats.playerstatsentry;
			// console.log(playersData);

			var JamesData, CurryData;

			$.each(playersData, function(i, v) {
			    if (v.player.ID === "9158") {
			        JamesData = v;
			    	console.log(JamesData);

			   } else if (v.player.ID === "9218"){
			   		CurryData = v;
			   		console.log(CurryData);
			   }
			});

			var JamesCoreData = getCoreData(JamesData);
			var CurryCoreData = getCoreData(CurryData);

			makeBarChart(JamesCoreData);
			makeBarChart(CurryCoreData);

		}
	});
}


function getCoreData(data){
	var coreData = [];
	coreData[coreData.length] = (data.stats.PtsPerGame["#text"]);
	coreData[coreData.length] = (data.stats.AstPerGame["#text"]);
	coreData[coreData.length] = (data.stats.RebPerGame["#text"]);
	coreData[coreData.length] = (data.stats.BlkPerGame["#text"]);
	coreData[coreData.length] = (data.stats.StlPerGame["#text"]);

	return coreData;
}


$(document).ready(function(){
	w = $(window).width()/2;

	$(window).resize(function() {
		w = $(window).width()/2;
	});
	requestNBAData();
});