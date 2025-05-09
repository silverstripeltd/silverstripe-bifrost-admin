//@pilet v:2(esbuildpr_synonyms,{})
System.register(["react"], function (_export, _context) {
  "use strict";

  var i, y;
  function a(t) {
    return {
      async getSynonyms(n) {
        let e = new URL(`${t.apiBase}/synonyms`, window.location.origin);
        return e.searchParams.set("engine", n), (await fetch(e)).json();
      },
      async addSynonymRule(n, e) {
        let s = new URL(`${t.apiBase}/${n}/synonyms`, window.location.origin),
          o = new Request(s, {
            method: "POST",
            body: JSON.stringify(e),
            headers: {
              "Content-Type": "application/json"
            }
          });
        return (await fetch(o)).json();
      },
      async updateSynonymRule(n, e) {
        let s = new URL(`${t.apiBase}/${n}/synonyms/${e.id}`, window.location.origin),
          o = new Request(s, {
            method: "PATCH",
            body: JSON.stringify(e),
            headers: {
              "Content-Type": "application/json"
            }
          });
        return (await fetch(o)).json();
      },
      async deleteSynonymRule(n, e) {
        let s = new URL(`${t.apiBase}/${n}/synonyms/${e}`, window.location.origin),
          o = new Request(s, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            }
          });
        return (await fetch(o)).json();
      }
    };
  }
  function d(t) {
    let n = a({
      apiBase: t.meta.config.apiBase
    });
    t.registerPage("/engine/:engineName/synonyms", e => i.createElement(y, {
      api: n,
      ...e
    }));
  }
  _export("setup", d);
  return {
    setters: [function (_react) {
      i = _react;
    }],
    execute: function () {
      y = i.lazy(() => _context.import("./Page-HQ73IIVS.js"));
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
          e.setAttribute('data-origin', "synonyms");
          e.type = "text/css";
          e.rel = "stylesheet";
          e.href = u;
          d.head.appendChild(e);
        });
      })();
    }
  };
});