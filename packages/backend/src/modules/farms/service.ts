import { buildSuccessResponse } from '@/utils/common'

import { getOrCreateFarm } from './repository'

export abstract class Farms {
  /**
   * Get the farm record, creating one if it does not exist.
   */
  static async getFarm() {
    return buildSuccessResponse(await getOrCreateFarm())
  }
}
