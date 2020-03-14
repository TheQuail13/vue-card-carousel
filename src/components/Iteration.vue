<template>
  <div :class="['c-main']" :style="topStyle">
    <!-- <div>Midpoint: {{ midpoint }}</div>
    <div>Parent Midpoint: {{ parentMidPoint }}</div>
    <div>Midpoint Diff: {{ midpointDist }}</div> -->
    <div>Id: {{ iterant.cMainId }}</div>
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
      midpoint: 0,
      lastScrollLeft: 0,
      animationId: 0
    };
  },

  methods: {
    onTouch(e) {
      this.$emit("ontouch", true);
      this.getCoords(e);
    },
    endTouch() {
      this.$emit("ontouch", false, this.iterant.startLeftDist);
      this.animationId = window.requestAnimationFrame(this.isScrolling);
    },
    getCoords(e) {
      const rect = this.$el.getBoundingClientRect();
      this.left = rect.left;
      this.midpoint = rect.width / 2 + rect.left;
      this.iterant.distFromParentCenter = this.midpoint - this.parentMidPoint;
    },
    isScrolling() {
      console.log("isScrolling");
      if (this.lastScrollLeft !== this.left) {
        console.log("scroll x");
        this.getCoords();
        this.lastScrollLeft = this.left;
        this.animationId = window.requestAnimationFrame(this.isScrolling);
      } else {
        console.log("scroll stopped");
        window.cancelAnimationFrame(this.animationId);
      }
    }
  },

  computed: {
    midpointDist() {
      return this.midpoint - this.parentMidPoint;
    },
    percentFromParentMidpoint() {
      return Math.abs(this.midpointDist) / this.parentMidPoint;
    },
    topStyle() {
      if (this.percentFromParentMidpoint) {
        return {
          height: `${Math.max(1.1 - this.percentFromParentMidpoint * 0.5, 0.5) *
            100}vh`,
          opacity: `${Math.max(1.65 - this.percentFromParentMidpoint, 0.45)}`
        };
      }

      return null;
    }
  },

  mounted() {
    this.iterant.startLeftDist = this.$el.offsetLeft;
    this.$el.addEventListener("touchstart", this.onTouch, false);
    this.$el.addEventListener("touchmove", this.onTouch, false);
    this.$el.addEventListener("touchend", this.endTouch, false);
  },

  destroyed() {
    this.$el.removeEventListener("touchstart", this.onTouch, false);
    this.$el.removeEventListener("touchmove", this.onTouch, false);
    this.$el.removeEventListener("touchend", this.endTouch, false);
  },

  watch: {
    isTouch() {
      this.getCoords();
    }
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  position: relative;
  background: white;
  box-shadow: 2px 2px 15px 1px;
  min-width: 75vw;
  margin: auto 0.85em auto 0.85em;
  padding: 3em 0 3em 0;
  border-radius: 1.15em;
  top: 0;
  max-height: 70%;
}
</style>
