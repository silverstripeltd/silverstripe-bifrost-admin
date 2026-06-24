System.register(["./chunk-REUDOJLT.js", "react", "silverstripe-search-admin", "react-router-dom"], function (_export, _context) {
  "use strict";

  var c, r, n, k, o, g, e, p, f, v, b, a, h, u, D;
  return {
    setters: [function (_chunkREUDOJLTJs) {
      c = _chunkREUDOJLTJs.a;
      r = _chunkREUDOJLTJs.b;
    }, function (_react) {
      n = _react.default;
      o = _react.default;
      e = _react.default;
    }, function (_silverstripeSearchAdmin) {
      k = _silverstripeSearchAdmin.ForbiddenError;
      g = _silverstripeSearchAdmin.Logo;
    }, function (_reactRouterDom) {
      p = _reactRouterDom.Link;
    }],
    execute: function () {
      f = "searchbanner-module__banner_OzqzSa__100", v = "searchbanner-module__externalIcon_OzqzSa__100", b = "searchbanner-module__link_OzqzSa__100", a = {
        banner: f,
        externalIcon: v,
        link: b
      };
      h = () => o.createElement("div", {
        className: a.banner
      }, o.createElement(g, {
        className: a.title
      }), o.createElement("div", null, o.createElement("p", {
        className: a.text
      }, o.createElement("a", {
        className: a.link,
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://dashboard.silverstripe.cloud/search"
      }, "Silverstripe Search dashboard", o.createElement("svg", {
        className: a.externalIcon,
        width: "12",
        height: "12",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true"
      }, o.createElement("path", {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
      }), o.createElement("polyline", {
        points: "15 3 21 3 21 9"
      }), o.createElement("line", {
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3"
      })), o.createElement("strong", null, "The Silverstripe Search Dashboard")), " ", "is the new home for Silverstripe Search administration. Features include relevancy tuning, result curation, synonym management and query analytics.")));
      u = ({
        engines: s
      }) => {
        let l = s.map(({
          name: t,
          totalDocs: i
        }) => e.createElement("tr", {
          key: t,
          className: r.tr
        }, e.createElement("td", {
          className: r.td
        }, e.createElement(p, {
          to: `engine/${t}`
        }, t)), e.createElement("td", {
          className: r.td
        }, i), e.createElement("td", {
          className: r.td
        }, e.createElement(p, {
          to: `engine/${t}`
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
      _export("default", D = ({
        api: s
      }) => {
        let [l, t] = n.useState([]),
          [i, _] = n.useState(null);
        return n.useEffect(() => {
          s.getEngines().then(t).catch(d => {
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
        }, "Engines Overview ", n.createElement("hr", null)), n.createElement(h, null), i && n.createElement("div", {
          className: "alert alert-danger"
        }, i), n.createElement(u, {
          engines: l
        }));
      });
    }
  };
});