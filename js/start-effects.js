const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');

// Display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
}

menu.addEventListener('click', mobileMenu);

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

// Close mobile menu when clicking on a menu item
const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active');
    if (window.innerWidth <= 960 && menuBars) {
        menu.classList.toggle('is-active');
        menuLinks.classList.remove('active');
    }
}

menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);
