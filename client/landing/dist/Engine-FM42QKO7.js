System.register(["./chunk-REUDOJLT.js", "react"], function (_export, _context) {
  "use strict";

  var o, t, e, h, b;
  return {
    setters: [function (_chunkREUDOJLTJs) {
      o = _chunkREUDOJLTJs.a;
      t = _chunkREUDOJLTJs.b;
    }, function (_react) {
      e = _react;
    }],
    execute: function () {
      h = _ref => {
        let {
          rows: s
        } = _ref;
        return e.createElement("div", {
          className: t.container
        }, e.createElement("h3", {
          className: t.tableTitle
        }, "Engine schema"), e.createElement("table", {
          className: t.table
        }, e.createElement("thead", {
          className: t.thead
        }, e.createElement("tr", null, e.createElement("th", {
          className: t.th
        }, "Field name"), e.createElement("th", {
          className: t.th
        }, "Field type"))), e.createElement("tbody", {
          className: t.tbody
        }, s)));
      }, _export("default", b = _ref2 => {
        let {
          match: s,
          api: i
        } = _ref2;
        let r = s?.params?.engineName,
          [l, n] = e.useState(null),
          [c, m] = e.useState(null);
        e.useEffect(() => {
          r && i.getSchema(r).then(a => {
            n(a), m(null);
          }).catch(a => {
            n(null), m("Error loading schema");
          });
        }, [r]);
        let d = Object.keys(l ?? {}).map(a => {
          let p = l[a];
          return e.createElement("tr", {
            key: a,
            className: t.tr
          }, e.createElement("td", {
            className: `${t.code} ${t.td}`
          }, a), e.createElement("td", {
            className: t.td
          }, e.createElement("select", {
            className: t.select,
            name: "type",
            value: p,
            disabled: !0
          }, e.createElement("option", {
            value: "text"
          }, "text"), e.createElement("option", {
            value: "date"
          }, "date"), e.createElement("option", {
            value: "binary"
          }, "binary"), e.createElement("option", {
            value: "number"
          }, "number"))));
        });
        return e.createElement("div", {
          className: o.page
        }, e.createElement("h2", {
          className: o.title
        }, s.params.engineName, " ", e.createElement("hr", null)), c && e.createElement("div", {
          className: "danger"
        }, c), r && l && e.createElement(h, {
          rows: d
        }));
      });
    }
  };
});