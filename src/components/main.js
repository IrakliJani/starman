import { just, combineArray, fromEvent } from 'most'
import { h2, div } from '@cycle/dom'
import { fromCSV } from 'utils/csv'
import Graph from 'components/graph'
import Table from 'components/table'
import Slider from 'components/slider'
import Dropzone from 'components/dropzone'
import Download from 'components/download'

export default function main ({ DOM }) {
  let { isolateSource, isolateSink } = DOM

  let { DOM: dropzoneVDom$, file: file$ } = Dropzone({ DOM })

  let points$ = file$.map(file => file.content).map(fromCSV)
  let fileName$ = file$.map(file => file.name)

  let resize$ = fromEvent('resize', window).startWith()

  let graphContainer$ = DOM.select('.graph-container').elements()
    .map(x => x[0])
    .filter(Boolean)

  let sizes$ = combineArray(Array, [resize$, graphContainer$.take(1)])
    .debounce(100)
    .map(([_, element]) => ({ width: element.offsetWidth, height: element.offsetHeight }))

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
    sizes: sizes$
  })

  let { DOM: tableVDom$ } = Table({ DOM, points: patchedPoints$, patches: pointPatches$ })

  let { DOM: downloadVDom$ } = Download({ DOM, patchedPoints: patchedPoints$, fileName: fileName$ })

  let pointSizeSliderVDom$ = isolateSink(pointSizeSlider, 'pointerSize')
  let pointDistanceSliderVDom$ = isolateSink(pointDistanceSlider, 'pointerDistance')

  let VDom$ = combineArray(Array, [
    dropzoneVDom$,
    graphVDom$.startWith(null),
    tableVDom$.startWith(null),
    pointSizeSliderVDom$,
    pointDistanceSliderVDom$,
    downloadVDom$.startWith(null),
    points$.startWith(null)
  ]).map(([
    dropzoneVDom,
    graphVDom,
    tableVDom,
    pointSizeSliderVDom,
    pointDistanceSliderVDom,
    downloadVDom,
    points
  ]) =>
    div('.container', [
      !points && dropzoneVDom,
      points && div('.graph-and-table-container', [
        div('.graph-header', [h2('Starman ✨')]),
        div('.graph-with-table', [
          div('.graph-container', [graphVDom]),
          tableVDom
        ]),
        div('.controls-container', [
          pointSizeSliderVDom,
          pointDistanceSliderVDom,
          downloadVDom
        ])
      ])
    ])
  )

  return {
    DOM: VDom$
  }
}
