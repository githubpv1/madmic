"use strict";

// ===== webp =====

(function () {
  function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  testWebP(function (support) {
    if (support == true) {
      document.querySelector('body').classList.add('webp');
    } else {
      document.querySelector('body').classList.add('no-webp');
    }
  });
})();

// ==== rezet focus ====

(function () {
  var button = document.querySelectorAll('a, button, label, input');
  var isMouseDown = false;
  for (var i = 0; i < button.length; i++) {
    var el = button[i];
    if (el.tagName !== 'LABEL') {
      el.classList.add('focus');
    }
    el.addEventListener('mousedown', function () {
      this.classList.remove('focus');
      isMouseDown = true;
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === "Tab") {
        isMouseDown = false;
      }
    });
    el.addEventListener('focus', function () {
      if (isMouseDown) {
        this.classList.remove('focus');
      }
    });
    el.addEventListener('blur', function () {
      this.classList.add('focus');
    });
  }
})();

// ===== adaptiv =====

(function () {
  var dataMove = document.querySelector('[data-move]');
  if (dataMove) {
    var move = function move(num) {
      var itemsMove = document.querySelectorAll('[data-media="' + num + '"]');
      if (itemsMove) {
        for (var i = 0; i < itemsMove.length; i++) {
          var itemMove = itemsMove[i];
          var itemNamber = itemMove.getAttribute('data-move');
          var startMove = document.querySelector('[data-start="' + itemNamber + '"]');
          var whereMove = document.querySelector('[data-where="' + itemNamber + '"]');
          if (mqls[num].matches) {
            if (!itemMove.classList.contains('done')) {
              whereMove.appendChild(itemMove);
              itemMove.classList.add('done');
            }
          } else {
            if (itemMove.classList.contains('done')) {
              startMove.appendChild(itemMove);
              itemMove.classList.remove('done');
            }
          }
        }
      }
    };
    var mqls = [
    // window.matchMedia('(max-width: 991px)'),
    window.matchMedia('(max-width: 61.94em)'),
    // window.matchMedia('(max-width: 1199px)'),
    window.matchMedia('(max-width: 74.94em)')
    // window.matchMedia('(min-width: 768px) and (max-width: 1199px)'),
    ];

    for (var i = 0; i < mqls.length; i++) {
      mqls[i].addListener(move.bind(null, i));
      // mqls[i].addEventListener('change', move);
      move(i);
    }
  }
})();

// ===== lazyload img =====

(function () {
  var images = document.querySelectorAll('img[loading="lazy"]');
  var sources = document.querySelectorAll("source[data-srcset]");
  if ("loading" in HTMLImageElement.prototype) {
    images.forEach(function (img) {
      img.src = img.dataset.src;
    });
    sources.forEach(function (source) {
      source.srcset = source.dataset.srcset;
    });
  } else {
    var options = {
      threshold: 0,
      rootMargin: '0px 0px 500px 0px'
    };
    var lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.src = entry.target.dataset.src;
          lazyImageObserver.unobserve(entry.target);
        }
      });
    }, options);
    var lazySourceObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.srcset = entry.target.dataset.srcset;
          lazySourceObserver.unobserve(entry.target);
        }
      });
    }, options);
    images.forEach(function (image) {
      lazyImageObserver.observe(image);
    });
    sources.forEach(function (source) {
      lazySourceObserver.observe(source);
    });
  }
})();

/**************** 
		navigation 
****************/

// ===== navigation ===== 

