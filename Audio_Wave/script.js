
//web audio api variables 
var context;
var audioBuffer;
var source;
var gainNode;
var analyserNode;
var frequencyData;

//sound control variables 
var soundReady = false;
var paused = false;
var stopped = false;
var firstClick = true;
var pausedAt, startedAt;

//SVGs 
var svg, w, h;
var svg2;

//visualize or next track button 
var searchBtn;

//songNum for counting color palette number, 
//trackNum for counting which track from the data array is played. 
var songNum, trackNum;

function createSVG() {
	frequencyData = new Uint8Array(200);
	// console.log(frequencyData);

	$('#container').html('');

	var w = $('#container').width();
	h = $('#container').height()/2;
	var barPadding = 2;

	svg = d3.select('#container')
		.append("svg")
		.attr("id", "svg")
		.attr("width", w)
		.attr("height", h);

	//Create our initial D3 chart.
	svg.selectAll("rect")
	   .data(frequencyData)
	   .enter()
	   .append('rect')
	   .attr('x', function (d, i) {
	      return i * (w / frequencyData.length);
	   })
	   .attr('width', w / frequencyData.length - barPadding);

	svg2 = d3.select("#container")
		.append("svg")
		.attr("id", "svg2")
		.attr("width", w)
		.attr("height", h);

	svg2.selectAll("rect")
	   .data(frequencyData)
	   .enter()
	   .append('rect')
	   .attr('x', function (d, i) {
	      return i * (w / frequencyData.length);
	   })
	   .attr('width', w / frequencyData.length - barPadding);

	updateChart();
	// updateLine();
}

function assignColor(d) {

	if (songNum === 0) {
		return 'rgb(' + d + ', 0,'+ d +')';
	} else if (songNum === 1) {
		return 'rgb(' + d + ', 0, 0)';
	} else if (songNum === 2) {
		return 'rgb(0,'  + d + ', 0)';
	} else if (songNum === 3) {
		return 'rgb(0,'  + d + ',' + d +')';
	} else if (songNum === 4) {
		return 'rgb(0, 0,' + d +')';
	} else if (songNum === 5) {
		return 'rgb(' + d + ',' + d + ', 0)';
	} 
}

function assignReflection(d) {

	if (songNum === 0) {
      	return 'rgba(' + d + ', 0,'+ d +', 0.4)';
	} else if (songNum === 1) {
		return 'rgba(' + d + ', 0, 0, 0.4)';
	} else if (songNum === 2) {
		return 'rgba(0,'  + d + ', 0, 0.4)';
	} else if (songNum === 3) {
		return 'rgba(0,'  + d + ',' + d +', 0.4)';
	} else if (songNum === 4) {
		return 'rgba(0, 0,' + d +', 0.4)';
	} else if (songNum === 5) {
		return 'rgba(' + d + ',' + d + ', 0, 0.4)';
	} 
}

function hideChart() {

	svg.selectAll('rect')
  		.transition()
		.attr("y", function(d){
			return h;
		})
		.attr("height", function(d){
			return 0;
		})
		.duration(1000);

	svg2.selectAll('rect')
  		.transition()
		.attr("y", function(d){
			return 0;
		})
		.attr("height", function(d){
			return 0;
		})
		.duration(1200);
}

function updateChart() {
	requestAnimationFrame(updateChart);

   // Copy frequency data to frequencyData array.
	analyserNode.getByteFrequencyData(frequencyData);

	if (firstClick || !paused) {
   //Update d3 chart with new data.
		var rects = svg.selectAll('rect')
	      			   .data(frequencyData);


	   	rects.attr("id", "rects")
	   		.attr("margin", "0")
	   		.attr('y', function(d) {
		        return h - d;
		    })
		    .attr('height', function(d) {
		         return d;
		    })
		    .attr('fill', function(d) {
		    	return assignColor(d);
		    });

		var reflections = svg2.selectAll('rect')
	      			   		  .data(frequencyData);

	   	reflections.attr("id", "reflections")
	   		.attr("margin", "0")
	   		.attr('y', function(d) {
		        return 0;
		    })
		    .attr('height', function(d) {
		         return d;
		    })
		    .attr('fill', function(d) {
		    	return assignReflection(d);
		    });
	  }
}

//initialize the audio context
function initContext() {
  try {
  	context = new window.AudioContext() || new window.webkitAudioContext();
  }
  catch(e) {
    alert("Web Audio API is not supported in this browser" + e);
  }
}

function makeAudioRequest(trackUrl) {
	var url = trackUrl;

	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	// Decode asynchronously
	request.onload = function() {
	  context.decodeAudioData(request.response, function(theBuffer) {
	  	audioBuffer = theBuffer;
	  	// console.log(audioBuffer);
	  	if (audioBuffer) {
	  		soundReady = true;
	  		console.log("Done Audio Request!");

	  		$("#controlArea").show();

	  		gainNode = context.createGain();
			analyserNode = context.createAnalyser();

	  		playSound();
	  		$("#searchBtn").html("Next Track"); 	
			searchBtn.disabled = false;	 
			spinner.stop();
		}
	  });
	};

	request.send();
}

function volumeControl() {
	document.getElementById("volume").addEventListener("change", function() {
    	gainNode.gain.value = this.value;
	});	
}

function playSound() {

	source = context.createBufferSource(); // creates a sound source
	//get the current sound volume 
	gainNode.gain.value = document.getElementById("volume").value;

  	source.connect(gainNode);
	gainNode.connect(analyserNode);
	analyserNode.connect(context.destination);

	source.buffer = audioBuffer;

	volumeControl();

	startedAt = Date.now();
	source.start(0);

	firstClick = false;

	createSVG();

}

