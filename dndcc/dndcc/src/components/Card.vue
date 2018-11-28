<template>
  <div :class="{
    'card': true,
    'clickable': selectable,
    'flipped': flipped,
    'back': back
    }"
    >
    <h2><slot name="title"></slot></h2>
    <h4><slot name="subtitle"></slot></h4>
    <hr>
    <div class="content">
      <slot name="content">

      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    selectable: {
      type: Boolean,
      default: false
    },
    flipped: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  width: 400px;
  height: 550px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  transition: all 0.3s;
  backface-visibility: hidden;
}
.card h2 {
  margin-left: 1rem;
  margin-bottom: 0px;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
.card h4 {
  margin-top: 0.2rem;
  margin-left: 1rem;
  font-size: 0.8rem;
  color: #777;
  font-weight: 400;
}
.card hr {
  outline: none;
  border: none;
  height: 2px;
  width: calc(100% - 2rem);
  margin-left: 1rem;
  margin-bottom: 1.5rem;
  background-color: #EBEBEB;
}
.content {
  width: calc(100% - 2rem);
  padding-left: 1rem;
  padding-right: 1rem;
}
.flipped {
  transform: rotateY(180deg);
  opacity: 0;
}
.back {
  margin-left: -100%;
}
</style>
