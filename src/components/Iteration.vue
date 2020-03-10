<template>
  <div :class="['c-main', isLeft || isRight ? 'non-active' : null]">
    <div>Moust-Left: {{ left }}</div>
    <div>Mouse-Top: {{ top }}</div>
    <div>Top: {{ offSetTop }}</div>
    <div>Left: {{ offSetLeft }}</div>
    <div>Midpoint: {{ midpoint }}</div>
    <div>Is Left: {{ isLeft }}</div>
  </div>
</template>

<script>
export default {
  props: {
    iterant: {
      type: Object,
      default: () => {}
    },
    parentMidPoint: {
      type: Number,
      required: true,
      default: 0
    },
    isTouch: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data () {
    return {
      left: 0,
      top: 0,
      offSetLeft: 0,
      offSetTop: 0,
      midpoint: 0
    }
  },

  methods: {
    callback (e) {
      this.$emit('ontouch', true)
      this.getCoords(e)
    },
    endTouch () {
      this.$emit('ontouch', false)
    },
    getCoords (e) {
      if (e) {
        this.left = e.touches[0].clientX
        this.top = e.touches[0].clientY
      }

      const rect = this.$el.getBoundingClientRect()
      this.offSetTop = rect.top
      this.offSetLeft = rect.left
      this.midpoint = rect.width / 2 + rect.left
    }
  },

  computed: {
    isLeft () {
      return this.midpoint + this.midpoint * 0.15 < this.parentMidPoint
    },
    isRight () {
      return this.midpoint + this.midpoint * 0.15 > this.parentMidPoint
    }
  },

  mounted () {
    this.$el.addEventListener('touchstart', this.callback, false)
    this.$el.addEventListener('touchmove', this.callback, false)
    this.$el.addEventListener('touchend', this.endTouch, false)
  },

  watch: {
    isTouch () {
      if (this.isTouch) {
        this.getCoords()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.c-main {
  position: relative;
  background: grey;
  box-shadow: 2px 2px 15px 1px;
  // display: flex;
  // flex-direction: column;
  min-width: 75vw;
  margin: 0 1em 0 1em;
  padding: 3em 0 3em 0;
  border-radius: 1.15em;
  top: 0;
  transition: top 1s;

  //   flex-shrink: 0;
  //   background: grey;
  //   width: 300px;
  //   height: 200px;
  //   border-radius: 10px;
  //   margin-left: 10px;
  //   background-size: cover;
  //   background-repeat: no-repeat;
  //   background-position: center center;
}

.non-active {
  top: 2em;
}
</style>
