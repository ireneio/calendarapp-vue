import dayjs from 'dayjs'

export default {
  methods: {
    // check and return whether event start/ends/exists at each block
    isBooked(events, time, notApplyOffset) {
      // console.log(events, time)
      let res = false
      let hasEvent = false
      let start = false
      let end = false
      let applier = ''
      let name = ''
      let userId = ''
      events.forEach(event => {
        const date = events[0].date
        const _time = dayjs(`${date} ${time}`)
        const st = dayjs(`${date} ${event.startTime}`)
        const et = dayjs(`${date} ${event.endTime}`)

        if (_time.isSame(st)) {
          start = true
          hasEvent = true
        }
        if (_time.isSame(et.subtract(notApplyOffset ? 0 : 15, 'minute'))) {
          end = true
          hasEvent = true
        }
        if (st.isBefore(_time) && et.isAfter(_time)) {
          hasEvent = true
        }

        res = event?.content || ''
        applier = event?.displayName || ''
        name = event?.applyType?.name || ''
        userId = event?.userId || ''
      })
      return { res, start, end, applier, name, hasEvent, userId }
    }
  }
}
