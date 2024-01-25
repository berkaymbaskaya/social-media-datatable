import {
  Deferred,
  MemorizedCallbacks,
  _extends,
  addShadowDomStyles,
  beforeCleanData,
  call_once_default,
  callbacks_default,
  class_default,
  cleanDataRecursive,
  compileGetter,
  compileSetter,
  config_default,
  data,
  deferRender,
  deferRenderer,
  dom_adapter_default,
  each,
  ensureDefined,
  equalByValue,
  error_default,
  errors_default,
  event_registrator_callbacks_default,
  events_engine_default,
  extend,
  findBestMatches,
  getHeight,
  getNavigator,
  getOuterHeight,
  getOuterWidth,
  getPathParts,
  getWidth,
  getWindow,
  grep,
  hasProperty,
  hasWindow,
  isDefined,
  isEmptyObject,
  isEvent,
  isExponential,
  isFunction,
  isObject,
  isPlainObject,
  isPromise,
  isRenderer,
  isString,
  isWindow,
  map,
  noop,
  orderEach,
  pairToObject,
  parseHTML,
  ready_callbacks_default,
  removeData,
  renderer_default,
  setStyle,
  splitPair,
  styleProp,
  stylePropPrefix,
  toComparable,
  type,
  version,
  when
} from "./chunk-QQNEH2Z2.js";
import {
  __export
} from "./chunk-EHLZM3EC.js";

// node_modules/devextreme/esm/core/utils/view_port.js
var ready = ready_callbacks_default.add;
var changeCallback = callbacks_default();
var $originalViewPort = renderer_default();
var value = /* @__PURE__ */ function() {
  var $current;
  return function(element) {
    if (!arguments.length) {
      return $current;
    }
    var $element = renderer_default(element);
    $originalViewPort = $element;
    var isNewViewportFound = !!$element.length;
    var prevViewPort = value();
    $current = isNewViewportFound ? $element : renderer_default("body");
    changeCallback.fire(isNewViewportFound ? value() : renderer_default(), prevViewPort);
  };
}();
ready(function() {
  value(".dx-viewport");
});
function originalViewPort() {
  return $originalViewPort;
}

// node_modules/devextreme/esm/core/utils/support.js
var support_exports = {};
__export(support_exports, {
  animation: () => animation,
  inputType: () => inputType,
  nativeScrolling: () => nativeScrolling,
  pointerEvents: () => pointerEvents,
  styleProp: () => styleProp,
  stylePropPrefix: () => stylePropPrefix,
  supportProp: () => supportProp,
  touch: () => touch,
  touchEvents: () => touchEvents,
  transition: () => transition,
  transitionEndEventName: () => transitionEndEventName
});

// node_modules/devextreme/esm/core/utils/resize_callbacks.js
var resizeCallbacks = function() {
  var prevSize;
  var callbacks = callbacks_default();
  var originalCallbacksAdd = callbacks.add;
  var originalCallbacksRemove = callbacks.remove;
  if (!hasWindow()) {
    return callbacks;
  }
  var formatSize = function() {
    var window11 = getWindow();
    return {
      width: window11.innerWidth,
      height: window11.innerHeight
    };
  };
  var handleResize = function() {
    var now = formatSize();
    if (now.width === prevSize.width && now.height === prevSize.height) {
      return;
    }
    var changedDimension;
    if (now.width === prevSize.width) {
      changedDimension = "height";
    }
    if (now.height === prevSize.height) {
      changedDimension = "width";
    }
    prevSize = now;
    callbacks.fire(changedDimension);
  };
  var setPrevSize = call_once_default(function() {
    prevSize = formatSize();
  });
  var removeListener;
  callbacks.add = function() {
    var result = originalCallbacksAdd.apply(callbacks, arguments);
    setPrevSize();
    ready_callbacks_default.add(function() {
      if (!removeListener && callbacks.has()) {
        removeListener = dom_adapter_default.listen(getWindow(), "resize", handleResize);
      }
    });
    return result;
  };
  callbacks.remove = function() {
    var result = originalCallbacksRemove.apply(callbacks, arguments);
    if (!callbacks.has() && removeListener) {
      removeListener();
      removeListener = void 0;
    }
    return result;
  };
  return callbacks;
}();
var resize_callbacks_default = resizeCallbacks;

// node_modules/devextreme/esm/core/events_strategy.js
var EventsStrategy = class _EventsStrategy {
  constructor(owner) {
    var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    this._events = {};
    this._owner = owner;
    this._options = options;
  }
  static create(owner, strategy2) {
    if (strategy2) {
      return isFunction(strategy2) ? strategy2(owner) : strategy2;
    } else {
      return new _EventsStrategy(owner);
    }
  }
  hasEvent(eventName) {
    var callbacks = this._events[eventName];
    return callbacks ? callbacks.has() : false;
  }
  fireEvent(eventName, eventArgs) {
    var callbacks = this._events[eventName];
    if (callbacks) {
      callbacks.fireWith(this._owner, eventArgs);
    }
    return this._owner;
  }
  on(eventName, eventHandler) {
    if (isPlainObject(eventName)) {
      each(eventName, (e, h) => {
        this.on(e, h);
      });
    } else {
      var callbacks = this._events[eventName];
      if (!callbacks) {
        callbacks = callbacks_default({
          syncStrategy: this._options.syncStrategy
        });
        this._events[eventName] = callbacks;
      }
      var addFn = callbacks.originalAdd || callbacks.add;
      addFn.call(callbacks, eventHandler);
    }
  }
  off(eventName, eventHandler) {
    var callbacks = this._events[eventName];
    if (callbacks) {
      if (isFunction(eventHandler)) {
        callbacks.remove(eventHandler);
      } else {
        callbacks.empty();
      }
    }
  }
  dispose() {
    each(this._events, (eventName, event) => {
      event.empty();
    });
  }
};

// node_modules/devextreme/esm/core/utils/storage.js
var window = getWindow();
var getSessionStorage = function() {
  var sessionStorage;
  try {
    sessionStorage = window.sessionStorage;
  } catch (e) {
  }
  return sessionStorage;
};

// node_modules/devextreme/esm/core/devices.js
var window2 = getWindow();
var KNOWN_UA_TABLE = {
  iPhone: "iPhone",
  iPhone5: "iPhone",
  iPhone6: "iPhone",
  iPhone6plus: "iPhone",
  iPad: "iPad",
  iPadMini: "iPad Mini",
  androidPhone: "Android Mobile",
  androidTablet: "Android",
  msSurface: "Windows ARM Tablet PC",
  desktop: "desktop"
};
var DEFAULT_DEVICE = {
  deviceType: "desktop",
  platform: "generic",
  version: [],
  phone: false,
  tablet: false,
  android: false,
  ios: false,
  generic: true,
  grade: "A",
  mac: false
};
var UA_PARSERS = {
  generic(userAgent) {
    var isPhone = /windows phone/i.test(userAgent) || userAgent.match(/WPDesktop/);
    var isTablet = !isPhone && /Windows(.*)arm(.*)Tablet PC/i.test(userAgent);
    var isDesktop = !isPhone && !isTablet && /msapphost/i.test(userAgent);
    var isMac = /((intel|ppc) mac os x)/.test(userAgent.toLowerCase());
    if (!(isPhone || isTablet || isDesktop || isMac)) {
      return null;
    }
    return {
      deviceType: isPhone ? "phone" : isTablet ? "tablet" : "desktop",
      platform: "generic",
      version: [],
      grade: "A",
      mac: isMac
    };
  },
  appleTouchDevice(userAgent) {
    var navigator2 = getNavigator();
    var isIpadOs = /Macintosh/i.test(userAgent) && (null === navigator2 || void 0 === navigator2 ? void 0 : navigator2.maxTouchPoints) > 2;
    var isAppleDevice = /ip(hone|od|ad)/i.test(userAgent);
    if (!isAppleDevice && !isIpadOs) {
      return null;
    }
    var isPhone = /ip(hone|od)/i.test(userAgent);
    var matches = userAgent.match(/os\s{0,}X? (\d+)_(\d+)_?(\d+)?/i);
    var version2 = matches ? [parseInt(matches[1], 10), parseInt(matches[2], 10), parseInt(matches[3] || 0, 10)] : [];
    var isIPhone4 = 480 === window2.screen.height;
    var grade = isIPhone4 ? "B" : "A";
    return {
      deviceType: isPhone ? "phone" : "tablet",
      platform: "ios",
      version: version2,
      grade
    };
  },
  android(userAgent) {
    var isAndroid = /android|htc_|silk/i.test(userAgent);
    var isWinPhone = /windows phone/i.test(userAgent);
    if (!isAndroid || isWinPhone) {
      return null;
    }
    var isPhone = /mobile/i.test(userAgent);
    var matches = userAgent.match(/android (\d+)\.?(\d+)?\.?(\d+)?/i);
    var version2 = matches ? [parseInt(matches[1], 10), parseInt(matches[2] || 0, 10), parseInt(matches[3] || 0, 10)] : [];
    var worseThan4_4 = version2.length > 1 && (version2[0] < 4 || 4 === version2[0] && version2[1] < 4);
    var grade = worseThan4_4 ? "B" : "A";
    return {
      deviceType: isPhone ? "phone" : "tablet",
      platform: "android",
      version: version2,
      grade
    };
  }
};
var UA_PARSERS_ARRAY = [UA_PARSERS.appleTouchDevice, UA_PARSERS.android, UA_PARSERS.generic];
var Devices = class {
  constructor(options) {
    this._window = (null === options || void 0 === options ? void 0 : options.window) || window2;
    this._realDevice = this._getDevice();
    this._currentDevice = void 0;
    this._currentOrientation = void 0;
    this._eventsStrategy = new EventsStrategy(this);
    this.changed = callbacks_default();
    if (hasWindow()) {
      ready_callbacks_default.add(this._recalculateOrientation.bind(this));
      resize_callbacks_default.add(this._recalculateOrientation.bind(this));
    }
  }
  current(deviceOrName) {
    if (deviceOrName) {
      this._currentDevice = this._getDevice(deviceOrName);
      this._forced = true;
      this.changed.fire();
      return;
    }
    if (!this._currentDevice) {
      deviceOrName = void 0;
      try {
        deviceOrName = this._getDeviceOrNameFromWindowScope();
      } catch (e) {
        deviceOrName = this._getDeviceNameFromSessionStorage();
      } finally {
        if (!deviceOrName) {
          deviceOrName = this._getDeviceNameFromSessionStorage();
        }
        if (deviceOrName) {
          this._forced = true;
        }
      }
      this._currentDevice = this._getDevice(deviceOrName);
    }
    return this._currentDevice;
  }
  real(forceDevice) {
    return extend({}, this._realDevice);
  }
  orientation() {
    return this._currentOrientation;
  }
  isForced() {
    return this._forced;
  }
  isRippleEmulator() {
    return !!this._window.tinyHippos;
  }
  _getCssClasses(device) {
    var result = [];
    var realDevice = this._realDevice;
    device = device || this.current();
    if (device.deviceType) {
      result.push("dx-device-".concat(device.deviceType));
      if ("desktop" !== device.deviceType) {
        result.push("dx-device-mobile");
      }
    }
    result.push("dx-device-".concat(realDevice.platform));
    if (realDevice.version && realDevice.version.length) {
      result.push("dx-device-".concat(realDevice.platform, "-").concat(realDevice.version[0]));
    }
    if (this.isSimulator()) {
      result.push("dx-simulator");
    }
    if (config_default().rtlEnabled) {
      result.push("dx-rtl");
    }
    return result;
  }
  attachCssClasses(element, device) {
    this._deviceClasses = this._getCssClasses(device).join(" ");
    renderer_default(element).addClass(this._deviceClasses);
  }
  detachCssClasses(element) {
    renderer_default(element).removeClass(this._deviceClasses);
  }
  isSimulator() {
    try {
      return this._isSimulator || hasWindow() && this._window.top !== this._window.self && this._window.top["dx-force-device"] || this.isRippleEmulator();
    } catch (e) {
      return false;
    }
  }
  forceSimulator() {
    this._isSimulator = true;
  }
  _getDevice(deviceName) {
    if ("genericPhone" === deviceName) {
      deviceName = {
        deviceType: "phone",
        platform: "generic",
        generic: true
      };
    }
    if (isPlainObject(deviceName)) {
      return this._fromConfig(deviceName);
    } else {
      var ua;
      if (deviceName) {
        ua = KNOWN_UA_TABLE[deviceName];
        if (!ua) {
          throw errors_default.Error("E0005");
        }
      } else {
        var navigator2 = getNavigator();
        ua = navigator2.userAgent;
      }
      return this._fromUA(ua);
    }
  }
  _getDeviceOrNameFromWindowScope() {
    var result;
    if (hasWindow() && (this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"])) {
      result = this._window.top["dx-force-device-object"] || this._window.top["dx-force-device"];
    }
    return result;
  }
  _getDeviceNameFromSessionStorage() {
    var sessionStorage = getSessionStorage();
    if (!sessionStorage) {
      return;
    }
    var deviceOrName = sessionStorage.getItem("dx-force-device");
    try {
      return JSON.parse(deviceOrName);
    } catch (ex) {
      return deviceOrName;
    }
  }
  _fromConfig(config) {
    var result = extend({}, DEFAULT_DEVICE, this._currentDevice, config);
    var shortcuts = {
      phone: "phone" === result.deviceType,
      tablet: "tablet" === result.deviceType,
      android: "android" === result.platform,
      ios: "ios" === result.platform,
      generic: "generic" === result.platform
    };
    return extend(result, shortcuts);
  }
  _fromUA(ua) {
    for (var idx = 0; idx < UA_PARSERS_ARRAY.length; idx += 1) {
      var parser = UA_PARSERS_ARRAY[idx];
      var config = parser(ua);
      if (config) {
        return this._fromConfig(config);
      }
    }
    return DEFAULT_DEVICE;
  }
  _changeOrientation() {
    var $window = renderer_default(this._window);
    var orientation = getHeight($window) > getWidth($window) ? "portrait" : "landscape";
    if (this._currentOrientation === orientation) {
      return;
    }
    this._currentOrientation = orientation;
    this._eventsStrategy.fireEvent("orientationChanged", [{
      orientation
    }]);
  }
  _recalculateOrientation() {
    var windowWidth = getWidth(this._window);
    if (this._currentWidth === windowWidth) {
      return;
    }
    this._currentWidth = windowWidth;
    this._changeOrientation();
  }
  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  }
  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  }
};
var devices = new Devices();
var viewPortElement = value();
if (viewPortElement) {
  devices.attachCssClasses(viewPortElement);
}
changeCallback.add((viewPort2, prevViewport) => {
  devices.detachCssClasses(prevViewport);
  devices.attachCssClasses(viewPort2);
});
var devices_default = devices;

// node_modules/devextreme/esm/core/utils/support.js
var {
  maxTouchPoints
} = getNavigator();
var transitionEndEventNames = {
  webkitTransition: "webkitTransitionEnd",
  MozTransition: "transitionend",
  OTransition: "oTransitionEnd",
  transition: "transitionend"
};
var supportProp = function(prop) {
  return !!styleProp(prop);
};
var isNativeScrollingSupported = function() {
  var {
    platform,
    mac: isMac
  } = devices_default.real();
  var isNativeScrollDevice = "ios" === platform || "android" === platform || isMac;
  return isNativeScrollDevice;
};
var inputType = function(type2) {
  if ("text" === type2) {
    return true;
  }
  var input = dom_adapter_default.createElement("input");
  try {
    input.setAttribute("type", type2);
    input.value = "wrongValue";
    return !input.value;
  } catch (e) {
    return false;
  }
};
var detectTouchEvents = function(hasWindowProperty, maxTouchPoints2) {
  return (hasWindowProperty("ontouchstart") || !!maxTouchPoints2) && !hasWindowProperty("callPhantom");
};
var detectPointerEvent = function(hasWindowProperty) {
  return hasWindowProperty("PointerEvent");
};
var touchEvents = detectTouchEvents(hasProperty, maxTouchPoints);
var pointerEvents = detectPointerEvent(hasProperty);
var touchPointersPresent = !!maxTouchPoints;
var touch = touchEvents || pointerEvents && touchPointersPresent;
var transition = call_once_default(function() {
  return supportProp("transition");
});
var transitionEndEventName = call_once_default(function() {
  return transitionEndEventNames[styleProp("transition")];
});
var animation = call_once_default(function() {
  return supportProp("animation");
});
var nativeScrolling = isNativeScrollingSupported();

// node_modules/devextreme/esm/events/core/event_registrator.js
var registerEvent = function(name, eventObject) {
  var strategy2 = {};
  if ("noBubble" in eventObject) {
    strategy2.noBubble = eventObject.noBubble;
  }
  if ("bindType" in eventObject) {
    strategy2.bindType = eventObject.bindType;
  }
  if ("delegateType" in eventObject) {
    strategy2.delegateType = eventObject.delegateType;
  }
  each(["setup", "teardown", "add", "remove", "trigger", "handle", "_default", "dispose"], function(_, methodName) {
    if (!eventObject[methodName]) {
      return;
    }
    strategy2[methodName] = function() {
      var args = [].slice.call(arguments);
      args.unshift(this);
      return eventObject[methodName].apply(eventObject, args);
    };
  });
  event_registrator_callbacks_default.fire(name, strategy2);
};
registerEvent.callbacks = event_registrator_callbacks_default;
var event_registrator_default = registerEvent;

