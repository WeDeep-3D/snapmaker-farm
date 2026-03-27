import packageJson from 'package.json'

import { deviceModel } from '@/database/schema'

export const BINDING_FILENAME = `.${packageJson.name}_binding`

/**
 * Maps firmware-reported machine_type values to database device_model enum values.
 *
 * Firmware reports model names differently from how they are stored in the DB.
 * For example, firmware returns `'Snapmaker U1'` (space-separated) while the
 * DB enum uses `'Snapmaker:U1'` (colon-separated).
 */
const MACHINE_TYPE_TO_DEVICE_MODEL: Record<
  string,
  (typeof deviceModel.enumValues)[number]
> = {
  'Snapmaker U1': 'Snapmaker:U1',
}

/**
 * Resolves a firmware machine_type string to the corresponding DB device_model enum value.
 *
 * Returns `undefined` if the machine_type has no known mapping.
 */
export const resolveDeviceModel = (
  machineType: string,
): (typeof deviceModel.enumValues)[number] | undefined => {
  return MACHINE_TYPE_TO_DEVICE_MODEL[machineType]
}
