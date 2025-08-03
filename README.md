# Validation.js Documentation

A comprehensive JavaScript form validation library that provides Laravel-style validation rules for client-side form validation.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Validation Rules](#validation-rules)
- [Custom Messages](#custom-messages)
- [Array Field Validation](#array-field-validation)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Debug Mode](#debug-mode)

## Installation

Simply include the `validation.js` file in your HTML:

```html
<script src="validation.js"></script>
```

## Quick Start

```html
<form id="myForm">
    <input type="text" name="username" placeholder="Username">
    <input type="email" name="email" placeholder="Email">
    <input type="password" name="password" placeholder="Password">
    <input type="password" name="password_confirmation" placeholder="Confirm Password">
    <button type="submit">Submit</button>
</form>

<div id="validation_messages"></div>

<script>
document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rules = {
        'username': 'required|string|min:3|max:20',
        'email': 'required|email',
        'password': 'required|string|min:8|confirmed'
    };
    
    if (validationJs('myForm', rules)) {
        alert('Form is valid!');
    } else {
        const errors = validationJsError('raw');
        console.log('Validation errors:', errors);
    }
});
</script>
```

## API Reference

### Main Functions

#### `validationJs(formElement, rules, messages, attributeType)`

Main validation function that validates a form against specified rules.

**Parameters:**
- `formElement` (HTMLElement|string): Form element or form ID
- `rules` (Object): Validation rules object
- `messages` (Object): Custom error messages (optional)
- `attributeType` (string): Attribute type to use ('name' or 'id', default: 'name')

**Returns:** `boolean` - True if validation passes

#### `validationJsError(type, mode)`

Retrieves validation errors.

**Parameters:**
- `type` (string): Error display type ('raw' or 'toastr', default: 'raw')
- `mode` (string): Display mode ('single' or 'multi', default: 'single')

**Returns:** `Object` - Error messages object (for 'raw' type)

#### `validationJsDebug(enable)`

Enables or disables debug mode.

**Parameters:**
- `enable` (boolean): Enable debug mode (default: true)

## Validation Rules

### Basic Rules

#### `required`
The field must be present and not empty.

```javascript
const rules = {
    'username': 'required'
};
```

#### `required_if:field,operator,value`
The field is required when another field meets specified conditions.

```javascript
const rules = {
    'phone': 'required_if:contact_method,=,phone'
};
```

**Operators:**
- `=` or `==`: Equal to
- `!=`: Not equal to

#### `string`
The field must be a string.

```javascript
const rules = {
    'name': 'string'
};
```

### Numeric Rules

#### `numeric` / `float` / `double`
The field must be numeric (no scientific notation).

```javascript
const rules = {
    'price': 'numeric'
};
```

#### `integer`
The field must be an integer (no scientific notation).

```javascript
const rules = {
    'age': 'integer'
};
```

#### `currency` / `currency:max_length`
The field must be a valid currency format (numbers, commas, dots only).

```javascript
const rules = {
    'amount': 'currency',        // Max 16 characters (default)
    'price': 'currency:20'       // Max 20 characters
};
```

**Valid formats:** `123`, `123.45`, `1,234.56`, `.50`
**Invalid formats:** `123e5`, `123abc`, `123..45`

### Size Rules

#### `min:value`
The field must have a minimum value/length.

```javascript
const rules = {
    'password': 'min:8',      // Minimum 8 characters
    'age': 'integer|min:18',  // Minimum value 18
    'files': 'file|min:1'     // Minimum 1 file
};
```

#### `max:value`
The field must not exceed maximum value/length.

```javascript
const rules = {
    'username': 'max:50',     // Maximum 50 characters
    'files': 'file|max:5'     // Maximum 5 files
};
```

#### `between:min,max`
The field must be between minimum and maximum values.

```javascript
const rules = {
    'age': 'integer|between:18,65',
    'username': 'string|between:3,20'
};
```

#### `size:value`
For files, specifies maximum file size in MB.

```javascript
const rules = {
    'avatar': 'file|size:2'   // Maximum 2MB
};
```

### Format Rules

#### `email`
The field must be a valid email address.

```javascript
const rules = {
    'email': 'required|email'
};
```

#### `url`
The field must be a valid URL.

```javascript
const rules = {
    'website': 'url'
};
```

#### `alpha`
The field must contain only alphabetic characters.

```javascript
const rules = {
    'name': 'alpha'
};
```

#### `alpha_num`
The field must contain only alphanumeric characters.

```javascript
const rules = {
    'username': 'alpha_num'
};
```

#### `regex:pattern`
The field must match the given regular expression.

```javascript
const rules = {
    'postal_code': 'regex:^[0-9]{5}$'
};
```

### Date and Time Rules

#### `date`
The field must be a valid date.

```javascript
const rules = {
    'birthday': 'date'
};
```

#### `date_format:format`
The field must match the specified date format. This rule supports extensive Laravel-style date format patterns.

```javascript
const rules = {
    'birthday': 'date_format:Y-m-d',
    'event_date': 'date_format:DD/MM/YYYY',
    'meeting_time': 'date_format:H:i',
    'created_at': 'date_format:c'
};
```

**Supported Date Formats:**

##### Basic Date Formats
- `Y-m-d` → `2024-1-15` or `2024-01-15`
- `YYYY-MM-DD` → `2024-01-15`
- `Y/m/d` → `2024/1/15` or `2024/01/15`
- `YYYY/MM/DD` → `2024/01/15`

##### US Date Formats (Month/Day/Year)
- `m/d/Y` → `1/15/2024` or `01/15/2024`
- `MM/DD/YYYY` → `01/15/2024`
- `m-d-Y` → `1-15-2024` or `01-15-2024`
- `MM-DD-YYYY` → `01-15-2024`

##### European Date Formats (Day/Month/Year)
- `d/m/Y` → `15/1/2024` or `15/01/2024`
- `DD/MM/YYYY` → `15/01/2024`
- `d-m-Y` → `15-1-2024` or `15-01-2024`
- `DD-MM-YYYY` → `15-01-2024`
- `d.m.Y` → `15.1.2024` or `15.01.2024`
- `DD.MM.YYYY` → `15.01.2024`

##### Date with Time Formats
- `Y-m-d H:i` → `2024-01-15 14:30`
- `YYYY-MM-DD HH:mm` → `2024-01-15 14:30`
- `Y-m-d H:i:s` → `2024-01-15 14:30:45`
- `YYYY-MM-DD HH:mm:ss` → `2024-01-15 14:30:45`

##### Time Only Formats
- `H:i` → `14:30` or `9:30`
- `HH:mm` → `14:30`
- `H:i:s` → `14:30:45` or `9:30:45`
- `HH:mm:ss` → `14:30:45`
- `h:i A` → `2:30 PM` or `9:30 AM`
- `hh:mm A` → `02:30 PM`

##### ISO and Standard Formats
- `c` → `2024-01-15T14:30:45+00:00` (ISO 8601 with timezone)
- `ISO8601` → `2024-01-15T14:30:45.123Z` (ISO 8601 with milliseconds)

##### Month/Year Formats
- `m/Y` → `1/2024` or `01/2024`
- `MM/YYYY` → `01/2024`
- `m-Y` → `1-2024` or `01-2024`
- `MM-YYYY` → `01-2024`

##### Text Date Formats
- `F j, Y` → `January 15, 2024`
- `M j, Y` → `Jan 15, 2024`
- `j F Y` → `15 January 2024`
- `j M Y` → `15 Jan 2024`

**Examples:**

```javascript
// Basic date validation
const rules = {
    'birth_date': 'date_format:Y-m-d',           // 2024-01-15
    'appointment': 'date_format:DD/MM/YYYY',     // 15/01/2024
    'us_date': 'date_format:MM/DD/YYYY',         // 01/15/2024
    'german_date': 'date_format:DD.MM.YYYY'      // 15.01.2024
};

// Time validation
const rules = {
    'meeting_time': 'date_format:H:i',           // 14:30
    'event_time': 'date_format:h:i A',           // 2:30 PM
    'precise_time': 'date_format:HH:mm:ss'       // 14:30:45
};

// DateTime validation
const rules = {
    'created_at': 'date_format:Y-m-d H:i:s',     // 2024-01-15 14:30:45
    'iso_datetime': 'date_format:c',             // 2024-01-15T14:30:45+00:00
    'timestamp': 'date_format:ISO8601'           // 2024-01-15T14:30:45.123Z
};

// Month/Year validation
const rules = {
    'expiry_date': 'date_format:MM/YYYY',        // 01/2024
    'period': 'date_format:m-Y'                  // 1-2024
};

// Text date validation  
const rules = {
    'event_date': 'date_format:F j, Y',          // January 15, 2024
    'short_date': 'date_format:M j, Y'           // Jan 15, 2024
};
```

**Format Validation Features:**
- ✅ **Strict format matching** - Validates exact format structure
- ✅ **Logical date validation** - Ensures dates are actually valid (no Feb 30th)
- ✅ **Flexible separators** - Supports `/`, `-`, `.` separators
- ✅ **Timezone support** - Handles ISO formats with timezones
- ✅ **12/24 hour formats** - Supports both AM/PM and 24-hour time
- ✅ **International formats** - US, European, and other regional formats
- ✅ **Time-only validation** - Validates time formats independently

#### `after:date`
The field must be a date after the given date.

```javascript
const rules = {
    'end_date': 'date|after:2023-01-01'
};
```

#### `before:date`
The field must be a date before the given date.

```javascript
const rules = {
    'start_date': 'date|before:2024-12-31'
};
```

#### `after_or_equal:date`
The field must be a date after or equal to the given date.

```javascript
const rules = {
    'end_date': 'date|after_or_equal:start_date'  // Can reference another field
};
```

#### `before_or_equal:date`
The field must be a date before or equal to the given date.

```javascript
const rules = {
    'start_date': 'date|before_or_equal:end_date'
};
```

#### `weekend`
The field must be a weekend date (Saturday or Sunday).

```javascript
const rules = {
    'event_date': 'date|weekend'
};
```

#### `time`
The field must be a valid time in HH:MM format.

```javascript
const rules = {
    'meeting_time': 'time'
};
```

### File Rules

#### `file`
The field must be a file upload.

```javascript
const rules = {
    'document': 'required|file'
};
```

#### `mimes:ext1,ext2,ext3`
The file must have one of the specified extensions.

```javascript
const rules = {
    'image': 'file|mimes:jpg,jpeg,png,gif',
    'document': 'file|mimes:pdf,doc,docx'
};
```

### Comparison Rules

#### `same:field`
The field must have the same value as another field.

```javascript
const rules = {
    'password_confirmation': 'same:password'
};
```

#### `different:field`
The field must have a different value from another field.

```javascript
const rules = {
    'new_password': 'different:current_password'
};
```

#### `confirmed`
The field must have a matching confirmation field (field_name + '_confirmation').

```javascript
const rules = {
    'password': 'confirmed'  // Looks for 'password_confirmation' field
};
```

### Selection Rules

#### `in:value1,value2,value3`
The field must be one of the specified values.

```javascript
const rules = {
    'status': 'in:active,inactive,pending'
};
```

#### `not_in:value1,value2,value3`
The field must not be one of the specified values.

```javascript
const rules = {
    'username': 'not_in:admin,root,system'
};
```

### Data Type Rules

#### `array`
The field must be an array or comma-separated string.

```javascript
const rules = {
    'tags': 'array',
    'categories': 'array|min:1|max:5'
};
```

#### `boolean`
The field must be a boolean value.

```javascript
const rules = {
    'terms_accepted': 'boolean'
};
```

**Valid values:** `true`, `false`, `1`, `0`, `'true'`, `'false'`, `'1'`, `'0'`

#### `json`
The field must be a valid JSON string.

```javascript
const rules = {
    'metadata': 'json'
};
```

### Network Rules

#### `ip`
The field must be a valid IP address (IPv4 or IPv6).

```javascript
const rules = {
    'server_ip': 'ip'
};
```

#### `ipv4`
The field must be a valid IPv4 address.

```javascript
const rules = {
    'server_ip': 'ipv4'
};
```

#### `ipv6`
The field must be a valid IPv6 address.

```javascript
const rules = {
    'server_ip': 'ipv6'
};
```

### Identifier Rules

#### `uuid`
The field must be a valid UUID.

```javascript
const rules = {
    'record_id': 'uuid'
};
```

#### `digits:length`
The field must be numeric and have exactly the specified number of digits.

```javascript
const rules = {
    'pin': 'digits:4',
    'phone': 'digits:10'
};
```

#### `digits_between:min,max`
The field must be numeric and have a length between the specified values.

```javascript
const rules = {
    'code': 'digits_between:4,8'
};
```

## Custom Messages

You can provide custom error messages for validation rules:

```javascript
const rules = {
    'email': 'required|email',
    'password': 'required|min:8'
};

const messages = {
    'email': {
        'label': 'Email Address',  // Custom field label
        'required': 'Please enter your email address',
        'email': 'Please enter a valid email address'
    },
    'password': {
        'required': 'Password is required',
        'min': 'Password must be at least 8 characters long',
        'label': 'Password'
    }
};

validationJs('myForm', rules, messages);
```

## Array Field Validation

For array fields (multiple values), append `[]` to the field name:

```html
<select name="categories[]" multiple>
    <option value="tech">Technology</option>
    <option value="sports">Sports</option>
    <option value="news">News</option>
</select>

<input type="checkbox" name="skills[]" value="javascript"> JavaScript
<input type="checkbox" name="skills[]" value="python"> Python
<input type="checkbox" name="skills[]" value="php"> PHP
```

```javascript
const rules = {
    'categories[]': 'required|array|min:1|max:3',
    'skills[]': 'array'
};
```

## Advanced Usage

### Using ID Attributes Instead of Name

```javascript
// Use 'id' attribute instead of 'name'
validationJs('myForm', rules, messages, 'id');
```

### Conditional Validation

```javascript
const rules = {
    'shipping_address': 'required_if:delivery_method,=,shipping',
    'pickup_time': 'required_if:delivery_method,=,pickup'
};
```

### File Upload Validation

```html
<input type="file" name="documents[]" multiple>
```

```javascript
const rules = {
    'documents[]': 'required|file|max:5|size:10|mimes:pdf,doc,docx'
};
```

### Complex Date Format Validation

```javascript
const rules = {
    'birth_date': 'required|date_format:DD/MM/YYYY',
    'appointment_time': 'required|date_format:YYYY-MM-DD HH:mm',
    'expiry_month': 'required|date_format:MM/YYYY',
    'event_time': 'required|date_format:h:i A',
    'iso_timestamp': 'date_format:c'
};

const messages = {
    'birth_date': {
        'date_format': 'Birth date must be in DD/MM/YYYY format (e.g., 15/01/2024)'
    },
    'appointment_time': {
        'date_format': 'Appointment time must be in YYYY-MM-DD HH:mm format (e.g., 2024-01-15 14:30)'
    },
    'expiry_month': {
        'date_format': 'Expiry must be in MM/YYYY format (e.g., 01/2024)'
    },
    'event_time': {
        'date_format': 'Event time must be in 12-hour format with AM/PM (e.g., 2:30 PM)'
    }
};
```

### International Date Format Examples

```javascript
// European formats
const europeanRules = {
    'date_de': 'date_format:DD.MM.YYYY',    // German: 15.01.2024
    'date_uk': 'date_format:DD/MM/YYYY',    // British: 15/01/2024
    'date_fr': 'date_format:DD-MM-YYYY'     // French: 15-01-2024
};

// US formats
const usRules = {
    'date_us': 'date_format:MM/DD/YYYY',    // US: 01/15/2024
    'time_12h': 'date_format:h:i A'         // US time: 2:30 PM
};

// ISO and technical formats
const technicalRules = {
    'api_timestamp': 'date_format:c',                    // ISO 8601: 2024-01-15T14:30:45+00:00
    'log_timestamp': 'date_format:YYYY-MM-DD HH:mm:ss', // Log format: 2024-01-15 14:30:45
    'json_date': 'date_format:ISO8601'                   // JSON: 2024-01-15T14:30:45.123Z
};
```

## Examples

### Complete Registration Form

```html
<form id="registrationForm">
    <input type="text" name="first_name" placeholder="First Name">
    <input type="text" name="last_name" placeholder="Last Name">
    <input type="email" name="email" placeholder="Email">
    <input type="password" name="password" placeholder="Password">
    <input type="password" name="password_confirmation" placeholder="Confirm Password">
    <input type="date" name="birth_date" placeholder="Birth Date">
    <input type="url" name="website" placeholder="Website (optional)">
    <select name="country">
        <option value="">Select Country</option>
        <option value="US">United States</option>
        <option value="CA">Canada</option>
        <option value="UK">United Kingdom</option>
    </select>
    <input type="checkbox" name="terms" value="1"> I agree to terms and conditions
    <button type="submit">Register</button>
</form>

<div id="validation_messages"></div>
```

```javascript
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const rules = {
        'first_name': 'required|string|min:2|max:50',
        'last_name': 'required|string|min:2|max:50',
        'email': 'required|email',
        'password': 'required|string|min:8|confirmed',
        'birth_date': 'required|date|before:today',
        'website': 'url',
        'country': 'required|in:US,CA,UK',
        'terms': 'required|boolean'
    };
    
    const messages = {
        'first_name': {
            'required': 'First name is required',
            'min': 'First name must be at least 2 characters',
            'label': 'First Name'
        },
        'last_name': {
            'required': 'Last name is required',
            'min': 'Last name must be at least 2 characters',
            'label': 'Last Name'
        },
        'email': {
            'required': 'Email address is required',
            'email': 'Please enter a valid email address'
        },
        'password': {
            'required': 'Password is required',
            'min': 'Password must be at least 8 characters',
            'confirmed': 'Password confirmation does not match'
        },
        'birth_date': {
            'required': 'Birth date is required',
            'before': 'Birth date must be in the past'
        },
        'country': {
            'required': 'Please select your country',
            'in': 'Please select a valid country'
        },
        'terms': {
            'required': 'You must agree to the terms and conditions'
        }
    };
    
    if (validationJs('registrationForm', rules, messages)) {
        alert('Registration successful!');
        // Submit form or send AJAX request
    } else {
        // Display errors
        validationJsError('toastr', 'single');
    }
});
```

### Event Booking Form with Complex Date/Time Validation

```html
<form id="eventForm">
    <input type="text" name="event_name" placeholder="Event Name">
    <input type="text" name="start_date" placeholder="Start Date (DD/MM/YYYY)">
    <input type="text" name="start_time" placeholder="Start Time (e.g., 2:30 PM)">
    <input type="text" name="end_date" placeholder="End Date (DD/MM/YYYY)">
    <input type="text" name="end_time" placeholder="End Time (e.g., 5:30 PM)">
    <input type="text" name="registration_deadline" placeholder="Registration Deadline (YYYY-MM-DD)">
    <button type="submit">Book Event</button>
</form>
```

```javascript
const eventRules = {
    'event_name': 'required|string|min:3|max:100',
    'start_date': 'required|date_format:DD/MM/YYYY',
    'start_time': 'required|date_format:h:i A',
    'end_date': 'required|date_format:DD/MM/YYYY',
    'end_time': 'required|date_format:h:i A',
    'registration_deadline': 'required|date_format:YYYY-MM-DD'
};

const eventMessages = {
    'start_date': {
        'date_format': 'Start date must be in DD/MM/YYYY format (e.g., 15/01/2024)'
    },
    'start_time': {
        'date_format': 'Start time must be in 12-hour format with AM/PM (e.g., 2:30 PM)'
    },
    'end_date': {
        'date_format': 'End date must be in DD/MM/YYYY format (e.g., 15/01/2024)'
    },
    'end_time': {
        'date_format': 'End time must be in 12-hour format with AM/PM (e.g., 5:30 PM)'
    },
    'registration_deadline': {
        'date_format': 'Registration deadline must be in YYYY-MM-DD format (e.g., 2024-01-15)'
    }
};
```

### E-commerce Product Form

```html
<form id="productForm">
    <input type="text" name="product_name" placeholder="Product Name">
    <textarea name="description" placeholder="Description"></textarea>
    <input type="text" name="price" placeholder="Price">
    <input type="text" name="discount_price" placeholder="Discount Price (optional)">
    <select name="categories[]" multiple>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
    </select>
    <input type="file" name="images[]" multiple accept="image/*">
    <input type="checkbox" name="featured" value="1"> Featured Product
    <button type="submit">Save Product</button>
</form>
```

```javascript
const rules = {
    'product_name': 'required|string|min:3|max:100',
    'description': 'required|string|min:10|max:1000',
    'price': 'required|currency:10',
    'discount_price': 'currency:10',
    'categories[]': 'required|array|min:1|max:3',
    'images[]': 'file|max:10|size:5|mimes:jpg,jpeg,png,gif',
    'featured': 'boolean'
};

const messages = {
    'product_name': {
        'required': 'Product name is required',
        'min': 'Product name must be at least 3 characters',
        'max': 'Product name cannot exceed 100 characters'
    },
    'price': {
        'required': 'Price is required',
        'currency': 'Please enter a valid price format'
    },
    'categories[]': {
        'required': 'Please select at least one category',
        'max': 'You can select maximum 3 categories'
    },
    'images[]': {
        'max': 'You can upload maximum 10 images',
        'size': 'Each image must be smaller than 5MB',
        'mimes': 'Only JPG, JPEG, PNG, and GIF images are allowed'
    }
};
```

## Error Handling

### Getting Raw Errors

```javascript
if (!validationJs('myForm', rules)) {
    const errors = validationJsError('raw');
    
    // errors will be an object like:
    // {
    //     'email': 'The email field must be a valid email address.',
    //     'password': 'The password field is required.'
    // }
    
    // Display errors next to each field
    for (let field in errors) {
        const errorElement = document.getElementById(field + '_error');
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    }
}
```

### Displaying Errors with Toastr

```javascript
if (!validationJs('myForm', rules)) {
    // This will display errors in the #messages div
    validationJsError('toastr', 'single');  // All errors in one message
    // or
    validationJsError('toastr', 'multi');   // Each error separately
}
```

### Custom Error Display

```javascript
if (!validationJs('myForm', rules)) {
    const errors = validationJsError('raw');
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });
    
    // Display new errors
    for (let field in errors) {
        const fieldElement = document.querySelector(`[name="${field}"]`);
        if (fieldElement) {
            fieldElement.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[field];
            fieldElement.parentNode.insertBefore(errorDiv, fieldElement.nextSibling);
        }
    }
}
```

## Debug Mode

Enable debug mode to see detailed validation information in the console:

```javascript
// Enable debug mode
validationJsDebug(true);

// Now validation will log detailed information
validationJs('myForm', rules);

// Disable debug mode
validationJsDebug(false);
```

Debug output includes:
- Form element being validated
- Rules being applied
- Field values
- Validation results for each rule
- Final validation status

## CSS Styling

The validation library automatically adds an `error` class to fields that fail validation. You can style these fields:

```css
.error {
    border: 1px solid #e74c3c;
    background-color: #fdf2f2;
}

.error-message {
    color: #e74c3c;
    font-size: 12px;
    margin-top: 2px;
}

.error-list {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 10px;
    margin: 10px 0;
    color: #721c24;
}

.error-list ul {
    margin: 5px 0 0 0;
    padding-left: 20px;
}
```

## Browser Support

This validation library works in all modern browsers that support:
- ES6 features (const, let, arrow functions)
- Array methods (map, filter, forEach)
- DOM methods (querySelector, querySelectorAll)

For older browser support, consider using a transpiler like Babel.

## Best Practices

1. **Always validate on the server**: Client-side validation is for user experience only
2. **Use descriptive error messages**: Help users understand what they need to fix
3. **Validate on form submission**: Don't overwhelm users with real-time validation
4. **Group related validations**: Use consistent rules for similar fields
5. **Test with various inputs**: Including edge cases and malicious inputs
6. **Provide visual feedback**: Use CSS to highlight errors clearly

## Troubleshooting

### Common Issues

**Validation not working:**
- Check that field names in rules match the actual form field names
- Ensure the form element is found correctly
- Check browser console for JavaScript errors

**Custom messages not showing:**
- Verify the message object structure matches the field names and rule names
- Check for typos in rule names

**Array validation not working:**
- Ensure field names end with `[]` in both HTML and rules
- Check that multiple values are properly selected/checked

**File validation issues:**
- Ensure input type is `file`
- Check that files are actually selected
- Verify file size and MIME type validation parameters