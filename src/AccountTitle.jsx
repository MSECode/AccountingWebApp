import './AccountTitle.css';
import React from 'react';

function AccountTitle(props) {
    return (
        <section>
            <h2>{ props.title }</h2>
        </section>
    )
};

export default AccountTitle;