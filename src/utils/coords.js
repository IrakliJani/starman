let fromRange = (min, max) => value => {
  if (value < min) return min
  if (value > max) return max
  else return value
}

let coordFromParams = (points, { width: w, height: h, gap }) => {
  let width = w - gap * 2
  let height = h - gap * 2
  let xs = points.map(p => p.x)
  let ys = points.map(p => p.y)
  let xBounds = { min: Math.min(...xs), max: Math.max(...xs) }
  let yBounds = { min: Math.min(...ys), max: Math.max(...ys) }
  let xRange = xBounds.max - xBounds.min
  let yRange = yBounds.max - yBounds.min
  let fromRangeY = fromRange(yBounds.min, yBounds.max)

  return {
    getScreenX: x => (x - xBounds.min) * width / xRange + gap,
    getScreenY: y => (y - yBounds.min) * height / yRange + gap,
    getPointY: y => fromRangeY(yBounds.min + (height - y + gap) / height * yRange)
  }
}

export default coordFromParams
