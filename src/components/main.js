import { just, combineArray } from 'most'
import { div } from '@cycle/dom'
import Graph from 'components/graph'
import Slider from 'components/slider'

import { csv2 as data } from 'data'

let points = data
  .trim()
  .split(/\n/)
  .map(p => p.split(','))
  .map(p => ({ x: +p[0], y: +p[1] }))
  .sort((a, b) => a.x - b.x)
  .map((p, i) => ({ i, ...p }))

let points$ = just(points)
let sizes$ = just({
  width: 800,
  height: 600,
  gap: 20
})

export default function main ({ DOM }) {
  let { DOM: sliderVDom$, value: sliderValue$ } = Slider({
    DOM,
    props: just({ label: 'Point size', unit: 'px', min: 2, value: 6, max: 10 })
  })
  let { DOM: graphVDom$ } = Graph({
    DOM,
    pointSize: sliderValue$,
    points: points$,
    sizes: sizes$
  })

  return {
    DOM: combineArray(Array, [graphVDom$, sliderVDom$])
      .map(([graphVDom, sliderVDom]) =>
        div('.main_container', [
          // div('graphviz'),
          graphVDom,
          sliderVDom
        ])
      )
  }
}
