System.register(["react", "react-router-dom"], function (_export, _context) {
  "use strict";

  var o, e, p;
  return {
    setters: [function (_react) {
      o = _react;
    }, function (_reactRouterDom) {
      e = _reactRouterDom.Link;
    }],
    execute: function () {
      _export("default", p = _ref => {
        let {
          match: t,
          location: a
        } = _ref;
        return o.createElement(o.Fragment, null, o.createElement("h1", null, "Manage ", t.params.engineName), o.createElement("ul", null, o.createElement("li", null, o.createElement(e, {
          to: `${a.pathname}/synonyms`
        }, "Synonyms"))));
      });
    }
  };
});