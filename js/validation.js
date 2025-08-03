// Global variables for validation
let validationErrors = {};
let validationDebug = false;

/**
 * Main validation function
 * @param {HTMLElement|string} formElement - Form element or form ID
 * @param {Object} rules - Validation rules
 * @param {Object} messages - Custom messages (optional)
 * @param {string} attributeType - Attribute type to use ('name' or 'id', default: 'name')
 * @returns {boolean} - True if validation passes
 */
function validationJs(formElement, rules, messages = {}, attributeType = 'name') {
    // Clear previous errors
    validationErrors = {};
    
    try {
        // Get form element
        let form;
        if (typeof formElement === 'string') {
            form = document.getElementById(formElement.replace('#', ''));
        } else {
            form = formElement;
        }
        
        if (!form) {
            throw new Error('Form element not found');
        }
        
        // Debug info
        if (validationDebug) {
            console.log('Validation started for form:', form);
            console.log('Rules:', rules);
            console.log('Messages:', messages);
        }
        
        let isValid = true;
        
        // Validate each field
        for (let fieldName in rules) {
            const fieldRules = rules[fieldName];
            
            // Check if field name ends with [] (array field)
            if (fieldName.endsWith('[]')) {
                const baseFieldName = fieldName.slice(0, -2);
                const fieldElements = form.querySelectorAll(`[${attributeType}="${fieldName}"]`);
                
                if (fieldElements.length === 0) {
                    if (validationDebug) {
                        console.warn(`Array field elements not found: ${fieldName}`);
                    }
                    continue;
                }
                
                // Validate each array element
                fieldElements.forEach((fieldElement, index) => {
                    const indexedFieldName = `${baseFieldName}_${index}`;
                    const fieldValue = getFieldValue(fieldElement);
                    const fieldMessages = messages[fieldName] || {};
                    const fieldLabel = fieldMessages.label || baseFieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    if (validationDebug) {
                        console.log(`Validating array field: ${indexedFieldName}, value:`, fieldValue);
                    }
                    
                    const ruleArray = parseRules(fieldRules);
                    for (let rule of ruleArray) {
                        const result = validateRule(fieldValue, rule, fieldElement, form, attributeType);
                        
                        if (!result.valid) {
                            isValid = false;
                            const errorMessage = getErrorMessage(baseFieldName, rule, fieldMessages, `${fieldLabel} #${index + 1}`, result.message);
                            
                            if (!validationErrors[indexedFieldName]) {
                                validationErrors[indexedFieldName] = [];
                            }
                            validationErrors[indexedFieldName].push(errorMessage);
                            
                            // Add error class to field
                            fieldElement.classList.add('error');
                            
                            if (validationDebug) {
                                console.log(`Validation failed for ${indexedFieldName}:`, errorMessage);
                            }
                            break;
                        }
                    }
                });
            } else {
                // Regular field validation (non-array)
                const fieldElement = form.querySelector(`[${attributeType}="${fieldName}"]`);
                
                if (!fieldElement) {
                    if (validationDebug) {
                        console.warn(`Field element not found: ${fieldName}`);
                    }
                    continue;
                }
                
                const fieldValue = getFieldValue(fieldElement);
                const fieldMessages = messages[fieldName] || {};
                const fieldLabel = fieldMessages.label || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                if (validationDebug) {
                    console.log(`Validating field: ${fieldName}, value:`, fieldValue);
                }
                
                const ruleArray = parseRules(fieldRules);
                for (let rule of ruleArray) {
                    const result = validateRule(fieldValue, rule, fieldElement, form, attributeType);
                    
                    if (!result.valid) {
                        isValid = false;
                        const errorMessage = getErrorMessage(fieldName, rule, fieldMessages, fieldLabel, result.message);
                        
                        if (!validationErrors[fieldName]) {
                            validationErrors[fieldName] = [];
                        }
                        validationErrors[fieldName].push(errorMessage);
                        
                        // Add error class to field
                        fieldElement.classList.add('error');
                        
                        if (validationDebug) {
                            console.log(`Validation failed for ${fieldName}:`, errorMessage);
                        }
                        break;
                    }
                }
            }
        }
        
        if (validationDebug) {
            console.log('Validation completed. Is valid:', isValid);
            console.log('Errors:', validationErrors);
        }
        
        return isValid;
        
    } catch (error) {
        console.error('Validation error:', error);
        validationErrors['_global'] = ['Validation system error: ' + error.message];
        return false;
    }
}

