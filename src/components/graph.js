import { combineArray } from 'most'
import { div } from '@cycle/dom'

let px = size => `${size}px`

let pointStyle = (x, y, pointSize, pointDistance) => ({
  width: px(pointSize),
  height: px(pointSize),
  left: px((x - pointSize / 2) * pointDistance),
  bottom: px(y - pointSize / 2)
})

let graphStyle = ({ gap, width, height }) => ({
  padding: px(gap),
  minWidth: px(width),
  maxWidth: px(width),
  height: px(height)
})

let pointView = (id, x, y, pointSize, pointDistance) =>
  div('.point', { key: id, attrs: { id: id }, style: pointStyle(x, y, pointSize, pointDistance) })

export default function main ({
  DOM,
  points: points$,
  pointSize: pointSize$,
  pointDistance: pointDistance$,
  sizes: sizes$,
  coords: coords$
}) {
  let container = DOM.select('.graph')

  let start$ = container.events('mousedown')
    .filter(ev => ev.target.className === 'point')
  let move$ = container.events('mousemove')
  let stop$ = container.events('mouseup')

  let patches$ = start$.flatMap(({ target, currentTarget }) => {
    return move$
      .throttle(10)
      .until(stop$.take(1))
      .map(({ y }) => ({ i: +target.id, y: y - currentTarget.offsetTop + window.pageYOffset }))
  })

  let patchedPoints$ = combineArray(Array, [points$, coords$])
    .map(([points, coords]) => {
      return patches$.map(patch => {
        points[patch.i].y = coords.getPointY(patch.y)
        return points
      })
    })
    .startWith(points$)
    .flatMap(x => x)

  let vdom$ = combineArray(Array, [patchedPoints$, pointSize$, pointDistance$, sizes$, coords$])
    .map(([points, pointSize, pointDistance, sizes, coords]) => {
      return div('.container', [
        div('.graph', { style: graphStyle(sizes) },
          points.map(point => {
            return pointView(
              point.i,
              coords.getScreenX(point.x),
              coords.getScreenY(point.y),
              pointSize,
              pointDistance
            )
          })
        )
      ])
    })

  return {
    DOM: vdom$,
    points: patchedPoints$
  }
}