// node_modules/devextreme/esm/core/utils/browser.js
var navigator = getNavigator();
var webkitRegExp = /(webkit)[ /]([\w.]+)/;
var mozillaRegExp = /(mozilla)(?:.*? rv:([\w.]+))/;
var browserFromUA = (ua) => {
  ua = ua.toLowerCase();
  var result = {};
  var matches = webkitRegExp.exec(ua) || ua.indexOf("compatible") < 0 && mozillaRegExp.exec(ua) || [];
  var browserName = matches[1];
  var browserVersion = matches[2];
  if ("webkit" === browserName) {
    result.webkit = true;
    if (ua.indexOf("chrome") >= 0 || ua.indexOf("crios") >= 0) {
      browserName = "chrome";
      browserVersion = /(?:chrome|crios)\/(\d+\.\d+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    } else if (ua.indexOf("fxios") >= 0) {
      browserName = "mozilla";
      browserVersion = /fxios\/(\d+\.\d+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    } else if (ua.indexOf("safari") >= 0 && /version|phantomjs/.test(ua)) {
      browserName = "safari";
      browserVersion = /(?:version|phantomjs)\/([0-9.]+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    } else {
      browserName = "unknown";
      browserVersion = /applewebkit\/([0-9.]+)/.exec(ua);
      browserVersion = browserVersion && browserVersion[1];
    }
  }
  if (browserName) {
    result[browserName] = true;
    result.version = browserVersion;
  }
  return result;
};
var browser_default = extend({
  _fromUA: browserFromUA
}, browserFromUA(navigator.userAgent));

// node_modules/devextreme/esm/events/utils/add_namespace.js
var addNamespace = (eventNames, namespace) => {
  if (!namespace) {
    throw errors_default.Error("E0017");
  }
  if (Array.isArray(eventNames)) {
    return eventNames.map((eventName) => addNamespace(eventName, namespace)).join(" ");
  }
  if (-1 !== eventNames.indexOf(" ")) {
    return addNamespace(eventNames.split(/\s+/g), namespace);
  }
  return "".concat(eventNames, ".").concat(namespace);
};
var add_namespace_default = addNamespace;

// node_modules/devextreme/esm/ui/widget/selectors.js
var focusableFn = function(element, tabIndex) {
  if (!visible(element)) {
    return false;
  }
  var nodeName = element.nodeName.toLowerCase();
  var isTabIndexNotNaN = !isNaN(tabIndex);
  var isDisabled = element.disabled;
  var isDefaultFocus = /^(input|select|textarea|button|object|iframe)$/.test(nodeName);
  var isHyperlink = "a" === nodeName;
  var isFocusable;
  var isContentEditable = element.isContentEditable;
  if (isDefaultFocus || isContentEditable) {
    isFocusable = !isDisabled;
  } else if (isHyperlink) {
    isFocusable = element.href || isTabIndexNotNaN;
  } else {
    isFocusable = isTabIndexNotNaN;
  }
  return isFocusable;
};
function visible(element) {
  var $element = renderer_default(element);
  return $element.is(":visible") && "hidden" !== $element.css("visibility") && "hidden" !== $element.parents().css("visibility");
}
var focusable = function(index2, element) {
  return focusableFn(element, renderer_default(element).attr("tabIndex"));
};
var tabbable = function(index2, element) {
  var tabIndex = renderer_default(element).attr("tabIndex");
  return (isNaN(tabIndex) || tabIndex >= 0) && focusableFn(element, tabIndex);
};
var focused = function($element) {
  var element = renderer_default($element).get(0);
  return dom_adapter_default.getActiveElement(element) === element;
};

// node_modules/devextreme/esm/events/utils/index.js
var KEY_MAP = {
  backspace: "backspace",
  tab: "tab",
  enter: "enter",
  escape: "escape",
  pageup: "pageUp",
  pagedown: "pageDown",
  end: "end",
  home: "home",
  arrowleft: "leftArrow",
  arrowup: "upArrow",
  arrowright: "rightArrow",
  arrowdown: "downArrow",
  delete: "del",
  " ": "space",
  f: "F",
  a: "A",
  "*": "asterisk",
  "-": "minus",
  alt: "alt",
  control: "control",
  shift: "shift"
};
var LEGACY_KEY_CODES = {
  8: "backspace",
  9: "tab",
  13: "enter",
  27: "escape",
  33: "pageUp",
  34: "pageDown",
  35: "end",
  36: "home",
  37: "leftArrow",
  38: "upArrow",
  39: "rightArrow",
  40: "downArrow",
  46: "del",
  32: "space",
  70: "F",
  65: "A",
  106: "asterisk",
  109: "minus",
  189: "minus",
  173: "minus",
  16: "shift",
  17: "control",
  18: "alt"
};
var EVENT_SOURCES_REGEX = {
  dx: /^dx/i,
  mouse: /(mouse|wheel)/i,
  touch: /^touch/i,
  keyboard: /^key/i,
  pointer: /^(ms)?pointer/i
};
var fixMethod = (e) => e;
var copyEvent = (originalEvent) => fixMethod(events_engine_default.Event(originalEvent, originalEvent), originalEvent);
var isDxEvent = (e) => "dx" === eventSource(e);
var isNativeMouseEvent = (e) => "mouse" === eventSource(e);
var isNativeTouchEvent = (e) => "touch" === eventSource(e);
var eventSource = (_ref) => {
  var {
    type: type2
  } = _ref;
  var result = "other";
  each(EVENT_SOURCES_REGEX, function(key) {
    if (this.test(type2)) {
      result = key;
      return false;
    }
  });
  return result;
};
var isPointerEvent = (e) => "pointer" === eventSource(e);
var isMouseEvent = (e) => isNativeMouseEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && "mouse" === e.pointerType;
var isDxMouseWheelEvent = (e) => e && "dxmousewheel" === e.type;
var isTouchEvent = (e) => isNativeTouchEvent(e) || (isPointerEvent(e) || isDxEvent(e)) && "touch" === e.pointerType;
var isFakeClickEvent = (_ref2) => {
  var {
    screenX,
    offsetX,
    pageX
  } = _ref2;
  return 0 === screenX && !offsetX && 0 === pageX;
};
var eventData = (_ref3) => {
  var {
    pageX,
    pageY,
    timeStamp
  } = _ref3;
  return {
    x: pageX,
    y: pageY,
    time: timeStamp
  };
};
var eventDelta = (from, to) => ({
  x: to.x - from.x,
  y: to.y - from.y,
  time: to.time - from.time || 1
});
var hasTouches = (e) => {
  var {
    originalEvent,
    pointers
  } = e;
  if (isNativeTouchEvent(e)) {
    return (originalEvent.touches || []).length;
  }
  if (isDxEvent(e)) {
    return (pointers || []).length;
  }
  return 0;
};
var skipEvents = false;
var needSkipEvent = (e) => {
  if (skipEvents) {
    return true;
  }
  var {
    target
  } = e;
  var $target = renderer_default(target);
  var isContentEditable = (null === target || void 0 === target ? void 0 : target.isContentEditable) || (null === target || void 0 === target ? void 0 : target.hasAttribute("contenteditable"));
  var touchInEditable = $target.is("input, textarea, select") || isContentEditable;
  if (isDxMouseWheelEvent(e)) {
    var isTextArea = $target.is("textarea") && $target.hasClass("dx-texteditor-input");
    if (isTextArea || isContentEditable) {
      return false;
    }
    var isInputFocused = $target.is("input[type='number'], textarea, select") && $target.is(":focus");
    return isInputFocused;
  }
  if (isMouseEvent(e)) {
    return touchInEditable || e.which > 1;
  }
  if (isTouchEvent(e)) {
    return touchInEditable && focused($target);
  }
};
var createEvent = (originalEvent, args) => {
  var event = copyEvent(originalEvent);
  args && extend(event, args);
  return event;
};
var fireEvent = (props) => {
  var {
    originalEvent,
    delegateTarget
  } = props;
  var event = createEvent(originalEvent, props);
  events_engine_default.trigger(delegateTarget || event.target, event);
  return event;
};
var normalizeKeyName = (_ref4) => {
  var {
    key,
    which
  } = _ref4;
  var normalizedKey = KEY_MAP[null === key || void 0 === key ? void 0 : key.toLowerCase()] || key;
  var normalizedKeyFromWhich = LEGACY_KEY_CODES[which];
  if (normalizedKeyFromWhich && normalizedKey === key) {
    return normalizedKeyFromWhich;
  } else if (!normalizedKey && which) {
    return String.fromCharCode(which);
  }
  return normalizedKey;
};
var getChar = (_ref5) => {
  var {
    key,
    which
  } = _ref5;
  return key || String.fromCharCode(which);
};
var addNamespace2 = add_namespace_default;
var isCommandKeyPressed = (_ref6) => {
  var {
    ctrlKey,
    metaKey
  } = _ref6;
  return ctrlKey || metaKey;
};

// node_modules/devextreme/esm/events/pointer/base.js
var POINTER_EVENTS_NAMESPACE = "dxPointerEvents";
var BaseStrategy = class_default.inherit({
  ctor: function(eventName, originalEvents) {
    this._eventName = eventName;
    this._originalEvents = addNamespace2(originalEvents, POINTER_EVENTS_NAMESPACE);
    this._handlerCount = 0;
    this.noBubble = this._isNoBubble();
  },
  _isNoBubble: function() {
    var eventName = this._eventName;
    return "dxpointerenter" === eventName || "dxpointerleave" === eventName;
  },
  _handler: function(e) {
    var _originalEvent$target;
    var delegateTarget = this._getDelegateTarget(e);
    var event = {
      type: this._eventName,
      pointerType: e.pointerType || eventSource(e),
      originalEvent: e,
      delegateTarget,
      timeStamp: browser_default.mozilla ? (/* @__PURE__ */ new Date()).getTime() : e.timeStamp
    };
    var originalEvent = e.originalEvent;
    if (null !== originalEvent && void 0 !== originalEvent && null !== (_originalEvent$target = originalEvent.target) && void 0 !== _originalEvent$target && _originalEvent$target.shadowRoot) {
      var _originalEvent$path, _originalEvent$compos;
      var path = null !== (_originalEvent$path = originalEvent.path) && void 0 !== _originalEvent$path ? _originalEvent$path : null === (_originalEvent$compos = originalEvent.composedPath) || void 0 === _originalEvent$compos ? void 0 : _originalEvent$compos.call(originalEvent);
      event.target = path[0];
    }
    return this._fireEvent(event);
  },
  _getDelegateTarget: function(e) {
    var delegateTarget;
    if (this.noBubble) {
      delegateTarget = e.delegateTarget;
    }
    return delegateTarget;
  },
  _fireEvent: function(args) {
    return fireEvent(args);
  },
  _setSelector: function(handleObj) {
    this._selector = this.noBubble && handleObj ? handleObj.selector : null;
  },
  _getSelector: function() {
    return this._selector;
  },
  setup: function() {
    return true;
  },
  add: function(element, handleObj) {
    if (this._handlerCount <= 0 || this.noBubble) {
      element = this.noBubble ? element : dom_adapter_default.getDocument();
      this._setSelector(handleObj);
      var that = this;
      events_engine_default.on(element, this._originalEvents, this._getSelector(), function(e) {
        that._handler(e);
      });
    }
    if (!this.noBubble) {
      this._handlerCount++;
    }
  },
  remove: function(handleObj) {
    this._setSelector(handleObj);
    if (!this.noBubble) {
      this._handlerCount--;
    }
  },
  teardown: function(element) {
    if (this._handlerCount && !this.noBubble) {
      return;
    }
    element = this.noBubble ? element : dom_adapter_default.getDocument();
    if (this._originalEvents !== "." + POINTER_EVENTS_NAMESPACE) {
      events_engine_default.off(element, this._originalEvents, this._getSelector());
    }
  },
  dispose: function(element) {
    element = this.noBubble ? element : dom_adapter_default.getDocument();
    events_engine_default.off(element, this._originalEvents);
  }
});
var base_default = BaseStrategy;

// node_modules/devextreme/esm/events/pointer/touch.js
var eventMap = {
  dxpointerdown: "touchstart",
  dxpointermove: "touchmove",
  dxpointerup: "touchend",
  dxpointercancel: "touchcancel",
  dxpointerover: "",
  dxpointerout: "",
  dxpointerenter: "",
  dxpointerleave: ""
};
var normalizeTouchEvent = function(e) {
  var pointers = [];
  each(e.touches, function(_, touch2) {
    pointers.push(extend({
      pointerId: touch2.identifier
    }, touch2));
  });
  return {
    pointers,
    pointerId: e.changedTouches[0].identifier
  };
};
var skipTouchWithSameIdentifier = function(pointerEvent) {
  return "ios" === devices_default.real().platform && ("dxpointerdown" === pointerEvent || "dxpointerup" === pointerEvent);
};
var TouchStrategy = base_default.inherit({
  ctor: function() {
    this.callBase.apply(this, arguments);
    this._pointerId = 0;
  },
  _handler: function(e) {
    if (skipTouchWithSameIdentifier(this._eventName)) {
      var touch2 = e.changedTouches[0];
      if (this._pointerId === touch2.identifier && 0 !== this._pointerId) {
        return;
      }
      this._pointerId = touch2.identifier;
    }
    return this.callBase.apply(this, arguments);
  },
  _fireEvent: function(args) {
    return this.callBase(extend(normalizeTouchEvent(args.originalEvent), args));
  }
});
TouchStrategy.map = eventMap;
TouchStrategy.normalize = normalizeTouchEvent;
var touch_default = TouchStrategy;

// node_modules/devextreme/esm/events/pointer/observer.js
var addEventsListener = function(events, handler) {
  ready_callbacks_default.add(function() {
    events.split(" ").forEach(function(event) {
      dom_adapter_default.listen(dom_adapter_default.getDocument(), event, handler, true);
    });
  });
};
var Observer = function(eventMap4, pointerEquals, onPointerAdding) {
  onPointerAdding = onPointerAdding || function() {
  };
  var pointers = [];
  var getPointerIndex = function(e) {
    var index2 = -1;
    each(pointers, function(i, pointer2) {
      if (!pointerEquals(e, pointer2)) {
        return true;
      }
      index2 = i;
      return false;
    });
    return index2;
  };
  var removePointer = function(e) {
    var index2 = getPointerIndex(e);
    if (index2 > -1) {
      pointers.splice(index2, 1);
    }
  };
  addEventsListener(eventMap4.dxpointerdown, function(e) {
    if (-1 === getPointerIndex(e)) {
      onPointerAdding(e);
      pointers.push(e);
    }
  });
  addEventsListener(eventMap4.dxpointermove, function(e) {
    pointers[getPointerIndex(e)] = e;
  });
  addEventsListener(eventMap4.dxpointerup, removePointer);
  addEventsListener(eventMap4.dxpointercancel, removePointer);
  this.pointers = function() {
    return pointers;
  };
  this.reset = function() {
    pointers = [];
  };
};
var observer_default = Observer;

// node_modules/devextreme/esm/events/pointer/mouse.js
var eventMap2 = {
  dxpointerdown: "mousedown",
  dxpointermove: "mousemove",
  dxpointerup: "mouseup",
  dxpointercancel: "",
  dxpointerover: "mouseover",
  dxpointerout: "mouseout",
  dxpointerenter: "mouseenter",
  dxpointerleave: "mouseleave"
};
var normalizeMouseEvent = function(e) {
  e.pointerId = 1;
  return {
    pointers: observer.pointers(),
    pointerId: 1
  };
};
var observer;
var activated = false;
var activateStrategy = function() {
  if (activated) {
    return;
  }
  observer = new observer_default(eventMap2, function() {
    return true;
  });
  activated = true;
};
var MouseStrategy = base_default.inherit({
  ctor: function() {
    this.callBase.apply(this, arguments);
    activateStrategy();
  },
  _fireEvent: function(args) {
    return this.callBase(extend(normalizeMouseEvent(args.originalEvent), args));
  }
});
MouseStrategy.map = eventMap2;
MouseStrategy.normalize = normalizeMouseEvent;
MouseStrategy.activate = activateStrategy;
MouseStrategy.resetObserver = function() {
  observer.reset();
};
var mouse_default = MouseStrategy;

// node_modules/devextreme/esm/events/pointer/mouse_and_touch.js
var eventMap3 = {
  dxpointerdown: "touchstart mousedown",
  dxpointermove: "touchmove mousemove",
  dxpointerup: "touchend mouseup",
  dxpointercancel: "touchcancel",
  dxpointerover: "mouseover",
  dxpointerout: "mouseout",
  dxpointerenter: "mouseenter",
  dxpointerleave: "mouseleave"
};
var activated2 = false;
var activateStrategy2 = function() {
  if (activated2) {
    return;
  }
  mouse_default.activate();
  activated2 = true;
};
var MouseAndTouchStrategy = base_default.inherit({
  EVENT_LOCK_TIMEOUT: 100,
  ctor: function() {
    this.callBase.apply(this, arguments);
    activateStrategy2();
  },
  _handler: function(e) {
    var isMouse = isMouseEvent(e);
    if (!isMouse) {
      this._skipNextEvents = true;
    }
    if (isMouse && this._mouseLocked) {
      return;
    }
    if (isMouse && this._skipNextEvents) {
      this._skipNextEvents = false;
      this._mouseLocked = true;
      clearTimeout(this._unlockMouseTimer);
      var that = this;
      this._unlockMouseTimer = setTimeout(function() {
        that._mouseLocked = false;
      }, this.EVENT_LOCK_TIMEOUT);
      return;
    }
    return this.callBase(e);
  },
  _fireEvent: function(args) {
    var normalizer = isMouseEvent(args.originalEvent) ? mouse_default.normalize : touch_default.normalize;
    return this.callBase(extend(normalizer(args.originalEvent), args));
  },
  dispose: function() {
    this.callBase();
    this._skipNextEvents = false;
    this._mouseLocked = false;
    clearTimeout(this._unlockMouseTimer);
  }
});
MouseAndTouchStrategy.map = eventMap3;
MouseAndTouchStrategy.resetObserver = mouse_default.resetObserver;
var mouse_and_touch_default = MouseAndTouchStrategy;

// node_modules/devextreme/esm/events/pointer.js
var getStrategy = (support, _ref) => {
  var {
    tablet,
    phone
  } = _ref;
  var pointerEventStrategy = getStrategyFromGlobalConfig();
  if (pointerEventStrategy) {
    return pointerEventStrategy;
  }
  if (support.touch && !(tablet || phone)) {
    return mouse_and_touch_default;
  }
  if (support.touch) {
    return touch_default;
  }
  return mouse_default;
};
var EventStrategy = getStrategy(support_exports, devices_default.real());
each(EventStrategy.map, (pointerEvent, originalEvents) => {
  event_registrator_default(pointerEvent, new EventStrategy(pointerEvent, originalEvents));
});
var pointer = {
  down: "dxpointerdown",
  up: "dxpointerup",
  move: "dxpointermove",
  cancel: "dxpointercancel",
  enter: "dxpointerenter",
  leave: "dxpointerleave",
  over: "dxpointerover",
  out: "dxpointerout"
};
function getStrategyFromGlobalConfig() {
  var eventStrategyName = config_default().pointerEventStrategy;
  return {
    "mouse-and-touch": mouse_and_touch_default,
    touch: touch_default,
    mouse: mouse_default
  }[eventStrategyName];
}
var pointer_default = pointer;

// node_modules/devextreme/esm/core/component_registrator_callbacks.js
var component_registrator_callbacks_default = new MemorizedCallbacks();

// node_modules/devextreme/esm/events/remove.js
var removeEvent = "dxremove";
var eventPropName = "dxRemoveEvent";
beforeCleanData(function(elements) {
  elements = [].slice.call(elements);
  for (var i = 0; i < elements.length; i++) {
    var $element = renderer_default(elements[i]);
    if ($element.prop(eventPropName)) {
      $element[0][eventPropName] = null;
      events_engine_default.triggerHandler($element, removeEvent);
    }
  }
});
event_registrator_default(removeEvent, {
  noBubble: true,
  setup: function(element) {
    renderer_default(element).prop(eventPropName, true);
  }
});

// node_modules/devextreme/esm/core/utils/public_component.js
var COMPONENT_NAMES_DATA_KEY = "dxComponents";
var ANONYMOUS_COMPONENT_DATA_KEY = "dxPrivateComponent";
var componentNames = /* @__PURE__ */ new WeakMap();
var nextAnonymousComponent = 0;
var getName = function(componentClass, newName) {
  if (isDefined(newName)) {
    componentNames.set(componentClass, newName);
    return;
  }
  if (!componentNames.has(componentClass)) {
    var generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
    componentNames.set(componentClass, generatedName);
    return generatedName;
  }
  return componentNames.get(componentClass);
};
function attachInstanceToElement($element, componentInstance, disposeFn) {
  var data2 = data($element.get(0));
  var name = getName(componentInstance.constructor);
  data2[name] = componentInstance;
  if (disposeFn) {
    events_engine_default.one($element, removeEvent, function() {
      disposeFn.call(componentInstance);
    });
  }
  if (!data2[COMPONENT_NAMES_DATA_KEY]) {
    data2[COMPONENT_NAMES_DATA_KEY] = [];
  }
  data2[COMPONENT_NAMES_DATA_KEY].push(name);
}
function getInstanceByElement($element, componentClass) {
  var name = getName(componentClass);
  return data($element.get(0), name);
}

// node_modules/devextreme/esm/core/component_registrator.js
var registerComponent = function(name, namespace, componentClass) {
  if (!componentClass) {
    componentClass = namespace;
  } else {
    namespace[name] = componentClass;
  }
  getName(componentClass, name);
  component_registrator_callbacks_default.fire(name, componentClass);
};
var registerRendererComponent = function(name, componentClass) {
  renderer_default.fn[name] = function(options) {
    var isMemberInvoke = "string" === typeof options;
    var result;
    if (isMemberInvoke) {
      var memberName = options;
      var memberArgs = [].slice.call(arguments).slice(1);
      this.each(function() {
        var instance = componentClass.getInstance(this);
        if (!instance) {
          throw errors_default.Error("E0009", name);
        }
        var member = instance[memberName];
        var memberValue = member.apply(instance, memberArgs);
        if (void 0 === result) {
          result = memberValue;
        }
      });
    } else {
      this.each(function() {
        var instance = componentClass.getInstance(this);
        if (instance) {
          instance.option(options);
        } else {
          new componentClass(this, options);
        }
      });
      result = this;
    }
    return result;
  };
};
component_registrator_callbacks_default.add(registerRendererComponent);
var component_registrator_default = registerComponent;

// node_modules/devextreme/esm/core/element.js
var strategy = function(element) {
  return element && element.get(0);
};
function getPublicElement(element) {
  return strategy(element);
}

// node_modules/devextreme/esm/animation/translator.js
var TRANSLATOR_DATA_KEY = "dxTranslator";
var TRANSFORM_MATRIX_REGEX = /matrix(3d)?\((.+?)\)/;
var TRANSLATE_REGEX = /translate(?:3d)?\((.+?)\)/;
var locate = function($element) {
  $element = renderer_default($element);
  var translate = getTranslate($element);
  return {
    left: translate.x,
    top: translate.y
  };
};
function isPercentValue(value2) {
  return "string" === type(value2) && "%" === value2[value2.length - 1];
}
function cacheTranslate($element, translate) {
  if ($element.length) {
    data($element.get(0), TRANSLATOR_DATA_KEY, translate);
  }
}
var clearCache = function($element) {
  if ($element.length) {
    removeData($element.get(0), TRANSLATOR_DATA_KEY);
  }
};
var getTranslateCss = function(translate) {
  translate.x = translate.x || 0;
  translate.y = translate.y || 0;
  var xValueString = isPercentValue(translate.x) ? translate.x : translate.x + "px";
  var yValueString = isPercentValue(translate.y) ? translate.y : translate.y + "px";
  return "translate(" + xValueString + ", " + yValueString + ")";
};
var getTranslate = function($element) {
  var result = $element.length ? data($element.get(0), TRANSLATOR_DATA_KEY) : null;
  if (!result) {
    var transformValue = $element.css("transform") || getTranslateCss({
      x: 0,
      y: 0
    });
    var matrix = transformValue.match(TRANSFORM_MATRIX_REGEX);
    var is3D = matrix && matrix[1];
    if (matrix) {
      matrix = matrix[2].split(",");
      if ("3d" === is3D) {
        matrix = matrix.slice(12, 15);
      } else {
        matrix.push(0);
        matrix = matrix.slice(4, 7);
      }
    } else {
      matrix = [0, 0, 0];
    }
    result = {
      x: parseFloat(matrix[0]),
      y: parseFloat(matrix[1]),
      z: parseFloat(matrix[2])
    };
    cacheTranslate($element, result);
  }
  return result;
};
var move = function($element, position2) {
  $element = renderer_default($element);
  var left = position2.left;
  var top = position2.top;
  var translate;
  if (void 0 === left) {
    translate = getTranslate($element);
    translate.y = top || 0;
  } else if (void 0 === top) {
    translate = getTranslate($element);
    translate.x = left || 0;
  } else {
    translate = {
      x: left || 0,
      y: top || 0,
      z: 0
    };
    cacheTranslate($element, translate);
  }
  $element.css({
    transform: getTranslateCss(translate)
  });
  if (isPercentValue(left) || isPercentValue(top)) {
    clearCache($element);
  }
};
var resetPosition = function($element, finishTransition) {
  $element = renderer_default($element);
  var originalTransition;
  var stylesConfig = {
    left: 0,
    top: 0,
    transform: "none"
  };
  if (finishTransition) {
    originalTransition = $element.css("transition");
    stylesConfig.transition = "none";
  }
  $element.css(stylesConfig);
  clearCache($element);
  if (finishTransition) {
    $element.get(0).offsetHeight;
    $element.css("transition", originalTransition);
  }
};
var parseTranslate = function(translateString) {
  var result = translateString.match(TRANSLATE_REGEX);
  if (!result || !result[1]) {
    return;
  }
  result = result[1].split(",");
  result = {
    x: parseFloat(result[0]),
    y: parseFloat(result[1]),
    z: parseFloat(result[2])
  };
  return result;
};

// node_modules/devextreme/esm/animation/easing.js
var CSS_TRANSITION_EASING_REGEX = /cubic-bezier\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\)/;
var TransitionTimingFuncMap = {
  linear: "cubic-bezier(0, 0, 1, 1)",
  swing: "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
  ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
  "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)"
};
var polynomBezier = function(x1, y1, x2, y2) {
  var Cx = 3 * x1;
  var Bx = 3 * (x2 - x1) - Cx;
  var Ax = 1 - Cx - Bx;
  var Cy = 3 * y1;
  var By = 3 * (y2 - y1) - Cy;
  var Ay = 1 - Cy - By;
  var bezierX = function(t) {
    return t * (Cx + t * (Bx + t * Ax));
  };
  var derivativeX = function(t) {
    return Cx + t * (2 * Bx + 3 * t * Ax);
  };
  return function(t) {
    return function(t2) {
      return t2 * (Cy + t2 * (By + t2 * Ay));
    }(function(t2) {
      var x = t2;
      var i = 0;
      var z;
      while (i < 14) {
        z = bezierX(x) - t2;
        if (Math.abs(z) < 1e-3) {
          break;
        }
        x -= z / derivativeX(x);
        i++;
      }
      return x;
    }(t));
  };
};
var easing = {};
var convertTransitionTimingFuncToEasing = function(cssTransitionEasing) {
  cssTransitionEasing = TransitionTimingFuncMap[cssTransitionEasing] || cssTransitionEasing;
  var coeffs = cssTransitionEasing.match(CSS_TRANSITION_EASING_REGEX);
  var forceName;
  if (!coeffs) {
    forceName = "linear";
    coeffs = TransitionTimingFuncMap[forceName].match(CSS_TRANSITION_EASING_REGEX);
  }
  coeffs = coeffs.slice(1, 5);
  for (var i = 0; i < coeffs.length; i++) {
    coeffs[i] = parseFloat(coeffs[i]);
  }
  var easingName = forceName || "cubicbezier_" + coeffs.join("_").replace(/\./g, "p");
  if (!isFunction(easing[easingName])) {
    easing[easingName] = function(x, t, b, c, d) {
      return c * polynomBezier(coeffs[0], coeffs[1], coeffs[2], coeffs[3])(t / d) + b;
    };
  }
  return easingName;
};
function getEasing(name) {
  return easing[name];
}

// node_modules/devextreme/esm/animation/frame.js
var window3 = hasWindow() ? getWindow() : {};
var FRAME_ANIMATION_STEP_TIME = 1e3 / 60;
var request = function(callback) {
  return setTimeout(callback, FRAME_ANIMATION_STEP_TIME);
};
var cancel = function(requestID) {
  clearTimeout(requestID);
};
var setAnimationFrameMethods = call_once_default(function() {
  var nativeRequest = window3.requestAnimationFrame || window3.webkitRequestAnimationFrame || window3.mozRequestAnimationFrame || window3.oRequestAnimationFrame || window3.msRequestAnimationFrame;
  var nativeCancel = window3.cancelAnimationFrame || window3.webkitCancelAnimationFrame || window3.mozCancelAnimationFrame || window3.oCancelAnimationFrame || window3.msCancelAnimationFrame;
  if (nativeRequest && nativeCancel) {
    request = nativeRequest;
    cancel = nativeCancel;
  }
});
function requestAnimationFrame() {
  setAnimationFrameMethods();
  return request.apply(window3, arguments);
}
function cancelAnimationFrame() {
  setAnimationFrameMethods();
  cancel.apply(window3, arguments);
}

// node_modules/devextreme/esm/core/utils/position.js
var getDefaultAlignment = (isRtlEnabled) => {
  var rtlEnabled = null !== isRtlEnabled && void 0 !== isRtlEnabled ? isRtlEnabled : config_default().rtlEnabled;
  return rtlEnabled ? "right" : "left";
};
var getBoundingRect = (element) => {
  if (isWindow(element)) {
    return {
      width: element.outerWidth,
      height: element.outerHeight
    };
  }
  return element.getBoundingClientRect();
};

// node_modules/devextreme/esm/animation/position.js
var window4 = getWindow();
var horzRe = /left|right/;
var vertRe = /top|bottom/;
var collisionRe = /fit|flip|none/;
var scaleRe = /scale\(.+?\)/;
var IS_SAFARI = browser_default.safari;
var normalizeAlign = function(raw) {
  var result = {
    h: "center",
    v: "center"
  };
  var pair = splitPair(raw);
  if (pair) {
    each(pair, function() {
      var w = String(this).toLowerCase();
      if (horzRe.test(w)) {
        result.h = w;
      } else if (vertRe.test(w)) {
        result.v = w;
      }
    });
  }
  return result;
};
var normalizeOffset = function(raw, preventRound) {
  return pairToObject(raw, preventRound);
};
var normalizeCollision = function(raw) {
  var pair = splitPair(raw);
  var h = String(pair && pair[0]).toLowerCase();
  var v = String(pair && pair[1]).toLowerCase();
  if (!collisionRe.test(h)) {
    h = "none";
  }
  if (!collisionRe.test(v)) {
    v = h;
  }
  return {
    h,
    v
  };
};
var getAlignFactor = function(align) {
  switch (align) {
    case "center":
      return 0.5;
    case "right":
    case "bottom":
      return 1;
    default:
      return 0;
  }
};
var inverseAlign = function(align) {
  switch (align) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    default:
      return align;
  }
};
var calculateOversize = function(data2, bounds) {
  var oversize = 0;
  if (data2.myLocation < bounds.min) {
    oversize += bounds.min - data2.myLocation;
  }
  if (data2.myLocation > bounds.max) {
    oversize += data2.myLocation - bounds.max;
  }
  return oversize;
};
var collisionSide = function(direction, data2, bounds) {
  if (data2.myLocation < bounds.min) {
    return "h" === direction ? "left" : "top";
  }
  if (data2.myLocation > bounds.max) {
    return "h" === direction ? "right" : "bottom";
  }
  return "none";
};
var initMyLocation = function(data2) {
  data2.myLocation = data2.atLocation + getAlignFactor(data2.atAlign) * data2.atSize - getAlignFactor(data2.myAlign) * data2.mySize + data2.offset;
};
var collisionResolvers = {
  fit: function(data2, bounds) {
    var result = false;
    if (data2.myLocation > bounds.max) {
      data2.myLocation = bounds.max;
      result = true;
    }
    if (data2.myLocation < bounds.min) {
      data2.myLocation = bounds.min;
      result = true;
    }
    data2.fit = result;
  },
  flip: function(data2, bounds) {
    data2.flip = false;
    if ("center" === data2.myAlign && "center" === data2.atAlign) {
      return;
    }
    if (data2.myLocation < bounds.min || data2.myLocation > bounds.max) {
      var inverseData = extend({}, data2, {
        myAlign: inverseAlign(data2.myAlign),
        atAlign: inverseAlign(data2.atAlign),
        offset: -data2.offset
      });
      initMyLocation(inverseData);
      inverseData.oversize = calculateOversize(inverseData, bounds);
      if (inverseData.myLocation >= bounds.min && inverseData.myLocation <= bounds.max || data2.oversize > inverseData.oversize) {
        data2.myLocation = inverseData.myLocation;
        data2.oversize = inverseData.oversize;
        data2.flip = true;
      }
    }
  },
  flipfit: function(data2, bounds) {
    this.flip(data2, bounds);
    this.fit(data2, bounds);
  },
  none: function(data2) {
    data2.oversize = 0;
  }
};
var scrollbarWidth;
var calculateScrollbarWidth = function() {
  var $scrollDiv = renderer_default("<div>").css({
    width: 100,
    height: 100,
    overflow: "scroll",
    position: "absolute",
    top: -9999
  }).appendTo(renderer_default("body"));
  var result = $scrollDiv.get(0).offsetWidth - $scrollDiv.get(0).clientWidth;
  $scrollDiv.remove();
  scrollbarWidth = result;
};
var defaultPositionResult = {
  h: {
    location: 0,
    flip: false,
    fit: false,
    oversize: 0
  },
  v: {
    location: 0,
    flip: false,
    fit: false,
    oversize: 0
  }
};
var calculatePosition = function(what, options) {
  var $what = renderer_default(what);
  var currentOffset = $what.offset();
  var result = extend(true, {}, defaultPositionResult, {
    h: {
      location: currentOffset.left
    },
    v: {
      location: currentOffset.top
    }
  });
  if (!options) {
    return result;
  }
  var my = normalizeAlign(options.my);
  var at = normalizeAlign(options.at);
  var of = renderer_default(options.of).length && options.of || window4;
  var offset2 = normalizeOffset(options.offset, options.precise);
  var collision = normalizeCollision(options.collision);
  var boundary = options.boundary;
  var boundaryOffset = normalizeOffset(options.boundaryOffset, options.precise);
  var h = {
    mySize: getOuterWidth($what),
    myAlign: my.h,
    atAlign: at.h,
    offset: offset2.h,
    collision: collision.h,
    boundaryOffset: boundaryOffset.h
  };
  var v = {
    mySize: getOuterHeight($what),
    myAlign: my.v,
    atAlign: at.v,
    offset: offset2.v,
    collision: collision.v,
    boundaryOffset: boundaryOffset.v
  };
  if (of.preventDefault) {
    h.atLocation = of.pageX;
    v.atLocation = of.pageY;
    h.atSize = 0;
    v.atSize = 0;
  } else {
    of = renderer_default(of);
    if (isWindow(of[0])) {
      h.atLocation = of.scrollLeft();
      v.atLocation = of.scrollTop();
      if ("phone" === devices_default.real().deviceType && of[0].visualViewport) {
        h.atLocation = Math.max(h.atLocation, of[0].visualViewport.offsetLeft);
        v.atLocation = Math.max(v.atLocation, of[0].visualViewport.offsetTop);
        h.atSize = of[0].visualViewport.width;
        v.atSize = of[0].visualViewport.height;
      } else {
        h.atSize = of[0].innerWidth > of[0].outerWidth ? of[0].innerWidth : getWidth(of);
        v.atSize = of[0].innerHeight > of[0].outerHeight || IS_SAFARI ? of[0].innerHeight : getHeight(of);
      }
    } else if (9 === of[0].nodeType) {
      h.atLocation = 0;
      v.atLocation = 0;
      h.atSize = getWidth(of);
      v.atSize = getHeight(of);
    } else {
      var ofRect = getBoundingRect(of.get(0));
      var o = getOffsetWithoutScale(of);
      h.atLocation = o.left;
      v.atLocation = o.top;
      h.atSize = Math.max(ofRect.width, getOuterWidth(of));
      v.atSize = Math.max(ofRect.height, getOuterHeight(of));
    }
  }
  initMyLocation(h);
  initMyLocation(v);
  var bounds = function() {
    var win = renderer_default(window4);
    var windowWidth = getWidth(win);
    var windowHeight = getHeight(win);
    var left = win.scrollLeft();
    var top = win.scrollTop();
    var documentElement = dom_adapter_default.getDocumentElement();
    var hZoomLevel = touch ? documentElement.clientWidth / windowWidth : 1;
    var vZoomLevel = touch ? documentElement.clientHeight / windowHeight : 1;
    if (void 0 === scrollbarWidth) {
      calculateScrollbarWidth();
    }
    var boundaryWidth = windowWidth;
    var boundaryHeight = windowHeight;
    if (boundary && !isWindow(boundary)) {
      var $boundary = renderer_default(boundary);
      var boundaryPosition = $boundary.offset();
      left = boundaryPosition.left;
      top = boundaryPosition.top;
      boundaryWidth = getWidth($boundary);
      boundaryHeight = getHeight($boundary);
    }
    return {
      h: {
        min: left + h.boundaryOffset,
        max: left + boundaryWidth / hZoomLevel - h.mySize - h.boundaryOffset
      },
      v: {
        min: top + v.boundaryOffset,
        max: top + boundaryHeight / vZoomLevel - v.mySize - v.boundaryOffset
      }
    };
  }();
  h.oversize = calculateOversize(h, bounds.h);
  v.oversize = calculateOversize(v, bounds.v);
  h.collisionSide = collisionSide("h", h, bounds.h);
  v.collisionSide = collisionSide("v", v, bounds.v);
  if (collisionResolvers[h.collision]) {
    collisionResolvers[h.collision](h, bounds.h);
  }
  if (collisionResolvers[v.collision]) {
    collisionResolvers[v.collision](v, bounds.v);
  }
  var preciser = function(number) {
    return options.precise ? number : Math.round(number);
  };
  extend(true, result, {
    h: {
      location: preciser(h.myLocation),
      oversize: preciser(h.oversize),
      fit: h.fit,
      flip: h.flip,
      collisionSide: h.collisionSide
    },
    v: {
      location: preciser(v.myLocation),
      oversize: preciser(v.oversize),
      fit: v.fit,
      flip: v.flip,
      collisionSide: v.collisionSide
    },
    precise: options.precise
  });
  return result;
};
var setScaleProperty = function(element, scale, styleAttr, isEmpty) {
  var stylePropIsValid = isDefined(element.style) && !dom_adapter_default.isNode(element.style);
  var newStyleValue = isEmpty ? styleAttr.replace(scale, "") : styleAttr;
  if (stylePropIsValid) {
    setStyle(element, newStyleValue, false);
  } else {
    var styleAttributeNode = dom_adapter_default.createAttribute("style");
    styleAttributeNode.value = newStyleValue;
    element.setAttributeNode(styleAttributeNode);
  }
};
var getOffsetWithoutScale = function getOffsetWithoutScale2($startElement) {
  var _currentElement$getAt, _style$match;
  var $currentElement = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : $startElement;
  var currentElement = $currentElement.get(0);
  if (!currentElement) {
    return $startElement.offset();
  }
  var style = (null === (_currentElement$getAt = currentElement.getAttribute) || void 0 === _currentElement$getAt ? void 0 : _currentElement$getAt.call(currentElement, "style")) || "";
  var scale = null === (_style$match = style.match(scaleRe)) || void 0 === _style$match ? void 0 : _style$match[0];
  var offset2;
  if (scale) {
    setScaleProperty(currentElement, scale, style, true);
    offset2 = getOffsetWithoutScale2($startElement, $currentElement.parent());
    setScaleProperty(currentElement, scale, style, false);
  } else {
    offset2 = getOffsetWithoutScale2($startElement, $currentElement.parent());
  }
  return offset2;
};
var position = function(what, options) {
  var $what = renderer_default(what);
  if (!options) {
    return $what.offset();
  }
  resetPosition($what, true);
  var offset2 = getOffsetWithoutScale($what);
  var targetPosition = options.h && options.v ? options : calculatePosition($what, options);
  var preciser = function(number) {
    return options.precise ? number : Math.round(number);
  };
  move($what, {
    left: targetPosition.h.location - preciser(offset2.left),
    top: targetPosition.v.location - preciser(offset2.top)
  });
  return targetPosition;
};
var offset = function(element) {
  element = renderer_default(element).get(0);
  if (isWindow(element)) {
    return null;
  } else if (element && "pageY" in element && "pageX" in element) {
    return {
      top: element.pageY,
      left: element.pageX
    };
  }
  return renderer_default(element).offset();
};
if (!position.inverseAlign) {
  position.inverseAlign = inverseAlign;
}
if (!position.normalizeAlign) {
  position.normalizeAlign = normalizeAlign;
}
var position_default = {
  calculateScrollbarWidth,
  calculate: calculatePosition,
  setup: position,
  offset
};

// node_modules/devextreme/esm/animation/fx.js
var window5 = getWindow();
var removeEventName = addNamespace2(removeEvent, "dxFX");
var RELATIVE_VALUE_REGEX = /^([+-])=(.*)/i;
var ANIM_DATA_KEY = "dxAnimData";
var ANIM_QUEUE_KEY = "dxAnimQueue";
var TRANSFORM_PROP = "transform";
var TransitionAnimationStrategy = {
  initAnimation: function($element, config) {
    $element.css({
      transitionProperty: "none"
    });
    if ("string" === typeof config.from) {
      $element.addClass(config.from);
    } else {
      setProps($element, config.from);
    }
    var that = this;
    var deferred = new Deferred();
    var cleanupWhen = config.cleanupWhen;
    config.transitionAnimation = {
      deferred,
      finish: function() {
        that._finishTransition($element);
        if (cleanupWhen) {
          when(deferred, cleanupWhen).always(function() {
            that._cleanup($element, config);
          });
        } else {
          that._cleanup($element, config);
        }
        deferred.resolveWith($element, [config, $element]);
      }
    };
    this._completeAnimationCallback($element, config).done(function() {
      config.transitionAnimation.finish();
    }).fail(function() {
      deferred.rejectWith($element, [config, $element]);
    });
    if (!config.duration) {
      config.transitionAnimation.finish();
    }
    $element.css("transform");
  },
  animate: function($element, config) {
    this._startAnimation($element, config);
    return config.transitionAnimation.deferred.promise();
  },
  _completeAnimationCallback: function($element, config) {
    var that = this;
    var startTime = Date.now() + config.delay;
    var deferred = new Deferred();
    var transitionEndFired = new Deferred();
    var simulatedTransitionEndFired = new Deferred();
    var simulatedEndEventTimer;
    var transitionEndEventFullName = transitionEndEventName() + ".dxFX";
    config.transitionAnimation.cleanup = function() {
      clearTimeout(simulatedEndEventTimer);
      clearTimeout(waitForJSCompleteTimer);
      events_engine_default.off($element, transitionEndEventFullName);
      events_engine_default.off($element, removeEventName);
    };
    events_engine_default.one($element, transitionEndEventFullName, function() {
      if (Date.now() - startTime >= config.duration) {
        transitionEndFired.reject();
      }
    });
    events_engine_default.off($element, removeEventName);
    events_engine_default.on($element, removeEventName, function() {
      that.stop($element, config);
      deferred.reject();
    });
    var waitForJSCompleteTimer = setTimeout(function() {
      simulatedEndEventTimer = setTimeout(function() {
        simulatedTransitionEndFired.reject();
      }, config.duration + config.delay + fx._simulatedTransitionEndDelay);
      when(transitionEndFired, simulatedTransitionEndFired).fail((function() {
        deferred.resolve();
      }).bind(this));
    });
    return deferred.promise();
  },
  _startAnimation: function($element, config) {
    $element.css({
      transitionProperty: "all",
      transitionDelay: config.delay + "ms",
      transitionDuration: config.duration + "ms",
      transitionTimingFunction: config.easing
    });
    if ("string" === typeof config.to) {
      $element[0].className += " " + config.to;
    } else if (config.to) {
      setProps($element, config.to);
    }
  },
  _finishTransition: function($element) {
    $element.css("transition", "none");
  },
  _cleanup: function($element, config) {
    config.transitionAnimation.cleanup();
    if ("string" === typeof config.from) {
      $element.removeClass(config.from);
      $element.removeClass(config.to);
    }
  },
  stop: function($element, config, jumpToEnd) {
    if (!config) {
      return;
    }
    if (jumpToEnd) {
      config.transitionAnimation.finish();
    } else {
      if (isPlainObject(config.to)) {
        each(config.to, function(key) {
          $element.css(key, $element.css(key));
        });
      }
      this._finishTransition($element);
      this._cleanup($element, config);
    }
  }
};
var FrameAnimationStrategy = {
  initAnimation: function($element, config) {
    setProps($element, config.from);
  },
  animate: function($element, config) {
    var deferred = new Deferred();
    var that = this;
    if (!config) {
      return deferred.reject().promise();
    }
    each(config.to, function(prop) {
      if (void 0 === config.from[prop]) {
        config.from[prop] = that._normalizeValue($element.css(prop));
      }
    });
    if (config.to[TRANSFORM_PROP]) {
      config.from[TRANSFORM_PROP] = that._parseTransform(config.from[TRANSFORM_PROP]);
      config.to[TRANSFORM_PROP] = that._parseTransform(config.to[TRANSFORM_PROP]);
    }
    config.frameAnimation = {
      to: config.to,
      from: config.from,
      currentValue: config.from,
      easing: convertTransitionTimingFuncToEasing(config.easing),
      duration: config.duration,
      startTime: (/* @__PURE__ */ new Date()).valueOf(),
      finish: function() {
        this.currentValue = this.to;
        this.draw();
        cancelAnimationFrame(config.frameAnimation.animationFrameId);
        deferred.resolve();
      },
      draw: function() {
        if (config.draw) {
          config.draw(this.currentValue);
          return;
        }
        var currentValue = extend({}, this.currentValue);
        if (currentValue[TRANSFORM_PROP]) {
          currentValue[TRANSFORM_PROP] = map(currentValue[TRANSFORM_PROP], function(value2, prop) {
            if ("translate" === prop) {
              return getTranslateCss(value2);
            } else if ("scale" === prop) {
              return "scale(" + value2 + ")";
            } else if ("rotate" === prop.substr(0, prop.length - 1)) {
              return prop + "(" + value2 + "deg)";
            }
          }).join(" ");
        }
        $element.css(currentValue);
      }
    };
    if (config.delay) {
      config.frameAnimation.startTime += config.delay;
      config.frameAnimation.delayTimeout = setTimeout(function() {
        that._startAnimation($element, config);
      }, config.delay);
    } else {
      that._startAnimation($element, config);
    }
    return deferred.promise();
  },
  _startAnimation: function($element, config) {
    events_engine_default.off($element, removeEventName);
    events_engine_default.on($element, removeEventName, function() {
      if (config.frameAnimation) {
        cancelAnimationFrame(config.frameAnimation.animationFrameId);
      }
    });
    this._animationStep($element, config);
  },
  _parseTransform: function(transformString) {
    var result = {};
    each(transformString.match(/\w+\d*\w*\([^)]*\)\s*/g), function(i, part) {
      var translateData = parseTranslate(part);
      var scaleData = part.match(/scale\((.+?)\)/);
      var rotateData = part.match(/(rotate.)\((.+)deg\)/);
      if (translateData) {
        result.translate = translateData;
      }
      if (scaleData && scaleData[1]) {
        result.scale = parseFloat(scaleData[1]);
      }
      if (rotateData && rotateData[1]) {
        result[rotateData[1]] = parseFloat(rotateData[2]);
      }
    });
    return result;
  },
  stop: function($element, config, jumpToEnd) {
    var frameAnimation = config && config.frameAnimation;
    if (!frameAnimation) {
      return;
    }
    cancelAnimationFrame(frameAnimation.animationFrameId);
    clearTimeout(frameAnimation.delayTimeout);
    if (jumpToEnd) {
      frameAnimation.finish();
    }
    delete config.frameAnimation;
  },
  _animationStep: function($element, config) {
    var frameAnimation = config && config.frameAnimation;
    if (!frameAnimation) {
      return;
    }
    var now = (/* @__PURE__ */ new Date()).valueOf();
    if (now >= frameAnimation.startTime + frameAnimation.duration) {
      frameAnimation.finish();
      return;
    }
    frameAnimation.currentValue = this._calcStepValue(frameAnimation, now - frameAnimation.startTime);
    frameAnimation.draw();
    var that = this;
    frameAnimation.animationFrameId = requestAnimationFrame(function() {
      that._animationStep($element, config);
    });
  },
  _calcStepValue: function(frameAnimation, currentDuration) {
    return function calcValueRecursively(from, to) {
      var result = Array.isArray(to) ? [] : {};
      each(to, function(propName, endPropValue) {
        if ("string" === typeof endPropValue && false === parseFloat(endPropValue)) {
          return true;
        }
        result[propName] = "object" === typeof endPropValue ? calcValueRecursively(from[propName], endPropValue) : function(propName2) {
          var x = currentDuration / frameAnimation.duration;
          var t = currentDuration;
          var b = 1 * from[propName2];
          var c = to[propName2] - from[propName2];
          var d = frameAnimation.duration;
          return getEasing(frameAnimation.easing)(x, t, b, c, d);
        }(propName);
      });
      return result;
    }(frameAnimation.from, frameAnimation.to);
  },
  _normalizeValue: function(value2) {
    var numericValue = parseFloat(value2);
    if (false === numericValue) {
      return value2;
    }
    return numericValue;
  }
};
var FallbackToNoAnimationStrategy = {
  initAnimation: function() {
  },
  animate: function() {
    return new Deferred().resolve().promise();
  },
  stop: noop,
  isSynchronous: true
};
var getAnimationStrategy = function(config) {
  config = config || {};
  var animationStrategies = {
    transition: transition() ? TransitionAnimationStrategy : FrameAnimationStrategy,
    frame: FrameAnimationStrategy,
    noAnimation: FallbackToNoAnimationStrategy
  };
  var strategy2 = config.strategy || "transition";
  if ("css" === config.type && !transition()) {
    strategy2 = "noAnimation";
  }
  return animationStrategies[strategy2];
};
var baseConfigValidator = function(config, animationType, validate, typeMessage) {
  each(["from", "to"], function() {
    if (!validate(config[this])) {
      throw errors_default.Error("E0010", animationType, this, typeMessage);
    }
  });
};
var isObjectConfigValidator = function(config, animationType) {
  return baseConfigValidator(config, animationType, function(target) {
    return isPlainObject(target);
  }, "a plain object");
};
var isStringConfigValidator = function(config, animationType) {
  return baseConfigValidator(config, animationType, function(target) {
    return "string" === typeof target;
  }, "a string");
};
var CustomAnimationConfigurator = {
  setup: function() {
  }
};
var CssAnimationConfigurator = {
  validateConfig: function(config) {
    isStringConfigValidator(config, "css");
  },
  setup: function() {
  }
};
var positionAliases = {
  top: {
    my: "bottom center",
    at: "top center"
  },
  bottom: {
    my: "top center",
    at: "bottom center"
  },
  right: {
    my: "left center",
    at: "right center"
  },
  left: {
    my: "right center",
    at: "left center"
  }
};
var SlideAnimationConfigurator = {
  validateConfig: function(config) {
    isObjectConfigValidator(config, "slide");
  },
  setup: function($element, config) {
    var location = locate($element);
    if ("slide" !== config.type) {
      var positioningConfig = "slideIn" === config.type ? config.from : config.to;
      positioningConfig.position = extend({
        of: window5
      }, positionAliases[config.direction]);
      setupPosition($element, positioningConfig);
    }
    this._setUpConfig(location, config.from);
    this._setUpConfig(location, config.to);
    clearCache($element);
  },
  _setUpConfig: function(location, config) {
    config.left = "left" in config ? config.left : "+=0";
    config.top = "top" in config ? config.top : "+=0";
    this._initNewPosition(location, config);
  },
  _initNewPosition: function(location, config) {
    var position2 = {
      left: config.left,
      top: config.top
    };
    delete config.left;
    delete config.top;
    var relativeValue = this._getRelativeValue(position2.left);
    if (void 0 !== relativeValue) {
      position2.left = relativeValue + location.left;
    } else {
      config.left = 0;
    }
    relativeValue = this._getRelativeValue(position2.top);
    if (void 0 !== relativeValue) {
      position2.top = relativeValue + location.top;
    } else {
      config.top = 0;
    }
    config[TRANSFORM_PROP] = getTranslateCss({
      x: position2.left,
      y: position2.top
    });
  },
  _getRelativeValue: function(value2) {
    var relativeValue;
    if ("string" === typeof value2 && (relativeValue = RELATIVE_VALUE_REGEX.exec(value2))) {
      return parseInt(relativeValue[1] + "1") * relativeValue[2];
    }
  }
};
var FadeAnimationConfigurator = {
  setup: function($element, config) {
    var _from$opacity, _to$opacity;
    var from = config.from;
    var to = config.to;
    var defaultFromOpacity = "fadeOut" === config.type ? 1 : 0;
    var defaultToOpacity = "fadeOut" === config.type ? 0 : 1;
    var fromOpacity = isPlainObject(from) ? String(null !== (_from$opacity = from.opacity) && void 0 !== _from$opacity ? _from$opacity : defaultFromOpacity) : String(from);
    var toOpacity = isPlainObject(to) ? String(null !== (_to$opacity = to.opacity) && void 0 !== _to$opacity ? _to$opacity : defaultToOpacity) : String(to);
    if (!config.skipElementInitialStyles) {
      fromOpacity = $element.css("opacity");
    }
    switch (config.type) {
      case "fadeIn":
        toOpacity = 1;
        break;
      case "fadeOut":
        toOpacity = 0;
    }
    config.from = {
      visibility: "visible",
      opacity: fromOpacity
    };
    config.to = {
      opacity: toOpacity
    };
  }
};
var PopAnimationConfigurator = {
  validateConfig: function(config) {
    isObjectConfigValidator(config, "pop");
  },
  setup: function($element, config) {
    var from = config.from;
    var to = config.to;
    var fromOpacity = "opacity" in from ? from.opacity : $element.css("opacity");
    var toOpacity = "opacity" in to ? to.opacity : 1;
    var fromScale = "scale" in from ? from.scale : 0;
    var toScale = "scale" in to ? to.scale : 1;
    config.from = {
      opacity: fromOpacity
    };
    var translate = getTranslate($element);
    config.from[TRANSFORM_PROP] = this._getCssTransform(translate, fromScale);
    config.to = {
      opacity: toOpacity
    };
    config.to[TRANSFORM_PROP] = this._getCssTransform(translate, toScale);
  },
  _getCssTransform: function(translate, scale) {
    return getTranslateCss(translate) + "scale(" + scale + ")";
  }
};
var animationConfigurators = {
  custom: CustomAnimationConfigurator,
  slide: SlideAnimationConfigurator,
  slideIn: SlideAnimationConfigurator,
  slideOut: SlideAnimationConfigurator,
  fade: FadeAnimationConfigurator,
  fadeIn: FadeAnimationConfigurator,
  fadeOut: FadeAnimationConfigurator,
  pop: PopAnimationConfigurator,
  css: CssAnimationConfigurator
};
var getAnimationConfigurator = function(config) {
  var result = animationConfigurators[config.type];
  if (!result) {
    throw errors_default.Error("E0011", config.type);
  }
  return result;
};
var defaultJSConfig = {
  type: "custom",
  from: {},
  to: {},
  duration: 400,
  start: noop,
  complete: noop,
  easing: "ease",
  delay: 0
};
var defaultCssConfig = {
  duration: 400,
  easing: "ease",
  delay: 0
};
function setupAnimationOnElement() {
  var $element = this.element;
  var config = this.config;
  setupPosition($element, config.from);
  setupPosition($element, config.to);
  this.configurator.setup($element, config);
  $element.data(ANIM_DATA_KEY, this);
  if (fx.off) {
    config.duration = 0;
    config.delay = 0;
  }
  this.strategy.initAnimation($element, config);
  if (config.start) {
    var element = getPublicElement($element);
    config.start.apply(this, [element, config]);
  }
}
var onElementAnimationComplete = function(animation2) {
  var $element = animation2.element;
  var config = animation2.config;
  $element.removeData(ANIM_DATA_KEY);
  if (config.complete) {
    var element = getPublicElement($element);
    config.complete.apply(this, [element, config]);
  }
  animation2.deferred.resolveWith(this, [$element, config]);
};
var startAnimationOnElement = function() {
  var animation2 = this;
  var $element = animation2.element;
  var config = animation2.config;
  animation2.isStarted = true;
  return animation2.strategy.animate($element, config).done(function() {
    onElementAnimationComplete(animation2);
  }).fail(function() {
    animation2.deferred.rejectWith(this, [$element, config]);
  });
};
var stopAnimationOnElement = function(jumpToEnd) {
  var $element = this.element;
  var config = this.config;
  clearTimeout(this.startTimeout);
  if (!this.isStarted) {
    this.start();
  }
  this.strategy.stop($element, config, jumpToEnd);
};
var scopedRemoveEvent = addNamespace2(removeEvent, "dxFXStartAnimation");
var subscribeToRemoveEvent = function(animation2) {
  events_engine_default.off(animation2.element, scopedRemoveEvent);
  events_engine_default.on(animation2.element, scopedRemoveEvent, function() {
    fx.stop(animation2.element);
  });
  animation2.deferred.always(function() {
    events_engine_default.off(animation2.element, scopedRemoveEvent);
  });
};
var createAnimation = function(element, initialConfig) {
  var defaultConfig = "css" === initialConfig.type ? defaultCssConfig : defaultJSConfig;
  var config = extend(true, {}, defaultConfig, initialConfig);
  var configurator = getAnimationConfigurator(config);
  var strategy2 = getAnimationStrategy(config);
  var animation2 = {
    element: renderer_default(element),
    config,
    configurator,
    strategy: strategy2,
    isSynchronous: strategy2.isSynchronous,
    setup: setupAnimationOnElement,
    start: startAnimationOnElement,
    stop: stopAnimationOnElement,
    deferred: new Deferred()
  };
  if (isFunction(configurator.validateConfig)) {
    configurator.validateConfig(config);
  }
  subscribeToRemoveEvent(animation2);
  return animation2;
};
var animate = function(element, config) {
  var $element = renderer_default(element);
  if (!$element.length) {
    return new Deferred().resolve().promise();
  }
  var animation2 = createAnimation($element, config);
  pushInAnimationQueue($element, animation2);
  return animation2.deferred.promise();
};
function pushInAnimationQueue($element, animation2) {
  var queueData = getAnimQueueData($element);
  writeAnimQueueData($element, queueData);
  queueData.push(animation2);
  if (!isAnimating($element)) {
    shiftFromAnimationQueue($element, queueData);
  }
}
function getAnimQueueData($element) {
  return $element.data(ANIM_QUEUE_KEY) || [];
}
function writeAnimQueueData($element, queueData) {
  $element.data(ANIM_QUEUE_KEY, queueData);
}
var destroyAnimQueueData = function($element) {
  $element.removeData(ANIM_QUEUE_KEY);
};
function isAnimating($element) {
  return !!$element.data(ANIM_DATA_KEY);
}
function shiftFromAnimationQueue($element, queueData) {
  queueData = getAnimQueueData($element);
  if (!queueData.length) {
    return;
  }
  var animation2 = queueData.shift();
  if (0 === queueData.length) {
    destroyAnimQueueData($element);
  }
  executeAnimation(animation2).done(function() {
    if (!isAnimating($element)) {
      shiftFromAnimationQueue($element);
    }
  });
}
function executeAnimation(animation2) {
  animation2.setup();
  if (fx.off || animation2.isSynchronous) {
    animation2.start();
  } else {
    animation2.startTimeout = setTimeout(function() {
      animation2.start();
    });
  }
  return animation2.deferred.promise();
}
function setupPosition($element, config) {
  if (!config || !config.position) {
    return;
  }
  var win = renderer_default(window5);
  var left = 0;
  var top = 0;
  var position2 = position_default.calculate($element, config.position);
  var offset2 = $element.offset();
  var currentPosition = $element.position();
  if (currentPosition.top > offset2.top) {
    top = win.scrollTop();
  }
  if (currentPosition.left > offset2.left) {
    left = win.scrollLeft();
  }
  extend(config, {
    left: position2.h.location - offset2.left + currentPosition.left - left,
    top: position2.v.location - offset2.top + currentPosition.top - top
  });
  delete config.position;
}
function setProps($element, props) {
  each(props, function(key, value2) {
    try {
      $element.css(key, isFunction(value2) ? value2() : value2);
    } catch (e) {
    }
  });
}
var stop = function(element, jumpToEnd) {
  var $element = renderer_default(element);
  var queueData = getAnimQueueData($element);
  each(queueData, function(_, animation3) {
    animation3.config.delay = 0;
    animation3.config.duration = 0;
    animation3.isSynchronous = true;
  });
  if (!isAnimating($element)) {
    shiftFromAnimationQueue($element, queueData);
  }
  var animation2 = $element.data(ANIM_DATA_KEY);
  if (animation2) {
    animation2.stop(jumpToEnd);
  }
  $element.removeData(ANIM_DATA_KEY);
  destroyAnimQueueData($element);
};
var fx = {
  off: false,
  animationTypes: animationConfigurators,
  animate,
  createAnimation,
  isAnimating,
  stop,
  _simulatedTransitionEndDelay: 100
};
var fx_default = fx;

