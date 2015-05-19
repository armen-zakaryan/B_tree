'use strict';

define(['jquery', 'ko', 'B_TREE', 'bootstrap'], function($, ko, B_TREE) {
    function B_Tree() {
        this.insertValue = ko.observable();
        
        var b_tree = new B_TREE(2);
        //new EventsKoModel(b_tree);
        
        
        b_tree.insert(3);
        b_tree.insert(7);
        b_tree.insert(9);
        
        b_tree.insert(23);
        
        
        
        
        this.degrees = [
            {id: 1,val: 3}, 
            {id: 2,val: 4}, 
            {id: 3,val: 5}
        ];
        
        
        
        function EventsKoModel(data) {
            var self = this;
            self.event = ko.observable();
            self.event.subscribe(function() {
                debugger
                console.log("something changed");
            });
            komapping.fromJS(data, {}, self);
        }
        
        
        
        
        
        
        
        this.selectMaxDegree = function(data, event) {
            return true;
        }
        
        this.add = function() {
            debugger
        }
    }
    
    return new B_Tree();
});
