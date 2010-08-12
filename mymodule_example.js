console.log('mymodule loaded');
exports.name='test';
exports.date=(new Date).toString();
exports.time=function ()
{
                      //  edit the number to see it working
 return  " test number 17 name: "+exports.name+" , loaded at: "+exports.date.toString();
}
exports.filename=__filename;
