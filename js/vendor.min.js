



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

aria.Utils = aria.Utils || {};

// Polyfill src https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
aria.Utils.matches = function (element, selector) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
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
  if (item.parentNode &&
      item.parentNode.removeChild &&
      typeof item.parentNode.removeChild === 'function') {
    return item.parentNode.removeChild(item);
  }
  return false;
};

aria.Utils.isFocusable = function (element) {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
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
  }

  // Move up the DOM tree until a parent matching the selector is found
  var currentNode = element;
  var ancestor = null;
  while (ancestor === null) {
    if (aria.Utils.matches(currentNode.parentNode, selector)) {
      ancestor = currentNode.parentNode;
    }
    else {
      currentNode = currentNode.parentNode;
    }
  }

  return ancestor;
};

aria.Utils.hasClass = function (element, className) {
  return (new RegExp('(\\s|^)' + className + '(\\s|$)')).test(element.className);
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

aria.Utils.bindMethods = function (object /* , ...methodNames */) {
  var methodNames = Array.prototype.slice.call(arguments, 1);
  methodNames.forEach(function (method) {
    object[method] = object[method].bind(object);
  });
};

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
			if (aria.Utils.attemptFocus(child) ||
				aria.Utils.focusFirstDescendant(child)) {
				return true;
			}
		}
		return false;
	};

	aria.Utils.focusLastDescendant = function (element) {
		for (var i = element.childNodes.length - 1; i >= 0; i--) {
			var child = element.childNodes[i];
			if (aria.Utils.attemptFocus(child) ||
				aria.Utils.focusLastDescendant(child)) {
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
		}
		catch (e) {
		}
		aria.Utils.IgnoreUtilFocusChanges = false;
		return (document.activeElement === element);
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
		var isDialog = (this.dialogNode.getAttribute('role') || '')
			.trim()
			.split(/\s+/g)
			.some(function (token) {
				return validRoles.some(function (role) {
					return token === role;
				});
			});
		if (!isDialog) {
			throw new Error(
				'Dialog() requires a DOM element with ARIA role of dialog or alertdialog.');
		}


		var backdropClass = 'dialog-backdrop';
		if (this.dialogNode.parentNode.classList.contains(backdropClass)) {
			this.backdropNode = this.dialogNode.parentNode;
		}
		else {
			this.backdropNode = document.createElement('div');
			this.backdropNode.className = backdropClass;
			this.dialogNode.parentNode.insertBefore(this.backdropNode, this.dialogNode);
			this.backdropNode.appendChild(this.dialogNode);
		}
		this.backdropNode.classList.add('active');

		// Disable scroll on the body element

		var scrollBarWidth = calculateScrollBarWidth();
		if (!document.body.classList.contains(aria.Utils.dialogOpenClass)) {
			if (elemLock) {
				for (let i = 0; i < elemLock.length; i++) {
					elemLock[i].style.paddingRight = scrollBarWidth + 'px';
				}
			}
			document.body.style.paddingRight = scrollBarWidth + 'px';
			document.body.classList.add(aria.Utils.dialogOpenClass);
		}

		if (typeof focusAfterClosed === 'string') {
			this.focusAfterClosed = document.getElementById(focusAfterClosed);
		}
		else if (typeof focusAfterClosed === 'object') {
			this.focusAfterClosed = focusAfterClosed;
		}
		else {
			throw new Error(
				'the focusAfterClosed parameter is required for the aria.Dialog constructor.');
		}

		if (typeof focusFirst === 'string') {
			this.focusFirst = document.getElementById(focusFirst);
		}
		else if (typeof focusFirst === 'object') {
			this.focusFirst = focusFirst;
		}
		else {
			this.focusFirst = null;
		}


		var preDiv = document.createElement('div');
		this.preNode = this.dialogNode.parentNode.insertBefore(preDiv,
			this.dialogNode);
		this.preNode.tabIndex = 0;
		var postDiv = document.createElement('div');
		this.postNode = this.dialogNode.parentNode.insertBefore(postDiv,
			this.dialogNode.nextSibling);
		this.postNode.tabIndex = 0;


		if (aria.OpenDialogList.length > 0) {
			aria.getCurrentDialog().removeListeners();
		}

		this.addListeners();
		aria.OpenDialogList.push(this);
		this.clearDialog();
		// this.dialogNode.className = 'default_dialog'; // make visible
		this.dialogNode.classList.add('active'); // make visible

		if (this.focusFirst) {
			this.focusFirst.focus();
		}
		else {
			aria.Utils.focusFirstDescendant(this.dialogNode);
		}

		this.lastFocus = document.activeElement;
	};
	
	// end Dialog constructor


	aria.Dialog.prototype.clearDialog = function () {
		Array.prototype.map.call(
			this.dialogNode.querySelectorAll('input'),
			function (input) {
				input.value = '';
			}
		);
	};

	aria.Dialog.prototype.close = function () {
		aria.OpenDialogList.pop();
		this.removeListeners();
		aria.Utils.remove(this.preNode);
		aria.Utils.remove(this.postNode);
		// this.dialogNode.className = 'hidden';
		this.dialogNode.classList.remove('active');
		this.backdropNode.classList.remove('active');
		this.focusAfterClosed.focus();

		if (aria.OpenDialogList.length > 0) {
			aria.getCurrentDialog().addListeners();
		}
		else {
			this.backdropNode.addEventListener('transitionend', rezetStyle);
		}
	};

	function rezetStyle(e) {
		if (e.propertyName == 'opacity') {
			if (!this.classList.contains('active')) {
				if (elemLock) {
					for (let i = 0; i < elemLock.length; i++) {
						elemLock[i].style.paddingRight = '0px';
					}
				}
				this.removeEventListener('transitionend', rezetStyle);
				document.body.classList.remove(aria.Utils.dialogOpenClass);
				document.body.style.paddingRight = '0px';
			}
		}
	}

	aria.Dialog.prototype.replace = function (newDialogId, newFocusAfterClosed,
		newFocusFirst) {
		var closedDialog = aria.getCurrentDialog();
		aria.OpenDialogList.pop();
		this.removeListeners();
		aria.Utils.remove(this.preNode);
		aria.Utils.remove(this.postNode);
		// this.dialogNode.className = 'hidden';
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
		}
		else {
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

	window.replaceDialog = function (newDialogId, newFocusAfterClosed,
		newFocusFirst) {
		var topDialog = aria.getCurrentDialog();
		if (topDialog.dialogNode.contains(document.activeElement)) {
			topDialog.replace(newDialogId, newFocusAfterClosed, newFocusFirst);
		}
	};

	// ===== close modal click backdrop =====

	window.clickBtnClose = function (el) {
		if (el == event.target) {
			aria.getCurrentDialog().close();
		}
	};

	function calculateScrollBarWidth() {
		return window.innerWidth - document.body.clientWidth;
	}
}());


