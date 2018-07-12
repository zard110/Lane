import {
  startOfMonth,
  startOfWeek,
  startOfYear,
  subWeeks,
  subMonths,
  subYears,
} from 'date-fns'

export function getToday() {
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

export function addDays(date, count) {
  const result = new Date(date);
  result.setDate(result.getDate() + count);
  return result;
}

export function getDate(date) {
  const result = new Date(date)
  result.setHours(0)
  result.setSeconds(0)
  result.setMilliseconds(0)
  return result
}

export function getTime(time) {
  return new Date(time)
}

export function formatDay(date) {
  const year = date.getFullYear()
  const month = _patch(date.getMonth() + 1)
  const day = _patch(date.getDate())

  return `${year}-${month}-${day}`
}

export function formateTime(date) {
  const day = formatDay(date)
  const hour = _patch(date.getHours())
  const min = _patch(date.getMinutes())
  const sec = _patch(date.getSeconds())

  return `${day} ${hour}:${min}:${sec}`
}

function _patch(str) {
  str += ''
  return str.length === 1 ? `0${str}` : str
}

/**
 * 分组日期生成器
 * @param sub
 * @returns {Function}
 */
function groupDateProvider(sub) {
  return function (data, amount = 1, accessor = d => d.date) {
    if (!data || !data.length) {
      return []
    }

    const first = accessor(data[0])
    const last = accessor(data[data.length - 1])
    let startDate = sub(last, amount)
    const result = []
    let temp = []

    for (let i = data.length - 1; i >= 0; i--) {
      const d = data[i]
      const date = accessor(d)

      // 如果还在日期范围，则暂存
      if (date >= startDate) {
        temp.unshift(d)
      } else {
        // 已经超过指定日期范围，重新计算
        result.unshift(temp)
        temp = [d]

        while (startDate > date) {
          startDate = sub(startDate, amount + 1)
        }
      }
    }
    if (temp.length) {
      result.unshift(temp)
    }

    return result
  }
}

/**
 * 按星期分组
 * @param data
 * @param amount
 * @param accessor
 * @returns {*}
 */
export function groupDateByWeek(data, amount = 1, accessor = d => d.date) {
  return groupDateProvider(subStartWeeks)(data, amount, accessor)
}

/**
 * 按月分组
 * @param data
 * @param amount
 * @param accessor
 * @returns {*}
 */
export function groupDateByMonth(data, amount = 1, accessor = d => d.date) {
  return groupDateProvider(subStartMonths)(data, amount, accessor)
}

/**
 * 按季度分组
 * @param data
 * @param amount
 * @param accessor
 * @returns {*}
 */
export function groupDateBySeason(data, amount = 1, accessor = d => d.date) {
  return groupDateProvider(subStartSeasons)(data, amount, accessor)
}

/**
 * 按年分组
 * @param data
 * @param amount
 * @param accessor
 * @returns {*}
 */
export function groupDateByYear(data, amount = 1, accessor = d => d.date) {
  return groupDateProvider(subStartYears)(data, amount, accessor)
}

/**
 * 获取周线周期的开始日期
 *
 * ._____. .___.___. .__.
 * A1   A5|B1  B3 B5|C1 C3
 *
 * 假设当前日期是C3(星期3),数据结构如上图
 *
 * 1.要获取周线数据.第一组数据应该是从C1~C3,即: subWeeks(C3, 0) ===> C3, 再获取C3所在周的第一天 ===> C1
 * 2.要获取2周线数据,第一组数据应该是从B1~C3,即: subWeeks(C3, 1) ===> B3, 再获取B3所在周的第一天 ===> B1
 * 3.以此类推,得到需要的数据
 *
 * @param {*} date
 * @param {*} amount
 */
export function subStartWeeks(date, amount) {
  const subDate = subWeeks(date, amount - 1)
  return startOfWeek(subDate, {
    weekStartsOn: 1
  })
}

/**
 * 获取月线周期开始日期
 * @param {*} date
 * @param {*} amount
 */
export function subStartMonths(date, amount) {
  const subDate = subMonths(date, amount - 1)
  return startOfMonth(subDate)
}

/**
 * 获取年线开始日期
 * @param {*} date
 * @param {*} amount
 */
export function subStartYears(date, amount) {
  const subDate = subYears(date, amount - 1)
  return startOfYear(subDate)
}

/**
 * 获取季线开始日期
 * @param {*} date
 * @param {*} amount
 */
export function subStartSeasons(date, amount) {
  let month = date.getMonth() + 1
  let year = date.getFullYear()

  // 每次递减1
  if (amount > 1) {
    if (month >= 10) {
      month = 7
    } else if (month >= 7) {
      month = 4
    } else if (month >= 4) {
      month = 1
    } else {
      month = 10
      year--
    }

    return subStartSeasons(new Date(year, month - 1, 1), --amount)
  } else {
    if (month >= 10) {
      month = 10
    } else if (month >= 7) {
      month = 7
    } else if (month >= 4) {
      month = 4
    } else {
      month = 1
    }

    return new Date(year, month - 1, 1)
  }
}

