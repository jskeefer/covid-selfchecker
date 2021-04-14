export default {

  state: {
    survey: {},
    activeNodeId: 1,
    variables: {}
  },
  async init() {
    try{
      const response = await fetch('https://zt-eng.s3.us-east-1.amazonaws.com/fe-challenge/survey.json');
      const data = await response.json();
      this.state.survey = data;
      return true;
    }
    catch(e){
      console.log(e);
      return false;
    }
  },
}