(function () {
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.navbar');
  var menu = document.querySelector('.menu');
  var head = document.querySelector('.head');
  var overlay = document.querySelector('.overlay');
  var body = document.querySelector('body');
  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }
  function toggleMenu() {
    this.classList.toggle('active');
    nav.classList.toggle('active');
    head.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('lock');
    // swipe(nav);
  }

  function closeMenu() {
    burger.classList.remove('active');
    nav.classList.remove('active');
    head.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('lock');
  }
  var links = menu.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', closeMenu);
  }

  // ===== head =====

  if (head) {
    var smallHead = function smallHead() {
      if (window.pageYOffset) {
        head.classList.add('scroll');
        if (overlay) {
          overlay.classList.add('scroll');
        }
      } else {
        head.classList.remove('scroll');
        if (overlay) {
          overlay.classList.remove('scroll');
        }
      }
    }; // ===== hide head =====
    var hideHead = function hideHead() {
      if (start) {
        start = false;
        setTimeout(function () {
          var scrollPos = window.pageYOffset;
          var headHeight = head.offsetHeight;
          if (!head.classList.contains('active')) {
            if (scrollPos > headHeight && scrollPos > lastScrollPos) {
              head.classList.add('hide');
            } else {
              head.classList.remove('hide');
            }
          }
          lastScrollPos = scrollPos;
          start = true;
        }, 200);
      }
    };
    document.addEventListener('scroll', smallHead);
    document.addEventListener('scroll', hideHead);
    var lastScrollPos = 0;
    var start = true;
  }
})();
function scrollMenu(nav, offset, hideHead, speed, easing) {
  var menu = document.querySelector(nav);
  var menuHeight;
  if (offset) {
    var head = document.querySelector(offset);
    if (head) {
      menuHeight = head.clientHeight;
      // отступ под меню
      // document.body.style.paddingTop = menuHeight + 'px';
    } else {
      menuHeight = 0;
    }
  } else {
    menuHeight = 0;
  }
  function fncAnimation(callback) {
    window.setTimeout(callback, 1000 / 60);
  }
  ;
  window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || fncAnimation;
  }();
  function scrollToY(height, speed, easing) {
    var scrollTargetY = height || 0;
    scrollTargetY += 2;
    var speed = speed || 2000;
    var easing = easing || 'easeOutSine';
    var scrollY = window.pageYOffset;
    var currentTime = 0;
    var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8));
    var easingEquations = {
      easeOutSine: function easeOutSine(pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function easeInOutSine(pos) {
        return -0.5 * (Math.cos(Math.PI * pos) - 1);
      },
      easeInOutQuint: function easeInOutQuint(pos) {
        /* eslint-disable-next-line */
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow(pos - 2, 5) + 2);
      }
    };
    function tick() {
      currentTime += 1 / 60;
      var p = currentTime / time;
      var t = easingEquations[easing](p);
      if (p < 1) {
        window.requestAnimFrame(tick);
        window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
      } else {
        window.scrollTo(0, scrollTargetY);
      }
    }
    tick();
  }
  ;
  function menuControl(menu) {
    var links = menu.querySelectorAll('a[href^="#"]');
    var scrollY = window.pageYOffset;
    for (var i = 0; i < links.length; i += 1) {
      var currLink = links[i];
      var refElement = document.querySelector(currLink.getAttribute('href'));
      if (refElement) {
        var box = refElement.getBoundingClientRect();
        var topElem = box.top + scrollY - menuHeight;
        if (topElem <= scrollY && topElem + refElement.clientHeight > scrollY) {
          currLink.classList.add('active');
        } else {
          currLink.classList.remove('active');
        }
      }
    }
  }
  function control(e) {
    e.preventDefault();
    if (head) {
      menuHeight = head.clientHeight;
    } else {
      menuHeight = 0;
    }
    var elem = document.querySelector(this.hash);
    if (elem) {
      var box = elem.getBoundingClientRect();
      var topElem = box.top + window.pageYOffset;
      if (box.top > 0 && hideHead) {
        scrollToY(topElem, speed, easing);
      } else {
        scrollToY(topElem - menuHeight, speed, easing);
      }
    }
  }
  var links = document.querySelectorAll('a[href^="#"]');
  for (var i = 0; i < links.length; i += 1) {
    links[i].addEventListener('click', control);
  }
  document.addEventListener('scroll', function () {
    menuControl(menu);
  });
}
scrollMenu('.menu', '.head', true);

// ===== menu drop ===== 

(function () {
  var btnDrop = document.querySelectorAll('[data-drop]');
  if (btnDrop) {
    for (var i = 0; i < btnDrop.length; i++) {
      var link = btnDrop[i].parentElement.querySelector('a');
      var label = '<span class="visually-hidden">открыть подменю для“' + link.text + '”</span>';
      btnDrop[i].insertAdjacentHTML('beforeend', label);
      btnDrop[i].addEventListener('click', function (e) {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          this.nextElementSibling.classList.remove('show');
          this.setAttribute('aria-expanded', "false");
          this.parentElement.querySelector('a').setAttribute('aria-expanded', "false");
        } else {
          this.classList.add('active');
          this.nextElementSibling.classList.add('show');
          this.setAttribute('aria-expanded', "true");
          this.parentElement.querySelector('a').setAttribute('aria-expanded', "true");
        }
      });
    }
  }
})();

