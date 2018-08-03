import {
  formatDay,
  formatDayHourMinute,
} from '../utils/time'
import Query from './index'
import Lane from '../lane/index'
import StoreDayLine from '../store/store.day-line'
import StoreDayLineMulti from '../store/store.day-line.multi'
import StoreMinuteLine from '../store/store.minute-line'
import StoreMinuteLineMulti from '../store/store.minute-line.multi'

const Unit_Map = {
  m: 'minute',
  D: 'day',
  W: 'day',
  M: 'day',
  S: 'day',
  Y: 'day',
}

export default class QueryDayLine extends Query {
  constructor(options) {
    super(options)
    this.store = this.switchStore(options)
  }

  /**
   * 首次加载数据、ZoomIn、ZoomOut
   * @param count
   */
  load(count) {
    this.count = count
  }

  next(step) {

  }

  prev(step) {

  }

  loadMore(count, end) {
    // 获取标准时间
    const now =  this.parseIndex(Lane.getTime())
    end = end || now

    // 本地最后一条数据时间
    const last = this.parseIndex(this.origin[this.origin.length - 1])

    // 需要数据的时间
    const time = this.parseIndex(end)

    if (this.needUpdate(last, now)) {
      // TODO update
    }

    const result = this._load(time, count, last)
    let fetchResult

    if (!this.isFinished && result.length < count) {
      fetchResult = this._fetch(result[0] || time, count - result.length)
    }

    this.changeData(fetchResult instanceof Array ? fetchResult.concat(result) : result)
  }

  changeData(data) {

  }

  _load(time, count, last) {
    let begin, end

    // 标记时间大于最后一条数据时间
    if (this.needUpdate(last, time)) {
      end = this.origin.length - 1
    } else {
      const item = this.originIndex[time]
      end = this.origin.indexOf(item)
    }

    begin = end - count
    return this.origin.slice(begin < 0 ? 0 : begin, end)
  }

  needUpdate(time, now) {
    return now >= time
  }

  parseIndex(obj) {
    const unitType = Unit_Map[this.unit]

    if (unitType === 'minute') {
      return formatDayHourMinute(obj)
    } else if (unitType === 'day') {
      return formatDay(obj)
    }

    return obj
  }

  switchStore(options) {
    _switchStore(options.code, options.period, options.unit)
    this.init(options)
    this.period = options.period
    this.unit = options.unit
  }
}

/**
 * 改变股票代码、周期、单位
 * @param code
 * @param period
 * @param unit
 * @returns {*}
 */
function _switchStore(code, period, unit) {
  const type = `${period}${unit}`
  const unitType = Unit_Map[unit]

  if (!unitType) {
    throw new Error(`错误的类型: ${type} !`)
  }

  let store = Lane.get(code, type)
  let storeOne
  if (store) {
    return store
  }

  if ('day' === unitType) {
    // 单日
    if (period === 1) {
      return Lane.add(new StoreDayLine({code}))
    }

    // 检查原始单日是否存在
    storeOne = Lane.get(code, '1d')
    if (!storeOne) {
      Lane.add(new StoreDayLine({code}))
    }

    store = new StoreDayLineMulti({
      code,
      type,
      store: storeOne,
    })
  } else if ('minute' === unitType) {
    // 单分钟
    if (period === 1) {
      return Lane.add(new StoreMinuteLine({code}))
    }

    // 检查原始单分钟是否存在
    storeOne = Lane.get(code, '1m')
    if (!storeOne) {
      Lane.add(new StoreMinuteLine({code}))
    }

    store = new StoreMinuteLineMulti({
      code,
      type,
      store: storeOne,
    })
  }

  Lane.add(store)
  return store
}
