// import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { makeDOMDriver, div, pre } from '@cycle/dom'
import { test } from './data'

const points = test
  .trim()
  .split(/\n/)
  .map(p => p.split(','))
  .map((p, i) => ({ i, x: +p[0], y: +p[1] }))

const gap = 20
const width = 800
const height = 600

const xs = points.map(p => p.x)
const ys = points.map(p => p.y)
const xBounds = { min: Math.min(...xs), max: Math.max(...xs) }
const yBounds = { min: Math.min(...ys), max: Math.max(...ys) }
const xRange = xBounds.max - xBounds.min
const yRange = yBounds.max - yBounds.min

const getScreenX = point => (point.x - xBounds.min) * width / xRange + gap
const getScreenY = point => (point.y - yBounds.min) * height / yRange + gap
const getPointY = point => yBounds.min + (height - point.y + gap) / height * yRange

const px = size => `${size}px`

const pointStyle = (point, opts = { size: 6 }) => ({
  width: px(opts.size),
  height: px(opts.size),
  left: px(getScreenX(point) - opts.size / 2),
  bottom: px(getScreenY(point) - opts.size / 2)
})

const graphStyle = (gap, width, height) => ({
  padding: px(gap),
  minWidth: px(width),
  maxWidth: px(width),
  height: px(height)
})

const pointView = point =>
  div('.point', { attrs: { id: point.i }, style: pointStyle(point) })

const tableView = points =>
  pre(points.map(point => `${point.i}\t${point.x}\t${point.y}\n`))

function main ({ DOM }) {
  const container = DOM.select('.graph')

  const start$ = container.events('mousedown').filter(ev => ev.target.className === 'point')
  const move$ = container.events('mousemove')
  const stop$ = container.events('mouseup')

  const dom$ = start$
    .map(({ target }) => move$
      .map(event => ({ i: +target.id, y: getPointY(event) }))
      .endWhen(stop$.take(1))
    )
    .flatten()
    .map(({ i, y }) => {
      points[i].y = y
      return points
    })
    .startWith(points)
    .map((points) =>
      div('.container', [
        div('.graph', { style: graphStyle(gap, width, height) },
          points.map(pointView)
        ),
        tableView(points)
      ])
    )

  return { DOM: dom$ }
}

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
