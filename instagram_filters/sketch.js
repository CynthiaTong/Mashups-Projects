var img;
var rectX = 1280;
var rectY = 100;
var w = 130;
var h = 40;
var smallScale;

function preload() {
	img = loadImage("landscape.jpg");
	smallImg = loadImage("landscape_copy.jpg");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(img);
	smallScale = windowWidth/smallImg.width;
	// console.log(smallScale);

	originalButton = createButton("Original Image");
	originalButton.position(rectX+3, rectY);
  	originalButton.mousePressed(function() {
  		noFilter();
  	});

  	grayButton = createButton('Gray');
  	grayButton.position(rectX+3, rectY+h);
  	grayButton.mousePressed(function() {
  		noFilter();
  		setFilters(GRAY);
  	});

  	brightButton = createButton('Brighter');
  	brightButton.position(rectX+3, rectY+2*h);
  	brightButton.mousePressed(function() {
		noFilter();
		brighten();
	});

	threshButton = createButton('Black & White');
  	threshButton.position(rectX+3, rectY+3*h);
  	threshButton.mousePressed(function() {
  		noFilter();
  		setFilters(THRESHOLD);
  	});

	pixelButton = createButton('Mozaic');
  	pixelButton.position(rectX+3, rectY+4*h);
  	pixelButton.mousePressed(function() {
		noFilter();
		mozaic();
	});

}

function draw() {
		// drawPixels();
}

function mozaic() {
	pixelDensity(1);
	smallImg.loadPixels();
	loadPixels();

	var index;
	var r,g,b, brightness;

	for (var x = 0; x < smallImg.width; x++) {
		for (var y = 0; y < smallImg.height; y++) {
			index = (x + y*smallImg.width)*4;

			r = smallImg.pixels[index];
			g = smallImg.pixels[index+1];
			b = smallImg.pixels[index+2];

			brightness = (r+g+b)/3;

			var w = map(brightness, 0, 255, 0, smallScale);
			// console.log(w);
			fill(r,g,b);
			// rect(x*smallScale, y*smallScale, w, w);
			// fill(brightness);
			stroke(255);
			rect(x*smallScale, y*smallScale, smallScale, smallScale);
		}
	}

}

function brighten() {

	pixelDensity(1);
	img.loadPixels();
	loadPixels();

	var index;
	var r,g,b;

	for (var x = 0; x < img.width; x++) {
		for (var y = 0; y < img.height; y++) {
			index = (x + y*img.width)*4;

			r = img.pixels[index];
			g = img.pixels[index+1];
			b = img.pixels[index+2];

			pixels[index] = r*1.2;
			pixels[index+1] = g*1.2;
			pixels[index+2] = b*1.2;
			pixels[index+3] = 255;
		}
	}
	updatePixels();
}

function noFilter() {
	background(img);
}

function setFilters(fill) {
	filter(fill);
}


function windowResized() {
	console.log("Window Resizing!");
	resizeCanvas(windowWidth, windowHeight);
	setup();
}
