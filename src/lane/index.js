import {
  simpleIndexDBProvider,
  simpleStockDayProvider,
} from "../api/mockstock";

const API = simpleStockDayProvider('2018-07-08', 10)
const DB = simpleIndexDBProvider()

let instance

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

  static loadDB(code, type) {
    return DB.load({
      code,
      type,
    })
  }

  static saveDB(code, type, {
    data,
    isFinished,
  }) {
    return DB.save({
      code,
      type,
      data,
      isFinished,
    })
  }

  static clearDB() {
    return DB.clear()
  }

  static loadAPI(params) {
    return API(params)
  }
}
