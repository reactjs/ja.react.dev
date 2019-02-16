/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://ja.reactjs.org';
const version = '16.8.1';
=======
const urlRoot = 'https://reactjs.org';
const version = '16.8.2';
>>>>>>> 99e97c33ae1a12d65c872361250f3ac92b043f38
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {urlRoot, version, babelURL};
