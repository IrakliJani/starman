let fromRange = (min, max) => value => {
  if (value < min) return min
  if (value > max) return max
  else return value
}

let coordFromParams = (points, { width, height, gap }) => {
  let w = width - gap * 2
  let h = height - gap * 2

  let xs = points.map(p => p.x)
  let ys = points.map(p => p.y)

  let xBounds = { min: Math.min(...xs), max: Math.max(...xs) }
  let yBounds = { min: Math.min(...ys), max: Math.max(...ys) }

  let xRange = xBounds.max - xBounds.min
  let yRange = yBounds.max - yBounds.min

  let fromRangeY = fromRange(yBounds.min, yBounds.max)

  return {
    getScreenX: x => (x - xBounds.min) * w / xRange + gap,
    getScreenY: y => (y - yBounds.min) * h / yRange + gap,
    getPointY: y => fromRangeY(yBounds.min + (h - y + gap) / h * yRange)
  }
}

export default coordFromParams
