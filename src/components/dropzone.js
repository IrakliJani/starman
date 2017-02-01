import { div } from '@cycle/dom'
import { just } from 'most'

export default function Dropzone ({ DOM }) {
  let VDom$ = just(
    div('.dropzone-container', [
      div('.dropzone', [
        div('Drag files here...')
      ])
    ])
  )

  return {
    DOM: VDom$
  }
}
