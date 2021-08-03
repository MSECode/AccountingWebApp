import './index.css'
import React, { useEffect, useState } from 'react';
import AccountTitle from './AccountTitle';
import ExpensesList from './ExpensesList';

function App() {

    const satispayAccount = {
        title: 'Satispay Account',
        expenses : [
            {name: 'intial balance', accounted: false},
            {name: 'coffee', accounted: true}
        ]
    };

    const [ account, setAccount] = useState(satispayAccount);

    const [ accounted, setAccounted] = useState(false);

    function expenseClick(index) {
        const updateAccount = { ... account};
        updateAccount.expenses[index].accounted = !updateAccount.expenses[index].accounted;
    }

    useEffect(() => {
        setAccounted(account.expenses.every(i => i.accounted));
    }, [account]);

    return (
        <article>
            <h1>Accounting Manager</h1>

            <AccountTitle title= {account.title} />

            <ExpensesList expenses= {account.expenses} onClick={ expenseClick} />

            {accounted ? <h2> Accounting done!</h2> : <h2> Not already accounted to the balance</h2>}
        </article>
    )
}

export default App;