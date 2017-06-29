import { button } from '@cycle/dom'
import { toCSV } from 'utils/csv'
import { saveAsFile } from 'utils/download'
import { combineArray } from 'most'

export default function Download({
  DOM,
  patchedPoints: patchedPoints$,
  fileName: fileName$
}) {
  let click$ = DOM.select('button.download').events('click')
  let csv$ = patchedPoints$.debounce(60).map(toCSV)

  combineArray(Array, [click$, fileName$])
    .map(([{ target }, fileName]) => saveAsFile(fileName, target.dataset.csv))
    .drain()

  let VDom$ = csv$.map(csv =>
    button('.download', { attrs: { 'data-csv': csv } }, 'Download')
  )

  return {
    DOM: VDom$
  }
}