function restartSound() {

	source = context.createBufferSource(); // creates a sound source
	//get the current sound volume 
	gainNode.gain.value = document.getElementById("volume").value;

  	source.connect(gainNode);
	gainNode.connect(analyserNode);
	analyserNode.connect(context.destination);

	source.buffer = audioBuffer;

	volumeControl();

	if (paused) {
		startedAt = Date.now() - pausedAt;
		source.start(0, pausedAt/1000);
	}

	paused = false;
}

function stopSound() {
	source.stop(0);
	pausedAt = Date.now() - startedAt;
	
	paused = true;		
	console.log("Sound Paused");
	//hideChart();
}

function getSoundData(searchWord) {
	console.log("Getting sound data");

	clientID = "98f18f7088398973c9090d2309d08568";
	var clientUrl = "?client_id=" + clientID;

	SC.initialize({
    	client_id: clientID,
  });

	SC.get('/tracks', {
      q: searchWord, 
    }).then(function(tracks) {
  		console.log(tracks);

  		if (tracks && tracks.length !== 0) {

  			// var num = getRandomInt(0, tracks.length-1);
  			if (trackNum > tracks.length-1) {
  				trackNum = 0;
  			}

  			console.log("track being played: "+ trackNum);
  			requestUrl = tracks[trackNum].stream_url + clientUrl;
  			console.log(requestUrl);
  			makeAudioRequest(requestUrl);
  			trackNum ++;

  		}else {
  			alert("No search results. Please try another track.");
  		}
	});
}

function isAlphaNum(str) {
    return /^[A-Za-z0-9\s]+$/.test(str);
}

var spinner;

$(document).ready(function() {

	// $("#controlArea").hide();
	// $("#volume").hide();

	// $("#volumeArea").hover(
	// 	function() {
	// 		$("#volume").fadeIn(800);
	// 	},
	// 	function() {
	// 		$("#volume").fadeOut(800);
	// 	}
	// );
	var opts = {
		lines: 13, // The number of lines to draw
		length: 18, // The length of each line
		width: 10, // The line thickness
		radius: 30, // The radius of the inner circle
		scale: 1, // Scales overall size of the spinner
		corners: 1, // Corner roundness (0..1)
		color: '#3399ff', // #rgb or #rrggbb or array of colors
		opacity: 0.25 ,// Opacity of the lines
		rotate: 0 ,// The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		speed: 1 ,// Rounds per second
		trail: 60, // Afterglow percentage
		fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		className: 'spinner', // The CSS class to assign to the spinner
		top: '50%', // Top position relative to parent
		left: '50%', // Left position relative to parent
		shadow: false, // Whether to render a shadow
		hwaccel: false ,// Whether to use hardware acceleration
		position: 'absolute' // Element positioning
		};
	var target = document.getElementById('spinnerElement');

	initContext();
	
	//when user changes input 
    $("#userInput").keydown(function(event){ 

    	//when user presses enter key, trigger searchButton click 
        var keyCode = event.which;   
        if (keyCode == 13) {
            $("#searchBtn").trigger("click");
            console.log("Enter Key Pressed!");
            }

        //when input changes, change searchButton text back to "visualize"
        $("#searchBtn").html("Visualize");
        //check the track number back to 0 
        trackNum = 0;
    });  

	$("#searchBtn").click(function() {
		console.log("search button clicked");

		var input = $("#userInput").val();

		if (isAlphaNum(input)) {

			searchBtn = this;
	        searchBtn.disabled = true;
	    
			songNum ++;

			if (songNum > 5) {
				songNum = 0;
			}
			console.log("Current User Input: " + input);

			if (!firstClick) {
				source.stop();
				hideChart();
				frequencyData = new Uint8Array(0);
				// $('#container').html('');
			} else {
				songNum = 0;
			}

			paused = false;
			console.log("Current songNum: " + songNum);
			getSoundData(input); 

			spinner = new Spinner(opts).spin(target);


		}else {
			alert("Please enter a valid input.");
		}
	});

	$("#controlBtn").click(function() {

		// console.log("control button clicked");
		if (soundReady) {

			if (paused || firstClick) {

				$("#controlBtn").html("<img src='/images/playIcon.png' width=60 height=40>");
				restartSound();
			}else {

				$("#controlBtn").html("<img src='/images/pauseIcon.png' width=50 height=50>");
				stopSound();
			}

		}
	});

});

//***  UNUSED CODE ***//

function updateLine() {
	requestAnimationFrame(updateLine);

	var xScale = d3.scale.linear()
    	.domain([0, frequencyData.length])
    	.range([0, w]);

	var yScale = d3.scale.linear()
	    .domain([0, 256])
	    .range([h, 0]);

	// var line = d3.svg.line()
	//    	.x(function(d, i) { 
	//    		// console.log(xScale(i));
	//    		return xScale(i); 
	//    	})
	//     .y(function(d, i) { 
	//     	// console.log(yScale(d));
	//     	return yScale(d); 
	//     })
	//     .interpolate("basis")
	//     ;

	// svg2.append("path")
	// 	.datum(frequencyData)
 //       	.attr("d", line)
	//     .attr("stroke", "black")
	//     .attr("stroke-width", 5)
	//     .attr("fill", "black");

	// svg.select("path")
 //    	.datum(frequencyData)
 //    	.attr("d", line);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
