(function($){
  $.fn.drawable = function(config){
    var defaults={
      lineColor: "#000000",
      lineWidth: 3,
      lineCap: 'round',
      lineJoin: 'round',
      saveImage: true,
      saveInterval: 1000
    }
    var options = $.extend(defaults, config);

    var Canvas = (function() {
      function Canvas(elem){
        this.jq = $(elem);
        this.saveTimer = null;
        this.name = this.jq.attr('name');

        var height = this.jq.outerHeight();
        var width = this.jq.outerWidth();

        this.canvas = $("<canvas>").attr('width', width).attr('height', height).css({
          position: 'absolute',
          width: width,
          height: height,
          left: this.jq.offset().left,
          top: this.jq.offset().top
        });
        this.jq.prepend(this.canvas);

        this.ctx = this.setupContext(this.canvas);
        this.loadSavedImage();
        this.mDown = false;

        var that = this;
        this.jq.on('mousedown touchstart', function(e){
          return that.drawStart(e, event);
        });
        this.jq.on('mousemove touchmove', function(e){
          that.drawMove(e, event);
        });
        this.jq.on('mouseup mouseleave touchend', function(e){
          that.drawEnd(e, event);
        });
      }

      Canvas.prototype.setupContext = function(canvas) {
        var ctx = canvas[0].getContext('2d');
        ctx.lineCap = defaults.lineCap;
        ctx.lineJoin = defaults.lineJoin;
        ctx.lineWidth = defaults.lineWidth;
        ctx.fillStyle = defaults.lineColor;
        ctx.strokeStyle = defaults.lineColor;
        return ctx;
      };

      Canvas.prototype.drawStart = function(e, event) {
        e.preventDefault();
        this.resetSaveTimer();
        this.mDown = true;
        offset = this.offsetPosition(e, event);

        this.ctx.beginPath();
        this.ctx.arc(offset.x, offset.y, this.ctx.lineWidth / 2.0, 0, Math.PI*2, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(offset.x, offset.y);

        return false;
      };

      Canvas.prototype.drawMove = function(e, event) {
        if(this.mDown === false)
          return;
        offset = this.offsetPosition(e, event);

        this.ctx.lineTo(offset.x, offset.y);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(offset.x, offset.y);
      }

      Canvas.prototype.drawEnd = function(e, event) {
        if(this.mDown === false)
          return;
        this.mDown = false;

        this.ctx.stroke();
        this.ctx.closePath();

        this.startSaveTimer();
      }

      Canvas.prototype.offsetPosition = function(e, event){
        var x = (e.pageX || event.touches[0].pageX) - this.jq.offset().left;
        var y = (e.pageY || event.touches[0].pageY) - this.jq.offset().top;

        return {x: x, y: y};
      }

      Canvas.prototype.loadSavedImage = function(){
        if(defaults.saveImage === false || !this.name)
          return;
        var that = this;

        src = localStorage[this.name];
        if(src){
          var image = new Image();
          image.src = src;
          $(image).on('load', function(){
            that.ctx.drawImage(this, 0, 0);
          });
        }
      }

      Canvas.prototype.startSaveTimer = function() {
        if(defaults.saveImage === false || !this.name)
          return;
        var that = this;

        this.saveTimer = setTimeout(function(){
          localStorage[that.name] = that.ctx.canvas.toDataURL();
        }, defaults.saveInterval);
      }

      Canvas.prototype.resetSaveTimer = function() {
        if(defaults.saveImage === false || !this.name || !this.saveTimer)
          return;
        clearTimeout(this.saveTimer);
      }

      return Canvas;
    })();

    this.each(function(){
      new Canvas(this);
    });

    return 0;
  };
})(jQuery);
