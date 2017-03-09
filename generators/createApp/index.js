'use strict';
var MeanApp = require('../meanApp.js');
var MeanAppFiles = require('../createApp/createAppFiles.js');


var MyGenerator = MeanApp.extend({
  config: function() {
    this.config.set('coffeescript', false);
  }
});


module.exports = class extends MeanApp {
  
  initializing2(){
    /** 
     * @var this.aPathListClient: é o mesmo que public/
     */
    this.aPathListClient = [ 
      'config',
      'config/env/global',
      'controllers',
      'css',
      'directives',
      'filters',
      'img',
      'lib',
      'services',
      'views',
    ];
    
    /**
     * 
     */
    this.aPathListServer = [
      'config',
      'config/env',
      'config/strategies',
      'controllers',
      'models',
      'routes',
      'views',
    ];
  }


  constructor(args, opts) { 
    super(args, opts);
    this.initializing();
    this.initializing2();

    // Aqui, adiciona o seu próprio código
    if(args.length == 0){
        console.error('O argumento: projetoName é obrigatório!');
        console.log('Exemplo: yo mean-app:createApp projetoName --feature-name=article1');
        this.shelljs.exit(1);
    } else {
      this.options.projectName = this.arguments[0];
      this.options.gitUser = "pssilva";
      this.options.author = "Paulo Sérgio da Silva";
    }

    if(typeof this.options.featureName === 'undefined'){
        console.error('O flag --feature-name é obrigatório!');
        console.log('Exemplo: yo mean-app:createApp projetoName --feature-name=article1');
        this.shelljs.exit(1);
    }

    if(typeof this.options.structureVertical !== 'undefined'){
        this.typeStructure = 'v' // altera para a estrutura de pastas Vertical
    }

    this.option('structure-vertical'); // Isso adiciona suporte a `--structure-vertical` flag
    this.option('feature-name', { type: String, required: true }); // Isso adiciona suporte a `--feature-name` flag
    this.argument('projectName', { type: String, required: true });
  }

  prompting() {
    var aPrompt = [];
    var MeanApp = this.config.get("MeanApp");

    if(typeof MeanApp === 'undefined') {
        console.log("ID:65 MeanApp");
        console.log(MeanApp);
        this.meanAppSaveConfig(this.config, MeanApp);
    }

    if(typeof this.options.autoCommand !== 'undefined'){
        aPrompt = [{
          type    : 'input',
          name    : 'projectName',
          message : 'Nome do Projeto: ',
          default :  this.options.projectName// Default to current folder name
        }];

        aPrompt.push({
          type    : 'input',
          name    : 'featureName',
          message : 'Nome da Feature: ',
          default :  this.options.featureName// Default to current folder name
        });
    }
    
    if(typeof MeanApp !== 'undefined' 
        && typeof MeanApp.description === 'undefined' ){
      aPrompt.push({
        type    : 'input',
        name    : 'description',
        message : 'Descrição sucinta do projeto.',
        default : '' // Default to current folder name
      });
    }

    return this.prompt(aPrompt)
      .then(function (props) {
        this.props = props;
        if(typeof MeanApp !== 'undefined' 
            && typeof MeanApp.description === 'undefined' ) MeanApp.description = this.props.description;
        if(typeof this.options.autoCommand !== 'undefined') this.options.featureName = this.props.featureName;
        this.meanAppSaveConfig(this.config, MeanApp);
      }.bind(this));
  }


  // writing() {
    
  //   if(this.typeStructure === 'v') {
  //       this._private_createAppFilesVertical();
  //   } else {
  //       this._private_createAppFilesHorizontal();
  //   }

  // }

  path(){

    if(this.typeStructure === 'v') {
        this._private_createPathVertical(this); 
        this._private_createAppFilesVertical();
    } else {
        this._private_createPathHorizontal(this); 
        this._private_createAppFilesHorizontal();
    }
  } 


  /**
   * 
   * 
   * 
   * 
   */
  install() {

      this.installDependencies({
        npm: true,
        bower: true,
        yarn: false
      });

  }

  /**
   * 
   * 
   * 
   * 
   */
  _private_createPathHorizontal(paths){
      var sPathRoot = "app";
      var sPathPublic = "";
      var aPathConfig = [
        "config",
        "config/env"
      ];

      sPathPublic = this.mnPath.normalize(sPathRoot);
      this._private_cratePathsByArray(sPathPublic, this.aPathListServer);

      sPathPublic = this.mnPath.normalize("config");
      this._private_cratePathsByArray(sPathPublic, aPathConfig);

      sPathPublic = this.mnPath.normalize("public");
      this._private_cratePathsByArray(sPathPublic, this.aPathListClient);

      if (this.shelljs.exec( 'rm -Rf app/config ').code !== 0) {
            this.shelljs.echo('Error: a pasta: app/config não pode ser removido!');
            this.shelljs.exit(1);
      }

      console.log("###################################################");
      console.log("A estrutura Horizontal foi criada com sucesso!");
      console.log("###################################################");
  }

  /**
   * 
   * 
   * 
   * 
   */
  _private_createPathVertical(paths){
    var sPathRoot = "app";
    var sPathCore = "core";
    var sPathClient = "";
    var sPathFeature = "";
    
    sPathClient = this.mnPath.join(sPathRoot,sPathCore,"/client");
    sPathClient = this.mnPath.normalize(sPathClient);
    this._private_cratePathsByArray(sPathClient, this.aPathListClient);

    sPathClient = this.mnPath.join(sPathRoot,sPathCore,"/server");
    sPathClient = this.mnPath.normalize(sPathClient);
    this._private_cratePathsByArray(sPathClient, this.aPathListServer);

    this.options.featureName = this.options.featureName.replace(" ","-");
    this.options.featureName = this.options.featureName.replace("/","");
    this.options.featureName = this.options.featureName.split(" ").join("");

    sPathFeature = this.mnPath.join(sPathRoot,this.options.featureName,"/client");
    sPathFeature = this.mnPath.normalize(sPathFeature);
    this._private_cratePathsByArray(sPathFeature, this.aPathListClient);

    sPathFeature = this.mnPath.join(sPathRoot,this.options.featureName,"/server");
    sPathFeature = this.mnPath.normalize(sPathFeature);
    this._private_cratePathsByArray(sPathFeature, this.aPathListServer);
    
    console.log("###################################################");
    console.log("A estrutura Vertical foi criada com sucesso!");
    console.log("###################################################");
    
  }


  /**
   * 
   * 
   * 
   * 
   */
   _private_createAppFilesVertical(){

      this._private_createAppFilesCommun();

      this.fs.copyTpl(
        this.templatePath('_index.server.routes.js'),
        this.destinationPath('app/core/server/routes/index.server.routes.js'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName
        }
      );

      this.fs.copy(
        this.templatePath('_user.server.model.js'),
        this.destinationPath('app/core/server/models/user.server.model.js')
      );

      this.fs.copy(
        this.templatePath('_index.server.controller.js'),
        this.destinationPath('app/core/server/controllers/index.server.controller.js')
      );

      this.fs.copyTpl(
        this.templatePath('_index.ejs'),
        this.destinationPath('app/core/server/views/index.ejs'),{
            featureName: this.options.featureName,
            modelName: this.options.modelName,
            title: "Título do Site",
            user: "Nome do usuário"
        }
      );

      this.fs.copyTpl(
        this.templatePath('_mongoose.js'),
        this.destinationPath('app/core/server/config/mongoose.js'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName
        }
      );

      this.fs.copyTpl(
        this.templatePath('_development.js'),
        this.destinationPath('app/core/server/config/env/development.js'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName
        }
      );

      this.fs.copyTpl(
        this.templatePath('_local.js'),
        this.destinationPath('app/core/server/config/strategies/local.js'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName
        }
      );

      this.fs.copyTpl(
        this.templatePath('_express.js'),
        this.destinationPath('app/core/server/config/express.js'),{
            projectName: this.options.projectName
        }
      );

      this.fs.copy(
        this.templatePath('_config.js'),
        this.destinationPath('app/core/server/config/config.js')
      );

      this.fs.copy(
        this.templatePath('_application.js'),
        this.destinationPath('app/core/client/application.js')
      );

    console.log("#########################################");
    console.log("Os arquivos para a estrutura Vertical \n foi criada com sucesso!");
    console.log("#########################################");

   }

  /**
   * 
   * 
   * 
   * 
   */
  _private_createAppFilesHorizontal(){

      this._private_createAppFilesCommun();
  }

  /**
   * 
   * 
   * 
   * 
   */
  _private_createAppFilesCommun(){

      this.fs.copy(
        this.templatePath('_editorconfig'),
        this.destinationPath('.editorconfig')
      );

      this.fs.copy(
        this.templatePath('_travis.yml'),
        this.destinationPath('.travis.yml')
      );

      this.fs.copy(
        this.templatePath('_gitattributes'),
        this.destinationPath('.gitattributes')
      );

      this.fs.copy(
        this.templatePath('_jshintrc'),
        this.destinationPath('.jshintrc')
      );

      this.fs.copy(
        this.templatePath('_bowerrc'),
        this.destinationPath('.bowerrc')
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName,
            description: this.options.description,
            gitUser: this.options.gitUser,
            author: this.options.author
        }
      );

      this.fs.copy(
        this.templatePath('_server.js'),
        this.destinationPath('server.js')
      );

      this.fs.copyTpl(
        this.templatePath('_README.md'),
        this.destinationPath('README.md'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName
        }
      );

      this.fs.copyTpl(
        this.templatePath('_gitignore'),
        this.destinationPath('.gitignore'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName
        }
      );
      
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),{
            projectName: this.options.projectName,
            featureName: this.options.featureName,
            description: this.options.description,
            gitUser: this.options.gitUser,
            author: this.options.author
        }
      );

  }

  /**
   * 
   * 
   * 
   * 
   */
  _private_cratePathsByArray(sCreatePath, aPaths){
    sCreatePath = this.mnPath.normalize(sCreatePath);
    if (!this.fs.exists( sCreatePath)) {
      for(var iKey in aPaths){
        var path = this.mnPath.join(sCreatePath,aPaths[iKey]);
        path = this.mnPath.normalize(path);
        if(aPaths.hasOwnProperty(iKey)){ 
            if (this.shelljs.exec( 'mkdir -p '+path).code !== 0) {
                console.log('pasta: '+path+' criada com sucesso!');
                if (this.shelljs.exec( 'touch '+path+'/empty').code !== 0) {
                    this.shelljs.echo('Error: file in create empty');
                    this.shelljs.exit(1);
                } else {
                    console.log('Arquivo:  '+path+' criada com sucesso!');
                }
            }
         }
      } 
    }
  }
};

