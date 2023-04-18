const allUserInputs = document.querySelectorAll('input');
const displayTip = document.querySelector('.display-tip');
const displayTotal = document.querySelector('.display-total');
const userBasicValues = document.querySelectorAll('.user-input');
const customDiscount = document.querySelector('[placeholder = Custom]');
const errorMessageWrapper = document.querySelector('.error-message-wrapper');
const resetBtn = document.querySelector('.reset-btn');

const errorMessage = document.createElement('span');
errorMessage.style.color = "red";
errorMessage.style.fontSize = "0.6em";
errorMessage.textContent = "Can't be zero";

let userData = {};

const getData = (e) => {
    const target = e.target;
    if (target.name) {
        userData = { ...userData, [target.name]: target.value }
    }
    else {
        target.classList.add('selected');
        userData = { ...userData, discount: target.value.includes('%') ? target.value : target.value + '%' };
        const selections = document.querySelectorAll('.selected');
        removeSelectedDiscountTabs(selections, target, customDiscount);
    }
    if (target.placeholder === 'Custom') {
        if (target.value === '' && target.value !== '%') return;
        userData = { ...userData, discount: target.value + '%' };
    }
    if (Object.values(userData).filter(el => el !== '').length > 2) {
        console.log(userData);
        calculateTip(userData);
    }
}

const calculateTip = (obj) => {
    const { billValue, discount, splitNumber } = obj;
    const discountNumber = discount.slice(0, -1) / 100;
    const tipValue = discountNumber * billValue / splitNumber;
    displayTip.textContent = `$${tipValue.toFixed(2)}`;
    displayTotal.textContent = `$${(billValue / splitNumber + tipValue).toFixed(2)}`;
    resetBtn.removeAttribute('disabled');
}

const removeSelectedDiscountTabs = (items, element, target) => {
    if (items.length > 1) {
        items.forEach(item => {
            if (item.value !== element.value) {
                item.classList.remove('selected');
                target.value = '';
            }
        });
    }
}

userBasicValues.forEach((el) => el.addEventListener('focus', () => el.value = ''));
resetBtn.addEventListener('click', () => {
    displayTip.textContent = displayTotal.textContent = '$0.00';
    userData = {};
    userBasicValues.forEach((el) => {
        el.value = '';
    })
    allUserInputs.forEach((el) => {
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
        }
    })
})
allUserInputs.forEach(element => {
    element.addEventListener('click', getData);
    element.addEventListener('input', getData);
    element.addEventListener('input', (e) => {
        if (e.target.name === 'splitNumber') {
            const target = e.target;
            if (+target.value === 0) {
                target.style.borderColor = "red";
                errorMessageWrapper.appendChild(errorMessage);
            }
            else {
                target.style.borderColor = "transparent";
                errorMessageWrapper.removeChild(errorMessage);
            }
        }
    })
});