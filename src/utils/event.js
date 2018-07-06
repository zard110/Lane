export default class Event {
  constructor() {
    this._events = {}
  }

  on(key, cb) {
    const events = this._events

    if (!events[key]) {
      events[key] = []
    }

    events[key].push(cb)
  }

  off(key, cb) {
    const events = this._events

    if (!events[key]) {
      return
    }

    if (!cb) {
      events[key] = []
      return
    }

    const index = events[key].indexOf(cb)
    if (index > -1) {
      events[key].splice(index, 1)
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