/**
 * Get validation errors
 * @param {string} type - Error display type ('raw', 'toastr')
 * @param {string} mode - Display mode ('single', 'multi')
 * @returns {Object|void} - Error messages or displays them
 */
function validationJsError(type = 'raw', mode = 'single') {
    const errorMessages = {};
    
    // Flatten errors
    for (let field in validationErrors) {
        if (validationErrors[field].length > 0) {
            errorMessages[field] = validationErrors[field][0]; // Get first error for each field
        }
    }
    
    if (type === 'raw') {
        return errorMessages;
    }
    
    // For demonstration purposes, we'll show errors in a div instead of toastr
    if (type === 'toastr') {
        showToastrErrors(errorMessages, mode);
        return;
    }
    
    return errorMessages;
}

/**
 * Enable/disable debug mode
 * @param {boolean} enable - Enable debug mode
 */
function validationJsDebug(enable = true) {
    validationDebug = enable;
}

/**
 * Get field value based on element type
 * @param {HTMLElement} element - Form element
 * @returns {*} - Field value
 */
function getFieldValue(element) {
    if (element.type === 'file') {
        return element.files;
    } else if (element.type === 'checkbox') {
        return element.checked;
    } else if (element.type === 'radio') {
        const form = element.closest('form');
        const checked = form.querySelector(`input[name="${element.name}"]:checked`);
        return checked ? checked.value : '';
    } else if (element.tagName === 'SELECT' && element.multiple) {
        return Array.from(element.selectedOptions).map(option => option.value);
    } else {
        return element.value;
    }
}

/**
 * Parse rule string into array of rule objects
 * @param {string} rulesString - Rules string like "required|string|min:5"
 * @returns {Array} - Array of rule objects
 */
function parseRules(rulesString) {
    if (typeof rulesString !== 'string') {
        return [];
    }
    
    return rulesString.split('|').map(rule => {
        const parts = rule.split(':');
        const name = parts[0];
        const parameters = parts.slice(1).join(':').split(',').filter(p => p !== '');
        
        return { name, parameters };
    });
}

/**
 * Validate a single rule
 * @param {*} value - Field value
 * @param {Object} rule - Rule object
 * @param {HTMLElement} element - Form element
 * @param {HTMLElement} form - Form element
 * @param {string} attributeType - Attribute type
 * @returns {Object} - Validation result
 */
function validateRule(value, rule, element, form, attributeType) {
    const { name, parameters } = rule;
    
    try {
        switch (name) {
            case 'required':
                return validateRequired(value, element);
            
            case 'required_if':
                return validateRequiredIf(value, parameters, form, attributeType);
            
            case 'string':
                return validateString(value);
            
            case 'numeric':
            case 'double':
            case 'float':
                return validateNumeric(value);
            
            case 'integer':
                return validateInteger(value);
            
            case 'email':
                return validateEmail(value);
            
            case 'array':
                return validateArray(value);
            
            case 'file':
                return validateFile(value);
            
            case 'size':
                return validateSize(value, parameters, element);
            
            case 'mimes':
                return validateMimes(value, parameters);
            
            case 'min':
                return validateMin(value, parameters, element);
            
            case 'max':
                return validateMax(value, parameters, element);
            
            case 'between':
                return validateBetween(value, parameters, element);
            
            case 'date':
                return validateDate(value);
            
            case 'date_format':
                return validateDateFormat(value, parameters);
            
            case 'after':
                return validateAfter(value, parameters);
            
            case 'before':
                return validateBefore(value, parameters);
            
            case 'after_or_equal':
                return validateAfterOrEqual(value, parameters, form, attributeType);
            
            case 'before_or_equal':
                return validateBeforeOrEqual(value, parameters, form, attributeType);
            
            case 'weekend':
                return validateWeekend(value);
            
            case 'time':
                return validateTime(value);
            
            case 'url':
                return validateUrl(value);
            
            case 'boolean':
                return validateBoolean(value);
            
            case 'confirmed':
                return validateConfirmed(value, element, form, attributeType);
            
            case 'alpha':
                return validateAlpha(value);
            
            case 'alpha_num':
                return validateAlphaNum(value);
            
            case 'same':
                return validateSame(value, parameters, form, attributeType);
            
            case 'different':
                return validateDifferent(value, parameters, form, attributeType);
            
            case 'in':
                return validateIn(value, parameters);
            
            case 'not_in':
                return validateNotIn(value, parameters);
            
            case 'regex':
                return validateRegex(value, parameters);
            
            case 'json':
                return validateJson(value);
            
            case 'ip':
                return validateIp(value);
            
            case 'ipv4':
                return validateIpv4(value);
            
            case 'ipv6':
                return validateIpv6(value);
            
            case 'uuid':
                return validateUuid(value);
            
            case 'digits':
                return validateDigits(value, parameters);
            
            case 'digits_between':
                return validateDigitsBetween(value, parameters);

            case 'currency':
                return validateCurrency(value, parameters);
            
            default:
                return { valid: true };
        }
    } catch (error) {
        console.error(`Error validating rule ${name}:`, error);
        return { valid: false, message: `Validation error for rule ${name}` };
    }
}

