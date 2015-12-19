#!/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home/bin/jjs   -dump-on-error  --language=es6 -scripting

/** -strict mode does not work with jvm-npm.js
  * 
  * Ref http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jjs.html
  * http://winterbe.com/posts/2014/04/05/java8-nashorn-tutorial/
 */



/** Nodejs compatibility layer 
https://github.com/nodyn/jvm-npm
http://stackoverflow.com/questions/5168451/javascript-require-on-client-side
 */
load('./nodejs-integration/jvm-npm.js');
var u=require('underscore');
var x = require('org-mode-parser');

var requireBrowserSide = (function () {
    var cache = {};
    function loadScript(url) {
        var xhr = new XMLHttpRequest(),
            fnBody;
        xhr.open('get', url, false);
        xhr.send();
        if (xhr.status === 200 && xhr.getResponseHeader('Content-Type') === 'application/x-javascript') {
            fnBody = 'var exports = {};\n' + xhr.responseText + '\nreturn exports;';
            cache[url] = (new Function(fnBody)).call({});
        }
    }
    function resolve(module) {
        //TODO resolve urls
        return module;
    }
    function require(module) {
        var url = resolve(module);
        if (!Object.prototype.hasOwnProperty.call(cache, url)) {
            loadScript(url);
        }
        return cache[url];
    }
    require.cache = cache;
    require.resolve = resolve;
    return require;
}());



load('http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js');


var a = [
  "Hydrogen",
  "Helium",
  "Lithium",
  "Beryl­lium"
];

var a2 = a.map(function(s){ return s.length; });

//var a3 = a.map( s => s.length );


function check(url){
    var UrlClass = Java.type('java.net.URL');
    var Thread = Java.type('java.lang.Thread');
    var jurl=new UrlClass(url);
    print("Checking "+jurl);
    var ok=false;
    var remainingChecks=15;
    while(!ok && (--remainingChecks>0) ) {
        try {
            var myURLConnection = jurl.openConnection();
            myURLConnection.connect();
            ok=true;
        }catch(error){
            print(""+error.getClass()+" Checking again in a while..."+remainingChecks);
            //error.printStackTrace();
            ok=false;
            Thread.sleep(7000);
            
        }
    }
    if(!ok){
        throw "FATAL:URL "+jurl+" do not respond";
    }else{
        print("Check ok!");
    }
}

function openViaBrowser(url){
    var System = Java.type('java.lang.System');
    var Runtime= Java.type('java.lang.Runtime');
    var Desktop=Java.type('java.awt.Desktop');
    if(Desktop.isDesktopSupported()){
        var desktop = Desktop.getDesktop();
        print("You are lucky, awt cross desktop functionality is here");
        var URI=Java.type('java.net.URI');
        desktop.browse(new URI(url));
    }else {
        var os=System.getProperty("os.name");
        print(os);
        var osMap={};
        osMap["Mac OS X"]=function(){
            var p=Runtime.getRuntime().exec("/usr/bin/open "+url);
            p.waitFor();
        };
        (osMap[os])();
        //throw "Unsupported O.S. '"+os+"'";
    }
    
}

function checkAndRun(url){
    check(url);
    openViaBrowser(url);
}

// Main
checkAndRun("http://gioorgi.com");
// Open the url via browser under windooze
// under mac use open
// under linux use firefox(?)
