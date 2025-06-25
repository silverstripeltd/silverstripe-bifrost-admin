System.register(["react", "react-modal", "formik", "silverstripe-search-admin"], function (_export, _context) {
  "use strict";

  var o, qo, V, f, I, so, r, Z, R, T, oo, eo, to, ao, g, k, lo, P, Ao, i, J, mo, io, H, L, U, Y, O, W, z, D, G, j, t, Q, K, h, A, no, ro, E, X, B, M, _o, uo, w, yo, co, po, fo, bo, ho, go, vo, xo, v, No, So, Fo, Co, Eo, To, Xo, wo, Vo, x, Me;
  return {
    setters: [function (_react) {
      o = _react;
      qo = _react.useEffect;
      V = _react.useState;
      f = _react.default;
      I = _react.useState;
      r = _react.default;
      Z = _react.useState;
      g = _react.default;
      k = _react.useState;
      i = _react.default;
      J = _react.useState;
    }, function (_reactModal) {
      so = _reactModal.default;
      lo = _reactModal.default;
      mo = _reactModal.default;
    }, function (_formik) {
      R = _formik.ErrorMessage;
      T = _formik.Field;
      oo = _formik.Form;
      eo = _formik.Formik;
      to = _formik.FieldArray;
    }, function (_silverstripeSearchAdmin) {
      ao = _silverstripeSearchAdmin.ForbiddenError;
      P = _silverstripeSearchAdmin.ForbiddenError;
      Ao = _silverstripeSearchAdmin.ForbiddenError;
      io = _silverstripeSearchAdmin.ForbiddenError;
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
      A = "TYPE_EQUIVALENT", no = l => {
        let m = {};
        return (l?.synonyms?.filter(d => d) ?? []).length < 2 && (m.synonyms = "At least one synonym pair required"), m;
      }, ro = l => _ref => {
        let {
          remove: m,
          push: _
        } = _ref;
        let d = l.synonyms.map((c, s) => r.createElement("div", {
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
        return r.createElement(r.Fragment, null, d, r.createElement("button", {
          type: "button",
          className: "btn btn-outline-secondary vertical-align-items",
          onClick: () => _("")
        }, r.createElement("i", {
          style: {
            lineHeight: "10px",
            marginRight: "0.5rem",
            fontSize: "1.2rem"
          },
          className: "font-icon-plus"
        }), " ", "Add value"));
      }, E = _ref2 => {
        let {
          onSubmit: l,
          initialValues: m = {
            type: A,
            synonyms: ["", ""]
          },
          removeSynonym: _
        } = _ref2;
        let [d, c] = Z(!1);
        return r.createElement(eo, {
          initialValues: m,
          onSubmit: function (n) {
            let a = n?.synonyms?.filter(u => u) ?? [];
            for (var _len = arguments.length, e = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              e[_key - 1] = arguments[_key];
            }
            return n.synonyms = a, l(n, ...e);
          },
          validate: no,
          validateOnChange: !1,
          validateOnBlur: !1
        }, _ref3 => {
          let {
            values: n,
            isSubmitting: e,
            errors: a
          } = _ref3;
          return r.createElement(oo, null, r.createElement("div", {
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
          }, "Synonyms:"), r.createElement(to, {
            name: "synonyms"
          }, ro(n)), a.synonyms && r.createElement("div", {
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
            disabled: e
          }, e ? "Adding.." : "Save"), "id" in n && _ ? r.createElement("button", {
            type: "button",
            className: "btn btn-danger",
            disabled: d,
            onClick: () => {
              c(!0), _(n.id).then(() => {
                c(!1);
              });
            }
          }, d ? "Deleting.." : "Delete") : null));
        });
      };
      X = _ref4 => {
        let {
          add: l,
          onClose: m,
          buttonClasses: _ = "btn btn-primary",
          text: d = f.createElement("span", {
            className: "vertical-align-items"
          }, f.createElement("i", {
            style: {
              lineHeight: "10px",
              marginRight: "0.5rem",
              fontSize: "1.2rem"
            },
            className: "font-icon-plus"
          }), "Create a synonym set")
        } = _ref4;
        let [c, s] = I(!1),
          [n, e] = I(""),
          a = () => {
            s(!1), e("");
          },
          u = (N, _ref5) => {
            let {
              setSubmitting: b
            } = _ref5;
            let S = N.type,
              C = N.synonyms,
              y = {
                type: S,
                synonyms: C
              };
            b(!0), l(y).then(() => {
              b(!1), a(), m();
            }).catch(p => {
              console.error(p), b(!1), p instanceof ao ? e("You don't have permission to create a synonym") : e("Error fetching synonyms");
            });
          },
          F = window.document.querySelector(".cms-container");
        return f.createElement(f.Fragment, null, f.createElement("button", {
          className: _,
          onClick: () => s(!0)
        }, d), f.createElement(so, {
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
          onSubmit: u
        })));
      };
      B = _ref6 => {
        let {
          update: l,
          onClose: m,
          initialValues: _,
          remove: d
        } = _ref6;
        let [c, s] = k(!1),
          [n, e] = k(""),
          a = () => {
            s(!1), e("");
          },
          u = (b, _ref7) => {
            let {
              setSubmitting: S
            } = _ref7;
            let C = b.id,
              y = b.type,
              p = b.synonyms,
              $ = {
                id: C,
                type: y,
                synonyms: p
              };
            S(!0), l($).then(() => {
              S(!1), a(), m();
            }).catch(q => {
              console.error(q), S(!1), q instanceof P ? e("You don't have permission to edit a synonym") : e("Error fetching synonyms");
            });
          },
          F = b => d(b).then(() => {
            a(), m();
          }).catch(S => {
            console.error(S), S instanceof P ? e("You don't have permission to remove synonyms") : e("Error fetching synonyms");
          }),
          N = window.document.querySelector(".cms-container");
        return g.createElement(g.Fragment, null, g.createElement("button", {
          className: h.iconButton,
          onClick: () => s(!0),
          "aria-label": "Edit"
        }, g.createElement("i", {
          className: "font-icon-edit"
        })), g.createElement(lo, {
          appElement: N,
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
          onSubmit: u,
          initialValues: _,
          removeSynonym: F
        })));
      };
      M = _ref8 => {
        let {
          remove: l,
          id: m,
          onClose: _
        } = _ref8;
        let [d, c] = J(!1),
          [s, n] = J(""),
          e = () => {
            c(!1), n("");
          },
          a = F => {
            l(F).then(() => {
              e(), _();
            }).catch(N => {
              console.error(N), N instanceof io ? n("You don't have permission to remove synonyms") : n("Error fetching synonyms");
            });
          },
          u = window.document.querySelector(".cms-container");
        return i.createElement(i.Fragment, null, i.createElement("button", {
          className: h.iconButton,
          onClick: () => c(!0),
          "aria-label": "Delete"
        }, i.createElement("i", {
          className: "font-icon-trash-bin"
        })), i.createElement(mo, {
          appElement: u,
          portalClassName: "silverstripe-search-admin__modal",
          isOpen: d,
          onRequestClose: e,
          className: t.modal,
          overlayClassName: t.overlay
        }, i.createElement("div", {
          className: t.header
        }, i.createElement("h3", {
          className: t.title
        }, "Remove synonym?"), i.createElement("button", {
          className: h.iconButton,
          onClick: e,
          "aria-label": "close"
        }, i.createElement("i", {
          className: "font-icon-cancel"
        }))), s ? i.createElement("p", {
          className: "alert alert-danger"
        }, s) : null, i.createElement("div", {
          className: t.formBody
        }, i.createElement("p", null, "Are you sure? This action cannot be undone.")), i.createElement("div", {
          className: t.formFooter
        }, i.createElement("button", {
          className: "btn btn-primary",
          onClick: () => a(m)
        }, "Yes delete it"), i.createElement("button", {
          className: "btn btn-danger",
          onClick: () => e()
        }, "cancel"))));
      };
      _o = "page-module__page_AUHtmW__100", uo = "page-module__title_AUHtmW__100", w = {
        page: _o,
        title: uo
      };
      yo = "table-module__code_6JXXla__100", co = "table-module__container_6JXXla__100", po = "table-module__nostretch_6JXXla__100", fo = "table-module__table_6JXXla__100", bo = "table-module__tableTitle_6JXXla__100", ho = "table-module__tbody_6JXXla__100", go = "table-module__td_6JXXla__100", vo = "table-module__th_6JXXla__100", xo = "table-module__tr_6JXXla__100", v = {
        code: yo,
        container: co,
        nostretch: po,
        table: fo,
        tableTitle: bo,
        tbody: ho,
        td: go,
        th: vo,
        tr: xo
      };
      No = "synonym-module__hr_6ST5ua__100", So = "synonym-module__lead_6ST5ua__100", Fo = "synonym-module__none_6ST5ua__100", Co = "synonym-module__noneLead_6ST5ua__100", Eo = "synonym-module__noneTitle_6ST5ua__100", To = "synonym-module__page_6ST5ua__100", Xo = "synonym-module__table_6ST5ua__100", wo = "synonym-module__tableContainer_6ST5ua__100", Vo = "synonym-module__title_6ST5ua__100", x = {
        hr: No,
        lead: So,
        none: Fo,
        noneLead: Co,
        noneTitle: Eo,
        page: To,
        table: Xo,
        tableContainer: wo,
        title: Vo
      };
      _export("default", Me = _ref9 => {
        let {
          api: l,
          match: m
        } = _ref9;
        let [_, d] = V([]),
          [c, s] = V(!1),
          [n, e] = V(""),
          a = m.params.engineName,
          u = () => {
            e(""), s(!0), l.getSynonyms(a).then(y => {
              d(y), e(""), s(!1);
            }).catch(y => {
              s(!1), console.error(y), y instanceof Ao ? e("You don't have permission to view this content") : e("Error fetching synonyms");
            });
          };
        qo(() => {
          u();
        }, []);
        let F = l.addSynonymRule.bind(null, a),
          N = y => l.deleteSynonymRule(a, y),
          b = y => l.updateSynonymRule(a, y).then(p => (u(), p));
        function S(y) {
          return y.map(p => o.createElement("tr", {
            key: p.id,
            className: v.tr
          }, o.createElement("td", {
            className: v.td
          }, p.synonyms.join(",")), o.createElement("td", {
            className: `${v.td} ${v.nostretch}`
          }, o.createElement(B, {
            update: b,
            remove: N,
            onClose: u,
            initialValues: {
              id: p.id,
              synonyms: p.synonyms,
              type: p.type
            }
          }), o.createElement(M, {
            id: p.id,
            remove: N,
            onClose: u
          }))));
        }
        let C = _.length || c ? null : o.createElement("div", {
          className: x.none
        }, o.createElement("h4", {
          className: x.noneTitle
        }, "You haven't created any synonyms"), o.createElement("p", {
          className: x.noneLead
        }, "Synonyms relate queries with similar context or meaning together. Use them to guide users to relevant content."), o.createElement(X, {
          add: F,
          onClose: u,
          text: "Create your first synonym set",
          buttonClasses: "btn btn-outline-info"
        }));
        return o.createElement("div", {
          className: `${w.page} ${x.page}`
        }, o.createElement("h2", {
          className: `${w.title} ${x.title}`
        }, "Synonym management"), o.createElement("p", {
          className: x.lead
        }, "Use synonyms to relate queries together that contextually have the same meaning in your dataset."), o.createElement("hr", {
          className: x.hr
        }), n ? o.createElement("p", {
          className: "alert alert-danger"
        }, n) : null, o.createElement("div", {
          className: `${v.container} ${x.tableContainer}`
        }, o.createElement("h3", {
          className: v.tableTitle
        }, "Synonyms"), o.createElement("div", null, o.createElement(X, {
          add: F,
          onClose: u
        })), o.createElement("table", {
          className: `${v.table} ${x.table}`
        }, o.createElement("thead", null, o.createElement("tr", null, o.createElement("th", {
          className: v.th
        }, "Values"), o.createElement("th", {
          className: v.th
        }, "Actions"))), o.createElement("tbody", {
          className: v.tbody
        }, S(_))), c && o.createElement("div", {
          className: x.none
        }, "loading..."), C && C));
      });
    }
  };
});