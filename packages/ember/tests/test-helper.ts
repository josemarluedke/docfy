/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Application from '../app';
// @ts-ignore
import config from '../config/environment';
import QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import 'qunit-dom';

// @ts-ignore
setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
