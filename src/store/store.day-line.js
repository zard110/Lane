import Store from './index'

/**
 * 日线 Store
 */
export default class StoreDayLine extends Store {
  constructor(code, options) {
    super(code, '1d', options)
  }
}
