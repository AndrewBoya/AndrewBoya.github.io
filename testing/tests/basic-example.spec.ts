/*
  Demo: test ordinary Java/TypeScript
*/

import { test, expect } from '@playwright/test';

// all exports from main will now be available as main.X
import * as main from '../../mock/src/main';

test('is 1 + 1 = 2?', () => {
  expect(1 + 1).toBe(2)
})

test('main.zero() should return 0', () => {
  expect(main.zero()).toBe(0)
})