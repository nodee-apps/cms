/*DEFAULT DEPENDENCIES*/
var Model = require('nodee-model'),Document = Model('CmsDocument');
module.exports.controller = function(document, done){
/*CONTROLLER*//*
 * available variables:
 * Model - base model constructor, use Model('MyConstructorName') to get model constructors
 * Document - reference to CmsDocument, same as Model('CmsDocument')
 * document - document model instance, it has all props including content
 * this - controller or parser 
 * data - parsed data, only if parser 
 * done - allways call done([optional error object]), because all controllers and parsers are async
*/

// get root document id, or this document id if it is root
var rootDocId = document.ancestors[0] || document.id;

Document
    .collection()
    
    // find all published descendants with "showInMenu" attribute
    .find({ ancestors:rootDocId, 'attributes.showInMenu':true, published:true })
    
    // get only required fields
    .fields({ url:true, title:true })
    
    // you can cache repeated queries
    //.cache('1m')
    
    // get results
    .all(function(err, menuItems){
        
        // callback error, cms will handle it
        if(err) return done(err);
        
        // fill document model property menuItems
        document.menuItems = menuItems;
        
        // have to execute callback, controllers are async
        done();
});

/*CONTROLLER*/
}
