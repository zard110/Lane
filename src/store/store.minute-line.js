import Store from './index'

/**
 * 日线 Store
 */
export class StoreMinuteLine extends Store {
  constructor(code, options) {
    super(code, '1m', options)
  }
}
