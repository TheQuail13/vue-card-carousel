<template>
  <div :class="['c-main']" :style="iterantStyle">
    <div v-if="showHeader" :style="headerStyle" class="c-main-header">
      <slot name="header"></slot>
    </div>
    <div :style="bodyStyle" class="c-main-body"><slot></slot></div>
    <div v-if="showFooter" :style="footerStyle" class="c-main-footer">
      <slot name="footer"></slot>
    </div>
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
    },
    isScrolling: {
      type: Boolean,
      required: true,
      default: false
    },
    showHeader: {
      type: Boolean,
      required: false,
      default: true
    },
    showFooter: {
      type: Boolean,
      required: false,
      default: true
    },
    headerColor: {
      type: String,
      required: false
    },

    bodyColor: {
      type: String,
      required: false
    },
    footerColor: {
      type: String,
      required: false
    }
  },

  data() {
    return {
      left: 0,
      elMidpoint: 0,
      lastScrollLeft: 0,
      scrollingId: 0,
      stopId: 0,
      startTime: null,
      duration: 1000
    };
  },

  methods: {
    onTouchWrapper() {
      this.$emit("onscroll", true);
      this.touchStart();
    },
    touchStart() {
      this.$emit("ontouch", true);
      this.getElCoords();
    },
    isTouching() {
      this.getElCoords();
      if (this.isScrolling) {
        this.scrollingId = window.requestAnimationFrame(this.isTouching);
      } else {
        window.cancelAnimationFrame(this.scrollingId);
      }
    },
    endTouch() {
      this.$emit("ontouch", false, this.iterant.startLeftDist);
      this.$emit("onscroll", false);
      this.startTime = performance.now();
      this.stopId = window.requestAnimationFrame(this.checkIsScrolling);
    },
    getElCoords() {
      const rect = this.$el.getBoundingClientRect();
      this.left = rect.left;
      this.elMidpoint = rect.width / 2 + rect.left;
      this.iterant.distFromParentCenter = this.elMidpoint - this.parentMidPoint;
    },
    checkIsScrolling(timestamp) {
      const elLeft = this.$el.getBoundingClientRect().left;
      const newTimestamp = timestamp || new Date().getTime();
      const runtime = newTimestamp - this.startTime;
      if (this.lastScrollLeft !== elLeft || runtime < this.duration) {
        this.lastScrollLeft = elLeft;
        this.touchStart();
        this.stopId = window.requestAnimationFrame(this.checkIsScrolling);
      } else {
        this.touchStart();
        window.cancelAnimationFrame(this.stopId);
      }
    }
  },

  computed: {
    iterantStyle() {
      const percFromParent =
        Math.abs(this.elMidpoint - this.parentMidPoint) / this.parentMidPoint;
      if (typeof percFromParent === "number") {
        return {
          height: `${Math.max(1.0 - percFromParent * 0.35, 0.4) * 100}vh`,
          opacity: `${Math.max(1.45 - percFromParent, 0.2)}`
        };
      }

      return null;
    },
    headerStyle() {
      if (this.headerColor) {
        return { "background-color": `${this.headerColor} !important` };
      }
      return null;
    },
    bodyStyle() {
      if (this.bodyColor) {
        return { "background-color": `${this.bodyColor} !important` };
      }
      return null;
    },
    footerStyle() {
      if (this.footerColor) {
        return { "background-color": `${this.footerColor} !important` };
      }
      return null;
    }
  },

  mounted() {
    this.iterant.startLeftDist = this.$el.offsetLeft;
    this.$el.addEventListener("touchstart", this.onTouchWrapper, false);
    this.$el.addEventListener("touchend", this.endTouch, false);
    this.getElCoords();
  },

  destroyed() {
    this.$el.removeEventListener("touchstart", this.onTouchWrapper, false);
    this.$el.removeEventListener("touchend", this.endTouch, false);
  },

  watch: {
    isTouch() {
      this.getElCoords();
    },
    isScrolling() {
      if (this.isScrolling) {
        this.scrollingId = window.requestAnimationFrame(this.isTouching);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  position: relative;
  background: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 15px 1px;
  min-width: 75vw;
  margin: auto 0.85em auto 0.85em;
  border-radius: 1.15em;
  top: 0;
  max-height: 70%;
  transition: height;
}

.c-main-header {
  border-radius: 1.15em 1.15em 0 0;
  padding: 1.5em;
}

.c-main-body {
  overflow-y: scroll;
  height: 100%;
  margin: 0.75em;
}

.c-main-footer {
  border-radius: 0 0 1.15em 1.15em;
  padding: 1.5em;
}
</style>
