import MinuteStore from '../../src/store/store.minute-line'
import MultiMinuteStore from '../../src/store/store.minute-line.multi'

import {
  simpleStockDayTimeProvider,
  simpleIndexDBProvider,
} from "../../src/api/mockstock";

const begin = '2018-07-08'
const code = '860326'
const API = simpleStockDayTimeProvider(begin, 10)
const DB = simpleIndexDBProvider()

function assembleData(time, data) {
  if (!data || !data.length) {
    return {}
  }

  return data[data.length - 1]
}

describe('多分钟Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600;
    DB.clear()
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('能够正常获取5分钟数据', function(done) {
    const oneMinuteStore = new MinuteStore({
      code,
      API,
      DB,
    })

    // 5分钟Store
    const store = new MultiMinuteStore({
      code,
      type: '5m',
      store: oneMinuteStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      expect(isFinished).toBe(false)
      expect(data.map(d => d.timestamp)).toEqual([
        "2018-07-08 14:55",
        "2018-07-08 15:00",
      ])
      expect(oneMinuteStore.data.map(d => d.timestamp)).toEqual([
        "2018-07-08 14:51",
        "2018-07-08 14:52",
        "2018-07-08 14:53",
        "2018-07-08 14:54",
        "2018-07-08 14:55",
        "2018-07-08 14:56",
        "2018-07-08 14:57",
        "2018-07-08 14:58",
        "2018-07-08 14:59",
        "2018-07-08 15:00"
      ])

      done()
    })

    store.done()
      .then(() => {
        store.loadMore(new Date(), 2)

      })
  })

  it('能够正常获取5分钟数据（跨天）', function(done) {
    const oneMinuteStore = new MinuteStore({
      code,
      API,
      DB,
    })

    // 60分钟Store
    const store = new MultiMinuteStore({
      code,
      type: '60m',
      store: oneMinuteStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      expect(isFinished).toBe(false)
      expect(data.map(d => d.timestamp)).toEqual([
        "2018-07-07 15:00",
        "2018-07-08 10:30",
        "2018-07-08 11:30",
        "2018-07-08 14:00",
        "2018-07-08 15:00",
      ])

      done()
    })

    store.done()
      .then(() => {
        store.loadMore(new Date(), 5)
      })
  })

  it('能够取完所有数据', function(done) {
    const oneMinuteStore = new MinuteStore({
      code,
      API,
      DB,
    })

    // 5分钟Store
    const store = new MultiMinuteStore({
      code,
      type: '60m',
      store: oneMinuteStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      expect(isFinished).toBe(true)
      expect(data.length).toBe(40)

      done()
    })

    store.done()
      .then(() => {
        // 每天4条数据，50条已经超过了10天
        store.loadMore(new Date(), 50)
      })
  })

  it('如果已经取过数据，再次取时能直接返回数据', function(done) {
    const oneMinuteStore = new MinuteStore({
      code,
      API,
      DB,
    })

    // 5分钟Store
    const store = new MultiMinuteStore({
      code,
      type: '60m',
      store: oneMinuteStore,
      API,
      DB,
      assembleData,
    })

    store.on('update', ({data, isFinished}) => {
      expect(isFinished).toBe(true)
      expect(data.length).toBe(40)

      const result = store.loadMore(new Date(), 10)
      expect(result.length).toBe(10)

      done()
    })

    store.done()
      .then(() => {
        // 每天4条数据，50条已经超过了10天
        store.loadMore(new Date(), 50)
      })
  })
})
