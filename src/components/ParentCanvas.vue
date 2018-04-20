<template>
  <div class="main-container">
    <h1>
      Resuable Multi-fuctional WorkFlowchart - Vue Component (library)
    </h1>
    <code>
      JSON Tree Structure - add/remove - drag and drop 
    </code>
    <SvgPanZoom class="parent-canvas"  :fit="false"  @svgpanzoom="registerSvgPanZoom">
      <svg id="mainCanvas" width="100%" :height="canvas.height">

        <g v-for="(node,index) in nodeData" :key="node.key" >
          <g v-if="!node.same">
            
            <g v-if="node.multiple">
              <!-- root --> 
              <g v-for="entry in getMultipleEntry(index)" :key="entry.key">
                <CustomRectangle   :text="entry.text" :cx="getNodeInfo(getIndexFromKey(entry.key)).x" :cy="getNodeInfo(getIndexFromKey(entry.key)).y + unitPixel/4"  :dx="getNodeInfo(getIndexFromKey(entry.key)).dx + 1" :dy="unitPixel*2.5" :arrayIndex="getIndexFromKey(entry.key)" :category="null" />
                <CustomSpline :sx="getNodeInfo(index).x" :sy="getNodeInfo(index).y + unitPixel * 3.1" :ex="getNodeInfo(getIndexFromKey(entry.key)).x" :ey="getNodeInfo(getIndexFromKey(entry.key)).y + unitPixel*1.5" :strokeColor="'#7B1FA2'"   />
              </g>
              <!-- add entry --> 
              <CustomRectangle :text="' '" :cx="getNodeInfo(index).x + getNodeInfo(index).dx / 2 - unitPixel*1" :cy="getNodeInfo(index).y+unitPixel/4"  :dx="unitPixel*3" :dy="unitPixel*2.5" :backgroundColor="'#e6e6e6'" :textColor="'#AB47BC'" :strokeColor="'#7B1FA2'"  v-on:click.native="addEntry(index)" :arrayIndex="null" :answer="null"  :category="-1" />
              <CustomSpline :sx="getNodeInfo(index).x" :sy="getNodeInfo(index).y + unitPixel * 3.1" :ex="getNodeInfo(index).x + getNodeInfo(index).dx / 2 - unitPixel*1" :ey="getNodeInfo(index).y + unitPixel*1.5" :strokeColor="'#7B1FA2'"   />
              <CustomCircle :text="'+'" :cx="getNodeInfo(index).x-unitPixel*3/5" :cy="getNodeInfo(index).y + unitPixel * 3"  :radius="unitPixel*3/5" class="add-node"  v-on:click.native="showDiag1(index)" :arrayIndex="index" :answer="null" type="add" :hasChild="hasChildren(index)"/>
            </g>
            <g v-else>
              <!--email and step -->
              <CustomRectangle v-if="node.category==2||node.category==3" :text="node.text" :cx="getNodeInfo(index).x" :cy="getNodeInfo(index).y+unitPixel*2.5"  :dx="getNodeInfo(index).dx + 1" :dy="unitPixel*7" :arrayIndex="index" :category="node.category" :value="node.value" :content="node.content" :thumbnail="node.thumbnail" :icon="node.icon" :email="node.email"/>
              <!--general -->
              <CustomRectangle v-else :text="node.text" :cx="getNodeInfo(index).x" :cy="getNodeInfo(index).y"  :dx="getNodeInfo(index).dx + 1" :dy="unitPixel*2" :backgroundColor="'#AB47BC'" :textColor="'#F3E5F5'" :strokeColor="'#7B1FA2'" :arrayIndex="index" :category="node.category"/>
            </g>
            
            <CustomSpline v-if="index>0" :sx="getNodeInfo(index).x" :sy="getNodeInfo(index).y - unitPixel" :ex="getNodeInfo(index).x" :ey="getNodeInfo(index).y - unitPixel*2 + 5 " :strokeColor="'#7B1FA2'"   />
            <circle  v-if="index>0" :cx="getNodeInfo(index).x" :cy="getNodeInfo(index).y - unitPixel" :r="unitPixel/4" class="circle-top-joint" :data-index="index"/> 
            <!-- condition -->
            <g v-for="question in node.question" :key="node.key + question"  >
              <CustomCircle :text="question" :cx="getChildInfo(index,question).x-unitPixel*4/5-1" :cy="getNodeInfo(index).y + unitPixel * 3 - 1"  :radius="unitPixel*4/5" :backgroundColor="'#E040FB'" :textColor="'#F3E5F5'" :strokeColor="'#7B1FA2'" type="condition" />
              <CustomSpline :sx="getChildInfo(index,question).x" :sy="getNodeInfo(index).y + unitPixel * 3" :ex="getNodeInfo(index).x" :ey="getNodeInfo(index).y + unitPixel" />
              <circle :cx="getChildInfo(index,question).x" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel*5.5" :r="unitPixel/6" class="circle-term-joint" :data-index="index" :data-question="question"/> 
              <g v-if="node.goto==null || node.goto[question]==null">
                <CustomCircle :text="'+'" :cx="getChildInfo(index,question).x-unitPixel*3/5-1" :cy="getNodeInfo(index).y + unitPixel * 6 - unitPixel/2"  :radius="unitPixel*3/5" class="add-node"  v-on:click.native="showDiag1(index,question)" :arrayIndex="index" :answer="question" type="add" :hasChild="hasChildren(index,question)"/>
                <CustomSpline :sx="getChildInfo(index,question).x" :sy="getNodeInfo(index).y + unitPixel * 6 - unitPixel/2" :ex="getChildInfo(index,question).x" :ey="getNodeInfo(index).y + unitPixel * 5- unitPixel/2" />
                <circle :cx="getChildInfo(index,question).x" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel*3.9" :r="unitPixel/6" class="circle-term-joint" :data-index="index" :data-question="question"/> 
              </g>

              
              <!-- (goto) at blank branch of condition -->
              <g v-if="!hasChildren(index,question)">
                <g v-if="node.goto==null || node.goto[question]==null">
                  <circle :cx="getChildInfo(index,question).x" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel" :r="unitPixel/4" class="circle-term-joint" :data-index="index" :data-question="question"/> 
                  <CustomSpline :sx="getChildInfo(index,question).x" :sy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel - unitPixel/4" :ex="getChildInfo(index,question).x" :ey="getNodeInfo(index).y + unitPixel * 6 - unitPixel/2 + unitPixel*6/5" />
                </g>
                <g v-else>
                  <circle :cx="getChildInfo(index,question).x" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel*3.9" :r="unitPixel/4" class="circle-term-joint" :data-index="index" :data-question="question"/> 
                  <!--(goto)~ line for branch -->
                  <CustomSpline :sx="getChildInfo(index,question).x" :sy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel * 4" :ex="getNodeInfo(getIndexFromKey(node.goto[question])).x" :ey="getNodeInfo(getIndexFromKey(node.goto[question])).y-unitPixel" type="1" :index="index"/>
                </g>
              </g>
            </g>
            <!-- -->
            <g v-if="!node.question||node.question.length==0">
              <!-- [+] -->
              <g v-if="node.goto==null">
                <CustomSpline v-if="!node.multiple" :sx="getNodeInfo(index).x" :sy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel * 4" :ex="getNodeInfo(index).x" :ey="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel*3+1"  />
                <CustomCircle v-if="!node.multiple" :text="'+'" :cx="getNodeInfo(index).x-unitPixel*3/5" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel * 3"  :radius="unitPixel*3/5" class="add-node"  v-on:click.native="showDiag1(index)"  :arrayIndex="index" :answer="null" type="add" :hasChild="hasChildren(index)"/>
                <!--(goto) at blank node -->
                <CustomSpline :sx="getNodeInfo(index).x" :sy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel - unitPixel/4" :ex="getNodeInfo(index).x" :ey="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel*2+unitPixel/5" />
                <circle  v-if="!node.multiple" :cx="getNodeInfo(index).x" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel" :r="unitPixel/4" class="circle-term-joint" :data-index="index"/> 
              </g>
              <!-- ~ (goto)line -->
              <g v-else >
                <CustomSpline :sx="getNodeInfo(index).x" :sy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel * 4" :ex="getNodeInfo(getIndexFromKey(node.goto)).x" :ey="getNodeInfo(getIndexFromKey(node.goto)).y-unitPixel" type="1" :index="index"/>
              </g>
              <circle  v-if="index>0" :cx="getNodeInfo(index).x" :cy="getNodeInfo(index).y + getNodeInfo(index).dy - unitPixel * 4" :r="unitPixel/4" class="circle-bottom-joint" :data-index="index"/> 
            </g>
            <g v-else >
              <circle  v-if="index>0" :cx="getNodeInfo(index).x" :cy="getNodeInfo(index).y + unitPixel " :r="unitPixel/6" class="circle-bottom-joint" :data-index="index"/> 
            </g>
          </g>

        </g>
  
        <!-- drag and drop focus -->
        <g>
          <rect id="dragRect" :x="50" :y="50" :width="50" :height="50" :stroke="'#546e7a'" :stroke-width="1" :fill="'#546e7a'" :nodeIndex="1" opacity="0"/>
          <rect id="dropRect" :x="150" :y="150" :width="50" :height="50" :stroke="'#546e7a'" :stroke-width="2" :fill="'transparent'" :nodeIndex="1" opacity="0"  />
          <circle id="dropCircle" :cx="unitPixel/4" :cy="unitPixel/4" :r="unitPixel/4"  :stroke="'#546e7a'" :stroke-width="2" :fill="'transparent'" :nodeIndex="1" opacity="0"/>
          <circle id="dragCircle" :cx="unitPixel/4" :cy="unitPixel/4" :r="unitPixel/4"  :stroke="'#546e7a'" :stroke-width="2" :fill="'#546e7a'" :nodeIndex="1" opacity="0"/>

        </g>
        <!-- control box -->
        <g>
          <svg id="controlBox" x="50" y="50" width="150" :height="unitPixel*2"  >
            <CustomCircle :text="'×'" :cx="45" :cy="20"  :radius="unitPixel/3" :backgroundColor="'red'" :textColor="'#6A1B9A'" :strokeColor="'#7B1FA2'" class="add-node"  v-on:click.native="removeNode()"  :arrayIndex="null" :answer="null" type="remove"/>
            <CustomCircle :text="'~'" :cx="25" :cy="20"  :radius="unitPixel/3" :backgroundColor="'green'" :textColor="'#6A1B9A'" :strokeColor="'#7B1FA2'" class="add-node"  :arrayIndex="null" :answer="null" type="edit"/>
          </svg>
        </g>

      </svg>  
    </SvgPanZoom>
    <Modal v-if="visibleDiag1">
      <div class="row" slot="header">
        <div class="col-sm-12">
          Add new action
        </div>
      </div>
      <div slot="body">
        <div class="row">
          <button v-for="(category,index) in nodeCategories" :key="index" class="btn btn-primary col-sm-12" v-on:click="showDiag2(index)" >{{category.name}}</button>
        </div>
      </div>
    </Modal>

    <Modal v-if="visibleDiag2_wait">
      <div class="row" slot="header">
        <div class="col-sm-12">
          Add new action (Wait)
        </div>
      </div>
      <div slot="body">
        <div class="row">
          <div class="col-sm-12">
            <div class="form-group">
              <input type="number" class="form-control" id="diagInputWait" placeholder="Please input day(s)" v-model="inputValue"/>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" v-on:click="addNode()" >Add</button>
        <button class="btn btn-primary" v-on:click="hideDiag2()" >Cancel</button>
      </div>
    </Modal>

    <Modal v-if="visibleDiag2_email">
      <div class="row" slot="header">
        <div class="col-sm-12">
          Add new email
        </div>
      </div>
      <div slot="body">
        <div class="row">
          <div class="col-sm-12">
            <div class="form-group">
              <input type="number" class="form-control" id="diagInputWait" placeholder="Please value" v-model="inputValue"/>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" v-on:click="addNode()" >Add</button>
        <button class="btn btn-primary" v-on:click="hideDiag2()" >Cancel</button>
      </div>
    </Modal>

    <Modal v-if="visibleDiag2_condition">
      <div class="row" slot="header">
        <div class="col-sm-12">
          Add new action (Condition)
        </div>
      </div>
      <div slot="body">
        <div class="row">
          <div class="col-sm-12">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Please input query" v-model="inputCondition[0].query"/> ?
            </div>
            <div v-for="(condition,index) in inputCondition" :key="index" class="form-group">
              <input type="text" class="form-control" placeholder="Please input result" v-model="inputCondition[index].result"/>
            </div>
            <button class="btn btn-primary" v-on:click="addResult()" >Add Result</button>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" v-on:click="addNode()" >Add Node</button>
        <button class="btn btn-primary" v-on:click="hideDiag2()" >Cancel</button>
      </div>
    </Modal>

    <Modal v-if="visibleDiag2_dragAndDrop">
      <div class="row" slot="header">
        <div class="col-sm-12">
          Move or Copy (Drag and Drop)
        </div>
      </div>
      <div slot="body">
        <div class="btn-group" id="filterDay" data-toggle="buttons">
          <label class="btn btn-default blue">
            <input type="radio" class="toggle" value="1" v-on:click="moveCopyNode(1)"/> move with children
          </label>
          <label class="btn btn-default blue">
            <input type="radio" class="toggle" value="2" v-on:click="moveCopyNode(2)"/> move alone
          </label>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" v-on:click="hideDiag2()" >Cancel</button>
      </div>
    </Modal>

    <button class="btn btn-primary btn-save" v-on:click="saveTree()">Save</button>
  </div>
