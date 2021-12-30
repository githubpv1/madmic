"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (n, t) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (n = "undefined" != typeof globalThis ? globalThis : n || self).LazyLoad = t();
}(void 0, function () {
  "use strict";

  function n() {
    return n = Object.assign || function (n) {
      for (var t = 1; t < arguments.length; t++) {
        var e = arguments[t];

        for (var i in e) {
          Object.prototype.hasOwnProperty.call(e, i) && (n[i] = e[i]);
        }
      }

      return n;
    }, n.apply(this, arguments);
  }

  var t = "undefined" != typeof window,
      e = t && !("onscroll" in window) || "undefined" != typeof navigator && /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent),
      i = t && "IntersectionObserver" in window,
      o = t && "classList" in document.createElement("p"),
      a = t && window.devicePixelRatio > 1,
      r = {
    elements_selector: ".lazy",
    container: e || t ? document : null,
    threshold: 300,
    thresholds: null,
    data_src: "src",
    data_srcset: "srcset",
    data_sizes: "sizes",
    data_bg: "bg",
    data_bg_hidpi: "bg-hidpi",
    data_bg_multi: "bg-multi",
    data_bg_multi_hidpi: "bg-multi-hidpi",
    data_poster: "poster",
    class_applied: "applied",
    class_loading: "loading",
    class_loaded: "loaded",
    class_error: "error",
    class_entered: "entered",
    class_exited: "exited",
    unobserve_completed: !0,
    unobserve_entered: !1,
    cancel_on_exit: !0,
    callback_enter: null,
    callback_exit: null,
    callback_applied: null,
    callback_loading: null,
    callback_loaded: null,
    callback_error: null,
    callback_finish: null,
    callback_cancel: null,
    use_native: !1
  },
      c = function c(t) {
    return n({}, r, t);
  },
      u = function u(n, t) {
    var e,
        i = "LazyLoad::Initialized",
        o = new n(t);

    try {
      e = new CustomEvent(i, {
        detail: {
          instance: o
        }
      });
    } catch (n) {
      (e = document.createEvent("CustomEvent")).initCustomEvent(i, !1, !1, {
        instance: o
      });
    }

    window.dispatchEvent(e);
  },
      l = "src",
      s = "srcset",
      f = "sizes",
      d = "poster",
      _ = "llOriginalAttrs",
      g = "loading",
      v = "loaded",
      b = "applied",
      p = "error",
      h = "native",
      m = "data-",
      E = "ll-status",
      I = function I(n, t) {
    return n.getAttribute(m + t);
  },
      y = function y(n) {
    return I(n, E);
  },
      A = function A(n, t) {
    return function (n, t, e) {
      var i = "data-ll-status";
      null !== e ? n.setAttribute(i, e) : n.removeAttribute(i);
    }(n, 0, t);
  },
      k = function k(n) {
    return A(n, null);
  },
      L = function L(n) {
    return null === y(n);
  },
      w = function w(n) {
    return y(n) === h;
  },
      x = [g, v, b, p],
      O = function O(n, t, e, i) {
    n && (void 0 === i ? void 0 === e ? n(t) : n(t, e) : n(t, e, i));
  },
      N = function N(n, t) {
    o ? n.classList.add(t) : n.className += (n.className ? " " : "") + t;
  },
      C = function C(n, t) {
    o ? n.classList.remove(t) : n.className = n.className.replace(new RegExp("(^|\\s+)" + t + "(\\s+|$)"), " ").replace(/^\s+/, "").replace(/\s+$/, "");
  },
      M = function M(n) {
    return n.llTempImage;
  },
      z = function z(n, t) {
    if (t) {
      var e = t._observer;
      e && e.unobserve(n);
    }
  },
      R = function R(n, t) {
    n && (n.loadingCount += t);
  },
      T = function T(n, t) {
    n && (n.toLoadCount = t);
  },
      G = function G(n) {
    for (var t, e = [], i = 0; t = n.children[i]; i += 1) {
      "SOURCE" === t.tagName && e.push(t);
    }

    return e;
  },
      D = function D(n, t) {
    var e = n.parentNode;
    e && "PICTURE" === e.tagName && G(e).forEach(t);
  },
      V = function V(n, t) {
    G(n).forEach(t);
  },
      F = [l],
      j = [l, d],
      P = [l, s, f],
      S = function S(n) {
    return !!n[_];
  },
      U = function U(n) {
    return n[_];
  },
      $ = function $(n) {
    return delete n[_];
  },
      q = function q(n, t) {
    if (!S(n)) {
      var e = {};
      t.forEach(function (t) {
        e[t] = n.getAttribute(t);
      }), n[_] = e;
    }
  },
      H = function H(n, t) {
    if (S(n)) {
      var e = U(n);
      t.forEach(function (t) {
        !function (n, t, e) {
          e ? n.setAttribute(t, e) : n.removeAttribute(t);
        }(n, t, e[t]);
      });
    }
  },
      B = function B(n, t, e) {
    N(n, t.class_loading), A(n, g), e && (R(e, 1), O(t.callback_loading, n, e));
  },
      J = function J(n, t, e) {
    e && n.setAttribute(t, e);
  },
      K = function K(n, t) {
    J(n, f, I(n, t.data_sizes)), J(n, s, I(n, t.data_srcset)), J(n, l, I(n, t.data_src));
  },
      Q = {
    IMG: function IMG(n, t) {
      D(n, function (n) {
        q(n, P), K(n, t);
      }), q(n, P), K(n, t);
    },
    IFRAME: function IFRAME(n, t) {
      q(n, F), J(n, l, I(n, t.data_src));
    },
    VIDEO: function VIDEO(n, t) {
      V(n, function (n) {
        q(n, F), J(n, l, I(n, t.data_src));
      }), q(n, j), J(n, d, I(n, t.data_poster)), J(n, l, I(n, t.data_src)), n.load();
    }
  },
      W = ["IMG", "IFRAME", "VIDEO"],
      X = function X(n, t) {
    !t || function (n) {
      return n.loadingCount > 0;
    }(t) || function (n) {
      return n.toLoadCount > 0;
    }(t) || O(n.callback_finish, t);
  },
      Y = function Y(n, t, e) {
    n.addEventListener(t, e), n.llEvLisnrs[t] = e;
  },
      Z = function Z(n, t, e) {
    n.removeEventListener(t, e);
  },
      nn = function nn(n) {
    return !!n.llEvLisnrs;
  },
      tn = function tn(n) {
    if (nn(n)) {
      var t = n.llEvLisnrs;

      for (var e in t) {
        var i = t[e];
        Z(n, e, i);
      }

      delete n.llEvLisnrs;
    }
  },
      en = function en(n, t, e) {
    !function (n) {
      delete n.llTempImage;
    }(n), R(e, -1), function (n) {
      n && (n.toLoadCount -= 1);
    }(e), C(n, t.class_loading), t.unobserve_completed && z(n, e);
  },
      on = function on(n, t, e) {
    var i = M(n) || n;
    nn(i) || function (n, t, e) {
      nn(n) || (n.llEvLisnrs = {});
      var i = "VIDEO" === n.tagName ? "loadeddata" : "load";
      Y(n, i, t), Y(n, "error", e);
    }(i, function (o) {
      !function (n, t, e, i) {
        var o = w(t);
        en(t, e, i), N(t, e.class_loaded), A(t, v), O(e.callback_loaded, t, i), o || X(e, i);
      }(0, n, t, e), tn(i);
    }, function (o) {
      !function (n, t, e, i) {
        var o = w(t);
        en(t, e, i), N(t, e.class_error), A(t, p), O(e.callback_error, t, i), o || X(e, i);
      }(0, n, t, e), tn(i);
    });
  },
      an = function an(n, t, e) {
    !function (n) {
      n.llTempImage = document.createElement("IMG");
    }(n), on(n, t, e), function (n) {
      S(n) || (n[_] = {
        backgroundImage: n.style.backgroundImage
      });
    }(n), function (n, t, e) {
      var i = I(n, t.data_bg),
          o = I(n, t.data_bg_hidpi),
          r = a && o ? o : i;
      r && (n.style.backgroundImage = 'url("'.concat(r, '")'), M(n).setAttribute(l, r), B(n, t, e));
    }(n, t, e), function (n, t, e) {
      var i = I(n, t.data_bg_multi),
          o = I(n, t.data_bg_multi_hidpi),
          r = a && o ? o : i;
      r && (n.style.backgroundImage = r, function (n, t, e) {
        N(n, t.class_applied), A(n, b), e && (t.unobserve_completed && z(n, t), O(t.callback_applied, n, e));
      }(n, t, e));
    }(n, t, e);
  },
      rn = function rn(n, t, e) {
    !function (n) {
      return W.indexOf(n.tagName) > -1;
    }(n) ? an(n, t, e) : function (n, t, e) {
      on(n, t, e), function (n, t, e) {
        var i = Q[n.tagName];
        i && (i(n, t), B(n, t, e));
      }(n, t, e);
    }(n, t, e);
  },
      cn = function cn(n) {
    n.removeAttribute(l), n.removeAttribute(s), n.removeAttribute(f);
  },
      un = function un(n) {
    D(n, function (n) {
      H(n, P);
    }), H(n, P);
  },
      ln = {
    IMG: un,
    IFRAME: function IFRAME(n) {
      H(n, F);
    },
    VIDEO: function VIDEO(n) {
      V(n, function (n) {
        H(n, F);
      }), H(n, j), n.load();
    }
  },
      sn = function sn(n, t) {
    (function (n) {
      var t = ln[n.tagName];
      t ? t(n) : function (n) {
        if (S(n)) {
          var t = U(n);
          n.style.backgroundImage = t.backgroundImage;
        }
      }(n);
    })(n), function (n, t) {
      L(n) || w(n) || (C(n, t.class_entered), C(n, t.class_exited), C(n, t.class_applied), C(n, t.class_loading), C(n, t.class_loaded), C(n, t.class_error));
    }(n, t), k(n), $(n);
  },
      fn = ["IMG", "IFRAME", "VIDEO"],
      dn = function dn(n) {
    return n.use_native && "loading" in HTMLImageElement.prototype;
  },
      _n = function _n(n, t, e) {
    n.forEach(function (n) {
      return function (n) {
        return n.isIntersecting || n.intersectionRatio > 0;
      }(n) ? function (n, t, e, i) {
        var o = function (n) {
          return x.indexOf(y(n)) >= 0;
        }(n);

        A(n, "entered"), N(n, e.class_entered), C(n, e.class_exited), function (n, t, e) {
          t.unobserve_entered && z(n, e);
        }(n, e, i), O(e.callback_enter, n, t, i), o || rn(n, e, i);
      }(n.target, n, t, e) : function (n, t, e, i) {
        L(n) || (N(n, e.class_exited), function (n, t, e, i) {
          e.cancel_on_exit && function (n) {
            return y(n) === g;
          }(n) && "IMG" === n.tagName && (tn(n), function (n) {
            D(n, function (n) {
              cn(n);
            }), cn(n);
          }(n), un(n), C(n, e.class_loading), R(i, -1), k(n), O(e.callback_cancel, n, t, i));
        }(n, t, e, i), O(e.callback_exit, n, t, i));
      }(n.target, n, t, e);
    });
  },
      gn = function gn(n) {
    return Array.prototype.slice.call(n);
  },
      vn = function vn(n) {
    return n.container.querySelectorAll(n.elements_selector);
  },
      bn = function bn(n) {
    return function (n) {
      return y(n) === p;
    }(n);
  },
      pn = function pn(n, t) {
    return function (n) {
      return gn(n).filter(L);
    }(n || vn(t));
  },
      hn = function hn(n, e) {
    var o = c(n);
    this._settings = o, this.loadingCount = 0, function (n, t) {
      i && !dn(n) && (t._observer = new IntersectionObserver(function (e) {
        _n(e, n, t);
      }, function (n) {
        return {
          root: n.container === document ? null : n.container,
          rootMargin: n.thresholds || n.threshold + "px"
        };
      }(n)));
    }(o, this), function (n, e) {
      t && window.addEventListener("online", function () {
        !function (n, t) {
          var e;
          (e = vn(n), gn(e).filter(bn)).forEach(function (t) {
            C(t, n.class_error), k(t);
          }), t.update();
        }(n, e);
      });
    }(o, this), this.update(e);
  };

  return hn.prototype = {
    update: function update(n) {
      var t,
          o,
          a = this._settings,
          r = pn(n, a);
      T(this, r.length), !e && i ? dn(a) ? function (n, t, e) {
        n.forEach(function (n) {
          -1 !== fn.indexOf(n.tagName) && function (n, t, e) {
            n.setAttribute("loading", "lazy"), on(n, t, e), function (n, t) {
              var e = Q[n.tagName];
              e && e(n, t);
            }(n, t), A(n, h);
          }(n, t, e);
        }), T(e, 0);
      }(r, a, this) : (o = r, function (n) {
        n.disconnect();
      }(t = this._observer), function (n, t) {
        t.forEach(function (t) {
          n.observe(t);
        });
      }(t, o)) : this.loadAll(r);
    },
    destroy: function destroy() {
      this._observer && this._observer.disconnect(), vn(this._settings).forEach(function (n) {
        $(n);
      }), delete this._observer, delete this._settings, delete this.loadingCount, delete this.toLoadCount;
    },
    loadAll: function loadAll(n) {
      var t = this,
          e = this._settings;
      pn(n, e).forEach(function (n) {
        z(n, t), rn(n, e, t);
      });
    },
    restoreAll: function restoreAll() {
      var n = this._settings;
      vn(n).forEach(function (t) {
        sn(t, n);
      });
    }
  }, hn.load = function (n, t) {
    var e = c(t);
    rn(n, e);
  }, hn.resetStatus = function (n) {
    k(n);
  }, t && function (n, t) {
    if (t) if (t.length) for (var e, i = 0; e = t[i]; i += 1) {
      u(n, e);
    } else u(n, t);
  }(hn, window.lazyLoadOptions), hn;
});
;
/**
 * @namespace aria
 */

