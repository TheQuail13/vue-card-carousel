<template>
  <div class="c-backdrop" :style="backdropStyle">
    <Iteration
      v-for="element in listToIterate"
      :iterant="element"
      :key="element.cMainId"
      :parent-mid-point="midpoint"
      :is-touch="isTouch"
      :is-scrolling="isScrolling"
      :is-mouse-up="isMouseUp"
      :is-init-scroll="isInitScroll"
      :side-card-opacity="sideCardOpacity"
      :header-options="intHeaderOptions"
      :footer-options="intFooterOptions"
      @ontouch="handleTouch"
      @onscroll="handleScroll"
      @initscrollcomplete="updateInitScroll"
    >
      <template v-slot:header>
        <slot :headerProp="element" name="header"></slot>
      </template>
      <template>
        <slot :bodyProp="element"></slot>
      </template>
      <template v-slot:footer>
        <slot :footerProp="element" name="footer"></slot>
      </template>
    </Iteration>
  </div>
</template>

<script>
import Iteration from "./Iteration";

export default {
  name: "VueCardCarousel",

  components: {
    Iteration
  },

  props: {
    items: {
      type: Array,
      required: true,
      default: () => []
    },
    startIndex: {
      type: Number,
      required: false,
      default: 0
    },
    hideBackdrop: {
      type: Boolean,
      required: false,
      default: false
    },
    sideCardOpacity: {
      type: Number,
      required: false,
      default: 0.3
    },
    headerOptions: {
      type: Object,
      required: false
    },
    bodyOptions: {
      type: Object,
      required: false
    },
    footerOptions: {
      type: Object,
      required: false
    }
  },

  data() {
    return {
      listToIterate: [],
      left: 0,
      right: 0,
      midpoint: 0,
      isTouch: false,
      fullWidth: 0,
      quarterWidth: 0,
      elClosestToMiddle: { cMainId: 0 },
      isScrolling: false,
      isInitScroll: false,
      pageX: 0,
      pageLeft: 0,
      isMouseUp: false
    };
  },

  methods: {
    setParentCoords() {
      const rect = this.$el.getBoundingClientRect();
      this.left = rect.left;
      this.right = rect.right;
      this.midpoint = rect.width / 2 + rect.left;
      this.fullWidth = window.screen.width;
      this.quarterWidth = window.screen.width * 0.25;
    },
    initScroll() {
      if (typeof this.listToIterate[this.startIndex] !== "undefined") {
        this.isInitScroll = this.startIndex > 0;
        const diff =
          this.listToIterate[~~this.startIndex].distFromParentCenter -
          this.midpoint;
        this.$el.scrollBy(diff, 0);
        this.handleScroll(true);
        if (this.isScrolling) {
          setTimeout(() => this.handleScroll(false), 1000);
        }
      }
    },
    updateInitScroll() {
      this.isInitScroll = false;
    },
    handleTouch(bool) {
      this.isTouch = !this.isTouch;
      // if touch is released, snap to middle
      if (!bool) {
        this.elClosestToMiddle = this.getClosestElToMiddle();
        const opt = {
          top: 0,
          left: this.elClosestToMiddle.distFromParentCenter,
          behavior: "smooth"
        };
        this.$el.scrollBy(opt);
        this.listToIterate.forEach(itm => {
          itm.isVisible =
            Math.abs(this.elClosestToMiddle.cMainId - itm.cMainId) < 2;
        });
      }
    },
    handleScroll(isScrolling) {
      this.isScrolling = isScrolling;
    },
    getClosestElToMiddle() {
      if (this.listToIterate.length > 0) {
        return this.listToIterate.reduce(
          (acc, curr) =>
            Math.abs(acc.distFromParentCenter) <
            Math.abs(curr.distFromParentCenter)
              ? acc
              : curr,
          {}
        );
      }
      return {};
    },
    onMouseDown(e) {
      e.preventDefault();
      this.isMouseUp = false;
      this.pageX = e.pageX;
      this.pageLeft = this.$el.scrollLeft;

      this.$el.addEventListener("mousemove", this.onMouseDragging);
      this.$el.addEventListener("mouseup", this.snapToMiddle);
    },
    onMouseDragging(e) {
      e.preventDefault();
      if (!this.isMouseBetweenBoundaries(e.clientX)) {
        this.snapToMiddle();
      } else {
        this.$el.scrollLeft = this.pageLeft - e.pageX + this.pageX;
        this.handleTouch(true);
        this.handleScroll(true);
      }
    },
    snapToMiddle() {
      this.isMouseUp = true;
      this.$el.removeEventListener("mousemove", this.onMouseDragging);
      this.$el.removeEventListener("mouseup", this.snapToMiddle);
    },
    isMouseBetweenBoundaries(mouseX) {
      if (mouseX < this.right * 0.98 && mouseX > this.left * 1.02) {
        return true;
      }
      return false;
    }
  },

  computed: {
    backdropStyle() {
      return !this.hideBackdrop
        ? { "background-color": `rgba(0, 0, 0, 0.3)` }
        : null;
    },
    intHeaderOptions() {
      const opt = {
        isVisible: true,
        backgroundColor: null
      };
      if (this.headerOptions) {
        return Object.assign(opt, this.headerOptions);
      }
      return opt;
    },
    intBodyOptions() {
      const opt = {
        backgroundColor: null
      };
      if (this.bodyOptions) {
        return Object.assign(opt, this.bodyOptions);
      }
      return opt;
    },
    intFooterOptions() {
      const opt = {
        isVisible: true,
        backgroundColor: null
      };
      if (this.footerOptions) {
        return Object.assign(opt, this.footerOptions);
      }
      return opt;
    }
  },

  mounted() {
    window.addEventListener("resize", this.setParentCoords);
    this.$el.addEventListener("mousedown", this.onMouseDown);
    this.setParentCoords();
    this.initScroll();
  },

  destroyed() {
    window.removeEventListener("resize", this.setParentCoords);
    this.$el.removeEventListener("mousedown", this.onMouseDown);
    this.$el.removeEventListener("mousemove", this.onMouseDragging);
  },

  created() {
    this.listToIterate = this.items.map((row, index) => ({
      ...row,
      cMainId: index,
      distFromParentCenter: 0,
      startLeftDist: 0,
      isVisible: index < 2
    }));
  }
};
</script>

<style scoped lang="scss">
.c-backdrop {
  display: flex;
  overflow-x: scroll;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.c-backdrop::-webkit-scrollbar {
  display: none;
}

.c-backdrop {
  -ms-overflow-style: none;
}

.c-main {
  will-change: height, opacity;
  transform: translateZ(0);
}

.c-main:first-child {
  margin-left: 13%;
}

// necessary for overflow not displaying right-padding
// credit: https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4
.c-main:after {
  content: "";
  display: block;
  position: absolute;
  right: -15%;
  width: 13%;
  height: 1px;
}
</style>
