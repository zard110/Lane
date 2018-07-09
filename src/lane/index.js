import {
  getDate,
  addDays,
  formatDay,
} from '../utils/time'

let instance = null

// 模拟数据
let db = []
let dbIsFinished = false
const begin = getDate('2018-07-08')
const stocks = [{
  date: begin,
  value: 0,
}]

for(let i = -1; i > -10; i--) {
  const date = addDays(begin, i)
  stocks.unshift({
    date,
    value: i,
  })
}

export default class Lane {
  constructor(name = 'Stock') {
    if (instance) {
      return instance
    }

    this.name = name
    this.stores = {}
    instance = this
  }

  add(store) {
    const {code, type} = store
    const stores = this.stores

    if (!code || !type) {
      throw new Error('添加的store必须要有code和type属性')
    }

    if (this.get(code, type)) {
      throw new Error('不能添加重复的store')
    }

    if (!stores[code]) {
      stores[code] = {}
    }

    stores[code][type] = store

    return store
  }

  get(code, type) {
    const stores = this.stores
    if (stores[code]) {
      return stores[code][type]
    }
  }

  clear() {
    this.stores = {}
  }

  static getTime() {
    return new Date()
  }

  static loadDB() {
    return new Promise(resolve => {
      resolve({
        data: db,
        isFinished: dbIsFinished,
      })
    })
  }

  static saveDB(code, type, {
    data,
    isFinished,
  }) {
    return new Promise(resolve => {
      db = data
      dbIsFinished = isFinished
      resolve()
    })
  }

  static clearDB() {
    return new Promise(resolve => {
      db = []
      dbIsFinished = false
      resolve()
    })
  }

  static loadAPI({count, time}) {
    const last = formatDay(stocks[stocks.length - 1].date)
    let begin, end

    if (time > last) {
      begin = stocks.length - count
      end = stocks.length
    } else {
      const d = stocks.filter(s => formatDay(s.date) === time)
      end = stocks.indexOf(d[0])
      begin = end - count
    }

    return new Promise(resolve => resolve(stocks.slice(begin < 0 ? 0 : begin, end)))
  }
}
