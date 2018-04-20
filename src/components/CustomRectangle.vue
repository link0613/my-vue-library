<template>
  <g>
    <svg :id="'rectNode' + arrayIndex" :width="dx+strokeWidth*2" :height="dy+strokeWidth*2" :x="cx-dx/2" :y="cy-dy/2">
       
      <rect :class="'rect-node ' + getClassName()" :x="strokeWidth" :y="strokeWidth" :width="Math.abs(dx-strokeWidth)" :height="Math.abs(dy-strokeWidth)" :data-index="arrayIndex"/>
      <rect class="rect-image-back" v-if="category==2||category==3" :x="strokeWidth" :y="strokeWidth" :width="Math.abs(dx-strokeWidth)" :height="dy-strokeWidth-fontSize*3"  :fill="'white'"/>
      <image class="rect-image"  v-if="category==2||category==3" xlink:href="../assets/logo.png" :height="dy/2" :width="dx/2" :y="dy/4-fontSize*2" :x="dx/4" /> 
      <text class="rect-name" v-if="category==2||category==3" x="10" :y="getTextPosition()-fontSize*3" alignment-baseline="left" text-anchor="left" >{{text}}</text>
      <text class="rect-description" v-if="category==2||category==3" x="10" :y="getTextPosition()-fontSize*2" alignment-baseline="left" text-anchor="left">{{email}}</text>
      
      <text v-if="category<0" :class="'rect-text ' + getClassName() + '-plus'" x="50%" y="40%" alignment-baseline="middle" text-anchor="middle">+</text>
      <text v-if="category<0" :class="'rect-text ' + getClassName() + '-text'" x="50%" y="70%" alignment-baseline="middle" text-anchor="middle">New Entry</text>
      <text v-if="category>-1 && category!=2 && category!=3" :class="'rect-text ' + getClassName() + '-text'" x="50%" :y="getTextPosition()" alignment-baseline="middle" text-anchor="middle">{{text}}</text>
      <text v-if="category==2 || category==3" :class="'rect-text ' + getClassName() + '-text'" x="70%" :y="getTextPosition()+8" alignment-baseline="right" text-anchor="right">{{value}}%</text>
      <text v-if="category==2 || category==3" :class="'rect-text ' + getClassName() + '-content'" x="10" :y="getTextPosition()+8" alignment-baseline="left" text-anchor="left">{{content}}</text>

    </svg>  
  </g>

</template>

<script>

import * as d3 from 'd3'
export default {
  name: 'CustomRectangle',
  props: [
    'radius',
    'text',
    'cx',
    'cy',
    'dx',
    'dy',
    'backgroundColor',
    'textColor',
    'strokeColor',
    'arrayIndex',
    'category',
    'value',
    'content',
    'email',
  ],
  data () {
    return {
      fontSize: 14,
      strokeWidth: 1,
      minX: 0,
      minY: 0,
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load: function () {
    },
    getTextPosition(){
      if (this.category == 2 || this.category == 3) {
        return this.dx-this.fontSize  * 4 + this.fontSize/2

      } else {
        return '50%'
      }

    },
    getClassName(){
      let className = 'rect-node'
      switch(this.category) {
        case 0:
          return 'rect-wait'
          break
        case 1:
          return 'rect-condition'
          break
        case 2:
          return 'rect-email'
          break
        case 3:
          return 'rect-step'
          break
        case -1:
          return 'rect-addentry'
          break
        default: 
         return className
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .rect-image {
    pointer-events: none;
  }
  .rect-image-back {
    pointer-events: none;
  }
  .rect-text {
    font-weight: 800;
    fill: #616161;
    font-size: 14px;
    cursor: pointer;
  }

  .rect-name {
    font-weight: 600;
    fill: #616161;
    font-size: 16px;
    cursor: pointer;
  }
  .rect-description {
    font-weight: 600;
    fill: #616161;
    font-size: 14px;
    cursor: pointer;
  }


  .rect-node {
    stroke: #9e9e9e;
    stroke-width: 1px;
    cursor: pointer;
    fill: #e0e0e0;
    opacity: 0.8;
  }

  .rect-condition {
    stroke: #ff6f00;
    stroke-width: 1px;
    cursor: pointer;
    fill: #ff8f00;

  }
  .rect-condition-text{
    font-weight: 800;
    fill: #fff8e1;
    font-size: 14px;
  }
  .rect-image-back{
    stroke-width: 1px;
    stroke: #9e9e9e;
  }

  .rect-step {
    stroke: #4dd0e1;
    stroke-width: 1px;
    cursor: pointer;
    fill: #b2ebf2;
  }
  .rect-step-text{
    font-weight: 800;
    fill: #006064;
    font-size: 16px;
  }
 
  .rect-email-text{
    font-weight: 800;
    font-size: 16px;
    fill: #1B5E20;
  }

  .rect-addentry {
    fill: #fff8e1;
    stroke-dasharray: 7,7;
  }
  .rect-addentry-text{
    font-size: 12px;
  }
  .rect-addentry-plus{
    font-size: 36px;
  }
</style>
