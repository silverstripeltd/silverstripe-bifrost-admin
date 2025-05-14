System.register(["react", "react-modal", "formik", "silverstripe-search-admin"], function (_export, _context) {
  "use strict";

  var n, w, I, c, P, U, e, S, b, Y, R, L, f, N, O, j, M, C, A, E, x, T, mo;
  return {
    setters: [function (_react) {
      n = _react;
      w = _react.useEffect;
      I = _react.useState;
      c = _react.default;
      P = _react.useState;
      e = _react.default;
      f = _react.default;
      N = _react.useState;
    }, function (_reactModal) {
      U = _reactModal.default;
      O = _reactModal.default;
    }, function (_formik) {
      S = _formik.ErrorMessage;
      b = _formik.Field;
      Y = _formik.Form;
      R = _formik.Formik;
    }, function (_silverstripeSearchAdmin) {
      L = _silverstripeSearchAdmin.ForbiddenError;
      j = _silverstripeSearchAdmin.ForbiddenError;
      M = _silverstripeSearchAdmin.ForbiddenError;
    }],
    execute: function () {
      C = "TYPE_DIRECTIONAL", A = "TYPE_EQUIVALENT", E = _ref => {
        let {
          onSubmit: i,
          initialValues: u = {
            type: A,
            root: "",
            synonyms: ""
          }
        } = _ref;
        return e.createElement(R, {
          initialValues: u,
          onSubmit: i
        }, _ref2 => {
          let {
            values: y,
            isSubmitting: l
          } = _ref2;
          return e.createElement(Y, null, e.createElement("label", null, "Select Type:", e.createElement(b, {
            as: "select",
            name: "type"
          }, e.createElement("option", {
            value: A
          }, "equivalent"), e.createElement("option", {
            value: C
          }, "directional")), e.createElement(S, {
            name: "type"
          })), y.type === C ? e.createElement("label", null, "Root words (one word per line):", e.createElement(b, {
            as: "textarea",
            name: "root"
          }), e.createElement(S, {
            name: "root"
          })) : null, e.createElement("label", null, "Synonyms (one word per line):", e.createElement(b, {
            as: "textarea",
            name: "synonyms"
          }), e.createElement(S, {
            name: "synonyms"
          })), "id" in y ? e.createElement(b, {
            as: "hidden",
            name: "id"
          }) : null, e.createElement("button", {
            type: "submit",
            disabled: l
          }, l ? "Adding.." : "Submit"));
        });
      };
      x = _ref3 => {
        let {
          add: i,
          onClose: u
        } = _ref3;
        let [y, l] = P(!1),
          [p, t] = P(""),
          m = () => {
            l(!1), t("");
          };
        return c.createElement(c.Fragment, null, c.createElement("button", {
          className: "btn btn-info",
          onClick: () => l(!0)
        }, "Add synonym"), c.createElement(U, {
          isOpen: y,
          onRequestClose: m,
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, c.createElement("h3", null, "Add a synonym"), p ? c.createElement("p", {
          className: "alert alert-danger"
        }, p) : null, c.createElement(E, {
          onSubmit: (F, _ref4) => {
            let {
              setSubmitting: s
            } = _ref4;
            let d = F.type,
              h = F.synonyms.split(/\r?\n/g),
              r = F.root.split(/\r?\n/g),
              o = {
                type: d,
                synonyms: h,
                root: r
              };
            s(!0), i(o).then(() => {
              s(!1), m(), u();
            }).catch(g => {
              console.error(g), s(!1), g instanceof L ? t("You don't have permission to create a synonym") : t("Error fetching synonyms");
            });
          }
        })));
      };
      T = _ref5 => {
        let {
          update: i,
          onClose: u,
          initialValues: y
        } = _ref5;
        let [l, p] = N(!1),
          [t, m] = N(""),
          a = () => {
            p(!1), m("");
          };
        return f.createElement(f.Fragment, null, f.createElement("button", {
          className: "btn btn-outline-info",
          onClick: () => p(!0)
        }, "Edit"), f.createElement(O, {
          isOpen: l,
          onRequestClose: a,
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, f.createElement("h3", null, "Edit synonym"), t ? f.createElement("p", {
          className: "alert alert-danger"
        }, t) : null, f.createElement(E, {
          onSubmit: (s, _ref6) => {
            let {
              setSubmitting: d
            } = _ref6;
            let h = s.id,
              r = s.type,
              o = s.synonyms ? s.synonyms.split(/\r?\n/g) : [],
              g = s.root ? s.root.split(/\r?\n/g) : [],
              k = {
                id: h,
                type: r,
                synonyms: o,
                root: g
              };
            d(!0), i(k).then(() => {
              d(!1), a(), u();
            }).catch(V => {
              console.error(V), d(!1), V instanceof j ? m("You don't have permission to edit a synonym") : m("Error fetching synonyms");
            });
          },
          initialValues: y
        })));
      };
      _export("default", mo = _ref7 => {
        let {
          api: i,
          match: u
        } = _ref7;
        let [y, l] = I([]),
          [p, t] = I(""),
          m = u.params.engineName,
          a = () => {
            t(""), i.getSynonyms(m).then(r => {
              l(r), t("");
            }).catch(r => {
              console.error(r), r instanceof M ? t("You don't have permission to view this content") : t("Error fetching synonyms");
            });
          };
        w(() => {
          a();
        }, []);
        let F = i.addSynonymRule.bind(null, m),
          s = r => {
            i.deleteSynonymRule(m, r).then(() => {
              a();
            }).catch(o => {
              console.error(o), o instanceof M ? t("You don't have permission to delete a synonym") : t("Error deleting synonym");
            });
          },
          d = r => i.updateSynonymRule(m, r).then(o => (a(), o));
        function h(r) {
          return r.map(o => {
            let g = o.root.length ? n.createElement(n.Fragment, null, n.createElement("strong", null, "root"), ": ", o.root.join(", ")) : null;
            return n.createElement("li", {
              key: o.id,
              "data-rule-id": o.id,
              className: "list-group-item"
            }, n.createElement("strong", null, "type"), ": ", o.type, " ", g, " ", n.createElement("strong", null, "synonyms"), ": ", o.synonyms.join(","), n.createElement(T, {
              update: d,
              onClose: a,
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
              onClick: () => s(o.id)
            }, "delete"));
          });
        }
        return n.createElement(n.Fragment, null, n.createElement("h1", null, "Synonym management"), n.createElement("p", null, "Here you can manage the synonyms for your engine"), n.createElement(x, {
          add: F,
          onClose: a
        }), n.createElement("h2", null, "Synonyms:"), p ? n.createElement("p", {
          className: "alert alert-danger"
        }, p) : null, n.createElement("ul", {
          className: "list-group"
        }, h(y)));
      });
    }
  };
});