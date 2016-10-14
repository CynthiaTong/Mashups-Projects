var r1,r2;
var x;
var x1, x2;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// background(255, 153, 0);
}

function draw() {
	background(255, 153, 0);

	r1 = (windowWidth-mouseX)/8;
	r2 = mouseX/8;

	if (mouseIsPressed) {
		console.log("mouse Clicked!");
		r1 *= 2;
		r2 *= 2;
	}

	x = 100;
	x1 = mouseX+x;
	x2 = mouseX-x;

	noStroke();
	fill(255, 204, 0);
	ellipse(x1, windowHeight/2, r1);
	fill(255);
	ellipse(x2, windowHeight/2, r2);

}

// function mousePressed() {
// 	console.log("mouse Clicked!");
// 	r1 *= 2;
// 	r2 *= 1.5;
// }

function windowResized() {
	console.log("Window Resizing!");
	resizeCanvas(windowWidth, windowHeight);
}