// Validation rule implementations
function validateRequired(value, element) {
    if (element.type === 'file') {
        return { valid: value && value.length > 0 };
    }
    
    if (Array.isArray(value)) {
        return { valid: value.length > 0 };
    }
    
    return { valid: value !== null && value !== undefined && String(value).trim() !== '' };
}

function validateRequiredIf(value, parameters, form, attributeType) {
    if (parameters.length < 3) return { valid: true };
    
    const [field, operator, ...values] = parameters;
    const targetElement = form.querySelector(`[${attributeType}="${field}"]`);
    
    if (!targetElement) return { valid: true };
    
    const targetValue = getFieldValue(targetElement);
    let shouldBeRequired = false;
    
    switch (operator) {
        case '=':
        case '==':
            shouldBeRequired = values.includes(String(targetValue));
            break;
        case '!=':
            shouldBeRequired = !values.includes(String(targetValue));
            break;
    }
    
    if (shouldBeRequired) {
        return validateRequired(value, [], form, attributeType);
    }
    
    return { valid: true };
}

function validateString(value) {
    return { valid: typeof value === 'string' || value === null || value === undefined || value === '' };
}

function validateNumeric(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    // Reject if contains 'e' or 'E' (scientific notation)
    if (typeof value === 'string' && /[eE]/.test(value)) return { valid: false };
    return { valid: !isNaN(value) && !isNaN(parseFloat(value)) };
}

function validateInteger(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    // Reject if contains 'e' or 'E' (scientific notation)
    if (typeof value === 'string' && /[eE]/.test(value)) return { valid: false };
    return { valid: Number.isInteger(Number(value)) };
}

function validateEmail(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return { valid: emailRegex.test(value) };
}

function validateArray(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    // Handle comma-separated string as array
    if (typeof value === 'string') {
        value = value.split(',').map(item => item.trim()).filter(item => item !== '');
    }
    
    return { valid: Array.isArray(value) };
}

function validateFile(value) {
    return { valid: value && value instanceof FileList };
}

function validateSize(value, parameters, element) {
    if (!value || value.length === 0) return { valid: true };
    
    const maxSize = parameters[0] ? parseFloat(parameters[0]) : 4; // Default 4MB
    const maxSizeBytes = maxSize * 1024 * 1024;
    
    if (element.type === 'file') {
        for (let file of value) {
            if (file.size > maxSizeBytes) {
                return { valid: false };
            }
        }
    }
    
    return { valid: true };
}

function validateMimes(value, parameters) {
    if (!value || value.length === 0) return { valid: true };
    
    const allowedTypes = parameters.map(type => type.toLowerCase());
    
    for (let file of value) {
        const extension = file.name.toLowerCase().split('.').pop();
        if (!allowedTypes.includes(extension)) {
            return { valid: false };
        }
    }
    
    return { valid: true };
}

function isNumericValue(value) {
    // Check if value is already a number
    if (typeof value === 'number') {
        return !isNaN(value) && isFinite(value);
    }
    
    // Check if string represents a valid number
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed === '' || trimmed === '.' || trimmed === '-' || trimmed === '+') return false;
        
        // More robust numeric validation using regex
        const numericRegex = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
        if (!numericRegex.test(trimmed)) return false;
        
        const parsed = parseFloat(trimmed);
        return !isNaN(parsed) && isFinite(parsed);
    }
    
    return false;
}

