<template>
  <div id="app">
    <HelloWorld
      :elements="elements"
      :show-header="true"
      :show-footer="true"
      header-color="#28a745"
      footer-color="#17a2b8"
    >
      <template v-slot:header><strong>Header</strong></template>
      <template v-slot:default="slotProps">
        <div v-for="n in 25" :key="n">
          {{ slotProps.iterantProp.cMainId }}. Hello from the Parent
        </div>
      </template>
      <template v-slot:footer><strong>Footer</strong></template>
    </HelloWorld>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data() {
    return {
      elements: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
