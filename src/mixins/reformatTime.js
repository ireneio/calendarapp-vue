export default {
  methods: {
    // e.g.'12:00' (String) -> 1200 (Number)
    reformatTime(time) {
      return +time
        .split(':')
        .join('')
    }
  }
}
