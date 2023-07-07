const moment = require('moment');

class DateValidateUtils {
    validateDate(fieldName, date) {
        const format = 'YYYY-MM-DDTH:m:s';
        let dateValidated = {
        }
        if (!moment(date, format, true).isValid()) {
            dateValidated.valid = false;
            dateValidated.message = `O campo ${fieldName} deve ser uma data válida.`;
            return dateValidated
        }

        if (moment(date).isAfter(moment())) {
            dateValidated.valid = false;
            dateValidated.message = `O campo ${fieldName} não pode estar no futuro.`;
            return dateValidated
        }

        dateValidated.valid = true;
        return dateValidated;
    }
}

module.exports = { DateValidateUtils };