import { just, combineArray } from 'most'
import { div } from '@cycle/dom'
import Graph from 'components/graph'
import Slider from 'components/slider'

import coordFromParams from 'utils/coords'

import { csv2 as data } from 'data'

let points = data
  .trim()
  .split(/\n/)
  .map(p => p.split(','))
  .map(p => ({ x: +p[0], y: +p[1] }))
  .sort((a, b) => a.x - b.x)
  .map((p, i) => ({ i, ...p }))

let sizes = {
  width: 800,
  height: 600,
  gap: 20
}

let coords = coordFromParams(points, sizes)

let points$ = just(points)
let sizes$ = just(sizes)
let coords$ = just(coords)

export default function main ({ DOM }) {
  let { isolateSource, isolateSink } = DOM

  let {
    DOM: pointSizeSlider,
    value: pointSizeSliderValue$
  } = Slider({
    DOM: isolateSource(DOM, 'pointerSize'),
    props: just({ label: 'Point Size', unit: 'px', min: 2, value: 6, max: 10 })
  })

  let {
    DOM: pointDistanceSlider,
    value: pointDistanceSliderValue$
  } = Slider({
    DOM: isolateSource(DOM, 'pointerDistance'),
    props: just({ label: 'Distance Size', unit: 'px', min: 1, value: 1, max: 100 })
  })

  let {
    DOM: graphVDom$
  } = Graph({
    DOM,
    pointSize: pointSizeSliderValue$,
    pointDistance: pointDistanceSliderValue$,
    points: points$,
    sizes: sizes$,
    coords: coords$
  })

  let pointerSizeSliderVDom$ = isolateSink(pointSizeSlider, 'pointerSize')
  let pointerDistanceSliderVDom$ = isolateSink(pointDistanceSlider, 'pointerDistance')

  return {
    DOM: combineArray(Array, [graphVDom$, pointerSizeSliderVDom$, pointerDistanceSliderVDom$])
      .map(([graphVDom, pointSizeSliderVDom, pointDistanceSliderVDom]) =>
        div('.main_container', [
          div('graphviz'),
          graphVDom,
          pointSizeSliderVDom,
          pointDistanceSliderVDom
        ])
      )
  }
}
