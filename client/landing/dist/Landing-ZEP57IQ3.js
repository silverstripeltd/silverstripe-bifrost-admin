System.register(["./chunk-REUDOJLT.js", "react", "silverstripe-search-admin", "react-router-dom"], function (_export, _context) {
  "use strict";

  var c, r, n, k, a, v, e, p, f, b, g, o, h, u, F;
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
      v = _silverstripeSearchAdmin.Logo;
    }, function (_reactRouterDom) {
      p = _reactRouterDom.Link;
    }],
    execute: function () {
      f = "searchbanner-module__banner_OzqzSa__100", b = "searchbanner-module__externalIcon_OzqzSa__100", g = "searchbanner-module__link_OzqzSa__100", o = {
        banner: f,
        externalIcon: b,
        link: g
      };
      h = () => a.createElement("div", {
        className: o.banner
      }, a.createElement(v, {
        className: o.title
      }), a.createElement("div", null, a.createElement("p", {
        className: o.text
      }, "The", " ", a.createElement("a", {
        className: o.link,
        target: "_blank",
        rel: "noopener noreferrer",
        href: "https://dashboard.silverstripe.cloud/search"
      }, a.createElement("strong", null, "Silverstripe Search Dashboard")), " ", "is the new home for Silverstripe Search administration. Features include relevancy tuning, result curation, synonym management and query analytics.")));
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
      _export("default", F = ({
        api: s
      }) => {
        let [l, t] = n.useState([]),
          [i, _] = n.useState(null);
        return n.useEffect(() => {
          s.getEngines().then(t).catch(m => {
            console.error(m);
            let d = `Error fetching information about your search
                                    subscription. Please check your module installation.`;
            if (m instanceof k) switch (m.code) {
              case 401:
                d = `Your API key does not have permission to access the service.
                                Please check that it is configured correctly.`;
                break;
              default:
                d = `You don't have permission to view this content.
                               Please check that you have the appropriate CMS permissions set.`;
            }
            _(n.createElement("div", {
              className: "engine"
            }, n.createElement("p", null, d)));
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