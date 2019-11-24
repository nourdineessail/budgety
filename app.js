
var budgetController = (function () {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    Expense.prototype.calculatePercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    }
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var calculatetotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(element => {
            sum += element.value;
        });
        data.totals[type] = sum;
    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    return {
        addItem: function (type, description, value) {
            var newItem, ID;
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function () {
            calculatetotal('exp');
            calculatetotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },
        deleteItem: function (id, type) {
            var ids = data.allItems[type].map((element) => element.id);
            var index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculatePercentages: function () {
            data.allItems.exp.forEach((element) => {
                element.calculatePercentage(data.totals.inc);
            })
        },
        getPercentages: function () {
            var allpercentage = data.allItems.exp.map((element) => element.getPercentage());
            return allpercentage;
        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
    }
})();

var UIController = (function () {
    var DOMString = {
        inputType: '.add__type',
        inputDesciption: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        persentageLabel: '.budget__expenses--percentage',
        container: '.container',
        monthLabel: '.budget__title--month',
        expensePercentageLabel: '.item__percentage',
        typeOption: '.add__type'
    }
    return {
        getInputs: function () {
            return {
                type: document.querySelector(DOMString.inputType).value,
                description: document.querySelector(DOMString.inputDesciption).value,
                value: Number(document.querySelector(DOMString.inputValue).value)
            }
        },
        addToList: function (obj, type) {
            var html, newHtml, element;

            if (type === 'inc') {
                element = DOMString.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMString.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // replace values in the HTML 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value.toFixed(2));
            // set HTLM to containner 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearField: function () {
            var field = document.querySelectorAll(DOMString.inputDesciption + ', ' + DOMString.inputValue);
            fieldArray = Array.prototype.slice.call(field); //  or u can use Array.from(field); 
            fieldArray.forEach(element => {
                element.value = "";
            });
            fieldArray[0].focus();
        },
        displayBudget: function (obj) {
            var sign;
            obj.budget > 0 ? sign = '+' : sign = '';
            document.querySelector(DOMString.budgetLabel).textContent = sign + parseFloat(obj.budget).toFixed(2);
            document.querySelector(DOMString.incomeLabel).textContent = '+' + parseFloat(obj.totalInc).toFixed(2);
            document.querySelector(DOMString.expenseLabel).textContent = '-' + parseFloat(obj.totalExp).toFixed(2);
            if (obj.percentage >= 0) {
                document.querySelector(DOMString.persentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMString.persentageLabel).textContent = '---';
            }
        },
        deleteItem: function (element) {
            document.getElementById(element).remove();
        },
        displayPercentage: function (percentages) {
            var expensePercentages = document.querySelectorAll(DOMString.expensePercentageLabel);
            Array.from(expensePercentages).forEach((element, index) => {
                if (percentages[index] === -1) {
                    element.textContent = '---';
                } else {
                    element.textContent = percentages[index] + '%';
                }
            })

        },
        displayMonth: function () {
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var now = new Date();
            document.querySelector(DOMString.monthLabel).textContent = months[now.getMonth()];
        },
        changeType: function () {
            this.classList.toggle('red-focus');
            document.querySelector(DOMString.inputDesciption).classList.toggle('red-focus');
            document.querySelector(DOMString.inputValue).classList.toggle('red-focus');
            document.querySelector(DOMString.inputBtn).classList.toggle('red');
        },
        getDOMString: function () {
            return DOMString;
        }
    }
})();

var controller = (function () {

    function setupEventListener() {
        var DOMString = UIController.getDOMString();
        UIController.displayMonth();
        document.querySelector(DOMString.inputBtn).addEventListener('click', addItem);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
        document.querySelector(DOMString.container).addEventListener('click', deleteItem);
        document.querySelector(DOMString.typeOption).addEventListener('change', UIController.changeType)
    }

    function updateBudget() {
        budgetController.calculateBudget();
        var budget = budgetController.getBudget();
        UIController.displayBudget(budget);
    }
    function updatePercentages() {
        budgetController.calculatePercentages();
        var percentages = budgetController.getPercentages();
        UIController.displayPercentage(percentages);
    }
    var addItem = function () {
        // get UI input data
        var input = UIController.getInputs();
        if (input.description && input.value && input.value > 0) {
            // add item values to budget Controller 
            var newItem = budgetController.addItem(input.type, input.description, input.value);
            // add input vlaue to the UI
            UIController.addToList(newItem, input.type);
            // clear field
            UIController.clearField();
            updateBudget();
            updatePercentages();
        }

    }
    var deleteItem = function (event) {
        console.log(event.target);
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            var splitID = itemId.split('-');
            var type = splitID[0];
            var id = parseInt(splitID[1]);
            budgetController.deleteItem(id, type);
            UIController.deleteItem(itemId);
            updateBudget();
            updatePercentages();
        }
    };
    return {
        init: function () {
            setupEventListener();
        }
    }

})();

controller.init();