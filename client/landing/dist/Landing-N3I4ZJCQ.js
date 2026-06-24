System.register(["./chunk-REUDOJLT.js", "react", "silverstripe-search-admin", "react-router-dom"], function (_export, _context) {
  "use strict";

  var c, r, n, k, a, g, e, p, b, f, v, i, h, u, W;
  return {
    setters: [function (_chunkREUDOJLTJs) {
      c = _chunkREUDOJLTJs.a;
      r = _chunkREUDOJLTJs.b;
    }, function (_react) {
      n = _react.default;
      a = _react.default;
      e = _react.default;
    }, function (_silverstripeSearchAdmin) {
      k = _silverstripeSearchAdmin.ForbiddenError;
      g = _silverstripeSearchAdmin.Logo;
    }, function (_reactRouterDom) {
      p = _reactRouterDom.Link;
    }],
    execute: function () {
      b = "searchbanner-module__banner_OzqzSa__100", f = "searchbanner-module__externalIcon_OzqzSa__100", v = "searchbanner-module__link_OzqzSa__100", i = {
        banner: b,
        externalIcon: f,
        link: v
      };
      h = () => a.createElement("div", {
        className: i.banner
      }, a.createElement(g, {
        className: i.title
      }), a.createElement("div", null, a.createElement("p", {
        className: i.text
      }, "Silverstripe Search is a managed service and actively under development. While we're working on a stand-alone dashboard, your engines can be managed here in the CMS"), a.createElement("a", {
        className: i.link,
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://dashboard.silverstripe.cloud/search"
      }, "Silverstripe Search dashboard", a.createElement("svg", {
        className: i.externalIcon,
        width: "12",
        height: "12",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true"
      }, a.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }), a.createElement("polyline", {
        points: "15 3 21 3 21 9"
      }), a.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
      }))), a.createElement("a", {
        className: i.link,
        href: "/admin/search-service"
      }, "Search indexing administration"), a.createElement("a", {
        className: i.link,
        target: "_blank",
        href: "https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/resources/guides/index.html"
      }, "Customer guides"), a.createElement("a", {
        className: i.link,
        target: "_blank",
        href: "https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/api/v1/docs"
      }, "API specification")));
      u = ({
        engines: t
      }) => {
        let l = t.map(({
          name: s,
          totalDocs: o
        }) => e.createElement("tr", {
          key: s,
          className: r.tr
        }, e.createElement("td", {
          className: r.td
        }, e.createElement(p, {
          to: `engine/${s}`
        }, s)), e.createElement("td", {
          className: r.td
        }, o), e.createElement("td", {
          className: r.td
        }, e.createElement(p, {
          to: `engine/${s}`
        }, e.createElement("i", {
          className: "font-icon-edit",
          "aria-label": "Edit"
        })))));
        return e.createElement("div", {
          className: r.container
        }, e.createElement("h3", {
          className: r.tableTitle
        }, "Engines"), e.createElement("table", {
          className: r.table
        }, e.createElement("thead", {
          className: r.thead
        }, e.createElement("tr", null, e.createElement("th", {
          className: r.th
        }, "Name"), e.createElement("th", {
          className: r.th
        }, "Document count"), e.createElement("th", {
          className: r.th
        }, "Actions"))), e.createElement("tbody", {
          className: r.tbody
        }, l)));
      };
      _export("default", W = ({
        api: t
      }) => {
        let [l, s] = n.useState([]),
          [o, _] = n.useState(null);
        return n.useEffect(() => {
          t.getEngines().then(s).catch(d => {
            console.error(d);
            let m = `Error fetching information about your search
                                    subscription. Please check your module installation.`;
            if (d instanceof k) switch (d.code) {
              case 401:
                m = `Your API key does not have permission to access the service.
                                Please check that it is configured correctly.`;
                break;
              default:
                m = `You don't have permission to view this content.
                               Please check that you have the appropriate CMS permissions set.`;
            }
            _(n.createElement("div", {
              className: "engine"
            }, n.createElement("p", null, m)));
          });
        }, []), n.createElement("div", {
          className: c.page
        }, n.createElement("h2", {
          className: c.title
        }, "Engines Overview ", n.createElement("hr", null)), n.createElement(h, null), o && n.createElement("div", {
          className: "alert alert-danger"
        }, o), n.createElement(u, {
          engines: l
        }));
      });
    }
  };
});