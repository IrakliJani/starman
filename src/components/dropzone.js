import { div, button } from '@cycle/dom'
import { merge, fromPromise, just } from 'most'
import sampleData from 'samples/data'

let preventDefault = event => {
  event.preventDefault()
  event.stopPropagation()
  return event
}

let fileReaderAsPromised = file =>
  new Promise((resolve, reject) => {
    let reader = new window.FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.readAsText(file)
  })

let processFile = event =>
  fromPromise(fileReaderAsPromised(event.dataTransfer.files[0]))

export default function Dropzone ({ DOM }) {
  let container = DOM.select('.dropzone-container')
  let btn = DOM.select('button.load')

  let start$ = container.events('dragstart')
  let enter$ = container.events('dragenter')
  let over$ = container.events('dragover')
  let leave$ = container.events('dragleave')
  let drop$ = container.events('drop')

  let buttonClick$ = btn.events('click')

  let processedFile$ = merge(start$, enter$, over$, leave$, drop$)
    .map(preventDefault)
    .filter(event => event.type === 'drop')
    .flatMap(processFile)

  let sampleFile$ = buttonClick$.map(() => sampleData)

  // let justData$ = just(sampleData)

  let file$ = merge(processedFile$, sampleFile$) //, justData$)

  let VDom$ = just(
    div('.dropzone-container', [
      div('.dropzone', [
        div('Drag .dat files here...'),
        button('.load', 'or just load sample')
      ])
    ])
  )

  return {
    DOM: VDom$,
    file: file$
  }
}