</template>

<script>

import * as d3 from 'd3'
import CustomCircle from '@/components/CustomCircle'
import CustomSpline from '@/components/CustomSpline'
import CustomRectangle from '@/components/CustomRectangle'
import Modal from './Modal.vue'
import SvgPanZoom from 'vue-svg-pan-zoom';

export default {
  name: 'nodeData',
  data () {
    return {
      canvas: {width:500, height:500},
      msg: "Please check me.",
      unitPixel: 25,
      ax: 0,
      ay: 0,
      
      //create node (at terminal)
      selectedNode: null,
      selectedCategory: null,
      selectedQuestion: null,
      //insert node (at middle)
      selectedChild: null,

      //drag and drop
      targetNode:null,
      sourceNode:null,
      sourceQuestion: null,
      targetQuestion: null,
      draging: false,


      inputValue: null,

      inputCondition: [
        {query:'Do you know it?', result: 'Yes' },
        {query:'Do you know it?', result: 'No' },
      ],
      
      //diag
      visibleDiag1: false,
      visibleDiag2_wait: false,
      visibleDiag2_email: false,
      visibleDiag2_condition: false,
      visibleDiag2_dragAndDrop: false,
      deepMax: 0,


      nodeCategories: [
        {name:'wait', text:'Waiting for {{value}} day(s)'},
        {name:'condition', text:'condition-'},
        {name:'email', text:'email'},
        {name:'step', text:'email'}

      ],
      nodeData: [
        {key:1, category:0, text:'START', value:{name:'link'}, parent:null, multiple:true},
        {key:16, category:0, text:'Start Entry', value:null, same:1, parent:null},
        {key:17, category:0, text:'Start Entry', value:null, same:1, parent:null},
        {key:2, category:1, text:'This is an action', value:null, question:['Yes', 'No'], parent:1},
        {key:3, category:2, text:'John Dae', value:'20', answer:'Yes', parent:2, thumbnail:'logo.png', content:'Somthing', icon: "up", email:"johndae@gmail.com"},
        {key:4, category:0, text:'This is also another one', value:{day:2}, parent:3},
        {key:5, category:1, text:'What/why/when', value:{email:'kkkks@gmail.com'}, parent:4, question:['1', '2', '3']},
        {key:6, category:0, text:'THis is an action', value:{day:4}, parent:5, answer:'2'},
        {key:7, category:0, text:'This is an action', value:{email:'kkkka@gmail.com'}, answer:'No', parent:2},
        {key:8, category:1, text:'Pleae input question/answer.', value:null, question:['A', 'D', 'C','B'], parent:7},
        {key:11, category:0, text:'Notify {{email}}', value:{email:'kkkka@gmail.com'}, answer:'D', parent:8},
        {key:13, category:0, text:'Action3', value:{email:'3gmail.com'}, answer:'3', parent:5},
        {key:14, category:0, text:'Action2', value:{email:'1il.com'}, answer:'1', parent:5},
        {key:15, category:3, text:'Name', value:'50',   parent:14, thumbnail:'logo.png', content:'Somthing', icon:"down", email:"aaa@gmail.com"},
       ],
      nodePosition: null,
      nodeLink: [],
    }
  },
  components: {
    CustomCircle,
    CustomSpline,
    CustomRectangle,
    SvgPanZoom,
    'Modal': Modal
  },
  mounted () {
    const rm = this
    this.load()
  },
  methods: {
    registerSvgPanZoom(svgpanzoom) {
        this.svgpanzoom = svgpanzoom;
    },
    center() {
        if( !this.svgpanzoom ) return;

        this.svgpanzoom.center();
    },
    getSubTreeWidth(i, rm){
      let w = 0, numChild = 0
      for (let index=0; index<rm.nodeData.length; index++) {
        if (rm.nodeData[i].key === rm.nodeData[index].parent) {
          numChild ++
          w += rm.getSubTreeWidth(index,rm)
          
        }
      }
      if (rm.nodeData[i].category===1) {
        let blackNode = rm.nodeData[i].question.length - numChild
        let captionW = rm.nodePosition[i].dx + rm.unitPixel
        if (blackNode>0) {
          w+= rm.unitPixel*2*blackNode
        }
        rm.nodePosition[i].tw = Math.max(w,captionW)
        return Math.max(w,captionW)
        //return w

      } else {
      
        if (numChild>0) {
          rm.nodePosition[i].tw = Math.max(w,rm.nodePosition[i].dx+rm.unitPixel)
          return Math.max(w,rm.nodePosition[i].dx+rm.unitPixel)
        } else {
          w = rm.nodePosition[i].dx + rm.unitPixel
          rm.nodePosition[i].tw =  Math.max(w,rm.nodePosition[i].dx+rm.unitPixel)
          return Math.max(w,rm.nodePosition[i].dx)
        }
      }

    },
    getNodeSize(rm){
      const charW = 2 / 7.0
      rm.nodePosition=[]
      for (let i=0; i<rm.nodeData.length; i++){
        //x: x(center), y:, dx: width of node, dy: height, tw: width of children(tree)
        rm.nodePosition.push({x:400, y:30, dx:0, dy:0, tw:0, ox:0});
        if (rm.nodeData[i].multiple){
          let mDx = this.unitPixel*3
          for (let j=0; j<rm.nodeData.length; j++){
            if (rm.nodeData[j].same === rm.nodeData[i].key){
              mDx += rm.unitPixel * charW  * rm.nodeData[j].text.length + rm.unitPixel 
            }
          }
          rm.nodePosition[i].dx = mDx;
          rm.nodePosition[i].dy = rm.unitPixel * 6

        } else {
          rm.nodePosition[i].dx = rm.unitPixel * charW  * rm.nodeData[i].text.length + rm.unitPixel/2
          if (rm.nodeData[i].category === 1) {
            rm.nodePosition[i].dy = rm.unitPixel * 9 - rm.unitPixel/2 
          } else if (rm.nodeData[i].category === 2 || rm.nodeData[i].category === 3) { 
            rm.nodePosition[i].dy = rm.unitPixel * 10  
            rm.nodePosition[i].dx = rm.unitPixel * 8
          } else {
            rm.nodePosition[i].dy = rm.unitPixel * 5
          }

          if (rm.nodeData[i].same!=null) {
            rm.nodePosition[i].dy = rm.unitPixel * 6
          }
        }
      }
    },
    getNthChildIndex(i, n, rm) {
      for (let index = 0; index < rm.nodeData.length; index ++) {
        if (rm.nodeData[index].parent === rm.nodeData[i].key && rm.nodeData[i].question[n] === rm.nodeData[index].answer ){
          return index
        }
      }
      return null
    },
    setNodePosition(i, rm) {
      let index = 0
      if (rm.nodeData[i].category === 1) { // condition node 
        let sx = - rm.nodePosition[i].tw / 2  + Math.max(0, rm.nodePosition[i].dx-rm.nodePosition[i].tw)
        let sx0 = 0
        let prevW = 0
        for (let qi = 0; qi<rm.nodeData[i].question.length; qi ++){
          
          let childIndex = rm.getNthChildIndex(i,qi,rm)
          

          if (childIndex==null) {
            sx += rm.unitPixel + prevW
            prevW = rm.unitPixel 
            
          }else{
            sx += rm.nodePosition[childIndex].tw/2 + prevW
            rm.nodePosition[childIndex].x = rm.nodePosition[i].x + sx 
            rm.nodePosition[childIndex].y = rm.nodePosition[i].y + rm.nodePosition[i].dy
            prevW = rm.nodePosition[childIndex].tw/2
            rm.setNodePosition(childIndex, rm)
          }
          if (qi==0) sx0 = sx
        }
        rm.nodePosition[i].ox = -(sx+sx0)/2
      } else {
       
        rm.nodeData.forEach(function(element) {
          if (index != i) {
            if (rm.nodeData[index].parent === rm.nodeData[i].key){
              rm.nodePosition[index].x = rm.nodePosition[i].x
              rm.nodePosition[index].y = rm.nodePosition[i].y + rm.nodePosition[i].dy
              let tht = rm.nodePosition[index].y + rm.nodePosition[index].dy + rm.unitPixel*10;
              if (rm.canvas.height < tht) {
                rm.canvas.height = tht 
              }
              rm.setNodePosition(index, rm)
            }
          }
          index++
        })
      }
    },
    setEntryPosition(i) {
      let entryIndex = 0, sx = this.nodePosition[i].x - this.nodePosition[i].dx / 2    , preX = 0
      for (let j=0;j<this.nodeData.length;j++) {
        if (this.nodeData[i].key == this.nodeData[j].same){
          
          sx += this.nodePosition[j].dx/2 + preX + this.unitPixel/2
          preX = this.nodePosition[j].dx/2 
          this.nodePosition[j].x = sx
          this.nodePosition[j].y = this.nodePosition[i].y

          entryIndex ++
        }
      }
    },
    getNodeInfo(index) {
      
      if (this.nodePosition === null) {
        return {x:400, y:30, dx:0, dy:0, tw:0, ox:0}
      }
      return this.nodePosition[index]
    },
    getChildInfo(i,question) {
      
      if (this.nodePosition === null) {
        return {x:500, y:500, dx:100, dy:100, tw:100, ox:0}
      }

      for (let index = 0; index < this.nodeData.length; index ++) {
        if (this.nodeData[index].parent === this.nodeData[i].key && question=== this.nodeData[index].answer ){
          return this.nodePosition[index]
        }
      }      
      
      let qi;
      for (qi = 0; qi < this.nodeData[i].question.length; qi++) {
        if (this.nodeData[i].question[qi]===question){
          break;
        }
      }

      //blank child
      if (qi==0){
        const blankX = this.nodePosition[i].x-this.nodePosition[i].tw/2+this.unitPixel + this.nodePosition[i].ox //+ Math.max(0, this.nodePosition[i].dx - this.nodePosition[i].tw)
        return {x:blankX, y:100, dx:this.unitPixel, dy:this.unitPixel, tw:this.unitPixel*2, ox:0}
      }
      let prevNodeInfo = this.getChildInfo(i, this.nodeData[i].question[qi-1])
       
      return {x:prevNodeInfo.x + prevNodeInfo.tw/2+this.unitPixel , y:100, dx:this.unitPixel, dy:this.unitPixel, tw:this.unitPixel*2, ox:0}
    },

    getNumberOfChild(index, question=null){
      let count = 0  
      for (let i=0;i<this.nodeData.length;i++){
        if (this.nodeData[index].key === this.nodeData[i].parent){
          if (this.nodeData[index].category === 1) {
            if (question == this.nodeData[i].answer) {
              count ++
            }
          } else {
            count ++
          }
        }
      }
      return count
    },

    load: function () {
      const rm = this
      //dx, dy
      rm.getNodeSize(rm)
      rm.getSubTreeWidth(0,rm)
      rm.canvas = {width:500, height:400}
      //initial position of tree (root's)
      rm.canvas.width = Math.max(this.nodePosition[0].tw, rm.canvas.width)
      rm.nodePosition[0].x = rm.canvas.width/2
      rm.nodePosition[0].y = 50

      rm.setNodePosition(0,rm)
      rm.setEntryPosition(0)
      rm.sourceNode = null
      rm.targetNode = null
      
 
      //d3 operation with drag and drop

      setTimeout(function(){
        // initialize graph
        let offsetX, offsetY

        d3.selectAll('.circle-node circle')
          .attr('stroke-width', 1)

        d3.select("#dragRect")
          .attr('opacity',0)
          .attr('x',0)
          .attr('y',0)
          .attr('width',1)
          .attr('height',1)
        d3.select("#dropRect")
          .attr('opacity',0)
          .attr('x',0)
          .attr('y',0)
          .attr('width',1)
          .attr('height',1)
        d3.select("#dragCircle")
          .attr('opacity',0)
        d3.select("#dropCircle")
          .attr('opacity',0)


        d3.select("#controlBox")
          .attr('opacity',0)
        
        d3.select(".line-dot")
          .raise()


        // node drag and drop using d3
        const drag = d3.drag()
          .on("start", function(){
            rm.draging = true
            offsetX=null
          })
          .on("drag", function(){
            if (offsetX==null){
                offsetX=d3.event.x-$(this).attr('x')
                offsetY=d3.event.y-$(this).attr('y')
            }
            d3.select(this)
              .attr("x",  d3.event.x - offsetX )
              .attr("y",  d3.event.y - offsetY )
              .attr("opacity", 0.6)
            
            d3.select("#controlBox")
              .attr("opacity", 0)

            rm.targetNode = null
            for (let i = 0; i<rm.nodeData.length; i++){
              if (i==rm.sourceNode || rm.nodeData[i].same!=null) continue
              let cx, cy, dis
              if (rm.nodeData[i].category == 1) {
                d3.selectAll('.circle-' + i).each(function(d) {
                  cx = d3.select(this).attr('x') * 1.0 + d3.select(this).attr('width') / 2.0
                  cy = d3.select(this).attr('y') * 1.0 + d3.select(this).attr('height') / 2.0
                  dis = Math.sqrt((cx-d3.event.x + offsetX - rm.nodePosition[rm.sourceNode].dx/2.0)*(cx-d3.event.x + offsetX-rm.nodePosition[rm.sourceNode].dx/2.0) + (cy-d3.event.y + offsetY-rm.unitPixel)*(cy-d3.event.y + offsetY-rm.unitPixel))
                  if (dis<rm.unitPixel*2) {
                    rm.targetNode = i
                    rm.targetQuestion = d3.select(this).attr('data-answer')
                    d3.selectAll('.circle-node circle')
                      .attr('stroke-width', 1)
                    d3.select(this).select('circle')
                      .attr('stroke-width', 2)

                    d3.select("#dropRect")
                      .attr("x", cx-rm.nodePosition[rm.sourceNode].dx/2.0)
                      .attr("y", cy-rm.unitPixel*1)
                      .attr("width", rm.nodePosition[rm.sourceNode].dx)
                      .attr("height",rm.unitPixel*2)
                      .attr("opacity", 1)
                      
                  }               
                })
      
    
              } else {
      
                cx = d3.select('.circle-' + i).attr('x') * 1.0 + d3.select('.circle-' + i).attr('width') / 2.0
                cy = d3.select('.circle-' + i).attr('y') * 1.0 + d3.select('.circle-' + i).attr('height') / 2.0


                dis = Math.sqrt((cx-d3.event.x + offsetX - rm.nodePosition[rm.sourceNode].dx/2.0)*(cx-d3.event.x + offsetX-rm.nodePosition[rm.sourceNode].dx/2.0) + (cy-d3.event.y + offsetY-rm.unitPixel)*(cy-d3.event.y + offsetY-rm.unitPixel))
                if (dis<rm.unitPixel) {
                  rm.targetNode = i
                  d3.select('.circle-' + i + ' circle')
                    .attr('stroke-width', 2)
                  d3.select("#dropRect")
                    .attr("x", cx-rm.nodePosition[rm.sourceNode].dx/2.0)
                    .attr("y", cy-rm.unitPixel*1)
                    .attr("width", rm.nodePosition[rm.sourceNode].dx)
                    .attr("height",rm.unitPixel*2)
                    .attr("opacity", 1)

                }
              }
            }
            if (rm.targetNode == null) {
              d3.select("#dropRect")
                .attr('opacity',0)
                .attr('x',0)
                .attr('y',0)
                .attr('width',1)
                .attr('height',1)
              d3.selectAll('.circle-node circle')
                .attr('stroke-width', 1)
            }
          })

          .on("end", function(e){
            //alert(this)
            rm.draging=false
            d3.select("#dropRect")
              .attr('opacity',0)
            d3.select("#dragRect")
              .attr('opacity',0)
            if (rm.targetNode!=null) {
              rm.visibleDiag2_dragAndDrop = true
            }
            
          })

        d3.select("#dragRect").call(drag)

//------------------------------------------------------------------------------------------------------------------------

        // link (goto) drag and drop 
        const dragJointCircle = d3.drag()
          .on("start", function(){
            rm.draging = true
            offsetX=null
          })
          .on("drag", function(){
            if (offsetX==null){
                offsetX=d3.event.x-$(this).attr('cx')
                offsetY=d3.event.y-$(this).attr('cy')
            }
            d3.select(this)
              .attr("cx",  d3.event.x - offsetX )
              .attr("cy",  d3.event.y - offsetY )
              .attr("opacity", 0.6)
            
            rm.targetNode = null
            const bottomCircle = d3.selectAll('.circle-top-joint')
            const selPoint = this
            bottomCircle.each(function(){

              let dis = Math.sqrt((d3.select(selPoint).attr('cx') - d3.select(this).attr('cx')) * (d3.select(selPoint).attr('cx') - d3.select(this).attr('cx'))
                  + (d3.select(selPoint).attr('cy') - d3.select(this).attr('cy')) * (d3.select(selPoint).attr('cy') - d3.select(this).attr('cy')))
              if (dis<rm.unitPixel) {
                d3.select("#dropCircle")
                  .attr("cx", d3.select(this).attr('cx'))
                  .attr("cy", d3.select(this).attr('cy'))
                  .attr("opacity", 1)
                rm.targetNode = this.getAttribute('data-index')
              }

            })
            


           })

          .on("end", function(e){
            //alert(this)
            rm.draging=false
            d3.select("#dropCircle")
              .attr('opacity',0)
            d3.select("#dragCircle")
              .attr('opacity',0)
            if (rm.targetNode !=null && rm.targetNode != rm.sourceNode) {
              if (rm.hasChildren (rm.sourceNode)){
                alert('Cannot goto another node from this node')
              } else {
                rm.addLink()
                rm.sourceNode = null
                rm.targetNode = null
              }
            }
          })

        d3.select("#dragCircle").call(dragJointCircle)





        //link(goto) line remove

        d3.selectAll(".line-dot")
          .on("click", function(){
            rm.sourceNode = this.getAttribute('data-index')
            rm.removeGoto()
          })




        //link(goto) mouse over
        d3.selectAll(".circle-term-joint")
          .on("mouseover",function(){
            rm.sourceNode = this.getAttribute('data-index')
            rm.sourceQuestion = this.getAttribute('data-question')
 
            if (rm.sourceNode!=null){
              d3.select("#dragCircle")
                .attr("cx", d3.select(this).attr('cx'))
                .attr("cy", d3.select(this).attr('cy'))
                .attr("opacity", 1)
            }
          })
 
        //node mouse over
        d3.selectAll(".rect-node")
          .on("mouseover",function(){
            if (!rm.draging) {
              rm.sourceNode = this.getAttribute('data-index')
            }
            if (rm.sourceNode!=null){
              
              d3.select("#controlBox")
                .attr("x", d3.select('#rectNode' + rm.sourceNode).attr('x') * 1.0 + d3.select('#rectNode' + rm.sourceNode).attr('width') * 1.0 - d3.select("#controlBox").attr('width')/2 +4 )
                .attr("y", d3.select('#rectNode' + rm.sourceNode).attr('y') - rm.unitPixel - 4)
                .attr("opacity",1.0)
              if (rm.nodeData[rm.sourceNode].parent==null) return;
              d3.select("#dragRect")
                .attr("x", d3.select('#rectNode' + rm.sourceNode).attr('x'))
                .attr("y", d3.select('#rectNode' + rm.sourceNode).attr('y'))
                .attr("width", d3.select('#rectNode' + rm.sourceNode).attr('width')-2)
                .attr("height", d3.select('#rectNode' + rm.sourceNode).attr('height')-2)
                .attr("opacity", 0.2)
            }
          })

      },0)
 



    },

    saveTree(){
      this.msg = "Please check console to show JSON.";
      console.log(this.nodeData)
    },

    getChildIndex(index,question) {
      for (let i = 0 ;i < this.nodeData.length; i++) {
        if (this.nodeData[index].key == this.nodeData[i].parent) {
          if (question==null) {
            return i
          } else {
            if (this.nodeData[i].answer == question) {
              return i
            }
          }
        }
      }
      return null

    },

    showDiag1(index, question=null) {
      this.visibleDiag1 = true;
      this.msg = question + index
      this.selectedNode = index
      this.selectedQuestion = question
      this.selectedChild = this.getChildIndex(index, question)
    },
    hideDiag1() {
      this.visibleDiag1 = false
      this.enableAddNode = true
    },
    showDiag2(index){
      this.hideDiag1()
      this.selectedCategory = index
      if (index === 0){
        this.visibleDiag2_wait = true
      } else if (index === 1) {
        this.inputCondition = [{query:'Is this okay?', result: 'Yes' },{query:'', result: 'No' }]
        this.visibleDiag2_condition = true
      } else if (index === 2 || index===3) {
        this.visibleDiag2_email = true
      }
    },
    hideDiag2(){
      this.visibleDiag2_wait = false;
      this.visibleDiag2_email = false;
      this.visibleDiag2_condition = false;
      this.visibleDiag2_dragAndDrop = false;
    },
    getNewKey() {
      let maxKey = 0
      this.nodeData.forEach(function(node) {
        if (maxKey<node.key){
          maxKey = node.key
        }
      })
      return maxKey + 1
    },
    
    addNode(){

      let key = this.getNewKey()
      
      let text = this.nodeCategories[this.selectedCategory].text.replace('{{value}}',this.inputValue+'')
      let question=[]
      
      if (this.selectedCategory == 1) {
        if (this.verifyCondition()) {
          text = this.inputCondition[0].query
          this.inputCondition.forEach(function(element) {
            question.push(element.result)
          })
        } else {
          alert('Same results!!!')
          return
        }
      
      }
      if (this.selectedChild !== null) {
        this.nodeData[this.selectedChild].parent = key
        if (question.length>0) {
          this.nodeData[this.selectedChild].answer = question[0]
        }
      }
      this.nodeData.push({key:key, category:this.selectedCategory, text:text, answer:this.selectedQuestion, value:this.inputValue, parent:this.nodeData[this.selectedNode].key, question:question, content:"somthing", goto:null})
      
      
      this.load()
      this.hideDiag2()

    },
    addResult() {
      this.inputCondition.push({query:'Query', result: '?' })
    },
    verifyCondition() {
      for (let i = 0; i<this.inputCondition.length-1; i++) {
        for (let j=i+1; j<this.inputCondition.length; j++) {
          if (this.inputCondition[i].result.trim() == this.inputCondition[j].result.trim()) {
            return false
          }
        }
      }
      return true
 
    },
    getMultipleEntry(i){
      let entries=[]
      for (let j=0;j<this.nodeData.length;j++){
        if (this.nodeData[i].key == this.nodeData[j].same) {
          entries.push(this.nodeData[j])
        }
      }
      return entries

    },
    getIndexFromKey(key){ 
      for (let i=0;i<this.nodeData.length;i++){
        if (this.nodeData[i].key == key) {
          return i
        }
      }
      return null      
    },
    addEntry(index) {
      let key = this.getNewKey() 
      this.nodeData.push({key:key+1, category:0, text:'Entry', answer:null, value:null, parent:null, question:null, same:this.nodeData[index].key  })
      this.load()
    },
    isSameBranch(one, two, question, rm){
      if (rm.nodeData[one].parent == rm.nodeData[two].key ) {
        if (question!=null) {
          if (rm.nodeData[one].answer == question){
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      }
      if (rm.nodeData[one].parent == null) return false
      for (let i=0;i<rm.nodeData.length;i++){
        if (rm.nodeData[i].key == rm.nodeData[one].parent) {
          return rm.isSameBranch(i,two,question,rm)
        }
      }
      return false
    },
    getNearChildIndex(index, question){
      
      for (let i=0;i<this.nodeData.length;i++){
        if(this.nodeData[i].parent == this.nodeData[index].key){
          if (this.nodeData[index].category==1){ //condition?
            if (question==this.nodeData[i].answer) {
              return i
            }
          }else{
            return i
          }
        }
        
      }
      return null
    },
    getTerminalIndex(index,rm){
      
      for (let i=0;i<this.nodeData.length;i++){
        if(rm.nodeData[i].parent == rm.nodeData[index].key){
          return rm.getTerminalIndex(i, rm)
        }
      }
      return index

    },
    addLink(){
      const key = this.nodeData[this.targetNode].key
      if (this.nodeData[this.sourceNode].category == 1){
        if (this.nodeData[this.sourceNode].goto == null) this.nodeData[this.sourceNode].goto = {}
        this.nodeData[this.sourceNode].goto[this.sourceQuestion] = key
      } else {
        this.nodeData[this.sourceNode].goto = key
      }
      this.load()
    },
    hasChildren(index){
      for (let i=0;i<this.nodeData.length;i++){
        if(this.nodeData[i].parent == this.nodeData[index].key){
          return true
        }
      }
      return false
    },
    hasChildren(index, question){
      for (let i=0;i<this.nodeData.length;i++){
        if(this.nodeData[i].parent == this.nodeData[index].key){
          if (this.nodeData[i].answer == question) {
            return true
          }
        }
      }
      return false
    },
    removeNode(){
      if (!confirm('Are you sure remove this node?')) return
      if (this.sourceNode == null) {
        alert('cannot find seleced node index!')
        return
      }
      let parentKey = this.nodeData[this.sourceNode].parent
      let parentIndex = this.getIndexFromKey(parentKey)
      if (this.nodeData[this.sourceNode].category == 1) {
        if (this.hasChildren(this.sourceNode)) {
          alert('This node has some children. Connot remove!')
          return
        } else {
          this.nodeData.splice(this.sourceNode, 1)
        }
      } else {
        
        let childIndex = this.getNearChildIndex(this.sourceNode)
        if (childIndex!=null) {
          this.nodeData[childIndex].parent = parentKey
          this.nodeData[childIndex].answer = this.nodeData[this.sourceNode].answer
        }
        this.nodeData.splice(this.sourceNode, 1)
      }
      this.load()
       
    },
    removeGoto(){
      if (this.sourceNode!=null) {
        this.nodeData[this.sourceNode].goto = null
        this.load()
      }
    },

    moveCopyNode(option){
      const rm = this
      
      let termIndex, nearIndex
      rm.hideDiag2()
      //if it has goto, cannot move
      if (rm.nodeData[rm.sourceNode].goto!=null) {
        if ( rm.nodeData[rm.sourceNode].goto.length!=0){
          alert('cannot move it because it was linked a node')
          return
        }
      }

      switch(option) {
        case 1:  // move all branch

          if (rm.isSameBranch(rm.sourceNode, rm.targetNode, rm.targetQuestion, rm) || rm.isSameBranch(rm.targetNode, rm.sourceNode, null, rm) ) {
            alert('same branch!')
          }else{

            termIndex = rm.getTerminalIndex(rm.sourceNode,rm)
            nearIndex = rm.getNearChildIndex(rm.targetNode, rm.targetQuestion)
            if (nearIndex) {
              rm.nodeData[nearIndex].parent = rm.nodeData[termIndex].key
              if (rm.nodeData[termIndex].category==1) { // condition?
                rm.nodeData[nearIndex].answer = rm.nodeData[termIndex].question[0]
              } else {
                rm.nodeData[nearIndex].answer = null
              }
            }

            //move sub tree
            rm.nodeData[rm.sourceNode].parent = rm.nodeData[rm.targetNode].key
            rm.nodeData[rm.sourceNode].answer = rm.targetQuestion
            rm.load()
            
          }
          break;
        
        case 2: //alone
          if (rm.hasChildren(rm.sourceNode) && rm.nodeData[rm.sourceNode].category==1) {
            alert ('cannot move it because it has some children or linked ones')
            return
          }
          if (rm.nodeData[rm.sourceNode].goto!=null) {
            alert ('cannot move it because it has some children or linked ones')
            return
          }
          nearIndex = rm.getNearChildIndex(rm.sourceNode,null)
          console.log(rm.sourceNode,nearIndex)
          if (nearIndex) {
            rm.nodeData[nearIndex].parent = rm.nodeData[rm.sourceNode].parent
            rm.nodeData[nearIndex].answer = rm.nodeData[rm.sourceNode].answer
          }

          nearIndex = rm.getNearChildIndex(rm.targetNode, rm.targetQuestion)
          if (nearIndex) {
            rm.nodeData[nearIndex].parent = rm.nodeData[rm.sourceNode].key
            if (rm.nodeData[rm.sourceNode].category==1) { // condition?
              rm.nodeData[nearIndex].answer = rm.nodeData[rm.sourceNode].question[0]
            } else {
              rm.nodeData[nearIndex].answer = null
            }
          }

          //move sub tree
          rm.nodeData[rm.sourceNode].parent = rm.nodeData[rm.targetNode].key
          rm.nodeData[rm.sourceNode].answer = rm.targetQuestion
          rm.load()

          break;
 

      }
 
    }
 

    

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
  }
  .btn-save {
    position: fixed;
    right: 30px;
    top: 30px;
    font-size: 20px;
  }
 
  .circle-top-joint{
    stroke: #9e9e9e;
    stroke-width: 1px;
    cursor: pointer;
    fill: #e0e0e0;
  }
  .circle-bottom-joint{
    stroke: #9e9e9e;
    stroke-width: 1px;
    fill: #f5f5f5;
  }
  .circle-term-joint{
    stroke: #9e9e9e;
    stroke-width: 1px;
    cursor: pointer;
    fill: #f5f5f5;
  }
  #dragCircle {
    cursor: pointer;
  }
  #dragRect {
    cursor: pointer;
  }
  .parent-canvas{
    width: 100%;
    height: 80vh;
    border: 1px solid #9e9e9e;
    overflow: hidden
  }
</style>
