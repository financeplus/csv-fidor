import * as plugins from './csv-fidor.plugins';

import { ExtendedDate } from '@pushrocks/smarttime';

export interface IFidorTransaction {
  Datum: ExtendedDate;
  Beschreibung: string;
  Beschreibung2: string;
  Wert: number;
}

export class CsvFidor {
  /**
   * creates a parsed transaction object from string
   */
  static fromString() {}

  /**
   * creates a parsed transaction object from file
   */
  static fromFile() {}

  /**
   * creates a parsed transaction object from dierctory
   */
  static async fromDirectory(dirPath: string) {
    const smartfileArray = await plugins.smartfile.fs.fileTreeToObject(dirPath, '**/*.csv');
    console.log(smartfileArray);

    for (const smartfile of smartfileArray) {
      const csvFidor = new CsvFidor(smartfile.contentBuffer.toString());
      csvFidor
    }

    const csvFidor = new CsvFidor('');
    return csvFidor;
  }

  constructor(csvStringArg: string) {
    const csvInstance = new plugins.smartcsv.Csv(csvStringArg, {
      headers: true
    });
    csvInstance
    
  }
}