// node_modules/devextreme/esm/core/utils/dom.js
var window6 = getWindow();
var getRootNodeHost = (element) => {
  if (!element.getRootNode) {
    return;
  }
  var host = element.getRootNode().host;
  if (isString(host)) {
    return;
  }
  return host;
};
var resetActiveElement = () => {
  var activeElement = dom_adapter_default.getActiveElement();
  if (activeElement && activeElement !== dom_adapter_default.getBody()) {
    var _activeElement$blur;
    null === (_activeElement$blur = activeElement.blur) || void 0 === _activeElement$blur ? void 0 : _activeElement$blur.call(activeElement);
  }
};
var clearSelection = () => {
  var selection = window6.getSelection();
  if (!selection) {
    return;
  }
  if ("Caret" === selection.type) {
    return;
  }
  if (selection.empty) {
    selection.empty();
  } else if (selection.removeAllRanges) {
    try {
      selection.removeAllRanges();
    } catch (e) {
    }
  }
};
var closestCommonParent = (startTarget, endTarget) => {
  var $startTarget = renderer_default(startTarget);
  var $endTarget = renderer_default(endTarget);
  if ($startTarget[0] === $endTarget[0]) {
    return $startTarget[0];
  }
  var $startParents = $startTarget.parents();
  var $endParents = $endTarget.parents();
  var startingParent = Math.min($startParents.length, $endParents.length);
  for (var i = -startingParent; i < 0; i++) {
    if ($startParents.get(i) === $endParents.get(i)) {
      return $startParents.get(i);
    }
  }
};
var normalizeTemplateElement = (element) => {
  var $element = isDefined(element) && (element.nodeType || isRenderer(element)) ? renderer_default(element) : renderer_default("<div>").html(element).contents();
  if (1 === $element.length) {
    if ($element.is("script")) {
      $element = normalizeTemplateElement($element.html().trim());
    } else if ($element.is("table")) {
      $element = $element.children("tbody").contents();
    }
  }
  return $element;
};
var clipboardText = (event, text) => {
  var clipboard = event.originalEvent && event.originalEvent.clipboardData || window6.clipboardData;
  if (!text) {
    return clipboard && clipboard.getData("Text");
  }
  clipboard && clipboard.setData("Text", text);
};
var contains = (container, element) => {
  if (!element) {
    return false;
  }
  if (isWindow(container)) {
    return contains(container.document, element);
  }
  return container.contains(element) || contains(container, getRootNodeHost(element));
};
var createTextElementHiddenCopy = (element, text, options) => {
  var elementStyles = window6.getComputedStyle(renderer_default(element).get(0));
  var includePaddings = options && options.includePaddings;
  return renderer_default("<div>").text(text).css({
    fontStyle: elementStyles.fontStyle,
    fontVariant: elementStyles.fontVariant,
    fontWeight: elementStyles.fontWeight,
    fontSize: elementStyles.fontSize,
    fontFamily: elementStyles.fontFamily,
    letterSpacing: elementStyles.letterSpacing,
    border: elementStyles.border,
    paddingTop: includePaddings ? elementStyles.paddingTop : "",
    paddingRight: includePaddings ? elementStyles.paddingRight : "",
    paddingBottom: includePaddings ? elementStyles.paddingBottom : "",
    paddingLeft: includePaddings ? elementStyles.paddingLeft : "",
    visibility: "hidden",
    whiteSpace: "pre",
    position: "absolute",
    float: "left"
  });
};
var insertBefore = (element, newElement) => {
  if (newElement) {
    dom_adapter_default.insertElement(element.parentNode, newElement, element);
  }
  return element;
};
var replaceWith = (element, newElement) => {
  if (!(newElement && newElement[0])) {
    return;
  }
  if (newElement.is(element)) {
    return element;
  }
  each(newElement, (_, currentElement) => {
    insertBefore(element[0], currentElement);
  });
  element.remove();
  return newElement;
};
var isElementInDom = ($element) => {
  var element = null === $element || void 0 === $element ? void 0 : $element.get(0);
  var shadowHost = null === element || void 0 === element ? void 0 : element.getRootNode().host;
  return !!renderer_default(shadowHost || element).closest(getWindow().document).length;
};

// node_modules/devextreme/esm/events/visibility_change.js
var triggerVisibilityChangeEvent = function(eventName) {
  return function(element) {
    var $element = renderer_default(element || "body");
    var changeHandlers = $element.filter(".dx-visibility-change-handler").add($element.find(".dx-visibility-change-handler"));
    for (var i = 0; i < changeHandlers.length; i++) {
      events_engine_default.triggerHandler(changeHandlers[i], eventName);
    }
  };
};
var triggerShownEvent = triggerVisibilityChangeEvent("dxshown");
var triggerHidingEvent = triggerVisibilityChangeEvent("dxhiding");
var triggerResizeEvent = triggerVisibilityChangeEvent("dxresize");

// node_modules/devextreme/esm/core/templates/template_base.js
var renderedCallbacks = callbacks_default({
  syncStrategy: true
});
var TemplateBase = class {
  render(options) {
    options = options || {};
    var onRendered = options.onRendered;
    delete options.onRendered;
    var $result;
    if (options.renovated && options.transclude && this._element) {
      $result = renderer_default("<div>").append(this._element).contents();
    } else {
      $result = this._renderCore(options);
    }
    this._ensureResultInContainer($result, options.container);
    renderedCallbacks.fire($result, options.container);
    onRendered && onRendered();
    return $result;
  }
  _ensureResultInContainer($result, container) {
    if (!container) {
      return;
    }
    var $container = renderer_default(container);
    var resultInContainer = contains($container.get(0), $result.get(0));
    $container.append($result);
    if (resultInContainer) {
      return;
    }
    var resultInBody = dom_adapter_default.getBody().contains($container.get(0));
    if (!resultInBody) {
      return;
    }
    triggerShownEvent($result);
  }
  _renderCore() {
    throw errors_default.Error("E0001");
  }
};

// node_modules/devextreme/esm/core/templates/empty_template.js
var EmptyTemplate = class extends TemplateBase {
  _renderCore() {
    return renderer_default();
  }
};

// node_modules/devextreme/esm/ui/widget/ui.errors.js
var ui_errors_default = error_default(errors_default.ERROR_MESSAGES, {
  E1001: "Module '{0}'. Controller '{1}' is already registered",
  E1002: "Module '{0}'. Controller '{1}' does not inherit from DevExpress.ui.dxDataGrid.Controller",
  E1003: "Module '{0}'. View '{1}' is already registered",
  E1004: "Module '{0}'. View '{1}' does not inherit from DevExpress.ui.dxDataGrid.View",
  E1005: "Public method '{0}' is already registered",
  E1006: "Public method '{0}.{1}' does not exist",
  E1007: "State storing cannot be provided due to the restrictions of the browser",
  E1010: "The template does not contain the TextBox widget",
  E1011: 'Items cannot be deleted from the List. Implement the "remove" function in the data store',
  E1012: "Editing type '{0}' with the name '{1}' is unsupported",
  E1016: "Unexpected type of data source is provided for a lookup column",
  E1018: "The 'collapseAll' method cannot be called if you use a remote data source",
  E1019: "Search mode '{0}' is unavailable",
  E1020: "The type cannot be changed after initialization",
  E1021: "{0} '{1}' you are trying to remove does not exist",
  E1022: 'The "markers" option is given an invalid value. Assign an array instead',
  E1023: 'The "routes" option is given an invalid value. Assign an array instead',
  E1025: "This layout is too complex to render",
  E1026: 'The "calculateCustomSummary" function is missing from a field whose "summaryType" option is set to "custom"',
  E1031: "Unknown subscription in the Scheduler widget: '{0}'",
  E1032: "Unknown start date in an appointment: '{0}'",
  E1033: "Unknown step in the date navigator: '{0}'",
  E1034: "The browser does not implement an API for saving files",
  E1035: "The editor cannot be created: {0}",
  E1037: "Invalid structure of grouped data",
  E1038: "The browser does not support local storages for local web pages",
  E1039: "A cell's position cannot be calculated",
  E1040: "The '{0}' key value is not unique within the data array",
  E1041: "The '{0}' script is referenced after the DevExtreme scripts or not referenced at all",
  E1042: "{0} requires the key field to be specified",
  E1043: "Changes cannot be processed due to the incorrectly set key",
  E1044: "The key field specified by the keyExpr option does not match the key field specified in the data store",
  E1045: "Editing requires the key field to be specified in the data store",
  E1046: "The '{0}' key field is not found in data objects",
  E1047: 'The "{0}" field is not found in the fields array',
  E1048: 'The "{0}" operation is not found in the filterOperations array',
  E1049: "Column '{0}': filtering is allowed but the 'dataField' or 'name' option is not specified",
  E1050: "The validationRules option does not apply to third-party editors defined in the editCellTemplate",
  E1051: `HtmlEditor's valueType is "{0}", but the {0} converter was not imported.`,
  E1052: '{0} should have the "dataSource" option specified',
  E1053: 'The "buttons" option accepts an array that contains only objects or string values',
  E1054: "All text editor buttons must have names",
  E1055: 'One or several text editor buttons have invalid or non-unique "name" values',
  E1056: 'The {0} widget does not support buttons of the "{1}" type',
  E1058: 'The "startDayHour" and "endDayHour" options must be integers in the [0, 24] range, with "endDayHour" being greater than "startDayHour".',
  E1059: "The following column names are not unique: {0}",
  E1060: "All editable columns must have names",
  E1061: 'The "offset" option must be an integer in the [-1440, 1440] range, divisible by 5 without a remainder.',
  E1062: 'The "cellDuration" must be a positive integer, evenly dividing the ("endDayHour" - "startDayHour") interval into minutes.',
  W1001: 'The "key" option cannot be modified after initialization',
  W1002: "An item with the key '{0}' does not exist",
  W1003: "A group with the key '{0}' in which you are trying to select items does not exist",
  W1004: "The item '{0}' you are trying to select in the group '{1}' does not exist",
  W1005: "Due to column data types being unspecified, data has been loaded twice in order to apply initial filter settings. To resolve this issue, specify data types for all grid columns.",
  W1006: "The map service returned the following error: '{0}'",
  W1007: "No item with key {0} was found in the data source, but this key was used as the parent key for item {1}",
  W1008: "Cannot scroll to the '{0}' date because it does not exist on the current view",
  W1009: "Searching works only if data is specified using the dataSource option",
  W1010: "The capability to select all items works with source data of plain structure only",
  W1011: 'The "keyExpr" option is not applied when dataSource is not an array',
  W1012: "The '{0}' key field is not found in data objects",
  W1013: 'The "message" field in the dialog component was renamed to "messageHtml". Change your code correspondingly. In addition, if you used HTML code in the message, make sure that it is secure',
  W1014: "The Floating Action Button exceeds the recommended speed dial action count. If you need to display more speed dial actions, increase the maxSpeedDialActionCount option value in the global config.",
  W1016: "The '{0}' field in the HTML Editor toolbar item configuration was renamed to '{1}'. Please make a corresponding change in your code.",
  W1017: "The 'key' property is not specified for a lookup data source. Please specify it to prevent requests for the entire dataset when users filter data.",
  W1018: "Infinite scrolling may not work properly with multiple selection. To use these features together, set 'selection.deferred' to true or set 'selection.selectAllMode' to 'page'.",
  W1019: "Filter query string exceeds maximum length limit of {0} characters.",
  W1020: "hideEvent is ignored when the shading property is true",
  W1021: `The '{0}' is not rendered because none of the DOM elements match the value of the "container" property.`,
  W1022: "{0} JSON parsing error: '{1}'",
  W1023: "Appointments require unique keys. Otherwise, the agenda view may not work correctly.",
  W1024: "The client-side export is enabled. Implement the 'onExporting' function.",
  W1025: "'scrolling.mode' is set to 'virtual' or 'infinite'. Specify the height of the component."
});

// node_modules/devextreme/esm/core/utils/array.js
function createOccurrenceMap(array) {
  return array.reduce((map2, value2) => {
    var _map$get;
    var count = (null !== (_map$get = map2.get(value2)) && void 0 !== _map$get ? _map$get : 0) + 1;
    map2.set(value2, count);
    return map2;
  }, /* @__PURE__ */ new Map());
}
var wrapToArray = function(item) {
  return Array.isArray(item) ? item : [item];
};
var getUniqueValues = function(values) {
  return [...new Set(values)];
};
var getIntersection = function(firstArray, secondArray) {
  var toRemoveMap = createOccurrenceMap(secondArray);
  return firstArray.filter((value2) => {
    var occurrencesCount = toRemoveMap.get(value2);
    occurrencesCount && toRemoveMap.set(value2, occurrencesCount - 1);
    return occurrencesCount;
  });
};
var removeDuplicates = function() {
  var from = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
  var toRemove = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
  var toRemoveMap = createOccurrenceMap(toRemove);
  return from.filter((value2) => {
    var occurrencesCount = toRemoveMap.get(value2);
    occurrencesCount && toRemoveMap.set(value2, occurrencesCount - 1);
    return !occurrencesCount;
  });
};
var normalizeIndexes = function(items, indexPropName, currentItem, needIndexCallback) {
  var indexedItems = {};
  var {
    useLegacyVisibleIndex
  } = config_default();
  var currentIndex = 0;
  var shouldUpdateIndex = (item) => !isDefined(item[indexPropName]) && (!needIndexCallback || needIndexCallback(item));
  items.forEach((item) => {
    var index2 = item[indexPropName];
    if (index2 >= 0) {
      indexedItems[index2] = indexedItems[index2] || [];
      if (item === currentItem) {
        indexedItems[index2].unshift(item);
      } else {
        indexedItems[index2].push(item);
      }
    } else {
      item[indexPropName] = void 0;
    }
  });
  if (!useLegacyVisibleIndex) {
    items.forEach((item) => {
      if (shouldUpdateIndex(item)) {
        while (indexedItems[currentIndex]) {
          currentIndex++;
        }
        indexedItems[currentIndex] = [item];
        currentIndex++;
      }
    });
  }
  currentIndex = 0;
  orderEach(indexedItems, function(index2, items2) {
    items2.forEach((item) => {
      if (index2 >= 0) {
        item[indexPropName] = currentIndex++;
      }
    });
  });
  if (useLegacyVisibleIndex) {
    items.forEach((item) => {
      if (shouldUpdateIndex(item)) {
        item[indexPropName] = currentIndex++;
      }
    });
  }
};
var groupBy = (array, getGroupName) => array.reduce((groupedResult, item) => {
  var _groupedResult$groupN;
  var groupName = getGroupName(item);
  groupedResult[groupName] = null !== (_groupedResult$groupN = groupedResult[groupName]) && void 0 !== _groupedResult$groupN ? _groupedResult$groupN : [];
  groupedResult[groupName].push(item);
  return groupedResult;
}, {});

// node_modules/devextreme/esm/core/utils/math.js
var sign = function(value2) {
  if (0 === value2) {
    return 0;
  }
  return value2 / Math.abs(value2);
};
var fitIntoRange = function(value2, minValue, maxValue) {
  var isMinValueUndefined = !minValue && 0 !== minValue;
  var isMaxValueUndefined = !maxValue && 0 !== maxValue;
  isMinValueUndefined && (minValue = !isMaxValueUndefined ? Math.min(value2, maxValue) : value2);
  isMaxValueUndefined && (maxValue = !isMinValueUndefined ? Math.max(value2, minValue) : value2);
  return Math.min(Math.max(value2, minValue), maxValue);
};
var inRange = function(value2, minValue, maxValue) {
  return value2 >= minValue && value2 <= maxValue;
};
function getExponent(value2) {
  return Math.abs(parseInt(value2.toExponential().split("e")[1]));
}
function getExponentialNotation(value2) {
  var parts = value2.toExponential().split("e");
  var mantissa = parseFloat(parts[0]);
  var exponent = parseInt(parts[1]);
  return {
    exponent,
    mantissa
  };
}
function multiplyInExponentialForm(value2, exponentShift) {
  var exponentialNotation = getExponentialNotation(value2);
  return parseFloat("".concat(exponentialNotation.mantissa, "e").concat(exponentialNotation.exponent + exponentShift));
}
function _isEdgeBug() {
  return "0.000300" !== 3e-4.toPrecision(3);
}
function adjust(value2, interval) {
  var precision = getPrecision(interval || 0) + 2;
  var separatedValue = value2.toString().split(".");
  var sourceValue = value2;
  var absValue = Math.abs(value2);
  var separatedAdjustedValue;
  var isExponentValue = isExponential(value2);
  var integerPart = absValue > 1 ? 10 : 0;
  if (1 === separatedValue.length) {
    return value2;
  }
  if (!isExponentValue) {
    if (isExponential(interval)) {
      precision = separatedValue[0].length + getExponent(interval);
    }
    value2 = absValue;
    value2 = value2 - Math.floor(value2) + integerPart;
  }
  precision = _isEdgeBug() && getExponent(value2) > 6 || precision > 7 ? 15 : 7;
  if (!isExponentValue) {
    separatedAdjustedValue = parseFloat(value2.toPrecision(precision)).toString().split(".");
    if (separatedAdjustedValue[0] === integerPart.toString()) {
      return parseFloat(separatedValue[0] + "." + separatedAdjustedValue[1]);
    }
  }
  return parseFloat(sourceValue.toPrecision(precision));
}
function getPrecision(value2) {
  var str = value2.toString();
  if (str.indexOf(".") < 0) {
    return 0;
  }
  var mantissa = str.split(".");
  var positionOfDelimiter = mantissa[1].indexOf("e");
  return positionOfDelimiter >= 0 ? positionOfDelimiter : mantissa[1].length;
}
function getRoot(x, n) {
  if (x < 0 && n % 2 !== 1) {
    return NaN;
  }
  var y = Math.pow(Math.abs(x), 1 / n);
  return n % 2 === 1 && x < 0 ? -y : y;
}
function solveCubicEquation(a, b, c, d) {
  if (Math.abs(a) < 1e-8) {
    a = b;
    b = c;
    c = d;
    if (Math.abs(a) < 1e-8) {
      a = b;
      b = c;
      if (Math.abs(a) < 1e-8) {
        return [];
      }
      return [-b / a];
    }
    var D2 = b * b - 4 * a * c;
    if (Math.abs(D2) < 1e-8) {
      return [-b / (2 * a)];
    } else if (D2 > 0) {
      return [(-b + Math.sqrt(D2)) / (2 * a), (-b - Math.sqrt(D2)) / (2 * a)];
    }
    return [];
  }
  var p = (3 * a * c - b * b) / (3 * a * a);
  var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  var roots;
  var u;
  if (Math.abs(p) < 1e-8) {
    roots = [getRoot(-q, 3)];
  } else if (Math.abs(q) < 1e-8) {
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    var D3 = q * q / 4 + p * p * p / 27;
    if (Math.abs(D3) < 1e-8) {
      roots = [-1.5 * q / p, 3 * q / p];
    } else if (D3 > 0) {
      u = getRoot(-q / 2 - Math.sqrt(D3), 3);
      roots = [u - p / (3 * u)];
    } else {
      u = 2 * Math.sqrt(-p / 3);
      var t = Math.acos(3 * q / p / u) / 3;
      var k = 2 * Math.PI / 3;
      roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
    }
  }
  for (var i = 0; i < roots.length; i++) {
    roots[i] -= b / (3 * a);
  }
  return roots;
}
function trunc(value2) {
  return Math.trunc ? Math.trunc(value2) : value2 > 0 ? Math.floor(value2) : Math.ceil(value2);
}
function getRemainderByDivision(dividend, divider, digitsCount) {
  if (divider === parseInt(divider)) {
    return dividend % divider;
  }
  var quotient = roundFloatPart(dividend / divider, digitsCount);
  return (quotient - parseInt(quotient)) * divider;
}
function getExponentLength(value2) {
  var _valueString$split$;
  var valueString = value2.toString();
  return (null === (_valueString$split$ = valueString.split(".")[1]) || void 0 === _valueString$split$ ? void 0 : _valueString$split$.length) || parseInt(valueString.split("e-")[1]) || 0;
}
function roundFloatPart(value2) {
  var digitsCount = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
  return parseFloat(value2.toFixed(digitsCount));
}

// node_modules/devextreme/esm/events/core/emitter.js
var Emitter = class_default.inherit({
  ctor: function(element) {
    this._$element = renderer_default(element);
    this._cancelCallback = callbacks_default();
    this._acceptCallback = callbacks_default();
  },
  getElement: function() {
    return this._$element;
  },
  validate: function(e) {
    return !isDxMouseWheelEvent(e);
  },
  validatePointers: function(e) {
    return 1 === hasTouches(e);
  },
  allowInterruptionByMouseWheel: function() {
    return true;
  },
  configure: function(data2) {
    extend(this, data2);
  },
  addCancelCallback: function(callback) {
    this._cancelCallback.add(callback);
  },
  removeCancelCallback: function() {
    this._cancelCallback.empty();
  },
  _cancel: function(e) {
    this._cancelCallback.fire(this, e);
  },
  addAcceptCallback: function(callback) {
    this._acceptCallback.add(callback);
  },
  removeAcceptCallback: function() {
    this._acceptCallback.empty();
  },
  _accept: function(e) {
    this._acceptCallback.fire(this, e);
  },
  _requestAccept: function(e) {
    this._acceptRequestEvent = e;
  },
  _forgetAccept: function() {
    this._accept(this._acceptRequestEvent);
    this._acceptRequestEvent = null;
  },
  start: noop,
  move: noop,
  end: noop,
  cancel: noop,
  reset: function() {
    if (this._acceptRequestEvent) {
      this._accept(this._acceptRequestEvent);
    }
  },
  _fireEvent: function(eventName, e, params) {
    var eventData2 = extend({
      type: eventName,
      originalEvent: e,
      target: this._getEmitterTarget(e),
      delegateTarget: this.getElement().get(0)
    }, params);
    e = fireEvent(eventData2);
    if (e.cancel) {
      this._cancel(e);
    }
    return e;
  },
  _getEmitterTarget: function(e) {
    return (this.delegateSelector ? renderer_default(e.target).closest(this.delegateSelector) : this.getElement()).get(0);
  },
  dispose: noop
});
var emitter_default = Emitter;

// node_modules/devextreme/esm/events/gesture/emitter.gesture.js
var ready2 = ready_callbacks_default.add;
var abs = Math.abs;
var SLEEP = 0;
var INITED = 1;
var STARTED = 2;
var TOUCH_BOUNDARY = 10;
var IMMEDIATE_TOUCH_BOUNDARY = 0;
var IMMEDIATE_TIMEOUT = 180;
var supportPointerEvents = function() {
  return styleProp("pointer-events");
};
var setGestureCover = call_once_default(function() {
  var isDesktop = "desktop" === devices_default.real().deviceType;
  if (!supportPointerEvents() || !isDesktop) {
    return noop;
  }
  var $cover = renderer_default("<div>").addClass("dx-gesture-cover").css("pointerEvents", "none");
  events_engine_default.subscribeGlobal($cover, "dxmousewheel", function(e) {
    e.preventDefault();
  });
  ready2(function() {
    $cover.appendTo("body");
  });
  return function(toggle, cursor) {
    $cover.css("pointerEvents", toggle ? "all" : "none");
    toggle && $cover.css("cursor", cursor);
  };
});
var gestureCover = function(toggle, cursor) {
  var gestureCoverStrategy = setGestureCover();
  gestureCoverStrategy(toggle, cursor);
};
var GestureEmitter = emitter_default.inherit({
  gesture: true,
  configure: function(data2) {
    this.getElement().css("msTouchAction", data2.immediate ? "pinch-zoom" : "");
    this.callBase(data2);
  },
  allowInterruptionByMouseWheel: function() {
    return this._stage !== STARTED;
  },
  getDirection: function() {
    return this.direction;
  },
  _cancel: function() {
    this.callBase.apply(this, arguments);
    this._toggleGestureCover(false);
    this._stage = SLEEP;
  },
  start: function(e) {
    if (e._needSkipEvent || needSkipEvent(e)) {
      this._cancel(e);
      return;
    }
    this._startEvent = createEvent(e);
    this._startEventData = eventData(e);
    this._stage = INITED;
    this._init(e);
    this._setupImmediateTimer();
  },
  _setupImmediateTimer: function() {
    var _this$immediateTimeou;
    clearTimeout(this._immediateTimer);
    this._immediateAccepted = false;
    if (!this.immediate) {
      return;
    }
    if (0 === this.immediateTimeout) {
      this._immediateAccepted = true;
      return;
    }
    this._immediateTimer = setTimeout((function() {
      this._immediateAccepted = true;
    }).bind(this), null !== (_this$immediateTimeou = this.immediateTimeout) && void 0 !== _this$immediateTimeou ? _this$immediateTimeou : IMMEDIATE_TIMEOUT);
  },
  move: function(e) {
    if (this._stage === INITED && this._directionConfirmed(e)) {
      this._stage = STARTED;
      this._resetActiveElement();
      this._toggleGestureCover(true);
      this._clearSelection(e);
      this._adjustStartEvent(e);
      this._start(this._startEvent);
      if (this._stage === SLEEP) {
        return;
      }
      this._requestAccept(e);
      this._move(e);
      this._forgetAccept();
    } else if (this._stage === STARTED) {
      this._clearSelection(e);
      this._move(e);
    }
  },
  _directionConfirmed: function(e) {
    var touchBoundary = this._getTouchBoundary(e);
    var delta = eventDelta(this._startEventData, eventData(e));
    var deltaX = abs(delta.x);
    var deltaY = abs(delta.y);
    var horizontalMove = this._validateMove(touchBoundary, deltaX, deltaY);
    var verticalMove = this._validateMove(touchBoundary, deltaY, deltaX);
    var direction = this.getDirection(e);
    var bothAccepted = "both" === direction && (horizontalMove || verticalMove);
    var horizontalAccepted = "horizontal" === direction && horizontalMove;
    var verticalAccepted = "vertical" === direction && verticalMove;
    return bothAccepted || horizontalAccepted || verticalAccepted || this._immediateAccepted;
  },
  _validateMove: function(touchBoundary, mainAxis, crossAxis) {
    return mainAxis && mainAxis >= touchBoundary && (this.immediate ? mainAxis >= crossAxis : true);
  },
  _getTouchBoundary: function(e) {
    return this.immediate || isDxMouseWheelEvent(e) ? IMMEDIATE_TOUCH_BOUNDARY : TOUCH_BOUNDARY;
  },
  _adjustStartEvent: function(e) {
    var touchBoundary = this._getTouchBoundary(e);
    var delta = eventDelta(this._startEventData, eventData(e));
    this._startEvent.pageX += sign(delta.x) * touchBoundary;
    this._startEvent.pageY += sign(delta.y) * touchBoundary;
  },
  _resetActiveElement: function() {
    if ("ios" === devices_default.real().platform && this.getElement().find(":focus").length) {
      resetActiveElement();
    }
  },
  _toggleGestureCover: function(toggle) {
    this._toggleGestureCoverImpl(toggle);
  },
  _toggleGestureCoverImpl: function(toggle) {
    var isStarted = this._stage === STARTED;
    if (isStarted) {
      gestureCover(toggle, this.getElement().css("cursor"));
    }
  },
  _clearSelection: function(e) {
    if (isDxMouseWheelEvent(e) || isTouchEvent(e)) {
      return;
    }
    clearSelection();
  },
  end: function(e) {
    this._toggleGestureCover(false);
    if (this._stage === STARTED) {
      this._end(e);
    } else if (this._stage === INITED) {
      this._stop(e);
    }
    this._stage = SLEEP;
  },
  dispose: function() {
    clearTimeout(this._immediateTimer);
    this.callBase.apply(this, arguments);
    this._toggleGestureCover(false);
  },
  _init: noop,
  _start: noop,
  _move: noop,
  _stop: noop,
  _end: noop
});
GestureEmitter.initialTouchBoundary = TOUCH_BOUNDARY;
GestureEmitter.touchBoundary = function(newBoundary) {
  if (isDefined(newBoundary)) {
    TOUCH_BOUNDARY = newBoundary;
    return;
  }
  return TOUCH_BOUNDARY;
};
var emitter_gesture_default = GestureEmitter;

