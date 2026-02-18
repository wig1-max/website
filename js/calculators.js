// ============================================================
// CALCULATORS.JS — All 9 Financial Calculator Implementations
// WhatsApp: +917986772124 | wa.me/917986772124
// ============================================================

// -----------------------------------------------------------
// UTILITY FUNCTIONS
// -----------------------------------------------------------

/**
 * Format a number as Indian currency: ₹1,23,456
 */
function formatIndianCurrency(num) {
    if (num === undefined || num === null || isNaN(num)) return '₹0';
    num = Math.round(num * 100) / 100;
    var isNegative = num < 0;
    num = Math.abs(num);
    var parts = num.toFixed(2).split('.');
    var intPart = parts[0];
    var decPart = parts[1];
    // Indian grouping: last 3 digits, then groups of 2
    var lastThree = intPart.substring(intPart.length - 3);
    var otherNumbers = intPart.substring(0, intPart.length - 3);
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    var formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
    // Remove .00 for whole numbers
    if (decPart === '00') {
        return (isNegative ? '-' : '') + '\u20B9' + formatted;
    }
    return (isNegative ? '-' : '') + '\u20B9' + formatted + '.' + decPart;
}

/**
 * Open WhatsApp with a pre-filled message via wa.me link
 */
function shareOnWhatsApp(message) {
    var encodedMessage = encodeURIComponent(message);
    var url = 'https://wa.me/917986772124?text=' + encodedMessage;
    window.open(url, '_blank');
}

/**
 * Print results for a specific element
 */
