# node.js hot reload of js files. (it is not restart, more like erlang) 


## hotreload.path

## hotreload.watch(script, reload_callback)
watch script file,  onchange load the script file and call callback

script is string

reload_callback(newmodule) is a function,
it has an argument - the loaded module object.

## hotreload.watch(watchpath, script , reload_callback)
watch one file and load another.

watchpath can be a string or an array
script is string 

## hotreload.watchrel(script, reload_callback)
watch script file relative to @hotreload.path@

## hotreload.watchrel(watchpath, script , reload_callback)


## example:
server.js:

    var http = require('http');
    var hotreload= require('node-hot-reload');
        hotreload.path=__dirname;
    
    //1st require the module normaly
    
    var mymodule= require('./mymodule_example'); 
    
    
    //2nd watch it and reload it dinamicaly
    
    // explained example:

    hotreload.watchrel('mymodule_example.js', function (newmodule){

       /* you can put here staff to make your module
          look like it was initialized well. */

       newmodule.name=mymodule.name; // take care to copy previous data

       //mymodule.init(); // init the module before if possible,
                          // it will save error time.
       // option 1
       // replace reference - probably the best way
       // but you must update all references you have 
       // replace reference - probably the best way
       // but you must update all references you have 

       //mymodule=newmodule;
       //myothermodulereference=newmodule;


       // option 2
       // copy properties from new module to old module
       // as a solution to not having to update
       // references to module object
       hotreload.copy(mymodule,newmodule);

       // option 3
       //   manually patch the old object with parts of the new object.

       // initialization or more initialization after switching to the new module
       // mymodule.init();
       // better don't do it, you may get errors,
       // because of not well-initialized module.

    });
    
    // simple example1:
    //hotreload.watchrel('mymodule_example.js',
    //  function (newmodule){ mymodule=newmodule; } );
      
    // simple example2:
    //hotreload.watchrel('mymodule_example.js',
    //  function (newmodule){ hotreload.copy(mymodule,newmodule); } );
    
    // idea: add loader function to automate reloading of modules:
    //  
    
    mymodule.name="Shimon";
    
    http.createServer(function (request, response) {
    
      try
      {
       response.writeHead(200, {'Content-Type': 'text/plain'});
       response.end(mymodule.time() + '\n');
      }
      catch(err)
      {
       response.end(err.stack);
       console.log(err.stack);
      }
    
      //to do, main module reloadable instead of above you might use: 
      //mymodule.handlerequest(req,res); 
       
    }).listen(8124);
    
    console.log('Server running at http://127.0.0.1:8124/');


mymodule_example.js:

    console.log('mymodule loaded');
    exports.name='test';
    exports.date=(new Date).toString();
    exports.time=function ()
    {
                          //  edit the number to see it working
     return  " test number 17 name: "+exports.name+" , loaded at: "+exports.date.toString();
    }
    exports.filename=__filename;

