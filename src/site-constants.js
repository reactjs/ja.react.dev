/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @providesModule site-constants
 * @flow
 */

// NOTE: We can't just use `location.toString()` because when we are rendering
// the SSR part in node.js we won't have a proper location.
<<<<<<< HEAD
const urlRoot = 'https://reactjs.org';
const version = '16.13.1';
=======
const urlRoot = 'https://ja.reactjs.org';
const version = '16.13.0';
>>>>>>> ac4b5d74278df9484f640d83c9f136ecccf60fc4
const babelURL = 'https://unpkg.com/babel-standalone@6.26.0/babel.min.js';

export {babelURL, urlRoot, version};
