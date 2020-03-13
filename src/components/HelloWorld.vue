<template>
  <div class="c-backdrop">
    <Iteration
      v-for="(el, elIdx) in listToIterate"
      :iterant="el"
      :key="elIdx"
      :parent-mid-point="midpoint"
      :is-touch="isTouch"
      @ontouch="handleTouch"
    ></Iteration>
  </div>
</template>

<script>
import Iteration from "./Iteration";

export default {
  components: {
    Iteration
  },

  props: {
    elements: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      listToIterate: [],
      midpoint: 0,
      isTouch: false,
      fullWidth: 0,
      quarterWidth: 0,
      elClosestToMiddle: null
    };
  },

  methods: {
    handleTouch(bool, leftStart) {
      this.isTouch = !this.isTouch;
      if (!bool) {
        this.elClosestToMiddle = this.getClosestElToMiddle();
        const opt = {
          top: 0,
          left: this.elClosestToMiddle.distFromParentCenter,
          behavior: "smooth"
        };
        this.$el.scrollBy(opt);
        // this.isTouch = !this.isTouch;
      }
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
    }
  },

  mounted() {
    const rect = this.$el.getBoundingClientRect();
    this.midpoint = rect.width / 2 + rect.left;
    this.fullWidth = window.screen.width;
    this.quarterWidth = window.screen.width * 0.25;
  },

  created() {
    this.listToIterate = this.elements.map((row, index) => ({
      ...row,
      cMainId: index,
      distFromParentCenter: 0,
      startLeftDist: 0
    }));
  }
};
</script>

<style scoped lang="scss">
.c-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  overflow-x: scroll;
  width: 100%;
  height: 100%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.c-backdrop::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE and Edge */
.c-backdrop {
  -ms-overflow-style: none;
}

.c-main:first-child {
  margin-left: 3rem;
}

// necessary for overflow not displaying right-padding
// credit: https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4
.c-main:after {
  content: "";
  display: block;
  position: absolute;
  right: -3rem;
  width: 3rem;
  height: 1px;
}
</style>
