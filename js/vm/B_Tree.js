'use strict';

define(['jquery', 'ko', 'B_TREE', 'bootstrap'], function($, ko, B_TREE) {
    function B_Tree() {
        var self = this;
        var b_tree;
        
        this.insertValue = ko.observable();
        
        //var b_tree = new B_TREE(2);
        
        this.istreeExist = ko.observable(false);
        this.degree = ko.observable();
        this.tree = ko.observable();


        this.makeTree = function(){
            var value = self.degree();
            if(!isNaN(value)){
                b_tree = new B_TREE(value);
                self.istreeExist(true);
            } else {
                alert("Please insert a number");
            }
        }

/*        
        b_tree.insert(3);
        b_tree.insert(7);
        b_tree.insert(9);
        
        b_tree.insert(23);
        
        b_tree.insert(45);
        b_tree.insert(1);
        b_tree.insert(5);
        b_tree.insert(14);
        b_tree.insert(25);
        b_tree.insert(24);
        b_tree.insert(13);
        b_tree.insert(11);
        b_tree.insert(8);
        b_tree.insert(19);
        b_tree.insert(4);
        b_tree.insert(31);
        b_tree.insert(35);
        b_tree.insert(56);
        b_tree.insert(8);
        b_tree.insert(10);

        b_tree.delete(56);
        b_tree.delete(31);
*/


        //this.tree = ko.observable(b_tree.format(b_tree));
        
        
        /*
        this.degrees = [
            {id: 1,val: 3}, 
            {id: 2,val: 4}, 
            {id: 3,val: 5}
        ];*/

        
        
        
        
        
        
        this.selectMaxDegree = function(data, event) {
            return true;
        }
        
        this.insertedValue = ko.observable();
        this.deletedValue = ko.observable();

        this.insert = function() {
            var value = self.insertedValue();
            if(!isNaN(value)){
                b_tree.insert(value);
                self.tree(b_tree.format(b_tree));
                self.insertedValue('');   
            } else {
                alert("Please insert a number");
            }
        }

        
        this.remove = function(dd) {
            var value = self.deletedValue();
            if(!isNaN(value)){
                b_tree.delete(value);
                self.tree(b_tree.format(b_tree));   
            } else {
                alert("Please insert a number");
            }
        }
    }
    
    return new B_Tree();
});
