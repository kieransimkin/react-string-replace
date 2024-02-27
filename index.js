/* eslint-disable vars-on-top, no-var, prefer-template */
               /**
                * @description This function takes a parameter re and returns true if re is an
                * instance of the RegExp object.
                * 
                * @param { object } re - The `re` parameter is the value being checked to see if it
                * is an instance of `RegExp`.
                * 
                * @returns { boolean } The function takes a regular expression object as an argument
                * and returns a boolean value based on whether the input is an instance of the RegExp
                * constructor. In other words: If the input is not a regular expression instance
                * (i.e., not an object created using the RegExp constructor), then false will be
                * returned; otherwise (if the input Floyd’s functions as an instance of the reified
                * class constructor), then true will be returned instead}. In layman’s terms: this
                * function tells if an input parameter is a true RegExp or just an ordinary value.
                * If it’s not a RegExp and the false-returning expression should otherwise behave
                * as a regular function that merely returns its argument without a conditional
                * statement like (re). The function only provides insight into the type of object
                * it receives from outside because instanceof does the trick underneath its hood
                * before handing out true/false pairs of return values according to whether “its
                * inside instance-hood checks succeed”—passed true or false on up towards callers
                * awaiting such responses accordingly depending their programming needs
                */
var isRegExp = function (re) { 
  return re instanceof RegExp;
};
                   /**
                    * @description This function escapes any characters that have a special meaning
                    * within regular expressions so that they can be used within a string that is meant
                    * to be matched by a RegExp.
                    * 
                    * @param { string } string - The `string` parameter is the string to be escaped as
                    * a regular expression literal. It is the input that the function modifies and returns
                    * the escaped version of.
                    * 
                    * @returns { string } This function takes a string as an argument and returns it
                    * with all RegExp metacharacters (e.g., '.', '*', '+', etc.) escaped using a backslash
                    * before them.
                    * 
                    * In other words output would be the given string where any occurence of these
                    * characters have been double escaped e.g if string "this\*is a test" the returned
                    * output will be "this\\*is a test" .
                    */
var escapeRegExp = function escapeRegExp(string) {
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
};
               /**
                * @description This function checks whether the passed parameter is a string or not.
                * If the parameter is a string then it returns true otherwise it returns false.
                * 
                * @param { string } value - Nothing; there is no `value` parameter explicitly defined
                * within this anonymous function. Therefore the input parameter `value` doesn't exist
                * and doesn't do anything. This anonymous function simply returns true when passed
                * a string value.
                * 
                * @returns {  } The function takes one argument named "value" and returns a boolean
                * value depending on whether value is of type string or not. This is stated briefly
                * and concisely.
                */
var isString = function (value) {
  return typeof value === 'string';
};
              /**
               * @description This function takes an array as input and returns a new array that
               * has been populated by the elements of the input array and any arrays contained
               * within it. If an element is itself an array then it is concatinated onto the new
               * array else it is simply pushed onto the array.
               * 
               * @param { array } array - The array input parameter "array" is the array to be
               * processed and its elements are iterated over using the forEach() method.
               * 
               * @returns { array } This function takes an array as input and returns a new array
               * with two types of items: elements that are arrays themselves and single values.
               * It uses the Array.isArray() method to differentiate between them. If an item is
               * an array then all its elements are added to the new array using the concat method.
               * If it is not an array then it is simply pushed onto the new array.
               * 
               * So the output returned by this function would be an array that has a mixture of
               * single values and arrays of values.
               */
var flatten = function (array) {
  var newArray = [];

  array.forEach(function (item) {
    if (Array.isArray(item)) {
      newArray = newArray.concat(item);
    } else {
      newArray.push(item);
    }
  });

  return newArray;
};

/**
 * Given a string, replace every substring that is matched by the `match` regex
 * with the result of calling `fn` on matched substring. The result will be an
 * array with all odd indexed elements containing the replacements. The primary
 * use case is similar to using String.prototype.replace except for React.
 *
 * React will happily render an array as children of a react element, which
 * makes this approach very useful for tasks like surrounding certain text
 * within a string with react elements.
 *
 * Example:
 * matchReplace(
 *   'Emphasize all phone numbers like 884-555-4443.',
 *   /([\d|-]+)/g,
 *   (number, i) => <strong key={i}>{number}</strong>
 * );
 * // => ['Emphasize all phone numbers like ', <strong>884-555-4443</strong>, '.'
 *
 * @param {string} str
 * @param {RegExp|str} match Must contain a matching group
 * @param {function} fn
 * @return {array}
 */
function replaceString(str, match, fn, count = null) {
  var curCharStart = 0;
  var curCharLen = 0;

  if (str === '') {
    return str;
  } else if (!str || !isString(str)) {
    throw new TypeError('First argument to react-string-replace#replaceString must be a string');
  }

  var re = match;

  if (!isRegExp(re)) {
    re = new RegExp('(' + escapeRegExp(re) + ')', 'gi');
  }

  var result = str.split(re);

  // Apply fn to all odd elements
  for (var i = 1, length = result.length; i < length; i += 2) {

    if (Number.isInteger(count) && (count * 2 < i || count < 1)) {
      break;
    }
    
    /** @see {@link https://github.com/iansinnott/react-string-replace/issues/74} */
    if (result[i] === undefined || result[i - 1] === undefined) {
      console.warn('reactStringReplace: Encountered undefined value during string replacement. Your RegExp may not be working the way you expect.');
      continue;
    }

    curCharLen = result[i].length;
    curCharStart += result[i - 1].length;
    result[i] = fn(result[i], i, curCharStart);
    curCharStart += curCharLen;
  }

  return result;
}

module.exports = function reactStringReplace(source, match, fn, count = null) {
  if (!Array.isArray(source)) source = [source];

  return flatten(
    source.map(function (x) {
      let ret;
      if (isString(x)) {
        if (Number.isInteger(count) && count > 0) {
          ret = replaceString(x, match, fn, count);
          count -= (
            x.match(new RegExp("(" + escapeRegExp(match) + ")", "gi")) || []
          ).length
        } else {
          ret = replaceString(x, match, fn, count);
        }
      } else {
        ret = x;
      }
      return ret;
    }),
  );
}