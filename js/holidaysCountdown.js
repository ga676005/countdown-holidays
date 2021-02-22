import json from "../holidays.json"
import formatTimer from "./util/formatTimer"
let holiday, holidaysCountdownTimer
const holidays = json.holidays
const daysLeft = document.querySelector("#days-left")
const hoursLeft = document.querySelector("#hours-left")
const minutesLeft = document.querySelector("#minutes-left")
const secondsLeft = document.querySelector("#seconds-left")
const holidayHeading = document.querySelector("#holiday-heading")

export default function setupHolidaysCountdown() {
  countDown()
}

function countDown() {
  holidaysCountdownTimer = setInterval(() => {
    const currentTime = new Date()
    holiday = findClosestHoliday(holiday, currentTime)

    const isNowHoliday =
      currentTime > new Date(holiday.dateStart) &&
      currentTime < new Date(holiday.dateEnd)

    if (isNowHoliday) {
      const holidayDateEnd = new Date(holiday.dateEnd)
      const { day, hour, minute, second } = formatTimer(
        currentTime,
        holidayDateEnd
      )

      updateText(day, hour, minute, second, isNowHoliday)
    } else {
      const holidayDateStart = new Date(holiday.dateStart)
      const { day, hour, minute, second } = formatTimer(
        currentTime,
        holidayDateStart
      )

      updateText(day, hour, minute, second, isNowHoliday)
    }
  }, 1000)
}

function findClosestHoliday(holiday, currentTime) {
  const hasClosestHolidayEnd =
    holiday && currentTime > new Date(holiday.dateEnd)

  if (holiday && !hasClosestHolidayEnd) {
    console.log(hasClosestHolidayEnd)
    return holiday
  } //連假還沒過不用再往下找

  // 找下一個連假
  console.log("find next holiday")
  const [closestHoliday] = holidays.reduce(
    (acc, holiday) => {
      const currentHolidayDateStart = new Date(acc[0].dateStart)
      const currentHolidayDateEnd = new Date(acc[0].dateEnd)
      const entryDateStart = new Date(holiday.dateStart)
      const entryDateEnd = new Date(holiday.dateEnd)
      const hasCurrentHolidayPassed =
        currentTime > currentHolidayDateStart &&
        currentTime > currentHolidayDateEnd
      const entryHolidayHasPassed =
        currentTime > entryDateStart && currentTime > entryDateEnd
      const isEntryDateIsCloser = entryDateStart < currentHolidayDateStart

      // 如果目前連假已過直接換下一個連假
      if (hasCurrentHolidayPassed) {
        acc.splice(0, 1, holiday)
      } else {
        //目前連假的日期有效，檢查有沒有下一個日期更接近現在的連假
        if (!entryHolidayHasPassed && isEntryDateIsCloser) {
          acc.splice(0, 1, holiday)
        }
      }

      return acc
    },
    [holidays[0]]
  )

  return closestHoliday
}

function updateText(day, hour, minute, second, isNowHoliday) {
  daysLeft.textContent = `${day}`
  hoursLeft.textContent = `${hour}`
  minutesLeft.textContent = `${minute}`
  secondsLeft.textContent = `${second}`
  holidayHeading.innerHTML = isNowHoliday
    ? `<span>${holiday.name}</span>假期還剩`
    : `距離<span>${holiday.name}</span>連假還剩`
}
// setTimeout(() => {
//   clearInterval(holidaysCountdownTimer)
// }, 3500)
