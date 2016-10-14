var r1,r2;
var xPos, yPos;
var vx, vy;
var astroObjs = [];

function setup() {
	createCanvas(windowWidth, windowHeight);
	xPos = windowWidth/2;
	yPos = windowHeight/2;
	vx = 20;
	vy = 20;
	r1 = 20;
	smooth();

	for (var i=0; i<20; i++) {
		var obj = new Astros();
		astroObjs.push(obj);
	}
}

function draw() {
	background(255, 153, 0);

	// drawEllipse();
	// updateSpeed();

	for (var i=0; i < astroObjs.length; i++) {
		astroObjs[i].drawEllipses();
		astroObjs[i].updatePositions();
	}
}

function drawEllipse(){
	noStroke();
	fill(255, 204, 0);
	ellipse(xPos, yPos, r1);
}

function updateSpeed(){
	xPos += vx;
	yPos += vy;

	if (xPos < r1 || xPos > windowWidth-r1){
		vx *= -1;
	}
	if (yPos < r1 || yPos > windowHeight-r1){
		vy *= -1;
	}
}

function Astros() {
	this.r1 = random(50,100);
	this.xPos = random(this.r1, windowWidth-this.r1);
	this.yPos = random(this.r1, windowHeight-this.r1);

	this.vx = random(5,10);
	this.vy = random(5,10);
}

Astros.prototype.drawEllipses = function() {
	noStroke();
	fill(255, 204, 0);
	ellipse(this.xPos, this.yPos, this.r1);
};

Astros.prototype.updatePositions = function() {
	this.xPos += this.vx;
	this.yPos += this.vy;

	if (this.xPos < this.r1/2 || this.xPos > (windowWidth-this.r1/2)) {
		this.vx *= -1;
	}
	if (this.yPos < this.r1/2 || this.yPos > (windowHeight-this.r1/2)) {
		this.vy *= -1;
	}
};

function mouseClicked(){
	console.log("mouse Clicked!");
	r1 *= 1.5;
}

function windowResized() {
	console.log("Window Resizing!");
	resizeCanvas(windowWidth, windowHeight);
}
