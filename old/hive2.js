// HIVE2

// requires
var irc = require('irc');


// MAIN
var hiveQueen = function(){
    
    var Config = {
        name: '[hive]',
        server: 'irc.nixtrixirc.net',
        prefix: ']',
        debug:  'true'
    };

    var debug = {
        log: function(t){
            if(Config.debug){
                console.log("[*] %s",t);
            }
        }
    };
    
    var onMessage = function(bot, from, to, message){
        var prefixRegexp = new RegExp('^'+Config.prefix.replace('\\','\\\\'));
        if (message.match(prefixRegexp)){
            var c = message.split(' ')[0].replace(Config.prefix,"");
            switch(c){
                case 'quit':
                    bot.say(to, 'got '+Config.prefix+'quit');
                    bot.disconnect();
                    break;
                /*case 'new':
                    var strArr = message.split(" ");
                    if(strArr.length == 2){
                        spawn(strArr[1]);
                    }
                    break;
                    */
                case 'ping':
                    bot.say(to, 'pong.');
                    break;
                /*case 'list':
                    bot.say(to, Module.list());
                    break;
                    */
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
                /*case 'load':
                    if(message.split(" ").length==2){
                        Module.load(message,to);
                    }
                    break;
                    */
                /*case 'globdict':
                    bot.say(to, util.inspect(globalDict));
                    break;*/
                case 'from':
                    bot.say(to, "From: "+from);
                    break;
                default:
                    //TODO: check globalDict for command
                    //
                    /*if (c in globalDict) {
                        var mod = modules[globalDict[c].index];
                        var command = mod.commands[c];
                        command(bot,from,to,message);
                    } else {
                        */
                        if(Config.loudCommandNotFound) { 
                            bot.say(to, "command not found.");
                        }
                    //}
            }
        }
    };

    var spawned = [];
    
    var spawn = function(server,name){
        var bot = new irc.Client(server, name, { channels:['#anarchy']});
        spawned.push(bot);
        bot.addListener('message', function(from, to, message) {
            if( message.indexOf(name+", quit") > -1 ) {
                var ind = spawned.indexOf(bot);
                spawned.splice(ind,0);
                bot.disconnect();
            }
        });
        bot.addListener('error', function(message) {
            debug.log('('+name+') error: ', message);
        });
    };

    //The first function we will define is connecting to an IRC server as a sort
    //of master bot that won't join channels, but will serve as the command
    //center for the spawn.
    
    //-this is all hard-coded for now.
    spawn(Config.server,Config.name);
    spawned[0].addListener('message', function(from, to, message) {
        onMessage(spawned[0], from, to, message);
    });

};

hiveQueen();