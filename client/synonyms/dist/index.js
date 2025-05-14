//@pilet v:2(esbuildpr_synonyms,{})
System.register(["react", "silverstripe-search-admin"], function (_export, _context) {
  "use strict";

  var a, m, p, u, c;
  async function r(e) {
    if (!e.ok) {
      let n = await e.text();
      switch (e.status) {
        case 401:
        case 403:
          throw new p(e.status, "Action not allowed", n);
        default:
          throw new m(e.status, "Error with API request", n);
      }
    }
    try {
      return e.json();
    } catch (n) {
      let t = await e.text();
      throw new u(400, n.message, t);
    }
  }
  function y(e) {
    return {
      async getSynonyms(n) {
        let t = new URL(`${e.apiBase}/synonyms`, window.location.origin);
        t.searchParams.set("engine", n);
        let o = await fetch(t);
        return r(o);
      },
      async addSynonymRule(n, t) {
        let o = new URL(`${e.apiBase}/${n}/synonyms`, window.location.origin),
          i = new Request(o, {
            method: "POST",
            body: JSON.stringify(t),
            headers: {
              "Content-Type": "application/json"
            }
          }),
          s = await fetch(i);
        return r(s);
      },
      async updateSynonymRule(n, t) {
        let o = new URL(`${e.apiBase}/${n}/synonyms/${t.id}`, window.location.origin),
          i = new Request(o, {
            method: "PATCH",
            body: JSON.stringify(t),
            headers: {
              "Content-Type": "application/json"
            }
          }),
          s = await fetch(i);
        return r(s);
      },
      async deleteSynonymRule(n, t) {
        let o = new URL(`${e.apiBase}/${n}/synonyms/${t}`, window.location.origin),
          i = new Request(o, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            }
          }),
          s = await fetch(i);
        return r(s);
      }
    };
  }
  function f(e) {
    let n = y({
      apiBase: e.meta.config.apiBase
    });
    e.registerPage("/engine/:engineName/synonyms", t => a.createElement(c, {
      api: n,
      ...t
    }));
  }
  _export("setup", f);
  return {
    setters: [function (_react) {
      a = _react;
    }, function (_silverstripeSearchAdmin) {
      m = _silverstripeSearchAdmin.ApiError;
      p = _silverstripeSearchAdmin.ForbiddenError;
      u = _silverstripeSearchAdmin.JsonError;
    }],
    execute: function () {
      c = a.lazy(() => _context.import("./Page-6UU7USF7.js"));
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