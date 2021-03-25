export default function formatTimer(currentTime, targetTime) {
  const { monthsGap, daysGap, hoursGap, minutesGap, secondsGap } = getTimeGap(currentTime, targetTime)

  const day = daysGap
  const hour = hoursGap < 10 ? `0${hoursGap}` : hoursGap
  const minute = minutesGap < 10 ? `0${minutesGap}` : minutesGap
  const second = secondsGap < 10 ? `0${secondsGap}` : secondsGap
  return { month: monthsGap, day, hour, minute, second }
}

function getTimeGap(currentTime, targetTime) {
  const timeGap = targetTime - currentTime
  const monthsGap = getMonthsGap(currentTime, targetTime)
  const DaysGapMs = timeGap - monthsGap.ms
  const daysGap = Math.floor(DaysGapMs / timeMs('day'))
  const hoursGap = Math.floor((timeGap / timeMs('hour')) % 24)
  const minutesGap = Math.floor((timeGap / timeMs('minute')) % 60)
  const secondsGap = Math.floor((timeGap / timeMs('second')) % 60)
  return {
    monthsGap: monthsGap.month,
    daysGap,
    hoursGap,
    minutesGap,
    secondsGap
  }
}

function getMonthsGap(currentTime, targetTime) {
  let monthsGap = targetTime.getMonth() - currentTime.getMonth()
  monthsGap = targetTime.getDate() <= currentTime.getDate() ? monthsGap - 1 : monthsGap

  const daysInMonths = []

  for (let i = 0; i < monthsGap; i++) {
    const date = new Date(currentTime)
    date.setMonth(date.getMonth() + i)
    daysInMonths.push(getDaysInMonth(date))
  }

  const totalDaysOfMonthsGap = daysInMonths.reduce((a, b) => a + b, 0)

  return {
    month: monthsGap,
    ms: totalDaysOfMonthsGap * timeMs('day')
  }
}

function getDaysInMonth(date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const lastDayOfMonth = new Date(year, month + 1, 0)
  return lastDayOfMonth.getDate()
}

function timeMs(unit) {
  const second = 1000
  const minute = second * 60
  const hour = minute * 60
  const day = hour * 24

  if (unit === "second") return second
  if (unit === "minute") return minute
  if (unit === "hour") return hour
  if (unit === "day") return day
}
