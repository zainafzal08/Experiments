<template>
  <Card :selectable="true">
    <template slot="title">{{race.name}}</template>
    <template slot="subtitle">{{race.tagline}}</template>
    <template slot="content">
      <div class="physical-information">
        <div v-for="item of Object.keys(race.physical)" class="desc-pair">
          <b>{{item}}</b><span>{{race.physical[item]}}</span>
        </div>
      </div>
      <div class="features">
        <div class="tabs">
          <div
          v-for="feature of Object.keys(race.features)"
          :class="{
            'tab': true,
            'active': activeTab===feature
          }"
          @click="activeTab = feature"
          ><i :class="`mdi mdi-${race.features[feature].icon}`"></i></div>
        </div>
        <div class="tab-content">
          <h3>{{race.features[activeTab].fullName}}</h3>
          <p>{{race.features[activeTab].desc}}</p>
        </div>
      </div>
      <div class="stats">
        <div class="statItem"></div>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from './Card.vue'
export default {
  name: 'RaceCard',
  props: ["race"],
  components: {Card},
  data () {
    return {
      activeTab: Object.keys(this.race.features)[0]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.physical-information {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.desc-pair {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.desc-pair b{
  margin-bottom: 0.5rem;
  color: #444;
  font-size: 0.8rem;
  text-align: center;
  text-transform: capitalize;
}
.desc-pair span{
  color: #777;
  font-size: 0.8rem;
  text-align: center;
}

.features {
  margin-top: 2rem;
}

.tabs {
  width: 100%;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  font-size: 0.8rem;
  color: #BBB;
  border: 1px #EBEBEB solid;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
}
.tabs .tab {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid #EBEBEB;
}

.tabs .tab.active {
  border-bottom: 1px solid #2589BD;
  color: #777;
}
.tab-content {
  width: calc(100% - 2rem);
  height: 10rem;
  background: #FAFAFA;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border: 1px solid #EBEBEB;
  padding-left: 1rem;
  padding-right: 1rem;
}
.tab-content h3 {
  font-size: 1rem;
}
.tab-content p {
  font-size: 0.8rem;
  color: #777;
}
</style>
