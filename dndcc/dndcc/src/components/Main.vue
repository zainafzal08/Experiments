<template>
  <div class="snap">
    <div class="title">
      <h1>
        <input type="text" v-model="name"></input>
        Has Race:
        <span class="selectedRace">{{race}}</span>
      </h1>
    </div>
    <div class="selector">
      <div class="content">
        <RaceCard key="fullName" v-for="race in races" :race="race" @selectionUpdate="update($event)"></RaceCard>
      </div>
    </div>
    <div class="title">
      <h1>
        <input type="text" v-model="name"></input>
        Has Class:
        <span class="selectedRace">{{className}}</span>
      </h1>
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
      race: "...",
      className: "...",
      races: allRaces.splice(0,1)
    }
  },
  methods: {
    update(changes) {
      for (let change of Object.keys(changes))
        this[change] = changes[change];
    }
  },
  created() {
    /* Stolen from
     https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
     */
    String.prototype.hashCode = function() {
      var hash = 0, i, chr;
      if (this.length === 0) return hash;
      for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
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
  height: 70vh;
  width: 100%;
  overflow: scroll;
}
.selector .content {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
