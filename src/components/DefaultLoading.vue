<template>
  <div v-if="loading" class="loading">
    <div class="loading__text">
      <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <div class="title">{{ 'Loading...' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    invokeOnMount: {
      required: false,
      default: true
    },
    handleStart: {
      required: false,
      default: false
    },
    handleFinish: {
      required: false,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      delayMs: 800,
      isManual: false
    }
  },
  watch: {
    handleStart: {
      handler(v) {
        if (v) {
          this.start()
          // this.isManual = true
        }
      },
      immediate: true
    },
    handleFinish: {
      handler() {
        this.finish()
      },
      immediate: false
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      if (this.isManual) {
        this.loading = false
        this.isManual = false
      } else {
        const tid = setTimeout(() => {
          this.loading = false
          clearTimeout(tid)
        }, this.delayMs)
      }
    }
  },
  mounted() {
    if (this.invokeOnMount) {
      this.start()
      this.finish()
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  overflow: hidden;
  background-color: rgba(255, 255, 255, .66);
  &__text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .title {
    text-align: center;
    font-size: 14px;
    color: #aaa;
  }
}

.lds-spinner {
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #aaa;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
