import {
  getDate,
  subStartWeeks,
  subStartMonths,
  subStartSeasons,
  subStartYears,
  groupDateByWeek,
  groupDateByMonth,
  groupDateByYear,
  createTimeGroupZone,
  groupDateByMinute,
} from '../../src/utils/time'

import Log from '../../src/utils/log'

const logger = new Log('time.spec.js', Log.Error)

describe('Time test', function () {
  it('减单周获取正确的起始日期', function () {
    // 星期三
    const day3 = getDate('2018-07-11')

    // 星期一
    const day1 = getDate('2018-07-09')

    expect(subStartWeeks(day3, 1)).toEqual(day1)
    expect(subStartWeeks(day1, 1)).toEqual(day1)
  })

  it('减多周获取正确的起始日期', function () {
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

  it('减单月获取正确的起始日期', function () {
    const day = getDate('2018-01-11')
    const day0 = getDate('2018-01-01')

    expect(subStartMonths(day, 1)).toEqual(day0)
  })

  it('减多月获取正确的起始日期', function () {
    const day = getDate('2018-01-11')
    const day0 = getDate('2017-12-01')

    expect(subStartMonths(day, 2)).toEqual(day0)
  })

  it('减单季度获取正确的起始日期', function () {
    const day11 = getDate('2018-11-11')
    const day8 = getDate('2018-08-11')
    const day5 = getDate('2018-05-11')
    const day2 = getDate('2018-02-11')

    expect(subStartSeasons(day11, 1)).toEqual(getDate('2018-10-01'))
    expect(subStartSeasons(day8, 1)).toEqual(getDate('2018-07-01'))
    expect(subStartSeasons(day5, 1)).toEqual(getDate('2018-04-01'))
    expect(subStartSeasons(day2, 1)).toEqual(getDate('2018-01-01'))
  })

  it('减多季度获取正确的起始日期', function () {
    const day11 = getDate('2018-11-11')
    const day8 = getDate('2018-08-11')
    const day5 = getDate('2018-05-11')
    const day2 = getDate('2018-02-11')

    expect(subStartSeasons(day11, 2)).toEqual(getDate('2018-07-01'))
    expect(subStartSeasons(day8, 2)).toEqual(getDate('2018-04-01'))
    expect(subStartSeasons(day5, 2)).toEqual(getDate('2018-01-01'))
    expect(subStartSeasons(day2, 2)).toEqual(getDate('2017-10-01'))
  })

  it('减年获取正确的起始日期', function () {
    const day = getDate('2018-07-08')

    expect(subStartYears(day, 1)).toEqual(getDate('2018-01-01'))
    expect(subStartYears(day, 2)).toEqual(getDate('2017-01-01'))
  })

  it('能够正确按星期分组', function () {
    // [{date: xxx, value: xxx}, ...]
    const origin = [
      '2018-05-21', '2018-05-24', // 1
      '2018-05-28', '2018-05-30', // 2
      '2018-06-04', // 3
      '2018-06-20', // 5
      '2018-06-25', // 6
      '2018-07-02', '2018-07-03', '2018-07-06', // 7
      '2018-07-09', '2018-07-11', // 8
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
        ['2018-06-04'],
        ['2018-06-20'],
        ['2018-06-25'],
        ['2018-07-02', '2018-07-03', '2018-07-06'],
        ['2018-07-09', '2018-07-11'],
      ])
  })

  it('能够正确按2星期分组', function () {
    // [{date: xxx, value: xxx}, ...]
    const origin = [
      '2018-05-21', '2018-05-24', // 1
      '2018-05-28', '2018-05-30', // 2
      '2018-06-04', // 3
      '2018-06-20', // 5
      '2018-06-25', // 6
      '2018-07-02', '2018-07-03', '2018-07-06', // 7
      '2018-07-09', '2018-07-11', // 8
    ].map(d => {
      return {
        value: d,
        date: getDate(d),
      }
    })

    // [1, 2] [3, 4] [5, 6] [7, 8]
    logger.debug('2W', groupDateByWeek(origin, 2).map(g => g.map(d => d.value)))
    expect(groupDateByWeek(origin, 2).map(g => g.map(d => d.value)))
      .toEqual([
        ['2018-05-21', '2018-05-24', '2018-05-28', '2018-05-30'],
        ['2018-06-04'],
        ['2018-06-20', '2018-06-25'],
        ['2018-07-02', '2018-07-03', '2018-07-06', '2018-07-09', '2018-07-11'],
      ])
  })

  it('能够正确按3星期分组', function () {
    // [{date: xxx, value: xxx}, ...]
    const origin = [
      '2018-05-21', '2018-05-24', // 1
      '2018-05-28', '2018-05-30', // 2
      '2018-06-04', // 3
      '2018-06-20', // 5
      '2018-06-25', // 6
      '2018-07-02', '2018-07-03', '2018-07-06', // 7
      '2018-07-09', '2018-07-11', // 8
    ].map(d => {
      return {
        value: d,
        date: getDate(d),
      }
    })

    //[1, 2] [3, 4, 5] [6, 7, 8]
    logger.debug('3W', groupDateByWeek(origin, 3).map(g => g.map(d => d.value)))
    expect(groupDateByWeek(origin, 3).map(g => g.map(d => d.value)))
      .toEqual([
        ['2018-05-21', '2018-05-24', '2018-05-28', '2018-05-30'],
        ['2018-06-04', '2018-06-20'],
        ['2018-06-25', '2018-07-02', '2018-07-03', '2018-07-06', '2018-07-09', '2018-07-11'],
      ])
  })

  it('能正确按照月分组', function () {
    const origin = [
      '2017-11-21',
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
        ['2017-11-21'],
        ['2017-12-21'],
        ['2018-01-28'],
        ['2018-03-25'],
        ['2018-06-02', '2018-06-12'],
        ['2018-07-11'],
      ])
  })

  it('能正确按照2月分组', function () {
    const origin = [
      '2017-11-21',
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

    logger.debug('2M', groupDateByMonth(origin, 2).map(g => g.map(d => d.value)))
    // [11], [12, 1] [2, 3], [4, 5] [6, 7]
    expect(groupDateByMonth(origin, 2).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-11-21'],
        ['2017-12-21', '2018-01-28'],
        ['2018-03-25'],
        ['2018-06-02', '2018-06-12', '2018-07-11'],
      ])
  })

  it('能正确按照3月分组', function () {
    const origin = [
      '2017-11-21',
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

    // 虽然结果和2个月分组一样，这是按照自然月分组而非数据的月份 [11, 12, 1] [2, 3, 4] [5, 6, 7]
    logger.debug('3M', groupDateByMonth(origin, 3).map(g => g.map(d => d.value)))
    expect(groupDateByMonth(origin, 3).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-11-21', '2017-12-21', '2018-01-28'],
        ['2018-03-25'],
        ['2018-06-02', '2018-06-12', '2018-07-11'],
      ])
  })

  it('能正确按年分组', function () {
    const origin = [
      '2017-11-21',
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

    expect(groupDateByYear(origin, 1).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-11-21', '2017-12-21'],
        ['2018-01-28', '2018-03-25', '2018-06-02', '2018-06-12', '2018-07-11'],
      ])

    expect(groupDateByYear(origin, 2).map(g => g.map(d => d.value)))
      .toEqual([
        ['2017-11-21', '2017-12-21', '2018-01-28', '2018-03-25', '2018-06-02', '2018-06-12', '2018-07-11'],
      ])
  })

  it('能正确创建amount = 1的时间范围', function () {
    const result = createTimeGroupZone(1, ['09:30', '09:32'], ['09:40', '09:42'])
    expect(result).toEqual({
      '09:30': '09:31',
      '09:31': '09:31',
      '09:32': '09:32',
      '09:40': '09:41',
      '09:41': '09:41',
      '09:42': '09:42',
    })
  })

  it('能正确创建amount = 5的时间范围边界情况', function () {
    const result = createTimeGroupZone(5, ['09:30', '09:40'])
    expect(result).toEqual({
      '09:30': '09:35',
      '09:31': '09:35',
      '09:32': '09:35',
      '09:33': '09:35',
      '09:34': '09:35',
      '09:35': '09:35',
      '09:36': '09:40',
      '09:37': '09:40',
      '09:38': '09:40',
      '09:39': '09:40',
      '09:40': '09:40',
    })
  })

  it('能正确创建amount = 5的时间范围', function () {
    const result = createTimeGroupZone(5, ['09:30', '09:41'])
    expect(result).toEqual({
      '09:30': '09:35',
      '09:31': '09:35',
      '09:32': '09:35',
      '09:33': '09:35',
      '09:34': '09:35',
      '09:35': '09:35',
      '09:36': '09:40',
      '09:37': '09:40',
      '09:38': '09:40',
      '09:39': '09:40',
      '09:40': '09:40',
      '09:41': '09:45',
    })
  })

  it('能够正确按照时间分组数据 amount = 1', function() {
    const data = [
      '2018-07-14 09:30:00',
      '2018-07-14 09:31:00',
      '2018-07-14 09:32:00',
      '2018-07-14 13:00:00',
      '2018-07-14 13:01:00',
      '2018-07-14 13:02:00',
      '2018-07-15 09:30:00',
      '2018-07-15 09:31:00',
      '2018-07-15 09:32:00',
      '2018-07-15 13:00:00',
      '2018-07-15 13:01:00',
      '2018-07-15 13:02:00',
    ].map(d => {
      return {
        date: new Date(d),
        value: d,
      }
    })

    const result = groupDateByMinute(data, 1)
    const keys = Object.keys(result)
    const values = Object.values(result).map(o => o.map(d => d.value))

    expect(keys).toEqual([
      '2018-07-14 09:31',
      '2018-07-14 09:32',
      '2018-07-14 13:01',
      '2018-07-14 13:02',
      '2018-07-15 09:31',
      '2018-07-15 09:32',
      '2018-07-15 13:01',
      '2018-07-15 13:02'
    ])

    expect(values).toEqual([
      ['2018-07-14 09:30:00', '2018-07-14 09:31:00'],
      ['2018-07-14 09:32:00'],
      ['2018-07-14 13:00:00', '2018-07-14 13:01:00'],
      ['2018-07-14 13:02:00'],
      ['2018-07-15 09:30:00', '2018-07-15 09:31:00'],
      ['2018-07-15 09:32:00'],
      ['2018-07-15 13:00:00', '2018-07-15 13:01:00'],
      ['2018-07-15 13:02:00']
    ])
  })

  it('能够正确按照时间分组数据 amount = 5', function() {
    const data = [
      '2018-07-14 09:30:00',
      '2018-07-14 09:31:00',
      '2018-07-14 09:35:00',
      '2018-07-14 09:36:00',
      '2018-07-14 09:40:00',
      '2018-07-14 09:41:00',
      '2018-07-15 09:30:00',
      '2018-07-15 09:31:00',
      '2018-07-15 09:35:00',
      '2018-07-15 09:36:00',
      '2018-07-15 09:40:00',
      '2018-07-15 09:41:00',
    ].map(d => {
      return {
        date: new Date(d),
        value: d,
      }
    })

    const result = groupDateByMinute(data, 5)
    const keys = Object.keys(result)
    const values = Object.values(result).map(o => o.map(d => d.value))


    // console.log(JSON.stringify(keys, null, 2))
    expect(keys).toEqual([
      '2018-07-14 09:35',
      '2018-07-14 09:40',
      '2018-07-14 09:45',
      '2018-07-15 09:35',
      '2018-07-15 09:40',
      '2018-07-15 09:45',
    ])

    // console.log(JSON.stringify(values, null, 2))
    expect(values).toEqual([
      ['2018-07-14 09:30:00', '2018-07-14 09:31:00', '2018-07-14 09:35:00'],
      ['2018-07-14 09:36:00', '2018-07-14 09:40:00'],
      ['2018-07-14 09:41:00'],
      ['2018-07-15 09:30:00', '2018-07-15 09:31:00', '2018-07-15 09:35:00'],
      ['2018-07-15 09:36:00', '2018-07-15 09:40:00'],
      ['2018-07-15 09:41:00'],
    ])
  })
})
