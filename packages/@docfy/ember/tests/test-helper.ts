/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Application from '../app';
// @ts-ignore
import config from '../config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import 'qunit-dom';

// @ts-ignore
setApplication(Application.create(config.APP));

start();
