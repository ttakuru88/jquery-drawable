(function($){
  $.fn.drawable = function(config){
    var defaults={
      lineColor: "#000000",
      lineWidth: 3,
      lineCap: 'round',
      lineJoin: 'round'
    }
    var options = $.extend(defaults, config);

    var Canvas = (function() {
      function Canvas(elem){
        this.jq = $(elem);
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
        this.mDown = false;

        var that = this;
        this.jq.on('mousedown', function(e){
          return that.drawStart(e);
        });
        this.jq.on('mousemove', function(e){
          that.drawMove(e);
        });
        this.jq.on('mouseup mouseleave', function(e){
          that.drawEnd(e);
        });
      }

      Canvas.prototype.setupContext = function(canvas) {
        ctx = canvas[0].getContext('2d');
        ctx.lineCap = defaults.lineCap;
        ctx.lineJoin = defaults.lineJoin;
        ctx.lineWidth = defaults.lineWidth;
        ctx.fillStyle = defaults.lineColor;
        ctx.strokeStyle = defaults.lineColor;
        return ctx;
      };

      Canvas.prototype.drawStart = function(e) {
        e.preventDefault();
        this.mDown = true;
        x = e.pageX - this.jq.offset().left;
        y = e.pageY - this.jq.offset().top;

        this.ctx.beginPath();
        this.ctx.arc(x, y, this.ctx.lineWidth / 2.0, 0, Math.PI*2, false);
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        return false;
      };

      Canvas.prototype.drawMove = function(e) {
        if(this.mDown === false)
          return;
        x = e.pageX - this.jq.offset().left;
        y = e.pageY - this.jq.offset().top;

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }

      Canvas.prototype.drawEnd = function(e) {
        if(this.mDown === false)
          return;
        this.mDown = false;

        this.ctx.stroke();
        this.ctx.closePath();
      }

      return Canvas;
    })();

    this.each(function(){
      new Canvas(this);
    });

    return 0;
  };
})(jQuery);