function printResults(elementId) {
    var element = document.getElementById(elementId);
    if (!element) return;
    var printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Calculator Results</title>');
    printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;text-align:right;} th{background:#f4f4f4;} .text-green{color:green;} .text-red{color:red;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(element.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// -----------------------------------------------------------
// HELPER: get numeric value from input, return NaN if empty
// -----------------------------------------------------------
function getInputValue(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var val = parseFloat(el.value);
    return val;
}

function getSelectValue(id) {
    var el = document.getElementById(id);
    if (!el) return '';
    return el.value;
}

function getCheckboxValue(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    return el.checked;
}

function showResult(id) {
    var el = document.getElementById(id);
    if (el) {
        el.classList.remove('hidden');
        el.style.display = '';
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function setTextContent(id, value) {
    var el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

function setInnerHTML(id, value) {
    var el = document.getElementById(id);
    if (el) {
        el.innerHTML = value;
    }
}

function triggerPopup(name) {
    if (typeof window.triggerCalculatorPopup === 'function') {
        window.triggerCalculatorPopup(name);
    }
}


// ============================================================
// CALCULATOR 1: HRA Exemption Calculator
// ============================================================
function calculateHRA() {
    var basicSalary = getInputValue('basicSalary');
    var daReceived = getInputValue('daReceived');
    var hraReceived = getInputValue('hraReceived');
    var rentPaid = getInputValue('rentPaid');
    var isMetro = getCheckboxValue('isMetro');

    // Validate
    if (isNaN(basicSalary) || basicSalary <= 0) {
        alert('Please enter a valid Basic Salary.');
        return;
    }
    if (isNaN(daReceived)) daReceived = 0;
    if (isNaN(hraReceived) || hraReceived <= 0) {
        alert('Please enter a valid HRA Received amount.');
        return;
    }
    if (isNaN(rentPaid) || rentPaid <= 0) {
        alert('Please enter a valid Rent Paid amount.');
        return;
    }

    var basicPlusDA = basicSalary + daReceived;

    // Three components for HRA exemption
    var component1 = hraReceived; // Actual HRA received
    var component2 = isMetro ? 0.50 * basicPlusDA : 0.40 * basicPlusDA; // 50% metro / 40% non-metro
    var component3 = rentPaid - (0.10 * basicPlusDA); // Rent paid - 10% of (Basic+DA)
    if (component3 < 0) component3 = 0;

    var hraExemption = Math.min(component1, component2, component3);
    var taxableHRA = hraReceived - hraExemption;
    var totalHRA = hraReceived;

    // Display results
    setTextContent('hraExemption', formatIndianCurrency(hraExemption));
    setTextContent('taxableHRA', formatIndianCurrency(taxableHRA));
    setTextContent('totalHRA', formatIndianCurrency(totalHRA));
    setTextContent('component1', formatIndianCurrency(component1));
    setTextContent('component2', formatIndianCurrency(component2));
    setTextContent('component3', formatIndianCurrency(component3));

    showResult('hraResult');
    triggerPopup('HRA Calculator');
}


// ============================================================
// CALCULATOR 2: Income Tax Calculator (Old vs New Regime)
// ============================================================
function calculateIncomeTax() {
    var totalIncome = getInputValue('totalIncome');
    var ageCategory = getSelectValue('ageCategory');
    var deduction80C = getInputValue('deduction80C');
    var deduction80D = getInputValue('deduction80D');
    var deductionHRA = getInputValue('deductionHRA');
    var homeLoanInterest = getInputValue('homeLoanInterest');
    var otherDeductions = getInputValue('otherDeductions');

    // Validate
    if (isNaN(totalIncome) || totalIncome <= 0) {
        alert('Please enter a valid Total Income.');
        return;
    }
    if (!ageCategory) ageCategory = 'below60';
    if (isNaN(deduction80C)) deduction80C = 0;
    if (isNaN(deduction80D)) deduction80D = 0;
    if (isNaN(deductionHRA)) deductionHRA = 0;
    if (isNaN(homeLoanInterest)) homeLoanInterest = 0;
    if (isNaN(otherDeductions)) otherDeductions = 0;

    // Cap 80C at 1.5L
    if (deduction80C > 150000) deduction80C = 150000;

    // ---- OLD REGIME (FY 2024-25) ----
    var oldStandardDeduction = 50000;
    var exemptionLimit;
    if (ageCategory === 'above80') {
        exemptionLimit = 500000;
    } else if (ageCategory === '60to80') {
        exemptionLimit = 300000;
    } else {
        exemptionLimit = 250000;
    }

    var totalOldDeductions = oldStandardDeduction + deduction80C + deduction80D + deductionHRA + homeLoanInterest + otherDeductions;
    var oldTaxableIncome = totalIncome - totalOldDeductions;
    if (oldTaxableIncome < 0) oldTaxableIncome = 0;

    // Old regime slabs
    var oldTax = 0;
    var remaining = oldTaxableIncome;

    if (remaining > exemptionLimit) {
        // 0 to exemption: 0%
        remaining -= exemptionLimit;

        // exemption to 500000: 5%
        var slab1Limit = 500000 - exemptionLimit;
        if (slab1Limit > 0) {
            var slab1 = Math.min(remaining, slab1Limit);
            oldTax += slab1 * 0.05;
            remaining -= slab1;
        }

        // 500001 to 1000000: 20%
        if (remaining > 0) {
            var slab2 = Math.min(remaining, 500000);
            oldTax += slab2 * 0.20;
            remaining -= slab2;
        }

        // Above 1000000: 30%
        if (remaining > 0) {
            oldTax += remaining * 0.30;
        }
    }

    // Rebate 87A for old regime: if taxable income <= 5L, rebate up to 12500
    var oldRebate = 0;
    if (oldTaxableIncome <= 500000) {
        oldRebate = Math.min(oldTax, 12500);
    }
    oldTax -= oldRebate;
    if (oldTax < 0) oldTax = 0;

    // Cess 4%
    var oldCess = oldTax * 0.04;
    var oldTotalTax = oldTax + oldCess;

    // ---- NEW REGIME (FY 2024-25) ----
    var newStandardDeduction = 75000;
    var newTaxableIncome = totalIncome - newStandardDeduction;
    if (newTaxableIncome < 0) newTaxableIncome = 0;

    // New regime slabs
    var newTax = 0;
    var rem = newTaxableIncome;

    // 0 - 300000: 0%
    var newSlab0 = Math.min(rem, 300000);
    rem -= newSlab0;

    // 300001 - 700000: 5%
    if (rem > 0) {
        var newSlab1 = Math.min(rem, 400000);
        newTax += newSlab1 * 0.05;
        rem -= newSlab1;
    }

    // 700001 - 1000000: 10%
    if (rem > 0) {
        var newSlab2 = Math.min(rem, 300000);
        newTax += newSlab2 * 0.10;
        rem -= newSlab2;
    }

    // 1000001 - 1200000: 15%
    if (rem > 0) {
        var newSlab3 = Math.min(rem, 200000);
        newTax += newSlab3 * 0.15;
        rem -= newSlab3;
    }

    // 1200001 - 1500000: 20%
    if (rem > 0) {
        var newSlab4 = Math.min(rem, 300000);
        newTax += newSlab4 * 0.20;
        rem -= newSlab4;
    }

    // Above 1500000: 30%
    if (rem > 0) {
        newTax += rem * 0.30;
    }

    // Rebate 87A for new regime: if taxable income <= 7L, full rebate
    var newRebate = 0;
    if (newTaxableIncome <= 700000) {
        newRebate = newTax;
    }
    newTax -= newRebate;
    if (newTax < 0) newTax = 0;

    // Cess 4%
    var newCess = newTax * 0.04;
    var newTotalTax = newTax + newCess;

    // Tax savings
    var taxSavings = Math.abs(oldTotalTax - newTotalTax);

    // Display results
    setTextContent('oldTaxableIncome', formatIndianCurrency(oldTaxableIncome));
    setTextContent('oldTaxAmount', formatIndianCurrency(oldTotalTax));
    setTextContent('newTaxableIncome', formatIndianCurrency(newTaxableIncome));
    setTextContent('newTaxAmount', formatIndianCurrency(newTotalTax));
    setTextContent('taxSavings', formatIndianCurrency(taxSavings));

    // Add .recommended class to the better regime card
    var oldCard = document.getElementById('oldRegimeCard');
    var newCard = document.getElementById('newRegimeCard');
    var savingBadge = document.getElementById('savingBadge');

    if (oldCard) oldCard.classList.remove('recommended');
    if (newCard) newCard.classList.remove('recommended');

    if (oldTotalTax <= newTotalTax) {
        if (oldCard) oldCard.classList.add('recommended');
        if (savingBadge) {
            savingBadge.textContent = 'Old Regime saves you ' + formatIndianCurrency(taxSavings);
            savingBadge.style.display = '';
        }
    } else {
        if (newCard) newCard.classList.add('recommended');
        if (savingBadge) {
            savingBadge.textContent = 'New Regime saves you ' + formatIndianCurrency(taxSavings);
            savingBadge.style.display = '';
        }
    }

    showResult('taxResult');
    triggerPopup('Income Tax Calculator');
}


// ============================================================
// CALCULATOR 3: Home Loan Eligibility Calculator
// ============================================================
function calculateHomeLoan() {
    var loanAmount = getInputValue('homeLoanAmount');
    var annualRate = getInputValue('homeLoanRate');
    var tenureYears = getInputValue('homeLoanTenure');
    var monthlyIncome = getInputValue('monthlyIncome');

    // Validate
    if (isNaN(loanAmount) || loanAmount <= 0) {
        alert('Please enter a valid Home Loan Amount.');
        return;
    }
    if (isNaN(annualRate) || annualRate <= 0) {
        alert('Please enter a valid Interest Rate.');
        return;
    }
    if (isNaN(tenureYears) || tenureYears <= 0) {
        alert('Please enter a valid Loan Tenure.');
        return;
    }
    if (isNaN(monthlyIncome) || monthlyIncome <= 0) {
        alert('Please enter a valid Monthly Income.');
        return;
    }

    var r = annualRate / 12 / 100; // monthly interest rate
    var n = tenureYears * 12;       // total months

    // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    var emi;
    if (r === 0) {
        emi = loanAmount / n;
    } else {
        var pow = Math.pow(1 + r, n);
        emi = loanAmount * r * pow / (pow - 1);
    }

    var totalPayment = emi * n;
    var totalInterest = totalPayment - loanAmount;

    // Max eligible loan: where EMI = 50% of monthly income
    var maxEMI = monthlyIncome * 0.50;
    var maxEligible;
    if (r === 0) {
        maxEligible = maxEMI * n;
    } else {
        var pow2 = Math.pow(1 + r, n);
        maxEligible = maxEMI * (pow2 - 1) / (r * pow2);
    }

    // Display results
    setTextContent('hlEmi', formatIndianCurrency(emi));
    setTextContent('hlTotalInterest', formatIndianCurrency(totalInterest));
    setTextContent('hlTotalPayment', formatIndianCurrency(totalPayment));
    setTextContent('hlEligibility', formatIndianCurrency(maxEligible));

    showResult('homeLoanResult');
    triggerPopup('Home Loan Calculator');
}


// ============================================================
// CALCULATOR 4: EMI Calculator with Amortization Table
// ============================================================
function calculateEMI() {
    var principal = getInputValue('emiPrincipal');
    var annualRate = getInputValue('emiRate');
    var tenure = getInputValue('emiTenure');
    var tenureType = getSelectValue('tenureType');

    // Validate
    if (isNaN(principal) || principal <= 0) {
        alert('Please enter a valid Loan Amount.');
        return;
    }
    if (isNaN(annualRate) || annualRate <= 0) {
        alert('Please enter a valid Interest Rate.');
        return;
    }
    if (isNaN(tenure) || tenure <= 0) {
        alert('Please enter a valid Tenure.');
        return;
    }

    var totalMonths;
    if (tenureType === 'years') {
        totalMonths = tenure * 12;
    } else {
        totalMonths = tenure;
    }

    var r = annualRate / 12 / 100;
    var n = totalMonths;

    var emi;
    if (r === 0) {
        emi = principal / n;
    } else {
        var pow = Math.pow(1 + r, n);
        emi = principal * r * pow / (pow - 1);
    }

    var totalPayment = emi * n;
    var totalInterest = totalPayment - principal;
    var interestPercent = (totalInterest / totalPayment) * 100;

    // Display results
    setTextContent('emiAmount', formatIndianCurrency(emi));
    setTextContent('emiTotalInterest', formatIndianCurrency(totalInterest));
    setTextContent('emiTotalPayment', formatIndianCurrency(totalPayment));
    setTextContent('emiInterestPercent', interestPercent.toFixed(1) + '%');

    // Generate amortization table (first 12 months)
    var tableBody = document.getElementById('amortizationTable');
    if (tableBody) {
        var html = '';
        var balance = principal;
        var monthsToShow = Math.min(12, n);

        for (var m = 1; m <= monthsToShow; m++) {
            var interestComponent = balance * r;
            var principalComponent = emi - interestComponent;
            balance -= principalComponent;
            if (balance < 0) balance = 0;

            html += '<tr>';
            html += '<td>' + m + '</td>';
            html += '<td>' + formatIndianCurrency(emi) + '</td>';
            html += '<td>' + formatIndianCurrency(principalComponent) + '</td>';
            html += '<td>' + formatIndianCurrency(interestComponent) + '</td>';
            html += '<td>' + formatIndianCurrency(balance) + '</td>';
            html += '</tr>';
        }

        tableBody.innerHTML = html;
    }

    showResult('emiResult');
    triggerPopup('EMI Calculator');
}


// ============================================================
// CALCULATOR 5: FD (Fixed Deposit) Calculator
// ============================================================
function calculateFD() {
    var principal = getInputValue('fdAmount');
    var annualRate = getInputValue('fdRate');
    var tenureYears = getInputValue('fdTenure');
    var compounding = getSelectValue('fdCompounding');

    // Validate
    if (isNaN(principal) || principal <= 0) {
        alert('Please enter a valid FD Amount.');
        return;
    }
    if (isNaN(annualRate) || annualRate <= 0) {
        alert('Please enter a valid Interest Rate.');
        return;
    }
    if (isNaN(tenureYears) || tenureYears <= 0) {
        alert('Please enter a valid Tenure.');
        return;
    }

    // Compounding frequency per year
    var n;
    switch (compounding) {
        case 'monthly':
            n = 12;
            break;
        case 'yearly':
            n = 1;
            break;
        case 'quarterly':
        default:
            n = 4;
            break;
    }

    var r = annualRate / 100;
    var t = tenureYears;

    // A = P * (1 + r/n)^(n*t)
    var maturityAmount = principal * Math.pow(1 + r / n, n * t);
    var interestEarned = maturityAmount - principal;

    // Effective annual rate = (1 + r/n)^n - 1
    var effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

    // Display results
    setTextContent('fdMaturity', formatIndianCurrency(maturityAmount));
    setTextContent('fdInterestEarned', formatIndianCurrency(interestEarned));
    setTextContent('fdEffectiveRate', effectiveRate.toFixed(2) + '%');

    showResult('fdResult');
    triggerPopup('FD Calculator');
}


// ============================================================
// CALCULATOR 6: PPF (Public Provident Fund) Calculator
// ============================================================
function calculatePPF() {
    var yearlyInvestment = getInputValue('ppfInvestment');
    var annualRate = getInputValue('ppfRate');
    var tenureYears = getInputValue('ppfTenure');

    // Defaults
    if (isNaN(annualRate) || annualRate <= 0) annualRate = 7.1;
    if (isNaN(tenureYears) || tenureYears <= 0) tenureYears = 15;

    // Validate
    if (isNaN(yearlyInvestment) || yearlyInvestment <= 0) {
        alert('Please enter a valid Yearly Investment amount.');
        return;
    }

    var rate = annualRate / 100;
    var totalInvestment = 0;
    var totalInterest = 0;
    var balance = 0;

    // Generate year-wise table
    var tableBody = document.getElementById('ppfTable');
    var html = '';

    for (var year = 1; year <= tenureYears; year++) {
        var openingBalance = balance;
        var deposit = yearlyInvestment;
        var interest = (openingBalance + deposit) * rate;
        var closingBalance = openingBalance + deposit + interest;

        totalInvestment += deposit;
        totalInterest += interest;
        balance = closingBalance;

        html += '<tr>';
        html += '<td>' + year + '</td>';
        html += '<td>' + formatIndianCurrency(openingBalance) + '</td>';
        html += '<td>' + formatIndianCurrency(deposit) + '</td>';
        html += '<td>' + formatIndianCurrency(interest) + '</td>';
        html += '<td>' + formatIndianCurrency(closingBalance) + '</td>';
        html += '</tr>';
    }

    if (tableBody) {
        tableBody.innerHTML = html;
    }

    // Display results
    setTextContent('ppfTotalInvestment', formatIndianCurrency(totalInvestment));
    setTextContent('ppfTotalInterest', formatIndianCurrency(totalInterest));
    setTextContent('ppfMaturity', formatIndianCurrency(balance));

    showResult('ppfResult');
    triggerPopup('PPF Calculator');
}


// ============================================================
// CALCULATOR 7: Retirement Planning Calculator
// ============================================================
function calculateRetirement() {
    var currentAge = getInputValue('currentAge');
    var retirementAge = getInputValue('retirementAge');
    var monthlyExpenses = getInputValue('monthlyExpenses');
    var currentSavings = getInputValue('currentSavings');
    var expectedReturn = getInputValue('expectedReturn');
    var inflationRate = getInputValue('inflationRate');

    // Defaults
    if (isNaN(expectedReturn) || expectedReturn <= 0) expectedReturn = 12;
    if (isNaN(inflationRate) || inflationRate <= 0) inflationRate = 6;
    if (isNaN(currentSavings)) currentSavings = 0;

    // Validate
    if (isNaN(currentAge) || currentAge <= 0) {
        alert('Please enter a valid Current Age.');
        return;
    }
    if (isNaN(retirementAge) || retirementAge <= currentAge) {
        alert('Please enter a valid Retirement Age (must be greater than current age).');
        return;
    }
    if (isNaN(monthlyExpenses) || monthlyExpenses <= 0) {
        alert('Please enter valid Monthly Expenses.');
        return;
    }

    var yearsToRetirement = retirementAge - currentAge;

    // Future annual expenses = monthlyExpenses * (1 + inflation)^years * 12
    var futureAnnualExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement) * 12;

    // Corpus needed using 4% safe withdrawal rate
    var corpusNeeded = futureAnnualExpenses / 0.04;

    // Future value of current savings
    var fvCurrentSavings = currentSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);

    // Gap
    var gap = corpusNeeded - fvCurrentSavings;
    if (gap < 0) gap = 0;

    // Monthly SIP needed to fill the gap
    // SIP = gap * r / ((1+r)^n - 1)
    var monthlyReturn = expectedReturn / 12 / 100;
    var totalMonths = yearsToRetirement * 12;
    var monthlySIP;

    if (gap <= 0) {
        monthlySIP = 0;
    } else if (monthlyReturn === 0) {
        monthlySIP = gap / totalMonths;
    } else {
        var powSIP = Math.pow(1 + monthlyReturn, totalMonths);
        monthlySIP = gap * monthlyReturn / (powSIP - 1);
    }

    // Display results
    setTextContent('retCorpus', formatIndianCurrency(corpusNeeded));
    setTextContent('retSIP', formatIndianCurrency(monthlySIP));
    setTextContent('retFutureExpenses', formatIndianCurrency(futureAnnualExpenses));
    setTextContent('retGap', formatIndianCurrency(gap));

    showResult('retirementResult');
    triggerPopup('Retirement Calculator');
}


// ============================================================
// CALCULATOR 8: Goal-Based Investment Calculator
// ============================================================
function calculateGoal() {
    var goalAmount = getInputValue('goalAmount');
    var yearsToGoal = getInputValue('yearsToGoal');
    var goalInflation = getInputValue('goalInflation');
    var goalReturn = getInputValue('goalReturn');
    var goalCurrentSavings = getInputValue('goalCurrentSavings');

    // Defaults
    if (isNaN(goalInflation) || goalInflation < 0) goalInflation = 6;
    if (isNaN(goalReturn) || goalReturn <= 0) goalReturn = 12;
    if (isNaN(goalCurrentSavings)) goalCurrentSavings = 0;

    // Validate
    if (isNaN(goalAmount) || goalAmount <= 0) {
        alert('Please enter a valid Goal Amount.');
        return;
    }
    if (isNaN(yearsToGoal) || yearsToGoal <= 0) {
        alert('Please enter a valid number of Years to Goal.');
        return;
    }

    // Inflated goal = goalAmount * (1 + inflation/100)^years
    var inflatedGoal = goalAmount * Math.pow(1 + goalInflation / 100, yearsToGoal);

    // Future value of current savings
    var fvSavings = goalCurrentSavings * Math.pow(1 + goalReturn / 100, yearsToGoal);

    // Remaining amount to accumulate
    var remaining = inflatedGoal - fvSavings;
    if (remaining < 0) remaining = 0;

    // Monthly SIP = remaining * r / ((1+r)^n - 1)
    var monthlyReturn = goalReturn / 12 / 100;
    var totalMonths = yearsToGoal * 12;
    var monthlySIP;

    if (remaining <= 0) {
        monthlySIP = 0;
    } else if (monthlyReturn === 0) {
        monthlySIP = remaining / totalMonths;
    } else {
        var powSIP = Math.pow(1 + monthlyReturn, totalMonths);
        monthlySIP = remaining * monthlyReturn / (powSIP - 1);
    }

    // Lumpsum = remaining / (1 + return/100)^years
    var lumpsum;
    if (remaining <= 0) {
        lumpsum = 0;
    } else {
        lumpsum = remaining / Math.pow(1 + goalReturn / 100, yearsToGoal);
    }

    // Display results
    setTextContent('goalInflated', formatIndianCurrency(inflatedGoal));
    setTextContent('goalSIP', formatIndianCurrency(monthlySIP));
    setTextContent('goalLumpsum', formatIndianCurrency(lumpsum));

    showResult('goalResult');
    triggerPopup('Goal Calculator');
}


// ============================================================
// CALCULATOR 9: FIRE (Financial Independence, Retire Early)
// ============================================================
function calculateFIRE() {
    var currentAge = getInputValue('fireCurrentAge');
    var monthlyExpenses = getInputValue('fireMonthlyExpenses');
    var expenseGrowth = getInputValue('fireExpenseGrowth');
    var netWorth = getInputValue('fireNetWorth');
    var preReturn = getInputValue('firePreReturn');
    var postReturn = getInputValue('firePostReturn');
    var swr = getInputValue('fireSWR');

    // Defaults
    if (isNaN(expenseGrowth) || expenseGrowth < 0) expenseGrowth = 6;
    if (isNaN(preReturn) || preReturn <= 0) preReturn = 12;
    if (isNaN(postReturn) || postReturn <= 0) postReturn = 8;
    if (isNaN(swr) || swr <= 0) swr = 3.5;
    if (isNaN(netWorth)) netWorth = 0;

    // Validate
    if (isNaN(currentAge) || currentAge <= 0) {
        alert('Please enter a valid Current Age.');
        return;
    }
    if (isNaN(monthlyExpenses) || monthlyExpenses <= 0) {
        alert('Please enter valid Monthly Expenses.');
        return;
    }

    // FIRE Number = (monthly expenses * 12) / (SWR / 100)
    var annualExpenses = monthlyExpenses * 12;
    var fireNumber = annualExpenses / (swr / 100);

    // Iterate year by year to find when net worth >= required FIRE number for that year
    var yearsToFIRE = 0;
    var currentNetWorth = netWorth;
    var currentExpenses = annualExpenses;
    var maxYears = 100; // Safety cap

    for (var y = 0; y < maxYears; y++) {
        // Required FIRE number at this year's expense level
        var requiredCorpus = currentExpenses / (swr / 100);

        if (currentNetWorth >= requiredCorpus) {
            yearsToFIRE = y;
            break;
        }

        // Grow net worth by pre-retirement return
        currentNetWorth = currentNetWorth * (1 + preReturn / 100);

        // Grow expenses by expense growth rate
        currentExpenses = currentExpenses * (1 + expenseGrowth / 100);

        yearsToFIRE = y + 1;
    }

    // Check if FIRE is achievable
    var fireAge = currentAge + yearsToFIRE;

    // Progress percentage (current net worth / fire number * 100)
    var progress = (netWorth / fireNumber) * 100;
    if (progress > 100) progress = 100;

    // Display results
    setTextContent('fireNumber', formatIndianCurrency(fireNumber));
    setTextContent('fireYears', yearsToFIRE >= maxYears ? 'Not achievable with current inputs' : yearsToFIRE + ' years');
    setTextContent('fireAge', yearsToFIRE >= maxYears ? 'N/A' : fireAge + ' years');

    // Progress bar
    var progressBar = document.getElementById('fireProgress');
    if (progressBar) {
        progressBar.style.width = progress.toFixed(1) + '%';
        progressBar.textContent = progress.toFixed(1) + '%';
        progressBar.setAttribute('aria-valuenow', progress.toFixed(1));
    }

    showResult('fireResult');
    triggerPopup('FIRE Calculator');
}
