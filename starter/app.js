var budgetController = (function() {
    var x = 23;
    var add = function(a) {
        return x + a;
    };

    return {
        publicTest: function(b) {
            return (add(b));
        }
    };

})();


var UIcontroller = (function() {
    // Some code here
})();

// Global app controller
var appController = (function(budgetCtrl, UICtrl) {
    var ctrlAddItem = function() {
        // 1. Get the data from input field
        // 2. Add the item to the budgetController
        // 3. Update the UI with item
        // 4. Calculate the budget
        // 5. Display new budget on UI
        console.log('It works.');
    };

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
        if(event.keycode === 13 || event.which === 13) {
            //console.log('ENTER was pressed.');
            ctrlAddItem();
        }
    });
    return {
        anotherPublic: function() {
            console.log(z);
        }
    };
})(budgetController, UIcontroller);
