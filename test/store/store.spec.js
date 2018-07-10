import Store from '../../src/store/index'

import {
  simpleIndexDBProvider,
  simpleStockDayProvider,
} from "../../src/api/mockstock";

const code = '860326'
const type = '1d'
const begin = '2018-07-08'
// 从2018-07-08开始创建10条数据
const API = simpleStockDayProvider(begin, 10)
const DB = simpleIndexDBProvider()

describe('Store test', function() {
  let originalTimeout;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    DB.clear()
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('1.刚实例化的Store处于loading状态', function() {
    const store = new Store(code, type, {
      DB,
      API,
    })
    expect(store.loading).toBe(true)
  })

  it('2.通过done方法确认Store实例已经初始化完成', function(done) {
    const store = new Store(code, type, {
      DB,
      API,
    })
    store.done()
      .then(() => {
        expect(store.loading).toBe(false)
        done()
      })
  })

  it('3.通过loadMore方法取数据并触发update事件', function(done) {
    const store = new Store(code, type, {
      DB,
      API,
    })
    let result = []

    store.on('update', () => {
      expect(result.length).toBe(0)
      expect(store.data.length).toBe(1)
      expect(store.isFinished).toBe(false)
      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(begin, 1)
      })
  })

  it('4.通过loadMore方法取光数据', function(done) {
    const store = new Store(code, type, {
      DB,
      API,
    })
    let result = []

    store.on('update', () => {
      expect(result.length).toBe(0)
      expect(store.data.length).toBe(10)
      expect(store.isFinished).toBe(true)
      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(new Date(), 11)
      })
  })

  it('5.保存之前读取的数据', function(done) {
    const store = new Store(code, type, {
      DB,
      API,
    })
    let result = []

    store.on('update', () => {
      store.off('update')

      expect(result.length).toBe(0)
      expect(store.data.length).toBe(5)
      expect(store.isFinished).toBe(false)

      // 第二次加载会直接返回已有的数据
      result = store.loadMore(begin, 5)
      expect(result.length).toBe(4)

      // 如果数据不够，会返回已有的所有数据
      result = store.loadMore('2018-07-07', 5)
      expect(result.length).toBe(3)

      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(new Date(), 5)
      })
  })
})
