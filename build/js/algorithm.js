var algorithm = {
    entryTransArray: function entryTransArray(entry) {
        var regexs = [/([\u002a\u002b\u002d\u002f])/g, /([\u0028])/g, /([\u0029])/g];

        return entry
            .replace(regexs[0], " $1 ")
            .replace(regexs[1], "$1 ")
            .replace(regexs[2], " $1")
            .split(' ')
            .map(function(element) {
                return isNaN(element) ? element : element * 1;
            });
    },
    entryVerify: function entryVerify(entry) {

        var operations = ['+', '-', '*', '/'];
        // error occurrs, return 0
        if (entry === 'ERROR') {
            return '0';
        }
        //prevent continuously operators occur
        for (var i = 0; i < operations.length; ++i) {
            if (entry[entry.length - 1] === operations[i]) {
                return operations.indexOf(entry[entry.length - 2]) === -1 ? entry : entry.slice(0, entry.length - 1);
            }
        }
        // prevent infinite decimals from occurring, limit in 4th decimal place
        if (entry.indexOf('.') !== -1) {
            var arr = entry.split('.')

            return arr[0] + '.' + arr[1].slice(0, configuration.setting.decimalPlaceAllowed);
        }
        // prevent display overflow
        if (entry.length >= configuration.setting.digitsDisplayLimit) {
            return entry.slice(0, configuration.setting.digitsDisplayLimit);
        }
        // prevent no number displaying from occurring
        if (entry === '') {
            return '0';
        }
        // deal with zero-start special case 
        if (entry.length === 2 && entry[0] === '0') {
            switch (entry[1]) {
                case '0':
                    return '0';
                case '1':
                    return '1';
                case '2':
                    return '2';
                case '3':
                    return '3';
                case '4':
                    return '4';
                case '5':
                    return '5';
                case '6':
                    return '6';
                case '7':
                    return '7';
                case '8':
                    return '8';
                case '9':
                    return '9';
            }
        }
        // no condition return original param
        return entry;
    },
    getAnsByRPN: function getAnsByRPN(inputArr) {
        var operation = function(operator, operand1, operand2) {
            switch (operator) {
                case '+':
                    return operand2 + operand1;
                case '-':
                    return operand2 - operand1;
                case '*':
                    return operand2 * operand1;
                case '/':
                    return operand2 / operand1;
            }
        };
        var stack = [];
        
        while (inputArr.length > 0) {
            if (typeof inputArr[0] === "number") {
                stack.push(inputArr.shift());
            } else {
                stack.push(operation(inputArr.shift(), stack.pop(), stack.pop()));
            }
        }
        return stack.length == 1 ? stack[0].toString(10) : "ERROR";
    },
    shuntingYard: function shuntingYard(inputArr) {
        var opPriority = function(operator) {
            switch (operator) {
                case '*':
                case '/':
                    return 2;
                case '+':
                case '-':
                    return 1;
            }
            return 0;
        };
        var outputArr = [];
        var stack = [];

        while (inputArr.length > 0) {
            if (typeof inputArr[0] === "number") {
                outputArr.push(inputArr.shift());
            } else if (inputArr[0] === '(') {
                stack.unshift(inputArr.shift());
            } else if (inputArr[0] === ')') {
                while (stack[0] !== '(') {
                    outputArr.push(stack.shift());
                }
                stack.shift();
                inputArr.shift();
            } else {
                while (stack.length > 0 && opPriority(inputArr[0]) <= opPriority(stack[0])) {
                    outputArr.push(stack.shift());
                }
                stack.unshift(inputArr.shift());
            }
        }
        return outputArr.concat(stack);
    }
};