/**
 * Public API for the devices module.
 *
 * Other modules should import from this file instead of
 * reaching into internal files like repository.ts or utils.ts directly.
 */
export { getDeviceByIdentity } from './repository'
export { checkBindingStatus } from './utils'
export type { BindingCheckResult, BindingStatus } from './utils'
