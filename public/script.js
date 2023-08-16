let canvas = document.getElementById("cnvs");
canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;

var io = io.connect("http://localhost:5000");

let context = canvas.getContext("2d");

let x;
let y;

let mouseDown = false;

window.onmousedown = (e) => {
  context.moveTo(x, y);
  io.emit("down", { x, y });
  mouseDown = true;
};

window.onmouseup = (e) => {
  mouseDown = false;
};

io.on("ondraw", ({ x, y }) => {
  context.lineTo(x, y);
  context.stroke();
});

io.on("ondown", ({ x, y }) => {
  context.moveTo(x, y);
});

window.onmousemove = (e) => {
  x = e.clientX;
  y = e.clientY;
  // console.log({x,y})
  if (mouseDown) {
    io.emit("draw", { x, y });
    context.lineTo(x, y);
    context.stroke();
  }
};
