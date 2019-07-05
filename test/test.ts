// tslint:disable-next-line: no-implicit-dependencies
import { expect, tap } from '@pushrocks/tapbundle';
import * as csvFidor from '../ts/index';

let testCsvFidorInstance: csvFidor.CsvFidor;

tap.test('first test', async () => {
  if (!process.env.CI) {
    testCsvFidorInstance = await csvFidor.CsvFidor.fromDir('./.nogit/');
    expect(testCsvFidorInstance).to.be.instanceof(csvFidor.CsvFidor);
    console.log(testCsvFidorInstance.transactionArray);
  }
});

tap.start();
