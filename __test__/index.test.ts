import { expect, test } from 'vitest'
import { scan } from '../src/index'

test('test', async () => {
  const items = await scan({
    table: 'test-table',
    filter: 'ID = :v1',
    expressionAttributeValues: { ':v1': { N: '10' }}
  });
  expect(items).not.toBeUndefined();
  console.log(JSON.stringify(items));
})