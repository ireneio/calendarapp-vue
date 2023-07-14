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
              <img class="mb-0 mr-2" src="../assets/logo_mobile.png" alt="logo" style="{ width: 48px; height: 48px; object-fit: contain; vertical-align: middle; }" @click="handleExtLink()">
              <div
                class="d-flex align-items-center mr-2"
                >
                <a href="javascript:;" class="text-dark btn" @click="adjustDay($route.path.includes('day') ? -1 : -7)">
                  <fa icon="arrow-alt-circle-left" style="font-size: 18px; color: #181818;"></fa>
                </a>
                <div class="mb-1" style="color: #181818; font-weight: 500; letter-spacing: 2px;">{{ getNowMonth + '月 ' + getNowYear }}</div>
                <a href="javascript:;" class="text-dark btn" @click="adjustDay($route.path.includes('day') ? 1 : 7)">
                  <fa icon="arrow-alt-circle-right" style="font-size: 18px; color: #181818;"></fa>
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
                  class="ml-2 text-white btn btn-danger rounded-circle pl-3 pr-3 pt-2"
                  href="javascript:;"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >{{ displayName ? displayName.substring(0, 1) : '-' }}</a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" style="margin-top: 8px;">
                  <a v-show="showMyBook" class="dropdown-item" @click="handleShowMyBook(false)">全部預約</a>
                  <a v-show="!showMyBook" class="dropdown-item" @click="handleShowMyBook(true)">我的預約</a>
                  <a class="dropdown-item" @click="handleLogout">登出</a>
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
            <div
              :class="{'text-light': isToday(day) && $route.path.includes('day')}"
            >{{ weeks[index].n.split('(')[0]}}</div>
            <div
              :class="{'text-light': isToday(day) && $route.path.includes('day')}"
            >{{ `(${weeks[index].n.split('(')[1]}`}}</div>
            <div class="mt-1" style="font-weight: 600;" :class="{'text-light': isToday(day) && $route.path.includes('day')}">{{ day.day }}</div>
          </button>
        </div>
      </div>
    </div>
    <div>{{ '人員: ' + form.assignee.name }}</div>
    <router-view
      :timeline="timeline"
      :week="filterEventsToCurrentWeek()"
      :events="filterEventsToCurrentDay()"
      @selected-block="handleWeekBlockSelect($event)"
      @selected-block:day="handleDayBlockSelect($event)"
    ></router-view>
    <div style="color: #181818; text-align: center; padding: 24px 0; font-size: 12px;">{{ `Copyright. Ires Consulting 2022-${new Date().getFullYear()}. All rights reserved.` }}</div>
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
        class="position-absolute"
        style="{ top: 0; left: 12px; z-index: 2; transform: translateY(8px); text-decoration: none; cursor: pointer; font-size: 12px; color: #aaaaaa; }"
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
            <h5 class="modal-title" id="exampleModalLabel">{{ isFormReadOnly ? '查看' : selectedBlock?.booked?.userId === userId ? '編輯' : '新增' }}預約</h5>
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
              <div class="form-group col-24" v-if="this.applyTypeListMap.length">
                <label for="exampleFormControlSelect1">*項目</label>
                <select
                  class="form-control"
                  id="exampleFormControlSelect1"
                  v-model="form.applyType"
                  :disabled="isFormReadOnly"
                >
                  <option value>選擇預約項目</option>
                  <option v-for="item in applyTypeListMap" :disabled="item?.disabled" :key="item?.name" :value="item">{{ item?.name }}</option>
                </select>
              </div>
              <div class="form-group col-24" v-if="this.assigneeListMap.length">
                <label for="exampleFormControlSelect1">*人員</label>
                <select
                  class="form-control"
                  id="exampleFormControlSelect1"
                  v-model="form.assignee"
                  :disabled="isFormReadOnly || !form.assignee.id"
                >
                  <option value>選擇預約人員</option>
                  <option v-for="item in assigneeListMap" :disabled="item?.disabled" :key="item?.id" :value="item">{{ item?.name }}</option>
                </select>
              </div>
              <div class="form-group col-24">
                <label for="exampleInputEmail1">*日期</label>
                <input
                  v-model="form.date"
                  type="date"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  :readonly="isFormReadOnly"
                >
              </div>
              <div class="form-group col-12">
                <label for="exampleFormControlSelect1">*開始時間</label>
                <select
                  class="form-control"
                  id="exampleFormControlSelect1"
                  v-model="form.startTime"
                  :disabled="isFormReadOnly"
                >
                  <option value>選擇開始的時間</option>
                  <option v-for="time in timelineMapStartTime" :disabled="time?.disabled" :key="time?.value" :value="time?.value">{{ time?.value }}</option>
                </select>
              </div>
              <div class="form-group col-12">
                <label for="exampleFormControlSelect2">*結束時間</label>
                <select class="form-control" id="exampleFormControlSelect2" v-model="form.endTime" :disabled="disableEndTimeSelect || isFormReadOnly">
                  <option value>選擇結束的時間</option>
                  <option v-for="time in timelineMapEndTime" :disabled="time?.disabled" :key="time?.value" :value="time?.value">{{ time?.value }}</option>
                </select>
              </div>
              <div class="form-group col-24">
                <label for="exampleFormControlTextarea1">備註</label>
                <textarea
                  v-model="form.content"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  :readonly="isFormReadOnly"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button v-if="selectedBlock?.booked?.start && selectedBlock?.booked?.hasEvent && selectedBlock?.booked?.userId === userId" type="button" class="btn btn-danger" data-dismiss="modal" @click="handleDeleteBookedBlock()">{{ '刪除' }}</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal" :disabled="pageLoading" @click="() => {
              clearForm()
            }">{{ isFormReadOnly ? '關閉' : '取消' }}</button>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleFormSubmit"
              :data-dismiss="alerts.length > 0 ? '' : 'modal'"
              v-if="!isFormReadOnly"
            >提交</button>
          </div>
        </div>
      </div>
    </div>
    <default-loading :invoke-on-mount="false" :handle-start="pageLoading" :handle-finish="!pageLoading"></default-loading>
    <!-- <snackbar ref="snackbar" baseSize="100px" :wrapClass="''" :colors="null" :holdTime="3000" :multiple="true"/> -->
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
import applyTypeList from '@/data/applyTypeList.json'
import assigneeList from '@/data/assigneeList.json'
import DefaultLoading from '@/components/DefaultLoading.vue'

