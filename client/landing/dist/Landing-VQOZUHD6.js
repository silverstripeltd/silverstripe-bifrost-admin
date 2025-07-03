System.register(["./chunk-REUDOJLT.js", "react", "silverstripe-search-admin", "react-router-dom"], function (_export, _context) {
  "use strict";

  var m, r, i, v, a, g, e, h, f, _, n, p, u, $;
  return {
    setters: [function (_chunkREUDOJLTJs) {
      m = _chunkREUDOJLTJs.a;
      r = _chunkREUDOJLTJs.b;
    }, function (_react) {
      i = _react.default;
      a = _react.default;
      e = _react.default;
    }, function (_silverstripeSearchAdmin) {
      v = _silverstripeSearchAdmin.ForbiddenError;
      g = _silverstripeSearchAdmin.Logo;
    }, function (_reactRouterDom) {
      h = _reactRouterDom.Link;
    }],
    execute: function () {
      f = "searchbanner-module__banner_OzqzSa__100", _ = "searchbanner-module__link_OzqzSa__100", n = {
        banner: f,
        link: _
      };
      p = () => a.createElement("div", {
        className: n.banner
      }, a.createElement(g, {
        className: n.title
      }), a.createElement("div", null, a.createElement("p", {
        className: n.text
      }, "Silverstripe Search is a managed service and actively under development. While we're working on a stand-alone dashboard, your engines can be managed here in the CMS"), a.createElement("a", {
        className: n.link,
        href: "/admin/search-service"
      }, "Search indexing administration"), a.createElement("a", {
        className: n.link,
        target: "_blank",
        href: "https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/resources/guides/index.html"
      }, "Customer guides"), a.createElement("a", {
        className: n.link,
        target: "_blank",
        href: "https://9595b293cf40d7532796c4ca67a27b81-bifrost.silverstripe.io/api/v1/docs"
      }, "API specification")));
      u = _ref => {
        let {
          engines: t
        } = _ref;
        let l = t.map(_ref2 => {
          let {
            name: s,
            totalDocs: o
          } = _ref2;
          return e.createElement("tr", {
            key: s,
            className: r.tr
          }, e.createElement("td", {
            className: r.td
          }, e.createElement(h, {
            to: `engine/${s}`
          }, s)), e.createElement("td", {
            className: r.td
          }, o), e.createElement("td", {
            className: r.td
          }, e.createElement(h, {
            to: `engine/${s}`
          }, e.createElement("i", {
            className: "font-icon-edit",
            "aria-label": "Edit"
          }))));
        });
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
      _export("default", $ = _ref3 => {
        let {
          api: t
        } = _ref3;
        let [l, s] = i.useState([]),
          [o, b] = i.useState(null);
        return i.useEffect(() => {
          t.getEngines().then(s).catch(d => {
            console.error(d);
            let c = `Error fetching information about your search
                                    subscription. Please check your module installation.`;
            d instanceof v && (c = "You do not have permission to access this content. Please check your permissions and/or API key configuration"), b(i.createElement("div", {
              className: "engine"
            }, i.createElement("p", null, c)));
          });
        }, []), i.createElement("div", {
          className: m.page
        }, i.createElement("h2", {
          className: m.title
        }, "Engines Overview ", i.createElement("hr", null)), i.createElement(p, null), o && i.createElement("div", {
          className: "alert alert-danger"
        }, o), i.createElement(u, {
          engines: l
        }));
      });
    }
  };
});