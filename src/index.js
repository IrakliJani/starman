// import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import throttle from 'xstream/extra/throttle'
import { makeDOMDriver, div, pre } from '@cycle/dom'
import { csv1 } from './data'

const points = csv1
  .trim()
  .split(/\n/)
  .map(p => p.split(','))
  .map((p, i) => ({ i, x: +p[0], y: +p[1] }))

const pointStyle = (point, opts = { size: 6 }) => ({
  width: opts.size + 'px',
  height: opts.size + 'px',
  left: point.i * opts.size * 2 - opts.size / 2 + 'px',
  top: point.y * 500 - opts.size / 2 + 'px'
})

const pointView = point =>
  div('.point', { attrs: { id: point.i }, style: pointStyle(point, { size: 10 }) })

const tableView = points =>
  pre(points.map(point => `${point.i}\t${point.x}\t${point.y}\n`))

function main ({ DOM }) {
  const container = DOM.select('.graph')

  const start$ = container.events('mousedown').filter(ev => ev.target.className === 'point')
  const move$ = container.events('mousemove')
  const stop$ = container.events('mouseup')

  const dom$ = start$
    .map(({ target }) => move$
      .map(event => ({ i: +target.id, y: event.y }))
      .compose(throttle(10))
      .endWhen(stop$.take(1))
    )
    .flatten()
    .map(({ i, y }) => {
      points[i].y = y / 500
      return points
    })
    .startWith(points)
    .map(points =>
      div('.container', [
        div('.graph',
          points.map(pointView)
        ),
        tableView(points)
      ])
    )

  return { DOM: dom$ }
}

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
