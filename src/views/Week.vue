<template>
  <div class="container-xl bg-light" style="padding-top: 180px; padding-bottom: 70px; width: 100vw;">
    <div class="row" v-for="time of timeline" :key="time">
      <!-- <div class="col-3"></div> -->
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
        class="col-3 border border-right-0 border-top-0 text-center text-break position-relative"
        :class="{
          // 'bg-booked': isBooked(item.events, time).res,
          // 'border-info': isBooked(item.events, time).res,
          'rounded-top': isSelectedBlock(item, time) ? false : isBooked(item.events, time).start,
          'rounded-bottom': isSelectedBlock(item, time) ? false : isBooked(item.events, time).end
        }"
        :style="{
          backgroundColor: isBooked(item.events, time).hasEvent ? `${item?.backgroundColor} !important` : '',
          outlineColor: isSelectedBlock(item, time) ? 'purple !important' : 'transparent !important',
          outlineStyle: 'solid !important',
          outlineWidth: isSelectedBlock(item, time) ? '2px !important' : '2px !important',
          borderColor: '#EEEEEE !important',
          borderStyle: 'solid',
          borderWidth: '1px',
          paddingLeft: '0.5px !important',
          paddingRight: '0.5px !important',
          overflow: 'hidden',
        }"
        v-for="item in weekMap"
        :key="item.day"
        @click="handleBlockClick({ ...item, time, booked: isBooked(item.events, time) })"
        data-target="#addEventModal"
        data-toggle="modal"
      >
        <span v-if="isBooked(item.events, time).hasEvent" style="{ background-color: #aaaaaa; color: #fff; font-size: 14px; font-weight: 500; }">{{ isBooked(item.events, time).start ? `[${isBooked(item.events, time).name}]` : '' }}</span>
        <div style="{ background-color: #aaaaaa; color: #fff; font-size: 12px; font-weight: 300; }" class="mt-2">{{ isBooked(item.events, time).start ? isBooked(item.events, time).res : '' }}</div>
        <!-- <div v-if="isBooked(item.events, time).start" class="mt-2" style="{ color: #aaaaaa }">{{ `預約人: ${isBooked(item.events, time).applier}` }}</div> -->
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
    week: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedBlock: null
    }
  },
  computed: {
    weekMap() {
      return this.week.map((v) => {
        return {
          ...v,
          backgroundColor: this.getBg()
        }
      })
    }
  },
  methods: {
    getBg() {
      // const randomColor = Math.floor(Math.random() * 16777215).toString(16)
      // return `#${randomColor}`
      return 'rgba(179, 155, 92, 0.75)'
    },
    getCurrentBlockEvents(block, events) {
      const date = `${block?.year}-${block?.month}-${block?.day}`
      return events.filter((v) => {
        return dayjs(`${date} ${v?.startTime}`).isBefore(dayjs(`${date} ${block?.time}`)) ||
          dayjs(`${date} ${v?.startTime}`).isSame(dayjs(`${date} ${block?.time}`)) ||
          dayjs(`${date} ${v?.endTime}`).isAfter(dayjs(`${date} ${block?.time}`)) ||
          dayjs(`${date} ${v?.endTime}`).isSame(dayjs(`${date} ${block?.time}`))
      })
    },
    handleBlockClick(block) {
      // console.log(block)
      const currentBlockEvents = this.getCurrentBlockEvents(block, block?.events || [])
      const event = currentBlockEvents.find((v) => v?.startTime === dayjs(`${block?.year}-${block?.month}-${block?.day} ${block?.time}`).subtract(0, 'minutes').format('HH:mm'))
      if (event) {
        this.selectedBlock = { ...block, event }
      } else {
        this.selectedBlock = { ...block, event: null }
      }
      this.$emit('selected-block', { ...this.selectedBlock, isBooked: !!block?.booked?.hasEvent })
    },
    isSelectedBlock(item, time) {
      return this.selectedBlock?.day === item.day && this.selectedBlock?.month === item.month && this.selectedBlock?.year === item?.year && this.selectedBlock?.time === time
    }
  }
}
</script>

<style scoped>
/* .bg-booked {
  background-color: purple;
  color: #fff;
} */
</style>
