//@pilet v:2(esbuildpr_landing,{})
System.register(["react", "silverstripe-search-admin", "react-router", "react-router-dom"], function (_export, _context) {
  "use strict";

  var d, F, g, x, f, a, J, Q, M, X, Y, c, A, H, l, P, Z, $, k, z, B, C, j, W, w, V, E, D, I, N, q, S, t, b, v, Ee, p, T, G;
  function y(i) {
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
        let n = `${i.apiBase}/schema?index=${s}`,
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
    let [s, n] = c.useState([]),
      [e, o] = c.useState(null);
    return c.useEffect(() => {
      i.getEngines().then(r => {
        n(r), o(null);
      }).catch(r => {
        console.error(r);
        let m = `Error fetching information about your search
                                        subscription. Please check the module installation.`;
        r instanceof A && (m = "You do not have permission to access this content. Please check your permissions and/or API key configuration"), o(m);
      });
    }, []), [s, e];
  }
  function De(i) {
    let s = y({
      apiBase: i.meta.config.apiBase
    });
    i.registerMenu("engines", () => d.createElement(p.Provider, {
      value: i.Extension
    }, d.createElement(v, {
      api: s
    })), {
      type: "general"
    }), i.registerPage("/", () => d.createElement(T, {
      api: s
    })), i.registerPage("/engine/:engineName", n => d.createElement(G, {
      ...n,
      api: s
    }));
  }
  _export("setup", De);
  return {
    setters: [function (_react) {
      d = _react.default;
      F = _react.createContext;
      a = _react.default;
      J = _react.useEffect;
      Q = _react.useState;
      M = _react.default;
      X = _react.useId;
      c = _react.default;
      l = _react.default;
      P = _react.useContext;
      Z = _react.useEffect;
      $ = _react.useId;
      k = _react.useState;
    }, function (_silverstripeSearchAdmin) {
      g = _silverstripeSearchAdmin.ApiError;
      x = _silverstripeSearchAdmin.ForbiddenError;
      f = _silverstripeSearchAdmin.JsonError;
      A = _silverstripeSearchAdmin.ForbiddenError;
    }, function (_reactRouter) {
      Y = _reactRouter.useRouteMatch;
      z = _reactRouter.useRouteMatch;
    }, function (_reactRouterDom) {
      H = _reactRouterDom.NavLink;
      B = _reactRouterDom.NavLink;
    }],
    execute: function () {
      C = () => M.createElement("svg", {
        width: "18",
        height: "14",
        viewBox: "0 0 18 14",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
      }, M.createElement("path", {
        d: "M9 0C4.02975 0 0 3.95905 0 8.8421C0 10.7454 0.612 12.5573 1.65375 14H16.3463C17.388 12.5573 18 10.7454 18 8.8421C18 3.95905 13.9703 0 9 0ZM8.4315 1.57684C8.6235 1.56211 8.814 1.55547 9 1.55547C9.186 1.55547 9.3765 1.56284 9.5685 1.57684V3.87211C9.3795 3.85221 9.189 3.84116 9 3.84116C8.811 3.84116 8.6205 3.85147 8.4315 3.87211V1.57684ZM4.10925 7.45537L1.94925 6.57632C2.067 6.22337 2.2125 5.87779 2.385 5.54547L4.54425 6.42379C4.359 6.75095 4.2135 7.09653 4.10925 7.45537ZM5.02125 5.72305L3.369 4.09979C3.61575 3.81758 3.885 3.55232 4.17225 3.31063L5.8245 4.93389C5.52825 5.16674 5.259 5.43126 5.02125 5.72305ZM5.616 2.35642C5.95275 2.18621 6.30525 2.04105 6.663 1.92463L7.56675 4.04305C7.203 4.14695 6.852 4.2921 6.51975 4.4741L5.616 2.35642ZM6.672 12.5263C6.68625 11.6782 7.1655 10.9421 7.87425 10.5575L9 5.36937L10.1265 10.5575C10.8337 10.9421 11.3145 11.6782 11.3287 12.5263H6.672ZM10.413 4.03716L11.3077 1.91579C11.667 2.03074 12.0188 2.17516 12.357 2.34389L11.4622 4.46453C11.13 4.28326 10.7775 4.14032 10.413 4.03716ZM12.1747 4.93389L13.827 3.31063C14.1143 3.55305 14.3835 3.81758 14.6302 4.09979L12.978 5.72305C12.741 5.43126 12.4718 5.16674 12.1747 4.93389ZM13.869 7.38021C13.7587 7.02432 13.6065 6.68021 13.4167 6.356L15.5618 5.44379C15.738 5.77168 15.8903 6.11579 16.0133 6.468L13.869 7.38021Z",
        fill: "#46536B"
      }));
      j = "menu-module__button_MDVWjq__100", W = "menu-module__engineItemList_MDVWjq__100", w = "menu-module__engineList_MDVWjq__100", V = "menu-module__expand_MDVWjq__100", E = "menu-module__expandContainer_MDVWjq__100", D = "menu-module__expanded_MDVWjq__100", I = "menu-module__icon_MDVWjq__100", N = "menu-module__list_MDVWjq__100", q = "menu-module__selected_MDVWjq__100", S = "menu-module__title_MDVWjq__100", t = {
        button: j,
        engineItemList: W,
        engineList: w,
        expand: V,
        expandContainer: E,
        expanded: D,
        icon: I,
        list: N,
        selected: q,
        title: S
      };
      b = _ref => {
        let {
          name: i
        } = _ref;
        let s = P(p),
          n = $(),
          e = z(`/engine/${i}`),
          o = e?.isExact ?? !1,
          [r, m] = k(!!e || o);
        return Z(() => {
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
      v = _ref2 => {
        let {
          api: i
        } = _ref2;
        let [s, n] = h(i),
          e = Y("/"),
          o = e?.isExact ?? !1,
          [r, m] = Q(!!e && !o),
          u = X(),
          L = s.map(_ => a.createElement("li", {
            key: _.name,
            className: `${t.item}`
          }, a.createElement(b, {
            name: _.name
          })));
        return J(() => {
          e && !o && m(!0);
        }, [e?.path, o]), a.createElement("div", null, a.createElement("div", {
          className: `${t.expandContainer} ${o ? t.selected : ""}`
        }, a.createElement("button", {
          className: `${t.button} `,
          onClick: () => m(!r),
          "aria-expanded": r,
          "aria-controls": u
        }, a.createElement("div", {
          className: `${t.expand} ${r ? t.expanded : ""}`
        }, "▶"), a.createElement("div", {
          className: t.icon
        }, a.createElement(C, null))), a.createElement(H, {
          exact: !0,
          to: "/",
          activeClassName: t.selected,
          className: t.title
        }, "Engines")), a.createElement("ul", {
          id: u,
          className: `${t.list} ${t.engineList} ${r ? t.expanded : ""}`
        }, n && a.createElement("p", {
          className: "error"
        }, n), L));
      };
      _export("styles", Ee = ["index.css"]), _export("PiralContext", p = F(null)), T = d.lazy(() => _context.import("./Landing-THM525UB.js")), G = d.lazy(() => _context.import("./Engine-FM42QKO7.js"));
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