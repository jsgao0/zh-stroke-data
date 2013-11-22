// Generated by LiveScript 1.2.0
(function(){
  $(function(){
    var interalOptions, demoMatrix, drawBackground, pathOutline, Word, drawElementWithWord, drawElementWithWords;
    interalOptions = {
      dim: 2150,
      trackWidth: 150
    };
    demoMatrix = [1, 0, 0, 1, 100, 100];
    drawBackground = function(ctx, dim){
      var x$;
      x$ = ctx;
      x$.strokeStyle = '#A33';
      x$.beginPath();
      x$.lineWidth = 10;
      x$.moveTo(0, 0);
      x$.lineTo(0, dim);
      x$.lineTo(dim, dim);
      x$.lineTo(dim, 0);
      x$.lineTo(0, 0);
      x$.stroke();
      x$.beginPath();
      x$.lineWidth = 2;
      x$.moveTo(0, dim / 3);
      x$.lineTo(dim, dim / 3);
      x$.moveTo(0, dim / 3 * 2);
      x$.lineTo(dim, dim / 3 * 2);
      x$.moveTo(dim / 3, 0);
      x$.lineTo(dim / 3, dim);
      x$.moveTo(dim / 3 * 2, 0);
      x$.lineTo(dim / 3 * 2, dim);
      x$.stroke();
      return x$;
    };
    pathOutline = function(ctx, outline){
      var i$, len$, path, results$ = [];
      for (i$ = 0, len$ = outline.length; i$ < len$; ++i$) {
        path = outline[i$];
        switch (path.type) {
        case 'M':
          results$.push(ctx.moveTo(path.x, path.y));
          break;
        case 'L':
          results$.push(ctx.lineTo(path.x, path.y));
          break;
        case 'C':
          results$.push(ctx.bezierCurveTo(path.begin.x, path.begin.y, path.mid.x, path.mid.y, path.end.x, path.end.y));
          break;
        case 'Q':
          results$.push(ctx.quadraticCurveTo(path.begin.x, path.begin.y, path.end.x, path.end.y));
        }
      }
      return results$;
    };
    Word = (function(){
      Word.displayName = 'Word';
      var prototype = Word.prototype, constructor = Word;
      function Word(options){
        this.options = $.extend({
          scales: {
            fill: 0.4,
            style: 0.25
          },
          updatesPerStep: 10,
          delays: {
            stroke: 0.25,
            word: 0.5
          },
          progress: null,
          url: "./",
          dataType: "json"
        }, options, internalOptions);
        this.matrix = [this.options.scales.fill, 0, 0, this.options.scales.fill, 0, 0];
        this.myCanvas = document.createElement('canvas');
        $(this.myCanvas).css('width', this.stylWidth() + "px").css('height', this.styleHeight() + "px");
        this.myCanvas.width = this.fillWidth();
        this.myCanvas.height = this.fillHeight();
        this.canvas = this.myCanvas;
      }
      prototype.init = function(){
        this.currentStroke = 0;
        this.currentTrack = 0;
        return this.time = 0.0;
      };
      prototype.width = function(){
        return this.options.dim;
      };
      prototype.height = function(){
        return this.options.dim;
      };
      prototype.fillWidth = function(){
        return this.width() * this.options.scales.fill;
      };
      prototype.fillHeight = function(){
        return this.height() * this.options.scales.fill;
      };
      prototype.styleWidth = function(){
        return this.fillWidth() * this.options.scales.style;
      };
      prototype.styleHeight = function(){
        return this.fillHeight() * this.options.scales.style;
      };
      prototype.drawBackground = function(canvas){
        var ctx;
        this.canvas = canvas
          ? canvas
          : this.myCanvas;
        ctx = this.canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, this.fillWidth(), this.fillHeight());
        return drawBackground(ctx, this.fillWidth());
      };
      prototype.draw = function(strokeJSON, canvas){
        var x$, this$ = this;
        this.init();
        this.strokes = strokeJSON;
        this.canvas = canvas
          ? canvas
          : this.myCanvas;
        x$ = this.canvas.getContext('2d');
        x$.strokeStyle = '#000';
        x$.fillStyle = '#000';
        x$.lineWidth = 5;
        requestAnimationFrame(function(){
          return this$.update();
        });
        return this.promise = $.Deferred();
      };
      prototype.update = function(){
        var ctx, stroke, x$, i$, to$, y$, delay, this$ = this;
        if (this.currentStroke >= this.strokes.length) {
          return;
        }
        ctx = this.canvas.getContext('2d');
        ctx.setTransform.apply(ctx, this.matrix);
        stroke = this.strokes[this.currentStroke];
        if (this.time === 0.0) {
          this.vector = {
            x: stroke.track[this.currentTrack + 1].x - stroke.track[this.currentTrack].x,
            y: stroke.track[this.currentTrack + 1].y - stroke.track[this.currentTrack].y,
            size: stroke.track[this.currentTrack].size || this.options.trackWidth
          };
          x$ = ctx;
          x$.save();
          x$.beginPath();
          pathOutline(ctx, stroke.outline);
          ctx.clip();
        }
        for (i$ = 0, to$ = this.options.updatesPerStep; i$ < to$; ++i$) {
          this.time += 0.02;
          if (this.time >= 1) {
            this.time = 1;
          }
          y$ = ctx;
          y$.beginPath();
          y$.arc(stroke.track[this.currentTrack].x + this.vector.x * this.time, stroke.track[this.currentTrack].y + this.vector.y * this.time, this.vector.size * 2, 0, 2 * Math.PI);
          y$.fill();
          if (this.time >= 1) {
            break;
          }
        }
        delay = 0;
        if (this.time >= 1.0) {
          ctx.restore();
          this.time = 0.0;
          this.currentTrack += 1;
        }
        if (this.currentTrack >= stroke.track.length - 1) {
          this.currentTrack = 0;
          this.currentStroke += 1;
          delay = this.options.delays.stroke;
        }
        if (this.currentStroke >= this.strokes.length) {
          if (!this.options.delays.word) {
            return this.promise.resolve();
          }
          return setTimeout(function(){
            return this$.promise.resolve();
          }, this.options.delays.word * 1000);
        } else {
          if (delay) {
            return setTimeout(function(){
              return requestAnimationFrame(function(){
                return this$.update();
              });
            }, delay * 1000);
          } else {
            return this.update();
          }
        }
      };
      return Word;
    }());
    drawElementWithWord = function(element, word, options){
      var stroker, $word, $loader, data;
      options || (options = {});
      stroker = new Word(options);
      $word = $('<div class="word"></div>');
      $loader = $('<div class="loader"><div style="width: 0"></div><i class="icon-spinner icon-spin icon-large icon-fixed-width"></i></div>');
      $word.append(stroker.canvas);
      $(element).append($word);
      data = WordStroker.utils.StrokeData({
        url: options.url,
        dataType: options.dataType
      });
      return {
        load: function(it){
          var promise;
          promise = it || $.Deferred();
          $word.append($loader);
          data.get(word.cp, function(json){
            $loader.remove();
            return promise.resolve({
              drawBackground: function(){
                return stroker.drawBackground();
              },
              draw: function(){
                return stroker.draw(json);
              },
              remove: function(){
                return $(stroker.canvas).remove();
              }
            });
          }, function(){
            $loader.remove();
            return promise.resolve({
              drawBackground: function(){
                return stroker.drawBackground();
              },
              draw: function(){
                var p;
                p = jQuery.Deferred();
                $(stroker.canvas).fadeTo('fast', 0.5, function(){
                  return p.resolve();
                });
                return p;
              },
              remove: function(){
                return $(stroker.canvas).remove();
              }
            });
          }, function(e){
            if (e.lengthComputable) {
              $loader.find('> div').css('width"', e.loaded / e.total * 100 + "%");
            }
            return promise.notifyWith(e, [e, word.text]);
          });
          return promise;
        }
      };
    };
    return drawElementWithWords = function(element, words, options){
      return WordStroker.utils.sortSurrogates(words).map(function(word){
        return drawElementWithWord(element, word, options);
      });
    };
  });
}).call(this);