export default {
  mixins: [weeksData, checkDateIsToday, reformatTime],
  components: {
    DefaultLoading
  },
  data() {
    return {
      pageLoading: false,
      timeline: [],
      form: {
        content: '',
        startTime: '',
        endTime: '',
        date: '',
        applyType: {
          name: '',
          length: ''
        },
        assignee: {
          id: '',
          name: ''
        }
      },
      alerts: [],
      brand: process.env.VUE_APP_BRAND,
      selectedBlock: null,
      showFooter: false,
      isFormReadOnly: false,
      showMyBook: false
    }
  },
  computed: {
    ...mapGetters(['getNowWeek']),
    ...mapState(['events', 'displayName', 'userId']),
    applyTypeListMap() {
      return applyTypeList.map((v) => {
        return {
          ...v
          // disabled: dayjs(`${this.form.date} ${this.form.startTime}`).add(this.form.applyType.length, 'minutes').format('HH:mm')
        }
      })
    },
    assigneeListMap() {
      return assigneeList
    },
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
          disabled: hasEvent(this.form.date, timelineTime) || hasEvent(this.form.date, dayjs(`${this.form.date} ${timelineTime}`).add(this.form.applyType.length, 'minutes').format('HH:mm'))
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
    // 'form.startTime'(v) {
    //   this.form.endTime = dayjs(`${this.form.date} ${this.form.startTime}`).add(15, 'minutes').format('HH:mm')
    // }
    'form.startTime'(v) {
      this.form.endTime = dayjs(`${this.form.date} ${this.form.startTime}`).add(this.form.applyType.length, 'minutes').format('HH:mm')
    },
    'form.applyType.length'(v) {
      this.form.endTime = dayjs(`${this.form.date} ${this.form.startTime}`).add(v, 'minutes').format('HH:mm')
    },
    'form.assignee.id': {
      handler(v) {
        this.getEvents()
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations(['setNowDate']),
    ...mapActions(['GET_events', 'UPDATE_events', 'updateLoginStatus']),
    async handleShowMyBook(val) {
      this.pageLoading = true
      this.showMyBook = val
      window.localStorage.setItem('calendar_show_type', val ? 'my' : 'all')
      await sleep(600)
      this.pageLoading = false
    },
    async clearForm() {
      await sleep(600)
      // this.form.content = `[${this.displayName}]: 我要預約`
      this.form.content = ''
      if (this.applyTypeListMap.length) {
        this.form.applyType = this.applyTypeListMap[0]
      }
      this.selectedBlock = null
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
        const str = hour + ':' + min
        this.timeline = [...this.timeline, str]
      }
    },
    async getEvents() {
      if (this.form.assignee.id) {
        await this.GET_events({ ...this.form })
      }
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
      if (this.showMyBook) {
        return res.map((v) => ({
          ...v,
          events: v.events.filter((vv) => vv.userId === this.userId)
        }))
      }
      return res
    },
    filterEventsToCurrentDay() {
      const filteredEvents = this.events
      const res = filteredEvents.length > 0 ? filteredEvents.filter(event => {
        const date = new Date(event.date)
        if (date.getMonth() + 1 === this.getNowMonth && date.getFullYear() === this.getNowYear && date.getDate() === this.getNowDay) return event
      }) : []
      if (this.showMyBook) {
        return res.filter((v) => v.userId === this.userId)
      }
      return res
    },
    async handleDeleteBookedBlock() {
      this.handleFormSubmit('delete')
    },
    async handleFormSubmit(action) {
      if (this.pageLoading) {
        return
      }
      // if (this.form.content === '' || this.form.startTime === '' || this.form.endTime === '' || this.form.date === '') {
      if (this.form.startTime === '' || this.form.endTime === '' || this.form.date === '') {
        if (this.alerts.indexOf('請填入所有欄位') === -1) this.alerts.push('請填入所有欄位')
        return false
      }
      const startTime = this.reformatTime(this.form.startTime)
      const endTime = this.reformatTime(this.form.endTime)
      if (startTime > endTime) {
        if (this.alerts.indexOf('開始時間不得晚於結束時間') === -1) this.alerts.push('開始時間不得晚於結束時間')
        return false
      }
      this.pageLoading = true
      await this.UPDATE_events({ ...this.form, deleted: action === 'delete' })
      await this.getEvents()
      // this.$refs.snackbar.warn('msg')
      // this.$refs.snackbar.open('msg')
      this.clearForm()
      this.pageLoading = false
    },
    // change current day with a specific date
    selectDay(date) {
      const { day, month, year } = date
      this.setNowDate(`${year}-${month}-${day}`)
      if (this.$route.path.includes('week')) {
        this.$router.push('/main/day')
      }
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
    async handleLogout() {
      this.pageLoading = true
      const accessToken = localStorage.getItem('token')
      await axios.post(`${process.env.VUE_APP_API_URL}/users/revoke`, { accessToken })
        .then(() => {
          this.updateLoginStatus({ status: false, accessToken: '', userId: null, displayName: null })
          this.$router.push({ name: 'Home' })
        })
      this.pageLoading = false
    },
    async handleWeekBlockSelect(block) {
      // console.log('block', block)
      this.selectedBlock = { ...block }
      this.form.date = dayjs(`${block?.year}/${block?.month}/${block?.day}`).format('YYYY-MM-DD')
      if (block?.isBooked) {
        this.form.content = block?.event?.content
      } else {
        this.form.content = '-'
      }
      const find = this.timelineMapStartTime.find((v) => v.value === block?.time)
      if (block?.event?.startTime === block?.time && block?.isBooked && !find.disabled) {
        this.form.startTime = dayjs(`${block?.year}/${block?.month}/${block?.day} ${block?.time}`).subtract(0, 'minutes').format('HH:mm')
      } else if (block?.event && block?.isBooked && !find.disabled) {
        this.form.startTime = dayjs(`${block?.year}/${block?.month}/${block?.day} ${block?.event?.startTime}`).subtract(0, 'minutes').format('HH:mm')
      } else if (!find.disabled) {
        this.form.startTime = dayjs(`${block?.year}/${block?.month}/${block?.day} ${block?.time}`).subtract(0, 'minutes').format('HH:mm')
      } else {
        this.form.startTime = ''
      }
      if (block?.event !== null && block?.event?.userId === this.userId && block?.event?.startTime === block?.time && block?.isBooked) {
        this.isFormReadOnly = false
      } else if (block?.isBooked) {
        this.isFormReadOnly = true
      } else {
        this.isFormReadOnly = false
      }
      await sleep(300)
      this.showFooter = true
    },
    async handleDayBlockSelect(block) {
      // console.log(block)
      this.selectedBlock = { ...block }
      this.form.date = block?.date
      this.form.startTime = block?.startTime
      // this.form.endTime = dayjs(`${block?.date} ${block?.startTime}`).add(this.form.applyType.length, 'minutes').format('HH:mm')
      this.form.content = block?.content
      if (block?.isBooked) {
        this.isFormReadOnly = true
      } else {
        this.isFormReadOnly = false
        await sleep(300)
        this.showFooter = true
      }
    },
    handleExtLink() {
      window.open('https://iresconsulting.com/', '_blank')
    }
  },
  created() {
    this.pageLoading = true
    this.makeTimeline()
  },
  mounted() {
    this.$nextTick(async () => {
      const cst = window.localStorage.getItem('calendar_show_type')
      if (cst) {
        if (cst === 'my') {
          this.showMyBook = true
        } else {
          this.showMyBook = false
        }
      }
      // init default assignee
      if (this.assigneeListMap.length) {
        console.log('this.assigneeListMap', this.assigneeListMap)
        this.form.assignee = this.assigneeListMap[0]
        await this.getEvents().then(() => {
          this.clearForm()
        })
      } else {
        this.form.assignee = { id: '', name: '' }
      }
      this.pageLoading = false
    })
  },
  beforeDestroy() {
    // force calender to render current month at top
    this.setNowDate(new Date())
  }
}
</script>
