//外部スタイルシートでsvgなどを書き換えるスクリプト
//IE8非対応

function getStyles(styles) {
  var ret = [], selector = [], declaration = [] , cmtout_flag = null;
  var match = styles.match(/.*/gi).forEach(function(element) {
    var cmtstart_flag = element.match(/\/\*/);
    var cmtend_flag = element.match(/.*\*\/.*/gi);

    if (null !== cmtstart_flag) {
      cmtout_flag = cmtstart_flag[0];
    };
    if (null !== cmtend_flag) {
      cmtout_flag = null;
    };

    if (null === cmtout_flag) {
      var sl = element.match(/^([a-zA-Z]|[0-9]|#|\.|_|-|>|~|\+|\*|\[|\]|\"|\'|\$|\||\:|\(|\)|\s)*[{|,]{1}/gi);
      var dec = element.match(/background.*svg.*/gi);
      var endmark = element.match(/[^}]*}/gi);

      if (null !== sl) {
        selector.push(sl[0]);
      };

      if (null !== dec) {
        declaration.push(dec[0]);
      };

      if (null !== endmark) {
        if (0 < declaration.length) {
          ret.push(selector.join(" ")+declaration.join(" ").replace(/svg/gi, 'png')+"}")
        };

        selector = [];
        declaration = [];
      };
    };
  }); // end forEach

  return ret;
}

/* 外部スタイルシート（ルール）の取得 */
function replaceSVGtoPNG() {
  var root = getRoot(),
      stylesheet = []

  for (var i = document.styleSheets.length - 1; i >= 0; i--) {
    var href = document.styleSheets[i].href, append_style;

    $.ajax({
      url: href,
      cache: !1,
      async: !1
    })
    .done(function(styles) {
      append_style = getStyles(styles);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });

    console.log(append_style);
    for (var j = append_style.length - 1; j >= 0; j--) {
      document.styleSheets[i].insertRule(append_style[j], document.styleSheets[i].cssRules.length);
    };
  };

}
