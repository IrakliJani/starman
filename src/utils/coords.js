const fromRange = (min, max) => value => {
  if (value < min) return min
  if (value > max) return max
  else return value
}

const coordFromParams = (points, { width, height, gap }) => {
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  const xBounds = { min: Math.min(...xs), max: Math.max(...xs) }
  const yBounds = { min: Math.min(...ys), max: Math.max(...ys) }
  const xRange = xBounds.max - xBounds.min
  const yRange = yBounds.max - yBounds.min
  const fromRangeY = fromRange(yBounds.min, yBounds.max)

  return {
    getScreenX: x => (x - xBounds.min) * width / xRange + gap,
    getScreenY: y => (y - yBounds.min) * height / yRange + gap,
    getPointY: y => fromRangeY(yBounds.min + (height - y + gap) / height * yRange)
  }
}

export default coordFromParams
