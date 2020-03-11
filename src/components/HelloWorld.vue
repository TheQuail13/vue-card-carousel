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
      isTouch: false
    };
  },
  methods: {
    handleTouch(bool, dist) {
      this.isTouch = !this.isTouch;
      if (!bool) {
        // console.log(dist);
        // this.$el.scrollLeft = dist;
      }
    }
  },
  mounted() {
    const rect = this.$el.getBoundingClientRect();
    this.midpoint = rect.width / 2 + rect.left;
  },
  created() {
    this.listToIterate = this.elements.map((row, index) => ({
      ...row,
      cMainId: index
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
  scroll-snap-type: x mandatory;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.c-backdrop::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE and Edge */
.c-backdrop {
  -ms-overflow-style: none;
}

// necessary for overflow not displaying right-padding
// credit: https://blog.alexandergottlieb.com/overflow-scroll-and-the-right-padding-problem-a-css-only-solution-6d442915b3f4
.c-main:after {
  content: "";
  display: block;
  position: absolute;
  right: -2rem;
  width: 2rem;
  height: 1px;
}

.c-main:first-child {
  margin-left: 2rem;
}
</style>
