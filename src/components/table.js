import { table, tr, td } from '@cycle/dom'
import { merge, combineArray } from 'most'

export default function Table (sources) {
  let {
    DOM,
    points: points$,
    sizes: sizes$,
    patches: patches$
  } = sources

  patches$.delay(60).debounce(120).flatMap(patch =>
    DOM.select('.table').elements()
      .take(1)
      .flatMap(([table]) =>
        DOM.select(`.table tr:nth-child(${patch.i + 1}) td:last-child`).elements()
          .take(1)
          .map(([td]) => {
            table.scrollTop = td.offsetTop
            td.className = 'animated'
          })
      )
  ).observe(x => x) // TODO lame way to kick in.

  let state$ = merge(points$.take(1), points$.debounce(120))

  let vdom$ = combineArray(Array, [state$, sizes$])
    .map(([points, sizes]) =>
      table('.table', { style: { height: `${sizes.height + sizes.gap * 2}px` } },
        points.map(point =>
          tr([
            td(point.i.toString()),
            td(point.x.toFixed(5)),
            td({ key: `x:${point.i}:${point.y}` },
              point.y.toFixed(5)
            )
          ])
        )
      )
    )

  return {
    DOM: vdom$
  }
}
