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

var localStorageCategories = new Map(JSON.parse(
  localStorage.getItem('categories'))
);

var transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

var categoryMap =
  localStorage.getItem('categories') !== null ? localStorageCategories : new Map();


// Chart skeleton
var categoryArray = [];
var dataChartArray = [];

var chartData = {
  labels: categoryArray,
  datasets: [{
    label: 'My first dataset',
    data: dataChartArray,
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
      field: Math.sign(transactionAmount.value) === 1 ? 'incomes' : 'expenses'
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updatecategoryMap(transactionCategory.value, transactionAmount.value);

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
        ${transaction.text} 
        ${transaction.category} 
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

function updatecategoryMap(key, value) {
  // Check if category key already present in the Map
  if (!categoryMap.has(key)) {
    console.log("This is a new category, adding it to the map...");
    categoryMap.set(key, Math.abs(value));
  }
  else {
    console.log("This category is already present in the map, updating value of the key");
    console.log("Before updating: " + categoryMap.get(key));
    categoryMap.set(key, categoryMap.get(key) + Math.abs(value));
  }
  console.log("After updating: " + categoryMap.get(key));
}

function updateChart(key) {
  console.log("Updating Chart...");
  if (categoryMap.has(key)) {
    console.log("categoryMap has the new key, adding new data to chart...");
    let value = categoryMap.get(key);
    addNewDataToChart(myChart, key, value);
    addNewDataToChart(incomesChart, key, value);
  }
}


// Remove transaction by ID
function removeTransaction(id) {
  console.log("Id to be removed: " + id)
  let transactionEl = transactions.find(transaction => (transaction.id === id));
  console.log("Transaction Element to be removed: " + JSON.stringify(transactionEl));
  console.log("Category to update: " + transactionEl.category + " with value: " + transactionEl.amount);
  removeCategoryData(transactionEl.category, transactionEl.amount);
  transactions = transactions.filter(transaction => transaction.id !== id);
  
  clearDataFromChart(myChart);
  clearDataFromChart(incomesChart);
  console.log("Length of labels array in the chart: " + myChart.data.labels.length);
  console.log("Length of labels array in the chart: " + categoryArray.length);
  console.log("Length of data array in the chart: " + myChart.data.datasets[0].data.length);
  console.log("Length of data array in the chart: " + dataChartArray.length);

  myChart.destroy();
  incomesChart.destroy();
  
  updateLocalStorage();
  init();
}

// Update Category if transaction removed
function removeCategoryData(category, removedAmount) {
  try {
    if (!categoryMap.has(category)) {
      throw("This category should exist, I'm removing a saved datum")
    }
    else {
      categoryMap.set(category, categoryMap.get(category) - Math.abs(removedAmount));
      console.log("Updated category value is: " + categoryMap.get(category));
    }
  } catch (e) {
    alert("Error: " + e);
  }
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
  localStorage.setItem('categories', JSON.stringify(Array.from(categoryMap.entries())));
}

// Init app
function init() {
  expensesList.innerHTML = '';
  incomesList.innerHTML = '';

  transactions.forEach(addTransactionDOM);
  updateValues();
  intializeChart();
}

// Chart Functions
//TODO understand how to generate different colors automatically
function intializeChart() {
  // If categoryMap not empty, initialize the labels
  console.log("Initializing chart...");
  if (categoryMap.size !== 0) {
    let i = 0;
    console.log("Categories Map not empty, has size, passing data...");
    for (let [key, value] of categoryMap) {
      if (value !== 0) {
        console.log("Category value at key: " + key + " is different from zero, rendering graph...");
        categoryArray.push(key);
        console.log("After adding key the categoryArray has length: " + categoryArray.length);
        console.log("Adding new label: " + categoryArray[i]);
        dataChartArray.push(value);
        console.log("Adding new data: " + dataChartArray[i]);

        i++;
      }
    }
  }
  myChart = new Chart(ctxExpenses, {type: 'pie', data: chartData} );
  incomesChart = new Chart(ctxIncomes, {type: 'pie', data: chartData});
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