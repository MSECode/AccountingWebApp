// General
const transactionForm = document.getElementById('addTransaction');
const transactionText = document.getElementById('transText');
const transactionCategory = document.getElementById('transCat');
const transactionAmount = document.getElementById('transAmount');
var balance = document.getElementById('balance');
var ctxExpenses = document.getElementById('expensesChart').getContext('2d');
var ctxIncomes = document.getElementById('incomesChart').getContext('2d');
// Expenses varibales
var expenses = document.getElementById('expenses');
var expensesList = document.getElementById('expensesList');
// Incomes varibales
var incomes = document.getElementById('incomes');
var incomesList = document.getElementById('incomesList');

// Main Part for adding items to lists
var localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

var localStorageExpenses = new Map(JSON.parse(
  localStorage.getItem('expenses'))
);

var localStorageIncomes = new Map(JSON.parse(
  localStorage.getItem('incomes'))
);

var transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

var expensesMap =
  localStorage.getItem('expenses') !== null ? localStorageExpenses : new Map();

var incomesMap = 
  localStorage.getItem('incomes') !== null ? localStorageIncomes : new Map();


// Expenses Chart skeleton
var expensesCategoryArray = [];
var expensesDataArray = [];
var expensesChartData = {
  labels: expensesCategoryArray,
  datasets: [{
    label: 'Expenses Dataset',
    data: expensesDataArray,
    backgroundColor: [
      "#FF6633",
      "#FFB399",
      "#FF33FF",
      "#FFFF99",
      "#00B3E6",
      "#E6B333",
      "#3366E6",
      "#999966",
      "#809980",
      "#E6FF80",
      "#1AFF33",
      "#999933",
      "#FF3380",
      "#CCCC00",
      "#66E64D",
      "#4D80CC"
    ],
    borderColor: 'rgb(255, 255, 255)',
    hoverOffset: 4
  }]
}

