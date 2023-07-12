<template>
  <div class="position-relative">
    <div
      class="position-fixed"
      style="top: 0; left: 0; z-index: 1000; width: 100vw;"
    >
      <div class="container-xl shadow-sm bg-white">
        <div class="row">
          <div class="col-24">
            <div class="d-flex align-items-center mt-2">
              <img class="mb-0 mr-2" src="../assets/logo_mobile.png" alt="logo" style="{ width: 48px; height: 48px; object-fit: contain; vertical-align: middle; }">
              <!-- <h5 v-show="$route.path.includes('week')" class="mt-2">預約 {{ brand }}</h5> -->
              <!-- <div v-show="$route.path.includes('week')" class="d-flex align-items-center mr-2">
                <div v-show="$route.path.includes('week')" class="mt-0">{{ getNowYear + ' / ' + getNowMonth }}</div>
              </div> -->
              <!-- v-show="$route.path.includes('day')" -->
              <div
                class="d-flex align-items-center mr-2"
                >
                <!-- :class="{ 'd-flex': $route.path.includes('day')}" -->
                <a href="javascript:;" class="text-dark btn" @click="adjustDay($route.path.includes('day') ? -1 : -7)">
                  <fa icon="arrow-alt-circle-left"></fa>
                </a>
                <div>{{ getNowYear + ' / ' + getNowMonth }}</div>
                <a href="javascript:;" class="text-dark btn" @click="adjustDay($route.path.includes('day') ? 1 : 7)">
                  <fa icon="arrow-alt-circle-right"></fa>
                </a>
              </div>
              <a
                href="javascript:;"
                class="ml-auto btn btn-secondary text-primary rounded-pill"
                @click="$router.push({ name: $route.path.includes('week') ? 'day' : 'week' })"
              >
                {{ $route.path.includes('week') ? '週檢視' : '日檢視' }}
                <fa icon="caret-down"></fa>
              </a>

              <div class="dropdown">
                <a
                  class="ml-2 btn btn-outlined text-primary rounded-pill"
                  href="javascript:;"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >{{ displayName }}</a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" style="margin-top: 12px;">
                  <a class="dropdown-item" href="#" @click="handleLogout">登出</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row py-2">
          <div class="col-3 text-center d-flex align-items-center justify-content-center">
            <button
              class="bg-secondary text-primary rounded-circle btn"
              style="font-size: 16px; transform:translateY(5px);"
              @click="$router.push({ name: 'calendar'})"
            >
              <fa :icon="['far', 'calendar']"></fa>
            </button>
          </div>
          <button
            class="col-3 d-flex flex-column align-items-center btn"
            v-for="(day,index) of getNowWeek"
            :key="day.day"
            :class="{ 'bg-primary rounded': isToday(day) && $route.path.includes('day')}"
            @click="selectDay(day)"
          >
            <span
              :class="{'text-light': isToday(day) && $route.path.includes('day')}"
            >{{ weeks[index].n}}</span>
            <span :class="{'text-light': isToday(day) && $route.path.includes('day')}">{{ day.day }}</span>
          </button>
        </div>
      </div>
    </div>
    <router-view
      :timeline="timeline"
      :week="filterEventsToCurrentWeek()"
      :events="filterEventsToCurrentDay()"
      @selected-block="handleWeekBlockSelect($event)"
    ></router-view>
    <div
      class="container-xl position-fixed bg-white shadow-lg"
      style="{ transition: transform .66s; }"
      :style="{ bottom: 0, left: '50%', transform: showFooter ? 'translate(-50%, 0%)' : 'translate(-50%, 100%)' }"
    >
      <span
        class="position-absolute h3 text-decoration-none text-dark"
        style="{ top: 12px; right: 12px; z-index: 2; cursor: pointer; }"
        @click.stop="() => showFooter = false"
      >&times;</span>
      <span
        class="position-absolute text-dark"
        style="{ top: 0; left: 12px; z-index: 2; transform: translateY(8px); text-decoration: none; cursor: pointer; font-size: 12px; }"
        @click="adjustDay('now')"
      >回到當日</span>
      <div class="row">
        <div class="col-24 text-center py-3">
          <button
            type="button"
            class="btn btn-link"
            data-target="#addEventModal"
            data-toggle="modal"
            :disabled="!!selectedBlock?.isBooked"
          >{{ selectedBlock?.isBooked ? '此時段已被預約' : '新增預約' }}</button>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="addEventModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content" style="{ transform: translateY(100px); }">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">新增預約</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div
              class="alert alert-warning alert-dismissible fade show"
              role="alert"
              v-for="alert in alerts"
              :key="alert"
            >
              {{ alert }}
              <button
                type="button"
                class="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="form-row">
              <div class="form-group col-24">
                <label for="exampleFormControlTextarea1">預約內容</label>
                <textarea
                  v-model="form.content"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group col-24">
                <label for="exampleInputEmail1">日期</label>
                <input
                  v-model="form.date"
                  type="date"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                >
              </div>
              <div class="form-group col-12">
                <label for="exampleFormControlSelect1">開始時間</label>
                <select
                  class="form-control"
                  id="exampleFormControlSelect1"
                  v-model="form.startTime"
                >
                  <option value>選擇開始的時間</option>
                  <option v-for="time in timelineMapStartTime" :disabled="time?.disabled" :key="time?.value" :value="time?.value">{{ time?.value }}</option>
                </select>
              </div>
              <div class="form-group col-12">
                <label for="exampleFormControlSelect2">結束時間</label>
                <select class="form-control" id="exampleFormControlSelect2" v-model="form.endTime" :disabled="disableEndTimeSelect">
                  <option value>選擇結束的時間</option>
                  <option v-for="time in timelineMapEndTime" :disabled="time?.disabled" :key="time?.value" :value="time?.value">{{ time?.value }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="() => {
              clearForm()
            }">取消</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleFormSubmit"
              :data-dismiss="alerts.length > 0 ? '' : 'modal'"
            >提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import axios from 'axios'
