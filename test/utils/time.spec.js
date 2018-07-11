import {
  getDate,
  subStartWeeks,
  subStartMonths,
  subStartSeasons,
  subStartYears,
  groupDateByWeek,
  groupDateByMonth,
  groupDateBySeason,
  groupDateByYear,
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

  it('能够正确按星期分组', function() {
    // [{date: xxx, value: xxx}, ...]
    const origin = [
      '2018-05-21', '2018-05-24',
      '2018-05-28', '2018-05-30',
      '2018-06-25',
      '2018-07-02', '2018-07-03', '2018-07-06',
      '2018-07-09', '2018-07-11',
    ].map(d => {
      return {
        value: d,
        date: getDate(d),
      }
    })

    expect(groupDateByWeek(origin, 1).map(g => g.map(d => d.value)))
      .toEqual([
        ['2018-05-21', '2018-05-24'],
        ['2018-05-28', '2018-05-30'],
        ['2018-06-25'],
        ['2018-07-02', '2018-07-03', '2018-07-06'],
        ['2018-07-09', '2018-07-11'],
      ])

    expect(groupDateByWeek(origin, 2).map(g => g.map(d => d.value)))
      .toEqual([
        ['2018-05-21', '2018-05-24', '2018-05-28', '2018-05-30'],
        ['2018-06-25'],
        ['2018-07-02', '2018-07-03', '2018-07-06', '2018-07-09', '2018-07-11'],
      ])

    expect(groupDateByWeek(origin, 3).map(g => g.map(d => d.value)))
      .toEqual([
        ['2018-05-21', '2018-05-24', '2018-05-28', '2018-05-30'],
        ['2018-06-25', '2018-07-02', '2018-07-03', '2018-07-06', '2018-07-09', '2018-07-11'],
      ])
  })

  it('能正确按照月分组', function() {
    const origin = [
      '2017-12-21',
      '2018-01-28',
      '2018-03-25',
      '2018-06-02', '2018-06-12',
      '2018-07-11',
    ].map(d => {
      return {
        value: d,
        date: getDate(d),
      }
    })

    expect(groupDateByMonth(origin, 1).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-12-21'],
        ['2018-01-28'],
        ['2018-03-25'],
        ['2018-06-02', '2018-06-12'],
        ['2018-07-11'],
      ])

    console.log(groupDateByMonth(origin, 2).map(g => g.map(d => d.value)))
    // [12, 1] [2, 3], [4, 5] [6, 7]
    expect(groupDateByMonth(origin, 2).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-12-21', '2018-01-28'],
        ['2018-03-25'],
        ['2018-06-02', '2018-06-12', '2018-07-11'],
      ])

    // 虽然结果和2个月分组一样，这是按照自然月分组而非数据的月份 [11, 12, 1] [2, 3, 4] [5, 6, 7]
    console.log(groupDateByMonth(origin, 3).map(g => g.map(d => d.value)))
    expect(groupDateByMonth(origin, 3).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-12-21', '2018-01-28'],
        ['2018-03-25'],
        ['2018-06-02', '2018-06-12', '2018-07-11'],
      ])
  })
})
