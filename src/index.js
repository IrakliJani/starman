// import xs from 'xstream'
import { run } from '@cycle/xstream-run'
import { makeDOMDriver, div } from '@cycle/dom'
import { csv1 } from './data'

const points = csv1
  .trim()
  .split(/\n/)
  .map(p => p.split(','))
  .map((p, i) => ({ i, x: +p[0], y: +p[1] }))

const pointStyle = (point, opts = { size: 6 }) => ({
  width: opts.size + 'px',
  height: opts.size + 'px',
  borderRadius: '100%',
  position: 'absolute',
  left: point.i * 10 - opts.size / 2 + 'px',
  top: point.y * 500 - opts.size / 2 + 'px',
  backgroundColor: 'black'
})

const containerStyle = {
  position: 'relative',
  width: '800px',
  height: '600px',
  backgroundColor: '#EFEFEF'
}

const pointView = point =>
  div('.point', { attrs: { id: point.i }, style: pointStyle(point, { size: 6 }) })

function main ({ DOM }) {
  const container = DOM.select('.container')

  const start$ = container.events('mousedown').filter(ev => ev.target.className === 'point')
  const move$ = container.events('mousemove')
  const stop$ = container.events('mouseup')

  const dom$ = start$
    .map(({ target }) => move$
      .map(event => ({ i: +target.id, y: event.y }))
      .endWhen(stop$.take(1))
    )
    .flatten()
    .map(({ i, y }) => {
      points[i].y = y / 500
      return points
    })
    .startWith(points)
    .map(p => div('.container', { style: containerStyle }, p.map(pointView)))

  return { DOM: dom$ }
}

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
