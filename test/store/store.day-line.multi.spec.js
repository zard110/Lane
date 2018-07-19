import DayStore from '../../src/store/store.day-line'
import MultiDayStore from '../../src/store/store.day-line.multi'

import {
  simpleStockDayProvider,
  simpleIndexDBProvider,
} from "../../src/api/mockstock";

const code = '860326'
const begin = '2018-07-08'
const API = simpleStockDayProvider(begin, 1000)
const DB = simpleIndexDBProvider()

function assembleData(data) {
  if (!data || !data.length) {
    return {}
  }

  return data[data.length - 1]
}

describe('多日Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600;
    DB.clear()
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('能够正常获取星期数据', function(done) {
    const oneDayStore = new DayStore({
      code,
      API,
      DB,
    })

    const store = new MultiDayStore({
      code,
      type: '1W',
      store: oneDayStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      expect(data.map(d => d.timestamp)).toEqual([
        "2017-12-24",
        "2017-12-31",
        "2018-01-07",
      ])
      expect(isFinished).toBe(false)
      done()
    })

    store.done()
      .then(() => {
        store.loadMore('2018-01-08', 3)
      })
  })

  it('能够正常获取月数据', function(done) {
    const oneDayStore = new DayStore({
      code,
      API,
      DB,
    })

    const store = new MultiDayStore({
      code,
      type: '1M',
      store: oneDayStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      // TODO 更精准地确定数据条数，现在的数据会多
      expect(data.map(d => d.timestamp)).toEqual([
        "2017-10-31",
        "2017-11-30",
        "2017-12-31",
        "2018-01-07",
      ])
      expect(isFinished).toBe(false)
      done()
    })

    store.done()
      .then(() => {
        store.loadMore('2018-01-08', 3)
      })
  })

  it('能够正常获取季度数据', function(done) {
    const oneDayStore = new DayStore({
      code,
      API,
      DB,
    })

    const store = new MultiDayStore({
      code,
      type: '1S',
      store: oneDayStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      // TODO 更精准地确定数据条数，现在的数据会多
      expect(data.map(d => d.timestamp)).toEqual([
        "2017-06-30",
        "2017-09-30",
        "2017-12-31",
        "2018-01-07",
      ])
      expect(isFinished).toBe(false)
      done()
    })

    store.done()
      .then(() => {
        store.loadMore('2018-01-08', 3)
      })
  })

  it('能够正常获取年数据', function(done) {
    const oneDayStore = new DayStore({
      code,
      API,
      DB,
    })

    const store = new MultiDayStore({
      code,
      type: '1Y',
      store: oneDayStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      // TODO 更精准地确定数据条数，现在的数据会多
      expect(data.map(d => d.timestamp)).toEqual([
        "2015-12-31",
        "2016-12-31",
        "2017-12-31",
        "2018-01-07",
      ])
      expect(isFinished).toBe(true)
      done()
    })

    store.done()
      .then(() => {
        store.loadMore('2018-01-08', 3)
      })
  })
})