// node_modules/devextreme/esm/events/core/wheel.js
var EVENT_NAME = "dxmousewheel";
var EVENT_NAMESPACE = "dxWheel";
var NATIVE_EVENT_NAME = "wheel";
var PIXEL_MODE = 0;
var DELTA_MUTLIPLIER = 30;
var wheel = {
  setup: function(element) {
    var $element = renderer_default(element);
    events_engine_default.on($element, addNamespace2(NATIVE_EVENT_NAME, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
  },
  teardown: function(element) {
    events_engine_default.off(element, ".".concat(EVENT_NAMESPACE));
  },
  _wheelHandler: function(e) {
    var {
      deltaMode,
      deltaY,
      deltaX,
      deltaZ
    } = e.originalEvent;
    fireEvent({
      type: EVENT_NAME,
      originalEvent: e,
      delta: this._normalizeDelta(deltaY, deltaMode),
      deltaX,
      deltaY,
      deltaZ,
      deltaMode,
      pointerType: "mouse"
    });
    e.stopPropagation();
  },
  _normalizeDelta(delta) {
    var deltaMode = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : PIXEL_MODE;
    if (deltaMode === PIXEL_MODE) {
      return -delta;
    } else {
      return -DELTA_MUTLIPLIER * delta;
    }
  }
};
event_registrator_default(EVENT_NAME, wheel);

// node_modules/devextreme/esm/events/core/emitter_registrator.js
var MANAGER_EVENT = "dxEventManager";
var EMITTER_DATA = "dxEmitter";
var EventManager = class_default.inherit({
  ctor: function() {
    this._attachHandlers();
    this.reset();
    this._proxiedCancelHandler = this._cancelHandler.bind(this);
    this._proxiedAcceptHandler = this._acceptHandler.bind(this);
  },
  _attachHandlers: function() {
    ready_callbacks_default.add((function() {
      var document = dom_adapter_default.getDocument();
      events_engine_default.subscribeGlobal(document, addNamespace2(pointer_default.down, MANAGER_EVENT), this._pointerDownHandler.bind(this));
      events_engine_default.subscribeGlobal(document, addNamespace2(pointer_default.move, MANAGER_EVENT), this._pointerMoveHandler.bind(this));
      events_engine_default.subscribeGlobal(document, addNamespace2([pointer_default.up, pointer_default.cancel].join(" "), MANAGER_EVENT), this._pointerUpHandler.bind(this));
      events_engine_default.subscribeGlobal(document, addNamespace2(EVENT_NAME, MANAGER_EVENT), this._mouseWheelHandler.bind(this));
    }).bind(this));
  },
  _eachEmitter: function(callback) {
    var activeEmitters = this._activeEmitters || [];
    var i = 0;
    while (activeEmitters.length > i) {
      var emitter = activeEmitters[i];
      if (false === callback(emitter)) {
        break;
      }
      if (activeEmitters[i] === emitter) {
        i++;
      }
    }
  },
  _applyToEmitters: function(method, arg) {
    this._eachEmitter(function(emitter) {
      emitter[method].call(emitter, arg);
    });
  },
  reset: function() {
    this._eachEmitter(this._proxiedCancelHandler);
    this._activeEmitters = [];
  },
  resetEmitter: function(emitter) {
    this._proxiedCancelHandler(emitter);
  },
  _pointerDownHandler: function(e) {
    if (isMouseEvent(e) && e.which > 1) {
      return;
    }
    this._updateEmitters(e);
  },
  _updateEmitters: function(e) {
    if (!this._isSetChanged(e)) {
      return;
    }
    this._cleanEmitters(e);
    this._fetchEmitters(e);
  },
  _isSetChanged: function(e) {
    var currentSet = this._closestEmitter(e);
    var previousSet = this._emittersSet || [];
    var setChanged = currentSet.length !== previousSet.length;
    each(currentSet, function(index2, emitter) {
      setChanged = setChanged || previousSet[index2] !== emitter;
      return !setChanged;
    });
    this._emittersSet = currentSet;
    return setChanged;
  },
  _closestEmitter: function(e) {
    var that = this;
    var result = [];
    var $element = renderer_default(e.target);
    function handleEmitter(_, emitter) {
      if (!!emitter && emitter.validatePointers(e) && emitter.validate(e)) {
        emitter.addCancelCallback(that._proxiedCancelHandler);
        emitter.addAcceptCallback(that._proxiedAcceptHandler);
        result.push(emitter);
      }
    }
    while ($element.length) {
      var emitters = data($element.get(0), EMITTER_DATA) || [];
      each(emitters, handleEmitter);
      $element = $element.parent();
    }
    return result;
  },
  _acceptHandler: function(acceptedEmitter, e) {
    var that = this;
    this._eachEmitter(function(emitter) {
      if (emitter !== acceptedEmitter) {
        that._cancelEmitter(emitter, e);
      }
    });
  },
  _cancelHandler: function(canceledEmitter, e) {
    this._cancelEmitter(canceledEmitter, e);
  },
  _cancelEmitter: function(emitter, e) {
    var activeEmitters = this._activeEmitters;
    if (e) {
      emitter.cancel(e);
    } else {
      emitter.reset();
    }
    emitter.removeCancelCallback();
    emitter.removeAcceptCallback();
    var emitterIndex = activeEmitters.indexOf(emitter);
    if (emitterIndex > -1) {
      activeEmitters.splice(emitterIndex, 1);
    }
  },
  _cleanEmitters: function(e) {
    this._applyToEmitters("end", e);
    this.reset(e);
  },
  _fetchEmitters: function(e) {
    this._activeEmitters = this._emittersSet.slice();
    this._applyToEmitters("start", e);
  },
  _pointerMoveHandler: function(e) {
    this._applyToEmitters("move", e);
  },
  _pointerUpHandler: function(e) {
    this._updateEmitters(e);
  },
  _mouseWheelHandler: function(e) {
    if (!this._allowInterruptionByMouseWheel()) {
      return;
    }
    e.pointers = [null];
    this._pointerDownHandler(e);
    this._adjustWheelEvent(e);
    this._pointerMoveHandler(e);
    e.pointers = [];
    this._pointerUpHandler(e);
  },
  _allowInterruptionByMouseWheel: function() {
    var allowInterruption = true;
    this._eachEmitter(function(emitter) {
      allowInterruption = emitter.allowInterruptionByMouseWheel() && allowInterruption;
      return allowInterruption;
    });
    return allowInterruption;
  },
  _adjustWheelEvent: function(e) {
    var closestGestureEmitter = null;
    this._eachEmitter(function(emitter) {
      if (!emitter.gesture) {
        return;
      }
      var direction2 = emitter.getDirection(e);
      if ("horizontal" !== direction2 && !e.shiftKey || "vertical" !== direction2 && e.shiftKey) {
        closestGestureEmitter = emitter;
        return false;
      }
    });
    if (!closestGestureEmitter) {
      return;
    }
    var direction = closestGestureEmitter.getDirection(e);
    var verticalGestureDirection = "both" === direction && !e.shiftKey || "vertical" === direction;
    var prop = verticalGestureDirection ? "pageY" : "pageX";
    e[prop] += e.delta;
  },
  isActive: function(element) {
    var result = false;
    this._eachEmitter(function(emitter) {
      result = result || emitter.getElement().is(element);
    });
    return result;
  }
});
var eventManager = new EventManager();
var EMITTER_SUBSCRIPTION_DATA = "dxEmitterSubscription";
var registerEmitter = function(emitterConfig) {
  var emitterClass = emitterConfig.emitter;
  var emitterName = emitterConfig.events[0];
  var emitterEvents = emitterConfig.events;
  each(emitterEvents, function(_, eventName) {
    event_registrator_default(eventName, {
      noBubble: !emitterConfig.bubble,
      setup: function(element) {
        var subscriptions = data(element, EMITTER_SUBSCRIPTION_DATA) || {};
        var emitters = data(element, EMITTER_DATA) || {};
        var emitter = emitters[emitterName] || new emitterClass(element);
        subscriptions[eventName] = true;
        emitters[emitterName] = emitter;
        data(element, EMITTER_DATA, emitters);
        data(element, EMITTER_SUBSCRIPTION_DATA, subscriptions);
      },
      add: function(element, handleObj) {
        var emitters = data(element, EMITTER_DATA);
        var emitter = emitters[emitterName];
        emitter.configure(extend({
          delegateSelector: handleObj.selector
        }, handleObj.data), handleObj.type);
      },
      teardown: function(element) {
        var subscriptions = data(element, EMITTER_SUBSCRIPTION_DATA);
        var emitters = data(element, EMITTER_DATA);
        var emitter = emitters[emitterName];
        delete subscriptions[eventName];
        var disposeEmitter = true;
        each(emitterEvents, function(_2, eventName2) {
          disposeEmitter = disposeEmitter && !subscriptions[eventName2];
          return disposeEmitter;
        });
        if (disposeEmitter) {
          if (eventManager.isActive(element)) {
            eventManager.resetEmitter(emitter);
          }
          emitter && emitter.dispose();
          delete emitters[emitterName];
        }
      }
    });
  });
};
var emitter_registrator_default = registerEmitter;

// node_modules/devextreme/esm/events/drag.js
var DRAG_START_EVENT = "dxdragstart";
var DRAG_EVENT = "dxdrag";
var DRAG_END_EVENT = "dxdragend";
var DRAG_ENTER_EVENT = "dxdragenter";
var DRAG_LEAVE_EVENT = "dxdragleave";
var DROP_EVENT = "dxdrop";
var DX_DRAG_EVENTS_COUNT_KEY = "dxDragEventsCount";
var knownDropTargets = [];
var knownDropTargetSelectors = [];
var knownDropTargetConfigs = [];
var dropTargetRegistration = {
  setup: function(element, data2) {
    var knownDropTarget = knownDropTargets.includes(element);
    if (!knownDropTarget) {
      knownDropTargets.push(element);
      knownDropTargetSelectors.push([]);
      knownDropTargetConfigs.push(data2 || {});
    }
  },
  add: function(element, handleObj) {
    var index2 = knownDropTargets.indexOf(element);
    this.updateEventsCounter(element, handleObj.type, 1);
    var selector = handleObj.selector;
    if (!knownDropTargetSelectors[index2].includes(selector)) {
      knownDropTargetSelectors[index2].push(selector);
    }
  },
  updateEventsCounter: function(element, event, value2) {
    if ([DRAG_ENTER_EVENT, DRAG_LEAVE_EVENT, DROP_EVENT].indexOf(event) > -1) {
      var eventsCount = data(element, DX_DRAG_EVENTS_COUNT_KEY) || 0;
      data(element, DX_DRAG_EVENTS_COUNT_KEY, Math.max(0, eventsCount + value2));
    }
  },
  remove: function(element, handleObj) {
    this.updateEventsCounter(element, handleObj.type, -1);
  },
  teardown: function(element) {
    var handlersCount = data(element, DX_DRAG_EVENTS_COUNT_KEY);
    if (!handlersCount) {
      var index2 = knownDropTargets.indexOf(element);
      knownDropTargets.splice(index2, 1);
      knownDropTargetSelectors.splice(index2, 1);
      knownDropTargetConfigs.splice(index2, 1);
      removeData(element, DX_DRAG_EVENTS_COUNT_KEY);
    }
  }
};
event_registrator_default(DRAG_ENTER_EVENT, dropTargetRegistration);
event_registrator_default(DRAG_LEAVE_EVENT, dropTargetRegistration);
event_registrator_default(DROP_EVENT, dropTargetRegistration);
var getItemDelegatedTargets = function($element) {
  var dropTargetIndex = knownDropTargets.indexOf($element.get(0));
  var dropTargetSelectors = knownDropTargetSelectors[dropTargetIndex].filter((selector) => selector);
  var $delegatedTargets = $element.find(dropTargetSelectors.join(", "));
  if (knownDropTargetSelectors[dropTargetIndex].includes(void 0)) {
    $delegatedTargets = $delegatedTargets.add($element);
  }
  return $delegatedTargets;
};
var getItemConfig = function($element) {
  var dropTargetIndex = knownDropTargets.indexOf($element.get(0));
  return knownDropTargetConfigs[dropTargetIndex];
};
var getItemPosition = function(dropTargetConfig, $element) {
  if (dropTargetConfig.itemPositionFunc) {
    return dropTargetConfig.itemPositionFunc($element);
  } else {
    return $element.offset();
  }
};
var getItemSize = function(dropTargetConfig, $element) {
  if (dropTargetConfig.itemSizeFunc) {
    return dropTargetConfig.itemSizeFunc($element);
  }
  return {
    width: $element.get(0).getBoundingClientRect().width,
    height: $element.get(0).getBoundingClientRect().height
  };
};
var DragEmitter = emitter_gesture_default.inherit({
  ctor: function(element) {
    this.callBase(element);
    this.direction = "both";
  },
  _init: function(e) {
    this._initEvent = e;
  },
  _start: function(e) {
    e = this._fireEvent(DRAG_START_EVENT, this._initEvent);
    this._maxLeftOffset = e.maxLeftOffset;
    this._maxRightOffset = e.maxRightOffset;
    this._maxTopOffset = e.maxTopOffset;
    this._maxBottomOffset = e.maxBottomOffset;
    if (e.targetElements || null === e.targetElements) {
      var dropTargets = wrapToArray(e.targetElements || []);
      this._dropTargets = map(dropTargets, function(element) {
        return renderer_default(element).get(0);
      });
    } else {
      this._dropTargets = knownDropTargets;
    }
  },
  _move: function(e) {
    var eventData2 = eventData(e);
    var dragOffset = this._calculateOffset(eventData2);
    e = this._fireEvent(DRAG_EVENT, e, {
      offset: dragOffset
    });
    this._processDropTargets(e);
    if (!e._cancelPreventDefault) {
      e.preventDefault();
    }
  },
  _calculateOffset: function(eventData2) {
    return {
      x: this._calculateXOffset(eventData2),
      y: this._calculateYOffset(eventData2)
    };
  },
  _calculateXOffset: function(eventData2) {
    if ("vertical" !== this.direction) {
      var offset2 = eventData2.x - this._startEventData.x;
      return this._fitOffset(offset2, this._maxLeftOffset, this._maxRightOffset);
    }
    return 0;
  },
  _calculateYOffset: function(eventData2) {
    if ("horizontal" !== this.direction) {
      var offset2 = eventData2.y - this._startEventData.y;
      return this._fitOffset(offset2, this._maxTopOffset, this._maxBottomOffset);
    }
    return 0;
  },
  _fitOffset: function(offset2, minOffset, maxOffset) {
    if (null != minOffset) {
      offset2 = Math.max(offset2, -minOffset);
    }
    if (null != maxOffset) {
      offset2 = Math.min(offset2, maxOffset);
    }
    return offset2;
  },
  _processDropTargets: function(e) {
    var target = this._findDropTarget(e);
    var sameTarget = target === this._currentDropTarget;
    if (!sameTarget) {
      this._fireDropTargetEvent(e, DRAG_LEAVE_EVENT);
      this._currentDropTarget = target;
      this._fireDropTargetEvent(e, DRAG_ENTER_EVENT);
    }
  },
  _fireDropTargetEvent: function(event, eventName) {
    if (!this._currentDropTarget) {
      return;
    }
    var eventData2 = {
      type: eventName,
      originalEvent: event,
      draggingElement: this._$element.get(0),
      target: this._currentDropTarget
    };
    fireEvent(eventData2);
  },
  _findDropTarget: function(e) {
    var that = this;
    var result;
    each(knownDropTargets, function(_, target) {
      if (!that._checkDropTargetActive(target)) {
        return;
      }
      var $target = renderer_default(target);
      each(getItemDelegatedTargets($target), function(_2, delegatedTarget) {
        var $delegatedTarget = renderer_default(delegatedTarget);
        if (that._checkDropTarget(getItemConfig($target), $delegatedTarget, renderer_default(result), e)) {
          result = delegatedTarget;
        }
      });
    });
    return result;
  },
  _checkDropTargetActive: function(target) {
    var active2 = false;
    each(this._dropTargets, function(_, activeTarget) {
      active2 = active2 || activeTarget === target || contains(activeTarget, target);
      return !active2;
    });
    return active2;
  },
  _checkDropTarget: function(config, $target, $prevTarget, e) {
    var isDraggingElement = $target.get(0) === renderer_default(e.target).get(0);
    if (isDraggingElement) {
      return false;
    }
    var targetPosition = getItemPosition(config, $target);
    if (e.pageX < targetPosition.left) {
      return false;
    }
    if (e.pageY < targetPosition.top) {
      return false;
    }
    var targetSize = getItemSize(config, $target);
    if (e.pageX > targetPosition.left + targetSize.width) {
      return false;
    }
    if (e.pageY > targetPosition.top + targetSize.height) {
      return false;
    }
    if ($prevTarget.length && $prevTarget.closest($target).length) {
      return false;
    }
    if (config.checkDropTarget && !config.checkDropTarget($target, e)) {
      return false;
    }
    return $target;
  },
  _end: function(e) {
    var eventData2 = eventData(e);
    this._fireEvent(DRAG_END_EVENT, e, {
      offset: this._calculateOffset(eventData2)
    });
    this._fireDropTargetEvent(e, DROP_EVENT);
    delete this._currentDropTarget;
  }
});
emitter_registrator_default({
  emitter: DragEmitter,
  events: [DRAG_START_EVENT, DRAG_EVENT, DRAG_END_EVENT]
});

// node_modules/devextreme/esm/events/core/keyboard_processor.js
var COMPOSITION_START_EVENT = "compositionstart";
var COMPOSITION_END_EVENT = "compositionend";
var KEYDOWN_EVENT = "keydown";
var NAMESPACE = "KeyboardProcessor";
var createKeyDownOptions = (e) => ({
  keyName: normalizeKeyName(e),
  key: e.key,
  code: e.code,
  ctrl: e.ctrlKey,
  location: e.location,
  metaKey: e.metaKey,
  shift: e.shiftKey,
  alt: e.altKey,
  which: e.which,
  originalEvent: e
});
var KeyboardProcessor = class_default.inherit({
  _keydown: addNamespace2(KEYDOWN_EVENT, NAMESPACE),
  _compositionStart: addNamespace2(COMPOSITION_START_EVENT, NAMESPACE),
  _compositionEnd: addNamespace2(COMPOSITION_END_EVENT, NAMESPACE),
  ctor: function(options) {
    options = options || {};
    if (options.element) {
      this._element = renderer_default(options.element);
    }
    if (options.focusTarget) {
      this._focusTarget = options.focusTarget;
    }
    this._handler = options.handler;
    if (this._element) {
      this._processFunction = (e) => {
        var focusTargets = renderer_default(this._focusTarget).toArray();
        var isNotFocusTarget = this._focusTarget && this._focusTarget !== e.target && !focusTargets.includes(e.target);
        var shouldSkipProcessing = this._isComposingJustFinished && 229 === e.which || this._isComposing || isNotFocusTarget;
        this._isComposingJustFinished = false;
        if (!shouldSkipProcessing) {
          this.process(e);
        }
      };
      this._toggleProcessingWithContext = this.toggleProcessing.bind(this);
      events_engine_default.on(this._element, this._keydown, this._processFunction);
      events_engine_default.on(this._element, this._compositionStart, this._toggleProcessingWithContext);
      events_engine_default.on(this._element, this._compositionEnd, this._toggleProcessingWithContext);
    }
  },
  dispose: function() {
    if (this._element) {
      events_engine_default.off(this._element, this._keydown, this._processFunction);
      events_engine_default.off(this._element, this._compositionStart, this._toggleProcessingWithContext);
      events_engine_default.off(this._element, this._compositionEnd, this._toggleProcessingWithContext);
    }
    this._element = void 0;
    this._handler = void 0;
  },
  process: function(e) {
    this._handler(createKeyDownOptions(e));
  },
  toggleProcessing: function(_ref) {
    var {
      type: type2
    } = _ref;
    this._isComposing = type2 === COMPOSITION_START_EVENT;
    this._isComposingJustFinished = !this._isComposing;
  }
});
KeyboardProcessor.createKeyDownOptions = createKeyDownOptions;
var keyboard_processor_default = KeyboardProcessor;

// node_modules/devextreme/esm/events/short.js
function addNamespace3(event, namespace) {
  return namespace ? addNamespace2(event, namespace) : event;
}
function executeAction(action, args) {
  return "function" === typeof action ? action(args) : action.execute(args);
}
var active = {
  on: ($el, active2, inactive, opts) => {
    var {
      selector,
      showTimeout,
      hideTimeout,
      namespace
    } = opts;
    events_engine_default.on($el, addNamespace3("dxactive", namespace), selector, {
      timeout: showTimeout
    }, (event) => executeAction(active2, {
      event,
      element: event.currentTarget
    }));
    events_engine_default.on($el, addNamespace3("dxinactive", namespace), selector, {
      timeout: hideTimeout
    }, (event) => executeAction(inactive, {
      event,
      element: event.currentTarget
    }));
  },
  off: ($el, _ref) => {
    var {
      namespace,
      selector
    } = _ref;
    events_engine_default.off($el, addNamespace3("dxactive", namespace), selector);
    events_engine_default.off($el, addNamespace3("dxinactive", namespace), selector);
  }
};
var resize = {
  on: function($el, resize2) {
    var {
      namespace
    } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    events_engine_default.on($el, addNamespace3("dxresize", namespace), resize2);
  },
  off: function($el) {
    var {
      namespace
    } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    events_engine_default.off($el, addNamespace3("dxresize", namespace));
  }
};
var hover = {
  on: ($el, start, end, _ref2) => {
    var {
      selector,
      namespace
    } = _ref2;
    events_engine_default.on($el, addNamespace3("dxhoverend", namespace), selector, (event) => end(event));
    events_engine_default.on($el, addNamespace3("dxhoverstart", namespace), selector, (event) => executeAction(start, {
      element: event.target,
      event
    }));
  },
  off: ($el, _ref3) => {
    var {
      selector,
      namespace
    } = _ref3;
    events_engine_default.off($el, addNamespace3("dxhoverstart", namespace), selector);
    events_engine_default.off($el, addNamespace3("dxhoverend", namespace), selector);
  }
};
var visibility = {
  on: ($el, shown, hiding, _ref4) => {
    var {
      namespace
    } = _ref4;
    events_engine_default.on($el, addNamespace3("dxhiding", namespace), hiding);
    events_engine_default.on($el, addNamespace3("dxshown", namespace), shown);
  },
  off: ($el, _ref5) => {
    var {
      namespace
    } = _ref5;
    events_engine_default.off($el, addNamespace3("dxhiding", namespace));
    events_engine_default.off($el, addNamespace3("dxshown", namespace));
  }
};
var focus = {
  on: ($el, focusIn, focusOut, _ref6) => {
    var {
      namespace
    } = _ref6;
    events_engine_default.on($el, addNamespace3("focusin", namespace), focusIn);
    events_engine_default.on($el, addNamespace3("focusout", namespace), focusOut);
  },
  off: ($el, _ref7) => {
    var {
      namespace
    } = _ref7;
    events_engine_default.off($el, addNamespace3("focusin", namespace));
    events_engine_default.off($el, addNamespace3("focusout", namespace));
  },
  trigger: ($el) => events_engine_default.trigger($el, "focus")
};
var dxClick = {
  on: function($el, click2) {
    var {
      namespace
    } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    events_engine_default.on($el, addNamespace3("dxclick", namespace), click2);
  },
  off: function($el) {
    var {
      namespace
    } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    events_engine_default.off($el, addNamespace3("dxclick", namespace));
  }
};
var click = {
  on: function($el, click2) {
    var {
      namespace
    } = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    events_engine_default.on($el, addNamespace3("click", namespace), click2);
  },
  off: function($el) {
    var {
      namespace
    } = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
    events_engine_default.off($el, addNamespace3("click", namespace));
  }
};
var index = 0;
var keyboardProcessors = {};
var generateListenerId = () => "keyboardProcessorId".concat(index++);
var keyboard = {
  on: (element, focusTarget, handler) => {
    var listenerId = generateListenerId();
    keyboardProcessors[listenerId] = new keyboard_processor_default({
      element,
      focusTarget,
      handler
    });
    return listenerId;
  },
  off: (listenerId) => {
    if (listenerId && keyboardProcessors[listenerId]) {
      keyboardProcessors[listenerId].dispose();
      delete keyboardProcessors[listenerId];
    }
  },
  _getProcessor: (listenerId) => keyboardProcessors[listenerId]
};

// node_modules/devextreme/esm/mobile/hide_callback.js
var hideCallback = /* @__PURE__ */ function() {
  var callbacks = [];
  return {
    add: function(callback) {
      if (!callbacks.includes(callback)) {
        callbacks.push(callback);
      }
    },
    remove: function(callback) {
      var indexOfCallback = callbacks.indexOf(callback);
      if (-1 !== indexOfCallback) {
        callbacks.splice(indexOfCallback, 1);
      }
    },
    fire: function() {
      var callback = callbacks.pop();
      var result = !!callback;
      if (result) {
        callback();
      }
      return result;
    },
    hasCallback: function() {
      return callbacks.length > 0;
    }
  };
}();

// node_modules/devextreme/esm/core/action.js
var Action = class _Action {
  constructor(action, config) {
    config = config || {};
    this._action = action;
    this._context = config.context || getWindow();
    this._beforeExecute = config.beforeExecute;
    this._afterExecute = config.afterExecute;
    this._component = config.component;
    this._validatingTargetName = config.validatingTargetName;
    var excludeValidators = this._excludeValidators = {};
    if (config.excludeValidators) {
      for (var i = 0; i < config.excludeValidators.length; i++) {
        excludeValidators[config.excludeValidators[i]] = true;
      }
    }
  }
  execute() {
    var e = {
      action: this._action,
      args: Array.prototype.slice.call(arguments),
      context: this._context,
      component: this._component,
      validatingTargetName: this._validatingTargetName,
      cancel: false,
      handled: false
    };
    var beforeExecute = this._beforeExecute;
    var afterExecute = this._afterExecute;
    var argsBag = e.args[0] || {};
    if (!this._validateAction(e)) {
      return;
    }
    null === beforeExecute || void 0 === beforeExecute ? void 0 : beforeExecute.call(this._context, e);
    if (e.cancel) {
      return;
    }
    var result = this._executeAction(e);
    if (argsBag.cancel) {
      return;
    }
    null === afterExecute || void 0 === afterExecute ? void 0 : afterExecute.call(this._context, e);
    return result;
  }
  _validateAction(e) {
    var excludeValidators = this._excludeValidators;
    var {
      executors
    } = _Action;
    for (var name in executors) {
      if (!excludeValidators[name]) {
        var _executor$validate;
        var executor = executors[name];
        null === (_executor$validate = executor.validate) || void 0 === _executor$validate ? void 0 : _executor$validate.call(executor, e);
        if (e.cancel) {
          return false;
        }
      }
    }
    return true;
  }
  _executeAction(e) {
    var result;
    var {
      executors
    } = _Action;
    for (var name in executors) {
      var _executor$execute;
      var executor = executors[name];
      null === (_executor$execute = executor.execute) || void 0 === _executor$execute ? void 0 : _executor$execute.call(executor, e);
      if (e.handled) {
        result = e.result;
        break;
      }
    }
    return result;
  }
  static registerExecutor(name, executor) {
    if (isPlainObject(name)) {
      each(name, _Action.registerExecutor);
      return;
    }
    _Action.executors[name] = executor;
  }
  static unregisterExecutor() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    each(args, function() {
      delete _Action.executors[this];
    });
  }
};
Action.executors = {};
var createValidatorByTargetElement = (condition) => (e) => {
  if (!e.args.length) {
    return;
  }
  var args = e.args[0];
  var element = args[e.validatingTargetName] || args.element;
  if (element && condition(renderer_default(element))) {
    e.cancel = true;
  }
};
Action.registerExecutor({
  disabled: {
    validate: createValidatorByTargetElement(($target) => $target.is(".dx-state-disabled, .dx-state-disabled *"))
  },
  readOnly: {
    validate: createValidatorByTargetElement(($target) => $target.is(".dx-state-readonly, .dx-state-readonly *:not(.dx-state-independent)"))
  },
  undefined: {
    execute: (e) => {
      if (!e.action) {
        e.result = void 0;
        e.handled = true;
      }
    }
  },
  func: {
    execute: (e) => {
      if (isFunction(e.action)) {
        e.result = e.action.call(e.context, e.args[0]);
        e.handled = true;
      }
    }
  }
});

// node_modules/devextreme/esm/core/utils/comparator.js
var hasNegation = function(oldValue, newValue) {
  return 1 / oldValue === 1 / newValue;
};
var equals = function(oldValue, newValue) {
  oldValue = toComparable(oldValue, true);
  newValue = toComparable(newValue, true);
  if (oldValue && newValue && isRenderer(oldValue) && isRenderer(newValue)) {
    return newValue.is(oldValue);
  }
  var oldValueIsNaN = oldValue !== oldValue;
  var newValueIsNaN = newValue !== newValue;
  if (oldValueIsNaN && newValueIsNaN) {
    return true;
  }
  if (0 === oldValue && 0 === newValue) {
    return hasNegation(oldValue, newValue);
  }
  if (null === oldValue || "object" !== typeof oldValue || dom_adapter_default.isElementNode(oldValue)) {
    return oldValue === newValue;
  }
  return false;
};

// node_modules/devextreme/esm/core/options/utils.js
var cachedGetters = {};
var convertRulesToOptions = (rules) => {
  var currentDevice = devices_default.current();
  return rules.reduce((options, _ref) => {
    var {
      device,
      options: ruleOptions
    } = _ref;
    var deviceFilter = device || {};
    var match = isFunction(deviceFilter) ? deviceFilter(currentDevice) : deviceMatch(currentDevice, deviceFilter);
    if (match) {
      extend(true, options, ruleOptions);
    }
    return options;
  }, {});
};
var normalizeOptions = (options, value2) => "string" !== typeof options ? options : {
  [options]: value2
};
var deviceMatch = (device, filter) => isEmptyObject(filter) || findBestMatches(device, [filter]).length > 0;
var getFieldName = (fullName) => fullName.substr(fullName.lastIndexOf(".") + 1);
var getParentName = (fullName) => fullName.substr(0, fullName.lastIndexOf("."));
var getNestedOptionValue = function(optionsObject, name) {
  cachedGetters[name] = cachedGetters[name] || compileGetter(name);
  return cachedGetters[name](optionsObject, {
    functionsAsIs: true
  });
};
var createDefaultOptionRules = function() {
  var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
  return options;
};

// node_modules/devextreme/esm/core/options/option_manager.js
var cachedGetters2 = {};
var cachedSetters = {};
var OptionManager = class {
  constructor(options, optionsByReference) {
    this._options = options;
    this._optionsByReference = optionsByReference;
    this._changingCallback;
    this._changedCallback;
    this._namePreparedCallbacks;
  }
  _setByReference(options, rulesOptions) {
    extend(true, options, rulesOptions);
    for (var fieldName in this._optionsByReference) {
      if (Object.prototype.hasOwnProperty.call(rulesOptions, fieldName)) {
        options[fieldName] = rulesOptions[fieldName];
      }
    }
  }
  _setPreparedValue(name, value2, merge, silent) {
    var previousValue = this.get(this._options, name, false);
    if (!equals(previousValue, value2)) {
      var path = getPathParts(name);
      !silent && this._changingCallback(name, previousValue, value2);
      cachedSetters[name] = cachedSetters[name] || compileSetter(name);
      cachedSetters[name](this._options, value2, {
        functionsAsIs: true,
        merge: isDefined(merge) ? merge : !this._optionsByReference[name],
        unwrapObservables: path.length > 1 && !!this._optionsByReference[path[0]]
      });
      !silent && this._changedCallback(name, value2, previousValue);
    }
  }
  _prepareRelevantNames(options, name, value2, silent) {
    if (isPlainObject(value2)) {
      for (var valueName in value2) {
        this._prepareRelevantNames(options, "".concat(name, ".").concat(valueName), value2[valueName]);
      }
    }
    this._namePreparedCallbacks(options, name, value2, silent);
  }
  get() {
    var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._options;
    var name = arguments.length > 1 ? arguments[1] : void 0;
    var unwrapObservables = arguments.length > 2 ? arguments[2] : void 0;
    cachedGetters2[name] = cachedGetters2[name] || compileGetter(name);
    return cachedGetters2[name](options, {
      functionsAsIs: true,
      unwrapObservables
    });
  }
  set(options, value2, merge, silent) {
    options = normalizeOptions(options, value2);
    for (var name in options) {
      this._prepareRelevantNames(options, name, options[name], silent);
    }
    for (var _name in options) {
      this._setPreparedValue(_name, options[_name], merge, silent);
    }
  }
  onRelevantNamesPrepared(callBack) {
    this._namePreparedCallbacks = callBack;
  }
  onChanging(callBack) {
    this._changingCallback = callBack;
  }
  onChanged(callBack) {
    this._changedCallback = callBack;
  }
  dispose() {
    this._changingCallback = noop;
    this._changedCallback = noop;
  }
};

// node_modules/devextreme/esm/core/options/index.js
var Options = class {
  constructor(options, defaultOptions, optionsByReference, deprecatedOptions) {
    this._deprecatedCallback;
    this._startChangeCallback;
    this._endChangeCallback;
    this._default = defaultOptions;
    this._deprecated = deprecatedOptions;
    this._deprecatedNames = [];
    this._initDeprecatedNames();
    this._optionManager = new OptionManager(options, optionsByReference);
    this._optionManager.onRelevantNamesPrepared((options2, name, value2, silent) => this._setRelevantNames(options2, name, value2, silent));
    this._cachedOptions = {};
    this._rules = [];
  }
  set _initial(value2) {
    this._initialOptions = value2;
  }
  get _initial() {
    if (!this._initialOptions) {
      var rulesOptions = this._getByRules(this.silent("defaultOptionsRules"));
      this._initialOptions = this._default;
      this._optionManager._setByReference(this._initialOptions, rulesOptions);
    }
    return this._initialOptions;
  }
  _initDeprecatedNames() {
    for (var optionName in this._deprecated) {
      this._deprecatedNames.push(optionName);
    }
  }
  _getByRules(rules) {
    rules = Array.isArray(rules) ? this._rules.concat(rules) : this._rules;
    return convertRulesToOptions(rules);
  }
  _notifyDeprecated(option) {
    var info = this._deprecated[option];
    if (info) {
      this._deprecatedCallback(option, info);
    }
  }
  _setRelevantNames(options, name, value2, silent) {
    if (name) {
      var normalizedName = this._normalizeName(name, silent);
      if (normalizedName && normalizedName !== name) {
        this._setField(options, normalizedName, value2);
        this._clearField(options, name);
      }
    }
  }
  _setField(options, fullName, value2) {
    var fieldName = "";
    var fieldObject = null;
    do {
      fieldName = fieldName ? ".".concat(fieldName) : "";
      fieldName = getFieldName(fullName) + fieldName;
      fullName = getParentName(fullName);
      fieldObject = fullName ? this._optionManager.get(options, fullName, false) : options;
    } while (!fieldObject);
    fieldObject[fieldName] = value2;
  }
  _clearField(options, name) {
    delete options[name];
    var previousFieldName = getParentName(name);
    var fieldObject = previousFieldName ? this._optionManager.get(options, previousFieldName, false) : options;
    if (fieldObject) {
      delete fieldObject[getFieldName(name)];
    }
  }
  _normalizeName(name, silent) {
    if (this._deprecatedNames.length && name) {
      for (var i = 0; i < this._deprecatedNames.length; i++) {
        if (this._deprecatedNames[i] === name) {
          var deprecate = this._deprecated[name];
          if (deprecate) {
            !silent && this._notifyDeprecated(name);
            return deprecate.alias || name;
          }
        }
      }
    }
    return name;
  }
  addRules(rules) {
    this._rules = rules.concat(this._rules);
  }
  applyRules(rules) {
    var options = this._getByRules(rules);
    this.silent(options);
  }
  dispose() {
    this._deprecatedCallback = noop;
    this._startChangeCallback = noop;
    this._endChangeCallback = noop;
    this._optionManager.dispose();
  }
  onChanging(callBack) {
    this._optionManager.onChanging(callBack);
  }
  onChanged(callBack) {
    this._optionManager.onChanged(callBack);
  }
  onDeprecated(callBack) {
    this._deprecatedCallback = callBack;
  }
  onStartChange(callBack) {
    this._startChangeCallback = callBack;
  }
  onEndChange(callBack) {
    this._endChangeCallback = callBack;
  }
  isInitial(name) {
    var value2 = this.silent(name);
    var initialValue = this.initial(name);
    var areFunctions = isFunction(value2) && isFunction(initialValue);
    return areFunctions ? value2.toString() === initialValue.toString() : equalByValue(value2, initialValue);
  }
  initial(name) {
    return getNestedOptionValue(this._initial, name);
  }
  option(options, value2) {
    var isGetter = arguments.length < 2 && "object" !== type(options);
    if (isGetter) {
      return this._optionManager.get(void 0, this._normalizeName(options));
    } else {
      this._startChangeCallback();
      try {
        this._optionManager.set(options, value2);
      } finally {
        this._endChangeCallback();
      }
    }
  }
  silent(options, value2) {
    var isGetter = arguments.length < 2 && "object" !== type(options);
    if (isGetter) {
      return this._optionManager.get(void 0, options, void 0, true);
    } else {
      this._optionManager.set(options, value2, void 0, true);
    }
  }
  reset(name) {
    if (name) {
      var fullPath = getPathParts(name);
      var value2 = fullPath.reduce((value3, field) => value3 ? value3[field] : this.initial(field), null);
      var defaultValue = isObject(value2) ? _extends({}, value2) : value2;
      this._optionManager.set(name, defaultValue, false);
    }
  }
  getAliasesByName(name) {
    return Object.keys(this._deprecated).filter((aliasName) => name === this._deprecated[aliasName].alias);
  }
  isDeprecated(name) {
    return Object.prototype.hasOwnProperty.call(this._deprecated, name);
  }
  cache(name, options) {
    var isGetter = arguments.length < 2;
    if (isGetter) {
      return this._cachedOptions[name];
    } else {
      this._cachedOptions[name] = extend(this._cachedOptions[name], options);
    }
  }
};

// node_modules/devextreme/esm/core/postponed_operations.js
var PostponedOperations = class {
  constructor() {
    this._postponedOperations = {};
  }
  add(key, fn, postponedPromise) {
    if (key in this._postponedOperations) {
      postponedPromise && this._postponedOperations[key].promises.push(postponedPromise);
    } else {
      var completePromise = new Deferred();
      this._postponedOperations[key] = {
        fn,
        completePromise,
        promises: postponedPromise ? [postponedPromise] : []
      };
    }
    return this._postponedOperations[key].completePromise.promise();
  }
  callPostponedOperations() {
    for (var key in this._postponedOperations) {
      var operation = this._postponedOperations[key];
      if (isDefined(operation)) {
        if (operation.promises && operation.promises.length) {
          when(...operation.promises).done(operation.fn).then(operation.completePromise.resolve);
        } else {
          operation.fn().done(operation.completePromise.resolve);
        }
      }
    }
    this._postponedOperations = {};
  }
};

// node_modules/devextreme/esm/core/component.js
var getEventName = (actionName) => actionName.charAt(2).toLowerCase() + actionName.substr(3);
var isInnerOption = (optionName) => 0 === optionName.indexOf("_", 0);
var Component = class_default.inherit({
  _setDeprecatedOptions() {
    this._deprecatedOptions = {};
  },
  _getDeprecatedOptions() {
    return this._deprecatedOptions;
  },
  _getDefaultOptions: () => ({
    onInitialized: null,
    onOptionChanged: null,
    onDisposing: null,
    defaultOptionsRules: null
  }),
  _defaultOptionsRules: () => [],
  _setOptionsByDevice(rules) {
    this._options.applyRules(rules);
  },
  _convertRulesToOptions: (rules) => convertRulesToOptions(rules),
  _isInitialOptionValue(name) {
    return this._options.isInitial(name);
  },
  _setOptionsByReference() {
    this._optionsByReference = {};
  },
  _getOptionsByReference() {
    return this._optionsByReference;
  },
  ctor() {
    var options = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    var {
      _optionChangedCallbacks,
      _disposingCallbacks
    } = options;
    this.NAME = getName(this.constructor);
    this._eventsStrategy = EventsStrategy.create(this, options.eventsStrategy);
    this._updateLockCount = 0;
    this._optionChangedCallbacks = _optionChangedCallbacks || callbacks_default();
    this._disposingCallbacks = _disposingCallbacks || callbacks_default();
    this.postponedOperations = new PostponedOperations();
    this._createOptions(options);
  },
  _createOptions(options) {
    this.beginUpdate();
    try {
      this._setOptionsByReference();
      this._setDeprecatedOptions();
      this._options = new Options(this._getDefaultOptions(), this._getDefaultOptions(), this._getOptionsByReference(), this._getDeprecatedOptions());
      this._options.onChanging((name, previousValue, value2) => this._initialized && this._optionChanging(name, previousValue, value2));
      this._options.onDeprecated((option, info) => this._logDeprecatedOptionWarning(option, info));
      this._options.onChanged((name, value2, previousValue) => this._notifyOptionChanged(name, value2, previousValue));
      this._options.onStartChange(() => this.beginUpdate());
      this._options.onEndChange(() => this.endUpdate());
      this._options.addRules(this._defaultOptionsRules());
      if (options && options.onInitializing) {
        options.onInitializing.apply(this, [options]);
      }
      this._setOptionsByDevice(options.defaultOptionsRules);
      this._initOptions(options);
    } finally {
      this.endUpdate();
    }
  },
  _initOptions(options) {
    this.option(options);
  },
  _init() {
    this._createOptionChangedAction();
    this.on("disposing", (args) => {
      this._disposingCallbacks.fireWith(this, [args]);
    });
  },
  _logDeprecatedOptionWarning(option, info) {
    var message = info.message || "Use the '".concat(info.alias, "' option instead");
    errors_default.log("W0001", this.NAME, option, info.since, message);
  },
  _logDeprecatedComponentWarning(since, alias) {
    errors_default.log("W0000", this.NAME, since, "Use the '".concat(alias, "' widget instead"));
  },
  _createOptionChangedAction() {
    this._optionChangedAction = this._createActionByOption("onOptionChanged", {
      excludeValidators: ["disabled", "readOnly"]
    });
  },
  _createDisposingAction() {
    this._disposingAction = this._createActionByOption("onDisposing", {
      excludeValidators: ["disabled", "readOnly"]
    });
  },
  _optionChanged(args) {
    switch (args.name) {
      case "onDisposing":
      case "onInitialized":
        break;
      case "onOptionChanged":
        this._createOptionChangedAction();
    }
  },
  _dispose() {
    this._optionChangedCallbacks.empty();
    this._createDisposingAction();
    this._disposingAction();
    this._eventsStrategy.dispose();
    this._options.dispose();
    this._disposed = true;
  },
  _lockUpdate() {
    this._updateLockCount++;
  },
  _unlockUpdate() {
    this._updateLockCount = Math.max(this._updateLockCount - 1, 0);
  },
  _isUpdateAllowed() {
    return 0 === this._updateLockCount;
  },
  _isInitializingRequired() {
    return !this._initializing && !this._initialized;
  },
  isInitialized() {
    return this._initialized;
  },
  _commitUpdate() {
    this.postponedOperations.callPostponedOperations();
    this._isInitializingRequired() && this._initializeComponent();
  },
  _initializeComponent() {
    this._initializing = true;
    try {
      this._init();
    } finally {
      this._initializing = false;
      this._lockUpdate();
      this._createActionByOption("onInitialized", {
        excludeValidators: ["disabled", "readOnly"]
      })();
      this._unlockUpdate();
      this._initialized = true;
    }
  },
  instance() {
    return this;
  },
  beginUpdate: function() {
    this._lockUpdate();
  },
  endUpdate: function() {
    this._unlockUpdate();
    this._isUpdateAllowed() && this._commitUpdate();
  },
  _optionChanging: noop,
  _notifyOptionChanged(option, value2, previousValue) {
    if (this._initialized) {
      var optionNames = [option].concat(this._options.getAliasesByName(option));
      for (var i = 0; i < optionNames.length; i++) {
        var name = optionNames[i];
        var args = {
          name: getPathParts(name)[0],
          fullName: name,
          value: value2,
          previousValue
        };
        if (!isInnerOption(name)) {
          this._optionChangedCallbacks.fireWith(this, [extend(this._defaultActionArgs(), args)]);
          this._optionChangedAction(extend({}, args));
        }
        if (!this._disposed && this._cancelOptionChange !== name) {
          this._optionChanged(args);
        }
      }
    }
  },
  initialOption(name) {
    return this._options.initial(name);
  },
  _defaultActionConfig() {
    return {
      context: this,
      component: this
    };
  },
  _defaultActionArgs() {
    return {
      component: this
    };
  },
  _createAction(actionSource, config) {
    var action;
    return (e) => {
      if (!isDefined(e)) {
        e = {};
      }
      if (!isPlainObject(e)) {
        e = {
          actionValue: e
        };
      }
      action = action || new Action(actionSource, extend({}, config, this._defaultActionConfig()));
      return action.execute.call(action, extend(e, this._defaultActionArgs()));
    };
  },
  _createActionByOption(optionName, config) {
    var _this = this;
    var action;
    var eventName;
    var actionFunc;
    config = extend({}, config);
    var result = function() {
      if (!eventName) {
        config = config || {};
        if ("string" !== typeof optionName) {
          throw errors_default.Error("E0008");
        }
        if (0 === optionName.indexOf("on")) {
          eventName = getEventName(optionName);
        }
        actionFunc = _this.option(optionName);
      }
      if (!action && !actionFunc && !config.beforeExecute && !config.afterExecute && !_this._eventsStrategy.hasEvent(eventName)) {
        return;
      }
      if (!action) {
        var beforeExecute = config.beforeExecute;
        config.beforeExecute = function() {
          for (var _len2 = arguments.length, props = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            props[_key2] = arguments[_key2];
          }
          beforeExecute && beforeExecute.apply(_this, props);
          _this._eventsStrategy.fireEvent(eventName, props[0].args);
        };
        action = _this._createAction(actionFunc, config);
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (config_default().wrapActionsBeforeExecute) {
        var beforeActionExecute = _this.option("beforeActionExecute") || noop;
        var wrappedAction = beforeActionExecute(_this, action, config) || action;
        return wrappedAction.apply(_this, args);
      }
      return action.apply(_this, args);
    };
    if (config_default().wrapActionsBeforeExecute) {
      return result;
    }
    var onActionCreated = this.option("onActionCreated") || noop;
    return onActionCreated(this, result, config) || result;
  },
  on(eventName, eventHandler) {
    this._eventsStrategy.on(eventName, eventHandler);
    return this;
  },
  off(eventName, eventHandler) {
    this._eventsStrategy.off(eventName, eventHandler);
    return this;
  },
  hasActionSubscription: function(actionName) {
    return !!this._options.silent(actionName) || this._eventsStrategy.hasEvent(getEventName(actionName));
  },
  isOptionDeprecated(name) {
    return this._options.isDeprecated(name);
  },
  _setOptionWithoutOptionChange(name, value2) {
    this._cancelOptionChange = name;
    this.option(name, value2);
    this._cancelOptionChange = false;
  },
  _getOptionValue(name, context2) {
    var value2 = this.option(name);
    if (isFunction(value2)) {
      return value2.bind(context2)();
    }
    return value2;
  },
  option() {
    return this._options.option(...arguments);
  },
  resetOption(name) {
    this.beginUpdate();
    this._options.reset(name);
    this.endUpdate();
  }
});

// node_modules/devextreme/esm/core/templates/function_template.js
var FunctionTemplate = class extends TemplateBase {
  constructor(render) {
    super();
    this._render = render;
  }
  _renderCore(options) {
    return normalizeTemplateElement(this._render(options));
  }
};

// node_modules/devextreme/esm/core/templates/child_default_template.js
var ChildDefaultTemplate = class extends TemplateBase {
  constructor(name) {
    super();
    this.name = name;
  }
};

// node_modules/devextreme/esm/core/templates/template_engine_registry.js
var templateEngines = {};
var currentTemplateEngine;
function registerTemplateEngine(name, templateEngine) {
  templateEngines[name] = templateEngine;
}
function setTemplateEngine(templateEngine) {
  if (isString(templateEngine)) {
    currentTemplateEngine = templateEngines[templateEngine];
    if (!currentTemplateEngine) {
      throw errors_default.Error("E0020", templateEngine);
    }
  } else {
    currentTemplateEngine = templateEngine;
  }
}
function getCurrentTemplateEngine() {
  return currentTemplateEngine;
}

// node_modules/devextreme/esm/core/templates/template.js
registerTemplateEngine("default", {
  compile: (element) => normalizeTemplateElement(element),
  render: (template, model, index2) => template.clone()
});
setTemplateEngine("default");
var Template = class extends TemplateBase {
  constructor(element) {
    super();
    this._element = element;
  }
  _renderCore(options) {
    var transclude = options.transclude;
    if (!transclude && !this._compiledTemplate) {
      this._compiledTemplate = getCurrentTemplateEngine().compile(this._element);
    }
    return renderer_default("<div>").append(transclude ? this._element : getCurrentTemplateEngine().render(this._compiledTemplate, options.model, options.index)).contents();
  }
  source() {
    return renderer_default(this._element).clone();
  }
};

// node_modules/devextreme/esm/core/utils/template_manager.js
var findTemplates = (element, name) => {
  var templates = renderer_default(element).contents().filter("[".concat("data-options", '*="').concat(name, '"]'));
  return [].slice.call(templates).map((element2) => {
    var optionsString = renderer_default(element2).attr("data-options") || "";
    return {
      element: element2,
      options: config_default().optionsParser(optionsString)[name]
    };
  }).filter((template) => !!template.options);
};
var suitableTemplatesByName = (rawTemplates) => {
  var templatesMap = groupBy(rawTemplates, (template) => template.options.name);
  if (templatesMap[void 0]) {
    throw errors_default.Error("E0023");
  }
  var result = {};
  Object.keys(templatesMap).forEach((name) => {
    var _findBestMatches$;
    var suitableTemplate = null === (_findBestMatches$ = findBestMatches(devices_default.current(), templatesMap[name], (template) => template.options)[0]) || void 0 === _findBestMatches$ ? void 0 : _findBestMatches$.element;
    if (suitableTemplate) {
      result[name] = suitableTemplate;
    }
  });
  return result;
};
var addOneRenderedCall = (template) => {
  var render = template.render.bind(template);
  return extend({}, template, {
    render(options) {
      var templateResult = render(options);
      options && options.onRendered && options.onRendered();
      return templateResult;
    }
  });
};
var addPublicElementNormalization = (template) => {
  var render = template.render.bind(template);
  return extend({}, template, {
    render(options) {
      var $container = renderer_default(options.container);
      return render(_extends({}, options, {
        container: getPublicElement($container)
      }));
    }
  });
};
var getNormalizedTemplateArgs = (options) => {
  var args = [];
  if ("model" in options) {
    args.push(options.model);
  }
  if ("index" in options) {
    args.push(options.index);
  }
  args.push(options.container);
  return args;
};
var validateTemplateSource = (templateSource) => "string" === typeof templateSource ? normalizeTemplateElement(templateSource) : templateSource;
var templateKey = (templateSource) => isRenderer(templateSource) && templateSource[0] || templateSource;
var defaultCreateElement = (element) => new Template(element);
var acquireIntegrationTemplate = (templateSource, templates, isAsyncTemplate, skipTemplates) => {
  var integrationTemplate = null;
  if (!skipTemplates || -1 === skipTemplates.indexOf(templateSource)) {
    integrationTemplate = templates[templateSource];
    if (integrationTemplate && !(integrationTemplate instanceof TemplateBase)) {
      if (isFunction(integrationTemplate.render)) {
        integrationTemplate = addPublicElementNormalization(integrationTemplate);
      }
      if (!isAsyncTemplate) {
        integrationTemplate = addOneRenderedCall(integrationTemplate);
      }
    }
  }
  return integrationTemplate;
};
var acquireTemplate = (templateSource, createTemplate, templates, isAsyncTemplate, skipTemplates, defaultTemplates) => {
  if (null == templateSource) {
    return new EmptyTemplate();
  }
  if (templateSource instanceof ChildDefaultTemplate) {
    return defaultTemplates[templateSource.name];
  }
  if (templateSource instanceof TemplateBase) {
    return templateSource;
  }
  if (isFunction(templateSource.render) && !isRenderer(templateSource)) {
    return isAsyncTemplate ? templateSource : addOneRenderedCall(templateSource);
  }
  if (templateSource.nodeType || isRenderer(templateSource)) {
    return createTemplate(renderer_default(templateSource));
  }
  return acquireIntegrationTemplate(templateSource, templates, isAsyncTemplate, skipTemplates) || defaultTemplates[templateSource] || createTemplate(templateSource);
};

// node_modules/devextreme/esm/core/template_manager.js
var TEXT_NODE = 3;
var ANONYMOUS_TEMPLATE_NAME = "template";
var TEMPLATE_OPTIONS_NAME = "dxTemplate";
var TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
var DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate((_ref) => {
  var {
    model,
    parent
  } = _ref;
  var widgetName = model.widget;
  if (!widgetName) {
    return renderer_default();
  }
  var widgetElement = renderer_default("<div>");
  var widgetOptions = model.options || {};
  if (parent) {
    parent._createComponent(widgetElement, widgetName, widgetOptions);
  } else {
    widgetElement[widgetName](widgetOptions);
  }
  return widgetElement;
});
var TemplateManager = class {
  constructor(createElement, anonymousTemplateName) {
    this._tempTemplates = [];
    this._defaultTemplates = {};
    this._anonymousTemplateName = anonymousTemplateName || ANONYMOUS_TEMPLATE_NAME;
    this._createElement = createElement || defaultCreateElement;
    this._createTemplateIfNeeded = this._createTemplateIfNeeded.bind(this);
  }
  static createDefaultOptions() {
    return {
      integrationOptions: {
        watchMethod: function(fn, callback) {
          var options = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          if (!options.skipImmediate) {
            callback(fn());
          }
          return noop;
        },
        templates: {
          "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE
        },
        useDeferUpdateForTemplates: true
      }
    };
  }
  get anonymousTemplateName() {
    return this._anonymousTemplateName;
  }
  addDefaultTemplates(templates) {
    this._defaultTemplates = extend({}, this._defaultTemplates, templates);
  }
  dispose() {
    this._tempTemplates.forEach((tempTemplate) => {
      tempTemplate.template.dispose && tempTemplate.template.dispose();
    });
    this._tempTemplates = [];
  }
  extractTemplates($el) {
    var templates = this._extractTemplates($el);
    var anonymousTemplateMeta = this._extractAnonymousTemplate($el);
    return {
      templates,
      anonymousTemplateMeta
    };
  }
  _extractTemplates($el) {
    var templates = findTemplates($el, TEMPLATE_OPTIONS_NAME);
    var suitableTemplates = suitableTemplatesByName(templates);
    templates.forEach((_ref2) => {
      var {
        element,
        options: {
          name
        }
      } = _ref2;
      if (element === suitableTemplates[name]) {
        renderer_default(element).addClass(TEMPLATE_WRAPPER_CLASS).detach();
      } else {
        renderer_default(element).remove();
      }
    });
    return Object.keys(suitableTemplates).map((name) => ({
      name,
      template: this._createTemplate(suitableTemplates[name])
    }));
  }
  _extractAnonymousTemplate($el) {
    var $anonymousTemplate = $el.contents().detach();
    var $notJunkTemplateContent = $anonymousTemplate.filter((_, element) => {
      var isTextNode = element.nodeType === TEXT_NODE;
      var isEmptyText = renderer_default(element).text().trim().length < 1;
      return !(isTextNode && isEmptyText);
    });
    return $notJunkTemplateContent.length > 0 ? {
      template: this._createTemplate($anonymousTemplate),
      name: this._anonymousTemplateName
    } : {};
  }
  _createTemplateIfNeeded(templateSource) {
    var cachedTemplate = this._tempTemplates.filter((tempTemplate) => tempTemplate.source === templateKey(templateSource))[0];
    if (cachedTemplate) {
      return cachedTemplate.template;
    }
    var template = this._createTemplate(templateSource);
    this._tempTemplates.push({
      template,
      source: templateKey(templateSource)
    });
    return template;
  }
  _createTemplate(templateSource) {
    return this._createElement(validateTemplateSource(templateSource));
  }
  getTemplate(templateSource, templates, _ref3, context2) {
    var {
      isAsyncTemplate,
      skipTemplates
    } = _ref3;
    if (!isFunction(templateSource)) {
      return acquireTemplate(templateSource, this._createTemplateIfNeeded, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);
    }
    return new FunctionTemplate((options) => {
      var templateSourceResult = templateSource.apply(context2, getNormalizedTemplateArgs(options));
      if (!isDefined(templateSourceResult)) {
        return new EmptyTemplate();
      }
      var dispose = false;
      var template = acquireTemplate(templateSourceResult, (templateSource2) => {
        if (templateSource2.nodeType || isRenderer(templateSource2) && !renderer_default(templateSource2).is("script")) {
          return new FunctionTemplate(() => templateSource2);
        }
        dispose = true;
        return this._createTemplate(templateSource2);
      }, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);
      var result = template.render(options);
      dispose && template.dispose && template.dispose();
      return result;
    });
  }
};

// node_modules/devextreme/esm/__internal/core/license/byte_utils.js
function base64ToBytes(base64) {
  return new Uint8Array(atob(base64).split("").map((s) => s.charCodeAt(0)));
}
function hexToBytes(string) {
  var _a, _b;
  return new Uint8Array(null !== (_b = null === (_a = string.match(/.{1,2}/g)) || void 0 === _a ? void 0 : _a.map((byte) => parseInt(byte, 16))) && void 0 !== _b ? _b : []);
}
function stringToBytes(string) {
  var bytes = new Uint8Array(string.length);
  for (var k = 0; k < string.length; k += 1) {
    bytes[k] = 255 & string.charCodeAt(k);
  }
  return bytes;
}
function wordsToBytes(words) {
  var bytes = new Uint8Array(4 * words.length);
  for (var k = 0; k < bytes.length; k += 1) {
    bytes[k] = words[k >> 2] >>> 8 * (3 - k % 4);
  }
  return bytes;
}
function bytesToWords(bytes) {
  var words = new Uint32Array(1 + (bytes.length - 1 >> 2));
  for (var k = 0; k < bytes.length; k += 1) {
    words[k >> 2] |= bytes[k] << 8 * (3 - k % 4);
  }
  return words;
}
function leftRotate(x, n) {
  return (x << n | x >>> 32 - n) >>> 0;
}
function concatBytes(a, b) {
  var result = new Uint8Array(a.length + b.length);
  result.set(a, 0);
  result.set(b, a.length);
  return result;
}

// node_modules/devextreme/esm/__internal/core/license/key.js
var PUBLIC_KEY = {
  e: 65537,
  n: new Uint8Array([200, 219, 153, 203, 140, 7, 228, 253, 193, 243, 62, 137, 139, 60, 68, 242, 48, 142, 113, 88, 185, 235, 253, 105, 80, 74, 32, 170, 96, 74, 111, 250, 7, 205, 154, 3, 146, 115, 153, 53, 45, 132, 123, 56, 61, 208, 184, 201, 63, 24, 109, 223, 0, 179, 169, 102, 139, 224, 73, 233, 45, 173, 138, 66, 98, 88, 69, 76, 177, 111, 113, 218, 192, 33, 101, 152, 25, 134, 34, 173, 32, 82, 230, 44, 247, 200, 253, 170, 192, 246, 30, 12, 96, 205, 100, 249, 181, 93, 0, 231])
};
var INTERNAL_USAGE_ID = "OV2rktmtU0qGXVpXC9oLwg";

// node_modules/devextreme/esm/__internal/core/license/pkcs1.js
var ASN1_SHA1 = "3021300906052b0e03021a05000414";
function pad(hash) {
  var dataLength = (8 * PUBLIC_KEY.n.length + 6) / 8;
  var data2 = concatBytes(hexToBytes(ASN1_SHA1), hash);
  if (data2.length + 10 > dataLength) {
    throw Error("Key is too short for SHA1 signing algorithm");
  }
  var padding = new Uint8Array(dataLength - data2.length);
  padding.fill(255, 0, padding.length - 1);
  padding[0] = 0;
  padding[1] = 1;
  padding[padding.length - 1] = 0;
  return concatBytes(padding, data2);
}

// node_modules/devextreme/esm/__internal/core/license/rsa_bigint.js
function compareSignatures(args) {
  try {
    var zero = BigInt(0);
    var one = BigInt(1);
    var eight = BigInt(8);
    var bigIntFromBytes = (bytes) => bytes.reduce((acc, cur) => (acc << eight) + BigInt(cur), zero);
    var actual = bigIntFromBytes(args.actual);
    var signature = bigIntFromBytes(args.signature);
    var exponent = BigInt(args.key.e);
    var modulus = bigIntFromBytes(args.key.n);
    var expected = ((base2, exponent2, modulus2) => {
      var result = one;
      var b = base2;
      var e = exponent2;
      while (e) {
        if (e & one) {
          result = result * b % modulus2;
        }
        b = b * b % modulus2;
        e >>= one;
      }
      return result;
    })(signature, exponent, modulus);
    return expected === actual;
  } catch (_a) {
    return true;
  }
}

// node_modules/devextreme/esm/__internal/core/license/sha1.js
function preprocess(text) {
  var bytes = new Uint8Array(text.length + 1);
  bytes.set(stringToBytes(text));
  bytes[bytes.length - 1] = 128;
  var words = bytesToWords(new Uint8Array(bytes));
  var result = new Uint32Array(16 * Math.ceil((words.length + 2) / 16));
  result.set(words, 0);
  result[result.length - 1] = 8 * (bytes.length - 1);
  return result;
}
function sha1(text) {
  var message = preprocess(text);
  var h = new Uint32Array([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
  for (var i = 0; i < message.length; i += 16) {
    var w = new Uint32Array(80);
    for (var j = 0; j < 16; j += 1) {
      w[j] = message[i + j];
    }
    for (var _j = 16; _j < 80; _j += 1) {
      var n = w[_j - 3] ^ w[_j - 8] ^ w[_j - 14] ^ w[_j - 16];
      w[_j] = n << 1 | n >>> 31;
    }
    var a = h[0];
    var b = h[1];
    var c = h[2];
    var d = h[3];
    var e = h[4];
    for (var _j2 = 0; _j2 < 80; _j2 += 1) {
      var [f, k] = _j2 < 20 ? [b & c | ~b & d, 1518500249] : _j2 < 40 ? [b ^ c ^ d, 1859775393] : _j2 < 60 ? [b & c | b & d | c & d, 2400959708] : [b ^ c ^ d, 3395469782];
      var temp = leftRotate(a, 5) + f + e + k + w[_j2];
      e = d;
      d = c;
      c = leftRotate(b, 30);
      b = a;
      a = temp;
    }
    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
  }
  return wordsToBytes(h);
}

// node_modules/devextreme/esm/__internal/core/license/types.js
var TokenKind;
!function(TokenKind2) {
  TokenKind2.corrupted = "corrupted";
  TokenKind2.verified = "verified";
  TokenKind2.internal = "internal";
}(TokenKind || (TokenKind = {}));

// node_modules/devextreme/esm/__internal/core/license/license_validation.js
var __rest = function(s, e) {
  var t = {};
  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) {
      t[p] = s[p];
    }
  }
  if (null != s && "function" === typeof Object.getOwnPropertySymbols) {
    var i = 0;
    for (p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) {
        t[p[i]] = s[p[i]];
      }
    }
  }
  return t;
};
var SPLITTER = ".";
var FORMAT = 1;
var RTM_MIN_PATCH_VERSION = 3;
var GENERAL_ERROR = {
  kind: TokenKind.corrupted,
  error: "general"
};
var VERIFICATION_ERROR = {
  kind: TokenKind.corrupted,
  error: "verification"
};
var DECODING_ERROR = {
  kind: TokenKind.corrupted,
  error: "decoding"
};
var DESERIALIZATION_ERROR = {
  kind: TokenKind.corrupted,
  error: "deserialization"
};
var PAYLOAD_ERROR = {
  kind: TokenKind.corrupted,
  error: "payload"
};
var VERSION_ERROR = {
  kind: TokenKind.corrupted,
  error: "version"
};
var validationPerformed = false;
function verifySignature(_ref) {
  var {
    text,
    signature: encodedSignature
  } = _ref;
  return compareSignatures({
    key: PUBLIC_KEY,
    signature: base64ToBytes(encodedSignature),
    actual: pad(sha1(text))
  });
}
function parseLicenseKey(encodedKey) {
  if (void 0 === encodedKey) {
    return GENERAL_ERROR;
  }
  var parts = encodedKey.split(SPLITTER);
  if (2 !== parts.length || 0 === parts[0].length || 0 === parts[1].length) {
    return GENERAL_ERROR;
  }
  if (!verifySignature({
    text: parts[0],
    signature: parts[1]
  })) {
    return VERIFICATION_ERROR;
  }
  var decodedPayload = "";
  try {
    decodedPayload = atob(parts[0]);
  } catch (_a) {
    return DECODING_ERROR;
  }
  var payload = {};
  try {
    payload = JSON.parse(decodedPayload);
  } catch (_b) {
    return DESERIALIZATION_ERROR;
  }
  var {
    customerId,
    maxVersionAllowed,
    format,
    internalUsageId
  } = payload, rest = __rest(payload, ["customerId", "maxVersionAllowed", "format", "internalUsageId"]);
  if (void 0 !== internalUsageId) {
    return {
      kind: TokenKind.internal,
      internalUsageId
    };
  }
  if (void 0 === customerId || void 0 === maxVersionAllowed || void 0 === format) {
    return PAYLOAD_ERROR;
  }
  if (format !== FORMAT) {
    return VERSION_ERROR;
  }
  return {
    kind: TokenKind.verified,
    payload: _extends({
      customerId,
      maxVersionAllowed
    }, rest)
  };
}
function getLicenseCheckParams(_ref2) {
  var {
    licenseKey,
    version: version2
  } = _ref2;
  var preview = false;
  try {
    var [major, minor, patch] = version2.split(".").map(Number);
    preview = isNaN(patch) || patch < RTM_MIN_PATCH_VERSION;
    if (!licenseKey) {
      return {
        preview,
        error: "W0019"
      };
    }
    var license = parseLicenseKey(licenseKey);
    if (license.kind === TokenKind.corrupted) {
      return {
        preview,
        error: "W0021"
      };
    }
    if (license.kind === TokenKind.internal) {
      return {
        preview,
        internal: true,
        error: license.internalUsageId === INTERNAL_USAGE_ID ? void 0 : "W0020"
      };
    }
    if (!(major && minor)) {
      return {
        preview,
        error: "W0021"
      };
    }
    if (10 * major + minor > license.payload.maxVersionAllowed) {
      return {
        preview,
        error: "W0020"
      };
    }
    return {
      preview,
      error: void 0
    };
  } catch (_a) {
    return {
      preview,
      error: "W0021"
    };
  }
}
function validateLicense(licenseKey) {
  var version2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : version;
  if (validationPerformed) {
    return;
  }
  validationPerformed = true;
  var {
    preview,
    internal,
    error
  } = getLicenseCheckParams({
    licenseKey,
    version: version2
  });
  if (error) {
    errors_default.log(preview ? "W0022" : error);
    return;
  }
  if (preview && !internal) {
    errors_default.log("W0022");
  }
}
function peekValidationPerformed() {
  return validationPerformed;
}
var license_validation_default = {
  validateLicense
};

// node_modules/devextreme/esm/core/dom_component.js
var {
  abstract
} = Component;
var DOMComponent = Component.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      width: void 0,
      height: void 0,
      rtlEnabled: config_default().rtlEnabled,
      elementAttr: {},
      disabled: false,
      integrationOptions: {}
    }, this._useTemplates() ? TemplateManager.createDefaultOptions() : {});
  },
  ctor(element, options) {
    this._customClass = null;
    this._createElement(element);
    attachInstanceToElement(this._$element, this, this._dispose);
    this.callBase(options);
    var validationAlreadyPerformed = peekValidationPerformed();
    license_validation_default.validateLicense(config_default().licenseKey);
    if (!validationAlreadyPerformed && peekValidationPerformed()) {
      config_default({
        licenseKey: ""
      });
    }
  },
  _createElement(element) {
    this._$element = renderer_default(element);
  },
  _getSynchronizableOptionsForCreateComponent: () => ["rtlEnabled", "disabled", "templatesRenderAsynchronously"],
  _checkFunctionValueDeprecation: function(optionNames) {
    if (!this.option("_ignoreFunctionValueDeprecation")) {
      optionNames.forEach((optionName) => {
        if (isFunction(this.option(optionName))) {
          errors_default.log("W0017", optionName);
        }
      });
    }
  },
  _visibilityChanged: abstract,
  _dimensionChanged: abstract,
  _init() {
    this.callBase();
    this._checkFunctionValueDeprecation(["width", "height", "maxHeight", "maxWidth", "minHeight", "minWidth", "popupHeight", "popupWidth"]);
    this._attachWindowResizeCallback();
    this._initTemplateManager();
  },
  _setOptionsByDevice(instanceCustomRules) {
    this.callBase([].concat(this.constructor._classCustomRules || [], instanceCustomRules || []));
  },
  _isInitialOptionValue(name) {
    var isCustomOption = this.constructor._classCustomRules && Object.prototype.hasOwnProperty.call(this._convertRulesToOptions(this.constructor._classCustomRules), name);
    return !isCustomOption && this.callBase(name);
  },
  _attachWindowResizeCallback() {
    if (this._isDimensionChangeSupported()) {
      var windowResizeCallBack = this._windowResizeCallBack = this._dimensionChanged.bind(this);
      resize_callbacks_default.add(windowResizeCallBack);
    }
  },
  _isDimensionChangeSupported() {
    return this._dimensionChanged !== abstract;
  },
  _renderComponent() {
    this._initMarkup();
    hasWindow() && this._render();
  },
  _initMarkup() {
    var {
      rtlEnabled
    } = this.option() || {};
    this._renderElementAttributes();
    this._toggleRTLDirection(rtlEnabled);
    this._renderVisibilityChange();
    this._renderDimensions();
  },
  _render() {
    this._attachVisibilityChangeHandlers();
    addShadowDomStyles(this.$element());
  },
  _renderElementAttributes() {
    var {
      elementAttr
    } = this.option() || {};
    var attributes = extend({}, elementAttr);
    var classNames = attributes.class;
    delete attributes.class;
    this.$element().attr(attributes).removeClass(this._customClass).addClass(classNames);
    this._customClass = classNames;
  },
  _renderVisibilityChange() {
    if (this._isDimensionChangeSupported()) {
      this._attachDimensionChangeHandlers();
    }
    if (this._isVisibilityChangeSupported()) {
      var $element = this.$element();
      $element.addClass("dx-visibility-change-handler");
    }
  },
  _renderDimensions() {
    var $element = this.$element();
    var element = $element.get(0);
    var width = this._getOptionValue("width", element);
    var height = this._getOptionValue("height", element);
    if (this._isCssUpdateRequired(element, height, width)) {
      $element.css({
        width: null === width ? "" : width,
        height: null === height ? "" : height
      });
    }
  },
  _isCssUpdateRequired: (element, height, width) => !!(isDefined(width) || isDefined(height) || element.style.width || element.style.height),
  _attachDimensionChangeHandlers() {
    var $el = this.$element();
    var namespace = "".concat(this.NAME, "VisibilityChange");
    resize.off($el, {
      namespace
    });
    resize.on($el, () => this._dimensionChanged(), {
      namespace
    });
  },
  _attachVisibilityChangeHandlers() {
    if (this._isVisibilityChangeSupported()) {
      var $el = this.$element();
      var namespace = "".concat(this.NAME, "VisibilityChange");
      this._isHidden = !this._isVisible();
      visibility.off($el, {
        namespace
      });
      visibility.on($el, () => this._checkVisibilityChanged("shown"), () => this._checkVisibilityChanged("hiding"), {
        namespace
      });
    }
  },
  _isVisible() {
    var $element = this.$element();
    return $element.is(":visible");
  },
  _checkVisibilityChanged(action) {
    var isVisible = this._isVisible();
    if (isVisible) {
      if ("hiding" === action && !this._isHidden) {
        this._visibilityChanged(false);
        this._isHidden = true;
      } else if ("shown" === action && this._isHidden) {
        this._isHidden = false;
        this._visibilityChanged(true);
      }
    }
  },
  _isVisibilityChangeSupported() {
    return this._visibilityChanged !== abstract && hasWindow();
  },
  _clean: noop,
  _modelByElement() {
    var {
      modelByElement
    } = this.option();
    var $element = this.$element();
    return modelByElement ? modelByElement($element) : void 0;
  },
  _invalidate() {
    if (this._isUpdateAllowed()) {
      throw errors_default.Error("E0007");
    }
    this._requireRefresh = true;
  },
  _refresh() {
    this._clean();
    this._renderComponent();
  },
  _dispose() {
    this._templateManager && this._templateManager.dispose();
    this.callBase();
    this._clean();
    this._detachWindowResizeCallback();
  },
  _detachWindowResizeCallback() {
    if (this._isDimensionChangeSupported()) {
      resize_callbacks_default.remove(this._windowResizeCallBack);
    }
  },
  _toggleRTLDirection(rtl) {
    var $element = this.$element();
    $element.toggleClass("dx-rtl", rtl);
  },
  _createComponent(element, component) {
    var config = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
    var synchronizableOptions = grep(this._getSynchronizableOptionsForCreateComponent(), (value2) => !(value2 in config));
    var {
      integrationOptions
    } = this.option();
    var {
      nestedComponentOptions
    } = this.option();
    nestedComponentOptions = nestedComponentOptions || noop;
    var nestedComponentConfig = extend({
      integrationOptions
    }, nestedComponentOptions(this));
    synchronizableOptions.forEach((optionName) => nestedComponentConfig[optionName] = this.option(optionName));
    this._extendConfig(config, nestedComponentConfig);
    var instance = void 0;
    if (isString(component)) {
      var $element = renderer_default(element)[component](config);
      instance = $element[component]("instance");
    } else if (element) {
      instance = component.getInstance(element);
      if (instance) {
        instance.option(config);
      } else {
        instance = new component(element, config);
      }
    }
    if (instance) {
      var optionChangedHandler = (_ref) => {
        var {
          name,
          value: value2
        } = _ref;
        if (synchronizableOptions.includes(name)) {
          instance.option(name, value2);
        }
      };
      this.on("optionChanged", optionChangedHandler);
      instance.on("disposing", () => this.off("optionChanged", optionChangedHandler));
    }
    return instance;
  },
  _extendConfig(config, extendConfig) {
    each(extendConfig, (key, value2) => {
      !Object.prototype.hasOwnProperty.call(config, key) && (config[key] = value2);
    });
  },
  _defaultActionConfig() {
    var $element = this.$element();
    var context2 = this._modelByElement($element);
    return extend(this.callBase(), {
      context: context2
    });
  },
  _defaultActionArgs() {
    var $element = this.$element();
    var model = this._modelByElement($element);
    var element = this.element();
    return extend(this.callBase(), {
      element,
      model
    });
  },
  _optionChanged(args) {
    switch (args.name) {
      case "width":
      case "height":
        this._renderDimensions();
        break;
      case "rtlEnabled":
        this._invalidate();
        break;
      case "elementAttr":
        this._renderElementAttributes();
        break;
      case "disabled":
      case "integrationOptions":
        break;
      default:
        this.callBase(args);
    }
  },
  _removeAttributes(element) {
    var attrs = element.attributes;
    for (var i = attrs.length - 1; i >= 0; i--) {
      var attr = attrs[i];
      if (attr) {
        var {
          name
        } = attr;
        if (!name.indexOf("aria-") || -1 !== name.indexOf("dx-") || "role" === name || "style" === name || "tabindex" === name) {
          element.removeAttribute(name);
        }
      }
    }
  },
  _removeClasses(element) {
    element.className = element.className.split(" ").filter((cssClass) => 0 !== cssClass.lastIndexOf("dx-", 0)).join(" ");
  },
  _updateDOMComponent(renderRequired) {
    if (renderRequired) {
      this._renderComponent();
    } else if (this._requireRefresh) {
      this._requireRefresh = false;
      this._refresh();
    }
  },
  endUpdate() {
    var renderRequired = this._isInitializingRequired();
    this.callBase();
    this._isUpdateAllowed() && this._updateDOMComponent(renderRequired);
  },
  $element() {
    return this._$element;
  },
  element() {
    var $element = this.$element();
    return getPublicElement($element);
  },
  dispose() {
    var element = this.$element().get(0);
    cleanDataRecursive(element, true);
    element.textContent = "";
    this._removeAttributes(element);
    this._removeClasses(element);
  },
  resetOption(optionName) {
    this.callBase(optionName);
    if ("width" === optionName || "height" === optionName) {
      var initialOption = this.initialOption(optionName);
      !isDefined(initialOption) && this.$element().css(optionName, "");
    }
  },
  _getAnonymousTemplateName() {
    return;
  },
  _initTemplateManager() {
    if (this._templateManager || !this._useTemplates()) {
      return;
    }
    var {
      integrationOptions = {}
    } = this.option();
    var {
      createTemplate
    } = integrationOptions;
    this._templateManager = new TemplateManager(createTemplate, this._getAnonymousTemplateName());
    this._initTemplates();
  },
  _initTemplates() {
    var {
      templates,
      anonymousTemplateMeta
    } = this._templateManager.extractTemplates(this.$element());
    var anonymousTemplate = this.option("integrationOptions.templates.".concat(anonymousTemplateMeta.name));
    templates.forEach((_ref2) => {
      var {
        name,
        template
      } = _ref2;
      this._options.silent("integrationOptions.templates.".concat(name), template);
    });
    if (anonymousTemplateMeta.name && !anonymousTemplate) {
      this._options.silent("integrationOptions.templates.".concat(anonymousTemplateMeta.name), anonymousTemplateMeta.template);
      this._options.silent("_hasAnonymousTemplateContent", true);
    }
  },
  _getTemplateByOption(optionName) {
    return this._getTemplate(this.option(optionName));
  },
  _getTemplate(templateSource) {
    var templates = this.option("integrationOptions.templates");
    var isAsyncTemplate = this.option("templatesRenderAsynchronously");
    var skipTemplates = this.option("integrationOptions.skipTemplates");
    return this._templateManager.getTemplate(templateSource, templates, {
      isAsyncTemplate,
      skipTemplates
    }, this);
  },
  _saveTemplate(name, template) {
    this._setOptionWithoutOptionChange("integrationOptions.templates." + name, this._templateManager._createTemplate(template));
  },
  _useTemplates: () => true
});
DOMComponent.getInstance = function(element) {
  return getInstanceByElement(renderer_default(element), this);
};
DOMComponent.defaultOptions = function(rule) {
  this._classCustomRules = this._classCustomRules || [];
  this._classCustomRules.push(rule);
};
var dom_component_default = DOMComponent;

