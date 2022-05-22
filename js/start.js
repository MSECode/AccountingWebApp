// General
const transactionForm = document.getElementById('addTransaction');
const transactionText = document.getElementById('transText');
const transactionCategory = document.getElementById('transCat');
const transactionAmount = document.getElementById('transAmount');
var balance = document.getElementById('balance');
// Expenses varibales
var expenses = document.getElementById('expenses');
var expensesList = document.getElementById('expensesList');
// Incomes varibales
var incomes = document.getElementById('incomes');
var incomesList = document.getElementById('incomesList');

// Fancy Feature Part
// Highlighting mechanism when scrolling
// Show active section when scrolling
const highlightSection = () => {
    const elem = document.querySelector('.highlight');
    const transactionSection = document.querySelector('#transaction-section');
    const expensesSection = document.querySelector('#expenses-section');
    const accountsSection = document.querySelector('#accounts-section');
    let scrollPos = window.scrollY;
    // console.log(scrollPos);

    // adds 'highlight' class to my menu items
    if (window.innerWidth > 960 && scrollPos < 600) {
        transactionSection.classList.add('highlight')
        expensesSection.classList.remove('highlight')

        return
    }
    else if( window.innerWidth > 960 && scrollPos < 1400) {
        expensesSection.classList.add('highlight')
        transactionSection.classList.remove('highlight')
        accountsSection.classList.remove('highlight')
        return
    }
    else if (window.innerWidth > 960 && scrollPos < 2345) {
        accountsSection.classList.add('highlight')
        expensesSection.classList.remove('highlight')
        return
    }

    if ((elem && window.innerWidth < 960 && scrollPos < 600) || elem) {
        elem.classList.remove('highlight')
    }
}

window.addEventListener('scroll', highlightSection);
window.addEventListener('click', highlightSection);

// Main Part for adding items to lists
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

const localStorageCategories = JSON.parse(
  localStorage.getItem('categories')
);

const transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

const categoryMap =
  localStorage.getItem('categories') !== null ? new Map(localStorageCategories) : new Map();

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
  if (categoryMap.has(key)) {
    let value = categoryMap.get(key);
    addDataToChart(myChart, key, value);
  }
}


// Remove transaction by ID
function removeTransaction(id) {
  console.log("Id to be removed: " + id)
  let transactionEl = transactions.find(transaction => (transaction.id === id));
  console.log("Transaction Element to be removed: " + JSON.stringify(transactionEl));
  console.log("Category to update: " + transactionEl.category + " without value: " + transactionEl.amount);
  removeCategoryData(transactionEl.category, transactionEl.amount);
  transactions = transactions.filter(transaction => transaction.id !== id);
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
      console.log("Update category value is: " + categoryMap.get(category));
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
}

// Chart Part
let labels = [
  'Restaurants',
          'Groceries',
          'Health',
          'Shopping',
          'Transport',
          'Utilities',
          'Entartainment',
          'Services'
];

let data = {
  labels: labels,
          datasets: [{
            label: 'My First dataset',
            data: [0, 10, 5, 2, 20, 30, 45],
            backgroundColor: [
                'rgb(255, 0, 0)',
                'rgb(0, 255, 0)',
                'rgb(0, 0, 255)',
                'rgb(255, 128, 0)',
                'rgb(0, 128, 255)',
                'rgb(255, 0, 128)',
                'rgb(255, 51, 51)',
                'rgb(0, 102, 102)'
            ],
            borderColor: 'rgb(255, 255, 255)',
            hoverOffset: 4
          }]
};
const config = {
  type: 'pie',
  data: data
};

var myChart = new Chart(
  document.getElementById('myChart'),
  config
);

function addDataToChart(chart, category, amount) {
  chart.data.labels.push(category);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(amount);
  });
  chart.update();
}

function removeDataFromChart(myChart) {
  myChart.data.labels.pop();
  myChart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  myChart.update();
}

// function updateConfigByMutating(myChart) {
//   myChart.options.plugins.title.text = 'new title';
//   myChart.update();
// }

// function updateConfigAsNewObject(myChart) {
//   myChart.options = {
//     responsive: true,
//     plugins: {
//       title: {
//         display: true,
//         text: 'Chart.js'
//       }
//     },
//   };
//   myChart.update();
// }

init();

transactionForm.addEventListener('submit', addTransaction);