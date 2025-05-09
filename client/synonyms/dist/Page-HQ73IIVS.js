System.register(["react", "react-modal", "formik"], function (_export, _context) {
  "use strict";

  var n, R, k, u, T, I, e, g, F, A, x, d, N, M, h, V, S, C, E, Z;
  return {
    setters: [function (_react) {
      n = _react;
      R = _react.useEffect;
      k = _react.useState;
      u = _react.default;
      T = _react.useState;
      e = _react.default;
      d = _react.default;
      N = _react.useState;
    }, function (_reactModal) {
      I = _reactModal.default;
      M = _reactModal.default;
    }, function (_formik) {
      g = _formik.ErrorMessage;
      F = _formik.Field;
      A = _formik.Form;
      x = _formik.Formik;
    }],
    execute: function () {
      h = "TYPE_DIRECTIONAL", V = "TYPE_EQUIVALENT", S = _ref => {
        let {
          onSubmit: m,
          initialValues: a = {
            type: V,
            root: "",
            synonyms: ""
          }
        } = _ref;
        return e.createElement(x, {
          initialValues: a,
          onSubmit: m
        }, _ref2 => {
          let {
            values: i,
            isSubmitting: r
          } = _ref2;
          return e.createElement(A, null, e.createElement("label", null, "Select Type:", e.createElement(F, {
            as: "select",
            name: "type"
          }, e.createElement("option", {
            value: V
          }, "equivalent"), e.createElement("option", {
            value: h
          }, "directional")), e.createElement(g, {
            name: "type"
          })), i.type === h ? e.createElement("label", null, "Root words (one word per line):", e.createElement(F, {
            as: "textarea",
            name: "root"
          }), e.createElement(g, {
            name: "root"
          })) : null, e.createElement("label", null, "Synonyms (one word per line):", e.createElement(F, {
            as: "textarea",
            name: "synonyms"
          }), e.createElement(g, {
            name: "synonyms"
          })), "id" in i ? e.createElement(F, {
            as: "hidden",
            name: "id"
          }) : null, e.createElement("button", {
            type: "submit",
            disabled: r
          }, r ? "Adding.." : "Submit"));
        });
      };
      C = _ref3 => {
        let {
          add: m,
          onClose: a
        } = _ref3;
        let [i, r] = T(!1);
        return u.createElement(u.Fragment, null, u.createElement("button", {
          className: "btn btn-info",
          onClick: () => r(!i)
        }, "Add synonym"), u.createElement(I, {
          isOpen: i,
          onRequestClose: () => r(!1),
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, u.createElement("h3", null, "Add a synonym"), u.createElement(S, {
          onSubmit: (l, _ref4) => {
            let {
              setSubmitting: t
            } = _ref4;
            let p = l.type,
              f = l.synonyms.split(/\r?\n/g),
              c = l.root.split(/\r?\n/g),
              s = {
                type: p,
                synonyms: f,
                root: c
              };
            t(!0), m(s).then(() => {
              t(!1), r(!1), a();
            }).catch(o => {
              console.error(o), t(!1);
            });
          }
        })));
      };
      E = _ref5 => {
        let {
          update: m,
          onClose: a,
          initialValues: i
        } = _ref5;
        let [r, y] = N(!1);
        return d.createElement(d.Fragment, null, d.createElement("button", {
          className: "btn btn-outline-info",
          onClick: () => y(!r)
        }, "Edit"), d.createElement(M, {
          isOpen: r,
          onRequestClose: () => y(!1),
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, d.createElement("h3", null, "Edit synonym"), d.createElement(S, {
          onSubmit: (t, _ref6) => {
            let {
              setSubmitting: p
            } = _ref6;
            let f = t.id,
              c = t.type,
              s = t.synonyms ? t.synonyms.split(/\r?\n/g) : [],
              o = t.root ? t.root.split(/\r?\n/g) : [],
              b = {
                id: f,
                type: c,
                synonyms: s,
                root: o
              };
            p(!0), m(b).then(() => {
              p(!1), y(!1), a();
            }).catch(P => {
              console.error(P), p(!1);
            });
          },
          initialValues: i
        })));
      };
      _export("default", Z = _ref7 => {
        let {
          api: m,
          match: a
        } = _ref7;
        let [i, r] = k([]),
          y = a.params.engineName,
          l = () => {
            m.getSynonyms(y).then(s => {
              r(s);
            });
          };
        R(() => {
          l();
        }, []);
        let t = m.addSynonymRule.bind(null, y),
          p = s => {
            m.deleteSynonymRule(y, s).then(() => {
              l();
            });
          },
          f = s => m.updateSynonymRule(y, s).then(o => (l(), o));
        function c(s) {
          return s.map(o => {
            let b = o.root.length ? n.createElement(n.Fragment, null, n.createElement("strong", null, "root"), ": ", o.root.join(", ")) : null;
            return n.createElement("li", {
              key: o.id,
              "data-rule-id": o.id,
              className: "list-group-item"
            }, n.createElement("strong", null, "type"), ": ", o.type, " ", b, " ", n.createElement("strong", null, "synonyms"), ": ", o.synonyms.join(","), n.createElement(E, {
              update: f,
              onClose: l,
              initialValues: {
                id: o.id,
                synonyms: o.synonyms.join(`
`),
                root: o.root.join(`
`),
                type: o.type
              }
            }), n.createElement("button", {
              className: "btn btn-outline-danger",
              onClick: () => p(o.id)
            }, "delete"));
          });
        }
        return n.createElement(n.Fragment, null, n.createElement("h1", null, "Synonym management"), n.createElement("p", null, "Here you can manage the synonyms for your engine"), n.createElement(C, {
          add: t,
          onClose: l
        }), n.createElement("h2", null, "Synonyms:"), n.createElement("ul", {
          className: "list-group"
        }, c(i)));
      });
    }
  };
});