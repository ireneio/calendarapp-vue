<template>
  <div class="container-xl bg-light" style="padding-top: 130px; padding-bottom: 70px; width: 100vw;">
    <div class="row" v-for="time of timeline" :key="time">
      <!-- <div class="col-3"></div> -->
      <div
        class="col-3 border border-right-0 border-top-0 text-center pt-5 pb-n1"
        style="min-height: 10vh;"
      >
        <small
          class="position-absolute"
          style="left:25%; bottom: 0;"
        >{{ time.split('a')[0].length > 5 ? time.split('p')[0] : time.split('a')[0] }}</small>
      </div>
      <div
        class="col-3 border border-right-0 border-top-0 text-center text-break"
        :class="{
          // 'bg-booked': isBooked(item.events, time).res,
          // 'border-info': isBooked(item.events, time).res,
          'rounded-top': isSelectedBlock(item, time) ? false : isBooked(item.events, time).start,
          'rounded-bottom': isSelectedBlock(item, time) ? false : isBooked(item.events, time).end
        }"
        :style="{
          backgroundColor: isBooked(item.events, time).res ? `${item?.backgroundColor} !important` : '',
          borderColor: isSelectedBlock(item, time) ? 'purple !important' : isBooked(item.events, time).res ? `${item?.backgroundColor} !important` : '#EEEEEE !important',
          borderStyle: 'solid !important',
          borderWidth: isSelectedBlock(item, time) ? '2px !important' : '1px !important',
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
        <span style="{ background-color: #aaaaaa; color: #fff; font-size: 12px; font-weight: 300; }">{{ isBooked(item.events, time).start ? isBooked(item.events, time).res : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import checkBookingBlock from '@/mixins/checkBookingBlock'
import reformatTime from '@/mixins/reformatTime'

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
    handleBlockClick(block) {
      this.selectedBlock = { ...block }
      this.$emit('selected-block', { ...block, isBooked: !!block?.booked?.res })
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
