'use strict';

define(function() {
    
    var maxDegree;

    var Node = function() {
        this.size = 0;
        var i;
        this.leaf =  true;
        this.keys = [];
        this.links = [];
        for(i = 0; i < 2*maxDegree-1; i++){
            this.keys[i] = 0;
            this.links[i] = null;
        }
        this.links[i] = null;
    }

    Node.setMaxDegree = function(degree){
        maxDegree = degree;
    }

    return Node;
});