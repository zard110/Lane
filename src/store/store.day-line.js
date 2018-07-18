import Store from './index'

import {
  simpleStockDayProvider,
} from "../api/mockstock";

import {
  formatDay
} from "../utils/time";

const MOCK_API = simpleStockDayProvider(new Date(), 100)
const ONE_DAY = '1D'

/**
 * 日线 Store
 */
export default class StoreDayLine extends Store {
  constructor(options = {}) {
    options.type = options.type || ONE_DAY
    super(options)
    this.API = options.API || MOCK_API
  }

  parseIndex(obj) {
    if (!obj) {
      return
    }

    if (typeof obj === 'string') {
      return obj
    }

    // date => '2018-07-17'
    return formatDay(obj instanceof Date ? obj : obj.date)
  }
}

StoreDayLine.Type = ONE_DAY
