export function formatDay(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

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
  return str.length === 1 ? `0${str}` : str
}
