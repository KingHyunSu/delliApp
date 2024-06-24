import {describeArc} from '@/components/TimeTable/util'

interface Props {
  data: Schedule
  center: number
  radius: number
}
export default ({data, center, radius}: Props) => {
  const startAngle = data.start_time * 0.25
  const endAngle = data.end_time * 0.25
  const {path} = describeArc({
    x: center,
    y: center,
    radius,
    startAngle,
    endAngle
  })

  const textX = Math.round(center + (radius / 100) * data.title_x)
  const textY = Math.round(center - (radius / 100) * data.title_y)

  const titleTextList = data.title.split('\n')
  const titleText = titleTextList
    .map(item => {
      return `<tspan x="0" dy="1em">${item}</tspan>`
    })
    .join('')

  return `
    <path d="${path}" fill="${data.background_color}" stroke-width="0.4" stroke="#f5f6f8"/>
    <text 
      transform="translate(${textX}, ${textY}) rotate(${data.title_rotate})"
      fill="${data.text_color}"
      font-size="10"
      font-family="Pretendard-Medium"
      dy="0">
      ${titleText}
    </text>
  `
}