function validateMin(value, parameters, element) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const min = parseFloat(parameters[0]);
    
    if (element.type === 'file') {
        return { valid: value.length >= min };
    }
    
    if (isNumericValue(value)) {
        return { valid: parseFloat(value) >= min };
    }
    
    if (Array.isArray(value) || (typeof value === 'string' && value.includes(','))) {
        const arr = Array.isArray(value) ? value : value.split(',').map(item => item.trim()).filter(item => item !== '');
        return { valid: arr.length >= min };
    }
    
    // Fall back to string length validation
    if (typeof value === 'string') {
        return { valid: value.length >= min };
    }
    
    // For other types, try to parse as number
    return { valid: parseFloat(value) >= min };
}

function validateMax(value, parameters, element) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const max = parseFloat(parameters[0]);
    
    if (element.type === 'file') {
        return { valid: value.length <= max };
    }

    if (isNumericValue(value)) {
        return { valid: parseFloat(value) <= max };
    }
    
    if (Array.isArray(value) || (typeof value === 'string' && value.includes(','))) {
        const arr = Array.isArray(value) ? value : value.split(',').map(item => item.trim()).filter(item => item !== '');
        return { valid: arr.length <= max };
    }
    
    // Fall back to string length validation
    if (typeof value === 'string') {
        return { valid: value.length <= max };
    }
    
    // For other types, try to parse as number
    return { valid: parseFloat(value) <= max };
}

function validateBetween(value, parameters, element) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const [min, max] = parameters.map(p => parseFloat(p));
    
    if (element.type === 'time') {
        const timeToMinutes = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };
        
        const valueMinutes = timeToMinutes(value);
        const minMinutes = timeToMinutes(parameters[0]);
        const maxMinutes = timeToMinutes(parameters[1]);
        
        return { valid: valueMinutes >= minMinutes && valueMinutes <= maxMinutes };
    }
    
    if (typeof value === 'string') {
        return { valid: value.length >= min && value.length <= max };
    }
    
    const numValue = parseFloat(value);
    return { valid: numValue >= min && numValue <= max };
}

function validateDate(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const date = new Date(value);
    return { valid: !isNaN(date.getTime()) };
}

function validateDateFormat(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const format = parameters[0];
    if (!format) return { valid: false };
    
    // Date format patterns mapping
    const formatPatterns = {
        // Year formats
        'Y-m-d': /^\d{4}-\d{1,2}-\d{1,2}$/,
        'YYYY-MM-DD': /^\d{4}-\d{2}-\d{2}$/,
        'Y/m/d': /^\d{4}\/\d{1,2}\/\d{1,2}$/,
        'YYYY/MM/DD': /^\d{4}\/\d{2}\/\d{2}$/,
        
        // Month/Day/Year formats (US style)
        'm/d/Y': /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        'MM/DD/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
        'm-d-Y': /^\d{1,2}-\d{1,2}-\d{4}$/,
        'MM-DD-YYYY': /^\d{2}-\d{2}-\d{4}$/,
        
        // Day/Month/Year formats (European style)
        'd/m/Y': /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        'DD/MM/YYYY': /^\d{2}\/\d{2}\/\d{4}$/,
        'd-m-Y': /^\d{1,2}-\d{1,2}-\d{4}$/,
        'DD-MM-YYYY': /^\d{2}-\d{2}-\d{4}$/,
        'd.m.Y': /^\d{1,2}\.\d{1,2}\.\d{4}$/,
        'DD.MM.YYYY': /^\d{2}\.\d{2}\.\d{4}$/,
        
        // With time formats
        'Y-m-d H:i': /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{2}$/,
        'YYYY-MM-DD HH:mm': /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
        'Y-m-d H:i:s': /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{2}:\d{2}$/,
        'YYYY-MM-DD HH:mm:ss': /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
        
        // Time only formats
        'H:i': /^\d{1,2}:\d{2}$/,
        'HH:mm': /^\d{2}:\d{2}$/,
        'H:i:s': /^\d{1,2}:\d{2}:\d{2}$/,
        'HH:mm:ss': /^\d{2}:\d{2}:\d{2}$/,
        'h:i A': /^\d{1,2}:\d{2} (AM|PM)$/i,
        'hh:mm A': /^\d{2}:\d{2} (AM|PM)$/i,
        
        // ISO formats
        'c': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/,
        'ISO8601': /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)$/,
        
        // Month/Year formats
        'm/Y': /^\d{1,2}\/\d{4}$/,
        'MM/YYYY': /^\d{2}\/\d{4}$/,
        'm-Y': /^\d{1,2}-\d{4}$/,
        'MM-YYYY': /^\d{2}-\d{4}$/,
        
        // Text date formats
        'F j, Y': /^[A-Za-z]+ \d{1,2}, \d{4}$/,
        'M j, Y': /^[A-Za-z]{3} \d{1,2}, \d{4}$/,
        'j F Y': /^\d{1,2} [A-Za-z]+ \d{4}$/,
        'j M Y': /^\d{1,2} [A-Za-z]{3} \d{4}$/
    };
    
    const regex = formatPatterns[format];
    if (!regex) {
        console.warn(`Unsupported date format: ${format}`);
        return { valid: false };
    }
    
    // Check regex pattern first
    if (!regex.test(value)) {
        return { valid: false };
    }
    
    // Additional validation based on format type
    return validateDateLogic(value, format);
}

