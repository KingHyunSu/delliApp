import {polarToCartesian} from '@/components/TimeTable/util'

const getHourTextList = (center: number) => {
  const hourList = []

  for (let i = 1; i <= 24; i++) {
    const angle = i * 60 * 0.25

    const cartesian = polarToCartesian(center, center, center - 12, angle)
    let hour = i > 12 ? i % 12 : i
    hour = hour === 0 ? 12 : hour

    const dot = hour % 6 !== 0

    hourList.push({...cartesian, hour, angle, dot})
  }

  return hourList
    .map(item => {
      if (item.dot) {
        return `<circle cx="${item.x}" cy="${item.y}" r="1" fill="#7c8698" />`
      }

      return `
        <text 
          transform="translate(${item.x}, ${item.y}) rotate(${item.angle})" 
          text-anchor="middle" 
          font-size="16" 
          fill="#7c8698" 
          font-family="Pretendard-Regular">
          ${item.hour}
        </text>
      `
    })
    .join('')
}

interface Props {
  center: number
  radius: number
}
export default ({center, radius}: Props) => {
  const hourTextList = getHourTextList(center)

  return `
    <g>
      <circle 
        cx="${center}" 
        cy="${center}" 
        r="${radius}" 
        fill="#f5f6f8" 
        fill-opacity="1" 
        stroke-width="0.4" 
        stroke="#f5f6f8"/>
        ${hourTextList}
    </g>
  `
}
