var http = require('http');
var autoreload= require('./index');
var mymodule= require('./mymodule_example');

autoreload.watchrel('mymodule_example.js', function (newmodule){
   /* you can put here staff to make your module look like it was initialized well. */
   newmodule.name=mymodule.name;
   //mymodule.init(); // init the module before if possible, it will save error time.
   autoreload.copy(mymodule,newmodule);
   //mymodule=newmodule; // replace reference - probabaly the best but you must update all references you have 
   //mymodule.moreinit(); // while this not finished you may get errors, because of not whell initilized your module.
});

//autoreload.watchrel('mymodule_example.js', function (newmodule){ mymodule=newmodule; });
//autoreload.watch(mymodule.filename, function (newmodule){ mymodule=newmodule; }); // might not work if when started the module has errors or filename exports is missing  


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