function validateDateLogic(value, format) {
    try {
        let date;
        
        // Handle different date parsing based on format
        if (format.includes('c') || format.includes('ISO8601')) {
            // ISO format
            date = new Date(value);
        } else if (format.match(/^[HhMmSsAi:\s]+$/)) {
            // Time only formats - create date with today's date
            const today = new Date().toISOString().split('T')[0];
            const timeValue = value.replace(/AM|PM/i, '').trim();
            let [hours, minutes, seconds = '00'] = timeValue.split(':');
            
            if (value.match(/PM/i) && parseInt(hours) !== 12) {
                hours = parseInt(hours) + 12;
            } else if (value.match(/AM/i) && parseInt(hours) === 12) {
                hours = '00';
            }
            
            date = new Date(`${today}T${hours.padStart(2, '0')}:${minutes}:${seconds}`);
        } else if (format.includes('/')) {
            // Handle different slash-separated formats
            const parts = value.split('/');
            if (format.startsWith('Y') || format.startsWith('YYYY')) {
                // YYYY/MM/DD
                date = new Date(parts[0], parts[1] - 1, parts[2]);
            } else if (format.startsWith('m') || format.startsWith('MM')) {
                // MM/DD/YYYY (US format)
                date = new Date(parts[2], parts[0] - 1, parts[1]);
            } else if (format.startsWith('d') || format.startsWith('DD')) {
                // DD/MM/YYYY (European format)
                date = new Date(parts[2], parts[1] - 1, parts[0]);
            }
        } else if (format.includes('-')) {
            // Handle different dash-separated formats
            const parts = value.split(/[-\s]/);
            if (format.startsWith('Y') || format.startsWith('YYYY')) {
                // YYYY-MM-DD format
                const datePart = parts[0] + '-' + parts[1] + '-' + parts[2];
                if (parts.length > 3) {
                    // Has time component
                    const timeParts = parts.slice(3).join(':');
                    date = new Date(datePart + 'T' + timeParts);
                } else {
                    date = new Date(datePart);
                }
            } else if (format.startsWith('m') || format.startsWith('MM')) {
                // MM-DD-YYYY (US format)
                date = new Date(parts[2], parts[0] - 1, parts[1]);
            } else if (format.startsWith('d') || format.startsWith('DD')) {
                // DD-MM-YYYY (European format)
                date = new Date(parts[2], parts[1] - 1, parts[0]);
            }
        } else if (format.includes('.')) {
            // Handle dot-separated formats (European)
            const parts = value.split('.');
            date = new Date(parts[2], parts[1] - 1, parts[0]);
        } else if (format.includes('F') || format.includes('M')) {
            // Handle text month formats
            date = new Date(value);
        } else {
            // Default parsing
            date = new Date(value);
        }
        
        // Validate the date is valid
        if (isNaN(date.getTime())) {
            return { valid: false };
        }
        
        // Additional checks for specific formats
        if (format === 'Y-m-d' || format === 'YYYY-MM-DD') {
            const formatted = date.toISOString().split('T')[0];
            const normalizedValue = value.length === 8 ? 
                `${value.slice(0,4)}-${value.slice(4,6).padStart(2,'0')}-${value.slice(6,8).padStart(2,'0')}` : 
                value;
            return { valid: formatted === normalizedValue || formatted === value };
        }
        
        // For month/year validation
        if (format.match(/^m{1,2}[-\/]Y{4}$/)) {
            const parts = value.split(/[-\/]/);
            const month = parseInt(parts[0]);
            return { valid: month >= 1 && month <= 12 };
        }
        
        return { valid: true };
        
    } catch (error) {
        return { valid: false };
    }
}

