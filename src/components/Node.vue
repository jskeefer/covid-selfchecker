<template>
  <div class="pane">
    <h3 class="nodeTitle">{{ this.pageTitle }}</h3>
    <div class="nodeContent" v-html="this.content"></div>
    <div v-if="formFields.length">
        <div v-for="field in formFields" :key="field.name">
            <div v-if="field.type === 'select'">
                <select v-model="variables[field.name]">
                    <option v-for="option in field.options.split('\r\n')" :key="option" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>
            </div>
            <div v-else-if="field.type === 'checkbox'">
                <input type="checkbox" id="checkbox" v-model="variables[field.name]">
                <label for="checkbox">{{ field.label }}</label>
            </div>
        </div>
    </div>
    <div class="question-panel">
      <div v-if="buttons.length" class="content-answer">
        <ul class="answers">
          <li v-for="b in buttons" :key="b.id">
            <a class="btn btn-zingtree col-2" @click.prevent="changeRoute(b.target_node_id,b.value)" href="#">{{ b.button_text }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'

export default {
  name: "Node",
  data() {
    return {
      store: store,
      sharedState: store.state,
      activeNode: store.state.survey.nodes,
      variables: store.state.variables
    }
  },
  computed: {
    buttons() {
      return this.node.buttons || []
    },
    pageTitle() {
      return this.templateVars(this.node.page_title,this.variables) || ""
    },
    content() {
      return this.templateVars(this.node.content,this.variables) || ""
    },
    formFields(){
      return this.node.formfields || []
    },
    node() {
      return this.activeNode[this.sharedState.activeNodeId] || {};
    }
  },
  methods: {
    changeRoute(newRoute, value){
      if(this.activeNode[newRoute].display){
        if( value && Object.prototype.hasOwnProperty.call(this.activeNode[this.sharedState.activeNodeId], "variable") ){
          this.variables[this.activeNode[this.sharedState.activeNodeId].variable] = value;
        }
        console.log(this.variables);
        this.$router.push({ path: this.$route.path + '/' + newRoute })
      }else{
        console.log('false');
      }
    },
    templateVars( string, objMap ){
      for(let prop in objMap) {
        string = string.replace( new RegExp('#' + prop + '#', "g"), objMap[prop] );
      }
      return string;
    },
    parseOptions(options){
      console.log(options);
      console.log(options.split('\r\n'));
      return options.split('\r\n');
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul.answers {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

ul.answers li {
  padding: 0;
  margin: 10px 0;
}

a.btn {
  display: flex;
  padding: 10px 7px;
  background: #0e5a38;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  justify-content: center;
}

a.btn .col-2 {
  width: 50%;
}

.nodeContent {
  text-align: justify;
}

.nodeQuestion {
    background: azure;
    font-weight: bold;
    font-style: italic;
    padding: 10px;
    margin-top: 20px;
}
</style>
