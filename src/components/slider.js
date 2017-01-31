import { div, input } from '@cycle/dom'

export default function Slider (sources) {
  const { DOM: dom$, props: props$ } = sources

  const newValue$ = dom$
    .select('.slider')
    .events('input')
    .map(ev => ev.target.value)

  const state$ = props$
    .flatMap(props => newValue$
      .map(val => ({
        label: props.label,
        unit: props.unit,
        min: props.min,
        value: val,
        max: props.max
      }))
      .startWith(props)
    )

  const vdom$ = state$.map(state =>
    div('.labeled-slider', [
      div('.label', `${state.label}: ${state.value}${state.unit}`),
      input('.slider', {
        attrs: { type: 'range', min: state.min, max: state.max, value: state.value }
      })
    ])
  )

  return {
    DOM: vdom$,
    value: state$.map(state => state.value)
  }
}
