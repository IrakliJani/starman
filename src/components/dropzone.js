import { div } from '@cycle/dom'
import { merge, fromPromise, just } from 'most'

let preventDefault = event => {
  event.preventDefault()
  event.stopPropagation()
  return event
}

let fileReaderAsPromised = file => {
  return new Promise((resolve, reject) => {
    let reader = new window.FileReader()
    reader.onload = e => resolve(e.target.result)
    reader.readAsText(file)
  })
}

let processFile = event =>
  fromPromise(fileReaderAsPromised(event.dataTransfer.files[0]))

export default function Dropzone ({ DOM }) {
  let container = DOM.select('.dropzone-container')

  let start$ = container.events('dragstart')
  let enter$ = container.events('dragenter')
  let over$ = container.events('dragover')
  let leave$ = container.events('dragleave')
  let drop$ = container.events('drop')

  let file$ = merge(start$, enter$, over$, leave$, drop$)
    .map(preventDefault)
    .filter(event => event.type === 'drop')
    .flatMap(processFile)

  let VDom$ = just(
    div('.dropzone-container', [
      div('.dropzone', [
        div('Drag files here...')
      ])
    ])
  )

  return {
    DOM: VDom$,
    file: file$
  }
}
