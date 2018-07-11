import {
  getDate,
  subStartWeeks,
  subStartMonths,
  subStartSeasons,
  subStartYears,
} from '../../src/utils/time'

describe('Time test', function() {
  it('减单周获取正确的起始日期', function() {
    // 星期三
    const day3 = getDate('2018-07-11')

    // 星期一
    const day1 = getDate('2018-07-09')

    expect(subStartWeeks(day3, 1)).toEqual(day1)
    expect(subStartWeeks(day1, 1)).toEqual(day1)
  })

  it('减多周获取正确的起始日期', function() {
    // 星期三
    const day3 = getDate('2018-07-11')

    // 星期一
    const day1 = getDate('2018-07-09')

    // 上个星期一
    const day11 = getDate('2018-07-02')

    // 上上个星期一
    const day111 = getDate('2018-06-25')

    expect(subStartWeeks(day3, 2)).toEqual(day11)
    expect(subStartWeeks(day1, 2)).toEqual(day11)

    expect(subStartWeeks(day3, 3)).toEqual(day111)
    expect(subStartWeeks(day1, 3)).toEqual(day111)
  })

  it('减单月获取正确的起始日期', function() {
    const day = getDate('2018-01-11')
    const day0 = getDate('2018-01-01')

    expect(subStartMonths(day, 1)).toEqual(day0)
  })

  it('减多月获取正确的起始日期', function() {
    const day = getDate('2018-01-11')
    const day0 = getDate('2017-12-01')

    expect(subStartMonths(day, 2)).toEqual(day0)
  })

  it('减单季度获取正确的起始日期', function() {
    const day11 = getDate('2018-11-11')
    const day8 = getDate('2018-08-11')
    const day5 = getDate('2018-05-11')
    const day2 = getDate('2018-02-11')

    expect(subStartSeasons(day11, 1)).toEqual(getDate('2018-10-01'))
    expect(subStartSeasons(day8, 1)).toEqual(getDate('2018-07-01'))
    expect(subStartSeasons(day5, 1)).toEqual(getDate('2018-04-01'))
    expect(subStartSeasons(day2, 1)).toEqual(getDate('2018-01-01'))
  })

  it('减多季度获取正确的起始日期', function() {
    const day11 = getDate('2018-11-11')
    const day8 = getDate('2018-08-11')
    const day5 = getDate('2018-05-11')
    const day2 = getDate('2018-02-11')

    expect(subStartSeasons(day11, 2)).toEqual(getDate('2018-07-01'))
    expect(subStartSeasons(day8, 2)).toEqual(getDate('2018-04-01'))
    expect(subStartSeasons(day5, 2)).toEqual(getDate('2018-01-01'))
    expect(subStartSeasons(day2, 2)).toEqual(getDate('2017-10-01'))
  })

  it('减年获取正确的起始日期', function() {
    const day = getDate('2018-07-08')

    expect(subStartYears(day, 1)).toEqual(getDate('2018-01-01'))
    expect(subStartYears(day, 2)).toEqual(getDate('2017-01-01'))
  })
})
