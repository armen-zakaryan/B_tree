'use strict';

function searchHelper(node, key) {
    if (node != null) {
        for (var i = 0; i < node.size; i++) {
            var curentKey = node.keys[i];
            // TODO this if need to me removed
            if (curentKey != null) {
                if (curentKey == key) {
                    return true;
                } else if (curentKey > key) {
                    // Case when need to go to next level
                    // Check if the Node is leaf then return false
                    if (node.leaf) {
                        return false;
                    } else
                        return searchHelper(node.links[i], key);
                }
            }
        }
        // Recurse for the last link
        return searchHelper(node.links[node.size], key);
    } 
    // if we got here then
    else
        return false;
}


define(['Node'], function(Node) {
    
    function B_TREE(t) {
        var numberOfNodes = 1, numberOfElements, height = 0, self = this;
        // Static method set t (maxDegree)   
        Node.setMaxDegree(t);
        
        
        this.root = new Node();

        /*SEARCH*/
        this.search = function(key) {
            if (!searchHelper(self.root, key)) {
                alert("Element Does Not Exist");
                return false;
            } else {
                alert("Element Exist");
                return true;
            }
        }
        /*END SEARCH*/



        /*INSERT*/
        function shiftRightByOne(array, size, startIndexToShift) {
            for (var i = size; i > startIndexToShift; i--) {
                array[i] = array[i - 1];
            }
        }
        function getIndexToInsert(node, key) {
            var i = 0;
            while (i < node.size) {
                if (node.keys[i] > key) {
                    return i;
                }
                i++;
            }
            return i;
        }
        function goToNextLevel(node, key) {
            var flag = false;
            for (var i = 0; i < node.size; i++) {
                if (node.keys[i] > key && !flag) {
                    flag = true;
                    insertHelper(node, node.links[i], key);
                }
            }
            // Case when the next level direction goes from last link of the Node
            if (!flag) {
                insertHelper(node, node.links[node.size], key);
            }
        }
        function split(parent, node) {
            var size = node.size;
            var i = 0;
            var newNode = new Node();
            numberOfNodes++;
            if (!node.leaf) {
                newNode.leaf = false;
            }
            var midleKey = node.keys[t - 1];
            node.keys[t - 1] = null;
            node.size--;
            // Copy last half of the elements and appropriate links into the newly created node
            for (; i < size; i++) {
                if (i > t - 1) {
                    // Move to new array and remove old key
                    newNode.keys[i - t] = node.keys[i];
                    node.keys[i] = null;
                    // Move to new array and remove old link
                    newNode.links[i - t] = node.links[i];
                    node.links[i] = null;
                    node.size--;
                    newNode.size++;
                }
            }
            // Copy the last link
            newNode.links[i - t] = node.links[i];
            node.links[i] = null;

            // Case when node is a self.root
            if (parent == null) {
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
                shiftRightByOne(parent.links, parent.size + 1, index + 1);
                parent.links[index + 1] = newNode;
                parent.size++;
                return parent;
            }
        }
        function insertHelper(parent, node, key) {
            if (node != null) {
                if (node.size < 2 * t - 1) {
                    // Case when there is a redundancy (not full)
                    if (node.leaf) {
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
        
        this.insert = function(key) {
            if (!searchHelper(self.root, key)) {
                insertHelper(null, self.root, key);
                numberOfElements++;
            } else {
                alert("Sorry, Element with such key already exist");
            }
        }
        /*END INSERT*/






 /*DELETE*/

    function shiftLeftByOne(array, size, startIndexToShift){
        for (var i = startIndexToShift; i < size-1 ; i++ ){
            array[i] = array[i+1];
        }
        array[size-1] = null;
    }
    function getNodeFromLeftSibling(parent, index){
        var node = parent.links[index];
        var sibling = parent.links[index - 1];

        shiftRightByOne(node.keys, node.size, 0);
        shiftRightByOne(node.links, node.size+1, 0);
        node.size++;
        node.keys[0] = parent.keys[index - 1];
        node.links[0] = sibling.links[sibling.size];

        parent.keys[index - 1] = sibling.keys[sibling.size - 1];

        sibling.keys[sibling.size - 1] = null;
        sibling.links[sibling.size] = null;
        sibling.size--;
    }
    function getNodeFromRightSibling(parent, index){
        var node = parent.links[index];
        var sibling = parent.links[index + 1];

        node.keys[node.size] = parent.keys[index];
        node.links[node.size + 1] = sibling.links[0];
        node.size++;
        parent.keys[index] = sibling.keys[0];
        // left shift the sibling by one
        shiftLeftByOne(sibling.keys, sibling.size, 0);
        shiftLeftByOne(sibling.links, sibling.size+1, 0);
        sibling.size--;
    }
    function join(parent, parentIndex){
        var left =  parent.links[parentIndex];
        var right = parent.links[parentIndex + 1];
        var parentKey = parent.keys[parentIndex];

        // Parent Modifications
        shiftLeftByOne(parent.keys, parent.size, parentIndex);
        shiftLeftByOne(parent.links, parent.size + 1, parentIndex+1);
        parent.size--;

        // Children modifications. Both child has the same length t-1
        left.keys[t-1] = parentKey;
        for ( var i = t; i < 2*t-1; i++ ){
            left.keys[i] = right.keys[i-t];
            left.links[i] = right.links[i-t];
        }
        left.links[2*t-1] = right.links[t-1];
        left.size = 2*t-1;
        return left;
    }
    function removeFromLeaf(node, key){
        //TODO
        for(var i = 0; i < node.size; i++){
            if(node.keys[i] == key){
                var predKey = node.keys[i];
                shiftLeftByOne(node.keys, node.size, i);
                node.size--;
                return predKey;
            }
        }
        return 0;
    }
    function getPredecessor(node){
        if (node.leaf){
            var predKey = node.keys[node.size - 1];
            node.keys[node.size - 1] = null;
            node.size--;
            return predKey;
        } else {
            var lastChildNode = node.links[node.size];
            if(lastChildNode.size >= t ){
                return getPredecessor(lastChildNode);
            } else if(node.links[node.size - 1].size >= t) {
                // When not enougth elements in the last child And more elements in prev of the last child
                getNodeFromLeftSibling(node, node.size);
                return getPredecessor(lastChildNode);
            } else {
                // join // When not enougth elements both children
                node = join(node, node.size -1);
                return getPredecessor(node);
            }
        }
    }
    function getSuccessor(node){
        if (node.leaf){
            var predKey = node.keys[0];
            shiftLeftByOne(node.keys, node.size, 0);
            node.size--;
            return predKey;
        } else {
            var firstChildNode = node.links[0];
            if(firstChildNode.size >= t ){
                return getPredecessor(firstChildNode);
            } else if(node.links[0].size >= t){
                // When not enougth elements in the first child, but enough in it's sibling
                getNodeFromRightSibling(node, 0);
                return getPredecessor(firstChildNode);
            } else {
                // join // When not enougth elements both children
                node = join(node, 0);
                return getPredecessor(node);
            }
        }
    }
    function deleteHelper(node, key) {
        // If leaf delete. If we got here, then we are sure that the size of the node either >=t or the node is the root
        if (node.leaf) {
            removeFromLeaf(node, key);
            return true;
        } else {
            for (var i = 0; i < node.size; i++) {
                if (node.keys[i] >= key) {
                    // Founded
                    if (node.links[i].size >= t) {
                        if (node.keys[i] == key) {
                            node.keys[i] = getPredecessor(node.links[i]);
                        } else {
                            deleteHelper(node.links[i], key);
                        }
                    } else {
                        // Need join or get node from either sibling
                        if (node.links[i + 1].size >= t) {
                            if (node.keys[i] == key) {
                                node.keys[i] = getSuccessor(node.links[i + 1]);
                            } else {
                                // get node from right sibling
                                getNodeFromRightSibling(node, i);
                                deleteHelper(node.links[i], key);
                            }
                        } else if (i > 0 && node.links[i - 1].size >= t) {
                            // get node from left sibling
                            getNodeFromLeftSibling(node, i);
                            if (node.keys[i] == key) {
                                node.keys[i] = getPredecessor(node.links[i]);
                            } else {
                                deleteHelper(node.links[i], key);
                            }
                        } else {
                            // Join // here, the value goes to the next row thus we call deleteHelper()
                            node = join(node, i);
                            deleteHelper(node, key);
                        }
                    }
                    return true;
                }
                // Continue Loop
            }
            // if code gets here, it means that the if condition in the for loop has not been true for all elements
            if (node.links[node.size].size >= t) {
                deleteHelper(node.links[node.size], key);
            } else {
                // Need join or get node from either sibling
                if (node.links[node.size - 1] && node.links[node.size - 1].size >= t) {
                    getNodeFromLeftSibling(node, node.size);
                    deleteHelper(node.links[node.size], key);
                } else {
                    // join
                    node = join(node, node.size - 1);
                    deleteHelper(node, key);
                }
            }
            return true;
        }
    }


    this.delete = function(key){
        if( searchHelper(self.root, key) ){
            deleteHelper(self.root, key);
        } else {
            alert("Sorry, Element with such key does not exist");
        }
    }
    /*END DELETE*/

















        /*format data for UI*/
        this.format = function(b_tree) {
            var maxHeight = {count:0};
            function recurse(prev) {
                var nextLevelNodes = [];
                
                for (var i = 0; i < prev.nodes.length; i++) {
                    var curentNode = prev.nodes[i];
                    if(curentNode){
                        for (var j = 0; j <= curentNode.size; j++) {
                            nextLevelNodes.push(curentNode.links[j]);
                        }
                    }
                    nextLevelNodes.push(null);
                }
                
                maxHeight.count = prev.level + 1;
                prev.next = {
                    level: maxHeight.count,
                    maxHeight: maxHeight,
                    nodes: nextLevelNodes,
                    next: null
                };

                // if get to the leaf then stop otherwise call the recursion again    
                if (nextLevelNodes[0] && !nextLevelNodes[0].leaf) {
                    recurse(prev.next);
                }
            
            }
            var formatedData = {
                level: 0,
                maxHeight: maxHeight,
                nodes: [b_tree.root],
                next: null
            }

            recurse(formatedData);

            formatedData.maxHeight = maxHeight;
            return formatedData; 
        
        }
        /*END format data for UI*/

    }
    
    return B_TREE;
});
