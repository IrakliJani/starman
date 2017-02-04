import { button } from '@cycle/dom'
import { toCSV } from 'utils/csv'
import { saveAsFile } from 'utils/download'

export default function Download ({ DOM, patchedPoints: patchedPoints$ }) {
  let click$ = DOM.select('button.download').events('click')
  let csv$ = patchedPoints$.debounce(60).map(toCSV)

  click$.map(({ target }) => saveAsFile(target.dataset.csv)).drain()

  let VDom$ = csv$.map(csv =>
    button('.download', { attrs: { 'data-csv': csv } }, 'Download')
  )

  return {
    DOM: VDom$
  }
}
