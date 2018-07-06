import Lane from '../lane/index'
import Event from '../utils/event'
import {
  formatDay,
} from '../utils/time'

let uid = 0;

export default class Store extends Event {
  constructor(code, type) {
    super()

    this.id = ++uid
    this.code = code
    this.type = type

    // 数据
    this.data = []

    // 数据索引
    this.index = {}
  }

  parseIndex(obj) {
    if (typeof obj === 'string') {
      return obj
    }

    return formatDay(obj instanceof Date ? obj : obj.date)
  }
}
