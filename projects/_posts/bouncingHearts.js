var bubbles=[];


class Bubble {
	constructor(){
		this.x=mouseX;
		this.y=mouseY;
		var m=random(1);
		this.vx=sqrt(25/(1+m*m));
		this.vy=abs(this.vx*m);
		//pink rgb(255,105,180)
		//blue rgb(0,191,255)
		if(m>=0.5){
			this.r=255;
			this.g=105;
			this.b=180;	
		} else{
			this.r=0;
			this.g=191;
			this.b=255;
		}
	}
	move(){
		this.x=this.x+this.vx;
		this.y=this.y+this.vy;
		if (this.x>720-15) {
			this.vx=-this.vx;
			this.x=720-15;
		} else if(this.x<0+15 ){
			this.vx=-this.vx;
			this.x=0+15;
		}
		if (this.y>360-15) {
			this.vy=-this.vy;
			this.y=360-15;
		} else if(this.y<0+15){
			this.vy=-this.vy;
			this.y=0+15;
		}
	}
	show(){
		fill(this.r,this.g,this.b);
		//heart(this.x,this.y)
		ellipse(this.x,this.y,30,30)
	}

}
function distance(b1,b2){
	var dx=b1.x-b2.x;
	var dy=b1.y-b2.y;
	var d=sqrt(dx*dx+dy*dy);
	return d;
}

function bounce(b1,b2){
	var dx=b1.x-b2.x;
	var dy=b1.y-b2.y;
	var m=dy/dx;
	b1.vx=(abs(dx)/dx)*sqrt(25/(1+m*m));
	b1.vy=(abs(dy)/dy)*abs(b1.vx*m);
	b2.vx=-b1.vx;
	b2.vy=-b1.vy;
	var tr=b1.r;
	var tb=b1.b;
	var tg=b1.g;
	b1.r=b2.r;
	b1.b=b2.b;
	b1.g=b2.g;
	b2.r=tr;
	b2.b=tb;
	b2.g=tg;

}

function setup() {
	createCanvas(720, 360);
	background(250);
}

function heart(centerX,centerY){
	noStroke();
	ellipse(centerX-7.5,centerY,25,25);
	ellipse(centerX+7.5,centerY,25,25);
	triangle(centerX,centerY+35, centerX-20.5, centerY, centerX+20.5,centerY);
}


function draw() {
	background(250);
	for (var i=0;i<bubbles.length;i=i+1){
		bubbles[i].show();
		bubbles[i].move();
		for (var j=0;j<bubbles.length;j=j+1){
			if(i!=j && distance(bubbles[i],bubbles[j])<=30){
				bounce(bubbles[i],bubbles[j]);
			};
		};
	};
	textSize(20);
	fill(0);
	text("Bubbles count : "+bubbles.length,20,180);
}

function mousePressed(){
	bubble = new Bubble();
	bubbles.push(bubble);
}