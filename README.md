# Validation.js Documentation

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/vanilla-JS-yellow.svg" alt="Vanilla JS">
  <img src="https://img.shields.io/badge/dependencies-none-brightgreen.svg" alt="No Dependencies">
  <img src="https://img.shields.io/badge/browser-compatible-orange.svg" alt="Browser Compatible">
</div>

<p align="center">A powerful, lightweight JavaScript form validation library inspired by Laravel's validation syntax.</p>

---

## Overview

Validation.js is a comprehensive client-side form validation library designed for modern web applications. Built with pure vanilla JavaScript and zero dependencies, it offers a developer-friendly experience while ensuring robust form validation for end-users.

### Why Choose Validation.js?

- **Laravel-Inspired Syntax**: Familiar, elegant validation rules that are easy to read and maintain
- **Lightweight & Fast**: Optimized code with no external dependencies for maximum performance
- **Comprehensive Rule Set**: 40+ built-in validation rules covering all common (and uncommon) scenarios
- **Fully Customizable**: Custom error messages, placeholders, and flexible error display options
- **Browser Compatible**: Works across all modern browsers including Chrome, Firefox, Safari, and Edge
- **Accessible**: Designed with accessibility in mind for better user experience
- **Cross-Field Validation**: Compare fields, conditional validation, and complex validation scenarios

Validation.js provides an elegant, expressive API for validating form inputs on the client-side, helping you create better user experiences while reducing server load and improving form completion rates.

## Table of Contents

