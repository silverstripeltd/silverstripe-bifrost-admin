//@pilet v:2(esbuildpr_landing,{})
System.register(["react", "react-router-dom"], function (_export, _context) {
  "use strict";

  var i, a, p;
  function l(e) {
    e.registerPage("/engine/:engineName", p), e.getEngines().then(t => {
      t.map(n => {
        e.registerTile(() => i.createElement("div", {
          className: "engine"
        }, i.createElement(a, {
          to: `engine/${n}`
        }, n), i.createElement("p", null, "Manage engine")), {
          initialColumns: 2,
          initialRows: 2
        });
      });
    });
  }
  _export("setup", l);
  return {
    setters: [function (_react) {
      i = _react.default;
    }, function (_reactRouterDom) {
      a = _reactRouterDom.Link;
    }],
    execute: function () {
      p = i.lazy(() => _context.import("./Page-X5SQQDWR.js"));
      (function () {
        var d = document;
        var __bundleUrl__ = function () {
          try {
            throw new Error();
          } catch (t) {
            const e = ("" + t.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
            if (e) return e[0].replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^\/]+$/, "$1") + "/";
          }
          return "/";
        }();
        ["index.css"].forEach(cf => {
          ;
          var u = __bundleUrl__ + cf;
          var e = d.createElement("link");
          e.setAttribute('data-origin', "landing");
          e.type = "text/css";
          e.rel = "stylesheet";
          e.href = u;
          d.head.appendChild(e);
        });
      })();
    }
  };
});