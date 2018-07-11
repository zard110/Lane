import {
  getDate,
  subStartWeeks,
} from '../../src/utils/time'

describe('Time test', function() {
  it('减单周获取起始日期', function() {

    // 星期三
    const day3 = getDate('2018-07-11')

    // 星期一
    const day1 = getDate('2018-07-09')

    expect(subStartWeeks(day3, 1)).toEqual(day1)
    expect(subStartWeeks(day1, 1)).toEqual(day1)
  })
})