function validateAfter(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const compareDate = new Date(parameters[0]);
    const valueDate = new Date(value);
    
    if (isNaN(compareDate.getTime()) || isNaN(valueDate.getTime())) {
        return { valid: false };
    }
    
    return { valid: valueDate > compareDate };
}

function validateBefore(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const compareDate = new Date(parameters[0]);
    const valueDate = new Date(value);
    
    if (isNaN(compareDate.getTime()) || isNaN(valueDate.getTime())) {
        return { valid: false };
    }
    
    return { valid: valueDate < compareDate };
}

function validateAfterOrEqual(value, parameters, form, attributeType) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    let compareDate;
    
    // Check if parameter is a field name
    const compareElement = form.querySelector(`[${attributeType}="${parameters[0]}"]`);
    if (compareElement) {
        const compareValue = getFieldValue(compareElement);
        compareDate = new Date(compareValue);
    } else {
        compareDate = new Date(parameters[0]);
    }
    
    const valueDate = new Date(value);
    
    if (isNaN(compareDate.getTime()) || isNaN(valueDate.getTime())) {
        return { valid: false };
    }
    
    return { valid: valueDate >= compareDate };
}

function validateBeforeOrEqual(value, parameters, form, attributeType) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    let compareDate;
    
    // Check if parameter is a field name
    const compareElement = form.querySelector(`[${attributeType}="${parameters[0]}"]`);
    if (compareElement) {
        const compareValue = getFieldValue(compareElement);
        compareDate = new Date(compareValue);
    } else {
        compareDate = new Date(parameters[0]);
    }
    
    const valueDate = new Date(value);
    
    if (isNaN(compareDate.getTime()) || isNaN(valueDate.getTime())) {
        return { valid: false };
    }
    
    return { valid: valueDate <= compareDate };
}

function validateWeekend(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const date = new Date(value);
    if (isNaN(date.getTime())) return { valid: false };
    
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    return { valid: dayOfWeek === 0 || dayOfWeek === 6 };
}

function validateTime(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return { valid: timeRegex.test(value) };
}

function validateUrl(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    try {
        new URL(value);
        return { valid: true };
    } catch {
        return { valid: false };
    }
}

function validateBoolean(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const booleanValues = ['true', 'false', '1', '0', 1, 0, true, false];
    return { valid: booleanValues.includes(value) };
}

function validateConfirmed(value, element, form, attributeType) {
    const confirmationFieldName = element.getAttribute(attributeType) + '_confirmation';
    const confirmationElement = form.querySelector(`[${attributeType}="${confirmationFieldName}"]`);
    
    if (!confirmationElement) {
        return { valid: false, message: 'Confirmation field not found' };
    }
    
    const confirmationValue = getFieldValue(confirmationElement);
    return { valid: value === confirmationValue };
}

function validateAlpha(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const alphaRegex = /^[a-zA-Z]+$/;
    return { valid: alphaRegex.test(value) };
}

function validateAlphaNum(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const alphaNumRegex = /^[a-zA-Z0-9]+$/;
    return { valid: alphaNumRegex.test(value) };
}

function validateSame(value, parameters, form, attributeType) {
    const compareElement = form.querySelector(`[${attributeType}="${parameters[0]}"]`);
    
    if (!compareElement) {
        return { valid: false, message: 'Comparison field not found' };
    }
    
    const compareValue = getFieldValue(compareElement);
    return { valid: value === compareValue };
}

function validateDifferent(value, parameters, form, attributeType) {
    const compareElement = form.querySelector(`[${attributeType}="${parameters[0]}"]`);
    
    if (!compareElement) {
        return { valid: true }; // If comparison field doesn't exist, validation passes
    }
    
    const compareValue = getFieldValue(compareElement);
    return { valid: value !== compareValue };
}

function validateIn(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    return { valid: parameters.includes(String(value)) };
}

