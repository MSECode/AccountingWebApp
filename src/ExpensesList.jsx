import './ExpensesList.css'
import React from 'react';

function ExpensesList(props) {
    const expensesListItems = props.expenses.map((expense, index) => {
        return (
            // Return the desired HTML for each expense
            <li key={index}
                className={expense.accounted ? 'accpunted' : ''}
                onClick={() => props.onClick(index)}
            >
                {expense.name}
            </li>
        );
    });

    // return the HTML for the component
    // ExpensesListItems will be rendered as li elements
    return (
        <ul>
            { expensesListItems }
        </ul>
    );
}

export default ExpensesList;