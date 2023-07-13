<template>
  <form class="form-signin d-flex flex-column align-items-center justify-content-center">
    <img class="mb-2" src="../assets/logo.png" alt="logo" style="{ width: 240px; height: 240px; object-fit: contain; vertical-align: middle; }">
    <h1 class="h4 mb-3 font-weight-bold text-center">我要預約 {{ brand }}</h1>
    <img
      v-show="!pLdn"
      class="btn btn-lg btn-block"
      :src="btnSrc"
      @mouseover="handleBgChange(1)"
      @mouseleave="handleBgChange(-1)"
      @mousedown="handleBgChange(0)"
      @click="handleLogin"
    >
    <default-loading></default-loading>
  </form>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import DefaultLoading from '@/components/DefaultLoading.vue'

export default {
  name: 'Home',
  components: {
    DefaultLoading
  },
  data() {
    return {
      btnSrc: require('@/assets/btn_login_base.png'),
      brand: process.env.VUE_APP_BRAND,
      pLdn: false
    }
  },
  computed: {
    ...mapState(['isLoggedIn'])
  },
  methods: {
    ...mapActions(['updateLoginStatus']),
    handleBgChange(val) {
      this.btnSrc = val === 1
        ? require('@/assets/btn_login_hover.png')
        : val === -1
          ? require('@/assets/btn_login_base.png')
          : require('@/assets/btn_login_press.png')
    },
    handleLogin() {
      location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1654358305&scope=profile&state=123&redirect_uri=${window.location.origin}`
    },
    verifyToken(accessToken, refreshToken) {
      axios.post(`${process.env.VUE_APP_API_URL}/users/verify`, { accessToken, refreshToken })
        .then(res => {
          // login success
          const { accessToken, displayName, userId } = res.data
          this.updateLoginStatus({ status: true, accessToken, displayName, userId })
          this.$router.push({ name: 'week' })
        })
        .catch((err) => {
          // retry verify after getting new access token
          const { status, data: { accessToken } } = err.response
          if (status === 401) this.verifyToken(accessToken)

          // otherwise, login required
          this.updateLoginStatus({ status: false, accessToken: '', displayName: null, userId: null })
        })
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.isLoggedIn) vm.$router.push({ name: 'week' })
    })
  },
  async mounted() {
    if (location.href.includes('?code=')) {
      const code = location.href.split('?')[1].split('&')[0].split('=')[1]
      const state = 'ires_calendar'
      this.pLdn = true
      await axios.get(`${process.env.VUE_APP_API_URL}/users?code=${code}&state=${state}`)
        .then(res => {
          const { access_token: accessToken, refresh_token: refreshToken } = res.data
          this.verifyToken(accessToken, refreshToken)
        })
      this.pLdn = false
    }
  }
}
</script>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
  margin-top: 100px;
}
</style>