// node_modules/devextreme/esm/core/utils/version.js
function compare(x, y, maxLevel) {
  function normalizeArg(value2) {
    if ("string" === typeof value2) {
      return value2.split(".");
    }
    if ("number" === typeof value2) {
      return [value2];
    }
    return value2;
  }
  x = normalizeArg(x);
  y = normalizeArg(y);
  var length = Math.max(x.length, y.length);
  if (isFinite(maxLevel)) {
    length = Math.min(length, maxLevel);
  }
  for (var i = 0; i < length; i++) {
    var xItem = parseInt(x[i] || 0, 10);
    var yItem = parseInt(y[i] || 0, 10);
    if (xItem < yItem) {
      return -1;
    }
    if (xItem > yItem) {
      return 1;
    }
  }
  return 0;
}

// node_modules/devextreme/esm/events/utils/event_nodes_disposing.js
function nodesByEvent(event) {
  return event && [event.target, event.delegateTarget, event.relatedTarget, event.currentTarget].filter((node) => !!node);
}
var subscribeNodesDisposing = (event, callback) => {
  events_engine_default.one(nodesByEvent(event), removeEvent, callback);
};
var unsubscribeNodesDisposing = (event, callback) => {
  events_engine_default.off(nodesByEvent(event), removeEvent, callback);
};

