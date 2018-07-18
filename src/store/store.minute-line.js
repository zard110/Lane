import Store from './index'

import {
  simpleStockDayTimeProvider
} from "../api/mockstock";

import {formatDayHourMinute} from "../utils/time";

const Mock_API = simpleStockDayTimeProvider(new Date(), 10, ['09:30', '11:30'], ['13:01', '15:00'])
const ONE_MINUTE = '1m'

/**
 * 日线 Store
 */
export default class StoreMinuteLine extends Store {
  constructor(options = {}) {
    options.type = options.type || ONE_MINUTE
    super(options)
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
StoreMinuteLine.Type = ONE_MINUTE
