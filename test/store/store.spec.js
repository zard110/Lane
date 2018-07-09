import Store from '../../src/store/index'
import Lane from '../../src/lane/index'

const code = '860326'
const type = '1d'
const begin = '2018-07-08'

describe('Store test', function() {
  let originalTimeout;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
    Lane.clearDB()
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('刚实例化的Store处于loading状态', function() {
    const store = new Store(code, type)
    expect(store.loading).toBe(true)
  })

  it('通过done方法确认Store实例已经初始化完成', function(done) {
    const store = new Store(code, type)
    store.done()
      .then(() => {
        expect(store.loading).toBe(false)
        done()
      })
  })

  it('通过loadMore方法取数据并触发update事件', function(done) {
    const store = new Store(code, type)
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

  it('通过loadMore方法取光数据', function(done) {
    const store = new Store(code, type)
    let result = []

    store.on('update', () => {
      expect(result.length).toBe(0)
      expect(store.data.length).toBe(10)
      expect(store.isFinished).toBe(true)
      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(begin, 11)
      })
  })

  it('保存之前读取的数据', function(done) {
    const store = new Store(code, type)
    let result = []

    store.on('update', () => {
      store.off('update')

      expect(result.length).toBe(0)
      expect(store.data.length).toBe(5)
      expect(store.isFinished).toBe(false)

      // 第二次加载会直接返回数据
      result = store.loadMore(begin, 5)
      expect(result.length).toBe(5)

      // 如果数据不够，会返回已有的所有数据
      result = store.loadMore('2018-07-07', 5)
      expect(result.length).toBe(4)

      done()
    })

    store.done()
      .then(() => {
        result = store.loadMore(begin, 5)
      })
  })

  it('后台获取数据后会执行_save方法保存')
})