var aria = aria || {};
/**
 * @desc
 *  Key code constants
 */

aria.KeyCode = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46
};
aria.Utils = aria.Utils || {}; // Polyfill src https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

aria.Utils.matches = function (element, selector) {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
      var matches = element.parentNode.querySelectorAll(s);
      var i = matches.length;

      while (--i >= 0 && matches.item(i) !== this) {}

      return i > -1;
    };
  }

  return element.matches(selector);
};

aria.Utils.remove = function (item) {
  if (item.remove && typeof item.remove === 'function') {
    return item.remove();
  }

  if (item.parentNode && item.parentNode.removeChild && typeof item.parentNode.removeChild === 'function') {
    return item.parentNode.removeChild(item);
  }

  return false;
};

aria.Utils.isFocusable = function (element) {
  if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute('tabIndex') !== null) {
    return true;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case 'A':
      return !!element.href && element.rel != 'ignore';

    case 'INPUT':
      return element.type != 'hidden' && element.type != 'file';

    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA':
      return true;

    default:
      return false;
  }
};

aria.Utils.getAncestorBySelector = function (element, selector) {
  if (!aria.Utils.matches(element, selector + ' ' + element.tagName)) {
    // Element is not inside an element that matches selector
    return null;
  } // Move up the DOM tree until a parent matching the selector is found


  var currentNode = element;
  var ancestor = null;

  while (ancestor === null) {
    if (aria.Utils.matches(currentNode.parentNode, selector)) {
      ancestor = currentNode.parentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return ancestor;
};

aria.Utils.hasClass = function (element, className) {
  return new RegExp('(\\s|^)' + className + '(\\s|$)').test(element.className);
};

aria.Utils.addClass = function (element, className) {
  if (!aria.Utils.hasClass(element, className)) {
    element.className += ' ' + className;
  }
};

aria.Utils.removeClass = function (element, className) {
  var classRegex = new RegExp('(\\s|^)' + className + '(\\s|$)');
  element.className = element.className.replace(classRegex, ' ').trim();
};

aria.Utils.bindMethods = function (object
/* , ...methodNames */
) {
  var methodNames = Array.prototype.slice.call(arguments, 1);
  methodNames.forEach(function (method) {
    object[method] = object[method].bind(object);
  });
};

;
/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

var aria = aria || {};
aria.Utils = aria.Utils || {};

(function () {
  var elemLock = document.querySelectorAll('[data-lock]');
  aria.Utils.IgnoreUtilFocusChanges = false;
  aria.Utils.dialogOpenClass = 'has-dialog';

  aria.Utils.focusFirstDescendant = function (element) {
    for (var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];

      if (aria.Utils.attemptFocus(child) || aria.Utils.focusFirstDescendant(child)) {
        return true;
      }
    }

    return false;
  };

  aria.Utils.focusLastDescendant = function (element) {
    for (var i = element.childNodes.length - 1; i >= 0; i--) {
      var child = element.childNodes[i];

      if (aria.Utils.attemptFocus(child) || aria.Utils.focusLastDescendant(child)) {
        return true;
      }
    }

    return false;
  };

  aria.Utils.attemptFocus = function (element) {
    if (!aria.Utils.isFocusable(element)) {
      return false;
    }

    aria.Utils.IgnoreUtilFocusChanges = true;

    try {
      element.focus();
    } catch (e) {}

    aria.Utils.IgnoreUtilFocusChanges = false;
    return document.activeElement === element;
  };
  /* Modals can open modals. Keep track of them with this array. */


  aria.OpenDialogList = aria.OpenDialogList || new Array(0);

  aria.getCurrentDialog = function () {
    if (aria.OpenDialogList && aria.OpenDialogList.length) {
      return aria.OpenDialogList[aria.OpenDialogList.length - 1];
    }
  };

  aria.closeCurrentDialog = function () {
    var currentDialog = aria.getCurrentDialog();

    if (currentDialog) {
      currentDialog.close();
      return true;
    }

    return false;
  };

  aria.handleEscape = function (event) {
    var key = event.which || event.keyCode;

    if (key === aria.KeyCode.ESC && aria.closeCurrentDialog()) {
      event.stopPropagation();
    }
  };

  document.addEventListener('keyup', aria.handleEscape);

  aria.Dialog = function (dialogId, focusAfterClosed, focusFirst) {
    this.dialogNode = document.getElementById(dialogId);

    if (this.dialogNode === null) {
      throw new Error('No element found with id="' + dialogId + '".');
    }

    var validRoles = ['dialog', 'alertdialog'];
    var isDialog = (this.dialogNode.getAttribute('role') || '').trim().split(/\s+/g).some(function (token) {
      return validRoles.some(function (role) {
        return token === role;
      });
    });

    if (!isDialog) {
      throw new Error('Dialog() requires a DOM element with ARIA role of dialog or alertdialog.');
    }

    var backdropClass = 'dialog-backdrop';

    if (this.dialogNode.parentNode.classList.contains(backdropClass)) {
      this.backdropNode = this.dialogNode.parentNode;
    } else {
      this.backdropNode = document.createElement('div');
      this.backdropNode.className = backdropClass;
      this.dialogNode.parentNode.insertBefore(this.backdropNode, this.dialogNode);
      this.backdropNode.appendChild(this.dialogNode);
    }

    this.backdropNode.classList.add('active'); // Disable scroll on the body element

    var scrollBarWidth = calculateScrollBarWidth();

    if (!document.body.classList.contains(aria.Utils.dialogOpenClass)) {
      if (elemLock) {
        for (var i = 0; i < elemLock.length; i++) {
          elemLock[i].style.paddingRight = scrollBarWidth + 'px';
        }
      }

      document.body.style.paddingRight = scrollBarWidth + 'px';
      document.body.classList.add(aria.Utils.dialogOpenClass);
    }

    if (typeof focusAfterClosed === 'string') {
      this.focusAfterClosed = document.getElementById(focusAfterClosed);
    } else if (_typeof(focusAfterClosed) === 'object') {
      this.focusAfterClosed = focusAfterClosed;
    } else {
      throw new Error('the focusAfterClosed parameter is required for the aria.Dialog constructor.');
    }

    if (typeof focusFirst === 'string') {
      this.focusFirst = document.getElementById(focusFirst);
    } else if (_typeof(focusFirst) === 'object') {
      this.focusFirst = focusFirst;
    } else {
      this.focusFirst = null;
    }

    var preDiv = document.createElement('div');
    this.preNode = this.dialogNode.parentNode.insertBefore(preDiv, this.dialogNode);
    this.preNode.tabIndex = 0;
    var postDiv = document.createElement('div');
    this.postNode = this.dialogNode.parentNode.insertBefore(postDiv, this.dialogNode.nextSibling);
    this.postNode.tabIndex = 0;

    if (aria.OpenDialogList.length > 0) {
      aria.getCurrentDialog().removeListeners();
    }

    this.addListeners();
    aria.OpenDialogList.push(this);
    this.clearDialog(); // this.dialogNode.className = 'default_dialog'; // make visible

    this.dialogNode.classList.add('active'); // make visible

    if (this.focusFirst) {
      this.focusFirst.focus();
    } else {
      aria.Utils.focusFirstDescendant(this.dialogNode);
    }

    this.lastFocus = document.activeElement;
  }; // end Dialog constructor


  aria.Dialog.prototype.clearDialog = function () {
    Array.prototype.map.call(this.dialogNode.querySelectorAll('input'), function (input) {
      input.value = '';
    });
  };

  aria.Dialog.prototype.close = function () {
    aria.OpenDialogList.pop();
    this.removeListeners();
    aria.Utils.remove(this.preNode);
    aria.Utils.remove(this.postNode); // this.dialogNode.className = 'hidden';

    this.dialogNode.classList.remove('active');
    this.backdropNode.classList.remove('active');
    this.focusAfterClosed.focus();

    if (aria.OpenDialogList.length > 0) {
      aria.getCurrentDialog().addListeners();
    } else {
      this.backdropNode.addEventListener('transitionend', rezetStyle);
    }
  };

  function rezetStyle(e) {
    if (e.propertyName == 'opacity') {
      if (!this.classList.contains('active')) {
        if (elemLock) {
          for (var i = 0; i < elemLock.length; i++) {
            elemLock[i].style.paddingRight = '0px';
          }
        }

        this.removeEventListener('transitionend', rezetStyle);
        document.body.classList.remove(aria.Utils.dialogOpenClass);
        document.body.style.paddingRight = '0px';
      }
    }
  }

  aria.Dialog.prototype.replace = function (newDialogId, newFocusAfterClosed, newFocusFirst) {
    var closedDialog = aria.getCurrentDialog();
    aria.OpenDialogList.pop();
    this.removeListeners();
    aria.Utils.remove(this.preNode);
    aria.Utils.remove(this.postNode); // this.dialogNode.className = 'hidden';

    this.dialogNode.classList.remove('active');
    this.backdropNode.classList.remove('active');
    var focusAfterClosed = newFocusAfterClosed || this.focusAfterClosed;
    var dialog = new aria.Dialog(newDialogId, focusAfterClosed, newFocusFirst);
  };

  aria.Dialog.prototype.addListeners = function () {
    document.addEventListener('focus', this.trapFocus, true);
  };

  aria.Dialog.prototype.removeListeners = function () {
    document.removeEventListener('focus', this.trapFocus, true);
  };

  aria.Dialog.prototype.trapFocus = function (event) {
    if (aria.Utils.IgnoreUtilFocusChanges) {
      return;
    }

    var currentDialog = aria.getCurrentDialog();

    if (currentDialog.dialogNode.contains(event.target)) {
      currentDialog.lastFocus = event.target;
    } else {
      aria.Utils.focusFirstDescendant(currentDialog.dialogNode);

      if (currentDialog.lastFocus == document.activeElement) {
        aria.Utils.focusLastDescendant(currentDialog.dialogNode);
      }

      currentDialog.lastFocus = document.activeElement;
    }
  };

  window.openDialog = function (dialogId, focusAfterClosed, focusFirst) {
    var dialog = new aria.Dialog(dialogId, focusAfterClosed, focusFirst);
  };

  window.closeDialog = function (closeButton) {
    var topDialog = aria.getCurrentDialog();

    if (topDialog.dialogNode.contains(closeButton)) {
      topDialog.close();
    }
  };

  window.replaceDialog = function (newDialogId, newFocusAfterClosed, newFocusFirst) {
    var topDialog = aria.getCurrentDialog();

    if (topDialog.dialogNode.contains(document.activeElement)) {
      topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
    }
  }; // ===== close modal click backdrop =====


  window.clickBtnClose = function (el) {
    if (el == event.target) {
      aria.getCurrentDialog().close();
    }
  };

  function calculateScrollBarWidth() {
    return window.innerWidth - document.body.clientWidth;
  }
})();

; // ===== polyfills =====

(function () {
  'use_strict';

  if (!window.IntersectionObserver) {
    loadScript('js/polyfills/intersection-observer.min.js');
  }

  function loadScript(src) {
    var js = document.createElement('script');
    js.src = src;
    js.async = false;
    document.body.appendChild(js);
  } // Polyfill forEach for IE11


  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;

      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
})();