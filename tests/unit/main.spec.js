import { expect } from 'chai'
import { shallowMount, mount } from '@vue/test-utils'
import VueCardCarousel from '@/components/VueCardCarousel.vue'
import Iteration from '@/components/Iteration.vue'

describe('VueCardCarousel.vue', () => {
  it('Should render parent on mount', () => {
    const arrList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = shallowMount(VueCardCarousel, {
      propsData: { items: arrList }
    })
    expect(wrapper.exists())
  })
})

describe('VueCardCarousel.vue', () => {
  it('No children should be displayed when 0 items pass through', () => {
    const arrList = []
    const wrapper = mount(VueCardCarousel, {
      propsData: { items: arrList }
    })
    expect(typeof wrapper.find(Iteration).vm).equal('undefined')
  })
})

describe('VueCardCarousel.vue', () => {
  it('The number of child components should match the number of passed in items to the parent', () => {
    const arrList = [1, 2, 3]
    const wrapper = mount(VueCardCarousel, {
      propsData: { items: arrList }
    })
    const wrapperArr = wrapper.findAll(Iteration)
    const first = wrapperArr.at(0)
    expect(first.is(Iteration)).equal(true)
    const second = wrapperArr.at(1)
    expect(second.is(Iteration)).equal(true)
    const third = wrapperArr.at(2)
    expect(third.is(Iteration)).equal(true)
    expect(wrapperArr.length).equal(arrList.length)
  })
})

describe('VueCardCarousel.vue', () => {
  it('OnTouch should set parent data prop of isTouch to true', () => {
    const arrList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = mount(VueCardCarousel, {
      propsData: { items: arrList }
    })
    wrapper.find(Iteration).vm.$emit('ontouch')
    expect(wrapper.vm.$data.isTouch).equal(true)
  })
})

describe('VueCardCarousel.vue', () => {
  it('OnScroll should set parent data prop of isScrolling to emitted boolean value', () => {
    const arrList = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    const wrapper = mount(VueCardCarousel, {
      propsData: { items: arrList }
    })
    wrapper.find(Iteration).vm.$emit('onscroll', false)
    expect(wrapper.vm.$data.isScrolling).equal(false)
    wrapper.find(Iteration).vm.$emit('onscroll', true)
    expect(wrapper.vm.$data.isScrolling).equal(true)
  })
})
