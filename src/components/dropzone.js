import { div, button } from '@cycle/dom'
import { merge, fromPromise } from 'most'
import sampleData from 'samples/data'

let preventDefault = event => {
  event.preventDefault()
  event.stopPropagation()
  return event
}

let fileReaderAsPromised = file =>
  new Promise((resolve, reject) => {
    if (file.type !== 'text/csv') {
      reject('File type must be a CSV')
    } else {
      let reader = new window.FileReader()
      reader.onload = event =>
        resolve({
          name: file.name.replace(/\.csv$/, ''),
          content: event.target.result
        })
      reader.readAsText(file)
    }
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

  let events$ = merge(start$, enter$, over$, leave$, drop$).map(preventDefault)
  let dragOver$ = events$.map(({ type }) => type === 'dragover')

  let buttonClick$ = btn.events('click')

  let processedFile$ = events$
    .filter(event => event.type === 'drop')
    .flatMap(processFile)

  let sampleFile$ = buttonClick$.map(() => ({
    name: 'sample',
    content: sampleData
  }))

  // let justData$ = just(sampleData)

  let file$ = merge(processedFile$, sampleFile$) //, justData$)

  let VDom$ = dragOver$.startWith(false).map(active =>
    div('.dropzone-container', [
      div('.dropzone', { class: { 'dropzone-active': active } }, [
        div('Drag .csv files here...'),
        button('.load', 'or just load sample')
      ])
    ])
  )

  return {
    DOM: VDom$,
    file: file$
  }
}
