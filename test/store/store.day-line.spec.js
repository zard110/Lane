import Store from '../../src/store/store.day-line'

import {
  simpleIndexDBProvider,
  simpleStockDayProvider,
} from "../../src/api/mockstock";

const code = '860326'
const today = new Date()
const begin = '2018-07-08'

// 从2018-07-08开始创建10条数据
const API = simpleStockDayProvider(begin, 10)
const DB = simpleIndexDBProvider()

describe('日Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    DB.clear()
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('通过loadMore方法取数据并触发update事件', function(done) {
    const store = new Store(code, {
      DB,
      API,
    })
    let result = []

    store.on('update', ({data, isFinished}) => {
      console.log(data)
      expect(result.length).toBe(0)
      expect(data.map(d => d.timestamp)).toEqual(['2018-07-08'])
      expect(isFinished).toBe(false)
      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(today, 1)
      })
  })

  it('通过loadMore方法取光数据', function(done) {
    const store = new Store(code, {
      DB,
      API,
    })
    let result = []

    store.on('update', ({data, isFinished}) => {
      expect(result.length).toBe(0)
      expect(data.map(d => d.timestamp)).toEqual([
        '2018-06-29',
        '2018-06-30',
        '2018-07-01',
        '2018-07-02',
        '2018-07-03',
        '2018-07-04',
        '2018-07-05',
        '2018-07-06',
        '2018-07-07',
        '2018-07-08',
      ])
      expect(isFinished).toBe(true)
      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(today, 11)
      })
  })

  it('保存之前读取的数据', function(done) {
    const store = new Store(code, {
      DB,
      API,
    })
    let result = []

    store.on('update', ({data, isFinished}) => {
      store.off('update')

      expect(result.length).toBe(0)
      expect(data.map(d => d.timestamp)).toEqual([
        '2018-07-04',
        '2018-07-05',
        '2018-07-06',
        '2018-07-07',
        '2018-07-08',
      ])
      expect(isFinished).toBe(false)

      // 第二次加载会直接返回已有的数据
      result = store.loadMore(begin, 5)
      expect(result.map(d => d.timestamp)).toEqual([
        '2018-07-04',
        '2018-07-05',
        '2018-07-06',
        '2018-07-07',
      ])

      // 如果数据不够，会返回已有的所有数据
      result = store.loadMore('2018-07-07', 5)
      expect(result.map(d => d.timestamp)).toEqual([
        '2018-07-04',
        '2018-07-05',
        '2018-07-06',
      ])

      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(today, 5)
      })
  })
})
