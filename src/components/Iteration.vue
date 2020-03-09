<template>
  <div class="c-main">
    <span>Moust-Left: {{ left }}</span>
    <span>Mouse-Top: {{ top }}</span>
    <span>Top: {{ offSetTop }}</span>
    <span>Left: {{ offSetLeft }}</span>
    <span>Midpoint: {{ midpoint }}</span>
    <span>Left or Right: {{ isLeft }}</span>
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
    }
  },

  data() {
    return {
      left: 0,
      top: 0,
      offSetLeft: 0,
      offSetTop: 0,
      midpoint: 0
    };
  },

  methods: {
    callback(e) {
      const rect = this.$el.getBoundingClientRect();
      this.left = e.touches[0].clientX;
      this.top = e.touches[0].clientY;
      this.offSetTop = rect.top;
      this.offSetLeft = rect.left;
      this.midpoint = rect.width / 2 + rect.left;
    }
  },

  computed: {
    isLeft() {
      return this.midpoint < this.parentMidPoint;
    }
  },

  mounted() {
    this.$el.addEventListener("touchstart", this.callback, false);
    this.$el.addEventListener("touchmove", this.callback, false);
  }
};
</script>

<style lang="scss" scoped>
.c-main {
  position: relative;
  background: grey;
  box-shadow: 2px 2px 15px 1px;
  display: flex;
  flex-direction: column;
  min-width: 50vw;
  margin: 10em;
  border-radius: 1.15em;
  padding: 5em;
}
</style>
