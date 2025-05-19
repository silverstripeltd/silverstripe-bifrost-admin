System.register(["react", "react-modal", "formik", "silverstripe-search-admin"], function (_export, _context) {
  "use strict";

  var o, z, k, F, x, U, r, C, E, O, R, L, b, v, j, q, B, f, T, w, _, P, A, S, N, M, I, bo;
  return {
    setters: [function (_react) {
      o = _react;
      z = _react.useEffect;
      k = _react.useState;
      F = _react.default;
      x = _react.useState;
      r = _react.default;
      b = _react.default;
      v = _react.useState;
      f = _react.default;
      T = _react.useState;
    }, function (_reactModal) {
      U = _reactModal.default;
      j = _reactModal.default;
      w = _reactModal.default;
    }, function (_formik) {
      C = _formik.ErrorMessage;
      E = _formik.Field;
      O = _formik.Form;
      R = _formik.Formik;
    }, function (_silverstripeSearchAdmin) {
      L = _silverstripeSearchAdmin.ForbiddenError;
      q = _silverstripeSearchAdmin.ForbiddenError;
      B = _silverstripeSearchAdmin.ForbiddenError;
      _ = _silverstripeSearchAdmin.ForbiddenError;
    }],
    execute: function () {
      P = "TYPE_DIRECTIONAL", A = "TYPE_EQUIVALENT", S = _ref => {
        let {
          onSubmit: i,
          initialValues: p = {
            type: A,
            root: "",
            synonyms: ""
          }
        } = _ref;
        return r.createElement(R, {
          initialValues: p,
          onSubmit: i
        }, _ref2 => {
          let {
            values: u,
            isSubmitting: a
          } = _ref2;
          return r.createElement(O, null, r.createElement("label", null, "Select Type:", r.createElement(E, {
            as: "select",
            name: "type"
          }, r.createElement("option", {
            value: A
          }, "equivalent"), r.createElement("option", {
            value: P
          }, "directional")), r.createElement(C, {
            name: "type"
          })), u.type === P ? r.createElement("label", null, "Root words (one word per line):", r.createElement(E, {
            as: "textarea",
            name: "root"
          }), r.createElement(C, {
            name: "root"
          })) : null, r.createElement("label", null, "Synonyms (one word per line):", r.createElement(E, {
            as: "textarea",
            name: "synonyms"
          }), r.createElement(C, {
            name: "synonyms"
          })), "id" in u ? r.createElement(E, {
            as: "hidden",
            name: "id"
          }) : null, r.createElement("button", {
            type: "submit",
            disabled: a
          }, a ? "Adding.." : "Submit"));
        });
      };
      N = _ref3 => {
        let {
          add: i,
          onClose: p
        } = _ref3;
        let [u, a] = x(!1),
          [y, t] = x(""),
          e = () => {
            a(!1), t("");
          };
        return F.createElement(F.Fragment, null, F.createElement("button", {
          className: "btn btn-info",
          onClick: () => a(!0)
        }, "Add synonym"), F.createElement(U, {
          isOpen: u,
          onRequestClose: e,
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, F.createElement("h3", null, "Add a synonym"), y ? F.createElement("p", {
          className: "alert alert-danger"
        }, y) : null, F.createElement(S, {
          onSubmit: (c, _ref4) => {
            let {
              setSubmitting: s
            } = _ref4;
            let d = c.type,
              h = c.synonyms.split(/\r?\n/g),
              m = c.root.split(/\r?\n/g),
              n = {
                type: d,
                synonyms: h,
                root: m
              };
            s(!0), i(n).then(() => {
              s(!1), e(), p();
            }).catch(g => {
              console.error(g), s(!1), g instanceof L ? t("You don't have permission to create a synonym") : t("Error fetching synonyms");
            });
          }
        })));
      };
      M = _ref5 => {
        let {
          update: i,
          onClose: p,
          initialValues: u
        } = _ref5;
        let [a, y] = v(!1),
          [t, e] = v(""),
          l = () => {
            y(!1), e("");
          };
        return b.createElement(b.Fragment, null, b.createElement("button", {
          className: "btn btn-outline-info",
          onClick: () => y(!0)
        }, "Edit"), b.createElement(j, {
          isOpen: a,
          onRequestClose: l,
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, b.createElement("h3", null, "Edit synonym"), t ? b.createElement("p", {
          className: "alert alert-danger"
        }, t) : null, b.createElement(S, {
          onSubmit: (s, _ref6) => {
            let {
              setSubmitting: d
            } = _ref6;
            let h = s.id,
              m = s.type,
              n = s.synonyms ? s.synonyms.split(/\r?\n/g) : [],
              g = s.root ? s.root.split(/\r?\n/g) : [],
              Y = {
                id: h,
                type: m,
                synonyms: n,
                root: g
              };
            d(!0), i(Y).then(() => {
              d(!1), l(), p();
            }).catch(V => {
              console.error(V), d(!1), V instanceof q ? e("You don't have permission to edit a synonym") : e("Error fetching synonyms");
            });
          },
          initialValues: u
        })));
      };
      I = _ref7 => {
        let {
          remove: i,
          id: p,
          onClose: u
        } = _ref7;
        let [a, y] = T(!1),
          [t, e] = T(""),
          l = () => {
            y(!1), e("");
          },
          c = s => {
            i(s).then(() => {
              l(), u();
            }).catch(d => {
              console.error(d), d instanceof _ ? e("You don't have permission to remove synonyms") : e("Error fetching synonyms");
            });
          };
        return f.createElement(f.Fragment, null, f.createElement("button", {
          className: "btn btn-outline-danger",
          onClick: () => y(!0)
        }, "Delete"), f.createElement(w, {
          isOpen: a,
          onRequestClose: l,
          style: {
            overlay: {
              zIndex: 100
            }
          }
        }, f.createElement("h3", null, "Remove synonym?"), t ? f.createElement("p", {
          className: "alert alert-danger"
        }, t) : null, f.createElement("p", null, "Are you sure?"), f.createElement("button", {
          className: "btn btn-danger",
          onClick: () => c(p)
        }, "Yes, remove"), f.createElement("button", {
          className: "btn btn-info",
          onClick: () => c(p)
        }, "cancel")));
      };
      _export("default", bo = _ref8 => {
        let {
          api: i,
          match: p
        } = _ref8;
        let [u, a] = k([]),
          [y, t] = k(""),
          e = p.params.engineName,
          l = () => {
            t(""), i.getSynonyms(e).then(m => {
              a(m), t("");
            }).catch(m => {
              console.error(m), m instanceof B ? t("You don't have permission to view this content") : t("Error fetching synonyms");
            });
          };
        z(() => {
          l();
        }, []);
        let c = i.addSynonymRule.bind(null, e),
          s = m => i.deleteSynonymRule(e, m),
          d = m => i.updateSynonymRule(e, m).then(n => (l(), n));
        function h(m) {
          return m.map(n => {
            let g = n.root.length ? o.createElement(o.Fragment, null, o.createElement("strong", null, "root"), ": ", n.root.join(", ")) : null;
            return o.createElement("li", {
              key: n.id,
              "data-rule-id": n.id,
              className: "list-group-item"
            }, o.createElement("strong", null, "type"), ": ", n.type, " ", g, " ", o.createElement("strong", null, "synonyms"), ": ", n.synonyms.join(","), o.createElement(M, {
              update: d,
              onClose: l,
              initialValues: {
                id: n.id,
                synonyms: n.synonyms.join(`
`),
                root: n.root.join(`
`),
                type: n.type
              }
            }), o.createElement(I, {
              id: n.id,
              remove: s,
              onClose: l
            }));
          });
        }
        return o.createElement(o.Fragment, null, o.createElement("h1", null, "Synonym management"), o.createElement("p", null, "Here you can manage the synonyms for your engine"), o.createElement(N, {
          add: c,
          onClose: l
        }), o.createElement("h2", null, "Synonyms:"), y ? o.createElement("p", {
          className: "alert alert-danger"
        }, y) : null, o.createElement("ul", {
          className: "list-group"
        }, h(u)));
      });
    }
  };
});