import dayjs from 'dayjs'
import _ from 'lodash'
import weeksData from '@/mixins/weeksData'
import checkDateIsToday from '@/mixins/checkDateIsToday'
import reformatTime from '@/mixins/reformatTime'
import { sleep } from '@/utils/general'

export default {
  mixins: [weeksData, checkDateIsToday, reformatTime],
  data() {
    return {
      timeline: [],
      form: {
        content: '',
        startTime: '',
        endTime: '',
        date: ''
      },
      alerts: [],
      brand: process.env.VUE_APP_BRAND,
      selectedBlock: null,
      showFooter: false
    }
  },
  computed: {
    ...mapGetters(['getNowWeek']),
    ...mapState(['events', 'displayName']),
    timelineMapStartTime() {
      const events = this.filterEventsToCurrentWeek()
      const hasEvent = (date, timelineTime) => {
        const targetDayEvents = events.filter((event) => dayjs(`${event.year}-${event.month}-${event.day}`).isSame(dayjs(date)))
        if (targetDayEvents.length) {
          const events = _.flatten(targetDayEvents[0].events)
          const thisDate = dayjs(`${date} ${timelineTime}`)
          return events.filter((event) => {
            const st = dayjs(`${date} ${event?.startTime}`)
            const et = dayjs(`${date} ${event?.endTime}`)
            return (st.isSame(thisDate) || st.isBefore(thisDate)) && et.isAfter(thisDate)
          }).length > 0
        }
        return false
      }
      return this.timeline.map((timelineTime) => {
        return {
          value: timelineTime,
          disabled: hasEvent(this.form.date, timelineTime)
        }
      })
    },
    timelineMapEndTime() {
      // return this.timeline.map((v) => {
      //   const st = dayjs(`${this.form.date} ${this.form.startTime}`)
      //   return {
      //     value: v,
      //     disabled: this.form.startTime ? st.isAfter(dayjs(`${this.form.date} ${v}`)) || st.isSame(dayjs(`${this.form.date} ${v}`)) : false
      //   }
      // })
      return this.timeline.map((v) => ({ value: v, disabled: true }))
    },
    disableEndTimeSelect() {
      return true
    }
  },
  watch: {
    'form.startTime'(v) {
      this.form.endTime = dayjs(`${this.form.date} ${this.form.startTime}`).add(15, 'minutes').format('HH:mm')
    }
  },
  methods: {
    ...mapMutations(['setNowDate']),
    ...mapActions(['GET_events', 'UPDATE_events', 'updateLoginStatus']),
    async clearForm() {
      await sleep(600)
      // this.form.date = dayjs().format('YYYY-MM-DD')
      // this.form.startTime = this.timeline[0]
      // this.form.endTime = this.timeline[1]
      this.form.content = `[${this.displayName}]: 我要預約諮詢.`
      this.alerts = []
    },
    // make timeline blocks (every 30 mins)
    makeTimeline() {
      const startHour = !isNaN(Number(process.env.VUE_APP_BOOK_START_TIME)) ? Number(process.env.VUE_APP_BOOK_START_TIME) : 10
      const endHour = !isNaN(Number(process.env.VUE_APP_BOOK_END_TIME)) ? Number(process.env.VUE_APP_BOOK_END_TIME) : 21.5
      for (let i = startHour; i < endHour + 0.5; i += 0.25) {
        const hour = parseInt(i).toString()
        const minStr = String(i)
        const min = minStr.includes('.25') ? '15' : minStr.includes('.5') ? '30' : minStr.includes('.75') ? '45' : '00'
        // const zone = parseInt(i) < 12 ? 'am' : 'pm'
        // const str = hour + ':' + min + zone
        const str = hour + ':' + min
        this.timeline = [...this.timeline, str]
      }
    },
    async getEvents() {
      await this.GET_events()
    },
    filterEventsToCurrentWeek() {
      const filteredEvents = this.events
      const res = this.getNowWeek.map(weekDay => {
        if (filteredEvents.length > 0) {
          const inRange = { ...weekDay, events: [] }
          filteredEvents.forEach(event => {
            const date = new Date(event.date)
            if (weekDay.month === date.getMonth() + 1 && weekDay.year === date.getFullYear() && weekDay.day === date.getDate()) {
              inRange.events = [...inRange.events, event]
            }
          })
          return inRange
        } else {
          return { ...weekDay, events: [] }
        }
      })
      return res
    },
    filterEventsToCurrentDay() {
      const filteredEvents = this.events
      const res = filteredEvents.length > 0 ? filteredEvents.filter(event => {
        const date = new Date(event.date)
        if (date.getMonth() + 1 === this.getNowMonth && date.getFullYear() === this.getNowYear && date.getDate() === this.getNowDay) return event
      }) : []
      return res
    },
    async handleFormSubmit() {
      if (this.form.content === '' || this.form.startTime === '' || this.form.endTime === '' || this.form.date === '') {
        if (this.alerts.indexOf('請填入所有欄位') === -1) this.alerts.push('請填入所有欄位')
        return false
      }
      const startTime = this.reformatTime(this.form.startTime)
      const endTime = this.reformatTime(this.form.endTime)
      if (startTime > endTime) {
        if (this.alerts.indexOf('開始時間不得晚於結束時間') === -1) this.alerts.push('開始時間不得晚於結束時間')
        return false
      }
      // const events = this.events
      // let isBlockBooked = false
      // check if block is already booked
      // if (events.length) {
      //   events.find(event => {
      //     const formDate = new Date(this.form.date)
      //     const eventDate = new Date(event.date)
      //     if (formDate.getFullYear() === eventDate.getFullYear() && formDate.getMonth() === eventDate.getMonth() && formDate.getDate() === eventDate.getDate()) {
      //       if (this.reformatTime(event.startTime) <= startTime || this.reformatTime(event.endTime) >= endTime || this.reformatTime(event.endTime) > startTime) {
      //         if (this.alerts.indexOf('這個時段已經有預約') === -1) this.alerts.push('這個時段已經有預約')
      //         isBlockBooked = true
      //         return false
      //       }
      //     }
      //   })
      // }
      // if (isBlockBooked) {
      //   return false
      // } else {
      //   await this.UPDATE_events(this.form)
      //   this.clearForm()
      //   // this.filterEventsToCurrentWeek()
      // }
      await this.UPDATE_events({ ...this.form })
      this.clearForm()
    },
    // change current day with a specific date
    selectDay(date) {
      if (this.$route.path.includes('week')) return false
      const { day, month, year } = date
      this.setNowDate(`${year}-${month}-${day}`)
    },
    // change current day by [val]
    adjustDay(val) {
      if (val === 'now') {
        this.setNowDate(dayjs().format('YYYY-MM-DD'))
        return
      }
      const target = dayjs(`${this.getNowYear}-${this.getNowMonth}-${this.getNowDay}`)
      const add = target.add(val, 'days')
      this.setNowDate(add.format('YYYY-MM-DD'))
      // if ((this.getNowDay === this.countDaysInMonth(this.getNowYear, this.getNowMonth) && val === 1) || (this.getNowDay === 1 && val === -1)) {
      //   if (val === 1) {
      //     if (this.getNowMonth === 12 && this.getNowDay === 31) {
      //       this.setNowDate(`${this.getNowYear + 1}-${1}-${1}`)
      //     } else {
      //       this.setNowDate(`${this.getNowYear}-${this.getNowMonth + 1}-${1}`)
      //     }
      //   } else {
      //     if (this.getNowMonth === 1 && this.getNowDay === 1) {
      //       this.setNowDate(`${this.getNowYear - 1}-${12}-${31}`)
      //     } else {
      //       this.setNowDate(`${this.getNowYear}-${this.getNowMonth - 1}-${this.countDaysInMonth(this.getNowYear, this.getNowMonth - 1)}`)
      //     }
      //   }
      // } else {
      //   this.setNowDate(`${this.getNowYear}-${this.getNowMonth}-${this.getNowDay + val}`)
      // }
    },
    // count total days in a specific month
    countDaysInMonth(year, month) {
      return /3|5|8|10/.test(month - 1)
        ? 30
        : month - 1 === 1
          ? (!(year % 4) && year % 100) || !(year % 400)
            ? 29
            : 28
          : 31
    },
    handleLogout() {
      const accessToken = localStorage.getItem('token')
      axios.post(`${process.env.VUE_APP_API_URL}/users/revoke`, { accessToken })
        .then(() => {
          this.updateLoginStatus({ status: false, accessToken: '', userId: null, displayName: null })
          this.$router.push({ name: 'Home' })
        })
    },
    async handleWeekBlockSelect(block) {
      console.log('block', block)
      this.selectedBlock = { ...block }
      this.form.date = dayjs(`${block?.year}/${block?.month}/${block?.day}`).format('YYYY-MM-DD')
      this.form.startTime = dayjs(`${block?.year}/${block?.month}/${block?.day} ${block?.time}`).subtract(15, 'minutes').format('HH:mm')
      await sleep(600)
      this.showFooter = true
    }
  },
  async created() {
    this.makeTimeline()
    this.getEvents().then(() => {
      this.clearForm()
    })
  },
  beforeDestroy() {
    // force calender to render current month at top
    this.setNowDate(new Date())
  }
}
</script>

<style>
</style>
