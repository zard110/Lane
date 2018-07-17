import Store from '../../src/store/index'

const code = '860326'
const type = '1d'

describe('Store test', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('刚实例化的Store处于loading状态', function() {
    const store = new Store(code, type)
    expect(store.loading).toBe(true)
  })

  it('通过done方法确认Store实例已经初始化完成', function(done) {
    const store = new Store(code,type)
    store.done()
      .then(() => {
        expect(store.loading).toBe(false)
        done()
      })
  })
})
