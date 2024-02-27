/* eslint-disable vars-on-top, no-var, prefer-template */
/**
 * @description This function checks if the input `re` is a RegExp object. It returns
 * `true` if it is, and `false` otherwise.
 * 
 * @param {  } re - The `re` input parameter checks if the input is a RegExp object.
 * 
 * @returns { boolean } The function `function (re) { return re instanceof RegExp;
 * }` returns `true` if the input `re` is an instance of a regular expression, and
 * `false` otherwise.
 */
var isRegExp = function (re) { 
  return re instanceof RegExp;
};
/**
 * @description This function escapes Regular Expressions in a string by replacing
 * special characters with their escaped counterparts using the `\\$&` syntax.
 * 
 * @param { string } string - The `string` input parameter is used to provide a string
 * that may contain special characters that need to be escaped for use in regular
 * expressions. The function checks if the string contains any special characters
 * that need to be escaped and replaces them with the \\$& syntax, which allows the
 * special character to be treated as a literal in the regex pattern.
 * 
 * @returns { string } The output of the `escapeRegExp()` function is a modified
 * version of the input string, where any character that matches the regular expression
 * pattern `/[\\^$.*+?()[\]{}|]/g` is replaced with the escaped form `\$&`. If the
 * input string does not contain any such characters, it is returned unchanged.
 */
var escapeRegExp = function escapeRegExp(string) {
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
};
/**
 * @description This function checks if the input `value` is a string type. It returns
 * `true` if it is, and `false` otherwise.
 * 
 * @param { string } value - The `value` input parameter represents the value that
 * the function will check for being a string.
 * 
 * @returns { boolean } The function returns `true` if the input `value` is a string,
 * and `false` otherwise.
 */
var isString = function (value) {
  return typeof value === 'string';
};
/**
 * @description This function takes an array as input and returns a new array by
 * concatenating all the elements of the original array with the elements of any
 * nested arrays (using `Array.isArray()` to check for arrays) or pushing each element
 * onto the new array if it's not an array.
 * 
 * @param { array } array - The `array` input parameter is used to store the original
 * array that will be transformed by the function.
 * 
 * @returns { array } The function returns a new array that contains all the elements
 * of the original array, either as individual elements or as nested arrays if any
 * of the elements are themselves arrays.
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

/**
 * @description This function replaces a specific string pattern within an array of
 * strings using a provided function. It first checks if the input is an array, and
 * then iterates over each element in the array using `map()` to perform the replacement
 * operation. The function takes four arguments: `source` (the array of strings to
 * be processed), `match` (the string pattern to be replaced), `fn` (a function that
 * performs the replacement operation), and `count` (an optional integer representing
 * the number of times the replacement should be applied).
 * 
 * @param { array } source - The `source` input parameter checks if the input `source`
 * is an array before proceeding with the mapping and replacement process. If it's
 * not an array, it will simply return the original value without any modifications.
 * 
 * @param { string } match - The `match` input parameter in the `reactStringReplace`
 * function is used to specify the string to be replaced. It takes a string value and
 * serves as an identifier for the part of the original string that needs to be replaced.
 * 
 * @param {  } fn - The `fn` parameter is a callback function that replaces the
 * specified substring in each element of the input array with the provided replacement
 * value. It takes no arguments and returns the modified element.
 * 
 * @param { null } count - The `count` input parameter in the `reactStringReplace`
 * function is used to limit the number of replacements performed in the string
 * manipulation operation. It allows the function to replace a specific number of
 * occurrences of a pattern in a string, rather than replacing all occurrences.
 * 
 * @returns { array } The function returns a new array of modified strings, where
 * each string has been replaced with the desired pattern. The replacement is performed
 * using the `replaceString` function, which takes four arguments: the original string,
 * the pattern to replace, the replacement string, and an optional count of how many
 * times the pattern should be replaced. The modified strings are returned in a new
 * array.
 */
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