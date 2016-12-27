// Constants
var
COLS=26,
ROWS=26,

LEFT  = 0,
UP    = 1,
RIGHT = 2,
DOWN  = 3,

KEY_LEFT  = 37,
KEY_UP    = 38,
KEY_RIGHT = 39,
KEY_DOWN  = 40;

// IDs
var 
EMPTY=0,
SNAKE=1,
FRUIT=2;

//Objects
var
highscore = 0,
speed = 0,
canvas, //HTML Canvas
ctx, //Canvas Rendering Context 
frames, 
keystate; //Keyboard Input



var grid = {

	width: null, //the # of columns
	height: null, //the # of rows
	_grid: null,
	
	//initiate a grid with 'c' columns & 'r' rows, & then fill with 'd'
	init: function(d, c, r){
		this.width = c;
		this.height = r;	
		this._grid = [];
		
		for(var i=0; i<c; i++){
			this._grid.push([]);
			for(var j=0; j<r; j++){
				this._grid[i].push(d);
			}
		}
	},
	
	//Set value of the location @ (x,y)
	set: function(val, x, y){
		this._grid[x][y] = val;
	},
	
	//get the value of location (x,y)
	//return this value
	get: function(x, y){
		return this._grid[x][y];
	}
};

var snake = {

	direction: null, //direction of the snake
	last: null,	//pointer to the last element in the queue
	_queue: null, 
	
	//Clears queue, sets both starting position and direction
	init: function(d, x, y) {
		this.direction = d;
		this._queue = [];
		this.insert(x,y);
	},
	
	//Adds an element to the queue
	//unshift() method adds new items to the beginning of an array
	//unlike the push() method which adds new items to the end of an array 
	insert: function(x, y){
		this._queue.unshift({
			x:x, 
			y:y
		});
		this.last = this._queue[0];
	},
	
	//removes and returns the first element in the queue
	//pop() method returns last element in an array 
	remove: function() {
		return this._queue.pop();
	}
};

function setFood(){
	var empty = [];
	//Looping through the grid, find all empty cells
	//Once an empty cell is found, push it onto the array empty
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			if (grid.get(x, y) === EMPTY) {
				empty.push({x:x, y:y});
			}
		}
	}
	//Random location for food
	var temp = Math.round(Math.random()*(empty.length - 1));
	var randpos = empty[temp];
	grid.set(FRUIT, randpos.x, randpos.y);
}
function initialize() {
		// Register an event listener to
		// call the resizeCanvas() function each time 
		// the window is resized.
		window.addEventListener('resize', resizeCanvas, false);
		
		// Draw canvas border for the first time.
		resizeCanvas();
	}
// Display custom canvas.
	// In this case it's a blue, 5 pixel border that 
	// resizes along with the browser window.					
function redraw() {
	ctx.strokeStyle = 'blue';
	ctx.lineWidth = '5';
	ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}
// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window,
// then draws the new borders accordingly.
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	redraw();
}
//Start game
function main() {

	// Obtain a reference to the canvas element
	// using its id.
	canvas = document.createElement('canvas'),

  	// Obtain a graphics context on the
  	// canvas element for drawing.
  	ctx = canvas.getContext('2d');

	// Start listening to resize events and
	// draw canvas.
	initialize();

	//add canvas to body
	document.body.appendChild(canvas);
	
	//display font
	ctx.font = "10px Arial";
	
	frames=0; //initialize # of frames
	keystate = {};
	
	//keyboard input
	document.addEventListener("keydown", function(evt) {
		keystate[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete keystate[evt.keyCode];
	});

	//Does the user want to play? Difficulty? Initialize and loop.
	var start = true;
	speed = 5;
	if(start){
		/*
		var choose = prompt("Please choose a difficulty. Type EASY, NORMAL, or HARD");
		var difficulty = choose.toUpperCase();
		switch(difficulty){
			case "EASY": speed = 7; break;
			case "NORMAL": speed = 5; break;
			case "HARD": speed = 3; break;
			default: alert("Invalid entry. \nPlease refresh and try again."); break;
		}
		*/

		init();
		loop();
	}
}

//Initialize game 
function init() {

	score =0; //initialize score
	grid.init(EMPTY, COLS, ROWS);
	//snake starting position 
	var snakestart = {x:1, y:Math.floor(ROWS/2)};
	//snake starts with direction = RIGHT 
	snake.init(RIGHT, snakestart.x, snakestart.y);
	grid.set(SNAKE, snakestart.x, snakestart.y);
	setFood();
}

//Loop function 
function loop() {

	update();
	draw();
	window.requestAnimationFrame(loop, canvas);
} 

//Update function 
function update () {

	frames++; //increment frames value
	
	//Determines which direction the snake should go 
	if (keystate[KEY_LEFT]) {
		if(snake.direction !== RIGHT){
			snake.direction = LEFT;
		}
	}
	else if (keystate[KEY_UP]) {
		if(snake.direction !== DOWN){
			snake.direction = UP;
		}
	}
	else if (keystate[KEY_RIGHT]) {
		if(snake.direction !== LEFT){
			snake.direction = RIGHT;
		}
	}
	else if (keystate[KEY_DOWN]) {
		if(snake.direction !== UP){
			snake.direction = DOWN;
		}
	}
	
	//Speed value determines the speed of the snake 
	//The larger the value, the slower the snake 
	if(frames % speed === 0) {
		//Find the head of the snake 
		var nx = snake.last.x;
		var ny = snake.last.y;
		//Use snake direction to find new position of snake head
		switch (snake.direction){
			case LEFT:
				nx--;
				break;
			case UP:
				ny--;
				break;
			case RIGHT:
				nx++;
				break;
			case DOWN:
				ny++;
				break;
		}
	
		//Did the snake die? 
		//The snake can die by running into either the wall or itself 
		if (0 > nx || nx > grid.width-1  
			|| 0 > ny || ny > grid.height-1 
			|| grid.get(nx, ny) === SNAKE){
			
			//Is there a new highscore?
			if(score > highscore){ 
				highscore = score;
			}
			
			//Does the user want to play again?
			//If yes, initialize game.
			//If no, exit and tell them thanks for playing!

				return init();
		}
		
		//Did the snake eat the food? If so, add 1 to score and set new food.
		if (grid.get(nx, ny) === FRUIT) {
			score++;
			setFood();
		}
		//If the snake did not eat the food, remove it's last cell.
		else {
			var tail = snake.remove();
			grid.set(EMPTY, tail.x, tail.y);
		}
		//Insert cell into head of the snake at it's new position
		grid.set(SNAKE, nx, ny);
		snake.insert(nx,ny);
	}
}

//Draw the grid
function draw() {
	
	var tw = canvas.width/grid.width;
	var th = canvas.height/grid.height;
	//loop through and draw all cells in the grid 
	for (var x=0; x < grid.width; x++) {
		for (var y=0; y < grid.height; y++) {
			// fillStyle = color of cell 
			switch (grid.get(x, y)) {
				case EMPTY:
					ctx.fillStyle = "#FFFF00"; //yellow 
					break;
				case SNAKE:
					ctx.fillStyle = "#0000CC"; //blue 
					break;
				case FRUIT:
					ctx.fillStyle = "#FF0000"; //red 
					break;
			}
			ctx.fillRect(x*tw, y*th, tw, th);
		}
	}
	
	//Draw score, highscore, and difficulty to screen
	ctx.fillStyle = "#000";
	ctx.fillText("SCORE: " + score, 10, canvas.height-10);
	ctx.fillText("HIGH SCORE: " + highscore, 10, 10);
}

//start game 
main();











	
