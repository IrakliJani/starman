import { table, tr, td } from '@cycle/dom'
import { merge, combineArray } from 'most'

export default function Table (sources) {
  let {
    DOM,
    patches: patches$,
    points: points$,
    sizes: sizes$
  } = sources

  patches$
    .delay(60)
    .debounce(120)
    .flatMap(patch =>
      DOM.select('.table').elements()
        .take(1)
        .map(([table]) =>
          DOM.select(`.table tr:nth-child(${patch.i + 1}) td:last-child`).elements()
            .take(1)
            .map(elements => elements[0])
            .forEach(td => {
              table.scrollTop = td.offsetTop
              td.className = 'animated'
            })
        )
    )
    .drain()

  let state$ = merge(points$.take(1), points$.debounce(120))

  let vdom$ = combineArray(Array, [state$, sizes$])
    .map(([points, sizes]) =>
      table('.table', { style: { height: `${sizes.height + sizes.gap * 2}px` } },
        points.map(point =>
          tr([
            td(point.i.toString()),
            td(point.x.toFixed(5)),
            td({ key: `x:${point.x}:${point.y}` }, point.y.toFixed(5))
          ])
        )
      )
    )

  return {
    DOM: vdom$
  }
}
