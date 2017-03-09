'use strict';
var util = require( 'util' );
var mnPath = require( 'path' );
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var shelljs = require('shelljs');

/**
 * 
 * 
 * 
 * 
 * 
 */
 var myGen = Generator.extend({
  config: function() {
    this.config.set('coffeescript', false);
    var MeanApp = this.config.get("MeanApp");

      if(typeof MeanApp === 'undefined'){
        MeanApp = {};
        MeanApp.features = {};
        MeanApp.description = "";
        this.config.set('MeanApp', MeanApp);
        this.config.save();
      }
  }
});

class MeanApp extends myGen {

  config(){
      var MeanApp = this.config.get("MeanApp");

      if(typeof MeanApp === 'undefined'){
        MeanApp = {};
        MeanApp.features = {};
        MeanApp.description = "";
        this.config.set('MeanApp', MeanApp);
        this.config.save();
      }
  }

  initializing(){
    this.pkg = require('../package.json');
    this.shelljs = shelljs;
    this.yosay = yosay;
    this.mnPath = mnPath;
    this.util = util;
    this.typeStructure = 'h' // É estrutura de pastas horizontal
    this._ = _;
  }

  constructor(args, opts) {
    super(args, opts);
    this.initializing();
  }

  meanAppSaveConfig(config, oMeanApp){
      config.set('MeanApp', oMeanApp);
      config.save();
  }
};

module.exports = class extends MeanApp {

};
