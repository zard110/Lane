/* eslint-disable */
import isUndefined from 'lodash/isUndefined';

function concatParams(url, params) {
  if (!params || _.isEmpty(params)) {
    return url;
  }

  let result = [];
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key];
      if (!isUndefined(value)) {
        result.push(`${key}=${value}`);
      }
    }
  }

  return `${url}?${result.join('&')}`;
}

export function queryDayLine({ name, rows, interval }) {
  const base = `/api/data/${name}`;

  return window.fetch(concatParams(base, {
    rows,
    interval,
  }))
    .then(res => res.json())
    .then(({data}) => data.map(d => {
      return {
        date: new Date(d[0]),
        open: d[1],
        high: d[2],
        low: d[3],
        close: d[4],
        volume: d[5],
      }
    }));
}