function validateNotIn(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    return { valid: !parameters.includes(String(value)) };
}

function validateRegex(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    try {
        const regexString = parameters[0];
        // Remove leading and trailing slashes if present
        const cleanRegex = regexString.replace(/^\/|\/$/g, '');
        const regex = new RegExp(cleanRegex);
        return { valid: regex.test(value) };
    } catch (error) {
        return { valid: false, message: 'Invalid regex pattern' };
    }
}

function validateJson(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    try {
        JSON.parse(value);
        return { valid: true };
    } catch {
        return { valid: false };
    }
}

function validateIp(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    return { 
        valid: validateIpv4(value).valid || validateIpv6(value).valid 
    };
}

function validateIpv4(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const ipv4Regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return { valid: ipv4Regex.test(value) };
}

function validateIpv6(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return { valid: ipv6Regex.test(value) };
}

function validateUuid(value) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return { valid: uuidRegex.test(value) };
}

function validateDigits(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const expectedLength = parseInt(parameters[0]);
    const digitsRegex = /^\d+$/;
    
    return { 
        valid: digitsRegex.test(value) && String(value).length === expectedLength 
    };
}

function validateDigitsBetween(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const minLength = parseInt(parameters[0]);
    const maxLength = parseInt(parameters[1]);
    const digitsRegex = /^\d+$/;
    const length = String(value).length;
    
    return { 
        valid: digitsRegex.test(value) && length >= minLength && length <= maxLength 
    };
}

function validateCurrency(value, parameters) {
    if (value === '' || value === null || value === undefined) return { valid: true };
    
    const maxLength = parameters[0] ? parseInt(parameters[0]) : 16;
    const valueStr = String(value);
    
    if (valueStr.length > maxLength) {
        return { valid: false };
    }
    
    if (/[eE]/.test(valueStr)) {
        return { valid: false };
    }
    
    // Currency regex: only numbers, comma, and dot
    // Allows patterns like: 123, 123.45, 1,234.56, 1234, .50, etc.
    const currencyRegex = /^[0-9,\.]+$/;
    
    if (!currencyRegex.test(valueStr)) {
        return { valid: false };
    }
    
    const parts = valueStr.split('.');
    
    if (parts.length > 2) {
        return { valid: false };
    }
    
    if (parts.length === 2) {
        const decimalPart = parts[1];
        if (!/^\d+$/.test(decimalPart)) {
            return { valid: false };
        }
    }
    
    const integerPart = parts[0];
    if (!/^[0-9,]*$/.test(integerPart)) {
        return { valid: false };
    }
    
    return { valid: true };
}

/**
    * Get error message for a validation rule
    * @param {string} fieldName - Field name
    * @param {Object} rule - Rule object
    * @param {Object} fieldMessages - Custom field messages
    * @param {string} fieldLabel - Field label
    * @param {string} customMessage - Custom error message from validation
    * @returns {string} - Error message
    */
