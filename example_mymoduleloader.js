 require.paths.unshift(__dirname); //make local paths searched by require
 
 var app={};
 app.hotreload=require('node-hot-reload');
 
 app.loadmodules= function(arr) {
 
  for(var objectname in modules)  {
   filename=modules[objectname];
   app[objectname] = require(filename); // simple
   
   //app[objectname] = require(filename).main.call(app,app);
   // i use to use main function as kind of include mechanizm
   // to inject dependenies -- change the this of the callled main to app
   // and make the app var avalible in the module
   
	 app.watchmodule(objectname, filename + '.js'); 
  }
 };
 
 app.watchmodule= function(objectname, filename) {
  var watch_arr=[];
  watch_arr.push(filename);
  app.hotreload.watchrel(watch_arr,filename,function (newmodule){
   hotreload.copy(app[objectname],newmodule);
  });
 };
 
 // use
 var modules_to_load=
 {
  mymodule:'mymodule_example',
  //contacts:'subfolder/contacts'
 }
 
app.loadmodules(modules_to_load);
 
app.mymodule.name="Shimon";

app.handlerequest=function (request, response)
{
   try
   {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(app.mymodule.time() + '\n');
   }
   catch(err)
   {
    response.end(err.stack);
    console.log(err.stack);
   }
}

app.run=function()
{
 http.createServer(function (request, response) {
  app.handlerequest(request, response)
 }).listen(8124);
}

app.run();

/*
//ADVANCED USE EXAMPLE:

app.pages={};
    
// How to watch several files. for example a module and its templates.
// and have a custom standart reload function for modules of Page type.  

app.watchpage = function(pagename,filename)
{
 var watch_arr=[];
 for(k in app.pages[pagename].load_templates)
 {
  if(app.pages[pagename].load_templates.hasOwnProperty (k))
  {
   watch_arr.push('templates/'+app.pages[pagename].load_templates[k]);
  }
 }
 watch_arr.push(filename);
 app.hotreload.watchrel(watch_arr,filename, 
 function (newmodule) {
  var oldpage=app.pages[pagename];
  var page=newmodule.main.apply(oldpage.pagethis?oldpage.pagethis:app,oldpage.pagearguments?oldpage.pagearguments:[app]);
  // in the main function in the module i use to store the arguments passed to the main function.
  
  app.doubletemplate.load_templates(page,function ()
  {
   app.pages[pagename]=page; // update main page reference
   
   for(var i=0;i<app.url_routes.length;i++) // serch routes and update routes
   {
    if(app.url_routes[i].page)
    if(app.url_routes[i].page.pagefilename==oldpage.pagefilename)
    {
     app.url_routes[i].page=page;
     console.log( (new Date).toTimeString() + ' page ' + i + ' reloaded ' + filename );
    }
   }
  }); 
  // route update here
 }); 
}

//contacts.js
this.main=function(app)
{
 var page={
      pagefilename:__filename,
      load_templates:{
       contacts:"contacts.html"
      }
     };
     
     page.onload= function (page,template_name,callback) {
      var shared={'page':page, 'app':app, 'req':{}, } ;
      callback(shared);
     };
     
     page.main= function (shared,route_i) {
      var req=shared.req,res=shared.res,page=shared.page;
      var shared={'page':page, 'app':app, 'req':req, }         
      page.contacts( shared, function (echo) {
       res.writeHead(200, { 'Content-Type': 'text/html'});
       res.end(echo);
      });      
      return true; // accept the route
     }// main
     
 return page; 
} ;

  */