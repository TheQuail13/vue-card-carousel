<template>
  <div class="c-main" :style="iterantStyle">
    <div
      v-if="headerOptions.isVisible"
      :style="headerStyle"
      class="c-main-header"
    >
      <slot name="header"></slot>
    </div>
    <div class="c-main-body">
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
    isMouseUp: {
      type: Boolean,
      required: true,
      default: false
    },
    isInitScroll: {
      type: Boolean,
      required: true,
      default: false
    },
    sideCardOpacity: {
      type: Number,
      required: false,
      default: 0.25
    },
    headerOptions: {
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
        this.$emit("initscrollcomplete");
        window.cancelAnimationFrame(this.scrollingId);
      }
    },
    endTouch() {
      this.$emit("ontouch", false);
      this.$emit("onscroll", false);
      this.startTime = performance.now();
      this.stopId = window.requestAnimationFrame(this.checkIsScrolling);
    },
    getElCoords() {
      const rect = this.$el.getBoundingClientRect();
      if (this.iterant.cMainId === 0) {
        console.log(rect);
        console.log(this);
      }

      this.left = rect.left;
      this.elMidpoint = rect.width / 2 + rect.left;
      this.iterant.distFromParentCenter = this.elMidpoint - this.parentMidPoint;
    },
    checkIsScrolling(timestamp) {
      const elLeft = this.$el.getBoundingClientRect().left;
      const newTimestamp = timestamp || new Date().getTime();
      const runtime = newTimestamp - this.startTime;
      this.touchStart();
      if (this.lastScrollLeft !== elLeft || runtime < this.duration) {
        this.lastScrollLeft = elLeft;
        this.stopId = window.requestAnimationFrame(this.checkIsScrolling);
      } else {
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
          height: `${Math.max(1 - percFromParent * 0.6, 0.4) * 100}%`,
          opacity: Math.max(1 - percFromParent, this.sideCardOpacity)
        };
      }

      return {
        height: "100%",
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
    this.$el.addEventListener("touchstart", this.onTouchWrapper);
    this.$el.addEventListener("touchend", this.endTouch);
    this.getElCoords();
  },

  destroyed() {
    this.$el.removeEventListener("touchstart", this.onTouchWrapper);
    this.$el.removeEventListener("touchend", this.endTouch);
  },

  watch: {
    isTouch() {
      this.getElCoords();
    },
    isScrolling() {
      if (this.isScrolling && (this.iterant.isVisible || this.isInitScroll)) {
        this.scrollingId = window.requestAnimationFrame(this.isTouching);
      }
    },
    isMouseUp() {
      if (this.isMouseUp && this.iterant.isVisible) {
        this.endTouch();
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
  min-width: 75%;
  margin: auto 0.85em auto 0.85em;
  border-radius: 1em;
  top: 0;
  max-height: 83%;
  transition: height;
}

.c-main-header {
  border-radius: 1em 1em 0 0;
  padding: 1em;
}

.c-main-body {
  overflow-y: scroll;
  height: 100%;
  margin: 0.5em;
}

.c-main-body::-webkit-scrollbar {
  display: none;
}

.c-main-body {
  -ms-overflow-style: none;
}

.c-main-footer {
  border-radius: 0 0 1em 1em;
  padding: 1em;
}
</style>
