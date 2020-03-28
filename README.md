# vue-card-carousel

## Installation

Via NPM:

```
npm i vue-card-carousel
```

## Usage

You can choose to either install globally or locally, as desired:

Globally:

```
import Vue from 'vue'
import App from './App.vue'
import VueCardCarousel from "vue-card-carousel";

Vue.use(VueCardCarousel)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

or locally to a component:

```
import { VueCardCarousel } from "vue-card-carousel";

export default {
    components: {
        VueCardCarousel
    }
}
```
