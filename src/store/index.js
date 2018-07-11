import Lane from '../lane/index'
import Event from '../utils/event'

import {
  formatDay,
} from '../utils/time'

import {
  simpleIndexDBProvider,
  simpleStockDayProvider,
} from "../api/mockstock";
const API = simpleStockDayProvider(new Date(), 100)
const DB = simpleIndexDBProvider()

let uid = 0;

export default class Store extends Event {
  constructor(code, type, {DB, API} = {}) {
    super()

    this.id = ++uid
    this.code = code
    this.type = type

    // 正在加载数据
    this.loading = false

    // 已经加载完全部数据
    this.isFinished = false

    // 数据
    this.data = []

    // 数据索引
    this.index = {}

    this.DB = DB || Store.DB

    this.API = API || Store.API

    // 初始化加载数据
    this._initialize()
  }

  /**
   * 初始化
   * @private
   */
  _initialize() {
    this.loading = true
    this.DB.load({
      code: this.code,
      type: this.type,
    })
      .then(({isFinished, data}) => {
        this._merge(data, false)
        this.loading = false
        this.isFinished = isFinished
      })
      .catch(() => this.loading = false)
  }

  _load(time, count, last) {
    // 如果没有传索引，则返回全部数据
    if (!time) {
      return this.data.slice()
    }

    let begin, end

    // 标记时间大于最后一条数据时间
    if (Store.needUpdate(last, time)) {
      end = this.data.length - 1
    } else {
      const item = this.index[time]
      end = this.data.indexOf(item)
    }

    begin = end - count
    return this.data.slice(begin < 0 ? 0 : begin, end)
  }

  /**
   * 保存数据
   * @param data
   * @private
   */
  _save(data) {
    return this.DB.save({
      code: this.code,
      type: this.type,
      data,
      isFinished: this.isFinished
    })
  }

  /**
   * 从后台服务器获取数据
   * @param time
   * @param count
   * @returns {*|PromiseLike<void>|Promise<void>}
   * @private
   */
  _fetch(time, count) {
    time = Store.parseIndex(time)
    return this.API({
      code: this.code,
      type: this.type,
      count,
      time
    }).then(({data, isFinished}) => {
      this.isFinished = isFinished
      return this._merge(data)
    })
  }

  /**
   * 合并数据
   * @param data
   * @param update
   * @private
   */
  _merge(data, update = true) {
    data.forEach(d => {
      const i = Store.parseIndex(d)
      this.index[i] = d
    })

    this.data = Object.values(this.index)
    this._save(this.data)

    // 需要发送 update 事件
    if (update) {
      this.emit('update', this.data)
    }
  }

  /**
   * 提供给外部的接口，加载更多数据
   * @param obj
   * @param count
   * @returns {*}
   */
  loadMore(obj, count) {
    // TODO 做加入队列
    if (this.loading) {
      return
    }

    // 获取标准时间
    const now =  Store.parseIndex(Lane.getTime())

    // 本地最后一条数据时间
    const last = Store.parseIndex(this.data[this.data.length - 1])

    // 需要数据的时间
    const time = Store.parseIndex(obj)

    if (Store.needUpdate(last, now)) {
      // TODO update
    }

    const result = this._load(time, count, last)

    // 如果数据不够，从后台取数据
    if (!this.isFinished && result.length < count) {
      this._fetch(result[0] || time, count - result.length)
    }

    return result
  }

  /**
   * 检测初始化状态
   * @returns {Promise<any>}
   */
  done() {
    return new Promise(resolve => {
      function check() {
        setTimeout(() => {
          if (!this.loading) {
            resolve()
          } else {
            check.call(this)
          }
        }, 10)
      }

      check.call(this)
    })
  }

  static needUpdate(time, now) {
    return now >= time
  }

  static parseIndex(obj) {
    if (!obj) {
      return
    }

    if (typeof obj === 'string') {
      return obj
    }

    return formatDay(obj instanceof Date ? obj : obj.date)
  }
}

Store.DB = DB
Store.API = API
