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
      h = ({
        rows: r
      }) => e.createElement("div", {
        className: t.container
      }, e.createElement("h3", {
        className: t.tableTitle
      }, "Engine schema"), e.createElement("table", {
        className: t.table
      }, e.createElement("thead", null, e.createElement("tr", null, e.createElement("th", {
        className: t.th
      }, "Field name"), e.createElement("th", {
        className: t.th
      }, "Field type"))), e.createElement("tbody", {
        className: t.tbody
      }, r))), _export("default", b = ({
        match: r,
        api: m
      }) => {
        let s = r?.params?.engineName,
          [l, n] = e.useState(null),
          [c, i] = e.useState(null);
        e.useEffect(() => {
          s && m.getSchema(s).then(a => {
            n(a), i(null);
          }).catch(a => {
            n(null), i("Error loading schema");
          });
        }, [s]);
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
        }, r.params.engineName, " ", e.createElement("hr", null)), !s && e.createElement("div", {
          className: "alert alert-danger"
        }, "Could not find engine"), c && e.createElement("div", {
          className: "alert alert-danger"
        }, c), s && l && e.createElement(h, {
          rows: d
        }));
      });
    }
  };
});