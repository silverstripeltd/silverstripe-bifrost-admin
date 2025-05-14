//@pilet v:2(esbuildpr_landing,{})
System.register(["react", "react-router-dom", "silverstripe-search-admin"], function (_export, _context) {
  "use strict";

  var n, m, g, a, c, p, l;
  function r(t) {
    return {
      async getEngines() {
        let o = `${t.apiBase}/engines`,
          e = await fetch(o);
        if (!e.ok) {
          let i = await e.text();
          switch (e.status) {
            case 401:
            case 403:
              throw new c(e.status, "Action not allowed", i);
            default:
              throw new a(e.status, "Error with API request", i);
          }
        }
        try {
          return e.json();
        } catch (i) {
          let s = await e.text();
          throw new p(400, i.message, s);
        }
      }
    };
  }
  function J(t) {
    t.registerPage("/engine/:engineName", l), r({
      apiBase: t.meta.config.apiBase
    }).getEngines().then(e => {
      e.map(i => {
        t.registerTile(() => n.createElement("div", {
          className: "engine"
        }, n.createElement(m, {
          to: `engine/${i}`
        }, i), n.createElement("p", null, "Manage engine")), {
          initialColumns: 2,
          initialRows: 2
        });
      });
    }).catch(e => {
      console.error(e);
      let i = `Error fetching information about your search
                            subscription. Please check the module installation.`;
      e instanceof g && (i = "You do not have permission to access this content. Please check your permissions and/or API key configuration"), t.registerTile(() => n.createElement("div", {
        className: "engine"
      }, n.createElement("p", null, i)), {
        initialColumns: 2,
        initialRows: 2
      });
    });
  }
  _export("setup", J);
  return {
    setters: [function (_react) {
      n = _react.default;
    }, function (_reactRouterDom) {
      m = _reactRouterDom.Link;
    }, function (_silverstripeSearchAdmin) {
      g = _silverstripeSearchAdmin.ForbiddenError;
      a = _silverstripeSearchAdmin.ApiError;
      c = _silverstripeSearchAdmin.ForbiddenError;
      p = _silverstripeSearchAdmin.JsonError;
    }],
    execute: function () {
      l = n.lazy(() => _context.import("./Page-ASQYROCA.js"));
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