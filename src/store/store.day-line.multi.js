import Store from './store.day-line'

const DayCounts = {
  W: 7,
  M: 30,
  S: 120,
  Y: 365,
}

const OneDay = '1D'

export default class StoreDayLineMulti extends Store {
  constructor(options) {
    super(options)
  }

  /**
   * 初始化
   * @private
   */
  _initialize() {
    const options = this.options
    this.parseStore(options.store)
    this.parsePeriod(options.type)
    this.loading = true
    const store = options.store
    return store.done()
      .then(() => {
        this.loading = false
        this.isFinished = store.isFinished
      })
  }

  _fetch(time, count) {
    time = this.parseIndex(time)
    const store = this.store

    const result = store.loadMore(time, this.getDayCount(count))

    if (result.length) {
      this._merge(result, true, false)
    }

    return result
  }

  getDayCount(count) {
    // 需要的数据条数 × 单位条数 × 单位对应的天数
    return count * this.count * DayCounts[this.unit]
  }

  parseStore(store) {
    if (!store) {
      throw new Error('多日的Store依赖于单日的Store')
    }

    if (store.code !== this.code) {
      throw new Error(`单日code: ${store.code} 和本身code: ${this.code} 不相等`)
    }

    if (store.type !== OneDay) {
      throw new Error(`单日type必须为 ${OneDay}`)
    }

    store.on(`update.store_${this.id}`, ({data, isFinished}) => {
      this.isFinished = isFinished

      if (data.length) {
        this._merge(data, true, false)
      }
    })

    this.store = store
  }

  parsePeriod(period) {
    const count = parseInt(period)
    const unit = period.replace(count, '')

    if (isNaN(count) || !DayCounts[unit]) {
      throw new Error(`${period} 不是一个正确的周期（1W 1M 1S 1Y）`)
    }

    this.count = count
    this.unit = unit
  }
}
