#!/Library/Java/JavaVirtualMachines/jdk1.8.0_40.jdk/Contents/Home/bin/jjs   -dump-on-error  --language=es6 -scripting

/** 
  * A very simple js module to check if a local http URL is responding and opening then a page to it
  * Could be handy to start a server and wait until the server gets up.
  * To get started use
  * npm install .
  * to download org-mode-parser  
  * NB: -strict mode does not work with jvm-npm.js
  * 
  * Ref http://docs.oracle.com/javase/8/docs/technotes/tools/windows/jjs.html
  * http://winterbe.com/posts/2014/04/05/java8-nashorn-tutorial/
  */



/** Nodejs compatibility layer, a bit modified by JJ to ensure a small patching
  * https://github.com/nodyn/jvm-npm
 */
load('./nodejs-integration/jvm-npm.js');
//var u=  require('underscore');
//var OrgMode = require('org-mode-parser');


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
// 
// Local variables:
// mode:js2
// mode:company
// End:
