<template>
  <div :class="['c-main']" :style="topStyle">
    <div>Moust-Left: {{ left }}</div>
    <div>Mouse-Top: {{ top }}</div>
    <div>Top: {{ offSetTop }}</div>
    <div>Left: {{ offSetLeft }}</div>
    <div>Midpoint: {{ midpoint }}</div>
    <div>Parent Midpoint: {{ parentMidPoint }}</div>
    <div>Midpoint Absolute Diff: {{ absMidpointDist }}</div>
    <div>% From Parent Midpoint: {{ percentFromParentMidpoint }}</div>
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

  data() {
    return {
      left: 0,
      top: 0,
      offSetLeft: 0,
      offSetTop: 0,
      midpoint: 0,
      screenWidth: 75
    };
  },

  methods: {
    callback(e) {
      this.$emit("ontouch", true);
      this.getCoords(e);
    },
    endTouch() {
      this.$emit("ontouch", false);
    },
    getCoords(e) {
      if (e) {
        this.left = e.touches[0].clientX;
        this.top = e.touches[0].clientY;
      }

      const rect = this.$el.getBoundingClientRect();
      this.offSetTop = rect.top;
      this.offSetLeft = rect.left;
      this.midpoint = rect.width / 2 + rect.left;
    }
  },

  computed: {
    isLeft() {
      return this.midpoint + this.midpoint * 0.15 < this.parentMidPoint;
    },
    isRight() {
      return this.midpoint + this.midpoint * 0.15 > this.parentMidPoint;
    },
    absMidpointDist() {
      return Math.abs(this.midpoint - this.parentMidPoint);
    },
    percentFromParentMidpoint() {
      return this.absMidpointDist / this.parentMidPoint;
    },
    topStyle() {
      if (this.percentFromParentMidpoint) {
        return {
          top: `${this.percentFromParentMidpoint * 3}em`
        };
      }

      return null;
    }
  },

  mounted() {
    this.$el.addEventListener("touchstart", this.callback, false);
    this.$el.addEventListener("touchmove", this.callback, false);
    this.$el.addEventListener("touchend", this.endTouch, false);
  },

  watch: {
    isTouch() {
      if (this.isTouch) {
        this.getCoords();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  position: relative;
  background: grey;
  box-shadow: 2px 2px 15px 1px;
  min-width: 70vw;
  margin: 3em 1em 3em 1em;
  padding: 3em 0 3em 0;
  border-radius: 1.15em;
  top: 0;
  //   transition: top 0.15s;
}
</style>
