import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import _ from 'lodash'
import dayjs from 'dayjs'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    now: new Date(),
    dates: [],
    isLoggedIn: false,
    displayName: null,
    userId: null,
    events: []
  },
  getters: {
    getNowYear(state) {
      return state.now.getFullYear()
    },
    getNowMonth(state) {
      return state.now.getMonth() + 1
    },
    getNowMonthDates(state, getters) {
      return state.dates.find(
        date =>
          date.month === getters.getNowMonth && date.year === getters.getNowYear
      ).days
    },
    getNowDayOfWeek(state) {
      return state.now.getDay()
    },
    getNowDay(state) {
      return state.now.getDate()
    },
    // get this week's dates (ordered from sunday-saturday)
    getNowWeek(state, getters) {
      const lengthOfWeek = 7
      const dayOfWeek = getters.getNowDayOfWeek
      const filterForward = lengthOfWeek - dayOfWeek
      const filterBackward = lengthOfWeek - filterForward
      const filterStart = getters.getNowMonthDates.findIndex(
        day =>
          day.day === getters.getNowDay && day.month === getters.getNowMonth
      )
      return getters.getNowMonthDates.slice(
        filterStart - filterBackward,
        filterStart + filterForward
      )
    }
  },
  mutations: {
    setNowDate(state, payload) {
      state.now = new Date(payload)
    },
    setDates(state, payload) {
      state.dates = payload
    },
    setLogin(state, payload) {
      state.isLoggedIn = payload
    },
    setDisplayName(state, payload) {
      state.displayName = payload
    },
    setUserId(state, payload) {
      state.userId = payload
    },
    setEvents(state, payload) {
      state.events = payload
    }
  },
  actions: {
    updateLoginStatus({ commit }, payload) {
      const { status, displayName, accessToken, userId } = payload
      localStorage.setItem('token', accessToken)
      localStorage.setItem('userId', userId)
      commit('setLogin', status)
      commit('setDisplayName', displayName || null)
      commit('setUserId', userId || null)
    },
    GET_events({ commit, state }, payload) {
      console.log(payload)
      return axios
        .get(`${process.env.VUE_APP_API_URL}/events/${payload?.assignee?.id}`)
        .then(res => {
          const arr = res.data.events.filter((v) => v.userId).map((v, i) => ({ ...v, startDate: dayjs(`${v?.date} ${v?.startTime}`).toISOString(), order: i }))
          const gb = _.groupBy(arr, function(v) { return v.startDate })
          const map = Object.entries(gb).map(([key, value]) => {
            return [key, [...value].sort((a, b) => b.order - a.order)]
          }).map(([key, value]) => {
            return [key, value.filter((v, i) => i === 0)]
          }).map(([key, value]) => {
            return [key, value.filter((v) => !v.deleted)]
          }).filter(([key, value]) => {
            return value.length > 0
          }).map(([key, value]) => {
            return value
          })
          const result = _.flatten(map)
          // console.log(result)
          commit('setEvents', result)
        })
    },
    UPDATE_events({ commit, state }, payload) {
      return axios
        .post(`${process.env.VUE_APP_API_URL}/events/${payload?.assignee?.id}`, {
          event: { ...payload, displayName: state.displayName, userId: payload?.assignee?.id }
        })
        .then(res => {
          commit('setEvents', [...state.events, payload])
        })
    }
  },
  modules: {}
})
