/*
 * Minimal local runtime for Claude Design ".dc.html" exports.
 * Implements the subset these files use: {{ expr }} bindings in text and
 * attributes, <sc-for list as>, <sc-if value>, onClick="{{ fn }}", and a
 * DCLogic base class with constructor(props) / this.state / setState /
 * renderVals(). Lets the pages open directly from disk.
 */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) {
      this.state = Object.assign({}, this.state, typeof patch === 'function' ? patch(this.state) : patch);
      if (this.__render) this.__render();
    }
    renderVals() { return {}; }
  }
  window.DCLogic = DCLogic;

  var BINDING = /\{\{\s*([\s\S]*?)\s*\}\}/g;

  function evalExpr(expr, scope) {
    var keys = Object.keys(scope);
    try {
      return new Function(keys.join(','), 'return (' + expr + ');').apply(null, keys.map(function (k) { return scope[k]; }));
    } catch (e) {
      console.warn('[dc] failed to evaluate "' + expr + '":', e.message);
      return undefined;
    }
  }

  function interpolate(str, scope) {
    return str.replace(BINDING, function (_, expr) {
      var v = evalExpr(expr, scope);
      return v == null ? '' : String(v);
    });
  }

  function singleBinding(str) {
    var m = /^\s*\{\{\s*([\s\S]*?)\s*\}\}\s*$/.exec(str);
    return m ? m[1] : null;
  }

  function processChildren(parent, scope) {
    Array.prototype.slice.call(parent.childNodes).forEach(function (n) { processNode(n, scope); });
  }

  function processNode(node, scope) {
    if (node.nodeType === 3) {
      if (node.nodeValue.indexOf('{{') !== -1) node.nodeValue = interpolate(node.nodeValue, scope);
      return;
    }
    if (node.nodeType !== 1) return;
    var tag = node.tagName.toLowerCase();

    if (tag === 'sc-for') {
      var expr = singleBinding(node.getAttribute('list') || '') || node.getAttribute('list');
      var as = node.getAttribute('as') || 'item';
      var list = evalExpr(expr, scope) || [];
      var frag = document.createDocumentFragment();
      Array.prototype.forEach.call(list, function (item, i) {
        var child = Object.assign({}, scope); child[as] = item; child.$index = i;
        Array.prototype.slice.call(node.childNodes).forEach(function (c) {
          var clone = c.cloneNode(true); processNode(clone, child); frag.appendChild(clone);
        });
      });
      node.parentNode.replaceChild(frag, node);
      return;
    }

    if (tag === 'sc-if') {
      var vexpr = singleBinding(node.getAttribute('value') || '') || node.getAttribute('value');
      if (evalExpr(vexpr, scope)) {
        var f = document.createDocumentFragment();
        Array.prototype.slice.call(node.childNodes).forEach(function (c) { processNode(c, scope); f.appendChild(c); });
        node.parentNode.replaceChild(f, node);
      } else {
        node.parentNode.removeChild(node);
      }
      return;
    }

    Array.prototype.slice.call(node.attributes).forEach(function (attr) {
      if (attr.value.indexOf('{{') === -1) return;
      var name = attr.name.toLowerCase();
      if (name.indexOf('on') === 0) {
        var fexpr = singleBinding(attr.value);
        var fn = fexpr ? evalExpr(fexpr, scope) : null;
        node.removeAttribute(attr.name);
        if (typeof fn === 'function') node.addEventListener(name.slice(2), function (ev) { fn(ev); });
      } else {
        node.setAttribute(attr.name, interpolate(attr.value, scope));
      }
    });
    processChildren(node, scope);
  }

  function boot() {
    var root = document.querySelector('x-dc');
    if (!root) return;
    root.style.display = 'block';

    var helmet = root.querySelector('helmet');
    if (helmet) {
      while (helmet.firstChild) document.head.appendChild(helmet.firstChild);
      helmet.parentNode.removeChild(helmet);
    }

    var script = document.querySelector('script[type="text/x-dc"]');
    var props = {};
    var Component = DCLogic;
    if (script) {
      try { props = JSON.parse(script.getAttribute('data-props') || '{}'); } catch (e) {}
      try {
        Component = new Function('DCLogic', script.textContent + '\nreturn typeof Component !== "undefined" ? Component : DCLogic;')(DCLogic) || DCLogic;
      } catch (e) { console.error('[dc] component script failed:', e); }
    }

    var template = document.createDocumentFragment();
    while (root.firstChild) template.appendChild(root.firstChild);

    var instance = new Component(props);
    instance.__render = function () {
      var vals = instance.renderVals() || {};
      var frag = template.cloneNode(true);
      processChildren(frag, vals);
      while (root.firstChild) root.removeChild(root.firstChild);
      root.appendChild(frag);
    };
    instance.__render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
