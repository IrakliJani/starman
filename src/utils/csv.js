let fromCSV = data =>
  data
    .trim()
    .split(/\n/)
    .map(p => p.split(','))
    .filter(Boolean)
    .map((p, i) => ({ i, x: +p[0], y: +p[1] }))
    .filter(p => Boolean(p.x) && Boolean(p.y))
    .sort((a, b) => a.x - b.x)

let toCSV = points =>
  points.map(point => `${point.x},${point.y}`).join('\n')

export { fromCSV, toCSV }
