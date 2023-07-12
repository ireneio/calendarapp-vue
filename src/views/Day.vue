<template>
  <div class="container-xl bg-light" style="padding-top: 130px; padding-bottom: 70px;">
    <div class="row" v-for="time, i of timeline" :key="time">
      <div
        class="col-3 border border-right-0 border-top-0 text-center pt-5 pb-n1"
        style="min-height: 10vh;"
      >
        <small
          class="position-absolute"
          style="left: 25%; bottom: 0;"
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
          backgroundColor: isBooked(events, time).res ? `${'rgba(179, 155, 92, 0.75)'} !important` : '',
          borderColor: isSelectedBlock(events[i], time) ? 'purple !important' : isBooked(events, time).res ? `${'rgba(179, 155, 92, 0.75)'} !important` : '#EEEEEE !important',
          borderStyle: 'solid !important',
          borderWidth: isSelectedBlock(events[i], time) ? '2px !important' : '1px !important',
          paddingLeft: '0.5px !important',
          paddingRight: '0.5px !important',
          overflow: 'hidden',
          color: '#fff',
        }"
        data-target="#addEventModal"
        data-toggle="modal"
        @click="handleBlockClick(events, time)"
      >
        {{ isBooked(events, time).start ? isBooked(events, time).res : '' }}
      </div>
    </div>
  </div>
</template>

<script>
import checkBookingBlock from '@/mixins/checkBookingBlock'
import reformatTime from '@/mixins/reformatTime'
import dayjs from 'dayjs'
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
        content: ''
      }
    }
  },
  methods: {
    handleBlockClick(events, time) {
      if (events.length) {
        const block = events.find((v) => v?.startTime === dayjs(`${events[0].date} ${time}`).subtract(15, 'minutes').format('HH:mm'))
        if (block) {
          this.selectedBlock = { ...block }
          this.$emit('selected-block:day', { ...block, isBooked: this.isSelectedBlock(block) })
        } else {
          this.selectedBlock = {
            date: events[0].date,
            startTime: dayjs(`${events[0].date} ${time}`).subtract(15, 'minutes').format('HH:mm'),
            endTime: dayjs(`${events[0].date} ${time}`).format('HH:mm'),
            content: ''
          }
          this.$emit('selected-block:day', { ...this.selectedBlock, isBooked: false })
        }
      }
    },
    isSelectedBlock(item) {
      if (item) {
        return this.selectedBlock?.date === item.date && this.selectedBlock?.startTime === item.startTime && this.selectedBlock?.endTime === item?.endTime
      }
      return false
    }
  }
}
</script>

<style>
</style>
