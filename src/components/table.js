import { pre } from '@cycle/dom'

export default function Table (sources) {
  let { props: props$ } = sources

  let state$ = props$
    .map(points => points.map(point => `${point.i}\t${point.x}\t${point.y}`))

  let vdom$ = state$.map(points =>
    pre(points.join('\n'))
  )

  return {
    DOM: vdom$
  }
}
