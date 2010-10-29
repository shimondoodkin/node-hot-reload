
var http = require('http');
var autoreload= require('node-hot-reload');
var mymodule= require('./mymodule_example');

// explained example:

autoreload.watchrel('mymodule_example.js', function (newmodule){

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
   autoreload.copy(mymodule,newmodule);

   // option 3
   //   manually patch the old object with parts of the new object.

   // initialization or more initialization after switching to the new module
   // mymodule.init();
   // better don't do it, you may get errors,
   // because of not well-initialized module.

});

// simple example:
//autoreload.watchrel('mymodule_example.js',
  function (newmodule){ mymodule=newmodule; } );

// idea: add loader function to automate loading of modules:
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
