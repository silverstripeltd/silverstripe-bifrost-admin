System.register(["react", "react-router-dom"], function (_export, _context) {
  "use strict";

  var a, t, p;
  return {
    setters: [function (_react) {
      a = _react;
    }, function (_reactRouterDom) {
      t = _reactRouterDom.Link;
    }],
    execute: function () {
      _export("default", p = _ref => {
        let {
          match: e,
          location: o
        } = _ref;
        return a.createElement(a.Fragment, null, a.createElement("h1", null, "Manage ", e.params.engineName), a.createElement("ul", null, a.createElement("li", null, a.createElement(t, {
          to: `${o.pathname}/synonyms`
        }, "Synonyms"))));
      });
    }
  };
});