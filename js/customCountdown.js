import formatTime from "./util/formatTimer.js"
import { addDays, format } from "date-fns"
const dateInput = document.querySelector("#date")
const tomorrow = format(addDays(new Date(), 1), "yyyy-MM-dd")

let countDown

export default function setupCustomCountdown() {
  if (!dateInput) return
  dateInput.setAttribute("min", tomorrow)

  dateInput.addEventListener("change", (e) => {
    clearInterval(countDown)
    const holiday = new Date(e.target.value)
    console.log(holiday)

    countDown = setInterval(() => {
      const currentTime = new Date()

      const { day, hour, minute, second } = formatTime(currentTime, holiday)

      console.log(
        `%c剩下${day}天，${hour}小時，${minute}分鐘，${second}秒`,
        "font-size: 2em;"
      )
    }, 1000)
  })
}