function getErrorMessage(fieldName, rule, fieldMessages, fieldLabel, customMessage) {
    const { name, parameters } = rule;
    
    // Check for custom message for this specific rule
    if (fieldMessages[name]) {
        return fieldMessages[name].replace(':label', fieldLabel);
    }
    
    // Use custom message from validation if available
    if (customMessage) {
        return customMessage;
    }
    
    // Default messages
    const defaultMessages = {
        required: `The ${fieldLabel} field is required.`,
        required_if: `The ${fieldLabel} field is required when specified conditions are met.`,
        string: `The ${fieldLabel} field must be a string.`,
        numeric: `The ${fieldLabel} field must be a number.`,
        integer: `The ${fieldLabel} field must be an integer.`,
        email: `The ${fieldLabel} field must be a valid email address.`,
        array: `The ${fieldLabel} field must be an array.`,
        file: `The ${fieldLabel} field must be a file.`,
        size: `The ${fieldLabel} file size must not exceed ${parameters[0] || 8}MB.`,
        mimes: `The ${fieldLabel} file must be a file of type: ${parameters.join(', ')}.`,
        min: `The ${fieldLabel} field must be at least ${parameters[0]}.`,
        max: `The ${fieldLabel} field must not be greater than ${parameters[0]}.`,
        between: `The ${fieldLabel} field must be between ${parameters[0]} and ${parameters[1]}.`,
        date: `The ${fieldLabel} field must be a valid date.`,
        date_format: `The ${fieldLabel} field must match the format ${parameters[0]}.`,
        after: `The ${fieldLabel} field must be a date after ${parameters[0]}.`,
        before: `The ${fieldLabel} field must be a date before ${parameters[0]}.`,
        after_or_equal: `The ${fieldLabel} field must be a date after or equal to ${parameters[0]}.`,
        before_or_equal: `The ${fieldLabel} field must be a date before or equal to ${parameters[0]}.`,
        weekend: `The ${fieldLabel} field must be a weekend date.`,
        time: `The ${fieldLabel} field must be a valid time.`,
        url: `The ${fieldLabel} field must be a valid URL.`,
        boolean: `The ${fieldLabel} field must be true or false.`,
        confirmed: `The ${fieldLabel} confirmation does not match.`,
        alpha: `The ${fieldLabel} field must contain only letters.`,
        alpha_num: `The ${fieldLabel} field must contain only letters and numbers.`,
        same: `The ${fieldLabel} field must match ${parameters[0]}.`,
        different: `The ${fieldLabel} field must be different from ${parameters[0]}.`,
        in: `The selected ${fieldLabel} is invalid.`,
        not_in: `The selected ${fieldLabel} is invalid.`,
        regex: `The ${fieldLabel} field format is invalid.`,
        json: `The ${fieldLabel} field must be a valid JSON string.`,
        ip: `The ${fieldLabel} field must be a valid IP address.`,
        ipv4: `The ${fieldLabel} field must be a valid IPv4 address.`,
        ipv6: `The ${fieldLabel} field must be a valid IPv6 address.`,
        uuid: `The ${fieldLabel} field must be a valid UUID.`,
        digits: `The ${fieldLabel} field must be ${parameters[0]} digits.`,
        digits_between: `The ${fieldLabel} field must be between ${parameters[0]} and ${parameters[1]} digits.`
    };
    
    return defaultMessages[name] || `The ${fieldLabel} field is invalid.`;
}

/**
 * Show errors using toastr if available, fallback to DOM manipulation
 * @param {Object} errorMessages - Error messages
 * @param {string} mode - Display mode ('single' or 'multi')
 */
function showToastrErrors(errorMessages, mode = 'single') {
    // Check if toastr is available
    if (typeof toastr !== 'undefined') {
        let optionsToastr = {
            enableHtml: true,
            closeButton: true,
            debug: false,
            newestOnTop: true,
            progressBar: true,
            positionClass: "toast-top-right",
            preventDuplicates: true,
            showDuration: "850",
            hideDuration: "1000",
            timeOut: "5000",
            extendedTimeOut: "1000",
            showEasing: "swing",
            hideEasing: "linear",
            showMethod: "fadeIn",
            hideMethod: "fadeOut"
        };

        if (mode === 'single') {
            const errorList = Object.values(errorMessages);
            if (errorList.length > 0) {
                // Show all errors in a single toastr notification with ul/li format
                const errorText = `<ul style="margin: 0; padding-left: 20px; line-height: 1.5;">${errorList.map(error => `<li style="margin-bottom: 5px;">${error}</li>`).join('')}</ul>`;
                toastr.error(errorText, 'Validation Errors', optionsToastr);
            }
        } else {
            // Multi mode - show each error separately
            Object.values(errorMessages).forEach(error => {
                toastr.error(error, 'Error', optionsToastr);
            });
        }
    } else {
        // Fallback to original DOM manipulation if toastr is not available
        const messagesDiv = document.getElementById('validation_messages');
        if (!messagesDiv) {
            console.warn('Neither toastr nor #validation_messages element found for displaying errors');
            return;
        }
        
        messagesDiv.innerHTML = '';
        
        if (mode === 'single') {
            const errorList = Object.values(errorMessages);
            if (errorList.length > 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-list';
                errorDiv.innerHTML = `
                    <strong>Validation Errors:</strong>
                    <ul>
                        ${errorList.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                `;
                messagesDiv.appendChild(errorDiv);
            }
        } else {
            // Multi mode - show each error separately
            Object.values(errorMessages).forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-list';
                errorDiv.innerHTML = `<strong>Error:</strong> ${error}`;
                messagesDiv.appendChild(errorDiv);
            });
        }
    }
}