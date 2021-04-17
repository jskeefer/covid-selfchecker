export default {
  state: {
    survey: {},
    activeNodeId: 1,
    variables: {}
  },
  async init() {
    try{
      const response = await fetch( process.env.VUE_APP_API_URL );
      const data = await response.json();
      this.state.survey = data;
      return true;
    }
    catch( e ){
      console.error( e );
      return false;
    }
  },
}
