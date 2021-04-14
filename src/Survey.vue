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
import store from './store'

export default {
  name: 'Survey',
  data() {
    return {
      sharedState: store.state,
      loading: true,
      loadingMessage: "Loading..."
    }
  },
  computed: {
    survey() {
      return this.sharedState.survey;
    },
  },
  created() {
    store.init().then( (result) =>{
      if( result ){
        //redirect to home page on a page refresh
        console.log(this.$route.path);
        if(this.$route.path !== '/1'){
          this.$router.push({ path:  '/1' })
        }
        this.loading = false;
      }else{
        this.loadingMessage = "OOPS! Something went wrong, please refresh the page";
      }
    });
  },
  updated() {

  },
  watch: {
    $route(to) {
      this.sharedState.activeNodeId = to.path.split('/').pop();
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
