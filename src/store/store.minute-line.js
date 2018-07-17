import Store from './index'

import {
  simpleStockDayTimeProvider
} from "../api/mockstock";

import {formatDayHourMinute} from "../utils/time";

const Mock_API = simpleStockDayTimeProvider(new Date(), 10)

/**
 * 日线 Store
 */
export default class StoreMinuteLine extends Store {
  constructor(code, options = {}) {
    super(code, '1m', options)

    this.API = options.API || Mock_API
  }

  parseIndex(obj) {
    if (!obj) {
      return
    }

    if (typeof obj === 'string') {
      return obj
    }

    // date => '2018-07-17 14:22'
    return formatDayHourMinute(obj instanceof Date ? obj : obj.date)
  }
}
