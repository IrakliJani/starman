export const fromCSV = data => {
  return data
    .trim()
    .split(/\n/)
    .map(line => line.split(','))
    .filter(Boolean)
    .map(point => ({
      x: Number.parseFloat(point[0]),
      y: Number.parseFloat(point[1]),
      xOrig: point[0],
      yOrig: point[1],
    }))
    .filter(point => Boolean(point.x) && Boolean(point.y))
    .map((point, i) => ({ ...point, i }))
}

export const toCSV = points => {
  const maxPrecission = points.reduce((acc, point) => {
    if (isFloat(Number(point.yOrig))) {
      const precission = point.yOrig.split('.')[1].length
      return precission > acc ? precission : acc
    } else {
      return acc
    }
  }, 0)

  return points
    .map(point => {
      const yModified = maxPrecission > 0
        ? point.y.toFixed(maxPrecission).replace(/0+$/, '')
        : point.y

      return `${point.xOrig},${yModified}`
    })
    .join('\n')
}

function isFloat(n) {
  return n % 1 !== 0
}
