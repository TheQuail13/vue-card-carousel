<template>
  <div :class="['c-main']" :style="topStyle"></div>
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
      elMidpoint: 0,
      lastScrollLeft: 0,
      animationId: 0
    };
  },

  methods: {
    onTouch() {
      this.$emit("ontouch", true);
      this.getElCoords();
    },
    endTouch() {
      this.$emit("ontouch", false, this.iterant.startLeftDist);
      this.animationId = window.requestAnimationFrame(this.checkIsScrolling);
    },
    getElCoords() {
      const rect = this.$el.getBoundingClientRect();
      this.left = rect.left;
      this.elMidpoint = rect.width / 2 + rect.left;
      this.iterant.distFromParentCenter = this.elMidpoint - this.parentMidPoint;
    },
    checkIsScrolling() {
      const elLeft = this.$el.getBoundingClientRect().left;
      if (this.lastScrollLeft !== elLeft) {
        this.lastScrollLeft = elLeft;
        this.onTouch();
        console.log("left", this.left);
        this.animationId = window.requestAnimationFrame(this.checkIsScrolling);
      } else {
        window.cancelAnimationFrame(this.animationId);
      }
    }
  },

  computed: {
    percentFromParentMidpoint() {
      return (
        Math.abs(this.elMidpoint - this.parentMidPoint) / this.parentMidPoint
      );
    },
    topStyle() {
      if (typeof this.percentFromParentMidpoint !== "undefined") {
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
      this.getElCoords();
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
