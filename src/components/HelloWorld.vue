<template>
  <div class="c-backdrop">
    <Iteration
      v-for="(el, elIdx) in listToIterate"
      :iterant="el"
      :key="elIdx"
      :parent-mid-point="midpoint"
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
      midpoint: 0
    };
  },
  computed: {
    parentMidPoint() {
      if (this.$el) {
        const rect = this.$el.getBoundingClientRect();
        return rect.width / 2 + rect.left;
      }
      return 0;
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
  justify-content: center;
  align-items: center;
  overflow-x: scroll;
  padding-top: 300px;
  padding-bottom: 300px;
}

// /* Hide scrollbar for Chrome, Safari and Opera */
// .c-backdrop::-webkit-scrollbar {
//   display: none;
// }

// /* Hide scrollbar for IE and Edge */
// .c-backdrop {
//   -ms-overflow-style: none;
// }
</style>
