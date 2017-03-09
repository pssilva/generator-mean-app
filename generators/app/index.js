'use strict';
var MeanApp = require('../meanApp.js');

module.exports = class extends MeanApp {

  constructor(args, opts) {
    super(args, opts);
  }

  main(){
    if (!this.fs.exists(this.destinationRoot()+"/app")) {
      console.log("Não tem a estrutura de pastas!");
      console.log("Execute: yo mean-app:createApp MyApp --feature-name='MyFeature' --autoCommand ");
    }
  }

};