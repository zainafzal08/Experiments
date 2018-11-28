<template>
  <svg class="family-tree" viewBox="0 0 400 150">
    <g id="root">
      <text fill="#444444" :x="200-root.length*4" y="20"> {{root}} </text>
      <line x1="200" y1="25" x2="200" y2="50" stroke="#BBB"></line>
      <line :x1="base" y1="50" :x2="400-base" y2="50" stroke="#BBB"></line>
    </g>
    <g v-for="(child,i) in children" :transform="'translate('+xDisplace(i)+',50)'">
      <line x1="0" y1="0" x2="0" y2="20" stroke="#BBB"></line>
      <text fill="#444444" :x="-child.length*4" y="45"> {{child}} </text>
      <line x1="0" y1="60" x2="0" y2="80" stroke="#BBB"></line>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'FamilyTree',
  props: [
    "root",
    "children"
  ],
  data () {
    return {}
  },
  computed: {
    base() {
      let numE = this.children.length;
      if (numE === 1 || numE === 0) return 200;
      return 200/(2*(numE-1));
    }
  },
  methods: {
    xDisplace(index) {
      let gap;
      let numE = this.children.length;
      if (numE === 1 || numE === 0) gap = 0;
      else gap = (400 - 2*this.base)/(numE-1);
      let offset = gap*index;
      return this.base+offset;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.family-tree {
  width: 100%;
  height: 8rem;
}
.family-tree text{
  font-family: 'Inconsolata', monospace;
}
</style>