// node_modules/devextreme/esm/events/click.js
var CLICK_EVENT_NAME = "dxclick";
var prevented = null;
var lastFiredEvent = null;
var onNodeRemove = () => {
  lastFiredEvent = null;
};
var clickHandler = function(e) {
  var originalEvent = e.originalEvent;
  var eventAlreadyFired = lastFiredEvent === originalEvent || originalEvent && originalEvent.DXCLICK_FIRED;
  var leftButton = !e.which || 1 === e.which;
  if (leftButton && !prevented && !eventAlreadyFired) {
    if (originalEvent) {
      originalEvent.DXCLICK_FIRED = true;
    }
    unsubscribeNodesDisposing(lastFiredEvent, onNodeRemove);
    lastFiredEvent = originalEvent;
    subscribeNodesDisposing(lastFiredEvent, onNodeRemove);
    fireEvent({
      type: CLICK_EVENT_NAME,
      originalEvent: e
    });
  }
};
var ClickEmitter = emitter_default.inherit({
  ctor: function(element) {
    this.callBase(element);
    events_engine_default.on(this.getElement(), "click", clickHandler);
  },
  start: function(e) {
    prevented = null;
  },
  cancel: function() {
    prevented = true;
  },
  dispose: function() {
    events_engine_default.off(this.getElement(), "click", clickHandler);
  }
});
!function() {
  var desktopDevice = devices_default.real().generic;
  if (!desktopDevice) {
    var startTarget = null;
    var blurPrevented = false;
    var document = dom_adapter_default.getDocument();
    events_engine_default.subscribeGlobal(document, addNamespace2(pointer_default.down, "NATIVE_CLICK_FIXER"), function(e) {
      startTarget = e.target;
      blurPrevented = e.isDefaultPrevented();
    });
    events_engine_default.subscribeGlobal(document, addNamespace2("click", "NATIVE_CLICK_FIXER"), function(e) {
      var $target = renderer_default(e.target);
      if (!blurPrevented && startTarget && !$target.is(startTarget) && !renderer_default(startTarget).is("label") && (element = $target, renderer_default(element).is("input, textarea, select, button ,:focus, :focus *"))) {
        resetActiveElement();
      }
      var element;
      startTarget = null;
      blurPrevented = false;
    });
  }
}();
emitter_registrator_default({
  emitter: ClickEmitter,
  bubble: true,
  events: [CLICK_EVENT_NAME]
});

// node_modules/devextreme/esm/events/core/emitter.feedback.js
var ACTIVE_EVENT_NAME = "dxactive";
var INACTIVE_EVENT_NAME = "dxinactive";
var ACTIVE_TIMEOUT = 30;
var INACTIVE_TIMEOUT = 400;
var FeedbackEvent = class_default.inherit({
  ctor: function(timeout, fire) {
    this._timeout = timeout;
    this._fire = fire;
  },
  start: function() {
    var that = this;
    this._schedule(function() {
      that.force();
    });
  },
  _schedule: function(fn) {
    this.stop();
    this._timer = setTimeout(fn, this._timeout);
  },
  stop: function() {
    clearTimeout(this._timer);
  },
  force: function() {
    if (this._fired) {
      return;
    }
    this.stop();
    this._fire();
    this._fired = true;
  },
  fired: function() {
    return this._fired;
  }
});
var activeFeedback;
var FeedbackEmitter = emitter_default.inherit({
  ctor: function() {
    this.callBase.apply(this, arguments);
    this._active = new FeedbackEvent(0, noop);
    this._inactive = new FeedbackEvent(0, noop);
  },
  configure: function(data2, eventName) {
    switch (eventName) {
      case ACTIVE_EVENT_NAME:
        data2.activeTimeout = data2.timeout;
        break;
      case INACTIVE_EVENT_NAME:
        data2.inactiveTimeout = data2.timeout;
    }
    this.callBase(data2);
  },
  start: function(e) {
    if (activeFeedback) {
      var activeChildExists = contains(this.getElement().get(0), activeFeedback.getElement().get(0));
      var childJustActivated = !activeFeedback._active.fired();
      if (activeChildExists && childJustActivated) {
        this._cancel();
        return;
      }
      activeFeedback._inactive.force();
    }
    activeFeedback = this;
    this._initEvents(e);
    this._active.start();
  },
  _initEvents: function(e) {
    var that = this;
    var eventTarget = this._getEmitterTarget(e);
    var mouseEvent = isMouseEvent(e);
    var isSimulator = devices_default.isSimulator();
    var deferFeedback = isSimulator || !mouseEvent;
    var activeTimeout = ensureDefined(this.activeTimeout, ACTIVE_TIMEOUT);
    var inactiveTimeout = ensureDefined(this.inactiveTimeout, INACTIVE_TIMEOUT);
    this._active = new FeedbackEvent(deferFeedback ? activeTimeout : 0, function() {
      that._fireEvent(ACTIVE_EVENT_NAME, e, {
        target: eventTarget
      });
    });
    this._inactive = new FeedbackEvent(deferFeedback ? inactiveTimeout : 0, function() {
      that._fireEvent(INACTIVE_EVENT_NAME, e, {
        target: eventTarget
      });
      activeFeedback = null;
    });
  },
  cancel: function(e) {
    this.end(e);
  },
  end: function(e) {
    var skipTimers = e.type !== pointer_default.up;
    if (skipTimers) {
      this._active.stop();
    } else {
      this._active.force();
    }
    this._inactive.start();
    if (skipTimers) {
      this._inactive.force();
    }
  },
  dispose: function() {
    this._active.stop();
    this._inactive.stop();
    if (activeFeedback === this) {
      activeFeedback = null;
    }
    this.callBase();
  },
  lockInactive: function() {
    this._active.force();
    this._inactive.stop();
    activeFeedback = null;
    this._cancel();
    return this._inactive.force.bind(this._inactive);
  }
});
FeedbackEmitter.lock = function(deferred) {
  var lockInactive = activeFeedback ? activeFeedback.lockInactive() : noop;
  deferred.done(lockInactive);
};
emitter_registrator_default({
  emitter: FeedbackEmitter,
  events: [ACTIVE_EVENT_NAME, INACTIVE_EVENT_NAME]
});
var lock = FeedbackEmitter.lock;

// node_modules/devextreme/esm/events/hover.js
var HOVERSTART_NAMESPACE = "dxHoverStart";
var HOVERSTART = "dxhoverstart";
var POINTERENTER_NAMESPACED_EVENT_NAME = addNamespace2(pointer_default.enter, HOVERSTART_NAMESPACE);
var HOVEREND_NAMESPACE = "dxHoverEnd";
var HOVEREND = "dxhoverend";
var POINTERLEAVE_NAMESPACED_EVENT_NAME = addNamespace2(pointer_default.leave, HOVEREND_NAMESPACE);
var Hover = class_default.inherit({
  noBubble: true,
  ctor: function() {
    this._handlerArrayKeyPath = this._eventNamespace + "_HandlerStore";
  },
  setup: function(element) {
    data(element, this._handlerArrayKeyPath, {});
  },
  add: function(element, handleObj) {
    var that = this;
    var handler = function(e) {
      that._handler(e);
    };
    events_engine_default.on(element, this._originalEventName, handleObj.selector, handler);
    data(element, this._handlerArrayKeyPath)[handleObj.guid] = handler;
  },
  _handler: function(e) {
    if (isTouchEvent(e) || devices_default.isSimulator()) {
      return;
    }
    fireEvent({
      type: this._eventName,
      originalEvent: e,
      delegateTarget: e.delegateTarget
    });
  },
  remove: function(element, handleObj) {
    var handler = data(element, this._handlerArrayKeyPath)[handleObj.guid];
    events_engine_default.off(element, this._originalEventName, handleObj.selector, handler);
  },
  teardown: function(element) {
    removeData(element, this._handlerArrayKeyPath);
  }
});
var HoverStart = Hover.inherit({
  ctor: function() {
    this._eventNamespace = HOVERSTART_NAMESPACE;
    this._eventName = HOVERSTART;
    this._originalEventName = POINTERENTER_NAMESPACED_EVENT_NAME;
    this.callBase();
  },
  _handler: function(e) {
    var pointers = e.pointers || [];
    if (!pointers.length) {
      this.callBase(e);
    }
  }
});
var HoverEnd = Hover.inherit({
  ctor: function() {
    this._eventNamespace = HOVEREND_NAMESPACE;
    this._eventName = HOVEREND;
    this._originalEventName = POINTERLEAVE_NAMESPACED_EVENT_NAME;
    this.callBase();
  }
});
event_registrator_default(HOVERSTART, new HoverStart());
event_registrator_default(HOVEREND, new HoverEnd());

// node_modules/devextreme/esm/ui/widget/ui.widget.js
function setAttribute(name, value2, target) {
  name = "role" === name || "id" === name ? name : "aria-".concat(name);
  value2 = isDefined(value2) ? value2.toString() : null;
  target.attr(name, value2);
}
var Widget = dom_component_default.inherit({
  _feedbackHideTimeout: 400,
  _feedbackShowTimeout: 30,
  _supportedKeys: () => ({}),
  _getDefaultOptions() {
    return extend(this.callBase(), {
      hoveredElement: null,
      isActive: false,
      disabled: false,
      visible: true,
      hint: void 0,
      activeStateEnabled: false,
      onContentReady: null,
      hoverStateEnabled: false,
      focusStateEnabled: false,
      tabIndex: 0,
      accessKey: void 0,
      onFocusIn: null,
      onFocusOut: null,
      onKeyboardHandled: null,
      ignoreParentReadOnly: false,
      useResizeObserver: true
    });
  },
  _defaultOptionsRules: function() {
    return this.callBase().concat([{
      device: function() {
        var device = devices_default.real();
        var platform = device.platform;
        var version2 = device.version;
        return "ios" === platform && compare(version2, "13.3") <= 0;
      },
      options: {
        useResizeObserver: false
      }
    }]);
  },
  _init() {
    this.callBase();
    this._initContentReadyAction();
  },
  _innerWidgetOptionChanged: function(innerWidget, args) {
    var options = Widget.getOptionsFromContainer(args);
    innerWidget && innerWidget.option(options);
    this._options.cache(args.name, options);
  },
  _bindInnerWidgetOptions(innerWidget, optionsContainer) {
    var syncOptions = () => this._options.silent(optionsContainer, extend({}, innerWidget.option()));
    syncOptions();
    innerWidget.on("optionChanged", syncOptions);
  },
  _getAriaTarget() {
    return this._focusTarget();
  },
  _initContentReadyAction() {
    this._contentReadyAction = this._createActionByOption("onContentReady", {
      excludeValidators: ["disabled", "readOnly"]
    });
  },
  _initMarkup() {
    var {
      disabled,
      visible: visible2
    } = this.option();
    this.$element().addClass("dx-widget");
    this._toggleDisabledState(disabled);
    this._toggleVisibility(visible2);
    this._renderHint();
    this._isFocusable() && this._renderFocusTarget();
    this.callBase();
  },
  _render() {
    this.callBase();
    this._renderContent();
    this._renderFocusState();
    this._attachFeedbackEvents();
    this._attachHoverEvents();
    this._toggleIndependentState();
  },
  _renderHint() {
    var {
      hint
    } = this.option();
    this.$element().attr("title", hint || null);
  },
  _renderContent() {
    deferRender(() => !this._disposed ? this._renderContentImpl() : void 0).done(() => !this._disposed ? this._fireContentReadyAction() : void 0);
  },
  _renderContentImpl: noop,
  _fireContentReadyAction: deferRenderer(function() {
    return this._contentReadyAction();
  }),
  _dispose() {
    this._contentReadyAction = null;
    this._detachKeyboardEvents();
    this.callBase();
  },
  _resetActiveState() {
    this._toggleActiveState(this._eventBindingTarget(), false);
  },
  _clean() {
    this._cleanFocusState();
    this._resetActiveState();
    this.callBase();
    this.$element().empty();
  },
  _toggleVisibility(visible2) {
    this.$element().toggleClass("dx-state-invisible", !visible2);
  },
  _renderFocusState() {
    this._attachKeyboardEvents();
    if (this._isFocusable()) {
      this._renderFocusTarget();
      this._attachFocusEvents();
      this._renderAccessKey();
    }
  },
  _renderAccessKey() {
    var $el = this._focusTarget();
    var {
      accessKey
    } = this.option();
    $el.attr("accesskey", accessKey);
  },
  _isFocusable() {
    var {
      focusStateEnabled,
      disabled
    } = this.option();
    return focusStateEnabled && !disabled;
  },
  _eventBindingTarget() {
    return this.$element();
  },
  _focusTarget() {
    return this._getActiveElement();
  },
  _isFocusTarget: function(element) {
    var focusTargets = renderer_default(this._focusTarget()).toArray();
    return focusTargets.includes(element);
  },
  _findActiveTarget($element) {
    return $element.find(this._activeStateUnit).not(".dx-state-disabled");
  },
  _getActiveElement() {
    var activeElement = this._eventBindingTarget();
    if (this._activeStateUnit) {
      return this._findActiveTarget(activeElement);
    }
    return activeElement;
  },
  _renderFocusTarget() {
    var {
      tabIndex
    } = this.option();
    this._focusTarget().attr("tabIndex", tabIndex);
  },
  _keyboardEventBindingTarget() {
    return this._eventBindingTarget();
  },
  _refreshFocusEvent() {
    this._detachFocusEvents();
    this._attachFocusEvents();
  },
  _focusEventTarget() {
    return this._focusTarget();
  },
  _focusInHandler(event) {
    if (!event.isDefaultPrevented()) {
      this._createActionByOption("onFocusIn", {
        beforeExecute: () => this._updateFocusState(event, true),
        excludeValidators: ["readOnly"]
      })({
        event
      });
    }
  },
  _focusOutHandler(event) {
    if (!event.isDefaultPrevented()) {
      this._createActionByOption("onFocusOut", {
        beforeExecute: () => this._updateFocusState(event, false),
        excludeValidators: ["readOnly", "disabled"]
      })({
        event
      });
    }
  },
  _updateFocusState(_ref, isFocused) {
    var {
      target
    } = _ref;
    if (this._isFocusTarget(target)) {
      this._toggleFocusClass(isFocused, renderer_default(target));
    }
  },
  _toggleFocusClass(isFocused, $element) {
    var $focusTarget = $element && $element.length ? $element : this._focusTarget();
    $focusTarget.toggleClass("dx-state-focused", isFocused);
  },
  _hasFocusClass(element) {
    var $focusTarget = renderer_default(element || this._focusTarget());
    return $focusTarget.hasClass("dx-state-focused");
  },
  _isFocused() {
    return this._hasFocusClass();
  },
  _getKeyboardListeners: () => [],
  _attachKeyboardEvents() {
    this._detachKeyboardEvents();
    var {
      focusStateEnabled,
      onKeyboardHandled
    } = this.option();
    var hasChildListeners = this._getKeyboardListeners().length;
    var hasKeyboardEventHandler = !!onKeyboardHandled;
    var shouldAttach = focusStateEnabled || hasChildListeners || hasKeyboardEventHandler;
    if (shouldAttach) {
      this._keyboardListenerId = keyboard.on(this._keyboardEventBindingTarget(), this._focusTarget(), (opts) => this._keyboardHandler(opts));
    }
  },
  _keyboardHandler(options, onlyChildProcessing) {
    if (!onlyChildProcessing) {
      var {
        originalEvent,
        keyName,
        which
      } = options;
      var keys = this._supportedKeys(originalEvent);
      var func = keys[keyName] || keys[which];
      if (void 0 !== func) {
        var handler = func.bind(this);
        var result = handler(originalEvent, options);
        if (!result) {
          return false;
        }
      }
    }
    var keyboardListeners = this._getKeyboardListeners();
    var {
      onKeyboardHandled
    } = this.option();
    keyboardListeners.forEach((listener) => listener && listener._keyboardHandler(options));
    onKeyboardHandled && onKeyboardHandled(options);
    return true;
  },
  _refreshFocusState() {
    this._cleanFocusState();
    this._renderFocusState();
  },
  _cleanFocusState() {
    var $element = this._focusTarget();
    $element.removeAttr("tabIndex");
    this._toggleFocusClass(false);
    this._detachFocusEvents();
    this._detachKeyboardEvents();
  },
  _detachKeyboardEvents() {
    keyboard.off(this._keyboardListenerId);
    this._keyboardListenerId = null;
  },
  _attachHoverEvents() {
    var {
      hoverStateEnabled
    } = this.option();
    var selector = this._activeStateUnit;
    var $el = this._eventBindingTarget();
    hover.off($el, {
      selector,
      namespace: "UIFeedback"
    });
    if (hoverStateEnabled) {
      hover.on($el, new Action((_ref2) => {
        var {
          event,
          element
        } = _ref2;
        this._hoverStartHandler(event);
        this.option("hoveredElement", renderer_default(element));
      }, {
        excludeValidators: ["readOnly"]
      }), (event) => {
        this.option("hoveredElement", null);
        this._hoverEndHandler(event);
      }, {
        selector,
        namespace: "UIFeedback"
      });
    }
  },
  _attachFeedbackEvents() {
    var {
      activeStateEnabled
    } = this.option();
    var selector = this._activeStateUnit;
    var $el = this._eventBindingTarget();
    active.off($el, {
      namespace: "UIFeedback",
      selector
    });
    if (activeStateEnabled) {
      active.on($el, new Action((_ref3) => {
        var {
          event,
          element
        } = _ref3;
        return this._toggleActiveState(renderer_default(element), true, event);
      }), new Action((_ref4) => {
        var {
          event,
          element
        } = _ref4;
        return this._toggleActiveState(renderer_default(element), false, event);
      }, {
        excludeValidators: ["disabled", "readOnly"]
      }), {
        showTimeout: this._feedbackShowTimeout,
        hideTimeout: this._feedbackHideTimeout,
        selector,
        namespace: "UIFeedback"
      });
    }
  },
  _detachFocusEvents() {
    var $el = this._focusEventTarget();
    focus.off($el, {
      namespace: "".concat(this.NAME, "Focus")
    });
  },
  _attachFocusEvents() {
    var $el = this._focusEventTarget();
    focus.on($el, (e) => this._focusInHandler(e), (e) => this._focusOutHandler(e), {
      namespace: "".concat(this.NAME, "Focus"),
      isFocusable: (index2, el) => renderer_default(el).is(focusable)
    });
  },
  _hoverStartHandler: noop,
  _hoverEndHandler: noop,
  _toggleActiveState($element, value2) {
    this.option("isActive", value2);
    $element.toggleClass("dx-state-active", value2);
  },
  _updatedHover() {
    var hoveredElement = this._options.silent("hoveredElement");
    this._hover(hoveredElement, hoveredElement);
  },
  _findHoverTarget($el) {
    return $el && $el.closest(this._activeStateUnit || this._eventBindingTarget());
  },
  _hover($el, $previous) {
    var {
      hoverStateEnabled,
      disabled,
      isActive
    } = this.option();
    $previous = this._findHoverTarget($previous);
    $previous && $previous.toggleClass("dx-state-hover", false);
    if ($el && hoverStateEnabled && !disabled && !isActive) {
      var newHoveredElement = this._findHoverTarget($el);
      newHoveredElement && newHoveredElement.toggleClass("dx-state-hover", true);
    }
  },
  _toggleDisabledState(value2) {
    this.$element().toggleClass("dx-state-disabled", Boolean(value2));
    this.setAria("disabled", value2 || void 0);
  },
  _toggleIndependentState() {
    this.$element().toggleClass("dx-state-independent", this.option("ignoreParentReadOnly"));
  },
  _setWidgetOption(widgetName, args) {
    if (!this[widgetName]) {
      return;
    }
    if (isPlainObject(args[0])) {
      each(args[0], (option, value3) => this._setWidgetOption(widgetName, [option, value3]));
      return;
    }
    var optionName = args[0];
    var value2 = args[1];
    if (1 === args.length) {
      value2 = this.option(optionName);
    }
    var widgetOptionMap = this["".concat(widgetName, "OptionMap")];
    this[widgetName].option(widgetOptionMap ? widgetOptionMap(optionName) : optionName, value2);
  },
  _optionChanged(args) {
    var {
      name,
      value: value2,
      previousValue
    } = args;
    switch (name) {
      case "disabled":
        this._toggleDisabledState(value2);
        this._updatedHover();
        this._refreshFocusState();
        break;
      case "hint":
        this._renderHint();
        break;
      case "ignoreParentReadOnly":
        this._toggleIndependentState();
        break;
      case "activeStateEnabled":
        this._attachFeedbackEvents();
        break;
      case "hoverStateEnabled":
        this._attachHoverEvents();
        this._updatedHover();
        break;
      case "tabIndex":
      case "focusStateEnabled":
        this._refreshFocusState();
        break;
      case "onFocusIn":
      case "onFocusOut":
      case "useResizeObserver":
        break;
      case "accessKey":
        this._renderAccessKey();
        break;
      case "hoveredElement":
        this._hover(value2, previousValue);
        break;
      case "isActive":
        this._updatedHover();
        break;
      case "visible":
        this._toggleVisibility(value2);
        if (this._isVisibilityChangeSupported()) {
          this._checkVisibilityChanged(value2 ? "shown" : "hiding");
        }
        break;
      case "onKeyboardHandled":
        this._attachKeyboardEvents();
        break;
      case "onContentReady":
        this._initContentReadyAction();
        break;
      default:
        this.callBase(args);
    }
  },
  _isVisible() {
    var {
      visible: visible2
    } = this.option();
    return this.callBase() && visible2;
  },
  beginUpdate() {
    this._ready(false);
    this.callBase();
  },
  endUpdate() {
    this.callBase();
    if (this._initialized) {
      this._ready(true);
    }
  },
  _ready(value2) {
    if (0 === arguments.length) {
      return this._isReady;
    }
    this._isReady = value2;
  },
  setAria() {
    if (!isPlainObject(arguments.length <= 0 ? void 0 : arguments[0])) {
      setAttribute(arguments.length <= 0 ? void 0 : arguments[0], arguments.length <= 1 ? void 0 : arguments[1], (arguments.length <= 2 ? void 0 : arguments[2]) || this._getAriaTarget());
    } else {
      var target = (arguments.length <= 1 ? void 0 : arguments[1]) || this._getAriaTarget();
      each(arguments.length <= 0 ? void 0 : arguments[0], (name, value2) => setAttribute(name, value2, target));
    }
  },
  isReady() {
    return this._ready();
  },
  repaint() {
    this._refresh();
  },
  focus() {
    focus.trigger(this._focusTarget());
  },
  registerKeyHandler(key, handler) {
    var currentKeys = this._supportedKeys();
    this._supportedKeys = () => extend(currentKeys, {
      [key]: handler
    });
  }
});
Widget.getOptionsFromContainer = (_ref5) => {
  var {
    name,
    fullName,
    value: value2
  } = _ref5;
  var options = {};
  if (name === fullName) {
    options = value2;
  } else {
    var option = fullName.split(".").pop();
    options[option] = value2;
  }
  return options;
};
var ui_widget_default = Widget;

