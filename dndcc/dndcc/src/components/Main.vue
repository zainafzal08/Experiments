<template>
  <div class="snap">
    <div class="title">
      <h1>
        <input type="text" v-model="name"></input>
        Is a
        <span class="selectedRace">{{raceName}}</span>,
        <span class="selectedRace">{{className}}</span>
      </h1>
    </div>
    <div class="selector">
      <div class="content">
        <RaceCard v-for="race in races" :race="race" :selected="raceName" :key="race.name" @selectionUpdate="update($event)"></RaceCard>
      </div>
    </div>
    <div class="selector">
      <div class="content">

      </div>
    </div>
  </div>
</template>

<script>
import RaceCard from './RaceCard.vue'
import allRaces from './../assets/races.json'

export default {
  name: 'Main',
  components: {RaceCard},
  data () {
    return {
      title: " Is a",
      name: "Analytica",
      raceName: "...",
      className: "...",
      races: allRaces
    }
  },
  methods: {
    update(changes) {
      for (let change of Object.keys(changes))
        this[change] = changes[change];
    }
  },
  created() {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  width: 100%;
  height: 15vh;
  display: flex;
  align-items: center;
}
.title h1 {
  margin-left: 5rem;
  font-size: 2rem;
  margin-bottom: 2px;
  margin-top: 0px;
}

.title input {
  border: none;
  background-color: rgba(0,0,0,0);
  border-bottom: 2px solid #EBEBEB;
  font-size: 2rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-weight: 100;
  width: 10rem;
  text-align: center;
}
.title input:focus {
  outline: none;
  border-bottom: 2px solid #2589BD;
}
.title span {
   color: #2589BD;
}
.selector {
  height: 700px;
  width: 100vw;
  max-width: 100vw;
  overflow-x: scroll;
}
.selector .content {
  height: 100%;
  width: auto;
  white-space: nowrap;
  display: flex;
  align-items: row;
}
</style>
