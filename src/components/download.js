import { button } from '@cycle/dom'

let toCSV = points =>
  points.map(point => `${point.x},${point.y}`).join('\n')

let saveFile = data => {
  let link = document.createElement('a')
  let blob = new window.Blob([data], { type: 'text/text;charset=utf-8;' })
  let url = window.URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', 'new_data.txt')
  link.click()
}

export default function Download ({ DOM, patchedPoints: patchedPoints$ }) {
  let click$ = DOM.select('button.download').events('click')
  let csv$ = patchedPoints$.debounce(60).map(toCSV)

  click$.map(({ target }) => saveFile(target.dataset.csv)).drain()

  let VDom$ = csv$.map(csv =>
    button('.download', { attrs: { 'data-csv': csv } }, 'Download')
  )

  return {
    DOM: VDom$
  }
}
