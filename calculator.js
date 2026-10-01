let pendingOperand = null;
let pendingOperator = null;
let errorLogs = [];

function validate(input, type = "single") {
    if (input === null || input === undefined || input.trim() === "") {
        logError("input error: Empty value.");
        return {valid: false, message:"Error: Input is empty."};
    }

    if (type === "single") {
        const num = Number(input);
        if (isNaN(num)) {
            logError("Input Error: is not a valid number.");
            return {valid: false, message:"Error: Invalid number"};
        }
        return {valid: true, value: num};
    }

    if (type.toLowerCase() === "csv") {
        const parts = input.split(",").map(item => item.trim());
        if(parts.some(p => p === "")) {
            logError("CSV Error: Contains empty elements.");
            return { valid: false, message: "Error: CSV contains empty elements"};
        }
        const nums = parts.map(Number);
        if (nums.some(isNaN)) {
            logError("CSV Error: Contains non-numeric values.");
            return { valid: false, message: "Error: CSV contains non-numeric values" };
        }
        if (nums.length === 0) {
            logError("CSV Error: Empty list.");
            return { valid: false, message: "Error: Empty CSV list" };
        }
        return { valid: true, value: nums };
    }

    return { valid: false, message: "Error: Unknown validation type" };
}

function fill_info(val, contextMessage = "") {
    const infoElement = document.getElementById("info");

    if (typeof val === "number" && !isNaN(val)) {
        let text = "";
        if (val < 100) {
            text = "Info: The result is less than 100";
        } else if (val >= 100 && val <= 200) {
            text = "Info: The result is between 100 and 200";
        } else {
            text = "Info: The result is greater than 200";
        }

        if (contextMessage) {
            infoElement.innerText = `${contextMessage} | ${text}`;
        } else {
            infoElement.innerText = text;
        }
    } else {
        infoElement.innerText = contextMessage || "Information about the number";
    }
}

function square() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "single");
    if (!v.valid) return;

    const res = v.value * v.value;
    updateDisplay(res);
    fill_info(res, "Square");
}

function mod() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "single");
    if (!v.valid) return;

    const x = v.value;
    const res = x < 0 ? -x : x;
    updateDisplay(res);
    fill_info(res, "Operation: Modulo");
}

function fact() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "single");
    if (!v.valid) return;

    const x = v.value;
    if (x < 0 || !Number.isInteger(x)) {
        logError(`Factorial Error: Input '${x}' is invalid.`);
        return;
    }

    let res = 1;
    for (let i = 2; i <= x; i++) res = res * i;

    updateDisplay(res);
    fill_info(res, "Operation: Factorial");
}  

function sqrtOp() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "single");
    if (!v.valid) return;

    const x = v.value;
    if (x < 0) {
        logError(`Square Root Error: Cannot calculate square root of negative number '${x}'.`);
        fill_info(NaN, "Note: Input number is negative (Invalid for √)");
        return;
    }

    const res = Math.sqrt(x);
    updateDisplay(res);
    fill_info(res, "Operation: Square Root (Positive Input)");
}

function powerOp() {
    const baseInput = document.getElementById("mainInput").value;
    const expInput = document.getElementById("powerInput").value;

    const vBase = validate(baseInput, "single");
    if (!vBase.valid) return;

    const vExp = validate(expInput, "single");
    if (!vExp.valid) return;

    const res = Math.pow(vBase.value, vExp.value);
    updateDisplay(res);
    fill_info(res, `Operation: Exponentiation (${vBase.value}^${vExp.value})`);
}

function setBinaryOperator(op) {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "single");
    if (!v.valid) return;

    pendingOperand = v.value;
    pendingOperator = op;
    document.getElementById("mainInput").value = "";
}

function eq() {
    if (pendingOperator === null || pendingOperand === null) {
        return;
    }  

    const input = document.getElementById("mainInput").value;
    const v = validate(input, "single");
    if (!v.valid) return;

    const secondOperand = v.value;
    let res = 0;

    if (pendingOperator === "+") {
        res = pendingOperand + secondOperand;
    } else if (pendingOperator === "*") {
        res = pendingOperand * secondOperand;
    } else if (pendingOperator === "-") {
        res = pendingOperand - secondOperand;
    } else if (pendingOperator === "/") {
        if (secondOperand === 0) {
            logError("Division Error: Cannot divide by zero.");
            return;
        }
        res = pendingOperand / secondOperand;
    }

    updateDisplay(res);
    let opName = "Operation";
    if (pendingOperator === "+") opName = "Addition";
    else if (pendingOperator === "-") opName = "Subtraction";
    else if (pendingOperator === "*") opName = "Multiplication";
    else if (pendingOperator === "/") opName = "Division";

    fill_info(res, `Operation: ${opName}`);

    pendingOperand = null;
    pendingOperator = null;
}

function sumCSV() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "CSV");
    if (!v.valid) return;

    const res = v.value.reduce((acc, curr) => acc + curr, 0);
    updateDisplay(res);
    fill_info(res, "CSV Operation: Sum");
}

function sortCSV() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "CSV");
    if (!v.valid) return;

    const sorted = [...v.value].sort((a, b) => a - b);
    updateDisplay(sorted.join(", "));
    fill_info(NaN, "CSV Operation: Sorted ascending");
}

function reverseCSV() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "CSV");
    if (!v.valid) return;

    const reversed = [...v.value].reverse();
    updateDisplay(reversed.join(", "));
    fill_info(NaN, "CSV Operation: Reversed list");
}

function removelastCSV() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "CSV");
    if (!v.valid) return;

    const arr = [...v.value];
    arr.pop();
    updateDisplay(arr.join(", "));
    fill_info(NaN, "CSV Operation: Removed last item");
}

function averageCSV() {
    const input = document.getElementById("mainInput").value;
    const v = validate(input, "CSV");
    if (!v.valid) return;
    
    const total = v.value.reduce((acc, curr) => acc + curr, 0);
    const avg = total / v.value.length;
    updateDisplay(avg);
    fill_info(avg, "CSV Operation: Average");
}

function removeSpecificCSV() {
    const input = document.getElementById("mainInput").value;
    const toRemoveInput = document.getElementById("removeInput").value;

    const v = validate(input, "csv");
    if (!v.valid) return;

    const vRem = validate(toRemoveInput, "single");
    if (!vRem.valid) return;

    const valToRemove = vRem.value;
    const filtered = v.value.filter(item => item !== valToRemove);

    updateDisplay(filtered.join(", "));
    fill_info(NaN, `CSV Operation: Removed all instances of ${valToRemove}`);
}

function appendInput(char) {
    document.getElementById("mainInput").value += char;
}

function clearCalculator() {
    document.getElementById("mainInput").value = "";
    document.getElementById("removeInput").value = "";
    document.getElementById("powerInput").value = "";
    pendingOperand = null;
    pendingOperator = null;
    fill_info(NaN, "Information about the number");
}

function updateDisplay(val) {
    document.getElementById("mainInput").value = val;
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        eq();
    } else if (event.key === "Escape") {
        clearCalculator();
    }
});

function logError(msg) {
    const timestamp = new Date().toISOString();
    errorLogs.push(`[${timestamp}] ${msg}`);
    document.getElementById("errorCounter").innerText = `Error log: ${errorLogs.length}`;
}

function downloadErrorLog() {
    if (errorLogs.length === 0) {
        return;
    }
    const blob = new Blob([errorLogs.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calculator_error_log.txt";
    a.click();
    URL.revokeObjectURL(url);
}