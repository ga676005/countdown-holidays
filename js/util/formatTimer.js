export default function formatTimer(currentTime, targetTime) {
  const daysLeft = Math.floor((targetTime - currentTime) / 1000 / 60 / 60 / 24)
  const hoursLeft = Math.floor(
    ((targetTime - currentTime) / 1000 / 60 / 60) % 24
  )
  const minutesLeft = Math.floor(((targetTime - currentTime) / 1000 / 60) % 60)
  const secondsLeft = Math.floor(((targetTime - currentTime) / 1000) % 60)

  const day = daysLeft < 10 ? `0${daysLeft}` : daysLeft
  const hour = hoursLeft < 10 ? `0${hoursLeft}` : hoursLeft
  const minute = minutesLeft < 10 ? `0${minutesLeft}` : minutesLeft
  const second = secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft
  return { day, hour, minute, second }
}
