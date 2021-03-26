import json from "../holidays.json"
import formatTimer from "./util/formatTimer"
import { addDays } from "date-fns"
let holiday, holidaysCountdownTimer
const holidays = json.holidays
const timeElements = document.querySelectorAll('.time')
const timeElementsContainer = document.querySelector('.main')
const holidayHeading = document.querySelector("#holiday-heading")

export default function setupHolidaysCountdown() {
  renderCounter()
  countDown()
}

function countDown() {
  holidaysCountdownTimer = setInterval(renderCounter, 1000)
}

function renderCounter() {
  const currentTime = new Date()
  holiday = findClosestHoliday(holiday, currentTime)
  const holidayStart = new Date(holiday.dateStart)
  const holidayEnd = addDays(holidayStart, holiday.duration)
  const isNowHoliday = currentTime > holidayStart && currentTime < holidayEnd
  const targetDate = isNowHoliday ? holidayEnd : holidayStart

  updateText(currentTime, targetDate, isNowHoliday)
}

function findClosestHoliday(holiday, currentTime) {
  if (holiday) {
    const holidayEnd = addDays(new Date(holiday.dateStart), holiday.duration)
    const hasClosestHolidayEnd = currentTime > holidayEnd

    //連假還沒過不用再往下找
    if (!hasClosestHolidayEnd) return holiday
  }

  // 找下一個連假
  const closestHoliday = holidays.reduce((currentClosestHoliday, holiday) => {
    const {
      hasCurrentHolidayPassed,
      entryHolidayHasPassed,
      entryDateIsCloser
    } = filterHoliday(currentClosestHoliday, holiday, currentTime)

    // 如果目前連假已過直接換下一個連假
    if (hasCurrentHolidayPassed) return holiday

    //目前連假的日期有效，檢查有沒有下一個日期更接近現在的連假
    if (!entryHolidayHasPassed && entryDateIsCloser) return holiday

    return currentClosestHoliday
  }, holidays[0])

  return closestHoliday
}

function filterHoliday(currentHoliday, targetHoliday, currentTime) {
  const currentHolidayDateStart = new Date(currentHoliday.dateStart)
  const currentHolidayDateEnd = addDays(
    currentHolidayDateStart,
    currentHoliday.duration
  )
  const entryDateStart = new Date(targetHoliday.dateStart)
  const entryDateEnd = addDays(entryDateStart, targetHoliday.duration)

  const hasCurrentHolidayPassed =
    currentTime > currentHolidayDateStart
    && currentTime > currentHolidayDateEnd

  const entryHolidayHasPassed =
    currentTime > entryDateStart
    && currentTime > entryDateEnd

  const entryDateIsCloser = entryDateStart < currentHolidayDateStart

  return { hasCurrentHolidayPassed, entryHolidayHasPassed, entryDateIsCloser }
}

function updateText(currentTime, targetDate, isNowHoliday) {
  const timeValues = formatTimer(currentTime, targetDate)

  timeElements.forEach(e => e.textContent = timeValues[e.dataset.unit])
  timeElementsContainer.classList.toggle('show-month', timeValues.month > 0)

  holidayHeading.innerHTML = isNowHoliday
    ? `<span class="holiday-name">${holiday.name}</span>假期還有`
    : `距離<span class="holiday-name">${holiday.name}</span>連假`
  holidayHeading.dataset.heading = holiday.name
}
