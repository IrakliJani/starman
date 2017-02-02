import { div, table, tr, td } from '@cycle/dom'
import { combineArray } from 'most'

export default function Table (sources) {
  let { points: points$, sizes: sizes$ } = sources

  let state$ = points$.debounce(100)

  let vdom$ = combineArray(Array, [state$, sizes$])
    .map(([points, sizes]) =>
      div('.table-container', { style: { maxHeight: `${sizes.height + sizes.gap * 2}px` } }, [
        table('.table',
          points.map(point =>
            tr({ key: point.i }, [
              td(point.i.toString()),
              td(point.x.toFixed(5)),
              td(point.y.toFixed(5))
            ])
          )
        )
      ])
    )

  return {
    DOM: vdom$
  }
}
