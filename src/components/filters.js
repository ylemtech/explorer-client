import { utils } from "web3"
/**
 * Format time
 *
 * @param {date} date
 * @param {string} format
 * @returns
 */
export function formatTime(date, format = 'yyyy-MM-dd hh:mm:ss') {
  if (!date) return ''
  if (typeof date === 'number') {
    if (Math.floor(date / 1e9) > 0 && Math.floor(date / 1e9) < 10) {
      date = date * 1000
    }
    date = new Date(date)
  } else if (typeof date === 'string') {
    // timestamp in secounds
    if (/^\d{10}$/.test(date)) {
      date = new Date(date * 1000)
    } else {
      // Using the new Date (yyyy MM dd hh: mm: ss: SS) time format string in iOS cannot be precise beyond the hour
      var dateArr = date.split(/[- :]/)
      var now = new Date()
      date = new Date(dateArr[0] || now.getFullYear(), dateArr[1] && parseInt(dateArr[1]) ? parseInt(dateArr[1]) - 1 : (now.getMonth() - 1), dateArr[2] || 1, dateArr[3] || 0, dateArr[4] || 0, dateArr[5] || 0)
    }
  } else {
    /* eslint-disable-next-line */
    console.error('wrong format', date)
    return ''
  }

  if (format === 'timestamp') return +date

  var map = {
    'M': date.getMonth() + 1, // M
    'd': date.getDate(), // d
    'h': date.getHours(), // h
    'm': date.getMinutes(), // m
    's': date.getSeconds(), // s
    'q': Math.floor((date.getMonth() + 3) / 3), // q
    'S': date.getMilliseconds(), // S
    'W': '星期' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()] // W
  }
  format = format.replace(/([yMdhmsqSW])+/g, function (all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return format
}

/**
 * "yyyy-MM-dd hh:mm:ss"
 */
export let fulltime = (timestamp) => {
  return formatTime(timestamp, "yyyy-MM-dd hh:mm:ss")
}

/*
 * Truncate hash
 */
export let filterHash = str => String(str).substr(0, 18) + '...' ;

export function formatValue(v) {
  let value = thousands("" + toTokens(hexToNumberString(v)))
  return value
}
export function thousands(s) {
  try {
    return s.replace(/\d+/, function (n) {
      return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    });
  } catch (e) {
    return s;
  }
}
export function prettytime(timestamp) {
  let now = new Date().getTime();
  now = Math.round(now / 1000);
  let span = now - timestamp;
  if (span <= 0) span = 1;

  var days = parseInt(span / ( 60 * 60 * 24));
  if (days > 0) {
    return days==1?days+"day":days+"days";
  }
  var hours = parseInt((span % (60 * 60 * 24)) / ( 60 * 60));
  if (hours > 0) {
    return hours==1?hours+"h":hours+"hs";
  }
  var minutes = parseInt((span % ( 60 * 60)) / ( 60));
  if (minutes > 0) {
    return minutes==1?minutes+"min":minutes+"mins";
  }
  return span  + "s";
}
export function hexToNumberString(s) {
  if (s == "") {
    s = "0x";
  }
  try {
    return utils.hexToNumberString(s);
  } catch (e) {
    return s;
  }
}
export function hexToAscii(s) {
  if (s == "") {
    s = "0x";
  }
  try {
    return utils.hexToAscii(s);
  } catch (e) {
    return s;
  }
}
export function toTokens(s) {
  try {
    return utils.fromWei(s, "ether");
  } catch (e) {
    return s;
  }
}





export let blockDetail = (height) => {
  return `/blockDetail?height=${height}`
}

export let addressDetail = (address) => {
  return `/addressDetail?address=${address}`
}

export let tradeHash = (hash) => {
  return `/tradeHash?hash=${hash}`
}
// Omitting the middle x bit for ease of memory and displaying the last 4 bits
export let addressEll = (str) => {
  if (!str) return ''
  return str.replace(/^(\w{10})(\w+)(\w{4})$/, '$1...$3')
}

// Verify if the address contains Chinese characters
export let addressCN = (str) => {
  let valid = /.*[\u4e00-\u9fa5]+.*$/.test(str)
  return valid
}





export default {
  formatTime,
  fulltime,
  formatValue,
  filterHash,
  blockDetail,
  addressDetail,
  tradeHash,
  addressEll,
  addressCN,
}