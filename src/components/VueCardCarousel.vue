<template>
  <div class="c-backdrop" :style="backdropStyle">
    <Iteration
      v-for="element in listToIterate"
      :iterant="element"
      :key="element.cMainId"
      :parent-mid-point="midpoint"
      :is-touch="isTouch"
      :is-scrolling="isScrolling"
      :side-card-opacity="sideCardOpacity"
      :header-options="intHeaderOptions"
      :body-options="intBodyOptions"
      :footer-options="intFooterOptions"
      @ontouch="handleTouch"
      @onscroll="handleScroll"
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
    Iteration,
  },

  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    hideBackdrop: {
      type: Boolean,
      required: false,
      default: false,
    },
    sideCardOpacity: {
      type: Number,
      required: false,
      default: 0.3,
    },
    headerOptions: {
      type: Object,
      required: false,
    },
    bodyOptions: {
      type: Object,
      required: false,
    },
    footerOptions: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      listToIterate: [],
      midpoint: 0,
      isTouch: false,
      fullWidth: 0,
      quarterWidth: 0,
      elClosestToMiddle: { cMainId: 0 },
      isScrolling: false,
      intHeaderOptions: {
        isVisible: true,
        backgroundColor: null,
      },
      intBodyOptions: {
        backgroundColor: null,
      },
      intFooterOptions: {
        isVisible: true,
        backgroundColor: null,
      },
    };
  },

  methods: {
    setLayoutProps() {
      if (this.headerOptions) {
        this.intHeaderOptions = Object.assign(
          this.intHeaderOptions,
          this.headerOptions
        );
      }
      if (this.bodyOptions) {
        this.intBodyOptions = Object.assign(
          this.intBodyOptions,
          this.bodyOptions
        );
      }
      if (this.footerOptions) {
        this.intFooterOptions = Object.assign(
          this.intFooterOptions,
          this.footerOptions
        );
      }
    },
    setParentCoords() {
      const rect = this.$el.getBoundingClientRect();
      this.midpoint = rect.width / 2 + rect.left;
      this.fullWidth = window.screen.width;
      this.quarterWidth = window.screen.width * 0.25;
    },
    handleTouch(bool, leftStart) {
      this.isTouch = !this.isTouch;
      // if touch is released, snap to middle
      if (!bool) {
        this.elClosestToMiddle = this.getClosestElToMiddle();
        const opt = {
          top: 0,
          left: this.elClosestToMiddle.distFromParentCenter,
          behavior: "smooth",
        };
        this.$el.scrollBy(opt);
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
  },

  computed: {
    backdropStyle() {
      return !this.hideBackdrop
        ? { "background-color": `rgba(0, 0, 0, 0.3)` }
        : null;
    },
  },

  mounted() {
    window.addEventListener("resize", this.setParentCoords, false);
    this.setParentCoords();
  },

  destroyed() {
    window.removeEventListener("resize", this.setParentCoords, false);
  },

  created() {
    this.setLayoutProps();
    this.listToIterate = this.items.map((row, index) => ({
      ...row,
      cMainId: index,
      distFromParentCenter: 0,
      startLeftDist: 0,
    }));
  },
};
</script>

<style scoped lang="scss">
.c-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
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