// Incomes Chart skeleton
var incomesCategoryArray = [];
var incomesDataArray = [];
var incomesChartData = {
  labels: incomesCategoryArray,
  datasets: [{
    label: 'Expenses Dataset',
    data: incomesDataArray,
    backgroundColor: [
      "#FF6633",
      "#FFB399",
      "#FF33FF",
      "#FFFF99",
      "#00B3E6",
      "#E6B333",
      "#3366E6",
      "#999966",
      "#809980",
      "#E6FF80",
      "#1AFF33",
      "#999933",
      "#FF3380",
      "#CCCC00",
      "#66E64D",
      "#4D80CC"
    ],
    borderColor: 'rgb(255, 255, 255)',
    hoverOffset: 4
  }]
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();
  if (transactionText.value.trim() === '' || transactionCategory.value.trim() === '' || transactionAmount.value.trim() === '') {
    alert('Please add a description, a category and an amount');
  } else {
    const transaction = {
      id: generateID(),
      text: transactionText.value,
      category: transactionCategory.value,
      amount: +transactionAmount.value,
      field: Math.sign(transactionAmount.value) === 1 ? 'incomes' : 'expenses',
      date: Date.now()
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateMaps(transactionCategory.value, transactionAmount.value, transaction.field);

    updateLocalStorage();

    updateChart(transactionCategory.value);

    transactionText.value = '';
    transactionCategory.value = '';
    transactionAmount.value = '';
  }
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        <span>
        ${transaction.text} 
        </span>
        <span>
        ${transaction.category} 
        </span>
        <span>${sign}${Math.abs(
        transaction.amount
        )}</span> <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
        })">x</button>
    `;

    if (transaction.amount < 0 ) {
        expensesList.appendChild(item)
    }
    else {
        incomesList.appendChild(item)
    }
}

// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  console.log(amounts);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `${total}`;
  incomes.innerText = `${income}`;
  expenses.innerText = `${expense}`;
}

function updateMaps(key, value, field) {
  // check the transaction field, thus to update the correct Map
  if (field === 'incomes') {
    // Check if incomes category key already present in the Map
    if (!incomesMap.has(key)) {
      console.log("This is a new income category, adding it to the map...");
      incomesMap.set(key, Math.abs(value));
    }
    else {
      console.log("This income category is already present in the map, updating value of the key");
      console.log("Before updating: " + incomesMap.get(key));
      incomesMap.set(key, incomesMap.get(key) + Math.abs(value));
    }
    console.log("After updating: " + incomesMap.get(key));
  }
  else {
    // Check if expenses category key already present in the Map
    if (!expensesMap.has(key)) {
      console.log("This is a new expenses category, adding it to the map...");
      expensesMap.set(key, Math.abs(value));
    }
    else {
      console.log("This expenses category is already present in the map, updating value of the key");
      console.log("Before updating: " + expensesMap.get(key));
      expensesMap.set(key, expensesMap.get(key) + Math.abs(value));
    }
    console.log("After updating: " + expensesMap.get(key));
  }
}

function updateChart(key) {
  console.log("Updating Charts...");
  if (expensesMap.has(key)) {
    console.log("expensesMap has the new key, adding new data to chart...");
    let value = expensesMap.get(key);
    addNewDataToChart(expensesChart, key, value);
  }
  else if (incomesMap.has(key)) {
    console.log("incomesMap has the new key, adding new data to chart...");
    let value = incomesMap.get(key);
    addNewDataToChart(incomesChart, key, value);
  }
  else {
    alert("Warning: This category does not belong to any Map, strange!");
  }
}


// Remove transaction by ID
function removeTransaction(id) {
  console.log("Id to be removed: " + id)
  let transactionEl = transactions.find(transaction => (transaction.id === id));
  console.log("Transaction Element to be removed: " + JSON.stringify(transactionEl));
  console.log("Category to update: " + transactionEl.category + " with value: " + transactionEl.amount + " for field: " + transactionEl.field);

  removeCategoryData(transactionEl.field, transactionEl.category, transactionEl.amount);

  transactions = transactions.filter(transaction => transaction.id !== id);
  
  clearDataFromChart(expensesChart);
  clearDataFromChart(incomesChart);
  console.log("Length of labels array in the chart: " + expensesChart.data.labels.length);
  console.log("Length of labels array in the chart: " + incomesCategoryArray.length);
  console.log("Length of data array in the chart: " + expensesChart.data.datasets[0].data.length);
  console.log("Length of data array in the chart: " + incomesDataArray.length);

  expensesChart.destroy();
  incomesChart.destroy();
  
  updateLocalStorage();
  init();
}

// Update Category if transaction removed
function removeCategoryData(field, category, removedAmount) {
  try {
    if (field === 'incomes') {
      if (!incomesMap.has(category)) {
        throw("This category should exist, I'm removing a saved datum")
      }
      else {
        incomesMap.set(category, incomesMap.get(category) - Math.abs(removedAmount));
        console.log("Updated category value is: " + incomesMap.get(category));
      }
    }
    else if (field === 'expenses') {
      if (!expensesMap.has(category)) {
        throw("This category should exist, I'm removing a saved datum")
      }
      else {
        expensesMap.set(category, expensesMap.get(category) - Math.abs(removedAmount));
        console.log("Updated category value is: " + expensesMap.get(category));
      }
    }
    else {
      throw("Undefined field found!")
    }
  } catch (e) {
    alert("Error: " + e);
  }
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  localStorage.setItem('expenses', JSON.stringify(Array.from(expensesMap.entries())));
  localStorage.setItem('incomes', JSON.stringify(Array.from(incomesMap.entries())));
}

// Init app
function init() {
  expensesList.innerHTML = '';
  incomesList.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
  intializeCharts();
}

// Chart Functions
//TODO understand how to generate different colors automatically
function intializeCharts() {
  // If categoryMap not empty, initialize the labels
  console.log("Initializing charts...");
  if (expensesMap.size !== 0) {
    console.log("Initializing expenses Chart...");
    let i = 0;
    console.log("Expenses Map not empty, has size, passing data...");
    for (let [key, value] of expensesMap) {
      if (value !== 0) {
        console.log("Category value at key: " + key + " is different from zero, rendering graph...");
        expensesCategoryArray.push(key);
        console.log("After adding key the categoryArray has length: " + expensesCategoryArray.length);
        console.log("Adding new label: " + expensesCategoryArray[i]);
        expensesDataArray.push(value);
        console.log("Adding new data: " + expensesDataArray[i]);

        i++;
      }
    }
  }
  if (incomesMap.size !== 0) {
    console.log("Initializing incomes Chart...");
    let i = 0;
    console.log("Incomes Map not empty, has size, passing data...");
    for (let [key, value] of incomesMap) {
      if (value !== 0) {
        console.log("Category value at key: " + key + " is different from zero, rendering graph...");
        incomesCategoryArray.push(key);
        console.log("After adding key the categoryArray has length: " + incomesCategoryArray.length);
        console.log("Adding new label: " + incomesCategoryArray[i]);
        incomesDataArray.push(value);
        console.log("Adding new data: " + incomesDataArray[i]);

        i++;
      }
    }
  }
  expensesChart = new Chart(ctxExpenses, {type: 'pie', data: expensesChartData, options: {responsive: true}} );
  incomesChart = new Chart(ctxIncomes, {type: 'pie', data: incomesChartData, options: {responsive: true}});
}

// TODO add new color for the new category
function addNewDataToChart(chart, category, amount) {
  if (chart.data.labels.indexOf(category) > -1) {
    let catIndex = chart.data.labels.indexOf(category);
    chart.data.datasets[0].data[catIndex] = amount;
  }
  else {
    chart.data.labels.push(category);
    chart.data.datasets[0].data.push(amount);
  }
  
  chart.update();
}

function removeDataFromChart(chart, label, datum) {
  let labelIndex = chart.data.labels.indexOf(label);
  let dataIndex = chart.data.datasets[0].data.indexOf(datum);
  try {
    if (labelIndex > -1 && dataIndex > -1) {
      chart.data.labels.splice(labelIndex, 1);
      chart.data.datasets[0].data.splice(dataIndex, 1);
    }
    else {
      throw("Your are trying to remove a non existing item");
    }
  }
  catch(e) {
    alert("Error: " + e);
  }

  // chart.data.labels.pop();
  // chart.data.datasets[0].data.pop();
  chart.update();
}

function clearDataFromChart(chart) {
  chart.data.labels.splice(0, chart.data.labels.length);
  chart.data.datasets[0].data.splice(0, chart.data.datasets[0].data.length);
}

init();

transactionForm.addEventListener('submit', addTransaction);