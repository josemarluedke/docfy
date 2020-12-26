// Inspired by https://github.com/emberjs/rfcs/pull/678

import Component from '@glimmer/component';

/**
 * @typedef {object} BlogPostArgs
 * @property {object} post
 * @property {string} post.title
 * @property {string} post.author
 * @property {string} post.body
 */

/**
 * @extends {Component<BlogPostArgs>}
 */
export default class BlogPostComponent extends Component {}
