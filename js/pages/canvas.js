let canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");
c.fillStyle = "blue";
c.fillRect(100, 100, 100, 100);
c.fillStyle = "red";
c.fillRect(200, 100, 100, 100);
c.fillStyle = "green";
c.fillRect(100, 200, 100, 100);

c.beginPath();
c.moveTo(50, 300);
c.lineTo(300, 100);
c.lineTo(200, 100);
c.stroke();
c.stokeStyle = "blue";
c.closePath();


for (i = 0; i <= 100; i++) {
  let x = Math.random() * window.innerWidth;
  let y = Math.random() * window.innerHeight;
  c.beginPath();
  c.arc(300 + 10*i, 100 + 5 * i, 100, 0, Math.PI * 2, false);
  c.strokeStyle = "blue";
  c.stroke();
}

// BEGIN REAL PROGRAM

var mouse = {
  x: undefined,
  y: undefined
}

window.addEventListener('mousemove', function(e){
  mouse.x = e.x;
  mouse.y = e.y;
  console.log(mouse);
});

window.addEventListener('resize', function(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.maxRadius = maxRadius;
  this.color = color;

  this.draw = function(){
    c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
      // c.stroke();
  }

  this.update = function() {
    if(this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    } else if(this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.x += this.dx;
    this.y += this.dy;

    // interactivity
    if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      if( this.radius < this.maxRadius ) {
        // this.color = "blue";
        this.radius += 3;
      }
    } else if (this.radius > radius) {
      this.radius -= 3;
      // this.color = color;
    }

    this.draw();
  }

}

let circleArray = [];

for (i = 0; i < 500; i++) {
  var x = Math.random() * (window.innerWidth - radius * 2) + radius;
  var y = Math.random() * (window.innerHeight - radius * 2) + radius;
  var dx = (Math.random() - 0.5) * 10;
  var dy = (Math.random() - 0.5) * 10;
  var radius = 10;
  var maxRadius = 50;
  var colorTab = [
    "#D3D3D3",
    "#A1A1A1",
    "#878787",
    "#A4A4A4",
    "#545454"
  ];
  var randomColor = parseInt(Math.random() * 4);
  var color = colorTab[randomColor];
  // var color = "blue";
  circleArray.push(new Circle(x, y, dx, dy, radius, maxRadius, color));
}


function animate() {
  c.clearRect(0,0,window.innerWidth, window.innerHeight);
  requestAnimationFrame(animate);
  // circle.update();

  for (i= 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
}

requestAnimationFrame(animate);