// node_modules/devextreme/esm/ui/overlay/z_index.js
var baseZIndex = 1500;
var zIndexStack = [];
var base = (ZIndex) => {
  baseZIndex = ensureDefined(ZIndex, baseZIndex);
  return baseZIndex;
};
var create = function() {
  var baseIndex = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : baseZIndex;
  var length = zIndexStack.length;
  var index2 = (length ? zIndexStack[length - 1] : baseIndex) + 1;
  zIndexStack.push(index2);
  return index2;
};
var remove = (zIndex) => {
  var position2 = zIndexStack.indexOf(zIndex);
  if (position2 >= 0) {
    zIndexStack.splice(position2, 1);
  }
};
var isLastZIndexInStack = (zIndex) => zIndexStack.length && zIndexStack[zIndexStack.length - 1] === zIndex;

// node_modules/devextreme/esm/ui/widget/swatch_container.js
var SWATCH_CONTAINER_CLASS_PREFIX = "dx-swatch-";
var getSwatchContainer = (element) => {
  var $element = renderer_default(element);
  var swatchContainer = $element.closest('[class^="'.concat(SWATCH_CONTAINER_CLASS_PREFIX, '"], [class*=" ').concat(SWATCH_CONTAINER_CLASS_PREFIX, '"]'));
  var viewport = value();
  if (!swatchContainer.length) {
    return viewport;
  }
  var swatchClassRegex = new RegExp("(\\s|^)(".concat(SWATCH_CONTAINER_CLASS_PREFIX, ".*?)(\\s|$)"));
  var swatchClass = swatchContainer[0].className.match(swatchClassRegex)[2];
  var viewportSwatchContainer = viewport.children("." + swatchClass);
  if (!viewportSwatchContainer.length) {
    viewportSwatchContainer = renderer_default("<div>").addClass(swatchClass).appendTo(viewport);
  }
  return viewportSwatchContainer;
};
var swatch_container_default = {
  getSwatchContainer
};

// node_modules/devextreme/esm/ui/overlay/overlay_position_controller.js
var window7 = getWindow();
var OVERLAY_POSITION_ALIASES = {
  top: {
    my: "top center",
    at: "top center"
  },
  bottom: {
    my: "bottom center",
    at: "bottom center"
  },
  right: {
    my: "right center",
    at: "right center"
  },
  left: {
    my: "left center",
    at: "left center"
  },
  center: {
    my: "center",
    at: "center"
  },
  "right bottom": {
    my: "right bottom",
    at: "right bottom"
  },
  "right top": {
    my: "right top",
    at: "right top"
  },
  "left bottom": {
    my: "left bottom",
    at: "left bottom"
  },
  "left top": {
    my: "left top",
    at: "left top"
  }
};
var OVERLAY_DEFAULT_BOUNDARY_OFFSET = {
  h: 0,
  v: 0
};
var OverlayPositionController = class {
  constructor(_ref) {
    var {
      position: position2,
      container,
      visualContainer,
      $root,
      $content,
      $wrapper,
      onPositioned,
      onVisualPositionChanged,
      restorePosition,
      _fixWrapperPosition
    } = _ref;
    this._props = {
      position: position2,
      container,
      visualContainer,
      restorePosition,
      onPositioned,
      onVisualPositionChanged,
      _fixWrapperPosition
    };
    this._$root = $root;
    this._$content = $content;
    this._$wrapper = $wrapper;
    this._$markupContainer = void 0;
    this._$visualContainer = void 0;
    this._shouldRenderContentInitialPosition = true;
    this._visualPosition = void 0;
    this._initialPosition = void 0;
    this._previousVisualPosition = void 0;
    this.updateContainer(container);
    this.updatePosition(position2);
    this.updateVisualContainer(visualContainer);
  }
  get $container() {
    this.updateContainer();
    return this._$markupContainer;
  }
  get $visualContainer() {
    return this._$visualContainer;
  }
  get position() {
    return this._position;
  }
  set fixWrapperPosition(fixWrapperPosition) {
    this._props._fixWrapperPosition = fixWrapperPosition;
    this.styleWrapperPosition();
  }
  set restorePosition(restorePosition) {
    this._props.restorePosition = restorePosition;
  }
  restorePositionOnNextRender(value2) {
    this._shouldRenderContentInitialPosition = value2 || !this._visualPosition;
  }
  openingHandled() {
    var shouldRestorePosition = this._props.restorePosition;
    this.restorePositionOnNextRender(shouldRestorePosition);
  }
  updatePosition(positionProp) {
    this._props.position = positionProp;
    this._position = this._normalizePosition(positionProp);
    this.updateVisualContainer();
  }
  updateContainer() {
    var containerProp = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._props.container;
    this._props.container = containerProp;
    this._$markupContainer = containerProp ? renderer_default(containerProp) : swatch_container_default.getSwatchContainer(this._$root);
    this.updateVisualContainer(this._props.visualContainer);
  }
  updateVisualContainer() {
    var visualContainer = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this._props.visualContainer;
    this._props.visualContainer = visualContainer;
    this._$visualContainer = this._getVisualContainer();
  }
  detectVisualPositionChange(event) {
    this._updateVisualPositionValue();
    this._raisePositionedEvents(event);
  }
  positionContent() {
    if (this._shouldRenderContentInitialPosition) {
      this._renderContentInitialPosition();
    } else {
      move(this._$content, this._visualPosition);
      this.detectVisualPositionChange();
    }
  }
  positionWrapper() {
    if (this._$visualContainer) {
      position_default.setup(this._$wrapper, {
        my: "top left",
        at: "top left",
        of: this._$visualContainer
      });
    }
  }
  styleWrapperPosition() {
    var useFixed = isWindow(this.$visualContainer.get(0)) || this._props._fixWrapperPosition;
    var positionStyle = useFixed ? "fixed" : "absolute";
    this._$wrapper.css("position", positionStyle);
  }
  _updateVisualPositionValue() {
    this._previousVisualPosition = this._visualPosition;
    this._visualPosition = locate(this._$content);
  }
  _renderContentInitialPosition() {
    this._renderBoundaryOffset();
    resetPosition(this._$content);
    var wrapperOverflow = this._$wrapper.css("overflow");
    this._$wrapper.css("overflow", "hidden");
    var resultPosition = position_default.setup(this._$content, this._position);
    this._$wrapper.css("overflow", wrapperOverflow);
    this._initialPosition = resultPosition;
    this.detectVisualPositionChange();
  }
  _raisePositionedEvents(event) {
    var previousPosition = this._previousVisualPosition;
    var newPosition = this._visualPosition;
    var isVisualPositionChanged = (null === previousPosition || void 0 === previousPosition ? void 0 : previousPosition.top) !== newPosition.top || (null === previousPosition || void 0 === previousPosition ? void 0 : previousPosition.left) !== newPosition.left;
    if (isVisualPositionChanged) {
      this._props.onVisualPositionChanged({
        previousPosition,
        position: newPosition,
        event
      });
    }
    this._props.onPositioned({
      position: this._initialPosition
    });
  }
  _renderBoundaryOffset() {
    var _this$_position;
    var boundaryOffset = null !== (_this$_position = this._position) && void 0 !== _this$_position ? _this$_position : {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };
    this._$content.css("margin", "".concat(boundaryOffset.v, "px ").concat(boundaryOffset.h, "px"));
  }
  _getVisualContainer() {
    var _this$_props$position, _this$_props$position2;
    var containerProp = this._props.container;
    var visualContainerProp = this._props.visualContainer;
    var positionOf = isEvent(null === (_this$_props$position = this._props.position) || void 0 === _this$_props$position ? void 0 : _this$_props$position.of) ? this._props.position.of.target : null === (_this$_props$position2 = this._props.position) || void 0 === _this$_props$position2 ? void 0 : _this$_props$position2.of;
    if (visualContainerProp) {
      return renderer_default(visualContainerProp);
    }
    if (containerProp) {
      return renderer_default(containerProp);
    }
    if (positionOf) {
      return renderer_default(positionOf);
    }
    return renderer_default(window7);
  }
  _normalizePosition(positionProp) {
    var defaultPositionConfig = {
      boundaryOffset: OVERLAY_DEFAULT_BOUNDARY_OFFSET
    };
    if (isDefined(positionProp)) {
      return extend(true, {}, defaultPositionConfig, this._positionToObject(positionProp));
    } else {
      return defaultPositionConfig;
    }
  }
  _positionToObject(position2) {
    if (isString(position2)) {
      return extend({}, OVERLAY_POSITION_ALIASES[position2]);
    }
    return position2;
  }
};

