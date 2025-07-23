import Application from 'test-app-vite/app';
import config from 'test-app-vite/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import 'qunit-dom';

interface Config {
  APP: Record<string, unknown>;
}

const typedConfig = config as Config;

export function start() {
  setApplication(Application.create(typedConfig.APP));

  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  qunitStart();
}
