// Generated by LiveScript 1.3.1
(function(){
  var ref$;
  (ref$ = String.prototype).codePointAt == null && (ref$.codePointAt = function(pos){
    var str, code, next;
    pos == null && (pos = 0);
    str = String(this);
    code = str.charCodeAt(pos);
    if (0xD800 <= code && code <= 0xDBFF) {
      next = str.charCodeAt(pos + 1);
      if (0xDC00 <= next && next <= 0xDFFF) {
        return (code - 0xD800) * 0x400 + (next - 0xDC00) + 0x10000;
      }
    }
    return code;
  });
  (ref$ = String.prototype).sortSurrogates == null && (ref$.sortSurrogates = function(){
    var str, txt, results$ = [];
    str = String(this);
    while (str.length) {
      if (/[\uD800-\uDBFF]/.test(str[0])) {
        txt = str.substr(0, 2);
        str = str.substr(2);
      } else {
        txt = str.substr(0, 1);
        str = str.substr(1);
      }
      results$.push(txt);
    }
    return results$;
  });
}).call(this);
