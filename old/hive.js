// ****** HIVE IRC bot *******
// Ashley Davis <dual@gmx.com>
// ***************************

// REQUIRES
var fs = require('fs');
var util = require('util');
//var Config = require('./config.js');
var irc = require('irc');

// CONFIG
var Config = {
        server: 'irc.nixtrixirc.net',
        prefix: '@@',
        loudCommandNotFound: false,
        debug: true
};

// HELPERS
// Outputs debug messages if debug is true in Config
var debug = {
    log: function(t){
        if(Config.debug){
            console.log("[*] %s",t);
        }
    }
};
// spawns a new named irc bot
function spawnBot(name){
    var spawned = new irc.Client(Config.server, name, { channels:['#anarchy']});
    bots.push(spawned);
    spawned.addListener('message', function(from, to, message) {
        if( message.indexOf(name+", quit") > -1 ) {
            var ind = bots.indexOf(spawned);
            bots.splice(ind,0);
            spawned.disconnect();
        }
    });
    spawned.addListener('error', function(message) {
        console.log('('+name+') error: ', message);
    });
}

// MAIN
var bot = new irc.Client(Config.server, 'nodebot', {
    channels: ['#anarchy'],
    debug: false
});
var bots = [], globalDict = {}, modules = [];

// COMMANDS
// this will be moved later
var onMessage = function(from, to, message){
    var prefixRegexp = new RegExp('^'+Config.prefix.replace('\\','\\\\'));
    if (message.match(prefixRegexp)){
        var c = message.split(' ')[0].replace(Config.prefix,"");
        switch(c){
            case 'quit':
                bot.say(to, 'got @@quit');
                bot.disconnect();
                break;
            case 'new':
                var strArr = message.split(" ");
                if(strArr.length == 2){
                    spawnBot(strArr[1]);
                }
                break;
            case 'ping':
                bot.say(to, 'pong.');
                break;
            case 'list':
                bot.say(to, Module.list());
                break;
            case 'prefix':
                if (message.split(" ").length==1){
                    bot.say(to, "my prefix is: "+Config.prefix);
                }else if(message.split(" ").length==2){
                    //TODO: make sure we aren't using letters or numbers
                    //as a prefix, this could be potentially dangerous.
                    Config.prefix = message.split(" ")[1];
                    bot.say(to, "set my new prefix to: "+Config.prefix);
                }
                break;
            case 'load':
                if(message.split(" ").length==2){
                    Module.load(message,to);
                }
                break;
            case 'globdict':
                bot.say(to, util.inspect(globalDict));
                break;
            case 'from':
                bot.say(to, "From: "+from);
                break;
            default:
                //TODO: check globalDict for command
                //
                if (c in globalDict) {
                    var mod = modules[globalDict[c].index];
                    var command = mod.commands[c];
                    command(bot,from,to,message);
                } else {
                    if(Config.loudCommandNotFound) { 
                        bot.say(to, "command not found.");
                    }
                }
        }
    }
};
bot.addListener('message', function(from, to, message){
    onMessage(from, to, message);
});

// PLUGINS
// class will handle everything plugin-related
var Module = {
    load: function(message,to){
        //look for a module named like the passed arg
        try{
            var mod = require("./plugins/"+message.split(" ")[1]+".plugin.js");
            if(Object.keys(mod.commands).length>0){
                modules.push(mod);
                for (var command in mod.commands){
                    //TODO: Check if the command exists
                    globalDict[command] = {name: mod.name, index: modules.indexOf(mod)};
                }
            }
            bot.say(to, "Loaded plugin.");
        }catch(err){
            bot.say(to, "Couldn't load plugin.");
            console.log("error in loading: %s",err);
        }
    },
    list: function(){
        debug.log('in list function');
        //TODO: look in a special folder -- ./plugins/ maybe -- for
        //scripts named a certain way. maybe PLUGINNAME.plug.js
        //these should probably just be a single javascript object
        //formatted in an expected way.
        var p = "./plugins";
        var plugins;
        fs.readdir(p, function (err, files) {
            if (err) throw err;
            plugins = files.filter(function (file) {
                return fs.statSync(p+"/"+file).isFile();
            }).filter(function (file){
                return file.indexOf('.plugin.js') > -1;
            });     
        });
        return plugins;
    }
};

// LOGGING
bot.addListener('error', function(message) {
    console.log('error: ', message);
});
