import Lane from '../lane/index'
import Event from '../utils/event'

import {
  simpleIndexDBProvider,
} from "../api/mockstock";


const MOCK_DB = simpleIndexDBProvider()

let uid = 0;

export default class Store extends Event {
  constructor(options = {}) {
    super()

    this.id = ++uid
    this.code = options.code
    this.type = options.type

    // 正在加载数据
    this.loading = true

    // 已经加载完全部数据
    this.isFinished = false

    // 数据
    this.data = []

    // 数据索引
    this.index = {}

    this.DB = options.DB || MOCK_DB

    this.options = options

    // 初始化加载数据
    // this._initialize(options)
  }

  /**
   * 初始化
   * @private
   * @returns {Promise<any>}
   */
  _initialize() {
    this.loading = true
    return this.DB.load({
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
    if (this.needUpdate(last, time)) {
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
    time = this.parseIndex(time)
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
   * @param needUpdate
   * @param needSave
   * @private
   */
  _merge(data, needUpdate = true, needSave = true) {
    data.forEach(d => {
      const i = this.parseIndex(d)
      this.index[i] = d
    })

    this.data = Object.values(this.index)

    if (needSave) {
      this._save(this.data)
    }

    // 需要发送 update 事件
    if (needUpdate) {
      this.emit('update', {
        data: this.data,
        isFinished: this.isFinished
      })
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
    const now =  this.parseIndex(Lane.getTime())

    // 本地最后一条数据时间
    const last = this.parseIndex(this.data[this.data.length - 1])

    // 需要数据的时间
    const time = this.parseIndex(obj)

    if (this.needUpdate(last, now)) {
      // TODO update
    }

    const result = this._load(time, count, last)
    let fetchResult

    // 如果数据不够，从后台取数据
    if (!this.isFinished && result.length < count) {
      fetchResult = this._fetch(result[0] || time, count - result.length)
    }

    return (fetchResult instanceof Array) ? fetchResult.concat(result) : result
  }

  /**
   * 检测初始化状态
   * @returns {Promise<any>}
   */
  done() {
    // return new Promise(resolve => {
    //   function check() {
    //     setTimeout(() => {
    //       if (!this.loading) {
    //         resolve()
    //       } else {
    //         check.call(this)
    //       }
    //     }, 10)
    //   }
    //
    //   check.call(this)
    // })

    return this._initialize()
  }

  needUpdate(time, now) {
    return now >= time
  }

  parseIndex(obj) {
    return obj
  }
}

