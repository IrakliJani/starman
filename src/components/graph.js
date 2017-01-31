import { combineArray } from 'most'
import { div } from '@cycle/dom'
import coordFromParams from 'utils/coords'

let px = size => `${size}px`

let pointStyle = (x, y, size) => ({
  width: px(size),
  height: px(size),
  left: px(x - size / 2),
  bottom: px(y - size / 2)
})

let graphStyle = ({ gap, width, height }) => ({
  padding: px(gap),
  minWidth: px(width),
  maxWidth: px(width),
  height: px(height)
})

let pointView = (id, x, y, pointSize) =>
  div('.point', { key: id, attrs: { id: id }, style: pointStyle(x, y, pointSize) })

// let tableView = points =>
//   pre(points.map(point => `${point.x.toFixed(4)}\t${point.y.toFixed(3)}\n`))

export default function main ({
  DOM,
  points: points$,
  pointSize: pointSize$,
  sizes: sizes$
}) {
  let container = DOM.select('.graph')

  const start$ = container.events('mousedown')
    .filter(ev => ev.target.className === 'point')
  const move$ = container.events('mousemove')
  const stop$ = container.events('mouseup')

  let patches$ = start$.flatMap(({ target }) => {
    return move$
      .throttle(10)
      .until(stop$.take(1))
      .map(({ y }) => ({ i: +target.id, y: y }))
  })

  let patchedPoints$ = combineArray(Array, [points$, sizes$])
    .map(([points, sizes]) => {
      let coords = coordFromParams(points, sizes)

      return patches$.map(patch => {
        points[patch.i].y = coords.getPointY(patch.y)
        return points
      })
    })
    .startWith(points$)
    .flatMap(x => x)

  let vdom$ = combineArray(Array, [patchedPoints$, pointSize$, sizes$])
    .map(([points, pointSize, sizes]) => {
      let coords = coordFromParams(points, sizes)

      return div('.container', [
        div('.graph', { style: graphStyle(sizes) },
          points.map(point => {
            return pointView(
              point.i,
              coords.getScreenX(point.x),
              coords.getScreenY(point.y),
              pointSize
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
