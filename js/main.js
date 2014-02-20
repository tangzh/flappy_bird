//GLOBAL VARIABLES
var settings = {
  colWidth: 50.0,
  gutter: 100.0,
  space: 120.0,
  screenWidth: 360.0,
  screenHeight: 560.0,
  speed: 4.0,
  interval: 100,
  birdSpeed : 20.0,
  birdSize: 30,
  birdLeft: 80,
  jumpHeight: 25,
  ctx: document.getElementById('canvas').getContext('2d')
};

function Column(x,th) {
  this.topHeight = th;
  this.bottomHeight = settings.screenHeight - settings.gutter- this.topHeight;
  this.x = x;
}

Column.prototype.render = function() {
  var _this = this;

  var ctx = settings.ctx;
  
  ctx.fillStyle = "green";
  //draw the top part
  ctx.fillRect(_this.x, 0, settings.colWidth, _this.topHeight);

  //draw the bottom part
  ctx.fillRect(_this.x, settings.screenHeight - _this.bottomHeight, settings.colWidth, _this.bottomHeight);
};

Column.prototype.move = function() {
  var _this = this;
  _this.x -= settings.speed;
};

function Bird(height, position) {
  //height: bottom
  //position: left
  this.height = height;
  this.position = position;
}

Bird.prototype.isCollided = function(cols) {
  var _this = this;
  if(_this.height <= 0) return true;
  else{
    for(var i=0;cols[i];i++) {
        var tooLow = _this.height <= cols[i].bottomHeight,
            tooHigh = _this.height >= cols[i].bottomHeight + settings.gutter - settings.birdSize,
            sameX = ((cols[i].x - settings.birdSize) <= _this.position) && (_this.position <= cols[i].x + settings.colWidth);

        if((tooHigh || tooLow) && sameX) {
           return true;
        }
    }
    return false;
  }
};

Bird.prototype.render = function() {
  var cx = this.position + settings.birdSize / 2,
      cy = settings.screenHeight - settings.birdSize / 2 - this.height,
      startAngle = 0;
      endAngle = 2 * Math.PI;
      ctx = settings.ctx;

  ctx.fillStyle = 'yellow';
  ctx.arc(cx, cy, settings.birdSize / 2, startAngle, endAngle);
  ctx.fill();
};

Bird.prototype.move = function() {
  var _this = this;
  _this.height -= settings.birdSpeed;
};

Bird.prototype.jump = function() {
  var _this = this;
  _this.height += settings.jumpHeight;
  _this.render();
};

function Scene() {
   var _this = this;
   
   _this.initCols();

  var bird = new Bird(settings.screenHeight/2, settings.birdLeft);

  var intervalID = setInterval(function() {
    var last = _this.cols[_this.cols.length - 1],
        offset = _this.getOffset(last);
    
    // if(bird.isCollided(_this.cols)) {
    //   alert("Hahaha, YOU DIE!");
    //   clearInterval(intervalID);
    // }

    _this.render(_this.cols, bird);
    

    if(offset >= 0){
      _this.addCol(offset);
    }

    _this.moveCols();
    bird.move();

  }, settings.interval);

  $('body').keydown(function() {
    bird.jump();
  });
};

Scene.randomTopHeight = function() {
  var h = Math.max(50, Math.random() * (settings.screenHeight - settings.gutter));
  return h;
};

Scene.clear = function() {
  settings.ctx.clearRect(0, 0, settings.screenWidth, settings.screenHeight);
};

Scene.prototype.getOffset = function(last) {
  var rightEdge = last.x + settings.colWidth,
      rightDis = settings.screenWidth - rightEdge;

  return settings.space - rightDis;
};

Scene.prototype.addCol = function(offset) {
  var _this = this,
      th = Scene.randomTopHeight(),
      col = new Column(settings.screenWidth + offset, th);

  col.render();
  _this.cols.push(col);
};

Scene.prototype.render = function(cols, bird) {
  //clear the canvas;
  Scene.clear();

  for (var i=0;cols[i];i++) {
    cols[i].render();
  }
  bird.render();
};

Scene.prototype.initCols = function() {
  var _this = this,
      first = 0,
      x = first;

  this.cols = [];

  for(var x = first; x < settings.screenWidth; x += (settings.space + settings.colWidth)) {
    var th = Scene.randomTopHeight();
    this.cols.push(new Column(x, th));
  }
};

Scene.prototype.moveCols = function() {
  var _this = this,
      tempCols = [];

  $.each(_this.cols, function() {
    this.move();
  });
  
  //Remove the cols that out of the canvas
  $.each(_this.cols, function(i, col) {
    if (col.x >= -settings.colWidth) {
      tempCols.push(col);
    }
  });

  _this.cols = tempCols;
};


(function() {
  var scene = new Scene();
})();

