// helper functions
// helpers/dateUtils.js
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

function billingFrequencyToMonths(frequency) {
    return (
        {
            monthly: 1,
            quarterly: 3,
            annually: 12,
        }[frequency] || 1
    );
}

module.exports = { addMonths, billingFrequencyToMonths };
