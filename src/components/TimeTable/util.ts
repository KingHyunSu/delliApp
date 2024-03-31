// prettier-ignore
export const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  }
}

interface GetArcSweep {
  startAngle: number
  endAngle: number
}
const getArcSweep = ({startAngle, endAngle}: GetArcSweep) => {
  // 호의 각도가 180도 이상이면 1, 아니면 0
  let arcSweep = '0'
  if (endAngle >= startAngle) {
    arcSweep = endAngle - startAngle <= 180 ? '0' : '1'
  } else {
    arcSweep = endAngle + 360.0 - startAngle <= 180 ? '0' : '1'
  }

  return arcSweep
}

interface DescribeArc {
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
}
// prettier-ignore
export const describeArc = ({
  x,
  y,
  radius,
  startAngle,
  endAngle,
}: DescribeArc) => {
  const start = polarToCartesian(x, y, radius, startAngle)
  const end = polarToCartesian(x, y, radius, endAngle)
  const arcSweep = getArcSweep({startAngle,endAngle})

  // prettier-ignore
  const d = [
    "M", start.x, start.y, 
    "A", radius, radius, 1, arcSweep, 1, end.x, end.y,
    "L", x,y,
    "L", start.x, start.y,
  ].join(" ");

  return {path:d, startCartesian: start, endCartesian: end}
}

interface DescribeBorder {
  x: number
  y: number
  radius: number
  startAngle: number
  endAngle: number
}
export const describeBorder = ({x, y, radius, startAngle, endAngle}: DescribeBorder) => {
  const start = polarToCartesian(x, y, radius, startAngle)
  const end = polarToCartesian(x, y, radius, endAngle)
  const arcSweep = getArcSweep({startAngle, endAngle})

  const d = ['M', start.x, start.y, 'A', radius, radius, 1, arcSweep, 1, end.x, end.y].join(' ')

  return {path: d, startCartesian: start, endCartesian: end}
}
