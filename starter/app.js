var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            // Create new ID based on last element number
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on type
            if(type === 'expense') {
                newItem = new Expense(ID, des, val);
            } else if(type === 'income') {
                newItem = new Expense(ID, des, val);
            }
            // Push into data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        testing: function() {
            console.log(data);
        }
    };

})();

var UIcontroller = (function() {
    // Create an object that holds all the class strings used by the controllers
    // to encapulate the references in one place
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description:  document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        // Add a function to expose the DOMstring object to public
        // to enable the Global app controller to use it
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
})();

// Global app controller
var appController = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if(event.keycode === 13 || event.which === 13) {
                //console.log('ENTER was pressed.');
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function() {
        // 1. Get the data from input field
        var input, newItem;
        input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the budgetController
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Update the UI with item
        // 4. Calculate the budget
        // 5. Display new budget on UI
        console.log('It works.');
    };

    return {
        init: function() {
            console.log('Application has started.');
            setUpEventListeners();
        }
    };
})(budgetController, UIcontroller);

appController.init();
