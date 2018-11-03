import { expect, tap } from '@pushrocks/tapbundle';
import * as csv-fidor from '../ts/index'

tap.test('first test', async () => {
  console.log(csv-fidor.standardExport)
})

tap.start()
