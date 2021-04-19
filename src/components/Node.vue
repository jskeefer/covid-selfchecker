<template>
  <div class="pane">
    <h3 class="nodeTitle">{{ this.pageTitle }}</h3>
    <div class="nodeContent" v-html="this.content"></div>
    <div class="nodeContent" v-if="formFields.length">
        <div v-for="field in formFields" :key="field.name">
            <div v-if="field.type === 'select'">
                <label :for="field.name">{{ field.label }}</label>
                <select v-model="variables[field.name]">
                    <option v-for="option in field.options.split('\r\n')" :key="option" v-bind:value="option">
                        {{ option }}
                    </option>
                </select>
            </div>
            <div v-else-if="field.type === 'checkbox'">
                <input type="checkbox" :id="field.name" v-model="variables[field.name]" true-value="1" false-value="0">
                <label :for="field.name">{{ field.label }}</label>
            </div>
            <div v-else-if="field.type === 'text'">
                <label :for="field.name">{{ field.label }}</label>
                <input :id="field.name" v-model="variables[field.name]">
            </div>
        </div>
    </div>
    <div class="question-panel">
      <div v-if="buttons.length" class="content-answer">
        <ul class="answers">
          <li v-for="b in buttons" :key="b.id">
            <a class="btn btn-zingtree col-2" :class="{disabled: validateFormFields}" @click.prevent="targetNode(b.target_node_id,b.value)" href="#">{{ b.button_text }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store';

export default {
  name: 'Node',
  data() {
    return {
      store: store,
      sharedState: store.state,
      allNodes: store.state.survey.nodes,
      variables: store.state.variables
    }
  },
  computed: {
    // computed to not change the state so when hitting the back button it keeps the template vars # # intact
    pageTitle() {
      return this.templateVars( this.node.page_title ) || ''
    },
    // computed to not change the state so when hitting the back button it keeps the template vars # # intact
    content() {
      return this.templateVars( this.node.content ) || ''
    },
    buttons() {
      return this.node.buttons || []
    },
    formFields(){
      return this.node.formfields || []
    },
    node() {
      return this.allNodes[ this.sharedState.activeNodeId ] || {};
    },
    // validate each form field and disable the next button
    validateFormFields(){
      const isRequired = {
        '0': () => { return false; },
        '1': ( field ) => { return !this.variables[ field.name ] || this.variables[ field.name ] === '0';  },
        // add more requirements here such as a logic dependent node
      };
      let isDisabled = false;
      this.formFields.some( ( field ) => {
        if( isRequired[ field.required ]( field ) ){
          isDisabled = true;
          return true;
        }
      });
      return isDisabled;
    },
  },
  methods: {
    // get the next node and see what type of content it is
    targetNode( targetNodeId, value ){
      const nodeType = this.allNodes[ targetNodeId ].type,
      nodeTypes = {
        'Logic': () => { this.logicConditions( targetNodeId ) },
        'Content': () => { this.gotoTargetNode( targetNodeId, value ) },
        // add more nodeTypes here
      };
      nodeTypes[ nodeType ] ? nodeTypes[ nodeType ]() : console.error( 'No existing Node Type found, check the API.' );
    },
    // set the value of the variable if their is one and push the next node to the router
    gotoTargetNode( targetNodeId, value = null ){
      // if no value and no variable dont save, formFields save their value into the store variable
      if( value && this.allNodes[ this.sharedState.activeNodeId ][ 'variable' ] ){
        this.variables[ this.allNodes[ this.sharedState.activeNodeId ].variable ] = value;
      }
      this.$router.push( { path: this.$route.path + '/' + targetNodeId } )
    },
    // loop through conditions to get to the next targeted node
    logicConditions( targetNodeId ){
      const operators = {
        'eq': function( a, b ) { return a === b },
        'default': function() { return true },
        // add more operators here
      };
      this.allNodes[ targetNodeId ].conditions.some( condition => {
        if( operators[ condition.operator ]( this.variables[ condition.variable ], condition.value) ){
          this.gotoTargetNode( condition.target_node_id );
          return true;
        }
      });
    },
    // replace all variables that might be in the content or title
    templateVars( string ){
      let newString = string.replace(/#(.*?)#/g, ( match, variable ) => {
        return this.variables[ variable ];
      });
      return newString;
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

a.btn.disabled {
    background: #ccc;
    cursor: not-allowed;
    pointer-events: none;
}

a.btn .col-2 {
    width: 50%;
}

.nodeContent {
    text-align: justify;
    margin-bottom: 4px;
}

.nodeQuestion {
    background: azure;
    font-weight: bold;
    font-style: italic;
    padding: 10px;
    margin-top: 20px;
}

select {
    padding: 6px;
}

label {
    padding: 6px;
}
</style>
