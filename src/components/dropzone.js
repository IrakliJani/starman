import { pre } from '@cycle/dom'
import { combineArray } from 'most'

export default function Table (sources) {
  let { points: points$, sizes: sizes$ } = sources

  let state$ = points$
    .map(points => points.map(point => `${point.i}\t${point.x}\t${point.y}`))

  let vdom$ = combineArray(Array, [state$, sizes$])
    .map(([points, sizes]) =>
      pre('.table', { style: { height: `${sizes.height + sizes.gap * 2}px` } },
        points.join('\n')
      )
    )

  return {
    DOM: vdom$
  }
}
