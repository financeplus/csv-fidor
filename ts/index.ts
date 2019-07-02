import * as plugins from './csv-fidor.plugins';

import { ExtendedDate } from '@pushrocks/smarttime';

import * as interfaces from './interfaces';

export class CsvFidor {
  /**
   * creates a parsed transaction object from string
   */
  public static async fromString(csvStringArg: string) {
    const csvInstance = new plugins.smartcsv.Csv(csvStringArg, {
      headers: true
    });

    const transactionArray: any[] = (await csvInstance.exportAsObject()).map ((transaction: interfaces.IFidorOriginalTransaction): interfaces.IFidorTransaction => {
      const finalTransaction: interfaces.IFidorTransaction = {
        original: transaction,
        simpleTransaction: null,
        description: transaction.Beschreibung,
        description2: transaction.Beschreibung2,
        transactionDate: plugins.smarttime.ExtendedDate.fromEuropeanDate(transaction.Datum),
        amount: parseFloat(transaction.Wert.replace('.', '').replace(',', '.'))
      };

      // lets set the correct simpleTransaction
      finalTransaction.simpleTransaction = {
        id: null,
        accountId: null,
        amount: finalTransaction.amount,
        date: finalTransaction.transactionDate,
        description: finalTransaction.description,
      };

      return finalTransaction;
    });

    const csvFidorInstance = new CsvFidor(transactionArray);
    return csvFidorInstance;
  }

  /**
   * creates a parsed transaction object from file
   */
  public static fromFile() {

  }

  /**
   * creates a parsed transaction object from dierctory
   */
  public static async fromDir(dirPath: string) {
    const smartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirPath, '**/fidor*.csv');

    const mainCsvFidorInstance = new CsvFidor([]);

    for (const smartfile of smartfileArray) {
      const csvFidorInstance = await CsvFidor.fromString(smartfile.contentBuffer.toString());
      await mainCsvFidorInstance.concat(csvFidorInstance);
    }

    return mainCsvFidorInstance;
  }

  public transactionArray: interfaces.IFidorTransaction[];

  constructor(transactionArrayArg: interfaces.IFidorTransaction[]) {
    this.transactionArray = transactionArrayArg;
  }

  public async concat(csvFidorArg: CsvFidor): Promise<CsvFidor> {
    this.transactionArray = this.transactionArray.concat(csvFidorArg.transactionArray);
    return this;
  }
}