// node_modules/devextreme/esm/ui/overlay/ui.overlay.js
var ready3 = ready_callbacks_default.add;
var window8 = getWindow();
var viewPortChanged = changeCallback;
var OVERLAY_CLASS = "dx-overlay";
var OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper";
var OVERLAY_CONTENT_CLASS = "dx-overlay-content";
var OVERLAY_SHADER_CLASS = "dx-overlay-shader";
var INNER_OVERLAY_CLASS = "dx-inner-overlay";
var INVISIBLE_STATE_CLASS = "dx-state-invisible";
var ANONYMOUS_TEMPLATE_NAME2 = "content";
var RTL_DIRECTION_CLASS = "dx-rtl";
var OVERLAY_STACK = [];
var PREVENT_SAFARI_SCROLLING_CLASS = "dx-prevent-safari-scrolling";
var TAB_KEY = "tab";
ready3(() => {
  events_engine_default.subscribeGlobal(dom_adapter_default.getDocument(), pointer_default.down, (e) => {
    for (var i = OVERLAY_STACK.length - 1; i >= 0; i--) {
      if (!OVERLAY_STACK[i]._proxiedDocumentDownHandler(e)) {
        return;
      }
    }
  });
});
var Overlay = ui_widget_default.inherit({
  _supportedKeys: function() {
    return extend(this.callBase(), {
      escape: function() {
        this.hide();
      }
    });
  },
  _getDefaultOptions: function() {
    return extend(this.callBase(), {
      activeStateEnabled: false,
      visible: false,
      deferRendering: true,
      shading: true,
      shadingColor: "",
      wrapperAttr: {},
      position: extend({}, OVERLAY_POSITION_ALIASES.center),
      width: "80vw",
      minWidth: null,
      maxWidth: null,
      height: "80vh",
      minHeight: null,
      maxHeight: null,
      animation: {
        show: {
          type: "pop",
          duration: 300,
          from: {
            scale: 0.55
          }
        },
        hide: {
          type: "pop",
          duration: 300,
          from: {
            opacity: 1,
            scale: 1
          },
          to: {
            opacity: 0,
            scale: 0.55
          }
        }
      },
      closeOnOutsideClick: false,
      hideOnOutsideClick: false,
      copyRootClassesToWrapper: false,
      _ignoreCopyRootClassesToWrapperDeprecation: false,
      _ignoreElementAttrDeprecation: false,
      _ignorePreventScrollEventsDeprecation: false,
      onShowing: null,
      onShown: null,
      onHiding: null,
      onHidden: null,
      contentTemplate: "content",
      innerOverlay: false,
      restorePosition: true,
      container: void 0,
      visualContainer: void 0,
      hideTopOverlayHandler: () => {
        this.hide();
      },
      hideOnParentScroll: false,
      preventScrollEvents: true,
      onPositioned: null,
      propagateOutsideClick: false,
      ignoreChildEvents: true,
      _checkParentVisibility: true,
      _fixWrapperPosition: false
    });
  },
  _defaultOptionsRules: function() {
    return this.callBase().concat([{
      device: function() {
        return !hasWindow();
      },
      options: {
        width: null,
        height: null,
        animation: null,
        _checkParentVisibility: false
      }
    }]);
  },
  _setOptionsByReference: function() {
    this.callBase();
    extend(this._optionsByReference, {
      animation: true
    });
  },
  $wrapper: function() {
    return this._$wrapper;
  },
  _eventBindingTarget: function() {
    return this._$content;
  },
  _setDeprecatedOptions() {
    this.callBase();
    extend(this._deprecatedOptions, {
      closeOnOutsideClick: {
        since: "22.1",
        alias: "hideOnOutsideClick"
      }
    });
  },
  ctor: function(element, options) {
    this.callBase(element, options);
    if (options) {
      if (options.copyRootClassesToWrapper && !options._ignoreCopyRootClassesToWrapperDeprecation) {
        this._logDeprecatedOptionWarning("copyRootClassesToWrapper", {
          since: "21.2",
          message: 'Use the "wrapperAttr" option instead'
        });
      }
      if (options.elementAttr && !options._ignoreElementAttrDeprecation) {
        this._logDeprecatedOptionWarning("elementAttr", {
          since: "21.2",
          message: 'Use the "wrapperAttr" option instead'
        });
      }
      if ("preventScrollEvents" in options && !options._ignorePreventScrollEventsDeprecation) {
        this._logDeprecatedPreventScrollEventsInfo();
      }
    }
  },
  _logDeprecatedPreventScrollEventsInfo() {
    this._logDeprecatedOptionWarning("preventScrollEvents", {
      since: "23.1",
      message: "If you enable this option, end-users may experience scrolling issues."
    });
  },
  _init: function() {
    this.callBase();
    this._initActions();
    this._initHideOnOutsideClickHandler();
    this._initTabTerminatorHandler();
    this._customWrapperClass = null;
    this._$wrapper = renderer_default("<div>").addClass(OVERLAY_WRAPPER_CLASS);
    this._$content = renderer_default("<div>").addClass(OVERLAY_CONTENT_CLASS);
    this._initInnerOverlayClass();
    var $element = this.$element();
    if (this.option("copyRootClassesToWrapper")) {
      this._$wrapper.addClass($element.attr("class"));
    }
    $element.addClass(OVERLAY_CLASS);
    this._$wrapper.attr("data-bind", "dxControlsDescendantBindings: true");
    this._toggleViewPortSubscription(true);
    this._initHideTopOverlayHandler(this.option("hideTopOverlayHandler"));
    this._parentsScrollSubscriptionInfo = {
      handler: (e) => {
        this._hideOnParentsScrollHandler(e);
      }
    };
    this.warnPositionAsFunction();
  },
  warnPositionAsFunction() {
    if (isFunction(this.option("position"))) {
      errors_default.log("W0018");
    }
  },
  _initInnerOverlayClass: function() {
    this._$content.toggleClass(INNER_OVERLAY_CLASS, this.option("innerOverlay"));
  },
  _initHideTopOverlayHandler: function(handler) {
    this._hideTopOverlayHandler = handler;
  },
  _getActionsList: function() {
    return ["onShowing", "onShown", "onHiding", "onHidden", "onPositioned", "onVisualPositionChanged"];
  },
  _initActions: function() {
    this._actions = {};
    var actions = this._getActionsList();
    each(actions, (_, action) => {
      this._actions[action] = this._createActionByOption(action, {
        excludeValidators: ["disabled", "readOnly"]
      }) || noop;
    });
  },
  _initHideOnOutsideClickHandler: function() {
    var _this = this;
    this._proxiedDocumentDownHandler = function() {
      return _this._documentDownHandler(...arguments);
    };
  },
  _initMarkup() {
    this.callBase();
    this._renderWrapperAttributes();
    this._initPositionController();
  },
  _documentDownHandler: function(e) {
    if (this._showAnimationProcessing) {
      this._stopAnimation();
    }
    var isAttachedTarget = renderer_default(window8.document).is(e.target) || contains(window8.document, e.target);
    var isInnerOverlay = renderer_default(e.target).closest(".".concat(INNER_OVERLAY_CLASS)).length;
    var outsideClick = isAttachedTarget && !isInnerOverlay && !(this._$content.is(e.target) || contains(this._$content.get(0), e.target));
    if (outsideClick && this._shouldHideOnOutsideClick(e)) {
      this._outsideClickHandler(e);
    }
    return this.option("propagateOutsideClick");
  },
  _shouldHideOnOutsideClick: function(e) {
    var {
      hideOnOutsideClick
    } = this.option();
    if (isFunction(hideOnOutsideClick)) {
      return hideOnOutsideClick(e);
    }
    return hideOnOutsideClick;
  },
  _outsideClickHandler(e) {
    if (this.option("shading")) {
      e.preventDefault();
    }
    this.hide();
  },
  _getAnonymousTemplateName: function() {
    return ANONYMOUS_TEMPLATE_NAME2;
  },
  _initTemplates: function() {
    this._templateManager.addDefaultTemplates({
      content: new EmptyTemplate()
    });
    this.callBase();
  },
  _isTopOverlay: function() {
    var overlayStack = this._overlayStack();
    for (var i = overlayStack.length - 1; i >= 0; i--) {
      var tabbableElements = overlayStack[i]._findTabbableBounds();
      if (tabbableElements.first || tabbableElements.last) {
        return overlayStack[i] === this;
      }
    }
    return false;
  },
  _overlayStack: function() {
    return OVERLAY_STACK;
  },
  _zIndexInitValue: function() {
    return Overlay.baseZIndex();
  },
  _toggleViewPortSubscription: function(toggle) {
    var _this2 = this;
    viewPortChanged.remove(this._viewPortChangeHandle);
    if (toggle) {
      this._viewPortChangeHandle = function() {
        _this2._viewPortChangeHandler(...arguments);
      };
      viewPortChanged.add(this._viewPortChangeHandle);
    }
  },
  _viewPortChangeHandler: function() {
    this._positionController.updateContainer(this.option("container"));
    this._refresh();
  },
  _renderWrapperAttributes() {
    var {
      wrapperAttr
    } = this.option();
    var attributes = extend({}, wrapperAttr);
    var classNames = attributes.class;
    delete attributes.class;
    this.$wrapper().attr(attributes).removeClass(this._customWrapperClass).addClass(classNames);
    this._customWrapperClass = classNames;
  },
  _renderVisibilityAnimate: function(visible2) {
    this._stopAnimation();
    return visible2 ? this._show() : this._hide();
  },
  _getAnimationConfig: function() {
    return this._getOptionValue("animation", this);
  },
  _toggleBodyScroll: noop,
  _animateShowing: function() {
    var _this$_getAnimationCo, _showAnimation$start, _showAnimation$comple, _this3 = this;
    var animation2 = null !== (_this$_getAnimationCo = this._getAnimationConfig()) && void 0 !== _this$_getAnimationCo ? _this$_getAnimationCo : {};
    var showAnimation = this._normalizeAnimation(animation2.show, "to");
    var startShowAnimation = null !== (_showAnimation$start = null === showAnimation || void 0 === showAnimation ? void 0 : showAnimation.start) && void 0 !== _showAnimation$start ? _showAnimation$start : noop;
    var completeShowAnimation = null !== (_showAnimation$comple = null === showAnimation || void 0 === showAnimation ? void 0 : showAnimation.complete) && void 0 !== _showAnimation$comple ? _showAnimation$comple : noop;
    this._animate(showAnimation, function() {
      if (_this3._isAnimationPaused) {
        return;
      }
      if (_this3.option("focusStateEnabled")) {
        events_engine_default.trigger(_this3._focusTarget(), "focus");
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      completeShowAnimation.call(_this3, ...args);
      _this3._showAnimationProcessing = false;
      _this3._isHidden = false;
      _this3._actions.onShown();
      _this3._toggleSafariScrolling();
      _this3._showingDeferred.resolve();
    }, function() {
      if (_this3._isAnimationPaused) {
        return;
      }
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      startShowAnimation.call(_this3, ...args);
      _this3._showAnimationProcessing = true;
    });
  },
  _processShowingHidingCancel: function(cancelArg, applyFunction, cancelFunction) {
    if (isPromise(cancelArg)) {
      cancelArg.then((shouldCancel) => {
        if (shouldCancel) {
          cancelFunction();
        } else {
          applyFunction();
        }
      }).catch(() => applyFunction());
    } else {
      cancelArg ? cancelFunction() : applyFunction();
    }
  },
  _show: function() {
    this._showingDeferred = new Deferred();
    this._parentHidden = this._isParentHidden();
    this._showingDeferred.done(() => {
      delete this._parentHidden;
    });
    if (this._parentHidden) {
      this._isHidden = true;
      return this._showingDeferred.resolve();
    }
    if (this._currentVisible) {
      return new Deferred().resolve().promise();
    }
    this._currentVisible = true;
    if (this._isHidingActionCanceled) {
      delete this._isHidingActionCanceled;
      this._showingDeferred.reject();
    } else {
      var show = () => {
        this._toggleBodyScroll(this.option("enableBodyScroll"));
        this._stopAnimation();
        this._toggleVisibility(true);
        this._$content.css("visibility", "hidden");
        this._$content.toggleClass(INVISIBLE_STATE_CLASS, false);
        this._updateZIndexStackPosition(true);
        this._positionController.openingHandled();
        this._renderContent();
        var showingArgs = {
          cancel: false
        };
        this._actions.onShowing(showingArgs);
        this._processShowingHidingCancel(showingArgs.cancel, () => {
          this._$content.css("visibility", "");
          this._renderVisibility(true);
          this._animateShowing();
        }, () => {
          this._toggleVisibility(false);
          this._$content.css("visibility", "");
          this._$content.toggleClass(INVISIBLE_STATE_CLASS, true);
          this._isShowingActionCanceled = true;
          this._moveFromContainer();
          this.option("visible", false);
          this._showingDeferred.resolve();
        });
      };
      if (this.option("templatesRenderAsynchronously")) {
        this._stopShowTimer();
        this._asyncShowTimeout = setTimeout(show);
      } else {
        show();
      }
    }
    return this._showingDeferred.promise();
  },
  _normalizeAnimation: function(showHideConfig, direction) {
    if (showHideConfig) {
      showHideConfig = extend({
        type: "slide",
        skipElementInitialStyles: true
      }, showHideConfig);
      if (isObject(showHideConfig[direction])) {
        extend(showHideConfig[direction], {
          position: this._positionController.position
        });
      }
    }
    return showHideConfig;
  },
  _animateHiding: function() {
    var _this$_getAnimationCo2, _hideAnimation$start, _hideAnimation$comple, _this4 = this;
    var animation2 = null !== (_this$_getAnimationCo2 = this._getAnimationConfig()) && void 0 !== _this$_getAnimationCo2 ? _this$_getAnimationCo2 : {};
    var hideAnimation = this._normalizeAnimation(animation2.hide, "from");
    var startHideAnimation = null !== (_hideAnimation$start = null === hideAnimation || void 0 === hideAnimation ? void 0 : hideAnimation.start) && void 0 !== _hideAnimation$start ? _hideAnimation$start : noop;
    var completeHideAnimation = null !== (_hideAnimation$comple = null === hideAnimation || void 0 === hideAnimation ? void 0 : hideAnimation.complete) && void 0 !== _hideAnimation$comple ? _hideAnimation$comple : noop;
    this._animate(hideAnimation, function() {
      var _this4$_actions;
      _this4._$content.css("pointerEvents", "");
      _this4._renderVisibility(false);
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      completeHideAnimation.call(_this4, ...args);
      _this4._hideAnimationProcessing = false;
      null === (_this4$_actions = _this4._actions) || void 0 === _this4$_actions ? void 0 : _this4$_actions.onHidden();
      _this4._hidingDeferred.resolve();
    }, function() {
      _this4._$content.css("pointerEvents", "none");
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      startHideAnimation.call(_this4, ...args);
      _this4._hideAnimationProcessing = true;
    });
  },
  _hide: function() {
    if (!this._currentVisible) {
      return new Deferred().resolve().promise();
    }
    this._currentVisible = false;
    this._hidingDeferred = new Deferred();
    var hidingArgs = {
      cancel: false
    };
    if (this._isShowingActionCanceled) {
      delete this._isShowingActionCanceled;
      this._hidingDeferred.reject();
    } else {
      this._actions.onHiding(hidingArgs);
      this._toggleSafariScrolling();
      this._toggleBodyScroll(true);
      this._processShowingHidingCancel(hidingArgs.cancel, () => {
        this._forceFocusLost();
        this._toggleShading(false);
        this._toggleSubscriptions(false);
        this._stopShowTimer();
        this._animateHiding();
      }, () => {
        this._isHidingActionCanceled = true;
        this.option("visible", true);
        this._hidingDeferred.resolve();
      });
    }
    return this._hidingDeferred.promise();
  },
  _forceFocusLost: function() {
    var activeElement = dom_adapter_default.getActiveElement();
    var shouldResetActiveElement = !!this._$content.find(activeElement).length;
    if (shouldResetActiveElement) {
      resetActiveElement();
    }
  },
  _animate: function(animation2, completeCallback, startCallback) {
    if (animation2) {
      startCallback = startCallback || animation2.start || noop;
      fx_default.animate(this._$content, extend({}, animation2, {
        start: startCallback,
        complete: completeCallback
      }));
    } else {
      completeCallback();
    }
  },
  _stopAnimation: function() {
    fx_default.stop(this._$content, true);
  },
  _renderVisibility: function(visible2) {
    if (visible2 && this._isParentHidden()) {
      return;
    }
    this._currentVisible = visible2;
    this._stopAnimation();
    if (!visible2) {
      triggerHidingEvent(this._$content);
    }
    if (visible2) {
      this._checkContainerExists();
      this._moveToContainer();
      this._renderGeometry();
      triggerShownEvent(this._$content);
      triggerResizeEvent(this._$content);
    } else {
      this._toggleVisibility(visible2);
      this._$content.toggleClass(INVISIBLE_STATE_CLASS, !visible2);
      this._updateZIndexStackPosition(visible2);
      this._moveFromContainer();
    }
    this._toggleShading(visible2);
    this._toggleSubscriptions(visible2);
  },
  _updateZIndexStackPosition: function(pushToStack) {
    var overlayStack = this._overlayStack();
    var index2 = overlayStack.indexOf(this);
    if (pushToStack) {
      if (-1 === index2) {
        this._zIndex = create(this._zIndexInitValue());
        overlayStack.push(this);
      }
      this._$wrapper.css("zIndex", this._zIndex);
      this._$content.css("zIndex", this._zIndex);
    } else if (-1 !== index2) {
      overlayStack.splice(index2, 1);
      remove(this._zIndex);
    }
  },
  _toggleShading: function(visible2) {
    this._$wrapper.toggleClass(OVERLAY_SHADER_CLASS, visible2 && this.option("shading"));
    this._$wrapper.css("backgroundColor", this.option("shading") ? this.option("shadingColor") : "");
    this._toggleTabTerminator(visible2 && this.option("shading"));
  },
  _initTabTerminatorHandler: function() {
    var _this5 = this;
    this._proxiedTabTerminatorHandler = function() {
      _this5._tabKeyHandler(...arguments);
    };
  },
  _toggleTabTerminator: function(enabled) {
    var eventName = addNamespace2("keydown", this.NAME);
    if (enabled) {
      events_engine_default.on(dom_adapter_default.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    } else {
      events_engine_default.off(dom_adapter_default.getDocument(), eventName, this._proxiedTabTerminatorHandler);
    }
  },
  _findTabbableBounds: function() {
    var $elements = this._$wrapper.find("*");
    var elementsCount = $elements.length - 1;
    var result = {
      first: null,
      last: null
    };
    for (var i = 0; i <= elementsCount; i++) {
      if (!result.first && $elements.eq(i).is(tabbable)) {
        result.first = $elements.eq(i);
      }
      if (!result.last && $elements.eq(elementsCount - i).is(tabbable)) {
        result.last = $elements.eq(elementsCount - i);
      }
      if (result.first && result.last) {
        break;
      }
    }
    return result;
  },
  _tabKeyHandler: function(e) {
    if (normalizeKeyName(e) !== TAB_KEY || !this._isTopOverlay()) {
      return;
    }
    var tabbableElements = this._findTabbableBounds();
    var $firstTabbable = tabbableElements.first;
    var $lastTabbable = tabbableElements.last;
    var isTabOnLast = !e.shiftKey && e.target === $lastTabbable.get(0);
    var isShiftTabOnFirst = e.shiftKey && e.target === $firstTabbable.get(0);
    var isEmptyTabList = 0 === tabbableElements.length;
    var isOutsideTarget = !contains(this._$wrapper.get(0), e.target);
    if (isTabOnLast || isShiftTabOnFirst || isEmptyTabList || isOutsideTarget) {
      e.preventDefault();
      var $focusElement = e.shiftKey ? $lastTabbable : $firstTabbable;
      events_engine_default.trigger($focusElement, "focusin");
      events_engine_default.trigger($focusElement, "focus");
    }
  },
  _toggleSubscriptions: function(enabled) {
    if (hasWindow()) {
      this._toggleHideTopOverlayCallback(enabled);
      this._toggleHideOnParentsScrollSubscription(enabled);
    }
  },
  _toggleHideTopOverlayCallback: function(subscribe) {
    if (!this._hideTopOverlayHandler) {
      return;
    }
    if (subscribe) {
      hideCallback.add(this._hideTopOverlayHandler);
    } else {
      hideCallback.remove(this._hideTopOverlayHandler);
    }
  },
  _toggleHideOnParentsScrollSubscription: function(needSubscribe) {
    var _this$_parentsScrollS;
    var scrollEvent = addNamespace2("scroll", this.NAME);
    var {
      prevTargets,
      handler
    } = null !== (_this$_parentsScrollS = this._parentsScrollSubscriptionInfo) && void 0 !== _this$_parentsScrollS ? _this$_parentsScrollS : {};
    events_engine_default.off(prevTargets, scrollEvent, handler);
    var closeOnScroll = this.option("hideOnParentScroll");
    if (needSubscribe && closeOnScroll) {
      var $parents = this._hideOnParentScrollTarget().parents();
      if ("desktop" === devices_default.real().deviceType) {
        $parents = $parents.add(window8);
      }
      events_engine_default.on($parents, scrollEvent, handler);
      this._parentsScrollSubscriptionInfo.prevTargets = $parents;
    }
  },
  _hideOnParentsScrollHandler: function(e) {
    var closeHandled = false;
    var closeOnScroll = this.option("hideOnParentScroll");
    if (isFunction(closeOnScroll)) {
      closeHandled = closeOnScroll(e);
    }
    if (!closeHandled && !this._showAnimationProcessing) {
      this.hide();
    }
  },
  _hideOnParentScrollTarget: function() {
    return this._$wrapper;
  },
  _render: function() {
    this.callBase();
    this._appendContentToElement();
    this._renderVisibilityAnimate(this.option("visible"));
  },
  _appendContentToElement: function() {
    if (!this._$content.parent().is(this.$element())) {
      this._$content.appendTo(this.$element());
    }
  },
  _renderContent: function() {
    var shouldDeferRendering = !this._currentVisible && this.option("deferRendering");
    var isParentHidden = this.option("visible") && this._isParentHidden();
    if (isParentHidden) {
      this._isHidden = true;
      return;
    }
    if (this._contentAlreadyRendered || shouldDeferRendering) {
      return;
    }
    this._contentAlreadyRendered = true;
    this._appendContentToElement();
    this.callBase();
  },
  _isParentHidden: function() {
    if (!this.option("_checkParentVisibility")) {
      return false;
    }
    if (void 0 !== this._parentHidden) {
      return this._parentHidden;
    }
    var $parent = this.$element().parent();
    if ($parent.is(":visible")) {
      return false;
    }
    var isHidden = false;
    $parent.add($parent.parents()).each(function() {
      var $element = renderer_default(this);
      if ("none" === $element.css("display")) {
        isHidden = true;
        return false;
      }
    });
    return isHidden || !dom_adapter_default.getBody().contains($parent.get(0));
  },
  _renderContentImpl: function() {
    var whenContentRendered = new Deferred();
    var contentTemplateOption = this.option("contentTemplate");
    var contentTemplate = this._getTemplate(contentTemplateOption);
    var transclude = this._templateManager.anonymousTemplateName === contentTemplateOption;
    contentTemplate && contentTemplate.render({
      container: getPublicElement(this.$content()),
      noModel: true,
      transclude,
      onRendered: () => {
        whenContentRendered.resolve();
        if (this.option("templatesRenderAsynchronously")) {
          this._dimensionChanged();
        }
      }
    });
    this._toggleWrapperScrollEventsSubscription(this.option("preventScrollEvents"));
    whenContentRendered.done(() => {
      if (this.option("visible")) {
        this._moveToContainer();
      }
    });
    return whenContentRendered.promise();
  },
  _getPositionControllerConfig() {
    var {
      container,
      visualContainer,
      _fixWrapperPosition,
      restorePosition
    } = this.option();
    return {
      container,
      visualContainer,
      $root: this.$element(),
      $content: this._$content,
      $wrapper: this._$wrapper,
      onPositioned: this._actions.onPositioned,
      onVisualPositionChanged: this._actions.onVisualPositionChanged,
      restorePosition,
      _fixWrapperPosition
    };
  },
  _initPositionController() {
    this._positionController = new OverlayPositionController(this._getPositionControllerConfig());
  },
  _toggleWrapperScrollEventsSubscription: function(enabled) {
    var eventName = addNamespace2(DRAG_EVENT, this.NAME);
    events_engine_default.off(this._$wrapper, eventName);
    if (enabled) {
      events_engine_default.on(this._$wrapper, eventName, {
        validate: function() {
          return true;
        },
        getDirection: function() {
          return "both";
        },
        _toggleGestureCover: function(toggle) {
          if (!toggle) {
            this._toggleGestureCoverImpl(toggle);
          }
        },
        _clearSelection: noop,
        isNative: true
      }, (e) => {
        var originalEvent = e.originalEvent.originalEvent;
        var {
          type: type2
        } = originalEvent || {};
        var isWheel = "wheel" === type2;
        var isMouseMove = "mousemove" === type2;
        var isScrollByWheel = isWheel && !isCommandKeyPressed(e);
        e._cancelPreventDefault = true;
        if (originalEvent && false !== e.cancelable && (!isMouseMove && !isWheel || isScrollByWheel)) {
          e.preventDefault();
        }
      });
    }
  },
  _moveFromContainer: function() {
    this._$content.appendTo(this.$element());
    this._$wrapper.detach();
  },
  _checkContainerExists() {
    var $wrapperContainer = this._positionController.$container;
    if (void 0 === $wrapperContainer) {
      return;
    }
    var containerExists = $wrapperContainer.length > 0;
    if (!containerExists) {
      ui_errors_default.log("W1021", this.NAME);
    }
  },
  _moveToContainer: function() {
    var $wrapperContainer = this._positionController.$container;
    this._$wrapper.appendTo($wrapperContainer);
    this._$content.appendTo(this._$wrapper);
  },
  _renderGeometry: function(options) {
    var {
      visible: visible2
    } = this.option();
    if (visible2 && hasWindow()) {
      this._stopAnimation();
      this._renderGeometryImpl();
    }
  },
  _renderGeometryImpl: function() {
    this._positionController.updatePosition(this._getOptionValue("position"));
    this._renderWrapper();
    this._renderDimensions();
    this._renderPosition();
  },
  _renderPosition() {
    this._positionController.positionContent();
  },
  _isAllWindowCovered: function() {
    return isWindow(this._positionController.$visualContainer.get(0)) && this.option("shading");
  },
  _toggleSafariScrolling: function() {
    var visible2 = this.option("visible");
    var $body = renderer_default(dom_adapter_default.getBody());
    var isIosSafari = "ios" === devices_default.real().platform && browser_default.safari;
    var isAllWindowCovered = this._isAllWindowCovered();
    var isScrollingPrevented = $body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS);
    var shouldPreventScrolling = !isScrollingPrevented && visible2 && isAllWindowCovered;
    var shouldEnableScrolling = isScrollingPrevented && (!visible2 || !isAllWindowCovered || this._disposed);
    if (isIosSafari) {
      if (shouldEnableScrolling) {
        $body.removeClass(PREVENT_SAFARI_SCROLLING_CLASS);
        window8.scrollTo(0, this._cachedBodyScrollTop);
        this._cachedBodyScrollTop = void 0;
      } else if (shouldPreventScrolling) {
        this._cachedBodyScrollTop = window8.pageYOffset;
        $body.addClass(PREVENT_SAFARI_SCROLLING_CLASS);
      }
    }
  },
  _renderWrapper: function() {
    this._positionController.styleWrapperPosition();
    this._renderWrapperDimensions();
    this._positionController.positionWrapper();
  },
  _renderWrapperDimensions: function() {
    var $visualContainer = this._positionController.$visualContainer;
    var documentElement = dom_adapter_default.getDocumentElement();
    var isVisualContainerWindow = isWindow($visualContainer.get(0));
    var wrapperWidth = isVisualContainerWindow ? documentElement.clientWidth : getOuterWidth($visualContainer);
    var wrapperHeight = isVisualContainerWindow ? window8.innerHeight : getOuterHeight($visualContainer);
    this._$wrapper.css({
      width: wrapperWidth,
      height: wrapperHeight
    });
  },
  _renderDimensions: function() {
    var content = this._$content.get(0);
    this._$content.css({
      minWidth: this._getOptionValue("minWidth", content),
      maxWidth: this._getOptionValue("maxWidth", content),
      minHeight: this._getOptionValue("minHeight", content),
      maxHeight: this._getOptionValue("maxHeight", content),
      width: this._getOptionValue("width", content),
      height: this._getOptionValue("height", content)
    });
  },
  _focusTarget: function() {
    return this._$content;
  },
  _attachKeyboardEvents: function() {
    this._keyboardListenerId = keyboard.on(this._$content, null, (opts) => this._keyboardHandler(opts));
  },
  _keyboardHandler: function(options) {
    var e = options.originalEvent;
    var $target = renderer_default(e.target);
    if ($target.is(this._$content) || !this.option("ignoreChildEvents")) {
      this.callBase(...arguments);
    }
  },
  _isVisible: function() {
    return this.option("visible");
  },
  _visibilityChanged: function(visible2) {
    if (visible2) {
      if (this.option("visible")) {
        this._renderVisibilityAnimate(visible2);
      }
    } else {
      this._renderVisibilityAnimate(visible2);
    }
  },
  _dimensionChanged: function() {
    this._renderGeometry();
  },
  _clean: function() {
    var options = this.option();
    if (!this._contentAlreadyRendered && !options.isRenovated) {
      this.$content().empty();
    }
    this._renderVisibility(false);
    this._stopShowTimer();
    this._cleanFocusState();
  },
  _stopShowTimer() {
    if (this._asyncShowTimeout) {
      clearTimeout(this._asyncShowTimeout);
    }
    this._asyncShowTimeout = null;
  },
  _dispose: function() {
    fx_default.stop(this._$content, false);
    clearTimeout(this._deferShowTimer);
    this._toggleViewPortSubscription(false);
    this._toggleSubscriptions(false);
    this._updateZIndexStackPosition(false);
    this._toggleTabTerminator(false);
    this._actions = null;
    this._parentsScrollSubscriptionInfo = null;
    this.callBase();
    this._toggleSafariScrolling();
    this.option("visible") && remove(this._zIndex);
    this._$wrapper.remove();
    this._$content.remove();
  },
  _toggleRTLDirection: function(rtl) {
    this._$content.toggleClass(RTL_DIRECTION_CLASS, rtl);
  },
  _optionChanged: function(args) {
    var {
      value: value2,
      name
    } = args;
    if (this._getActionsList().includes(name)) {
      this._initActions();
      return;
    }
    switch (name) {
      case "animation":
        break;
      case "shading":
        this._toggleShading(this.option("visible"));
        this._toggleSafariScrolling();
        break;
      case "shadingColor":
        this._toggleShading(this.option("visible"));
        break;
      case "width":
      case "height":
        this._renderGeometry();
        break;
      case "minWidth":
      case "maxWidth":
      case "minHeight":
      case "maxHeight":
        this._renderGeometry();
        break;
      case "position":
        this._positionController.updatePosition(this.option("position"));
        this._positionController.restorePositionOnNextRender(true);
        this._renderGeometry();
        this._toggleSafariScrolling();
        break;
      case "visible":
        this._renderVisibilityAnimate(value2).done(() => {
          var _this$_animateDeferre;
          return null === (_this$_animateDeferre = this._animateDeferred) || void 0 === _this$_animateDeferre ? void 0 : _this$_animateDeferre.resolveWith(this);
        }).fail(() => {
          var _this$_animateDeferre2;
          return null === (_this$_animateDeferre2 = this._animateDeferred) || void 0 === _this$_animateDeferre2 ? void 0 : _this$_animateDeferre2.reject();
        });
        break;
      case "container":
        this._positionController.updateContainer(value2);
        this._invalidate();
        this._toggleSafariScrolling();
        break;
      case "visualContainer":
        this._positionController.updateVisualContainer(value2);
        this._renderWrapper();
        this._toggleSafariScrolling();
        break;
      case "innerOverlay":
        this._initInnerOverlayClass();
        break;
      case "deferRendering":
      case "contentTemplate":
        this._contentAlreadyRendered = false;
        this._clean();
        this._invalidate();
        break;
      case "hideTopOverlayHandler":
        this._toggleHideTopOverlayCallback(false);
        this._initHideTopOverlayHandler(value2);
        this._toggleHideTopOverlayCallback(this.option("visible"));
        break;
      case "hideOnParentScroll":
        this._toggleHideOnParentsScrollSubscription(this.option("visible"));
        break;
      case "closeOnOutsideClick":
      case "hideOnOutsideClick":
      case "propagateOutsideClick":
        break;
      case "rtlEnabled":
        this._contentAlreadyRendered = false;
        this.callBase(args);
        break;
      case "_fixWrapperPosition":
        this._positionController.fixWrapperPosition = value2;
        break;
      case "wrapperAttr":
        this._renderWrapperAttributes();
        break;
      case "restorePosition":
        this._positionController.restorePosition = value2;
        break;
      case "preventScrollEvents":
        this._logDeprecatedPreventScrollEventsInfo();
        this._toggleWrapperScrollEventsSubscription(value2);
        break;
      default:
        this.callBase(args);
    }
  },
  toggle: function(showing) {
    showing = void 0 === showing ? !this.option("visible") : showing;
    var result = new Deferred();
    if (showing === this.option("visible")) {
      return result.resolveWith(this, [showing]).promise();
    }
    var animateDeferred = new Deferred();
    this._animateDeferred = animateDeferred;
    this.option("visible", showing);
    animateDeferred.promise().done(() => {
      delete this._animateDeferred;
      result.resolveWith(this, [this.option("visible")]);
    }).fail(() => {
      delete this._animateDeferred;
      result.reject();
    });
    return result.promise();
  },
  $content: function() {
    return this._$content;
  },
  show: function() {
    return this.toggle(true);
  },
  hide: function() {
    return this.toggle(false);
  },
  content: function() {
    return getPublicElement(this._$content);
  },
  repaint: function() {
    if (this._contentAlreadyRendered) {
      this._positionController.restorePositionOnNextRender(true);
      this._renderGeometry({
        forceStopAnimation: true
      });
      triggerResizeEvent(this._$content);
    } else {
      this.callBase();
    }
  }
});
Overlay.baseZIndex = (zIndex) => base(zIndex);
component_registrator_default("dxOverlay", Overlay);
var ui_overlay_default = Overlay;

// node_modules/devextreme/esm/ui/themes_callback.js
var themeReadyCallback = callbacks_default();

// node_modules/devextreme/esm/ui/themes.js
var window9 = getWindow();
var ready4 = ready_callbacks_default.add;
var viewPort = value;
var viewPortChanged2 = changeCallback;
var initDeferred = new Deferred();
var DX_LINK_SELECTOR = "link[rel=dx-theme]";
var THEME_ATTR = "data-theme";
var ACTIVE_ATTR = "data-active";
var DX_HAIRLINES_CLASS = "dx-hairlines";
var ANY_THEME = "any";
var context;
var $activeThemeLink;
var knownThemes;
var currentThemeName;
var pendingThemeName;
var defaultTimeout = 15e3;
var THEME_MARKER_PREFIX = "dx.";
function readThemeMarker() {
  if (!hasWindow()) {
    return null;
  }
  var element = renderer_default("<div>", context).addClass("dx-theme-marker").appendTo(context.documentElement);
  var result;
  try {
    result = window9.getComputedStyle(element.get(0)).fontFamily;
    if (!result) {
      return null;
    }
    result = result.replace(/["']/g, "");
    if (result.substr(0, THEME_MARKER_PREFIX.length) !== THEME_MARKER_PREFIX) {
      return null;
    }
    return result.substr(THEME_MARKER_PREFIX.length);
  } finally {
    element.remove();
  }
}
function waitForThemeLoad(themeName) {
  var waitStartTime;
  var timerId;
  var intervalCleared = true;
  pendingThemeName = themeName;
  function handleLoaded() {
    pendingThemeName = null;
    clearInterval(timerId);
    intervalCleared = true;
    themeReadyCallback.fire();
    themeReadyCallback.empty();
    initDeferred.resolve();
  }
  if (isPendingThemeLoaded() || !defaultTimeout) {
    handleLoaded();
  } else {
    if (!intervalCleared) {
      if (pendingThemeName) {
        pendingThemeName = themeName;
      }
      return;
    }
    waitStartTime = Date.now();
    intervalCleared = false;
    timerId = setInterval(function() {
      var isLoaded = isPendingThemeLoaded();
      var isTimeout = !isLoaded && Date.now() - waitStartTime > defaultTimeout;
      if (isTimeout) {
        ui_errors_default.log("W0004", pendingThemeName);
      }
      if (isLoaded || isTimeout) {
        handleLoaded();
      }
    }, 10);
  }
}
function isPendingThemeLoaded() {
  if (!pendingThemeName) {
    return true;
  }
  var anyThemePending = pendingThemeName === ANY_THEME;
  if ("resolved" === initDeferred.state() && anyThemePending) {
    return true;
  }
  var themeMarker = readThemeMarker();
  if (themeMarker && anyThemePending) {
    return true;
  }
  return themeMarker === pendingThemeName;
}
function processMarkup() {
  var $allThemeLinks = renderer_default(DX_LINK_SELECTOR, context);
  if (!$allThemeLinks.length) {
    return;
  }
  knownThemes = {};
  $activeThemeLink = renderer_default(parseHTML("<link rel=stylesheet>"), context);
  $allThemeLinks.each(function() {
    var link = renderer_default(this, context);
    var fullThemeName = link.attr(THEME_ATTR);
    var url = link.attr("href");
    var isActive = "true" === link.attr(ACTIVE_ATTR);
    knownThemes[fullThemeName] = {
      url,
      isActive
    };
  });
  $allThemeLinks.last().after($activeThemeLink);
  $allThemeLinks.remove();
}
function resolveFullThemeName(desiredThemeName) {
  var desiredThemeParts = desiredThemeName ? desiredThemeName.split(".") : [];
  var result = null;
  if (knownThemes) {
    if (desiredThemeName in knownThemes) {
      return desiredThemeName;
    }
    each(knownThemes, function(knownThemeName, themeData) {
      var knownThemeParts = knownThemeName.split(".");
      if (desiredThemeParts[0] && knownThemeParts[0] !== desiredThemeParts[0]) {
        return;
      }
      if (desiredThemeParts[1] && desiredThemeParts[1] !== knownThemeParts[1]) {
        return;
      }
      if (desiredThemeParts[2] && desiredThemeParts[2] !== knownThemeParts[2]) {
        return;
      }
      if (!result || themeData.isActive) {
        result = knownThemeName;
      }
      if (themeData.isActive) {
        return false;
      }
    });
  }
  return result;
}
function initContext(newContext) {
  try {
    if (newContext !== context) {
      knownThemes = null;
    }
  } catch (x) {
    knownThemes = null;
  }
  context = newContext;
}
function init(options) {
  options = options || {};
  initContext(options.context || dom_adapter_default.getDocument());
  if (!context) {
    return;
  }
  processMarkup();
  currentThemeName = void 0;
  current(options);
}
function current(options) {
  if (!arguments.length) {
    currentThemeName = currentThemeName || readThemeMarker();
    return currentThemeName;
  }
  detachCssClasses(viewPort());
  options = options || {};
  if ("string" === typeof options) {
    options = {
      theme: options
    };
  }
  var isAutoInit = options._autoInit;
  var loadCallback = options.loadCallback;
  var currentThemeData;
  currentThemeName = resolveFullThemeName(options.theme || currentThemeName);
  if (currentThemeName) {
    currentThemeData = knownThemes[currentThemeName];
  }
  if (loadCallback) {
    themeReadyCallback.add(loadCallback);
  }
  if (currentThemeData) {
    $activeThemeLink.attr("href", knownThemes[currentThemeName].url);
    if (themeReadyCallback.has() || "resolved" !== initDeferred.state() || options._forceTimeout) {
      waitForThemeLoad(currentThemeName);
    }
  } else if (isAutoInit) {
    if (hasWindow()) {
      waitForThemeLoad(ANY_THEME);
    }
    themeReadyCallback.fire();
    themeReadyCallback.empty();
  } else {
    throw ui_errors_default.Error("E0021", currentThemeName);
  }
  initDeferred.done(() => attachCssClasses(originalViewPort(), currentThemeName));
}
function getCssClasses(themeName) {
  themeName = themeName || current();
  var result = [];
  var themeNameParts = themeName && themeName.split(".");
  if (themeNameParts) {
    result.push("dx-theme-" + themeNameParts[0], "dx-theme-" + themeNameParts[0] + "-typography");
    if (themeNameParts.length > 1) {
      result.push("dx-color-scheme-" + themeNameParts[1] + (isMaterialBased(themeName) ? "-" + themeNameParts[2] : ""));
    }
  }
  return result;
}
var themeClasses;
function attachCssClasses(element, themeName) {
  themeClasses = getCssClasses(themeName).join(" ");
  renderer_default(element).addClass(themeClasses);
  !function() {
    var pixelRatio = hasWindow() && window9.devicePixelRatio;
    if (!pixelRatio || pixelRatio < 2) {
      return;
    }
    var $tester = renderer_default("<div>");
    $tester.css("border", ".5px solid transparent");
    renderer_default("body").append($tester);
    if (1 === getOuterHeight($tester)) {
      renderer_default(element).addClass(DX_HAIRLINES_CLASS);
      themeClasses += " " + DX_HAIRLINES_CLASS;
    }
    $tester.remove();
  }();
}
function detachCssClasses(element) {
  renderer_default(element).removeClass(themeClasses);
}
function isTheme(themeRegExp, themeName) {
  if (!themeName) {
    themeName = currentThemeName || readThemeMarker();
  }
  return new RegExp(themeRegExp).test(themeName);
}
function isMaterialBased(themeName) {
  return isMaterial(themeName) || isFluent(themeName);
}
function isMaterial(themeName) {
  return isTheme("material", themeName);
}
function isFluent(themeName) {
  return isTheme("fluent", themeName);
}
function isGeneric(themeName) {
  return isTheme("generic", themeName);
}
function isCompact(themeName) {
  return isTheme("compact", themeName);
}
function isWebFontLoaded(text, fontWeight) {
  var document = dom_adapter_default.getDocument();
  var testElement = document.createElement("span");
  testElement.style.position = "absolute";
  testElement.style.top = "-9999px";
  testElement.style.left = "-9999px";
  testElement.style.visibility = "hidden";
  testElement.style.fontFamily = "Arial";
  testElement.style.fontSize = "250px";
  testElement.style.fontWeight = fontWeight;
  testElement.innerHTML = text;
  document.body.appendChild(testElement);
  var etalonFontWidth = testElement.offsetWidth;
  testElement.style.fontFamily = "Roboto, RobotoFallback, Arial";
  var testedFontWidth = testElement.offsetWidth;
  testElement.parentNode.removeChild(testElement);
  return etalonFontWidth !== testedFontWidth;
}
function waitWebFont(text, fontWeight) {
  return new Promise((resolve) => {
    var clear = () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      resolve();
    };
    var intervalId = setInterval(() => {
      if (isWebFontLoaded(text, fontWeight)) {
        clear();
      }
    }, 15);
    var timeoutId = setTimeout(clear, 2e3);
  });
}
function autoInit() {
  init({
    _autoInit: true,
    _forceTimeout: true
  });
  if (renderer_default(DX_LINK_SELECTOR, context).length) {
    throw ui_errors_default.Error("E0022");
  }
}
if (hasWindow()) {
  autoInit();
} else {
  ready4(autoInit);
}
viewPortChanged2.add(function(viewPort2, prevViewPort) {
  initDeferred.done(function() {
    detachCssClasses(prevViewPort);
    attachCssClasses(viewPort2);
  });
});
devices_default.changed.add(function() {
  init({
    _autoInit: true
  });
});

// node_modules/devextreme/esm/ui/toast/ui.toast.js
var ready5 = ready_callbacks_default.add;
var TOAST_CLASS = "dx-toast";
var TOAST_CLASS_PREFIX = TOAST_CLASS + "-";
var TOAST_WRAPPER_CLASS = TOAST_CLASS_PREFIX + "wrapper";
var TOAST_CONTENT_CLASS = TOAST_CLASS_PREFIX + "content";
var TOAST_MESSAGE_CLASS = TOAST_CLASS_PREFIX + "message";
var TOAST_ICON_CLASS = TOAST_CLASS_PREFIX + "icon";
var WIDGET_NAME = "dxToast";
var toastTypes = ["info", "warning", "error", "success"];
var TOAST_STACK = [];
var FIRST_Z_INDEX_OFFSET = 8e3;
var POSITION_ALIASES = {
  top: {
    my: "top",
    at: "top",
    of: null,
    offset: "0 0"
  },
  bottom: {
    my: "bottom",
    at: "bottom",
    of: null,
    offset: "0 -20"
  },
  center: {
    my: "center",
    at: "center",
    of: null,
    offset: "0 0"
  },
  right: {
    my: "center right",
    at: "center right",
    of: null,
    offset: "0 0"
  },
  left: {
    my: "center left",
    at: "center left",
    of: null,
    offset: "0 0"
  }
};
var DEFAULT_BOUNDARY_OFFSET = {
  h: 0,
  v: 0
};
var DEFAULT_MARGIN = 20;
ready5(function() {
  events_engine_default.subscribeGlobal(dom_adapter_default.getDocument(), pointer_default.down, function(e) {
    for (var i = TOAST_STACK.length - 1; i >= 0; i--) {
      if (!TOAST_STACK[i]._proxiedDocumentDownHandler(e)) {
        return;
      }
    }
  });
});
var Toast = ui_overlay_default.inherit({
  _getDefaultOptions: function() {
    return extend(this.callBase(), {
      message: "",
      type: "info",
      displayTime: 2e3,
      position: "bottom center",
      animation: {
        show: {
          type: "fade",
          duration: 400,
          from: 0,
          to: 1
        },
        hide: {
          type: "fade",
          duration: 400,
          from: 1,
          to: 0
        }
      },
      shading: false,
      height: "auto",
      hideTopOverlayHandler: null,
      preventScrollEvents: false,
      closeOnSwipe: true,
      closeOnClick: false
    });
  },
  _defaultOptionsRules: function() {
    var tabletAndMobileCommonOptions = {
      displayTime: isMaterialBased() ? 4e3 : 2e3,
      hideOnOutsideClick: true,
      animation: {
        show: {
          type: "fade",
          duration: 200,
          from: 0,
          to: 1
        },
        hide: {
          type: "fade",
          duration: 200,
          from: 1,
          to: 0
        }
      }
    };
    return this.callBase().concat([{
      device: (device) => "phone" === device.deviceType,
      options: _extends({
        width: "calc(100vw - ".concat(2 * DEFAULT_MARGIN, "px)")
      }, tabletAndMobileCommonOptions)
    }, {
      device: (device) => "tablet" === device.deviceType,
      options: _extends({
        width: "auto",
        maxWidth: "80vw"
      }, tabletAndMobileCommonOptions)
    }, {
      device: (device) => isMaterialBased() && "desktop" === device.deviceType,
      options: {
        minWidth: 344,
        maxWidth: 568,
        displayTime: 4e3
      }
    }]);
  },
  _init: function() {
    this.callBase();
    this._posStringToObject();
  },
  _renderContentImpl: function() {
    this._message = renderer_default("<div>").addClass(TOAST_MESSAGE_CLASS).text(this.option("message")).appendTo(this.$content());
    this.setAria("role", "alert", this._message);
    if (toastTypes.includes(this.option("type").toLowerCase())) {
      this.$content().prepend(renderer_default("<div>").addClass(TOAST_ICON_CLASS));
    }
    this.callBase();
  },
  _render: function() {
    this.callBase();
    this.$element().addClass(TOAST_CLASS);
    this.$wrapper().addClass(TOAST_WRAPPER_CLASS);
    this.$content().addClass(TOAST_CLASS_PREFIX + String(this.option("type")).toLowerCase());
    this.$content().addClass(TOAST_CONTENT_CLASS);
    this._toggleCloseEvents("Swipe");
    this._toggleCloseEvents("Click");
  },
  _toggleCloseEvents: function(event) {
    var dxEvent = "dx" + event.toLowerCase();
    events_engine_default.off(this.$content(), dxEvent);
    this.option("closeOn" + event) && events_engine_default.on(this.$content(), dxEvent, this.hide.bind(this));
  },
  _posStringToObject: function() {
    if (!isString(this.option("position"))) {
      return;
    }
    var verticalPosition = this.option("position").split(" ")[0];
    var horizontalPosition = this.option("position").split(" ")[1];
    this.option("position", extend({
      boundaryOffset: DEFAULT_BOUNDARY_OFFSET
    }, POSITION_ALIASES[verticalPosition]));
    switch (horizontalPosition) {
      case "center":
      case "left":
      case "right":
        this.option("position").at += " " + horizontalPosition;
        this.option("position").my += " " + horizontalPosition;
    }
  },
  _show: function() {
    return this.callBase.apply(this, arguments).always((function() {
      clearTimeout(this._hideTimeout);
      this._hideTimeout = setTimeout(this.hide.bind(this), this.option("displayTime"));
    }).bind(this));
  },
  _overlayStack: function() {
    return TOAST_STACK;
  },
  _zIndexInitValue: function() {
    return this.callBase() + FIRST_Z_INDEX_OFFSET;
  },
  _dispose: function() {
    clearTimeout(this._hideTimeout);
    this.callBase();
  },
  _optionChanged: function(args) {
    switch (args.name) {
      case "type":
        this.$content().removeClass(TOAST_CLASS_PREFIX + args.previousValue);
        this.$content().addClass(TOAST_CLASS_PREFIX + String(args.value).toLowerCase());
        break;
      case "message":
        if (this._message) {
          this._message.text(args.value);
        }
        break;
      case "closeOnSwipe":
        this._toggleCloseEvents("Swipe");
        break;
      case "closeOnClick":
        this._toggleCloseEvents("Click");
        break;
      case "displayTime":
        break;
      default:
        this.callBase(args);
    }
  }
});
component_registrator_default(WIDGET_NAME, Toast);
var ui_toast_default = Toast;

// node_modules/devextreme/esm/ui/toast.js
var toast_default = ui_toast_default;

// node_modules/devextreme/esm/ui/notify.js
var window10 = getWindow();
var $notify = null;
var $containers = {};
function notify(message, typeOrStack, displayTime) {
  var options = isPlainObject(message) ? message : {
    message
  };
  var stack = isPlainObject(typeOrStack) ? typeOrStack : void 0;
  var type2 = isPlainObject(typeOrStack) ? void 0 : typeOrStack;
  var {
    onHidden: userOnHidden
  } = options;
  if (null !== stack && void 0 !== stack && stack.position) {
    var {
      position: position2
    } = stack;
    var direction = stack.direction || getDefaultDirection(position2);
    var containerKey = isString(position2) ? position2 : "".concat(position2.top, "-").concat(position2.left, "-").concat(position2.bottom, "-").concat(position2.right);
    var {
      onShowing: userOnShowing
    } = options;
    var $container = getStackContainer(containerKey);
    setContainerClasses($container, direction);
    extend(options, {
      container: $container,
      onShowing: function(args) {
        setContainerStyles($container, direction, position2);
        null === userOnShowing || void 0 === userOnShowing ? void 0 : userOnShowing(args);
      }
    });
  }
  extend(options, {
    type: type2,
    displayTime,
    onHidden: function(args) {
      renderer_default(args.element).remove();
      null === userOnHidden || void 0 === userOnHidden ? void 0 : userOnHidden(args);
    }
  });
  $notify = renderer_default("<div>").appendTo(value());
  new toast_default($notify, options).show();
}
var getDefaultDirection = (position2) => isString(position2) && position2.includes("top") ? "down-push" : "up-push";
var createStackContainer = (key) => {
  var $container = renderer_default("<div>").appendTo(value());
  $containers[key] = $container;
  return $container;
};
var getStackContainer = (key) => {
  var $container = $containers[key];
  return $container ? $container : createStackContainer(key);
};
var setContainerClasses = (container, direction) => {
  var containerClasses = "dx-toast-stack dx-toast-stack-".concat(direction, "-direction");
  container.removeAttr("class").addClass(containerClasses);
};
var setContainerStyles = (container, direction, position2) => {
  var {
    offsetWidth: toastWidth,
    offsetHeight: toastHeight
  } = container.children().first().get(0);
  var dimensions = {
    toastWidth,
    toastHeight,
    windowHeight: window10.innerHeight,
    windowWidth: window10.innerWidth
  };
  var coordinates = isString(position2) ? getCoordinatesByAlias(position2, dimensions) : position2;
  var styles = getPositionStylesByCoordinates(direction, coordinates, dimensions);
  container.css(styles);
};
var getCoordinatesByAlias = (alias, _ref) => {
  var {
    toastWidth,
    toastHeight,
    windowHeight,
    windowWidth
  } = _ref;
  switch (alias) {
    case "top left":
      return {
        top: 10,
        left: 10
      };
    case "top right":
      return {
        top: 10,
        right: 10
      };
    case "bottom left":
      return {
        bottom: 10,
        left: 10
      };
    case "bottom right":
      return {
        bottom: 10,
        right: 10
      };
    case "top center":
      return {
        top: 10,
        left: Math.round(windowWidth / 2 - toastWidth / 2)
      };
    case "left center":
      return {
        top: Math.round(windowHeight / 2 - toastHeight / 2),
        left: 10
      };
    case "right center":
      return {
        top: Math.round(windowHeight / 2 - toastHeight / 2),
        right: 10
      };
    case "center":
      return {
        top: Math.round(windowHeight / 2 - toastHeight / 2),
        left: Math.round(windowWidth / 2 - toastWidth / 2)
      };
    case "bottom center":
    default:
      return {
        bottom: 10,
        left: Math.round(windowWidth / 2 - toastWidth / 2)
      };
  }
};
var getPositionStylesByCoordinates = (direction, coordinates, dimensions) => {
  var _coordinates$bottom, _coordinates$left, _coordinates$right, _coordinates$top, _coordinates$left2, _coordinates$right2, _coordinates$right3, _coordinates$top2, _coordinates$bottom2, _coordinates$left3, _coordinates$top3, _coordinates$bottom3;
  var {
    toastWidth,
    toastHeight,
    windowHeight,
    windowWidth
  } = dimensions;
  switch (direction.replace(/-push|-stack/g, "")) {
    case "up":
      return {
        bottom: null !== (_coordinates$bottom = coordinates.bottom) && void 0 !== _coordinates$bottom ? _coordinates$bottom : windowHeight - toastHeight - coordinates.top,
        top: "",
        left: null !== (_coordinates$left = coordinates.left) && void 0 !== _coordinates$left ? _coordinates$left : "",
        right: null !== (_coordinates$right = coordinates.right) && void 0 !== _coordinates$right ? _coordinates$right : ""
      };
    case "down":
      return {
        top: null !== (_coordinates$top = coordinates.top) && void 0 !== _coordinates$top ? _coordinates$top : windowHeight - toastHeight - coordinates.bottom,
        bottom: "",
        left: null !== (_coordinates$left2 = coordinates.left) && void 0 !== _coordinates$left2 ? _coordinates$left2 : "",
        right: null !== (_coordinates$right2 = coordinates.right) && void 0 !== _coordinates$right2 ? _coordinates$right2 : ""
      };
    case "left":
      return {
        right: null !== (_coordinates$right3 = coordinates.right) && void 0 !== _coordinates$right3 ? _coordinates$right3 : windowWidth - toastWidth - coordinates.left,
        left: "",
        top: null !== (_coordinates$top2 = coordinates.top) && void 0 !== _coordinates$top2 ? _coordinates$top2 : "",
        bottom: null !== (_coordinates$bottom2 = coordinates.bottom) && void 0 !== _coordinates$bottom2 ? _coordinates$bottom2 : ""
      };
    case "right":
      return {
        left: null !== (_coordinates$left3 = coordinates.left) && void 0 !== _coordinates$left3 ? _coordinates$left3 : windowWidth - toastWidth - coordinates.right,
        right: "",
        top: null !== (_coordinates$top3 = coordinates.top) && void 0 !== _coordinates$top3 ? _coordinates$top3 : "",
        bottom: null !== (_coordinates$bottom3 = coordinates.bottom) && void 0 !== _coordinates$bottom3 ? _coordinates$bottom3 : ""
      };
  }
};
var notify_default = notify;

export {
  getPublicElement,
  locate,
  move,
  resetPosition,
  requestAnimationFrame,
  cancelAnimationFrame,
  resize_callbacks_default,
  EventsStrategy,
  getSessionStorage,
  value,
  originalViewPort,
  devices_default,
  inputType,
  touchEvents,
  pointerEvents,
  touch,
  animation,
  nativeScrolling,
  getDefaultAlignment,
  getBoundingRect,
  browser_default,
  position_default,
  event_registrator_default,
  removeEvent,
  focusable,
  tabbable,
  focused,
  isPointerEvent,
  isMouseEvent,
  isDxMouseWheelEvent,
  isTouchEvent,
  isFakeClickEvent,
  eventData,
  eventDelta,
  hasTouches,
  needSkipEvent,
  createEvent,
  fireEvent,
  normalizeKeyName,
  getChar,
  addNamespace2 as addNamespace,
  isCommandKeyPressed,
  fx_default,
  resetActiveElement,
  closestCommonParent,
  clipboardText,
  contains,
  createTextElementHiddenCopy,
  replaceWith,
  isElementInDom,
  pointer_default,
  emitter_default,
  EVENT_NAME,
  emitter_registrator_default,
  CLICK_EVENT_NAME,
  getName,
  attachInstanceToElement,
  getInstanceByElement,
  component_registrator_default,
  triggerShownEvent,
  triggerResizeEvent,
  TemplateBase,
  ChildDefaultTemplate,
  EmptyTemplate,
  wrapToArray,
  getUniqueValues,
  getIntersection,
  removeDuplicates,
  normalizeIndexes,
  findTemplates,
  Action,
  equals,
  convertRulesToOptions,
  normalizeOptions,
  getFieldName,
  createDefaultOptionRules,
  Component,
  FunctionTemplate,
  keyboard_processor_default,
  resize,
  visibility,
  focus,
  dxClick,
  click,
  keyboard,
  dom_component_default,
  compare,
  ACTIVE_EVENT_NAME,
  lock,
  HOVERSTART,
  HOVEREND,
  ui_widget_default,
  ui_errors_default,
  current,
  isMaterialBased,
  isMaterial,
  isFluent,
  isGeneric,
  isCompact,
  waitWebFont,
  sign,
  fitIntoRange,
  inRange,
  getExponent,
  multiplyInExponentialForm,
  adjust,
  getPrecision,
  solveCubicEquation,
  trunc,
  getRemainderByDivision,
  getExponentLength,
  roundFloatPart,
  emitter_gesture_default,
  DRAG_START_EVENT,
  DRAG_EVENT,
  DRAG_END_EVENT,
  DRAG_ENTER_EVENT,
  DRAG_LEAVE_EVENT,
  DROP_EVENT,
  create,
  remove,
  isLastZIndexInStack,
  swatch_container_default,
  OverlayPositionController,
  ui_overlay_default,
  toast_default,
  notify_default
};
//# sourceMappingURL=chunk-AHUHWHEV.js.map
