//GLOBAL VARIABLES
var settings = {
  colWidth: 50.0,
  gutter: 100.0,
  space: 120.0,
  screenWidth: 360.0,
  screenHeight: 560.0,
  speed: 6.0,
  interval: 400,
  birdSpeed : 20.0,
  birdSize: 30,
  birdLeft: 80,
  jumpHeight: 25,
  $canvas: $('.canvas')
};

function Column(x,th) {
  this.topHeight = th;
  this.bottomHeight = settings.screenHeight - settings.gutter- this.topHeight;
  this.x = x;
}

Column.prototype.render = function() {
  //render the following html
  /*<div class="column">
      <div class="column-top"></div>
      <div class="column-bottom"></div>
    </div>*/

  var _this = this;

  if (_this.$elem) {
    _this.$elem.css('left', _this.x + 'px');
  }else {
    var $container = settings.$canvas,
        $column = $('<div class="column"></div>')
          .css('left', _this.x + 'px'),
        $topColumn = $('<div class="column-top"></div>')
          .height(_this.topHeight),
        $bottomColumn = $('<div class="column-bottom"></div>')
          .height(_this.bottomHeight);

    $column.append($topColumn)
      .append($bottomColumn);

    $container.append($column);
    _this.$elem = $column;
  }   
};

Column.prototype.move = function() {
  var _this = this;
  _this.x = _this.x - settings.speed;
  if( _this.x < -settings.colWidth) {
    _this.destroy();
  }else {
     _this.render();
  }
};

Column.prototype.destroy = function() {
  this.$elem.remove();
};

function Bird(height, position) {
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
  //<div class="bird"></div>
  var _this = this;

  if(_this.$elem){
     _this.$elem.css('bottom', _this.height + 'px');
  }else{
      $container = settings.$canvas,
      $bird = $('<div class="bird"></div>')
              .css({
                'bottom': _this.height + 'px',
                'left': _this.position + 'px'
              });
    $container.append($bird);
    _this.$elem = $bird;
  }
     

};

Bird.prototype.move = function() {
  var _this = this;
  _this.height -= settings.birdSpeed;
  _this.render();
};

Bird.prototype.jump = function() {
  var _this = this;
  _this.height += settings.jumpHeight;
  _this.render();
};

function Scene() {
  // this.randomTopHeight = function() {
  //   return Math.max(50, Math.random() * (settings.screenHeight - settings.gutter));
  // };

   var FIRST = 0,
     _this = this;
   this.cols = [];
      
  for(var i = FIRST; i < settings.screenWidth; i += (settings.space+settings.colWidth)) {
    var th = Scene.randomTopHeight();
        col = new Column(i, th);
    col.render();
    this.cols.push(col);
  }

  var bird = new Bird(settings.screenHeight/2, settings.birdLeft);
  bird.render();

  var intervalID = setInterval(function() {
    var last = _this.cols[_this.cols.length - 1],
        offset = _this.getOffset(last);
    

    if(bird.isCollided(_this.cols)) {
      alert("Hahaha, YOU DIE!");
      clearInterval(intervalID);
    }
    bird.move();

    if(offset >= 0){
      _this.addCol(offset);
    }

    $.each(_this.cols, function() {
      this.move();

    });
  }, settings.interval);

  $('body').keydown(function() {
    bird.jump();
  });
};

Scene.randomTopHeight = function() {
  return Math.max(50, Math.random() * (settings.screenHeight - settings.gutter));
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



(function() {
  var scene = new Scene();
})();

