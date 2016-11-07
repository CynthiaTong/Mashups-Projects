/* This js document is meant to be used for the Audio Wave project.
   The webpage called "Audio Wave" gets data from the soundCloud API.
   Audio streaming is done with Web Audio API, and visualization is done with D3.js. 
   This project mainly presents a visualization of the frequency data from each incoming soundtrack,
   with the accompaning search function and play/pause animation.  

   Created by Cynthia Tong in October, 2016. All rights reserved. 
*/

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
var controlBtn;
//songNum for counting color palette number, 
//trackNum for counting which track from the data array is played. 
var songNum, trackNum;
//spinner variable (controlled by spin.js)
var spinner;
//the title of soundtracks
var trackTitle;

//*** create the initial SVGs ***//
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

	//Create initial D3 Bar chart.
	svg.selectAll("rect")
	   .data(frequencyData)
	   .enter()
	   .append('rect')
	   .attr('x', function (d, i) {
	      return i * (w / frequencyData.length);
	   })
	   .attr('width', w / frequencyData.length - barPadding);

	//Create initial D3 Reflection Chart.
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
}

//assign bar color based on songNum
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
		return 'rgb(' + d + ',' + d + ', 0)';
	} 
}

//assign reflection color based on songNum
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
		return 'rgba(' + d + ',' + d + ', 0, 0.4)';
	} 
}

//*** hide chart after pause/next track/visualize button clicked ***//
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

//*** update the charts with frequencyData ***//
function updateChart() {
	
	requestAnimationFrame(updateChart);

   // Copy frequency data to frequencyData array.
	analyserNode.getByteFrequencyData(frequencyData);

	if (firstClick || !paused) {
   //Update d3 chart with new data.
		var rects = svg.selectAll('rect')
	      			   .data(frequencyData);

	    //visualize the bars 
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

	    //visualize the reflections 
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

//*** initialize the audio context ***//
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

	  		// $("#controlArea").show();

	  		gainNode = context.createGain();
			analyserNode = context.createAnalyser();

			//when sound is ready, playSound, change searchBtn text and activate searchBtn
	  		playSound();
	  		$("#searchBtn").html("Next Track"); 
	  		//assign the barChart fill color to searchButton 
	  		$("#searchBtn").css("background-color", function() {
	  			var color = assignColor(200);
	  			return color;
	  		});

			searchBtn.disabled = false;
    		$("#controlBtn").attr("disabled",false);
			//stop the spinner 
			spinner.stop();
		    displaySongTitle(trackTitle);

		}
	  });
	};

	request.send();
}

//set volume according to the volume bar 
function volumeControl() {
	document.getElementById("volume").addEventListener("change", function() {
    	gainNode.gain.value = this.value;
	});	
}

//*** when visualize or next track button clicked, play sound ***//
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

//*** when play button clicked, resume sound ***//
function resumeSound() {

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

//*** when pause button clicked, pause sound ***//
function stopSound() {
	source.stop(0);
	pausedAt = Date.now() - startedAt;
	
	paused = true;		
	console.log("Sound Paused");
}

//*** Get soundtrack data from soundCloud API ***//
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

  		if (tracks && tracks.length !== 0) {

			if (trackNum > tracks.length-1) {
				trackNum = 0;
			}

			console.log("track being played: " + trackNum);

			var requestUrl = tracks[trackNum].stream_url + clientUrl;
			console.log(requestUrl);

			makeAudioRequest(requestUrl);

			trackTitle = tracks[trackNum].title;
			trackNum ++;

  		}else {
  			alert("No search results. Please try another track.");
  		}

	});
}

//when new track is loaded, diplay its title 
function displaySongTitle(currentTrack) {

	console.log("current track:", currentTrack);
	$("#songTitle").html(currentTrack);
	$("#songTitle").css("color", function() {
  		var color = assignColor(200);
  		return color;
  	});

	setTimeout(function() {
		$("#songTitle").html("");
	}, 4500);
}

function isAlphaNum(str) {
    return /^[A-Za-z0-9\s]+$/.test(str);
}

$(document).ready(function() {

	$("#volume").hide();
    $("#controlBtn").attr("disabled","disabled");

	$("#volumeArea").hover(
		function() {
			$("#volume").fadeIn(800);
		},
		function() {
			$("#volume").fadeOut(800);
		}
	);

	//spinner options 
	var opts = {
		lines: 13, // The number of lines to draw
		length: 16, // The length of each line
		width: 10, // The line thickness
		radius: 30, // The radius of the inner circle
		scale: 1, // Scales overall size of the spinner
		corners: 1, // Corner roundness (0..1)
		color: "#FFF", // #rgb or #rrggbb or array of colors
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

	//spinner target: spinnerElement 
	var target = document.getElementById('spinnerElement');

	//initialize audio context
	initContext();
	
	//when user changes input 
    $("#userInput").keydown(function(event){ 

    	//when user presses enter key, trigger searchButton click 
        var keyCode = event.which;   
        if (keyCode == 13) $("#searchBtn").trigger("click");

        //when input changes, change searchButton text back to "visualize"
        $("#searchBtn").html("Visualize");
        $("#searchBtn").css("background-color", "#3399ff");
        $("#controlBtn").html("<img src='images/pauseIcon.png' width=50 height=50>");
        //check the track number back to 0 
        trackNum = 0;
    });  

	$("#searchBtn").click(function() {
		console.log("search button clicked");

		var input = $("#userInput").val();
		var searchBtnText = $("#searchBtn").html();

		if (isAlphaNum(input)) {

			searchBtn = this;
	        searchBtn.disabled = true;
	    
			songNum ++;

			if (songNum > 4) {
				songNum = 0;
			}
			console.log("Current User Input: " + input);

			//if not firstClick, stop sound, 
			//hide previous visualization and create new frequencyData
			if (!firstClick) {

				source.stop();
				//change the control button back to "pause" state 
				$("#controlBtn").html("<img src='images/pauseIcon.png' width=50 height=50>");
    			//disable play/pause until new soundtrack is loaded 
    			$("#controlBtn").attr("disabled","disabled");

				hideChart();
				frequencyData = new Uint8Array(0);

			} else {
				//if firstClick, set songNum to 0 
				songNum = 0;
			}

			paused = false;
			console.log("Current songNum: " + songNum);

			getSoundData(input); 

			//start spinner 
			spinner = new Spinner(opts).spin(target);

		}else {
			alert("Please enter a valid input (soundtrack or artist).");
		}
	});

	$("#controlBtn").click(function() {

		if (soundReady) {

			if (paused || firstClick) {
				$("#controlBtn").html("<img src='images/pauseIcon.png' width=50 height=50>");
				resumeSound();
			}else {
				$("#controlBtn").html("<img src='images/playIcon.png' width=60 height=40>");
				stopSound();
			}

		}
	});

	//hide the bar when the soundtrack ends. 
	if (soundReady) {
		source.onEnded(function() {
			console.log("Soundtrack ended!");
			hideChart();
		});
	}

});
