import { run } from '@cycle/most-run'
import { makeDOMDriver } from '@cycle/dom'
import main from 'components/main'

const drivers = { DOM: makeDOMDriver('#app') }

run(main, drivers)
