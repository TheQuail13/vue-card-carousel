<template>
  <div class="c-main" :style="iterantStyle">
    <div
      v-if="headerOptions.isVisible"
      :style="headerStyle"
      class="c-main-header"
    >
      <slot name="header"></slot>
    </div>
    <div :style="bodyStyle" class="c-main-body">
      <slot></slot>
    </div>
    <div
      v-if="footerOptions.isVisible"
      :style="footerStyle"
      class="c-main-footer"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Iteration",

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
    headerOptions: {
      type: Object,
      required: true
    },
    bodyOptions: {
      type: Object,
      required: true
    },
    footerOptions: {
      type: Object,
      required: true
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
        this.parentMidPoint !== 0
          ? Math.abs(this.elMidpoint - this.parentMidPoint) /
            this.parentMidPoint
          : 0;

      if (typeof percFromParent === "number") {
        return {
          height: `${Math.max(1.0 - percFromParent * 0.35, 0.4) * 100}vh`,
          opacity: Math.max(1.45 - percFromParent, 0.3)
        };
      }

      return {
        height: "100vh",
        opacity: 1
      };
    },
    headerStyle() {
      if (this.headerOptions) {
        return {
          "background-color": `${this.headerOptions.backgroundColor} !important`
        };
      }
      return null;
    },
    bodyStyle() {
      if (this.bodyOptions) {
        return {
          "background-color": `${this.bodyOptions.backgroundColor} !important`
        };
      }
      return null;
    },
    footerStyle() {
      if (this.footerOptions) {
        return {
          "background-color": `${this.footerOptions.backgroundColor} !important`
        };
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
  max-height: 80%;
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

.c-main-body::-webkit-scrollbar {
  display: none;
}

.c-main-body {
  -ms-overflow-style: none;
}

.c-main-footer {
  border-radius: 0 0 1.15em 1.15em;
  padding: 1.5em;
}
</style>
