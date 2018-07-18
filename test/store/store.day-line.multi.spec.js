import DayStore from '../../src/store/store.day-line'
import MultiDayStore from '../../src/store/store.day-line.multi'

const code = '860326'

describe('多日Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 600;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('正常', function(done) {
    const oneDayStore = new DayStore({
      code,
    })

    const store = new MultiDayStore({
      code,
      type: '1W',
      store: oneDayStore,
    })

    store.on('update', ({data, isFinished}) => {
      console.log('多日', JSON.stringify(data.map(d => d.timestamp), null, 2))
      console.log('单日', JSON.stringify(oneDayStore.data.map(d => d.timestamp), null, 2))
      console.log({
        isFinished,
      }, '\n')
    })

    store.done()
      .then(() => {
        store.loadMore('2099-01-01', 1)
        done()
      })
  })
})
