<template>
  <div class="container-xl bg-light" style="padding-top: 214px; padding-bottom: 70px;">
    <div class="row" v-for="time of timeline" :key="time">
      <div
        class="col-3 border border-right-0 border-top-0 text-center pt-5 pb-n1"
        style="min-height: 10vh;"
      >
        <small
          class="position-absolute"
          style="left: 12.5%; top: 0; font-size: 12px; letter-spacing: 1px;"
        >{{ time.split('a')[0].length > 5 ? time.split('p')[0] : time.split('a')[0] }}</small>
      </div>
      <div
        class="col-21 border border-right-0 border-top-0 text-center text-break"
        :class="{
          // 'bg-info': isBooked(events, time).res,
          // 'border-info': isBooked(events, time).res,
          'rounded-top': isBooked(events, time).start,
          'rounded-bottom': isBooked(events, time).end
        }"
        :style="{
          backgroundColor: isBooked(events, time).hasEvent ? `${'rgba(179, 155, 92, 0.75)'} !important` : '',
          borderColor: isSelectedBlock(events, time) ? 'purple !important' : isBooked(events, time).hasEvent ? `${'rgba(179, 155, 92, 0.75)'} !important` : '#EEEEEE !important',
          borderStyle: 'solid !important',
          borderWidth: isSelectedBlock(events, time) ? '2px !important' : '1px !important',
          paddingLeft: '0.5px !important',
          paddingRight: '0.5px !important',
          overflow: 'hidden',
          color: '#fff',
        }"
        data-target="#addEventModal"
        data-toggle="modal"
        @click="handleBlockClick(events, time)"
      >
        <div v-if="isBooked(events, time).userId === userId">
          <span v-if="isBooked(events, time).hasEvent" style="{ background-color: #aaaaaa; color: #fff; font-size: 14px; font-weight: 500; }">{{ isBooked(events, time).start ? `[${isBooked(events, time).name}]` : '' }}</span>
          <div style="{ background-color: #aaaaaa; color: #fff; font-size: 12px; font-weight: 300; }" class="mt-2">{{ isBooked(events, time).start ? isBooked(events, time).res : '' }}</div>
        </div>
        <div v-else></div>
      </div>
    </div>
  </div>
</template>

<script>
import checkBookingBlock from '@/mixins/checkBookingBlock'
import reformatTime from '@/mixins/reformatTime'
import dayjs from 'dayjs'
import { mapGetters, mapState } from 'vuex'
export default {
  mixins: [checkBookingBlock, reformatTime],
  props: {
    timeline: {
      type: Array,
      required: true
    },
    events: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedBlock: {
        date: '',
        endTime: '',
        startTime: '',
        content: '',
        event: null
      }
    }
  },
  computed: {
    ...mapState(['userId', 'now']),
    ...mapGetters(['getNowDay'])
  },
  methods: {
    getCurrentBlockEvents(block, events) {
      const date = `${block?.year}-${block?.month}-${block?.day}`
      return events.filter((v) => {
        return (dayjs(`${date} ${v?.startTime}`).isBefore(dayjs(`${date} ${block?.time}`)) ||
          dayjs(`${date} ${v?.startTime}`).isSame(dayjs(`${date} ${block?.time}`))) &&
          dayjs(`${date} ${v?.endTime}`).isAfter(dayjs(`${date} ${block?.time}`))
          // dayjs(`${date} ${v?.endTime}`).isSame(dayjs(`${date} ${block?.time}`)))
      })
    },
    handleBlockClick(events, time) {
      if (!events.length) {
        return
      }
      const date = new Date(this.now).toLocaleDateString('se').replace(/\D/g, '').split('-')
      const currentBlockEvents = this.getCurrentBlockEvents({
        time,
        year: date[0],
        month: date[1],
        day: date[2]
      }, events)
      if (currentBlockEvents.length) {
        const block = currentBlockEvents[0]
        if (block) {
          this.selectedBlock = {
            ...block,
            startTime: dayjs(`${block.date} ${time}`).subtract(0, 'minutes').format('HH:mm'),
            endTime: dayjs(`${block.date} ${time}`).add(15, 'minutes').format('HH:mm'),
            event: block
          }
          this.$emit('selected-block:day', { ...block, event: block, isBooked: this.isBooked(events, time) })
        } else {
          this.selectedBlock = {
            date: date.join('-'),
            startTime: dayjs(`${date.join('-')} ${time}`).subtract(0, 'minutes').format('HH:mm'),
            endTime: null,
            // endTime: dayjs(`${date.join('-')} ${time}`).add(15, 'minutes').format('HH:mm'),
            content: '',
            event: null
          }
          this.$emit('selected-block:day', { ...this.selectedBlock, isBooked: false })
        }
      } else {
        this.selectedBlock = {
          date: date.join('-'),
          startTime: dayjs(`${date.join('-')} ${time}`).subtract(0, 'minutes').format('HH:mm'),
          endTime: null,
          content: '',
          event: null
        }
        this.$emit('selected-block:day', { ...this.selectedBlock, isBooked: false })
      }
    },
    isSelectedBlock(events, time) {
      return this.selectedBlock.startTime === time
    }
  }
}
</script>
