export default function generateBuildNumber(options: { version?: any; versionSeparator?: any }) {
  let build = getBuildStamp()

  options || (options = {})
  if (typeof options === 'string') {
    options = { version: options }
  }
  const version = options.version
  if (version) {
    const versionSeparator = options.versionSeparator || '.'
    build = version.trim() + versionSeparator.trim() + build
  }

  return build
}

function getBuildStamp () {
  const now = new Date()
  const year = now.getFullYear() % 100
  const month = now.getMonth() + 1
  const day = now.getDate()
  // Count 2-minute intervals elapsed since midnight:(HH * 60 + MM) / 2
  const counter = parseInt(((now.getHours() * 60 + now.getMinutes()) / 2) as unknown as string)
  // Format the stamp as YYMMDDCCC
  return `${pad2(year)}${pad2(month)}${pad2(day)}${pad3(counter)}`
}

export function pad2 (value: number) {
  return value > 9 ? `${value}` : `0${value}`
}

export function pad3 (value: number) {
  /* c8 ignore next */
  return value > 99 ? `${value}` : value > 9 ? `0${value}` : `00${value}`
}