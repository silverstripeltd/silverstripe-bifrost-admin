System.register(["./chunk-REUDOJLT.js", "react", "silverstripe-search-admin", "react-router-dom"], function (_export, _context) {
  "use strict";

  var c, r, i, g, s, v, e, p, f, _, a, h, u, Y;
  return {
    setters: [function (_chunkREUDOJLTJs) {
      c = _chunkREUDOJLTJs.a;
      r = _chunkREUDOJLTJs.b;
    }, function (_react) {
      i = _react.default;
      s = _react.default;
      e = _react.default;
    }, function (_silverstripeSearchAdmin) {
      g = _silverstripeSearchAdmin.ForbiddenError;
      v = _silverstripeSearchAdmin.Logo;
    }, function (_reactRouterDom) {
      p = _reactRouterDom.Link;
    }],
    execute: function () {
      f = "searchbanner-module__banner_OzqzSa__100", _ = "searchbanner-module__link_OzqzSa__100", a = {
        banner: f,
        link: _
      };
      h = () => s.createElement("div", {
        className: a.banner
      }, s.createElement(v, {
        className: a.title
      }), s.createElement("div", null, s.createElement("p", {
        className: a.text
      }, "Silverstripe Search is a managed service and actively under development. While we're working on a stand-alone dashboard, your engines can be managed here in the CMS"), s.createElement("a", {
        className: a.link,
        href: "/admin/search-service"
      }, "Search indexing administration"), s.createElement("a", {
        className: a.link,
        target: "_blank",
        href: "https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/resources/guides/index.html"
      }, "Customer guides"), s.createElement("a", {
        className: a.link,
        target: "_blank",
        href: "https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/api/v1/docs"
      }, "API specification")));
      u = ({
        engines: o
      }) => {
        let l = o.map(({
          name: n,
          totalDocs: t
        }) => e.createElement("tr", {
          key: n,
          className: r.tr
        }, e.createElement("td", {
          className: r.td
        }, e.createElement(p, {
          to: `engine/${n}`
        }, n)), e.createElement("td", {
          className: r.td
        }, t), e.createElement("td", {
          className: r.td
        }, e.createElement(p, {
          to: `engine/${n}`
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
      _export("default", Y = ({
        api: o
      }) => {
        let [l, n] = i.useState([]),
          [t, b] = i.useState(null);
        return i.useEffect(() => {
          o.getEngines().then(n).catch(d => {
            console.error(d);
            let m = `Error fetching information about your search
                                    subscription. Please check your module installation.`;
            if (d instanceof g) switch (d.code) {
              case 401:
                m = `Your API key does not have permission to access the service.
                                Please check that it is configured correctly.`;
                break;
              default:
                m = `You don't have permission to view this content.
                               Please check that you have the appropriate CMS permissions set.`;
            }
            b(i.createElement("div", {
              className: "engine"
            }, i.createElement("p", null, m)));
          });
        }, []), i.createElement("div", {
          className: c.page
        }, i.createElement("h2", {
          className: c.title
        }, "Engines Overview ", i.createElement("hr", null)), i.createElement(h, null), t && i.createElement("div", {
          className: "alert alert-danger"
        }, t), i.createElement(u, {
          engines: l
        }));
      });
    }
  };
});