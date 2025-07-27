System.register(["react", "react-modal", "formik", "silverstripe-search-admin"], function (_export, _context) {
  "use strict";

  var e, Ve, V, f, k, se, r, Z, R, T, ee, oe, te, ae, g, I, le, P, qe, _, J, me, ie, H, L, U, Y, O, W, z, D, G, j, t, Q, K, h, A, ne, re, E, X, B, M, _e, de, w, ue, ye, ce, pe, fe, be, he, ge, ve, v, xe, Se, Ne, Fe, Ce, Ee, Te, Xe, we, x, Mo;
  return {
    setters: [function (_react) {
      e = _react;
      Ve = _react.useEffect;
      V = _react.useState;
      f = _react.default;
      k = _react.useState;
      r = _react.default;
      Z = _react.useState;
      g = _react.default;
      I = _react.useState;
      _ = _react.default;
      J = _react.useState;
    }, function (_reactModal) {
      se = _reactModal.default;
      le = _reactModal.default;
      me = _reactModal.default;
    }, function (_formik) {
      R = _formik.ErrorMessage;
      T = _formik.Field;
      ee = _formik.Form;
      oe = _formik.Formik;
      te = _formik.FieldArray;
    }, function (_silverstripeSearchAdmin) {
      ae = _silverstripeSearchAdmin.ForbiddenError;
      P = _silverstripeSearchAdmin.ForbiddenError;
      qe = _silverstripeSearchAdmin.ForbiddenError;
      ie = _silverstripeSearchAdmin.ForbiddenError;
    }],
    execute: function () {
      H = "form-module__fieldset___h7_q__100", L = "form-module__firstSynonymInput___h7_q__100", U = "form-module__formBody___h7_q__100", Y = "form-module__formFooter___h7_q__100", O = "form-module__header___h7_q__100", W = "form-module__modal___h7_q__100", z = "form-module__overlay___h7_q__100", D = "form-module__synonymInput___h7_q__100", G = "form-module__synonymRow___h7_q__100", j = "form-module__title___h7_q__100", t = {
        fieldset: H,
        firstSynonymInput: L,
        formBody: U,
        formFooter: Y,
        header: O,
        modal: W,
        overlay: z,
        synonymInput: D,
        synonymRow: G,
        title: j
      };
      Q = "buttons-module__deleteIcon_omXGHW__100", K = "buttons-module__iconButton_omXGHW__100", h = {
        deleteIcon: Q,
        iconButton: K
      };
      A = "TYPE_EQUIVALENT", ne = l => {
        let m = {};
        return (l?.synonyms?.filter(u => u) ?? []).length < 2 && (m.synonyms = "At least one synonym pair required"), m;
      }, re = l => ({
        remove: m,
        push: d
      }) => {
        let u = l.synonyms.map((c, s) => r.createElement("div", {
          key: s,
          className: t.synonymRow
        }, r.createElement(T, {
          className: `${t.synonymInput} ${s ? "" : t.firstSynonymInput}`,
          type: "text",
          name: `synonyms[${s}]`,
          "aria-label": `Synonym ${s + 1}`,
          placeholder: "Enter a synonym"
        }), s ? r.createElement("button", {
          className: `${h.iconButton} ${h.deleteIcon}`,
          type: "button",
          "aria-label": "remove synonym",
          onClick: () => m(s)
        }, r.createElement("i", {
          className: "font-icon-trash-bin"
        })) : null));
        return r.createElement(r.Fragment, null, u, r.createElement("button", {
          type: "button",
          className: "btn btn-outline-secondary vertical-align-items",
          onClick: () => d("")
        }, r.createElement("i", {
          style: {
            lineHeight: "10px",
            marginRight: "0.5rem",
            fontSize: "1.2rem"
          },
          className: "font-icon-plus"
        }), " ", "Add value"));
      }, E = ({
        onSubmit: l,
        initialValues: m = {
          type: A,
          synonyms: ["", ""]
        },
        removeSynonym: d
      }) => {
        let [u, c] = Z(!1);
        return r.createElement(oe, {
          initialValues: m,
          onSubmit: (n, ...o) => {
            let a = n?.synonyms?.filter(y => y) ?? [];
            return n.synonyms = a, l(n, ...o);
          },
          validate: ne,
          validateOnChange: !1,
          validateOnBlur: !1
        }, ({
          values: n,
          isSubmitting: o,
          errors: a
        }) => r.createElement(ee, null, r.createElement("div", {
          className: t.formBody
        }, r.createElement(T, {
          type: "hidden",
          name: "type",
          value: A
        }), r.createElement(R, {
          name: "type"
        }), r.createElement("fieldset", {
          className: t.fieldset
        }, r.createElement("legend", {
          className: "sr-only"
        }, "Synonyms:"), r.createElement(te, {
          name: "synonyms"
        }, re(n)), a.synonyms && r.createElement("div", {
          className: "alert alert-danger"
        }, a.synonyms)), "id" in n ? r.createElement(T, {
          type: "hidden",
          name: "id",
          value: n.id
        }) : null), r.createElement("div", {
          className: t.formFooter
        }, r.createElement("button", {
          type: "submit",
          className: "btn btn-primary",
          disabled: o
        }, o ? "Adding.." : "Save"), "id" in n && d ? r.createElement("button", {
          type: "button",
          className: "btn btn-danger",
          disabled: u,
          onClick: () => {
            c(!0), d(n.id).then(() => {
              c(!1);
            });
          }
        }, u ? "Deleting.." : "Delete") : null)));
      };
      X = ({
        add: l,
        onClose: m,
        buttonClasses: d = "btn btn-primary",
        text: u = f.createElement("span", {
          className: "vertical-align-items"
        }, f.createElement("i", {
          style: {
            lineHeight: "10px",
            marginRight: "0.5rem",
            fontSize: "1.2rem"
          },
          className: "font-icon-plus"
        }), "Create a synonym rule")
      }) => {
        let [c, s] = k(!1),
          [n, o] = k(""),
          a = () => {
            s(!1), o("");
          },
          y = (S, {
            setSubmitting: b
          }) => {
            let N = S.type,
              C = S.synonyms,
              i = {
                type: N,
                synonyms: C
              };
            b(!0), l(i).then(() => {
              b(!1), a(), m();
            }).catch(p => {
              console.error(p), b(!1), p instanceof ae ? o("You don't have permission to create a synonym") : o("Error fetching synonyms");
            });
          },
          F = window.document.querySelector(".cms-container");
        return f.createElement(f.Fragment, null, f.createElement("button", {
          className: d,
          onClick: () => s(!0)
        }, u), f.createElement(se, {
          appElement: F,
          portalClassName: "silverstripe-search-admin__modal",
          isOpen: c,
          onRequestClose: a,
          className: t.modal,
          overlayClassName: t.overlay
        }, f.createElement("div", {
          className: t.header
        }, f.createElement("h3", {
          className: t.title
        }, "Add a synonym"), f.createElement("button", {
          className: h.iconButton,
          onClick: a,
          "aria-label": "close"
        }, f.createElement("i", {
          className: "font-icon-cancel"
        }))), n ? f.createElement("p", {
          className: "alert alert-danger"
        }, n) : null, f.createElement(E, {
          onSubmit: y
        })));
      };
      B = ({
        update: l,
        onClose: m,
        initialValues: d,
        remove: u
      }) => {
        let [c, s] = I(!1),
          [n, o] = I(""),
          a = () => {
            s(!1), o("");
          },
          y = (b, {
            setSubmitting: N
          }) => {
            let C = b.id,
              i = b.type,
              p = b.synonyms,
              $ = {
                id: C,
                type: i,
                synonyms: p
              };
            N(!0), l($).then(() => {
              N(!1), a(), m();
            }).catch(q => {
              console.error(q), N(!1), q instanceof P ? o("You don't have permission to edit a synonym") : o("Error fetching synonyms");
            });
          },
          F = b => u(b).then(() => {
            a(), m();
          }).catch(N => {
            console.error(N), N instanceof P ? o("You don't have permission to remove synonyms") : o("Error fetching synonyms");
          }),
          S = window.document.querySelector(".cms-container");
        return g.createElement(g.Fragment, null, g.createElement("button", {
          className: h.iconButton,
          onClick: () => s(!0),
          "aria-label": "Edit"
        }, g.createElement("i", {
          className: "font-icon-edit"
        })), g.createElement(le, {
          appElement: S,
          portalClassName: "silverstripe-search-admin__modal",
          isOpen: c,
          onRequestClose: a,
          className: t.modal,
          overlayClassName: t.overlay
        }, g.createElement("div", {
          className: t.header
        }, g.createElement("h3", {
          className: t.title
        }, "Edit synonym"), g.createElement("button", {
          className: h.iconButton,
          onClick: a,
          "aria-label": "close"
        }, g.createElement("i", {
          className: "font-icon-cancel"
        }))), n ? g.createElement("p", {
          className: "alert alert-danger"
        }, n) : null, g.createElement(E, {
          onSubmit: y,
          initialValues: d,
          removeSynonym: F
        })));
      };
      M = ({
        remove: l,
        id: m,
        onClose: d
      }) => {
        let [u, c] = J(!1),
          [s, n] = J(""),
          o = () => {
            c(!1), n("");
          },
          a = F => {
            l(F).then(() => {
              o(), d();
            }).catch(S => {
              console.error(S), S instanceof ie ? n("You don't have permission to remove synonyms") : n("Error fetching synonyms");
            });
          },
          y = window.document.querySelector(".cms-container");
        return _.createElement(_.Fragment, null, _.createElement("button", {
          className: h.iconButton,
          onClick: () => c(!0),
          "aria-label": "Delete"
        }, _.createElement("i", {
          className: "font-icon-trash-bin"
        })), _.createElement(me, {
          appElement: y,
          portalClassName: "silverstripe-search-admin__modal",
          isOpen: u,
          onRequestClose: o,
          className: t.modal,
          overlayClassName: t.overlay
        }, _.createElement("div", {
          className: t.header
        }, _.createElement("h3", {
          className: t.title
        }, "Remove synonym?"), _.createElement("button", {
          className: h.iconButton,
          onClick: o,
          "aria-label": "close"
        }, _.createElement("i", {
          className: "font-icon-cancel"
        }))), s ? _.createElement("p", {
          className: "alert alert-danger"
        }, s) : null, _.createElement("div", {
          className: t.formBody
        }, _.createElement("p", null, "Are you sure? This action cannot be undone.")), _.createElement("div", {
          className: t.formFooter
        }, _.createElement("button", {
          className: "btn btn-primary",
          onClick: () => a(m)
        }, "Yes delete it"), _.createElement("button", {
          className: "btn btn-danger",
          onClick: () => o()
        }, "cancel"))));
      };
      _e = "page-module__page_AUHtmW__100", de = "page-module__title_AUHtmW__100", w = {
        page: _e,
        title: de
      };
      ue = "table-module__code_6JXXla__100", ye = "table-module__container_6JXXla__100", ce = "table-module__nostretch_6JXXla__100", pe = "table-module__table_6JXXla__100", fe = "table-module__tableTitle_6JXXla__100", be = "table-module__tbody_6JXXla__100", he = "table-module__td_6JXXla__100", ge = "table-module__th_6JXXla__100", ve = "table-module__tr_6JXXla__100", v = {
        code: ue,
        container: ye,
        nostretch: ce,
        table: pe,
        tableTitle: fe,
        tbody: be,
        td: he,
        th: ge,
        tr: ve
      };
      xe = "synonym-module__hr_6ST5ua__100", Se = "synonym-module__lead_6ST5ua__100", Ne = "synonym-module__none_6ST5ua__100", Fe = "synonym-module__noneLead_6ST5ua__100", Ce = "synonym-module__noneTitle_6ST5ua__100", Ee = "synonym-module__page_6ST5ua__100", Te = "synonym-module__table_6ST5ua__100", Xe = "synonym-module__tableContainer_6ST5ua__100", we = "synonym-module__title_6ST5ua__100", x = {
        hr: xe,
        lead: Se,
        none: Ne,
        noneLead: Fe,
        noneTitle: Ce,
        page: Ee,
        table: Te,
        tableContainer: Xe,
        title: we
      };
      _export("default", Mo = ({
        api: l,
        match: m
      }) => {
        let [d, u] = V([]),
          [c, s] = V(!1),
          [n, o] = V(""),
          a = m.params.engineName,
          y = () => {
            o(""), s(!0), l.getSynonyms(a).then(i => {
              u(i), o(""), s(!1);
            }).catch(i => {
              if (s(!1), console.error(i), i instanceof qe) switch (i.code) {
                case 401:
                  o("Your plan does not include access to this feature.");
                  break;
                default:
                  o(`You don't have permission to view this content.
                               Please check that you have the appropriate CMS permissions set.`);
              } else o("Error fetching synonyms");
            });
          };
        Ve(() => {
          y();
        }, []);
        let F = l.addSynonymRule.bind(null, a),
          S = i => l.deleteSynonymRule(a, i),
          b = i => l.updateSynonymRule(a, i).then(p => (y(), p));
        function N(i) {
          return i.map(p => e.createElement("tr", {
            key: p.id,
            className: v.tr
          }, e.createElement("td", {
            className: v.td
          }, p.synonyms.join(",")), e.createElement("td", {
            className: `${v.td} ${v.nostretch}`
          }, e.createElement(B, {
            update: b,
            remove: S,
            onClose: y,
            initialValues: {
              id: p.id,
              synonyms: p.synonyms,
              type: p.type
            }
          }), e.createElement(M, {
            id: p.id,
            remove: S,
            onClose: y
          }))));
        }
        let C = d.length || c ? null : e.createElement("div", {
          className: x.none
        }, e.createElement("h4", {
          className: x.noneTitle
        }, "You haven't created any synonyms"), e.createElement("p", {
          className: x.noneLead
        }, "Synonyms relate queries with similar context or meaning together. Use them to guide users to relevant content."), e.createElement(X, {
          add: F,
          onClose: y,
          text: "Create your first synonym set",
          buttonClasses: "btn btn-outline-info"
        }));
        return e.createElement("div", {
          className: `${w.page} ${x.page}`
        }, e.createElement("h2", {
          className: `${w.title} ${x.title}`
        }, "Synonym management"), e.createElement("p", {
          className: x.lead
        }, "Use synonyms to relate queries together that contextually have the same meaning in your dataset."), e.createElement("hr", {
          className: x.hr
        }), n ? e.createElement("p", {
          className: "alert alert-danger"
        }, n) : null, e.createElement("div", {
          className: `${v.container} ${x.tableContainer}`
        }, e.createElement("h3", {
          className: v.tableTitle
        }, "Synonyms"), e.createElement("div", null, e.createElement(X, {
          add: F,
          onClose: y
        })), e.createElement("table", {
          className: `${v.table} ${x.table}`
        }, e.createElement("thead", null, e.createElement("tr", null, e.createElement("th", {
          className: v.th
        }, "Values"), e.createElement("th", {
          className: v.th
        }, "Actions"))), e.createElement("tbody", {
          className: v.tbody
        }, N(d))), c && e.createElement("div", {
          className: x.none
        }, "loading..."), C && C));
      });
    }
  };
});
