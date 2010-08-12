//
// node.js auto reload module
//         by Shimon Doodkin.
// license: 2 close BSD.
//

var path = require('path');
var fs = require('fs');
var loadmoduletimer={};
var trackedfiles={}; exports.trackedfiles=trackedfiles;
this.path=__dirname;
// note: there is an upcomming version of node 
// with auto reload modules probably it will be integrated in the near future.
//
// also every time you reload a module it does not free the memory of the reviews module.
// it means that reloading modules sutes fine for development,
// but do not relay on havy use of it for production.

function loadlater( filename , callback )
{
 console.log((new Date).toString()+' will load file: '+filename);
 
 return setTimeout(function ()
 {
  console.log((new Date).toString()+' loading file: '+filename);
  fs.readFile(filename, function (err, content)
  {
   if (err) throw err; // need to add better error handling
   try
   {
    var dirname = path.dirname(filename);
    // create wrapper function
    var wrapper = "(function (exports, require, module, __filename, __dirname) { "
                + content
                + "\n});";
    var compiledWrapper = process.compile(wrapper, filename);
    var newmodule={}; 
    compiledWrapper.apply(newmodule, [newmodule, require, newmodule, filename, dirname]);

    callback(newmodule);
   }
   catch(err)
   {
    if (err) 
    {
     console.log(err.message);
     console.log(err.stack);
    }
    //if (err) throw err; // need to add better error handling
   }
  });
 }, 500); // sometimes i had a situation when the watchFile callback called while uploading the file and resulted in error. 
} exports.loadlater=loadlater;


function watch()
{
 var watchfilename,filename,callback;
 if(arguments.length==3)
 {
  watchfilename=arguments[0];
  filename=arguments[1];
  callback=arguments[2];
 }
 else
 {
  watchfilename=arguments[0];
  filename=arguments[0];
  callback=arguments[1];
 }
 if(typeof watchfilename=='string') watchfilename=[watchfilename];
 
 console.log((new Date).toString()+' watch reaload file: '+filename);
 trackedfiles[filename]=true;
 var functionload=function()
 {
  if(loadmoduletimer[filename])
  {
   console.log((new Date).toString()+'timeout cleaned - will load file: '+filename);
   clearTimeout(loadmoduletimer[filename]);
  }
  loadmoduletimer[filename] = 
  loadlater( filename ,callback);
 }; 
 for(var i=0;i<watchfilename.length;i++)
  fs.watchFile(watchfilename[i], functionload);
};exports.watch=watch;


// there is no way to update all references of an object. 
// for example: y={who:'old'};x=y;z=y; 
// if i change y={who:'new'}, then x and z still hold the old object...
//
// if you spread referencers(pointers) every where, 
// so you can't do in-place update of an objects because objects are pointers.
// and you can't have a pointer that points to pointer unless it is a property inside an object
// and you actualy replacing a property of a referenced object.
//
// so i replace all the properties and delete the unused ones...
//
    
    function copy(target,newobject) // replace and delete
    {
     if(newobject.constructor) target.constructor=newobject.constructor; // is this works?
     if(newobject.__proto__) target.__proto__=newobject.__proto__; // is this works?
     if(newobject.prototype) target.prototype=newobject.prototype; // is this works?
     
     //replace
     for(var i in newobject)
     {
      if(newobject.hasOwnProperty(i))
       target[i]=newobject[i];
     }
     //delete
     for(var i in target)
     {
      if(target.hasOwnProperty(i) && (!(i in newobject)) )  delete target[i];
     }
    };exports.copy=copy;
    
    function copy2(target,newobject) // replace and delete
    {
     if(newobject.constructor) target.constructor=newobject.constructor; // is this works?
     if(newobject.__proto__) target.__proto__=newobject.__proto__; // is this works?
     if(newobject.prototype) target.prototype=newobject.prototype; // is this works?
     
     //replace
     var name,desc,
     target_names=Object.getOwnPropertyNames(target_names),
     newobject_names=Object.getOwnPropertyNames(newobject);
     
     for(var i in newobject_names)
     {
      name=names[i];
      if(name in target_names)
      {
       Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(newobject,name) )
      }
     }


     for(var i in target_names)
     {
      name=names[i];
      if((name in target_names) && (!(name in newobject_names)))
      {
       delete target[name];
      }
     }
    };exports.copy2=copy2;
    
    function copy3(mirror,goal)
    {
     var proto = mirror.__proto__ = Object.getPrototypeOf(goal);
     Object.getOwnPropertyNames(mirror).forEach(function(propertyName){
       if(!Object.hasOwnProperty(goal,propertyName)) return;
       delete mirror[propertyName];
     });
     Object.getOwnPropertyNames(goal).forEach(function(propertyName){
       if(!Object.hasOwnProperty(goal,propertyName))return;
        Object.defineProperty(mirror,propertyName,Object.getOwnPropertyDescriptor(goal,propertyName));
     })
     return mirror
     // Object.seal/Object.freeze on the mirror will result in it not being able to copy on it correctl
     // and various other Object.defineProperty combos will stop that model from working
    };exports.copy3=copy3;

function watchrel()
{
 var watchfilename,filename,callback;
 if(arguments.length==3)
 {
  watchfilename=arguments[0];
  filename=arguments[1];
  callback=arguments[2];
 }
 else
 {
  watchfilename=arguments[0];
  filename=arguments[0];
  callback=arguments[1];
 }
 for(var i=0;i<watchfilename.length;i++)
  watchfilename[i]=this.path+'/'+watchfilename[i]; 
 watch(watchfilename,filename,callback);
}; 
exports.watchrel=watchrel;



function calllater( filename , callback )
{
 console.log((new Date).toString()+' will call file: '+filename);
 return setTimeout(function ()
 {
  console.log((new Date).toString()+' calling file: '+filename);
  callback(filename);
 }, 500); // sometimes i had a situation when the watchFile callback called while uploading the file and resulted in error. 
} exports.calllater=calllater;

function watchonly()
{
 var watchfilename,filename,callback;
 if(arguments.length==3)
 {
  watchfilename=arguments[0];
  filename=arguments[1];
  callback=arguments[2];
 }
 else
 {
  watchfilename=arguments[0];
  filename=arguments[0];
  callback=arguments[1];
 }
 if(typeof watchfilename=='string') watchfilename=[watchfilename];

 console.log((new Date).toString()+' watch only file: '+filename);
 trackedfiles[filename]=true;
 var callfunction=function ()
 {
  if(loadmoduletimer[filename])
  {
   console.log((new Date).toString()+'timeout cleaned - will load file: '+filename);
   clearTimeout(loadmoduletimer[filename]);
  }
  loadmoduletimer[filename] = 
  calllater( filename ,callback);
 };
 for(var i=0;i<watchfilename.length;i++)
  fs.watchFile(watchfilename[i], callfunction);
};exports.watchonly=watchonly;