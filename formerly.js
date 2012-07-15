/*
* formerly
*
* @package formerly
* @author $Author: kjellmorten $
* @version $Id: formerly.js, v 0.1 $
* @license BSD
* @copyright (c) Kjell-Morten Bratsberg Thorsen http://kjellmorten.no/
*/

var formerly = (function () {
	var _elsToValidate = 'text search tel url email password datetime date month week ' +
						'time datetime-local number range color checkbox radio file ' +
						'submit select-one select-multiple textarea'.split(' '),
		_emailRegExp = /^[a-z][a-z0-9!#$%&'*+\-\/=?^_`{|}~\.]*@[a-z0-9\-]+(\.[a-z0-9\-]+)*$/i,
		_urlRegExp = /^\s*[a-z][a-z0-9+\-\.]+:\/\//i;

	/*
	 * Private help functions
	 */

	function _setValidity (el, trueProp) {
		for (var prop in el.validity) {
			el.validity[prop] = false;
		}
		el.validity[trueProp] = true;
	}
	
	function _addClass(el, className) {
		if (el.className === '') {
			el.className = className;
		} else if (!(new RegExp("(^|\\s)" + className + "(\\s||$)")).test(el.className)) {
			el.className += ' ' + className;
		}
	}
	
	function _removeClass(el, className) {
		el.className = el.className.replace(new RegExp("(?:^|\\s)" + className + "(?!\\S)"), '');
		if (el.className.charAt(0) === ' ') {
			el.className = el.className.substr(1);
		}
	}
	
	function _checkValueMissing (el) {
		return ((el.attributes['required'] !== undefined) && (el.value === ''));
	}
	
	function _checkTypeMismatch (el) {
		var type = el.type;
		
		if (el.value !== '') {
			switch (type) {
				case 'email':
					return !(_emailRegExp.test(el.value));
				case 'url':
					return !(_urlRegExp.test(el.value));
				default:
			}
		}
		
		return false;
	}
	
	function _checkPatternMismatch (el) {
		var pattern = el.attributes['pattern'];
		if ((el.value !== '') && (pattern !== undefined)) {
			try {
				return !(new RegExp('^' + pattern + '$').test(el.value));
			} catch (err) {}
		}

		return false;
	}
	
	function _checkTooLong (el) {
		var maxlength = el.attributes['maxlength'];
		return ((maxlength !== undefined) && (el.value.length > parseInt(maxlength)));
	}
	
	function _checkRangeUnderflow (el) {
		var val, min;
		if ((el.value !== '') && (el.attributes['min'] !== undefined)) {
			val = parseFloat(el.value);
			min = parseFloat(el.attributes['min']);
			return (min > val);
		}
		
		return false;
	}

	function _checkRangeOverflow (el) {
		var val, max;
		if ((el.value !== '') && (el.attributes['max'] !== undefined)) {
			val = parseFloat(el.value);
			max = parseFloat(el.attributes['max']);
			return (val > max);
		}
	
		return false;
	}
	
	function _checkStepMismatch (el) {
		var val, step, min;
		if ((el.value !== '') && (el.attributes['step'] !== undefined)) {
			val = parseFloat(el.value);
			step = parseFloat(el.attributes['step']);
			if ((val) && (step)) {
				if ((el.attributes['min'] !== undefined) && (min = parseFloat(el.attributes['min']))) {
					val -= min;
				}
				return ((val % step) !== 0);
			}
		}
		
		return false;
	}

	/*
	 * Constraints interface
	 */

	function _willValidate (el) {
		return (_elsToValidate.indexOf(el.type) !== -1);
	}
	
	function _setCustomValidity (message) {
		this.validationMessage = message;
		_setValidity(this, (message === '') ? 'valid' : 'customError');
	}
	
	function _checkValidity () {
		var valueMissing = _checkValueMissing(this),
			typeMismatch = _checkTypeMismatch(this),
			patternMismatch = _checkPatternMismatch(this),
			tooLong = _checkTooLong(this),
			rangeUnderflow = _checkRangeUnderflow(this),
			rangeOverflow = _checkRangeOverflow(this),
			stepMismatch = _checkStepMismatch(this),
			customError = this.validity.customError;

		this.validity.valueMissing = valueMissing;
		this.validity.typeMismatch = typeMismatch;
		this.validity.patternMismatch = patternMismatch;
		this.validity.tooLong = tooLong;
		this.validity.rangeUnderflow = rangeUnderflow;
		this.validity.rangeOverflow = rangeOverflow;
		this.validity.stepMismatch = stepMismatch;
		this.validity.valid = !(valueMissing || typeMismatch || patternMismatch || tooLong || rangeUnderflow || rangeOverflow || stepMismatch || customError);
		
		_addClass(this, (this.validity.valid) ? 'valid' : 'invalid');
		_removeClass(this, (this.validity.valid) ? 'invalid' : 'valid');

		return this.validity.valid;
	}


	/*
	 * Initialization
	 */

	function initElement (el) {
		if (el.willValidate === undefined) {
			el.willValidate = _willValidate(el);
		}
		if ((el.setCustomValidity === undefined) || (el.validity === undefined) 
				|| (el.checkValidity === undefined) || (el.validationMessage === undefined)) {
			el.setCustomValidity = _setCustomValidity;
			el.validity = {
				valueMissing: false,
				typeMismatch: false,
				patternMismatch: false,
				tooLong: false,
				rangeUnderflow: false,
				rangeOverflow: false,
				stepMismatch: false,
				customError: false,
				valid: true
			};
			el.checkValidity = _checkValidity;
			el.validationMessage = '';
		}
	}
	
	function init (form) {
		
	}
	
	/*
	 * The formerly object.
	 */
	
	return {
		init: init,
		initElement: initElement
	};
	
})();