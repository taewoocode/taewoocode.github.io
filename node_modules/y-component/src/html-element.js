// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

import camelCase from 'camel-case';
import paramCase from 'param-case';

import { simpleType, setAttribute } from './common';

// const setImmediate = window.setImmediate || (f => setTimeout(f, 0));

function getStateFromAttributes() {
  const defaults = this.defaults();

  const state = {};

  Object.keys(defaults).forEach((key) => {
    const attrName = paramCase(key);
    const attrVal = this.getAttribute(attrName);
    const typedValue = simpleType(defaults[key], attrVal);

    if (typedValue != null) {
      state[key] = typedValue;
    }
  });

  return state;
}

function reflectAttributeChanges() {
  const defaults = this.constructor.DEFAULTS;
  Object.keys(defaults).forEach(key => setAttribute.call(this, key, this[key]));
}

export default C => class extends C {
  // @override
  connectedCallback() {
    this.createdOrConnectedCallback();
  }

  // @override
  createdCallback() {
    this.createdOrConnectedCallback();
  }

  createdOrConnectedCallback() {
    this.setupComponent();
    this.fireEvent('attached');
  }

  setupComponent() {
    super.setupComponent(this, getStateFromAttributes.call(this));
    reflectAttributeChanges.call(this);
    return this;
  }

  // @override
  attributeChangedCallback(attr, oldVal, val) {
    const defaults = this.defaults();
    const key = camelCase(attr);
    const typedValue = simpleType(defaults[key], val);

    if (typedValue != null) {
      this[key] = typedValue;
    }
  }

  // @override
  setStateKV(key, value) {
    const oldVal = this[key];
    super.setStateKV(key, value);
    if (value !== oldVal) {
      setAttribute.call(this, key, value);
    }
  }

  getTemplateInstance(version) {
    return document
      .querySelector(`link[href$="${this.componentName}.html"]`)
      .import
      .getElementById(`${this.componentName}-template-${version}`)
      .content
      .cloneNode(true);
  }

  // @override
  setupDOM(el) {
    if ('attachShadow' in document.body) {
      el.attachShadow({ mode: 'open' });
      const instance = this.getTemplateInstance('v1');
      el.shadowRoot.appendChild(instance);
      return el.shadowRoot;
    } else if ('createShadowRoot' in document.body) {
      const shadowRoot = el.createShadowRoot();
      const instance = this.getTemplateInstance('v0');
      shadowRoot.appendChild(instance);
      return shadowRoot;
    }
    throw Error('ShadowDOM API not supported (neither v0 nor v1)');
  }

  // @override
  getEl() {
    return this;
  }
};
