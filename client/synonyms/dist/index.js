//@pilet v:2(esbuildpr_synonyms,{})
System.register(["react", "silverstripe-search-admin", "react-router-dom"], function (_export, _context) {
  "use strict";

  var m, p, d, g, y, w, x, R, _, S, r, u, f;
  async function a(e) {
    if (!e.ok) {
      let n = await e.text();
      switch (e.status) {
        case 401:
        case 403:
          throw new d(e.status, "Action not allowed", n);
        default:
          throw new p(e.status, "Error with API request", n);
      }
    }
    try {
      return e.json();
    } catch (n) {
      let t = await e.text();
      throw new g(400, n.message, t);
    }
  }
  function l(e) {
    return {
      async getSynonyms(n) {
        let t = new URL(`${e.apiBase}/synonyms`, window.location.origin);
        t.searchParams.set("engine", n);
        let o = await fetch(t);
        return a(o);
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
        return a(s);
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
        return a(s);
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
        return a(s);
      }
    };
  }
  function z(e) {
    let n = l({
      apiBase: e.meta.config.apiBase
    });
    e.registerPage("/engine/:engineName/synonyms", t => m.createElement(f, {
      api: n,
      ...t
    })), e.registerExtension("engine-menu-item", u, {
      base: "/engine",
      slug: "synonyms",
      text: "Synonyms"
    });
  }
  _export("setup", z);
  return {
    setters: [function (_react) {
      m = _react;
      y = _react.default;
    }, function (_silverstripeSearchAdmin) {
      p = _silverstripeSearchAdmin.ApiError;
      d = _silverstripeSearchAdmin.ForbiddenError;
      g = _silverstripeSearchAdmin.JsonError;
    }, function (_reactRouterDom) {
      w = _reactRouterDom.NavLink;
      x = _reactRouterDom.useRouteMatch;
    }],
    execute: function () {
      R = "menuitem-module__expandContainer_Rln6eW__100", _ = "menuitem-module__selected_Rln6eW__100", S = "menuitem-module__title_Rln6eW__100", r = {
        expandContainer: R,
        selected: _,
        title: S
      };
      u = _ref => {
        let {
          params: {
            engine: e,
            base: n,
            slug: t,
            text: o
          }
        } = _ref;
        let i = [n, e, t].join("/"),
          c = x(i)?.isExact ?? !1;
        return y.createElement("li", {
          className: `${c && r.selected} ${r.expandContainer}`
        }, y.createElement(w, {
          exact: !0,
          to: i,
          activeClassName: r.selected,
          className: r.title
        }, o));
      };
      f = m.lazy(() => _context.import("./Page-6E76N7SD.js"));
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
        ["index.css", "Page-XAZGDAQO.css"].forEach(cf => {
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