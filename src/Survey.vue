<template>
  <div id="app">
    <div class="loading" v-if="loading">{{ loadingMessage }}</div>
    <div v-else>
      <div class="survey">
        <h1>{{ survey.name }}</h1>
          <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import store from './store';

export default {
  name: 'Survey',
  data() {
    return {
      sharedState: store.state,
      loading: true,
      loadingMessage: 'Loading...'
    }
  },
  computed: {
    survey() {
      return this.sharedState.survey;
    },
  },
  created() {
    // call init function of store and
    store.getSurveyData().then( ( result ) =>{
      if( result ){
        this.formatData();
        //redirect to home page on a page refresh
        if( this.$route.path !== '/1' ){
          this.$router.push( { path:  '/1' } );
        }
        this.loading = false;
      }else{
        this.loadingMessage = 'OOPS! Something went wrong, please refresh the page';
      }
    });
  },
  watch: {
    // watch for route changes and get the last item in the path, set to activeNodeId
    $route( to ) {
      this.sharedState.activeNodeId = to.path.split( '/' ).pop();
    }
  },
  methods: {
    // format data to correct data error in API
    formatData(){
      // switch nodes 1,2 to go to 4 to fix data error
      this.sharedState.survey.nodes[ 1 ].buttons[ 0 ].target_node_id = '4';
      this.sharedState.survey.nodes[ 2 ].buttons[ 0 ].target_node_id = '4';
      // change target of node 4 to go to 3
      this.sharedState.survey.nodes[ 4 ].buttons[ 0 ].target_node_id = '3';
      this.sharedState.survey.nodes[ 4 ].buttons[ 1 ].target_node_id = '3';
      // change target of 3 to go to 5
      this.sharedState.survey.nodes[ 3 ].buttons[ 0 ].target_node_id = '5';
      // change the text of node 3
      this.sharedState.survey.nodes[ 3 ].content = 'Are #user_profile# ill?';

      // uncomment to test required fields select
      // this.sharedState.survey.nodes[ 6 ].formfields[ 0 ].required = '1';
      // test required checkbox
      // this.sharedState.survey.nodes[ 12 ].formfields[ 0 ].required = '1';

      /*********************************************************************************************************************************
      I did not have enough time to implement this but a structure like this could be used to check if a form field should be required
       make a function to iterate over the AND and OR conditions and return back true for isRequired

        "30": {
            "project_node_id": "30",
            "type": "Logic",
            "display": false,
            "conditions": {
                "and" : [
                    {"variable": "dialysis", "value": "1","operator": "eq"}
                ],
                "or": [
                    {"variable": "state", "value": "New York","operator": "eq"},
                    {"variable": "state", "value": "California","operator": "eq"}
                ]
            },
            "formfields": []
        },

        If the checkbox for dialysis was checked OR the chosen state was New York or California then the formfield this was attached to
        would be required

        Also I was thinking that multiple Logic node conditions could be added to target_node_ids

        "30": {
            "project_node_id": "30",
            "type": "Logic",
            "display": false,
            "conditions": [
                {
                    "target_node_id": "28",
                    "conditions": {
                        "and" : [

                        ],
                        "or": [
                            {"variable": "state", "value": "New York","operator": "eq"},
                            {"variable": "state", "value": "California","operator": "eq"}
                        ]
                    },
                },
                {
                    "target_node_id": "27",
                    "operator": "default"
                }
            ],
            "formfields": []
        },

        If the chosen state was New York or California the user
        will be directed to target_node_id 28

       */
    }
  }
}
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.loading {
  font-size: 35px;
}

.survey {
  max-width: 600px;
  margin: 0 auto;
}

.report {
  text-align: left;
  background: #2c3e50;
  color: white;
}

@media screen and (max-device-width: 767px){
    #app {
        margin: 20px;
    }
}
</style>
