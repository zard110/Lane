/**
 * 多Store混合，不要自己随意使用
 */
export default {
  /**
   * 重写初始化
   * @private
   */
  _initialize() {
    const options = this.options

    // 在具体类中定义
    this.parseStore(options.store)

    // 在具体类中定义
    this.parsePeriod(options.type)

    this.loading = true
    const store = options.store
    return store.done()
      .then(() => {
        this.loading = false
        this.isFinished = store.isFinished
      })
  },

  /**
   * 当依赖的Store更新数据时的处理
   * @param store
   * @private
   */
  _attachStoreEvent(store) {
    store.on(`update.store_${this.id}`, ({data, isFinished}) => {
      this.isFinished = isFinished

      if (data.length) {
        // 分组
        const groupData = this.group(data)

        // 合并
        const result = this.assemble(groupData)

        this._merge(result, true, false)
      }
    })
  },

  /**
   * 重写获取数据的方法，从依赖的Store中获取数据
   * @param time
   * @param count
   * @returns {*}
   * @private
   */
  _fetch(time, count) {
    time = this.parseIndex(time)
    const store = this.store

    const data = store.loadMore(time, this.getDayCount(count))

    if (data.length) {
      // 分组
      const groupData = this.group(data)

      // 合并
      const result = this.assemble(groupData)

      if (result.length) {
        this._merge(result, true, false)
      }

      return result
    }
  }
}
