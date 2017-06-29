import { div, button, input } from '@cycle/dom'
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

let processFileDrop = event =>
  fromPromise(fileReaderAsPromised(event.dataTransfer.files[0]))

let processFileInput = event =>
  fromPromise(fileReaderAsPromised(event.target.files[0]))

export default function Dropzone({ DOM }) {
  let container = DOM.select('.dropzone-container')
  let btn = DOM.select('button.load')
  let fileInput = DOM.select('input.fileinput')

  let start$ = container.events('dragstart')
  let enter$ = container.events('dragenter')
  let over$ = container.events('dragover')
  let leave$ = container.events('dragleave')
  let drop$ = container.events('drop')
  let fileInput$ = fileInput.events('change')

  let events$ = merge(start$, enter$, over$, leave$, drop$).map(preventDefault)
  let dragOver$ = events$.map(({ type }) => type === 'dragover')

  let buttonClick$ = btn.events('click')

  let processedDroppedFile$ = events$
    .filter(event => event.type === 'drop')
    .flatMap(processFileDrop)

  let processedInputFile$ = fileInput$
    .flatMap(processFileInput)

  let sampleFile$ = buttonClick$.map(() => ({
    name: 'sample',
    content: sampleData
  }))

  // let justData$ = just(sampleData)

  let file$ = merge(processedDroppedFile$, processedInputFile$, sampleFile$) //, justData$)

  let VDom$ = dragOver$
    .startWith(false)
    .map(active =>
      div('.dropzone-container', [
        div('.dropzone', { class: { 'dropzone-active': active } }, [
          div('Open .csv File'),
          input('.fileinput', {
            attrs: { type: 'file' }
          }),
          div('.or', '- or -'),
          button('.load', 'load sample csv')
        ])
      ])
    )

  return {
    DOM: VDom$,
    file: file$
  }
}
