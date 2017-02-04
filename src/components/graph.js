import { combineArray, just } from 'most'
import { div } from '@cycle/dom'
import coordFromParams from 'utils/coords'

let px = size => `${size}px`

let pointStyle = (x, y, pointSize, pointDistance) => ({
  width: px(pointSize),
  height: px(pointSize),
  left: px((x - pointSize / 2) * pointDistance),
  bottom: px(y - pointSize / 2)
})

let pointView = (id, x, y, pointSize, pointDistance) =>
  div('.point', { key: id, attrs: { id: id }, style: pointStyle(x, y, pointSize, pointDistance) })

const GAP = 20

export default function main ({
  DOM,
  sizes: sizes$,
  points: points$,
  pointSize: pointSize$,
  pointDistance: pointDistance$
}) {
  let container = DOM.select('.graph')

  let start$ = container.events('mousedown').filter(ev => ev.target.className === 'point')
  let move$ = container.events('mousemove')
  let stop$ = container.events('mouseup')

  let coords$ = combineArray(Array, [points$, sizes$])
    .map(([points, sizes]) =>
      coordFromParams(points, {
        ...sizes,
        gap: GAP
      })
    )

  let patches$ = start$
    .flatMap(({ target, currentTarget }) =>
      move$
        .throttle(60)
        .until(stop$.take(1))
        .map(({ y }) => ({ i: +target.id, y: y - currentTarget.offsetTop + window.pageYOffset }))
    )

  let patchedPoints$ = combineArray(Array, [points$, coords$])
    .map(([points, coords]) =>
      patches$.map(patch => {
        points[patch.i].y = coords.getPointY(patch.y)
        return points
      })
    )
    .startWith(points$)
    .flatMap(x => x)

  let vdom$ = combineArray(Array, [patchedPoints$, pointSize$, pointDistance$, coords$])
    .map(([points, pointSize, pointDistance, coords]) =>
      div('.graph', { style: { padding: px(GAP) } },
        points.map(point =>
          pointView(
            point.i,
            coords.getScreenX(point.x),
            coords.getScreenY(point.y),
            pointSize,
            pointDistance
          )
        )
      )
    )

  return {
    DOM: vdom$,
    patchedPoints: patchedPoints$,
    pointPatches: patches$
  }
}
