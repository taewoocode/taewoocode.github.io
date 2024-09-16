// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

// const JS_FEATURES = [
//   'fn/array/for-each',
//   'fn/function/bind',
//   'fn/number/constructor',
//   'fn/object/assign',
//   'fn/object/define-property',
//   'fn/object/keys',
// ];

// const MODERNIZR_TESTS = [
//   'customevent',
// ];

class Mix {}

const Symbol = global.Symbol || (x => `_${x}`);

const def = Object.defineProperty.bind(Object);

const ROOT = Symbol('root');
const STATE = Symbol('state');

function createEvent(eventName, data = {}) {
  try {
    return new CustomEvent(eventName, data);
  } catch (e) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, data.detail);
    return event;
  }
}

function setupProperty(key, sideEffect) {
  def(this, key, {
    enumerable: true,
    get: () => this[STATE][key],
    set: (value) => {
      if (sideEffect != null) {
        sideEffect(value);
      } else {
        this.setState(key, value);
      }
    },
  });
}

// TODO: study how native elements deal with attributes/properites
function setupProperties() {
  const sideEffects = this.sideEffects();

  Object.keys(this[STATE]).forEach((key) => {
    if (typeof this[key] === 'undefined') {
      const sideEffect = sideEffects[key];
      setupProperty.call(this, key, sideEffect);
    }
  });
}

export default (C = Mix) => class extends C {
  get componentName() {
    return this.getComponentName();
  }

  getComponentName() {
    throw Error('Component needs to have a name, e.g. `my-tag`. Override `getComponentName`');
  }

  setupComponent(el, state) {
    def(this, STATE, { value: Object.assign({}, this.defaults(), state) });
    setupProperties.call(this);
    def(this, ROOT, { value: this.setupDOM(el) });
    return this;
  }

  setupDOM(el) {
    return el;
  }

  get root() {
    return this.getRoot();
  }

  get el() {
    return this.getEl();
  }

  getRoot() {
    return this[ROOT];
  }

  getEl() {
    return this[ROOT];
  }

  fireEvent(eventName, data) {
    const eventNameNS = `${this.componentName}-${eventName}`;
    this.el.dispatchEvent(createEvent(eventNameNS, data));
  }

  defaults() {
    // TODO: production builds with preprocess?
    console.warn('defaults not provided'); // eslint-disable-line no-console
    return {};
  }

  sideEffects() {
    // TODO: production builds with preprocess?
    console.warn('sideEffects not provided'); // eslint-disable-line no-console
    return {};
  }

  setState(keyOrMap, value) {
    if (typeof keyOrMap === 'string') {
      this.setStateKV(keyOrMap, value);
    } else if (typeof keyOrMap === 'object') {
      this.setStateMap(keyOrMap);
    } else {
      throw Error('setState needs argument');
    }
  }

  setStateKV(key, value) {
    this[STATE][key] = value;
  }

  setStateMap(map) {
    Object.keys(this[STATE]).forEach((key) => {
      this.setStateKV(key, map[key]);
    });
  }
};
