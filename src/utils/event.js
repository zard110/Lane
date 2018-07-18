export default class Event {
  constructor() {
    this._events = {}
    this._callbacks = {}
  }

  on(key, cb) {
    const events = this._events
    const fullKey = key
    key = parseDot(key)

    if (!events[key]) {
      events[key] = []
    }

    events[key].push(cb)

    // 例如传入 change.xyz
    // events['change'] = cb
    // cbs['change.xyz'] = cb
    if (key !== fullKey) {
      this._callbacks[fullKey] = cb
    }
  }

  off(key, cb) {
    const events = this._events
    const fullKey = key
    key = parseDot(key)

    if (!events[key]) {
      return
    }

    if (fullKey === key) {
      // 没有带修饰符，直接传入事件名
      if (!cb) {
        events[key] = []
        return
      }

      const index = events[key].indexOf(cb)
      if (index > -1) {
        events[key].splice(index, 1)
      }
    } else {
      // 带修饰符，先用正常方法去除事件，在删除callbacks里的cb
      cb = cb || this._callbacks[fullKey]
      this.off(key, cb)
      delete this._callbacks[fullKey]
    }

  }

  emit(key, ...args) {
    const events = this._events
    if (!events[key]) {
      return
    }

    for (let i = 0, l = events[key].length; i < l; i++) {
      const cb = events[key][i]
      cb.apply(null, args)
    }
  }
}

function parseDot(name) {
  return name.split('.')[0]
}
