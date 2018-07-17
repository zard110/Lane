import {
  simpleStockDayTimeProvider
} from "../../src/api/mockstock";

describe('分钟Store测试', function() {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

  beforeEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000
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
})