/**************** 
			form 
****************/

// ====== validate and sendform ========

(function () {
  var form = document.querySelectorAll('form');
  if (form) {
    for (var i = 0; i < form.length; i++) {
      form[i].addEventListener('submit', ajaxSend);
    }
  }
  var reg = document.querySelectorAll('input[required]');
  if (reg) {
    for (var i = 0; i < reg.length; i++) {
      reg[i].addEventListener('blur', check);
      reg[i].addEventListener('focus', rezet);
    }
  }
  function rezet() {
    var error = this.parentElement.querySelector('.error');
    this.classList.remove('invalid');
    if (error) {
      error.classList.remove('active');
      error.addEventListener('transitionend', function () {
        if (!this.classList.contains('active')) {
          this.innerHTML = '';
        }
      });
    }
  }
  function check() {
    var error = this.parentElement.querySelector('.error');
    if (!this.validity.valid) {
      this.classList.add('invalid');
      if (error) {
        error.classList.add('active');
        error.innerHTML = 'ошибка / неправильный формат';
        if (this.validity.valueMissing || this.value === '') {
          error.classList.add('active');
          error.innerHTML = 'ошибка / заполните поле';
        }
      }
      return 1;
    } else {
      return 0;
    }
  }
  var messageBoxId; // popup

  function validate(e) {
    var test = this.hasAttribute('data-test');
    messageBoxId = this.getAttribute('data-message');
    var reg = this.querySelectorAll('input[required]');
    var agree = this.querySelector('input[name="agree"]');
    var countError = 0;
    if (!agree || agree.checked) {
      for (var i = 0; i < reg.length; i++) {
        var input = reg[i];
        countError += check.call(input);
        if (countError) {
          e.preventDefault();
        }
      }
    } else {
      e.preventDefault();
      countError++;
    }
    if (test && countError === 0) {
      e.preventDefault();
      countError++;
      this.reset();
      setDate.call(this, 'test');
    }
    return countError;
  }
  function ajaxSend(e) {
    e.preventDefault();
    var el = this;
    var error = validate.call(el, e);
    if (error === 0) {
      this.classList.add('sending');
      var formData = new FormData(this);
      var xhr = new XMLHttpRequest();
      xhr.open("POST", this.getAttribute("action"));
      xhr.send(formData);
      xhr.onloadend = function () {
        if (xhr.status == 200) {
          el.reset();
          var select = el.querySelector('select');
          if (select) {
            select.options[0].selected = 'selected';
            select.dispatchEvent(new Event('change'));
          }
          el.classList.remove('sending');
          setDate.call(el, xhr.response);
        } else {
          alert('Ошибка' + this.status);
          // console.log('Ошибка' + this.status);
          el.classList.remove('sending');
        }
      };
    }
  }

  // вывод ответа сервера в popup

  function setDate(data) {
    if (messageBoxId) {
      var messageBox = document.querySelector('#dialog-' + messageBoxId);
      var parent = this.closest('.dialog-backdrop');
      if (messageBox) {
        var messageText = messageBox.querySelector('[data-message-text]');
        if (messageText) {
          messageText.textContent = data;
        }
        if (parent) {
          window.replaceDialog('dialog-' + messageBoxId);
          // window.openDialog('dialog-' + messageBoxId, this);
        } else {
          window.openDialog('dialog-' + messageBoxId, this);
        }
      }
    }
  }
})();

// ===== .focus parent-input =====

(function () {
  var input = document.querySelectorAll('input');
  if (input) {
    for (var i = 0; i < input.length; i++) {
      input[i].addEventListener('focus', function () {
        this.parentElement.classList.add('focus');
      });
      input[i].addEventListener('blur', function () {
        this.parentElement.classList.remove('focus');
      });
    }
  }
})();

// ==== select gibrid-4 ====

