export const fromCSV = data => {
  return data
    .trim()
    .split(/\n/)
    .map(line => line.split(','))
    .filter(Boolean)
    .map(points => ({ x: Number(points[0]), y: Number(points[1]) }))
    .filter(p => Boolean(p.x) && Boolean(p.y))
    .map((p, i) => ({ ...p, i }))
}

export const toCSV = points => {
  return points
    .map(point => `${point.x},${point.y}`)
    .join('\n')
}