- [Overview](#overview)
  - [Why Choose Validation.js?](#why-choose-validationjs)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Main Functions](#main-functions)
- [Validation Rules](#validation-rules)
  - [Basic Rules](#basic-rules)
  - [Numeric Rules](#numeric-rules)
  - [Size Rules](#size-rules)
  - [Format Rules](#format-rules)
  - [Date and Time Rules](#date-and-time-rules)
  - [File Rules](#file-rules)
  - [Comparison Rules](#comparison-rules)
  - [Selection Rules](#selection-rules)
  - [Data Type Rules](#data-type-rules)
  - [Network Rules](#network-rules)
  - [Identifier Rules](#identifier-rules)
- [Custom Messages](#custom-messages)
  - [Custom Message Placeholders](#custom-message-placeholders)
- [Array Field Validation](#array-field-validation)
- [Advanced Usage](#advanced-usage)
  - [Using ID Attributes Instead of Name](#using-id-attributes-instead-of-name)
  - [Conditional Validation](#conditional-validation)
  - [File Upload Validation](#file-upload-validation)
  - [Complex Date Format Validation](#complex-date-format-validation)
  - [International Date Format Examples](#international-date-format-examples)
- [Interactive Examples](#interactive-examples)
  - [Complete Registration Form](#complete-registration-form-with-advanced-validation)
  - [Event Booking Form](#event-booking-form-with-complex-datetime-validation)
  - [E-commerce Product Form](#e-commerce-product-form)
- [Error Handling](#error-handling)
- [Debug Mode](#debug-mode)
- [Browser Compatibility](#browser-compatibility)
- [License](#license)

## Installation

Validation.js is designed to be simple to integrate into any web project. Choose the installation method that best fits your workflow:

### Basic Installation

Simply include the `validation.js` file in your HTML:

```html
<script src="js/validation.js"></script>
```

### CDN Installation

For quick prototyping or production use, you can include Validation.js directly from a CDN:

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/gh/faizzul95/ValidationJs@latest/js/validation.js"></script>
```

## Quick Start

Get up and running with Validation.js in minutes:

<details open>
<summary><strong>Basic Implementation</strong></summary>

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validation.js Demo</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; }
        form { margin: 20px 0; }
        label { display: block; margin: 10px 0 5px; font-weight: 500; }
        input { width: 100%; padding: 8px; margin-bottom: 5px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #4a90e2; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #3a7bc8; }
        .error { border-color: #e74c3c; background-color: #fff8f8; }
        .error-message { color: #e74c3c; font-size: 0.85rem; }
    </style>
</head>
<body>
    <h1>Validation.js Demo</h1>
    
    <form id="myForm">
        <div>
            <label for="username">Username</label>
            <input type="text" id="username" name="username" placeholder="Choose a username">
        </div>
        
        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Your email address">
        </div>
        
        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Create a password">
        </div>
        
        <div>
            <label for="password_confirmation">Confirm Password</label>
            <input type="password" id="password_confirmation" name="password_confirmation" placeholder="Confirm your password">
        </div>
        
        <button type="submit">Submit</button>
    </form>

    <div id="validation_messages"></div>

    <!-- Include the library -->
    <script src="js/validation.js"></script>
    
    <script>
        document.getElementById('myForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Define validation rules
            const rules = {
                'username': 'required|alpha_dash|min:3|max:20',
                'email': 'required|email',
                'password': 'required|min_length:8|confirmed'
            };
            
            // Define custom error messages (optional)
            const messages = {
                'username': {
                    'required': 'Please enter your username',
                    'alpha_dash': 'Username may only contain letters, numbers, dashes and underscores',
                    'min': 'Username must be at least :min characters'
                },
                'password': {
                    'min_length': 'Password must be at least :param[0] characters',
                    'confirmed': 'Password confirmation does not match'
                }
            };
            
            // Run validation
            if (validationJs('myForm', rules, messages)) {
                // Form is valid
                document.getElementById('validation_messages').innerHTML = 
                    '<div style="background:#d4edda;color:#155724;padding:10px;border-radius:4px;margin-top:20px;">' +
                    'Form submitted successfully!</div>';
            } else {
                // Show errors
                const errors = validationJsError('raw');
                
                // Clear previous error messages
                document.querySelectorAll('.error-message').forEach(el => el.remove());
                document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
                
                // Display errors next to each field
                for (let field in errors) {
                    const input = document.querySelector(`[name="${field}"]`);
                    if (input) {
                        input.classList.add('error');
                        
                        const errorSpan = document.createElement('div');
                        errorSpan.className = 'error-message';
                        errorSpan.textContent = errors[field];
                        
                        input.parentNode.insertBefore(errorSpan, input.nextSibling);
                    }
                }
            }
        });
    </script>
</body>
</html>
```
</details>

## API Reference

Validation.js provides a simple, intuitive API that makes form validation straightforward while offering powerful capabilities.

### Main Functions

<details open>
<summary><strong>Core Validation Functions</strong></summary>

#### `validationJs(formElement, rules, messages, attributeType)`

Main validation function that validates a form against specified rules.

**Parameters:**
- `formElement` (HTMLElement|string): Form element or form ID
- `rules` (Object): Validation rules object
- `messages` (Object): Custom error messages (optional)
- `attributeType` (string): Attribute type to use ('name' or 'id', default: 'name')

**Returns:** `boolean` - True if validation passes

**Example:**
```javascript
const form = document.getElementById('myForm');
const rules = {
    'email': 'required|email',
    'password': 'required|min:8'
};

if (validationJs(form, rules)) {
    console.log('Form is valid!');
}
```
</details>

<details>
<summary><strong>Error Handling Functions</strong></summary>

#### `validationJsError(type, mode)`

Retrieves validation errors for display.

**Parameters:**
- `type` (string): Error display type ('raw' or 'toastr', default: 'raw')
- `mode` (string): Display mode ('single' or 'multi', default: 'single')

**Returns:** 
- When `type='raw'`: `Object` - Error messages object with field names as keys
- When `type='toastr'`: Displays error messages using toastr notifications

**Example:**
```javascript
// Get raw error messages
const errors = validationJsError('raw');
console.log(errors); // { email: 'Email is required', password: 'Password is too short' }

// Display errors with toastr
validationJsError('toastr', 'multi');
```
</details>

<details>
<summary><strong>Debug Functions</strong></summary>

#### `validationJsDebug(enable)`

Enables or disables detailed validation debugging.

**Parameters:**
- `enable` (boolean): Enable debug mode (default: true)

**Example:**
```javascript
// Enable debugging
validationJsDebug(true);

// Run validation with debug information logged to console
validationJs('myForm', rules);
```

Debug output includes:
- Field values being validated
- Rules being applied
- Parameters and constraints
- Validation logic decision points
- Error message generation

This is invaluable for troubleshooting complex validation scenarios.
</details>

### Function Flow

The typical flow of using the Validation.js API is:

1. **Define validation rules** for your form fields
2. **Optionally define custom messages** for specific error conditions
3. **Call `validationJs()`** with your form and rules
4. **Check the return value** to determine if validation passed
5. If validation fails, **call `validationJsError()`** to retrieve or display the errors

## Validation Rules

<details open>
<summary><strong>Rules Quick Reference</strong></summary>

| Category | Rules |
|----------|-------|
| **Basic** | `required`, `nullable`, `sometimes`, `required_if`, `required_with`, `required_unless`, `accepted`, `string` |
| **Numeric** | `numeric`, `integer`, `decimal`, `currency`, `digits`, `digits_between` |
| **Size** | `min`, `max`, `min_length`, `max_length`, `between`, `size`, `gt`, `lt`, `lte` |
| **Format** | `email`, `url`, `alpha`, `alpha_num`, `alpha_dash`, `lowercase`, `uppercase`, `regex` |
| **Date & Time** | `date`, `date_format`, `after`, `before`, `after_or_equal`, `before_or_equal`, `weekend`, `time` |
| **File** | `file`, `image`, `dimensions`, `mimes` |
| **Comparison** | `same`, `different`, `confirmed` |
| **Selection** | `in`, `not_in` |
| **Data Type** | `array`, `boolean`, `json` |
| **Content** | `contains`, `doesnt_contain` |
| **Network** | `ip`, `ipv4`, `ipv6` |
| **Identifier** | `uuid` |
</details>

### Basic Rules

#### `required`
The field must be present and not empty.

```javascript
const rules = {
    'username': 'required'
};
```

#### `nullable`
The field can be null or empty. This is useful when combined with other rules.

```javascript
const rules = {
    'middle_name': 'nullable|string|max:50'
};
```

#### `sometimes`
The field will only be validated if it is present.

```javascript
const rules = {
    'middle_name': 'sometimes|string|max:50'
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

#### `required_with:field`
The field is required when the specified other field is present and not empty.

```javascript
const rules = {
    'last_name': 'required_with:first_name'
};
```

#### `required_unless:field,value`
The field is required unless the other field equals the given value.

```javascript
const rules = {
    'phone': 'required_unless:contact_preference,email'
};
```

#### `accepted`
The field must be "yes", "on", 1, or true. Useful for terms of service acceptance.

```javascript
const rules = {
    'terms': 'accepted'
};
```

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

#### `decimal` / `decimal:min,max`
The field must be a number with a decimal point, optionally with specified min and max decimal places.

```javascript
const rules = {
    'amount': 'decimal',      // Any decimal number
    'price': 'decimal:2,2',   // Must have exactly 2 decimal places
    'rate': 'decimal:0,4'     // Can have up to 4 decimal places
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

#### `min_length:value`
The field must have at least the specified number of characters.

```javascript
const rules = {
    'password': 'min_length:8'  // Minimum 8 characters
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

#### `max_length:value`
The field must not exceed the specified number of characters.

```javascript
const rules = {
    'username': 'max_length:50'  // Maximum 50 characters
};
```

#### `gt:value` (Greater Than)
The field must be greater than the specified value or another field's value.

```javascript
const rules = {
    'adults': 'gt:0',              // Must be greater than 0
    'max_guests': 'gt:min_guests'  // Must be greater than min_guests field
};
```

#### `lt:value` (Less Than)
The field must be less than the specified value or another field's value.

```javascript
const rules = {
    'age': 'lt:100',               // Must be less than 100
    'discount': 'lt:total_price'   // Must be less than total_price field
};
```

#### `lte:value` (Less Than or Equal)
The field must be less than or equal to the specified value or another field's value.

```javascript
const rules = {
    'age': 'lte:65',                // Must be less than or equal to 65
    'discount': 'lte:total_price'   // Must be less than or equal to total_price field
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

#### `alpha_dash`
The field must contain only alphabetic characters, numbers, dashes, and underscores.

```javascript
const rules = {
    'slug': 'alpha_dash'
};
```

#### `lowercase`
The field must be entirely lowercase.

```javascript
const rules = {
    'username': 'string|lowercase'
};
```

#### `uppercase`
The field must be entirely uppercase.

```javascript
const rules = {
    'country_code': 'string|uppercase'
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

#### `image`
The field must be an image file (jpg, jpeg, png, bmp, gif, svg, or webp).

```javascript
const rules = {
    'avatar': 'required|image'
};
```

#### `dimensions:min_width=100,max_width=1000,min_height=100,max_height=1000,width=800,height=600`
For image files, validates the dimensions of the image. All parameters are optional. This validation works client-side only for supported image types (jpeg, png, gif, webp, bmp).

```javascript
const rules = {
    'avatar': 'image|dimensions:min_width=100,max_width=800,min_height=100,max_height=800',
    'banner': 'image|dimensions:min_width=1200,min_height=400',
    'profile_picture': 'image|dimensions:width=400,height=400',  // Exact dimensions (square)
    'thumbnail': 'image|dimensions:max_width=300,max_height=300'
};
```

**Supported Parameters:**
- `min_width`: Minimum width in pixels
- `max_width`: Maximum width in pixels
- `min_height`: Minimum height in pixels
- `max_height`: Maximum height in pixels
- `width`: Exact width in pixels
- `height`: Exact height in pixels
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

#### `contains:value`
The field must contain the specified substring or value.

```javascript
const rules = {
    'email': 'contains:@company.com',
    'username': 'contains:admin'
};
```

#### `doesnt_contain:value`
The field must not contain the specified substring or value.

```javascript
const rules = {
    'username': 'doesnt_contain:admin,root,system',
    'password': 'doesnt_contain:password,123456'
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

### Custom Message Placeholders

You can use placeholders in your custom messages for more dynamic error messages:

```javascript
const rules = {
    'email': 'required|email',
    'username': 'required|min:3|max:20',
    'age': 'required|integer|between:18,65',
    'profile_image': 'required|image|dimensions:min_width=200,min_height=200',
    'skills[]': 'required|array|min:2'
};

const messages = {
    'email': {
        'required': 'Please enter your :label',
        'email': 'The :attribute format is invalid'
    },
    'username': {
        'min': 'The :field must be at least :min characters',
        'max': 'The :field cannot be longer than :max characters'
    },
    'age': {
        'between': 'Age must be between :min_value and :max_value years'
    },
    'profile_image': {
        'dimensions': 'Image must be at least :min_width x :min_height pixels'
    },
    'skills[]': {
        'min': 'Please select at least :param[0] skills'
    }
};
```

#### Basic Placeholders

- `:label` - The field label (defined in messages object or auto-generated)
- `:attribute` - Alternative name for the field label
- `:field` - The actual field name
- `:value` - The input value (generic representation)

#### Parameter Placeholders

- `:param[0]`, `:param[1]`, etc. - For indexed access to rule parameters
- `:min` - First parameter (commonly used for minimum values)
- `:max` - Second parameter or first parameter (commonly used for maximum values)

#### Rule-Specific Placeholders

- For `between`: `:min_value` and `:max_value`
- For `mimes`, `in`, and `not_in`: `:values` for the list of allowed values
- For `dimensions`: Dynamically creates placeholders like `:min_width`, `:max_height`, `:width`, `:height`, etc.
- For `gt`, `lt`, `lte`: `:value` for the comparison value

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

## Interactive Examples

### Complete Registration Form with Advanced Validation

This example demonstrates a comprehensive registration form with all validation features including custom placeholders, multiple validation rules, file validation, and conditional validation.

<details>
<summary><strong>Click to view HTML</strong></summary>

```html
<form id="registrationForm">
    <div class="form-row">
        <div class="form-group">
            <label for="first_name">First Name</label>
            <input type="text" name="first_name" id="first_name" placeholder="Enter your first name">
        </div>
        <div class="form-group">
            <label for="last_name">Last Name</label>
            <input type="text" name="last_name" id="last_name" placeholder="Enter your last name">
        </div>
    </div>
    
    <div class="form-row">
        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" name="email" id="email" placeholder="your.email@example.com">
        </div>
        <div class="form-group">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" placeholder="Choose a username">
            <small>Letters, numbers, dashes, and underscores only</small>
        </div>
    </div>
    
    <div class="form-row">
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" placeholder="Choose a password">
        </div>
        <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input type="password" name="password_confirmation" id="password_confirmation" placeholder="Confirm your password">
        </div>
    </div>
    
    <div class="form-row">
        <div class="form-group">
            <label for="birth_date">Birth Date</label>
            <input type="date" name="birth_date" id="birth_date">
        </div>
        <div class="form-group">
            <label for="country">Country</label>
            <select name="country" id="country">
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
            </select>
        </div>
    </div>
    
    <div class="form-group">
        <label for="bio">Short Bio (optional)</label>
        <textarea name="bio" id="bio" rows="3" placeholder="Tell us about yourself"></textarea>
        <small>URLs are not allowed</small>
    </div>
    
    <div class="form-group">
        <label for="profile_image">Profile Image</label>
        <input type="file" name="profile_image" id="profile_image" accept="image/*">
        <small>Square image, minimum 200×200px</small>
    </div>
    
    <div class="form-group">
        <label for="website">Website (optional)</label>
        <input type="url" name="website" id="website" placeholder="https://yourwebsite.com">
    </div>
    
    <div class="form-check">
        <input type="checkbox" name="terms" id="terms" value="1">
        <label for="terms">I agree to the terms and conditions</label>
    </div>
    
    <div class="form-group">
        <button type="submit" class="btn-submit">Register Account</button>
    </div>
</form>

<div id="validation_messages"></div>
```
</details>

<details>
<summary><strong>Click to view CSS</strong></summary>

```css
/* Modern form styling */
.form-row {
    display: flex;
    margin-bottom: 1rem;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1rem;
    flex: 1;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group small {
    display: block;
    color: #666;
    margin-top: 0.25rem;
    font-size: 0.8rem;
}

.form-check {
    margin: 1rem 0;
}

.btn-submit {
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn-submit:hover {
    background-color: #3a7bc8;
}

/* Error styling */
.error {
    border: 1px solid #e74c3c !important;
    background-color: rgba(231, 76, 60, 0.05);
}

.error-message {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.error-list {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    padding: 1rem;
    margin: 1rem 0;
    color: #721c24;
}

.error-list ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.25rem;
}
```
</details>

<details open>
<summary><strong>Click to view JavaScript</strong></summary>

```javascript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        
        // Define validation rules
        const rules = {
            'first_name': 'required|string|min:2|max:50|alpha_dash',
            'last_name': 'required|string|min:2|max:50|alpha_dash',
            'email': 'required|email|contains:@',
            'password': 'required|string|min_length:8|confirmed|doesnt_contain:password,123456',
            'birth_date': 'required|date|before:today',
            'website': 'nullable|url',
            'username': 'required|alpha_dash|lowercase|min:3|max:20',
            'profile_image': 'required|image|dimensions:min_width=200,min_height=200,width=400,height=400',
            'bio': 'sometimes|string|max_length:500|doesnt_contain:http,www',
            'country': 'required|in:US,CA,UK,AU',
            'terms': 'accepted'
        };
        
        // Define custom error messages with placeholders
        const messages = {
            'first_name': {
                'required': ':label is required',
                'min': ':label must be at least :min characters',
                'alpha_dash': ':label may only contain letters, numbers, dashes and underscores',
                'label': 'First Name'
            },
            'last_name': {
                'required': ':label is required',
                'min': ':label must be at least :min characters',
                'alpha_dash': ':label may only contain letters, numbers, dashes and underscores',
                'label': 'Last Name'
            },
            'email': {
                'required': 'Email address is required',
                'email': 'Please enter a valid email address',
                'contains': 'The email must contain an @ symbol'
            },
            'password': {
                'required': 'Password is required',
                'min_length': 'Password must be at least :param[0] characters long',
                'confirmed': 'Password confirmation does not match',
                'doesnt_contain': 'Password cannot contain common phrases like :values'
            },
            'birth_date': {
                'required': 'Birth date is required',
                'before': 'Birth date must be in the past'
            },
            'username': {
                'required': 'Username is required',
                'alpha_dash': 'Username may only contain letters, numbers, dashes and underscores',
                'lowercase': 'Username must be lowercase',
                'min': 'Username must be at least :min characters',
                'max': 'Username cannot exceed :max characters'
            },
            'profile_image': {
                'required': 'Profile image is required',
                'image': 'The uploaded file must be an image',
                'dimensions': 'Profile image must be at least :min_width x :min_height pixels and exactly :width x :height pixels'
            },
            'bio': {
                'max_length': 'Bio cannot exceed :param[0] characters',
                'doesnt_contain': 'Bio cannot contain URLs'
            },
            'country': {
                'required': 'Please select your country',
                'in': 'Please select a valid country from: :values'
            },
            'terms': {
                'accepted': 'You must agree to the terms and conditions'
            }
        };
        
        // Run validation
        if (validationJs('registrationForm', rules, messages)) {
            // Show success message
            const messageDiv = document.getElementById('validation_messages');
            messageDiv.innerHTML = `
                <div style="background-color: #d4edda; color: #155724; padding: 1rem; border-radius: 4px; margin-top: 1rem;">
                    <strong>Success!</strong> Your registration has been processed.
                </div>
            `;
            
            // In real applications, you would submit the form data
            console.log('Form submitted successfully');
            // form.submit();
        } else {
            // Display errors
            const errors = validationJsError('raw');
            
            // Display errors next to each field
            for (let field in errors) {
                const baseField = field.replace(/_\d+$/, '[]'); // Convert indexed array fields back
                const fieldName = baseField.replace('[]', '');
                const fieldElement = document.querySelector(`[name="${baseField}"]`) || 
                                    document.querySelector(`[name="${fieldName}"]`);
                
                if (fieldElement) {
                    fieldElement.classList.add('error');
                    
                    const errorSpan = document.createElement('span');
                    errorSpan.className = 'error-message';
                    errorSpan.textContent = errors[field];
                    
                    fieldElement.parentNode.insertBefore(errorSpan, fieldElement.nextSibling);
                }
            }
            
            // Also show errors in the messages div
            const messageDiv = document.getElementById('validation_messages');
            if (messageDiv) {
                let errorHTML = '<div class="error-list"><strong>Please correct the following errors:</strong><ul>';
                for (let field in errors) {
                    errorHTML += `<li>${errors[field]}</li>`;
                }
                errorHTML += '</ul></div>';
                messageDiv.innerHTML = errorHTML;
            }
        }
    });
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

Validation.js provides flexible ways to display and handle validation errors:

<details>
<summary><strong>Getting Raw Errors</strong></summary>

Retrieve a JavaScript object containing all validation errors:

```javascript
if (!validationJs('myForm', rules)) {
    const errors = validationJsError('raw');
    
    // errors will be an object like:
    // {
    //     'email': 'The email field must be a valid email address.',
    //     'password': 'The password field is required.'
    // }
    
    console.log('Validation errors:', errors);
}
```
</details>

<details open>
<summary><strong>Displaying Errors Next to Fields</strong></summary>

Display individual error messages next to each invalid field:

```javascript
if (!validationJs('myForm', rules)) {
    const errors = validationJsError('raw');
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    // Display new errors
    for (let field in errors) {
        const fieldElement = document.querySelector(`[name="${field}"]`);
        if (fieldElement) {
            // Add error class to the field
            fieldElement.classList.add('error');
            
            // Create and insert error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[field];
            fieldElement.parentNode.insertBefore(errorDiv, fieldElement.nextSibling);
        }
    }
}
```
</details>

<details>
<summary><strong>Using Toastr Notifications</strong></summary>

Display errors using toastr notifications (requires toastr library):

```javascript
if (!validationJs('myForm', rules)) {
    // Display all errors in a single toastr notification
    validationJsError('toastr', 'single');
    
    // Or display each error in a separate notification
    // validationJsError('toastr', 'multi');
}
```

> **Note**: If toastr is not available, errors will be displayed in a div with ID `validation_messages`.
</details>

<details>
<summary><strong>Error Summary Block</strong></summary>

Display all errors in a summary block:

```javascript
if (!validationJs('myForm', rules)) {
    const errors = validationJsError('raw');
    const messagesDiv = document.getElementById('validation_messages');
    
    if (messagesDiv) {
        // Create error summary
        let errorHTML = `
            <div class="error-summary">
                <h4>Please correct the following errors:</h4>
                <ul>
                    ${Object.values(errors).map(msg => `<li>${msg}</li>`).join('')}
                </ul>
            </div>
        `;
        
        messagesDiv.innerHTML = errorHTML;
    }
}
```
</details>

<details>
<summary><strong>Advanced: Combining Multiple Approaches</strong></summary>

For the best user experience, combine field-specific errors with a summary:

```javascript
if (!validationJs('myForm', rules)) {
    const errors = validationJsError('raw');
    
    // 1. Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    // 2. Mark fields with errors and show inline messages
    for (let field in errors) {
        const fieldElement = document.querySelector(`[name="${field}"]`);
        if (fieldElement) {
            fieldElement.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errors[field];
            
            fieldElement.parentNode.insertBefore(errorDiv, fieldElement.nextSibling);
            
            // Optionally add aria attributes for accessibility
            fieldElement.setAttribute('aria-invalid', 'true');
            errorDiv.id = `${field}-error`;
            fieldElement.setAttribute('aria-describedby', `${field}-error`);
        }
    }
    
    // 3. Show error summary for screen readers and overall context
    const messagesDiv = document.getElementById('validation_messages');
    if (messagesDiv) {
        const errorCount = Object.keys(errors).length;
        let errorHTML = `
            <div class="error-summary" role="alert">
                <h4>${errorCount} validation ${errorCount === 1 ? 'error' : 'errors'} found:</h4>
                <ul>
                    ${Object.values(errors).map(msg => `<li>${msg}</li>`).join('')}
                </ul>
            </div>
        `;
        
        messagesDiv.innerHTML = errorHTML;
        
        // 4. Scroll to error summary for better visibility
        messagesDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 5. Focus the first field with an error
    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
        firstErrorField.focus();
    }
}
```
</details>

## Debug Mode

<details open>
<summary><strong>Enabling Debug Mode</strong></summary>

For troubleshooting validation issues, Validation.js provides a comprehensive debug mode that logs detailed information about each validation step.

```javascript
// Enable debug mode
validationJsDebug(true);

// Perform validation with debug output
validationJs('myForm', rules, messages);
```

Debug mode provides insights into:
- Each field being validated
- Rules applied to each field
- Parameter values being used
- Validation logic decisions
- Error messages generation

This is invaluable when implementing complex validations or diagnosing unexpected behavior.

```javascript
// Disable debug mode when done
validationJsDebug(false);
```
</details>

<details>
<summary><strong>Troubleshooting with Debug Mode</strong></summary>

Enable debug mode to see detailed validation information in the browser console:

```javascript
// Enable debug mode
validationJsDebug(true);

// Now validation will log detailed information
validationJs('myForm', rules);

// Disable debug mode when done troubleshooting
validationJsDebug(false);
```

Debug mode provides comprehensive information to help diagnose validation issues:

- **Form Information**: Element references and attribute types
- **Rules Analysis**: Parsed validation rules for each field
- **Value Inspection**: Current value of each field being validated
- **Validation Results**: Detailed pass/fail results for each rule
- **Error Messages**: Generated error messages with placeholder replacements
- **Final Status**: Overall validation result

![Debug Console Output](https://via.placeholder.com/800x400?text=Debug+Console+Output)

### Debug Mode Example

```javascript
// Enable debugging for a specific validation
validationJsDebug(true);

// Run validation with logging
if (validationJs('contactForm', rules)) {
    // Process form
    sendFormData();
} else {
    // Handle errors
    displayValidationErrors();
}

// Disable debugging when done
validationJsDebug(false);
```

> **Tip**: Use debug mode during development and testing, but disable it in production environments to avoid console pollution and maintain optimal performance.

</details>

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

<details>
<summary><strong>Compatibility Information</strong></summary>

This validation library works in all modern browsers that support ECMAScript 2015 (ES6) features:

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 51+ |
| Firefox | 54+ |
| Safari | 10+ |
| Edge | 15+ |
| Opera | 38+ |
| iOS Safari | 10.3+ |
| Android Browser | 5.0+ |

**Key JavaScript Features Used:**
- ES6 features (const, let, arrow functions)
- Array methods (map, filter, forEach)
- DOM methods (querySelector, querySelectorAll)
- String template literals

For older browser support, consider using a transpiler like Babel.
</details>

## Best Practices

<details open>
<summary><strong>Form Validation Guidelines</strong></summary>

### Security & UX Best Practices

1. **Always validate on the server**: Client-side validation improves user experience but should never be the only validation. Always implement server-side validation as well.

2. **Use descriptive error messages**: Help users understand exactly what they need to fix with specific, actionable guidance.

3. **Consider validation timing**: 
   - On submit: Validate all fields when the form is submitted
   - On blur: Validate individual fields when they lose focus (after user has finished typing)
   - On input: Real-time validation for certain fields (use sparingly to avoid overwhelming users)

4. **Group related validations**: Use consistent rules and messaging for similar fields across your application.

5. **Test extensively**: 
   - Valid inputs: Ensure valid data passes correctly
   - Edge cases: Test boundary conditions (min/max values, etc.)
   - Special characters: Verify handling of quotes, HTML tags, etc.
   - Accessibility: Test with screen readers and keyboard navigation

6. **Provide visual feedback**: 
   - Use consistent colors and icons for errors
   - Ensure sufficient color contrast for error messages
   - Don't rely on color alone (use icons and text)

7. **Optimize performance**:
   - Disable debug mode in production
   - Avoid excessive DOM manipulation when showing errors
   - Group validation operations when possible
</details>

## Troubleshooting

<details>
<summary><strong>Common Issues & Solutions</strong></summary>

### Validation Not Working

**Issue**: Form validation doesn't seem to trigger or doesn't find fields
**Solutions**:
- Verify that field names in rules match exactly with the `name` attributes in HTML (case-sensitive)
- Check that you're passing the correct form ID or element to `validationJs()`
- Ensure the validation.js script is loaded before any code that uses it
- Check browser console for JavaScript errors
- Enable debug mode to see detailed validation logs: `validationJsDebug(true)`

### Custom Messages Not Displaying

**Issue**: Custom error messages aren't showing up
**Solutions**:
- Verify your messages object structure matches the field names exactly
- Check that rule names in your messages object match the validation rules exactly
- Ensure you're passing the messages object as the third parameter to `validationJs()`

### Array Field Validation Issues

**Issue**: Array fields (like multiple select or checkboxes) aren't validating correctly
**Solutions**:
- Ensure field names end with `[]` in both HTML and validation rules
- Verify that multiple values are properly selected/checked
- For file inputs with multiple files, use `file|min:1` to ensure at least one file is selected

### File Validation Problems

**Issue**: File validation rules aren't working properly
**Solutions**:
- Confirm the input has `type="file"` attribute
- Check that files are actually selected before validation
- For image validation, ensure the file is a valid image format
- For size validation, remember that size is specified in MB
- Enable debug mode to see exact validation results

### Placeholder Replacement Issues

**Issue**: Placeholders in custom messages aren't being replaced
**Solutions**:
- Check that you're using the correct placeholder syntax (e.g., `:label`, `:min`, `:param[0]`)
- Make sure the placeholder corresponds to an available value
- For rule-specific placeholders, verify you're using the correct ones for that rule
</details>

---

## Browser Compatibility

Validation.js is thoroughly tested and compatible with all modern browsers:

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 60+ | Full support for all features |
| Firefox | 55+ | Full support for all features |
| Safari | 11+ | Full support for all features |
| Edge | 79+ (Chromium-based) | Full support for all features |
| Opera | 47+ | Full support for all features |
| iOS Safari | 11+ | Minor limitations with file validation |
| Android Chrome | 60+ | Full support for all features |
| Internet Explorer | 11* | Basic support with polyfills (see notes) |

> *For Internet Explorer 11 compatibility, additional polyfills may be required for:
> - Promise support (required for image dimensions validation)
> - Array.prototype methods (forEach, map, filter, etc.)

## Performance Considerations

Validation.js is optimized for performance while maintaining flexibility:

- **Lazy Loading**: Rule handlers are only invoked when needed
- **Smart Validation**: Stops validation on a field after the first failure (configurable)
- **Efficient DOM Access**: Minimized DOM operations for better performance
- **Optimized Regex**: Performance-tuned regular expressions for validation
- **Memory Efficient**: Minimal memory footprint even with complex forms

### Performance Tips

- Group validation operations when possible
- For very large forms, consider validating sections separately
- For file validation with many large files, use the `dimensions` rule sparingly

---

## License

<details open>
<summary><strong>MIT License</strong></summary>

Copyright (c) 2025 Validation.js

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
</details>

---

<div align="center">
  <p>Made with ❤️ for the JavaScript community</p>
  <p>
    <a href="https://github.com/faizzul95/ValidationJs">GitHub</a> •
    <a href="https://github.com/faizzul95/ValidationJs/issues">Issues</a> •
    <a href="https://github.com/faizzul95/ValidationJs/releases">Releases</a>
  </p>
</div>