export function getToday() {
  const date = new Date();
  date.setUTCHours(0);
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

  result.setSeconds(0)
  result.setMilliseconds(0)
  return result
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
