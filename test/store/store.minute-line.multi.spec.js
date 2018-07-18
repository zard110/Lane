import MinuteStore from '../../src/store/store.minute-line'
import MultiMinuteStore from '../../src/store/store.minute-line.multi'

const code = '860326'

describe('多分钟Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('正常', function(done) {
    const oneMinuteStore = new MinuteStore({
      code,
    })

    const store = new MultiMinuteStore({
      code,
      type: '5m',
      store: oneMinuteStore,
    })

    store.on('update', ({data, isFinished}) => {
      console.log('多分钟', JSON.stringify(data.map(d => d.timestamp), null, 2))
      // console.log('单分钟', JSON.stringify(oneMinuteStore.data.map(d => d.timestamp), null, 2))
      console.log({
        isFinished,
      }, '\n')
    })

    store.done()
      .then(() => {
        store.loadMore(new Date('2099-01-01 00:00:00'), 10)
        done()
      })
  })
})
