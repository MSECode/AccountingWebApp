// Expenses const varibales
const expenseForm = document.getElementById('addExpense');
const expenses = document.getElementById('expenses');
const expensesList = document.getElementById('expensesList');
// Incomes const varibales
const incomeForm = document.getElementById('addIncome');
const incomes = document.getElementById('incomes');
const incomesList = document.getElementById('incomesList');
// General
const balance = document.getElementById('balance');

// const dummyTransactions = [
//   { id: 1, text: 'Flower', amount: -20 },
//   { id: 2, text: 'Salary', amount: 300 },
//   { id: 3, text: 'Book', amount: -10 },
//   { id: 4, text: 'Camera', amount: 150 }
// ];


// Fancy Feature Part
// Highlighting mechanism when scrolling
// Show active section when scrolling
const highlightSection = () => {
    const elem = document.querySelector('.highlight');
    const transactionSection = document.querySelector('#transaction-section');
    const expensesSection = document.querySelector('#expenses-section');
    const accountsSection = document.querySelector('#accounts-section');
    let scrollPos = window.scrollY;
    console.log(scrollPos);

    // adds 'highlight' class to my menu items
    if (window.innerWidth > 960 && scrollPos < 60) {
        transactionSection.classList.add('highlight')
        expensesSection.classList.remove('highlight')

        return
    }
    else if( window.innerWidth > 960 && scrollPos < 1360) {
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

    if ((elem && window.innerWidth < 960 && scrollPos < 660) || elem) {
        elem.classList.remove('highlight')
    }
}

window.addEventListener('scroll', highlightSection);
window.addEventListener('click', highlightSection);



// Main Part for adding items to lists
// const localStorageTransactions = JSON.parse(
//   localStorage.getItem('transactions')
// );

// let transactions =
//   localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// // Add transaction
// function addTransaction(e) {
//   e.preventDefault();
//     // If transaction is expense
//     if (expenseText.value.trim() === '' || expenseCategory.value.trim() === '' || expenseAmount.value.trim() === '') {
//     alert('Please add a description, a category and an amount');
//   } else {
//     const transaction = {
//       id: generateID(),
//       text: text.value,
//       category: category.value,
//       amount: +amount.value,
//       field: Math.sign(amount.value) === 1 ? 'incomes' : 'expenses'
//     };

//     transactions.push(transaction);

//     addTransactionDOM(transaction);

//     updateValues();

//     updateLocalStorage();

//     text.value = '';
//     amount.value = '';
//   }
// }

// // Generate random ID
// function generateID() {
//   return Math.floor(Math.random() * 100000000);
// }

// // Add transactions to DOM list
// function addTransactionDOM(transaction) {
//     // Get sign
//     const sign = transaction.amount < 0 ? '-' : '+';

//     const item = document.createElement('li');

//     // Add class based on value
//     item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

//     item.innerHTML = `
//         ${transaction.text} 
//         ${transaction.category} <span>${sign}${Math.abs(
//         transaction.amount
//         )}</span> <button class="delete-btn" onclick="removeTransaction(${
//         transaction.id
//         })">x</button>
//     `;

//     if (transaction.amount < 0 ) {
//         expensesList.appendChild(item)
//     }
//     else {
//         incomesList.appendChild(item)
//     }
// }

// // Update the balance, income and expense
// function updateValues() {
//   const amounts = transactions.map(transaction => transaction.amount);

//   const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

// //   const income = amounts
// //     .filter(item => item > 0)
// //     .reduce((acc, item) => (acc += item), 0)
// //     .toFixed(2);

//   const expense = (
//     amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
//     -1
//   ).toFixed(2);

//   balance.innerText = `${total}`;
// //   money_plus.innerText = `$${income}`;
//   expenses.innerText = `${expense}`;
// }

// // Remove transaction by ID
// function removeTransaction(id) {
//   transactions = transactions.filter(transaction => transaction.id !== id);

//   updateLocalStorage();

//   init();
// }

// // Update local storage transactions
// function updateLocalStorage() {
//   localStorage.setItem('transactions', JSON.stringify(transactions));
// }

// // Init app
// function init() {
//     expensesList.innerHTML = '';
//     incomesList.innerHTML = '';

//   transactions.forEach(addTransactionDOM);
//   updateValues();
// }

// init();

// expenseForm.addEventListener('submit', addTransaction);
// incomeForm.addEventListener('submit', addTransaction);