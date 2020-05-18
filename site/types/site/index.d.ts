import Ember from 'ember';

declare global {
  type Array<T> = Ember.ArrayPrototypeExtensions<T>;
  // interface Function extends Ember.FunctionPrototypeExtensions {}
}

export {};
