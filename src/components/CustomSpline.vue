<template>
  <g>
    <svg v-if="getSize().w" :width="getSize().w" :height="getSize().h" :x="getMin().x" :y="getMin().y">
      <path :class="getClassName()" :d="'M'+(sx-getMin().x)+','+(sy-getMin().y)+' '+'C'+(sx-getMin().x)+','+getSize().h/2+' '+(ex-getMin().x)+','+getSize().h*2/5+' '+(ex-getMin().x)+','+(ey-getMin().y)" :stroke-width="strokeWidth" :data-index="index" />
    </svg>
    <svg v-else :width="strokeWidth*3" :height="getSize().h" :x="getMin().x - strokeWidth" :y="getMin().y">
      <line :class="getClassName()" :x1="strokeWidth" :y1="1" :x2="strokeWidth" :y2="getSize().h" :stroke-width="strokeWidth" :data-index="index" />
    </svg>
  </g>
</template>

<script>

import * as d3 from 'd3'
export default {
  name: 'CustomSpline',
  props: [
    'sx',
    'sy',
    'ex',
    'ey',
    'strokeColor',
    'type',
    'index'
  ],
  data () {
    return {
      fontSize: 12,
      strokeWidth: 1.2,
 
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load: function () {
 
    },
    getMin(){
      
      return {x:Math.min(this.sx, this.ex), y:Math.min(this.sy, this.ey)}
    },
    getSize(){
      return {w: Math.abs(this.sx - this.ex), h:Math.abs(this.sy- this.ey)}
    },
    getClassName(){
      switch(parseInt(this.type)) {
        case 1:
          return 'line-dot'
          break
        default: 
          return 'line-pain'
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  svg path {
    fill: transparent;
    stroke: #757575;
  }
  svg line {
    fill: transparent;
    stroke: #757575;
  }
  .line-dot{
    stroke: #616161;
    stroke-dasharray: 5,5;
  }
  .line-dot:hover{
    stroke-width: 2px;
    stroke: #FF5722;
    cursor: pointer;
  }
</style>
