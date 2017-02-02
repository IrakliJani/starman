import { just, combineArray } from 'most'
import { h2, div } from '@cycle/dom'
import coordFromParams from 'utils/coords'
import Graph from 'components/graph'
import Table from 'components/table'
import Slider from 'components/slider'
import Dropzone from 'components/dropzone'

let sizes = {
  width: 800,
  height: 600,
  gap: 20
}

let processFile = data =>
  data
    .trim()
    .split(/\n/)
    .map(p => p.split(','))
    .map(p => ({ x: +p[0], y: +p[1] }))
    .sort((a, b) => a.x - b.x)
    .map((p, i) => ({ i, ...p }))

let sizes$ = just(sizes)

export default function main ({ DOM }) {
  let { isolateSource, isolateSink } = DOM

  let { DOM: dropzoneVDom$, file: file$ } = Dropzone({ DOM })

  let points$ = file$.map(processFile)
  let coords$ = points$.map(points => coordFromParams(points, sizes))

  let { DOM: pointSizeSlider, value: pointSizeSliderValue$ } = Slider({
    DOM: isolateSource(DOM, 'pointerSize'),
    props: just({ label: 'Point Size', unit: 'pt', min: 2, value: 6, max: 10 })
  })

  let { DOM: pointDistanceSlider, value: pointDistanceSliderValue$ } = Slider({
    DOM: isolateSource(DOM, 'pointerDistance'),
    props: just({ label: 'Distance Size', unit: 'pt', min: 1, value: 1, max: 100 })
  })

  let { DOM: graphVDom$, patchedPoints: patchedPoints$, pointPatches: pointPatches$ } = Graph({
    DOM,
    pointSize: pointSizeSliderValue$,
    pointDistance: pointDistanceSliderValue$,
    points: points$,
    sizes: sizes$,
    coords: coords$
  })

  let { DOM: tableVDom$ } = Table({
    DOM,
    points: patchedPoints$,
    patches: pointPatches$,
    sizes: sizes$
  })

  let pointSizeSliderVDom$ = isolateSink(pointSizeSlider, 'pointerSize')
  let pointDistanceSliderVDom$ = isolateSink(pointDistanceSlider, 'pointerDistance')

  let VDom$ = combineArray(Array, [
    dropzoneVDom$,
    graphVDom$.startWith(null),
    tableVDom$.startWith(null),
    pointSizeSliderVDom$,
    pointDistanceSliderVDom$
  ]).map(([
    dropzoneVDom,
    graphVDom,
    tableVDom,
    pointSizeSliderVDom,
    pointDistanceSliderVDom
  ]) =>
    div('.container', [
      graphVDom ? null : dropzoneVDom,
      h2('Starman ✨'),
      div('.graph-container', [
        graphVDom,
        tableVDom
      ]),
      div('.sliders-container', [
        pointSizeSliderVDom,
        pointDistanceSliderVDom
      ])
    ])
  )

  return {
    DOM: VDom$
  }
}
