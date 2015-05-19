'use strict';

function searchHelper(node, key){
    if( node != null ) {
        for( var i = 0; i < node.size; i++ ) {
            var curentKey = node.keys[i];
            // TODO this if need to me removed
            if(curentKey != null){
                if( curentKey == key ){
                    return true;
                } else if( curentKey > key ){
                    // Case when need to go to next level
                    // Check if the Node is leaf then return false
                    if( node.leaf ){
                        return false;
                    } else return searchHelper(node.links[i], key);
                }
            }
        }
        // Recurse for the last link
        return searchHelper(node.links[node.size], key);
    }
    // if we got here then
    else return false;
}


define(['Node'], function(Node) {

    function B_TREE(t) {
        var numberOfNodes = 1, numberOfElements, height = 0, self = this;
        // Static method set t (maxDegree)   
        Node.setMaxDegree(t);
        
        
        this.root = new Node();
        
        /*SEARCH*/
        this.search = function(key){
            if( !searchHelper(self.root, key) ){
                alert("Element Does Not Exist");
                return false;
            } else {
                alert("Element Exist");
                return true;
            }
        }
        /*END SEARCH*/



        /*INSERT*/
        function shiftRightByOne(array, size, startIndexToShift){
            for (var i = size; i > startIndexToShift ; i--){
                array[i] = array[i-1];
            }
        }
        function getIndexToInsert(node, key ){
            var i = 0;
            while ( i < node.size){
                if ( node.keys[i] > key ) {
                    return i;
                }
                i++;
            }
            return  i;
        }
        function goToNextLevel(node, key){
            var flag = false;
            for( var i = 0; i < node.size; i++ ) {
                if( node.keys[i] > key && !flag ) {
                    flag = true;
                    insertHelper(node, node.links[i], key);
                }
            }
            // Case when the next level direction goes from last link of the Node
            if( !flag ){
                insertHelper(node, node.links[node.size], key);
            }
        }
        function split(parent, node){
            var size = node.size;
            var i = 0;
            var newNode = new Node();
            numberOfNodes++;
            if (!node.leaf){
                newNode.leaf = false;
            }
            var midleKey = node.keys[t-1];
            node.keys[t-1] = null;
            node.size--;
            // Copy last half of the elements and appropriate links into the newly created node
            for( ; i < size; i++ ) {
                if( i > t - 1 ) {
                    // Move to new array and remove old key
                    newNode.keys[i-t] = node.keys[i];
                    node.keys[i] = null;
                    // Move to new array and remove old link
                    newNode.links[i-t] = node.links[i];
                    node.links[i] = null;
                    node.size--;
                    newNode.size++;
                }
            }
            // Copy the last link
            newNode.links[i-t] = node.links[i];
            node.links[i] = null;

            // Case when node is a self.root
            if ( parent == null ) {
                self.root = new Node();
                numberOfNodes++;
                self.height++;
                self.root.leaf = false;
                self.root.size = 1;
                self.root.keys[0] = midleKey;
                self.root.links[0] = node;
                self.root.links[1] = newNode;
                return self.root;
            } else {
                // For Keys
                var index = getIndexToInsert(parent, midleKey);
                shiftRightByOne(parent.keys, parent.size, index);
                parent.keys[index] = midleKey;
                // For Links
                shiftRightByOne(parent.links, parent.size+1, index+1);
                parent.links[index+1] = newNode;
                parent.size++;
                return parent;
            }
        }
        function insertHelper(parent, node, key) {
            if( node != null){
                if( node.size < 2*t-1 ){
                    // Case when there is a redundancy (not full)
                    if(node.leaf){
                        // Insert inside the leaf Node
                        var index = getIndexToInsert(node, key);
                        shiftRightByOne(node.keys, node.size, index);
                        node.keys[index] = key;
                        node.size++;
                    } else {
                        // Case current Node is not a leaf
                        goToNextLevel(node, key);
                    }
                } else {
                    // When current node is full
                    node = split(parent, node);
                    goToNextLevel(node, key);
                    //insertHelper(parent,node, key);
                }
            }
        }

        this.insert = function(key){
            if( !searchHelper(self.root, key) ){
                insertHelper(null, self.root, key);
                numberOfElements++;
            } else {
                alert("Sorry, Element with such key already exist");
            }
        }
        /*END INSERT*/


        



    }

    return B_TREE;
});