import Store from './store.minute-line'
import MultiMixin from './mixins/multi.mixin'

const MinuteCounts = {
  m: 1,
}

export default class StoreDayLineMulti extends Store {
  constructor(options) {
    super(options)

    // 添加处理多Store的方法
    Object.assign(this, MultiMixin)
  }

  getDayCount(count) {
    // 需要的数据条数 × 单位条数
    return count * this.count
  }

  parseStore(store) {
    if (!store) {
      throw new Error('多分钟的Store依赖于单分钟的Store')
    }

    if (store.code !== this.code) {
      throw new Error(`单分钟code: ${store.code} 和本身code: ${this.code} 不相等`)
    }

    if (store.type !== Store.Type) {
      throw new Error(`单分钟type必须为 ${Store.Type}`)
    }

    this._attachStoreEvent(store)

    this.store = store
  }

  parsePeriod(period) {
    const count = parseInt(period)
    const unit = period.replace(count, '')

    if (isNaN(count) || !MinuteCounts[unit]) {
      throw new Error(`${period} 不是一个正确的周期（1m）`)
    }

    this.count = count
    this.unit = unit
  }
}
