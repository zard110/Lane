export default class Log {

  constructor(method, level = 1) {
    // 1:debug  2:warn  3:error
    this.level = level

    this.method = method
  }

  getParams(args) {
    return this.method ? [`[${this.method}]: `].concat(args) : args
  }

  checkLevel(level) {
    return level < Math.max(Log.Level, this.level)
  }

  debug(...args) {
    if (this.checkLevel(1)) {
      return
    }
    console.log.apply(null, this.getParams(args))
  }

  warn(...args) {
    if (this.checkLevel(2)) {
      return
    }
    console.warn.apply(null, this.getParams(args))
  }

  error(...args) {
    if (this.checkLevel(3)) {
      return
    }
    console.error.apply(null, this.getParams(args))
  }

}

Log.Level = 1
Log.Debug = 1
Log.Warn = 2
Log.Error = 3
