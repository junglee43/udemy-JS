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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
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
                newItem = new Income(ID, des, val);
            }

            // Push into data structure
            data.allItems[type].push(newItem);

            // Return new element
            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            // Calculate total income and expenses
            calculateTotal('expense');
            calculateTotal('income');

            // Calculate the budget: income - expenses
            data.budget = data.totals.income - data.totals.expense;

            // Calculate the percentage of income that we spent
            // If statement to ensure that we're not dividing by zero
            if(data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            };

        },

        // New method to return budget calculations so that we can pass that
        // to the globa and UI controllers
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpense: data.totals.expense,
                percentage: data.percentage
            };
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;

            // Create HTML string with placeholder text
            if(type === 'income') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'expense') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace the placeholder text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        deleteListItem: function(selectorID) {
            // In JS, you cannot simply delete an item, you can only delete
            // a child of an element
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        // Add a function to expose the DOMstring object to public
        // to enable the Global app controller to use it
        getDOMstrings: function() {
            return DOMstrings;
        },

        // Clears all fields after ENTER, looping over each element of the array
        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // A trick to coerce a list which is what is returned from queryselectorall
            // into an array to be able to use array methods on the object
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array) {
                current.value = '';
            });

            // Sets the browser focus back to the Description field for easy entry
            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMstrings.expensesLable).textContent = obj.totalExpense;

            if(obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
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
        // Set event listener for container object that holds all the income
        // and expence items on the HTML for event delegation using event bubbling
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function() {
        // 1. Calculate the buget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
        console.log(budget);
    };

    var ctrlAddItem = function() {
        // 1. Get the data from input field
        var input, newItem;
        input = UICtrl.getInput();
        // console.log(input);

        // To validate the inputs before creating new data
        if(input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // Testing newItem undefined error
            console.log(newItem);

            // 3. Update the UI with item
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear input fields in the UI
            UICtrl.clearFields();

            // 5. Caluclate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, type, ID;

        // Gets the clicked target items parent
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // console.log(event.target);

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show new budget
            updateBudget();
        }

    };

    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: 0
            });
            setUpEventListeners();
        }
    };
})(budgetController, UIcontroller);

appController.init();
