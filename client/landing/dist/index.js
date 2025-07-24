//@pilet v:2(esbuildpr_landing,{})
System.register(["react", "silverstripe-search-admin", "react-router", "react-router-dom"], function (_export, _context) {
  "use strict";

  var d, F, g, x, f, a, z, Y, M, J, G, u, k, O, l, A, P, Z, $, X, B, y, V, v, w, E, j, N, D, I, q, S, t, b, L, je, c, Q, U;
  function C(i) {
    return {
      async getEngines() {
        let s = `${i.apiBase}/engines`,
          n = await fetch(s);
        if (!n.ok) {
          let e = await n.text();
          switch (n.status) {
            case 401:
            case 403:
              throw new x(n.status, "Action not allowed", e);
            default:
              throw new g(n.status, "Error with API request", e);
          }
        }
        try {
          return n.json();
        } catch (e) {
          let o = await n.text();
          throw new f(400, e.message, o);
        }
      },
      async getSchema(s) {
        let n = `${i.apiBase}/schema?engine=${s}`,
          e = await fetch(n);
        if (!e.ok) {
          let o = await e.text();
          switch (e.status) {
            case 401:
            case 403:
              throw new x(e.status, "Action not allowed", o);
            default:
              throw new g(e.status, "Error with API request", o);
          }
        }
        try {
          return e.json();
        } catch (o) {
          let r = await e.text();
          throw new f(400, o.message, r);
        }
      }
    };
  }
  function h(i) {
    let [s, n] = u.useState([]),
      [e, o] = u.useState(null);
    return u.useEffect(() => {
      i.getEngines().then(r => {
        n(r), o(null);
      }).catch(r => {
        console.error(r);
        let m = `Error fetching information about your search
                                        subscription. Please check the module installation.`;
        r instanceof k && (m = "You do not have permission to access this content. Please check your permissions and/or API key configuration"), o(m);
      });
    }, []), [s, e];
  }
  function Ne(i) {
    let s = C({
      apiBase: i.meta.config.apiBase
    });
    i.registerMenu("engines", () => d.createElement(c.Provider, {
      value: i.Extension
    }, d.createElement(L, {
      api: s
    })), {
      type: "general"
    }), i.registerPage("/", () => d.createElement(Q, {
      api: s
    })), i.registerPage("/engine/:engineName", n => d.createElement(U, {
      ...n,
      api: s
    }));
  }
  _export("setup", Ne);
  return {
    setters: [function (_react) {
      d = _react.default;
      F = _react.createContext;
      a = _react.default;
      z = _react.useEffect;
      Y = _react.useState;
      M = _react.default;
      J = _react.useId;
      u = _react.default;
      l = _react.default;
      A = _react.useContext;
      P = _react.useEffect;
      Z = _react.useId;
      $ = _react.useState;
    }, function (_silverstripeSearchAdmin) {
      g = _silverstripeSearchAdmin.ApiError;
      x = _silverstripeSearchAdmin.ForbiddenError;
      f = _silverstripeSearchAdmin.JsonError;
      k = _silverstripeSearchAdmin.ForbiddenError;
    }, function (_reactRouter) {
      G = _reactRouter.useRouteMatch;
      X = _reactRouter.useRouteMatch;
    }, function (_reactRouterDom) {
      O = _reactRouterDom.NavLink;
      B = _reactRouterDom.NavLink;
    }],
    execute: function () {
      y = () => M.createElement("svg", {
        width: "18",
        height: "14",
        viewBox: "0 0 18 14",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, M.createElement("path", {
        d: "M9 0C4.02975 0 0 3.95905 0 8.8421C0 10.7454 0.612 12.5573 1.65375 14H16.3463C17.388 12.5573 18 10.7454 18 8.8421C18 3.95905 13.9703 0 9 0ZM8.4315 1.57684C8.6235 1.56211 8.814 1.55547 9 1.55547C9.186 1.55547 9.3765 1.56284 9.5685 1.57684V3.87211C9.3795 3.85221 9.189 3.84116 9 3.84116C8.811 3.84116 8.6205 3.85147 8.4315 3.87211V1.57684ZM4.10925 7.45537L1.94925 6.57632C2.067 6.22337 2.2125 5.87779 2.385 5.54547L4.54425 6.42379C4.359 6.75095 4.2135 7.09653 4.10925 7.45537ZM5.02125 5.72305L3.369 4.09979C3.61575 3.81758 3.885 3.55232 4.17225 3.31063L5.8245 4.93389C5.52825 5.16674 5.259 5.43126 5.02125 5.72305ZM5.616 2.35642C5.95275 2.18621 6.30525 2.04105 6.663 1.92463L7.56675 4.04305C7.203 4.14695 6.852 4.2921 6.51975 4.4741L5.616 2.35642ZM6.672 12.5263C6.68625 11.6782 7.1655 10.9421 7.87425 10.5575L9 5.36937L10.1265 10.5575C10.8337 10.9421 11.3145 11.6782 11.3287 12.5263H6.672ZM10.413 4.03716L11.3077 1.91579C11.667 2.03074 12.0188 2.17516 12.357 2.34389L11.4622 4.46453C11.13 4.28326 10.7775 4.14032 10.413 4.03716ZM12.1747 4.93389L13.827 3.31063C14.1143 3.55305 14.3835 3.81758 14.6302 4.09979L12.978 5.72305C12.741 5.43126 12.4718 5.16674 12.1747 4.93389ZM13.869 7.38021C13.7587 7.02432 13.6065 6.68021 13.4167 6.356L15.5618 5.44379C15.738 5.77168 15.8903 6.11579 16.0133 6.468L13.869 7.38021Z",
        fill: "#46536B"
      }));
      V = "menu-module__button_MDVWjq__100", v = "menu-module__engineItemList_MDVWjq__100", w = "menu-module__engineList_MDVWjq__100", E = "menu-module__expand_MDVWjq__100", j = "menu-module__expandContainer_MDVWjq__100", N = "menu-module__expanded_MDVWjq__100", D = "menu-module__icon_MDVWjq__100", I = "menu-module__list_MDVWjq__100", q = "menu-module__selected_MDVWjq__100", S = "menu-module__title_MDVWjq__100", t = {
        button: V,
        engineItemList: v,
        engineList: w,
        expand: E,
        expandContainer: j,
        expanded: N,
        icon: D,
        list: I,
        selected: q,
        title: S
      };
      b = ({
        name: i
      }) => {
        let s = A(c),
          n = Z(),
          e = X(`/engine/${i}`),
          o = e?.isExact ?? !1,
          [r, m] = $(!!e || o);
        return P(() => {
          (e || o) && m(!0);
        }, [e?.path, o]), l.createElement("div", null, l.createElement("div", {
          className: `${t.expandContainer} ${o ? t.selected : ""}`
        }, l.createElement("button", {
          className: `${t.button} `,
          onClick: () => m(!r),
          "aria-expanded": r,
          "aria-controls": n
        }, l.createElement("div", {
          className: `${t.expand} ${r ? t.expanded : ""}`
        }, "▶")), l.createElement(B, {
          exact: !0,
          to: `/engine/${i}`,
          activeClassName: t.selected,
          className: t.title
        }, i)), l.createElement("ul", {
          id: n,
          className: `${t.list} ${t.engineItemList} ${r ? t.expanded : ""}`
        }, l.createElement(s, {
          name: "engine-menu-item",
          params: {
            engine: i
          }
        })));
      };
      L = ({
        api: i
      }) => {
        let [s, n] = h(i),
          e = G("/"),
          o = e?.isExact ?? !1,
          [r, m] = Y(!!e && !o),
          p = J(),
          W = s.map(_ => a.createElement("li", {
            key: _.name
          }, a.createElement(b, {
            name: _.name
          })));
        return z(() => {
          e && !o && m(!0);
        }, [e?.path, o]), a.createElement("div", null, a.createElement("div", {
          className: `${t.expandContainer} ${o ? t.selected : ""}`
        }, a.createElement("button", {
          className: `${t.button} `,
          onClick: () => m(!r),
          "aria-expanded": r,
          "aria-controls": p
        }, a.createElement("div", {
          className: `${t.expand} ${r ? t.expanded : ""}`
        }, "▶"), a.createElement("div", {
          className: t.icon
        }, a.createElement(y, null))), a.createElement(O, {
          exact: !0,
          to: "/",
          activeClassName: t.selected,
          className: t.title
        }, "Engines")), a.createElement("ul", {
          id: p,
          className: `${t.list} ${t.engineList} ${r ? t.expanded : ""}`
        }, n && a.createElement("p", {
          className: "alert alert-danger"
        }, n), W));
      };
      _export("styles", je = ["index.css"]), _export("PiralContext", c = F(null)), Q = d.lazy(() => _context.import("./Landing-FHAKIDP2.js")), U = d.lazy(() => _context.import("./Engine-2V6OGWUN.js"));
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
        ["index.css", "Landing-TI3AEXYY.css", "Engine-2K3VNJ2E.css"].forEach(cf => {
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