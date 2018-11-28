<template>
  <div @click="flipped=!flipped" class="card-stack">
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
          v-for="(feature,i) in race.features"
          :class="{
            'tab': true,
            'active': activeTab===i
          }"
          @click="activeTab = i"
          ><i :class="`mdi mdi-${feature.icon}`"></i></div>
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
            <div class="bar blue" :style="{'width':`40%`}"></div>
          </div>
        </div>
        <div class="stat-item">
          <p>Support</p>
          <div class="bar-container">
            <div class="bar green" :style="{'width':`50%`}"></div>
          </div>
        </div>
        <div class="stat-item">
          <p>Spellcasting</p>
          <div class="bar-container">
            <div class="bar purple" :style="{'width':`10%`}"></div>
          </div>
        </div>
        <div class="stat-item">
          <p>Melee</p>
          <div class="bar-container">
            <div class="bar red" :style="{'width':`90%`}"></div>
          </div>
        </div>
      </div>
    </template>
  </Card>
  <Card :selectable="true" :flipped="!flipped" :back="true">
    <template slot="title">{{race.name}}</template>
    <template slot="subtitle">Pick a Subrace</template>
    <template slot="content">
      <FamilyTree :root="race.name" :children="race.subraces.length > 0 ? race.subraces.map(x=>x.fullName) : ['Common '+race.name]"></FamilyTree>
      <div class="info">
        <div class="info-box" v-for="subrace in race.subraces" @click.stop="">
          <div :tooltip="feature.link ? feature.fullName+': Click for more info' : feature.desc"
               v-for="feature in subrace.features"
               :class="{'expandable': feature.link}"
               @click="feature.link && openTab(feature.desc)"
               >
            <i :class="`mdi mdi-${feature.icon}`"></i>
          </div>
        </div>
      </div>
      <div class="info">
        <div v-if="race.subraces.length === 0"
             :class="{'select': true,'active': race.name === selected}"
             @click.stop="$emit('selectionUpdate',{raceName: race.name})">
             <i class="mdi mdi-check"></i>
        </div>
        <div v-for="subrace in race.subraces"
             :class="{'select': true,'active': subrace.fullName+' '+race.name === selected}"
              @click.stop="$emit('selectionUpdate',{raceName: subrace.fullName+' '+race.name})">
             <i class="mdi mdi-check"></i>
        </div>
      </div>
    </template>
  </Card>
  </div>
</template>

<script>
import Card from './Card.vue'
import FamilyTree from './FamilyTree.vue'

export default {
  name: 'RaceCard',
  props: ["race","selected"],
  components: {Card,FamilyTree},
  data () {
    return {
      activeTab: 0,
      flipped: false
    }
  },
  computed: {

  },
  methods: {
    openTab(url) {
      window.open(url,'_blank');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card-stack {
  width: 400px;
  height: 550px;
  margin-left: 1rem;
  margin-right: 1rem;
  display: flex;
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
  white-space: normal;
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
  max-height: 10rem;
  overflow-y: scroll;
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
.buttons {
  width: calc(400px - 2rem);
  margin-bottom: 2rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  position: absolute;
  bottom: 0;
}
.btn {
  border: none;
  outline: none;
  color: #777;
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
  background-color: #FAFAFA;
  box-shadow: 0 1px 2px rgba(0,0,0,0.22);
  border-radius: 5px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition: 0.3s;
  background-color: #2589BD;
  color: white;
}
.btn:hover {
    box-shadow: 0 4px 3px rgba(0,0,0,0.22);
    cursor: pointer;
}
.info {
  width: 100%;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  display: flex;
  margin-bottom: 1rem;
}
.info-box {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 5px;
  height: 13rem;
  border: 1px solid #EBEBEB;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  cursor: default;
}
.info-box div{
  color: #BBB;
}
.info-box div:hover {
  color: #777;
}
.select {
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #EBEBEB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}
.select:hover {
  background-color: rgba(9,188,138,0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.16), 0 1px 3px rgba(0,0,0,0.23);
}
.select.active {
  background-color: rgba(9,188,138,1);
}
[tooltip]{
  position: relative;
  z-index: 2;
  cursor: default;
}
[tooltip]::before {
  z-index: 999;
  position: absolute;
  bottom: calc(150% - 5px);
  width: 0;
  height: 0;
  left: 50%;
  margin-left: -5px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(68,68,68,0.8);
  content: "";
  visibility: hidden;
}
[tooltip]::after {
  z-index: 999;
  position: absolute;
  content: attr(tooltip);
  bottom: 150%;
  width: 100px;
  left: -50px;
  text-align: center;
  background-color: rgba(68,68,68,0.8);
  border-radius: 3px;
  color: white;
  font-size: 0.7rem;
  font-style: normal;
  padding: 0.3rem;
  visibility: hidden;
  white-space: normal;
}
[tooltip]:hover:after,
[tooltip]:hover:before {
    visibility: visible;
}
.expandable {
  cursor: pointer;
}
</style>
