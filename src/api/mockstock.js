import Log from '../utils/log'
import {
  addDays,
  formatDay,
  getDate,
} from "../utils/time";

const logger = new Log('mockstock.js', Log.Error)

/**
 * 模拟日线股票生成器
 * @param time
 * @param count
 * @returns {function({code: *, type: *, time: *, count: *}): Promise<any>}
 */
export function simpleStockDayProvider(time, count) {

  // 生成指定开始时间，指定数量的模拟数据
  const begin = getDate(time)
  const stocks = [{
    date: begin,
    value: 0,
  }]

  for(let i = 1; i < count; i++) {
    const date = addDays(begin, -1 * i)
    stocks.unshift({
      date,
      value: i,
    })
  }
  logger.debug('stocks api initialized: ', stocks)

  let uid = 0
  return ({code, type, time, count}) => {
    const id = ++uid
    logger.debug(`begin fetch(${id}), params is: `, {
      code,
      type,
      time,
      count,
    })

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

    const data = stocks.slice(begin < 0 ? 0 : begin, end)
    const isFinished = data.length < count

    logger.debug(`end fetch(${id}), result is: `, {
      data,
      isFinished,
    })

    return new Promise(resolve => resolve({
      data,
      isFinished,
    }))
  }
}

/**
 * 模拟本地IndexDB存储生成器
 * @returns {{clear: (function(*=): Promise<any>), save: (function(*=): Promise<any>), load: (function(*=): Promise<any>)}}
 */
export function simpleIndexDBProvider() {
  const db = {
    __info__: {}
  }

  return {
    clear: opts => clearDB(db, opts),
    save: opts => saveDB(db, opts),
    load: opts => loadDB(db, opts),
  }
}

/**
 * 清除
 * @param db
 * @param code
 * @param type
 * @returns {Promise<any>}
 */
function clearDB(db, {
  code,
  type,
} = {}) {
  logger.debug('clear db: ', {
    code,
    type,
  })

  if (!code || !type) {
    for (const name in db) {
      if (!db.hasOwnProperty(name)) {
        continue
      }
      delete db[name]
    }

    db.__info__ = {}
  }

  const id = `${code}:${type}`
  db[id] = []
  db.__info__[id] = {}

  return new Promise(resolve => resolve(db))
}

/**
 * 保存
 * @param db
 * @param code
 * @param type
 * @param data
 * @param isFinished
 * @returns {Promise<any>}
 */
function saveDB(db, {
  code,
  type,
  data,
  isFinished,
}) {
  const id = `${code}:${type}`

  db[id] = data
  if (!db.__info__[id]) {
    db.__info__[id] = {}
  }
  db.__info__[id].isFinished = isFinished

  return new Promise(resolve => resolve(db))
}

/**
 * 读取
 * @param db
 * @param code
 * @param type
 * @returns {Promise<any>}
 */
function loadDB(db, {
  code,
  type,
}) {
  const id = `${code}:${type}`
  const data = db[id] || []
  if (!db.__info__[id]) {
    db.__info__[id] = {}
  }
  const isFinished = !!db.__info__[id].isFinished

  return new Promise(resolve => resolve({
    data,
    isFinished,
  }))
}
