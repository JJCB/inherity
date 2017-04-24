/*
inherity
@class Events
@author Jhon Castro
 */

/*
 * Module dependencies.
 */

const util            = require("./util"),
      config          = require("./config"),
      dependencies    = require("./dependencies");

/*
 * Expose library.
 */

Events = function(opts){
  this.event = opts.event;
  this.method = opts.changed;
  this.init();
  //this.setEventsChunk();  
} 

Events.prototype.init = function(){
	
}