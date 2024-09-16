// Copyright (c) 2017 Florian Klampfer
// Licensed under MIT

import paramCase from 'param-case';

// infers primitive types form `defVal` and applies it to `val`
export function simpleType(defVal, val) {
  if (typeof defVal === 'boolean') {
    return val != null;
  } else if (typeof defVal === 'number') {
    if (val != null) {
      return Number(val);
    }
    return defVal;
  } else if (typeof defVal === 'object') {
    if (val != null) {
      return val.split ? val.split(',') : [];
    }
    return defVal;
  } else if (typeof defVal === 'string') {
    if (val != null) {
      return val;
    }
    return defVal;
  }
  return null;
}

export function setAttribute(key, value) {
  const attrName = paramCase(key);

  if (value === true) {
    this.setAttribute(attrName, '');
  } else if (value === false ||
             value === null ||
             (typeof value === 'object' && value.length === 0)) {
    this.removeAttribute(attrName);
  } else if (typeof value === 'object' && value.length > 0 && value.join) {
    this.setAttribute(attrName, value.join(','));
  } else {
    this.setAttribute(attrName, value);
  }
}
