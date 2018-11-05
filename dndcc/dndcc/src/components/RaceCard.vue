<template>
  <div @click="flipped=!flipped" class="overlap">
  <Card :selectable="true" :flipped="flipped">
    <template slot="title">{{race.name}}</template>
    <template slot="subtitle">{{race.tagline}}</template>
    <template slot="content">
      <div class="physical-information">
        <div v-for="item of Object.keys(race.physical)" class="desc-pair">
          <b>{{item}}</b><span>{{race.physical[item]}}</span>
        </div>
      </div>
      <div class="features" @click.stop="">
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
        <div class="stat-item">
          <p>Tanking</p>
          <div class="bar-container">
            <div class="bar blue" :style="{'width':`${race.summaryStats.tanking}%`}"></div>
          </div>
        </div>
        <div class="stat-item">
          <p>Healing</p>
          <div class="bar-container">
            <div class="bar green" :style="{'width':`${race.summaryStats.healing}%`}"></div>
          </div>
        </div>
        <div class="stat-item">
          <p>Spellcasting</p>
          <div class="bar-container">
            <div class="bar purple" :style="{'width':`${race.summaryStats.spellcasting}%`}"></div>
          </div>
        </div>
        <div class="stat-item">
          <p>Melee</p>
          <div class="bar-container">
            <div class="bar red" :style="{'width':`${race.summaryStats.melee}%`}"></div>
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Card :selectable="true" :flipped="!flipped">
    <template slot="title">{{race.name}}</template>
    <template slot="subtitle">Pick a Subclass</template>
    <template slot="content">
      <div class="accordian">
        <div v-for="subrace of Object.keys(race.subraces)"
          :class="{
            'tab': true,
            'first': subrace === Object.keys(race.subraces)[0]
          }"
          >
          <h3 :style="{'color': hashColor(subrace)}"><span>{{race.subraces[subrace].fullName}}</span></h3>
          <div class="accordian-content">
          </div>
        </div>
      </div>
      <div class="buttons">
      </div>
    </template>
  </Card>
  </div>
</template>

<script>
import Card from './Card.vue'
export default {
  name: 'RaceCard',
  props: ["race"],
  components: {Card},
  data () {
    return {
      activeTab: Object.keys(this.race.features)[0],
      flipped: false
    }
  },
  methods: {
    hashColor(name) {
      let c = name.hashCode() % 4;
      let colors = [
        "#2589BD",
        "#09BC8A",
        "#4C4C9D",
        "#EF476F"
      ];
      return colors[c];
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.overlap {
  width: 400px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.overlap>div {
  position: absolute;
}
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
.stats {
  width: 100%;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
}
.stat-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.4rem;
}
.stat-item p {
  width: 100%;
  font-size: 0.7rem;
  color: #777;
  margin: 0;
}
.bar-container {
  width: 100%;
  height: 0.6rem;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 15px;
  background-color: #EBEBEB;
}
.bar-container .bar {
  height: 100%;
  border-radius: 15px;
}
.bar-container .bar.blue {
  background-color: #2589BD;
}
.bar-container .bar.green {
  background-color: #09BC8A;
}
.bar-container .bar.purple {
  background-color: #4C4C9D;
}
.bar-container .bar.red {
  background-color: #EF476F;
}
.accordian {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.accordian .tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.accordian .tab .accordian-content {
  width: 100%;
  height: 0px;
  background-color: #FAFAFA;
}
.accordian .tab.active .accordian-content {
  width: 100%;
  height: 15rem;
  border: 1px solid #EBEBEB;
  border-top: none;
}
.accordian .tab.first>h3{
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-top: 1px solid #EBEBEB;
}
.accordian .tab>h3 {
  font-size: 0.9rem;
  margin: 0px;
  width: 100%;
  font-weight: 300;
  text-align: center;
  height: 1.1rem;
  border: 1px solid #EBEBEB;
  border-top: none;
}
.accordian .tab>h3>span {
  opacity: 0.5;
}
.accordian .tab.active>h3>span {
    opacity: 1;
}
.accordian .tab>h3>span:hover {
  opacity: 1;
}
.buttons {
  width: 100%;
  height: 1.5rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
}
</style>