(function () {
  var natives = document.querySelectorAll('[data-select]');
  if (natives) {
    var select = function select(i) {
      var native = natives[i];
      var nativeClass = native.classList;
      var parent = native.parentElement;
      var optionInvalid = native.querySelector('.invalid');
      var optionChecked = native.querySelector('option:checked');
      var optionCheckedText = optionChecked.textContent;
      var optionCheckedValue = optionChecked.value;
      var optionCheckedIndex;
      var optionsClass = [];
      createSelectCustom(native);
      function createClass(addClass) {
        if (nativeClass) {
          var customClass = '';
          for (var i = 0; i < nativeClass.length; i++) {
            customClass = customClass + ' ' + nativeClass[i] + addClass;
          }
          return customClass;
        }
      }
      function createSelectCustom(select) {
        var options = select.querySelectorAll('option');
        var selectedClass = optionChecked.getAttribute('class');
        var selectBtn;
        if (optionInvalid) {
          selectBtn = '<div class="' + createClass('-custom__btn') + ' invalid">' + optionCheckedText + '</div>';
        } else {
          selectBtn = '<div class="' + createClass('-custom__btn') + selectedClass + '">' + optionCheckedText + '</div>';
        }
        parent.insertAdjacentHTML('beforeend', '<div class="' + createClass('-custom') + '" aria-hidden="true">' + selectBtn + '<div class="' + createClass('-custom__options') + '">' + createCustomOptions(options) + '' + '</div></div></div>');
      }
      function createCustomOptions(options) {
        if (options) {
          var customOptions = '';
          for (var i = 0; i < options.length; i++) {
            var option = options[i];
            var optionValue = option.value;
            if (!option.hasAttribute('hidden')) {
              var optionClass = option.getAttribute('class') || '';
              optionsClass.push(optionClass);
            }
            if (option == optionChecked) {
              optionCheckedIndex = i;
            }
            if (optionValue != '') {
              var optionText = option.text;
              customOptions = customOptions + '<div data-value="' + optionValue + '" class="' + createClass('-custom__option') + ' ' + optionClass + ' ">' + optionText + '</div>';
            }
          }
          return customOptions;
        }
      }
      var selectCustom = native.nextElementSibling;
      var selectCustomBtn = selectCustom.children[0];
      var selectCustomOpts = selectCustom.children[1];
      var customOptsList = [].slice.call(selectCustomOpts.children, 0);
      ;
      var optionsCount = customOptsList.length;
      var optionHoveredIndex = -1;
      if (optionCheckedValue) {
        updateCustomSelectChecked(optionCheckedValue, optionCheckedText, optionCheckedIndex);
      }
      selectCustomBtn.addEventListener("click", function (e) {
        var isClosed = !selectCustom.classList.contains("isActive");
        if (isClosed) {
          openSelectCustom();
        } else {
          closeSelectCustom();
        }
      });
      function openSelectCustom() {
        selectCustom.classList.add("isActive");
        parent.classList.add("isActive");
        selectCustom.setAttribute("aria-hidden", false);
        if (optionCheckedValue) {
          for (var i = 0; i < customOptsList.length; i++) {
            var customValue = customOptsList[i].getAttribute("data-value");
            if (customValue === optionCheckedValue) {
              optionCheckedIndex = i;
            }
          }
          updateCustomSelectHovered(optionCheckedIndex);
        }
        document.addEventListener("click", watchClickOutside);
        document.addEventListener("keydown", supportKeyboardNavigation);
      }
      function closeSelectCustom() {
        selectCustom.classList.remove("isActive");
        parent.classList.remove("isActive");
        selectCustom.setAttribute("aria-hidden", true);
        updateCustomSelectHovered(-1);
        document.removeEventListener("click", watchClickOutside);
        document.removeEventListener("keydown", supportKeyboardNavigation);
      }
      function updateCustomSelectHovered(newIndex) {
        var prevOption = selectCustomOpts.children[optionHoveredIndex];
        var option = selectCustomOpts.children[newIndex];
        if (prevOption) {
          prevOption.classList.remove("isHover");
        }
        if (option) {
          option.classList.add("isHover");
        }
        optionHoveredIndex = newIndex;
      }
      function updateCustomSelectChecked(value, text, optionIndex) {
        var prevValue = optionCheckedValue;
        var elPrevOption = selectCustomOpts.querySelector("[data-value=\"".concat(prevValue, "\""));
        var elOption = selectCustomOpts.querySelector("[data-value=\"".concat(value, "\""));
        if (elPrevOption) {
          elPrevOption.classList.remove("isActive");
        }
        if (elOption) {
          elOption.classList.add("isActive");
        }
        selectCustomBtn.textContent = text;
        selectCustomBtn.className = createClass('-custom__btn') + ' ' + optionsClass[optionIndex];
        optionCheckedValue = value;
      }
      function watchClickOutside(e) {
        var didClickedOutside = !selectCustom.contains(e.target);
        if (didClickedOutside) {
          closeSelectCustom();
        }
      }
      function supportKeyboardNavigation(e) {
        // press down -> go next
        if (e.keyCode === 40 && optionHoveredIndex < optionsCount - 1) {
          var index = optionHoveredIndex;
          e.preventDefault(); // prevent page scrolling
          updateCustomSelectHovered(optionHoveredIndex + 1);
        }

        // press up -> go previous
        if (e.keyCode === 38 && optionHoveredIndex > 0) {
          e.preventDefault(); // prevent page scrolling
          updateCustomSelectHovered(optionHoveredIndex - 1);
        }

        // press Enter or space -> select the option
        if (e.keyCode === 13 || e.keyCode === 32) {
          e.preventDefault();
          var option = selectCustomOpts.children[optionHoveredIndex];
          var value = option && option.getAttribute("data-value");
          //  console.log(option);

          if (value) {
            native.value = value;
            updateCustomSelectChecked(value, option.textContent);
          }
          closeSelectCustom();
        }

        // press ESC -> close selectCustom
        if (e.keyCode === 27) {
          closeSelectCustom();
        }
      }
      function getIndex(el) {
        for (var i = 0; el = el.previousElementSibling; i++);
        return i;
      }
      native.addEventListener("change", function (e) {
        var value = e.target.value;
        if (value) {
          var respectiveCustomOpt = selectCustomOpts.querySelector("[data-value=\"".concat(value, "\"]"));
          var index = getIndex(respectiveCustomOpt);
          updateCustomSelectChecked(value, respectiveCustomOpt.textContent, index);
        } else {
          // rezet select

          selectCustomBtn.textContent = optionCheckedText;
          selectCustomBtn.classList.add("invalid");
          optionCheckedValue = '';
          for (var i = 0; i < customOptsList.length; i++) {
            customOptsList[i].classList.remove("isActive");
          }
        }
      });
      for (var i = 0; i < customOptsList.length; i++) {
        func(i);
      }
      function func(i) {
        var el = customOptsList[i];
        el.addEventListener("click", function (e) {
          var value = e.target.getAttribute("data-value");
          native.value = value;
          updateCustomSelectChecked(value, e.target.textContent, i);
          closeSelectCustom();
        });
        el.addEventListener("mouseenter", function (e) {
          updateCustomSelectHovered(i);
        });
      }

      // ===== select gibrid arrow =====

      native.addEventListener('click', function () {
        parent.classList.toggle('oupen');
      });
      native.addEventListener('keydown', function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          parent.classList.toggle('oupen');
        }
      });
      native.addEventListener('focus', function () {
        parent.classList.add('focus');
      });
      native.addEventListener('blur', function () {
        parent.classList.remove('oupen');
        parent.classList.remove('focus');
      });
    };
    for (var i = 0; i < natives.length; i++) {
      select(i);
    }
  }
})();

/**************** 
		animation 
****************/

// ===== animation on scroll transition ===== 

(function () {
  var animes = document.querySelectorAll('[data-aos]');
  var options = {
    threshold: 0.5
    // rootMargin: '0px 0px -100px 0px',
  };

  // 1 - один раз

  var callback = function callback(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        animObserver.unobserve(entry.target);
      }
    });
  };

  // 2  - при прокрутке блока ниже окна - анимация повторится

  var callback2 = function callback2(entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var scrollIn = window.pageYOffset;
        entry.target.setAttribute('data-in', scrollIn);
        entry.target.classList.add('aos-animate');
      } else {
        var scrollOut = window.pageYOffset;
        if (entry.target.getAttribute('data-in') > scrollOut) {
          entry.target.classList.remove('aos-animate');
        }
      }
    });
  };

  // 3  - при прокрутке блока выше и ниже окна анимация повторится

  var callback3 = function callback3(entries, observer) {
    console.log(entries);
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      } else {
        entry.target.classList.remove('animated');
      }
    });
  };
  var animObserver = new IntersectionObserver(callback2, options);
  animes.forEach(function (anim) {
    animObserver.observe(anim);
  });
})();