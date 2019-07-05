import * as plugins from './csv-fidor.plugins';

import { ExtendedDate } from '@pushrocks/smarttime';

import * as interfaces from './interfaces';

export class CsvFidor {
  // STATIC
  /**
   * creates a parsed transaction object from string
   */
  public static async fromString(csvStringArg: string): Promise<CsvFidor> {
    const csvInstance = new plugins.smartcsv.Csv(csvStringArg, {
      headers: true
    });

    const originalTransactionArray: interfaces.IFidorOriginalTransaction[] = await csvInstance.exportAsObject();
    const transactionArray: interfaces.IFidorTransaction[] = [];
    for (const transaction of originalTransactionArray) {
      const finalTransaction: interfaces.IFidorTransaction = {
        original: transaction,
        simpleTransaction: null,
        transactionHash: null,
        description: transaction.Beschreibung,
        description2: transaction.Beschreibung2,
        transactionDate: plugins.smarttime.ExtendedDate.fromEuropeanDate(transaction.Datum),
        amount: parseFloat(transaction.Wert.replace('.', '').replace(',', '.'))
      };

      // lets assign a transactionHash
      finalTransaction.transactionHash = await plugins.smarthash.sha265FromObject({
        amount: finalTransaction.amount,
        description: finalTransaction.description,
        description2: finalTransaction.description2,
        transactionDate: finalTransaction.transactionDate
      });

      // lets set the correct simpleTransaction
      finalTransaction.simpleTransaction = {
        id: finalTransaction.transactionHash,
        accountId: null,
        amount: finalTransaction.amount,
        date: finalTransaction.transactionDate,
        description: finalTransaction.description
      };
      transactionArray.push(finalTransaction);
    }

    const csvFidorInstance = new CsvFidor(transactionArray);
    return csvFidorInstance;
  }

  /**
   * creates a parsed transaction object from file
   */
  public static async fromFile(filePathArg: string): Promise<CsvFidor> {
    const fileString = plugins.smartfile.fs.toStringSync(filePathArg);
    return CsvFidor.fromString(fileString);
  }

  /**
   * creates a parsed transaction object from dierctory
   */
  public static async fromDir(dirPath: string): Promise<CsvFidor> {
    const smartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirPath, '**/fidor*.csv');

    const mainCsvFidorInstance = new CsvFidor([]);

    for (const smartfile of smartfileArray) {
      const csvFidorInstance = await CsvFidor.fromString(smartfile.contentBuffer.toString());
      await mainCsvFidorInstance.concat(csvFidorInstance);
    }

    return mainCsvFidorInstance;
  }

  /**
   * from Api
   */
  public static async fromApi(): Promise<CsvFidor> {
    // TODO implement
    throw new Error('not yet implemented');
    return new CsvFidor([]);
  }

  // INSTANCE
  public transactionArray: interfaces.IFidorTransaction[];

  constructor(transactionArrayArg: interfaces.IFidorTransaction[]) {
    this.transactionArray = transactionArrayArg;
  }

  /**
   * returns the transactions
   */
  public async getTransactions(): Promise<interfaces.IFidorTransaction[]> {
    return this.transactionArray;
  }

  public async concat(csvFidorArg: CsvFidor): Promise<CsvFidor> {
    this.transactionArray = this.transactionArray.concat(csvFidorArg.transactionArray);
    return this;
  }
}
