import Events from '../utils/event'

let uid = 0
export default class Query extends Events {
  constructor(options) {
    super()

    this.id = uid++
    this.options = options
    this.init(options)
  }

  init(options) {
    this.code = options.code

    // 全数据
    this.origin = []
    this.originIndex = {}

    // 显示数据
    this.data = []
    this.dataIndex = {}

    this.current = undefined

    this.currentIndex = 0
  }
}
