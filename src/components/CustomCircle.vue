<template>
  <g>
    <svg :class="'circle-node circle-' + arrayIndex" :data-answer="answer"  :width="getRealSize()" :height="getRealSize()" :x="cx" :y="cy" >
      <rect v-if="hasChild==false" :class="getClassName()" :x="getRealCenterPosition()-radius" :y="getRealCenterPosition()-radius" :width="radius*2" :height="radius*2" stroke-dasharray="5,5"/>
      <circle v-else :class="getClassName()" :cx="getRealCenterPosition()" :cy="getRealCenterPosition()" :r="radius"/>
      <text :class="getClassName()+'-text'" x="50%" y="50%" alignment-baseline="middle" text-anchor="middle" >{{text}}</text>
    </svg>
  </g>
</template>

<script>

import * as d3 from 'd3'
export default {
  name: 'CustomCircle',
  props: [
    'radius',
    'text',
    'cx',
    'cy',
    'backgroundColor',
    'textColor',
    'strokeColor',
    'arrayIndex',
    'answer',
    'type',
    'hasChild'
  ],
  data () {
    return {
      fontSize: 12,
      strokeWidth: 1,
    }
  },
  mounted () {
    this.load()
  },
  methods: {
    load: function () {
    },
    getRealSize(){
      return (this.radius + this.strokeWidth) * 2
    },
    getRealCenterPosition(){
      return this.radius + this.strokeWidth
    },
    getClassName(){
      switch(this.type) {
        case 'add':
          return 'circ-add'
          break
        case 'condition':
          return 'circ-condition'
          break
        case 'edit':
          return 'circ-edit'
          break
        case 'remove':
          return 'circ-remove'
          break
        default: 
         return 'circ-default'
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
  svg text{
    cursor: pointer;
  }
  circle, rect{
    opacity: 0.8;
  }
  .circ-add {
    stroke: #9e9e9e;
    stroke-width: 1px;
    cursor: pointer;
    fill: #e0e0e0;
  }
  .circ-add-text {
    font-weight: 800;
    fill: #757575;
    font-size: 16px;
  }
  .circ-condition {
    stroke: #546e7a;
    stroke-width: 1px;
    cursor: pointer;
    fill: #78909c;
  }
  .circ-condition-text {
    font-weight: 800;
    fill: #ffebee;
    font-size: 16px;
  }
  .circ-remove {
    stroke: #e53935;
    stroke-width: 1px;
    cursor: pointer;
    fill: #f44336;
  }
  .circ-remove-text {
    font-weight: 800;
    fill: #ffebee;
    font-size: 16px;
  }
  .circ-edit {
    stroke: #1565C0;
    stroke-width: 1px;
    cursor: pointer;
    fill: #2196F3;
  }
  .circ-edit-text {
    font-weight: 800;
    fill: #ffebee;
    font-size: 16px;
  }

</style>
