
if (typeof wFORMS.behaviors.validation.messages === 'undefined') {
    wFORMS.behaviors.validation.messages = {};
};

(function () {
    var key, tmp;
    for (key in (tmp = {
        oneRequired: "This section is required.",
        isRequired: "This field is required.",
        isAlpha: "The text must use alphabetic characters only (a-z, A-Z). Numbers are not allowed.",
        isEmail: "This does not appear to be a valid email address.",
        isInteger: "Please enter a number (without decimals).",
        isFloat: "Please enter a number (e.g. 1.9).",
        isAlphanum: "Please use alpha-numeric characters only [a-z 0-9].",
        isDate: "This does not appear to be a valid date.",
        isDateTime: "This does not appear to be a valid date/time.",
        isTime: "This does not appear to be a valid time.",
        isPhone: "Please enter a valid phone number.",
        isCustom: "Please enter a valid value.",
        isHostname: "This does not appear to be a valid hostname.",
        wordCount: "This field is over the word limit.",
        wordsRemPos: "words remaining",
        wordsRemNeg: "words over the limit",
        notification_0: "The form is not complete and has not been submitted yet. There is %% problem with your submission.",
        notification: "The form is not complete and has not been submitted yet. There are %% problems with your submission.",
        isPasswordStrong: "Please choose a more secure password. Passwords must contain 8 or more characters, with at least 1 letter (a to z), 1 number (0 to 9), and 1 symbol (like \'%\', \'$\' or \'!\').",
        isPasswordMedium: "Please choose a more secure password. Passwords must contain 4 or more characters, with at least 1 letter (a to z) and 1 number (0 to 9).",
        isPasswordWeak: "Your password cannot be empty.",
        isPasswordConfirmed: "Your password and confirmation field did not match.",
        unableToAuthenticate: "Unable to authenticate, please try again.",
        unableToSave: "Unable to save this response.",
        rangeNumber: {
            max: "The value must be smaller than the upper bound %1.",
            min: "The value must be greater than the lower bound %1.",
            both: "The entered value must be between %1 - %2"
        },
        rangeDate: {
            max: "The date must be on or before %1.",
            min: "The date must be on or after %1.",
            both: "This date must be between %1 - %2.",
            cont: "This field determines the date range for %1.",
            dep: "Could not validated date. This field is dependent on %1.",
            link: "another field"
        },
        wait: "Please wait..."
    })) {
        wFORMS.behaviors.validation.messages[key] = tmp[key];
    }
})();

if (typeof wFORMS.footer === 'undefined') {
    wFORMS.footer = {messages: {}};
};

// add translations for new gdpr links
wFORMS.footer.messages = {
    contactInformation: "Contact Information",
    gdprRights: "Your Rights Under GDPR"
}

wFORMS.behaviors.lengthPrompt.messages = "%1 characters left.";

wFORMS.behaviors.repeat.MESSAGES = {
    ADD_CAPTION: "Add another response",
    ADD_TITLE: "Will duplicate this question or section.",
    REMOVE_CAPTION: "Remove",
    REMOVE_TITLE: "Will remove this question or section",
    REMOVE_WARNING: "Are you sure you want to remove this section? All data in this section will be lost."
};



(function () {
    var key, tmp;
    for (key in (tmp = {
        CAPTION_NEXT: 'Next Page',
        CAPTION_PREVIOUS: 'Previous Page',
        CAPTION_UNLOAD: 'Any data entered on ANY PAGE of this form will be LOST',
        NAV_LABEL: 'Page: ',
        TAB_LABEL: 'Page '
    })) {
        wFORMS.behaviors.paging.MESSAGES[key] = tmp[key];
    }
})();



// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function (element, value) {
    var reg = /^[a-zA-Z\s]+$/;
    return this.isEmpty(value) || reg.test(value);
};
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function (element, value) {
    var reg = /^[\u0030-\u0039a-zA-Z\s]+$/;
    return this.isEmpty(value) || reg.test(value);
};

wFORMS.behaviors.autoformat.NUMERIC_REGEX = new RegExp("[0-9]");
wFORMS.behaviors.autoformat.ALPHABETIC_REGEX = new RegExp("[a-zA-Z\s]");

// Calendar
if (!wFORMS.helpers.calendar) {
    wFORMS.helpers.calendar = {};
};
if (!wFORMS.helpers.calendar.locale) {
    wFORMS.helpers.calendar.locale = {};
};
var cfg = wFORMS.helpers.calendar.locale;

cfg.TITLE = 'Select a date';
cfg.START_WEEKDAY = 1;
cfg.MONTHS_LONG = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
cfg.WEEKDAYS_SHORT = ['Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa'
];
cfg.MDY_DAY_POSITION = 1;
cfg.MDY_MONTH_POSITION = 2;
cfg.MDY_YEAR_POSITION = 3;
cfg.DATE_FIELD_DELIMITER = '/';

// Autosuggest
(function () {
    var key, tmp;
    for (key in (tmp = {
        NO_RESULTS: 'No results found',
        SHOWING_OF: 'Showing %1 of %2.',
        CONTINUE_TYPING: 'Continue typing to narrow your options.'
    })) {
        if (wFORMS.behaviors.autosuggest) {
            wFORMS.behaviors.autosuggest.MESSAGES[key] = tmp[key];
        }
    }
})();

// Numeric formatting information
var wFormsNumericLocaleFormattingInfo = {"decimal_point":".","thousands_sep":",","int_curr_symbol":"GBP ","currency_symbol":"\u00a3","mon_decimal_point":".","mon_thousands_sep":",","positive_sign":"","negative_sign":"-","int_frac_digits":2,"frac_digits":2,"p_cs_precedes":1,"p_sep_by_space":0,"n_cs_precedes":1,"n_sep_by_space":0,"p_sign_posn":1,"n_sign_posn":1,"grouping":[3,3],"mon_grouping":[3,3]};

// Response Caching Feature
(function () {
    var key, tmp;
    for (key in (tmp = {
        DIALOG_TITLE: 'Save Responses for Use in Future Submissions',
        DIALOG_INFO: 'The creator of this form has allowed you to save responses to the following questions. If you click the <b>Save Responses for Reuse</b> button, these responses will be saved in your local browser storage. You can remove the response at any time by clearing your local browser storage. If you submit new, different responses, you will be asked if you want to update your saved responses.',
        CONFIRM_CACHE: 'Save Selected Responses for Reuse',
        CANCEL_CACHE: 'Don\'t Save Any Response for Reuse',
        DO_NOT_ASK_AGAIN: 'Don\'t ask again',
    })) {
        if (wFORMS.behaviors.responseCaching) {
            wFORMS.behaviors.responseCaching.MESSAGES[key] = tmp[key];
        }
    }
})();
