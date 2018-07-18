import Store from './store.day-line'
import MultiMixin from './mixins/multi.mixin'

const DayCounts = {
  W: 7,
  M: 30,
  S: 120,
  Y: 365,
}

export default class StoreDayLineMulti extends Store {
  constructor(options) {
    super(options)

    // 添加处理多Store的方法
    Object.assign(this, MultiMixin)
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

    if (store.type !== Store.Type) {
      throw new Error(`单日type必须为 ${Store.Type}`)
    }

    this._attachStoreEvent(store)

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