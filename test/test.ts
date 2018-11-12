import { expect, tap } from '@pushrocks/tapbundle';
import * as csvFidor from '../ts/index';

let testCsvFidorInstance: csvFidor.CsvFidor;

tap.test('first test', async () => {
  testCsvFidorInstance = await csvFidor.CsvFidor.fromDirectory('./.nogit/');
  expect(testCsvFidorInstance).to.be.instanceof(csvFidor.CsvFidor);
  console.log(testCsvFidorInstance.transactions);
});

tap.start();
