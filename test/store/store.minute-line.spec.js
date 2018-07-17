import {
  simpleIndexDBProvider,
  simpleStockDayTimeProvider
} from "../../src/api/mockstock";

import StoreMinuteLine from '../../src/store/store.minute-line'
import {
  formatDayHourMinute
} from "../../src/utils/time";

const code = '860326'
const today = formatDayHourMinute(new Date())
const begin = '2018-07-08'

// 从2018-07-08开始创建10天的1分钟k线
const API = simpleStockDayTimeProvider(new Date(begin), 10, ['09:30', '11:30'], ['13:01', '15:00'])
const DB = simpleIndexDBProvider()

describe('分钟Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000
    DB.clear()
  })

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('能够正确模拟数据', function(done) {
    const API = simpleStockDayTimeProvider(new Date('2018-07-17'), 1, ['09:30', '11:30'], ['13:01', '15:00'])

    API({
      time: '2018-07-17 09:40',
      count: 20,
    }).then(({data, isFinished}) => {
      expect(data.map(d => d.timestamp)).toEqual([
        '2018-07-17 09:30',
        '2018-07-17 09:31',
        '2018-07-17 09:32',
        '2018-07-17 09:33',
        '2018-07-17 09:34',
        '2018-07-17 09:35',
        '2018-07-17 09:36',
        '2018-07-17 09:37',
        '2018-07-17 09:38',
        '2018-07-17 09:39',
      ])
      expect(isFinished).toBe(true)
      done()
    })
  })

  it('能够正确模拟数据(跨天)', function(done) {
    const API = simpleStockDayTimeProvider(new Date('2018-07-17'), 2, ['09:30', '11:30'], ['13:01', '15:00'])

    API({
      time: '2018-07-17 09:40',
      count: 20,
    }).then(({data, isFinished}) => {
      expect(data.map(d => d.timestamp)).toEqual([
        '2018-07-16 14:51',
        '2018-07-16 14:52',
        '2018-07-16 14:53',
        '2018-07-16 14:54',
        '2018-07-16 14:55',
        '2018-07-16 14:56',
        '2018-07-16 14:57',
        '2018-07-16 14:58',
        '2018-07-16 14:59',
        '2018-07-16 15:00',
        '2018-07-17 09:30',
        '2018-07-17 09:31',
        '2018-07-17 09:32',
        '2018-07-17 09:33',
        '2018-07-17 09:34',
        '2018-07-17 09:35',
        '2018-07-17 09:36',
        '2018-07-17 09:37',
        '2018-07-17 09:38',
        '2018-07-17 09:39',
      ])
      expect(isFinished).toBe(false)
      done()
    })
  })

  it('通过loadMore方法获取正确的数据', function(done) {
    const store = new StoreMinuteLine(code, {
      DB,
      API,
    })

    let result = []
    store.on('update', ({data, isFinished}) => {
      expect(result.length).toBe(0)
      expect(data.map(d => d.timestamp)).toEqual(['2018-07-08 15:00'])
      expect(isFinished).toBe(false)
      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(today, 1)
      })
  })

  it('通过loadMore方法取光所有的数据', function(done) {
    const store = new StoreMinuteLine(code, {
      DB,
      API,
    })

    let result = []
    store.on('update', ({data, isFinished}) => {
      expect(result.length).toBe(0)

      // 10天的数据量
      expect(data.length).toBe(241 * 10)

      // 最后一条数据
      expect(data[data.length - 1].timestamp).toEqual('2018-07-08 15:00')

      // 10天前的第一条数据
      expect(data[0].timestamp).toEqual('2018-06-29 09:30')
      expect(isFinished).toBe(true)
      done()
    })

    store.done()
      .then(() => {
        // 已经超出了10天的数据量
        result = store.loadMore(today, 5000)
      })
  })

  it('DB会保存之前读取的数据', function(done) {
    const store = new StoreMinuteLine(code, {
      DB,
      API,
    })

    let result = []
    store.on('update', ({data, isFinished}) => {
      store.off('update')

      expect(result.length).toBe(0)

      // 10天的数据量
      expect(data.length).toBe(241 * 10)

      // 10天前的第一条数据
      result = store.loadMore('2018-06-29 09:32', 10)
      expect(result.map(d => d.timestamp)).toEqual([
        '2018-06-29 09:30',
        '2018-06-29 09:31',
      ])
      done()
    })

    store.done()
      .then(() => {
        // 已经超出了10天的数据量
        result = store.loadMore(today, 5000)
      })
  })
})
