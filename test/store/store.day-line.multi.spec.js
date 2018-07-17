import DayStore from '../../src/store/store.day-line'
import MultiDayStore from '../../src/store/store.day-line.multi'

const code = '860326'

describe('多日Store测试', function() {
  it('正常', function(done) {
    const oneDayStore = new DayStore(code)
    const store = new MultiDayStore(code, '1M', {
      store: oneDayStore,
    })

    oneDayStore.done()
      .then(() => {
        console.log(oneDayStore)
        done()
      })
  })
})
