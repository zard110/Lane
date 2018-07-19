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

  // it('正常', function(done) {
  //   const oneDayStore = new DayStore({
  //     code,
  //   })
  //
  //   const storeWeek = new MultiDayStore({
  //     code,
  //     type: '1W',
  //     store: oneDayStore,
  //   })
  //
  //   const storeMonth = new MultiDayStore({
  //     code,
  //     type: '1M',
  //     store: oneDayStore,
  //   })
  //
  //   storeWeek.on('update', ({data, isFinished}) => {
  //     console.log('多日-星期', JSON.stringify(data.map(d => d.timestamp), null, 2))
  //     // console.log('单日', JSON.stringify(oneDayStore.data.map(d => d.timestamp), null, 2))
  //     console.log({
  //       isFinished,
  //     }, '\n')
  //   })
  //
  //   storeMonth.on('update', ({data, isFinished}) => {
  //     console.log('多日-月', JSON.stringify(data.map(d => d.timestamp), null, 2))
  //     console.log({
  //       isFinished,
  //     }, '\n')
  //   })
  //
  //   storeMonth.done()
  //     .then(() => {
  //       storeMonth.loadMore('2099-01-01', 10)
  //     })
  //
  //   storeWeek.done()
  //     .then(() => {
  //       storeWeek.loadMore('2099-01-01', 1)
  //       done()
  //     })
  // })
})
