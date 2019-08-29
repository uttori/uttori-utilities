const MODE_NONE = 'modeNone';
const MODE_DEFAULT = 'modeDefault';
const MODE_MATCH = 'modeMatch';

/**
  * Parse a string into a token structure.
  * Create an instance of this class for each new string you wish to parse.
  * @property {TokenizeThis} factory - Holds the processed configuration.
  * @property {string} str - The string to tokenize.
  * @property {function} forEachToken - The function to call for teach token.
  * @property {String} previousChr - The previous character consumed.
  * @property {String} toMatch - The current quote to match.
  * @property {String} currentToken - The current token being created.
  * @property {Array} modeStack - Keeps track of the current "mode" of tokenization. The tokenization rules are different depending if you are tokenizing an explicit string (surrounded by quotes), versus a non-explicit string (not surrounded by quotes).
  * @example <caption>Init Tokenizer</caption>
  * const tokenizerInstance = new Tokenizer(this, str, forEachToken);
  * return tokenizerInstance.tokenize();
  * @class
  */
class Tokenizer {
  /**
   *
   * @param {TokenizeThis} factory - Holds the processed configuration.
   * @param {String} str - The string to tokenize.
   * @param {Function} forEachToken - The function to call for teach token.
   */
  constructor(factory, str, forEachToken) {
    this.factory = factory;
    this.str = str;
    this.forEachToken = forEachToken;
    this.previousChr = '';
    this.toMatch = '';
    this.currentToken = '';
    this.modeStack = [MODE_NONE];
  }

  getCurrentMode() {
    return this.modeStack[this.modeStack.length - 1];
  }

  setCurrentMode(mode) {
    return this.modeStack.push(mode);
  }

  completeCurrentMode() {
    const currentMode = this.getCurrentMode();

    if (currentMode === MODE_DEFAULT) {
      this.pushDefaultModeTokenizables();
    }

    // Don't push out empty tokens, unless they were an explicit string, e.g. ""
    if ((currentMode === MODE_MATCH && this.currentToken === '') || this.currentToken !== '') {
      this.push(this.currentToken);
    }
    this.currentToken = '';

    return this.modeStack.pop();
  }

  push(token) {
    let surroundedBy = '';

    if (this.factory.convertLiterals && this.getCurrentMode() !== MODE_MATCH) {
      // Convert the string version of literals into their literal types.
      switch (token.toLowerCase()) {
        case 'null':
          token = null;
          break;
        case 'true':
          token = true;
          break;
        case 'false':
          token = false;
          break;
        default:
          if (Number.isFinite(Number(token))) {
            token = Number(token);
          }
          break;
      }
    } else {
      // The purpose of also transmitting the surroundedBy quote is to inform whether or not
      // the token was an explicit string, versus a non-explicit string, e.g. "=" vs. =
      surroundedBy = this.toMatch;
    }

    /* istanbul ignore else */
    if (this.forEachToken) {
      this.forEachToken(token, surroundedBy);
    }
  }

  tokenize() {
    let index = 0;

    while (index < this.str.length) {
      this.consume(this.str.charAt(index++));
    }

    while (this.getCurrentMode() !== MODE_NONE) {
      this.completeCurrentMode();
    }
  }

  /**
   *
   * @param {string} chr
   */
  consume(chr) {
    this[this.getCurrentMode()](chr);
    this.previousChr = chr;
  }

  /**
   *
   * @param {string} chr
   * @returns {*}
   */
  [MODE_NONE](chr) {
    if (!this.factory.matchMap[chr]) {
      this.setCurrentMode(MODE_DEFAULT);
      this.consume(chr);
      return;
    }

    this.setCurrentMode(MODE_MATCH);
    this.toMatch = chr;
  }

  /**
   *
   * @param {string} chr
   * @returns {string}
   */
  [MODE_DEFAULT](chr) {
    // If we encounter a delimiter, its time to push out the current token.
    if (this.factory.delimiterMap[chr]) {
      return this.completeCurrentMode();
    }

    // If we encounter a quote, only push out the current token if there's a sub-token directly before it.
    if (this.factory.matchMap[chr]) {
      let tokenizeIndex = 0;

      while (tokenizeIndex < this.factory.tokenizeList.length) {
        if (this.currentToken.endsWith(this.factory.tokenizeList[tokenizeIndex++])) {
          this.completeCurrentMode();
          return this.consume(chr);
        }
      }
    }

    this.currentToken += chr;

    return this.currentToken;
  }

  /**
   * Parse out potential tokenizable substrings out of the current token.
   *
   * @returns {*}
   */
  pushDefaultModeTokenizables() {
    let tokenizeIndex = 0;
    let lowestIndexOfTokenize = Infinity;
    let toTokenize = null;

    // Iterate through the list of tokenizable substrings.
    while (this.currentToken && tokenizeIndex < this.factory.tokenizeList.length) {
      const tokenize = this.factory.tokenizeList[tokenizeIndex++];
      const indexOfTokenize = this.currentToken.indexOf(tokenize);

      // Find the substring closest to the beginning of the current token.
      if (indexOfTokenize !== -1 && indexOfTokenize < lowestIndexOfTokenize) {
        lowestIndexOfTokenize = indexOfTokenize;
        toTokenize = tokenize;
      }
    }

    // No substrings to tokenize. You're done.
    if (!toTokenize) {
      return;
    }

    // A substring was found, but not at the very beginning of the string, e.g. A=B, where "=" is the substring.
    // This will push out "A" first.
    if (lowestIndexOfTokenize > 0) {
      this.push(this.currentToken.substring(0, lowestIndexOfTokenize));
    }

    // Push out the substring, then modify the current token to be everything past that substring.
    // Recursively call this function again until there are no more substrings to tokenize.
    /* istanbul ignore else */
    if (lowestIndexOfTokenize !== -1) {
      this.push(toTokenize);
      this.currentToken = this.currentToken.substring(lowestIndexOfTokenize + toTokenize.length);
      this.pushDefaultModeTokenizables();
    }
  }

  /**
   * @param {string} chr
   * @returns {string}
   */
  [MODE_MATCH](chr) {
    if (chr === this.toMatch) {
      if (this.previousChr !== this.factory.escapeCharacter) {
        return this.completeCurrentMode();
      }
      this.currentToken = this.currentToken.substring(0, this.currentToken.length - 1);
    }

    this.currentToken += chr;

    return this.currentToken;
  }
}

/**
 * Sorts the tokenizable substrings by their length DESC.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
const sortTokenizableSubstrings = (a, b) => {
  if (a.length > b.length) {
    return -1;
  }
  if (a.length < b.length) {
    return 1;
  }
  return 0;
};

/**
  * Takes in the config, processes it, and creates tokenizer instances based on that config.
  * @property {Object} config - The configuration object.
  * @property {Boolean} convertLiterals - If literals should be converted or not, ie 'true' -> true.
  * @property {String} escapeCharacter - Character to use as an escape in strings.
  * @property {Object} tokenizeList - Holds the list of tokenizable substrings.
  * @property {Object} tokenizeMap - Holds an easy lookup map of tokenizable substrings.
  * @property {Object} matchList - Holds the list of quotes to match explicit strings with.
  * @property {Object} matchMap - Holds an easy lookup map of quotes to match explicit strings with.
  * @property {Object} delimiterList - Holds the list of delimiters.
  * @property {Object} delimiterMap - Holds an easy lookup map of delimiters.
  * @example <caption>Init TokenizeThis</caption>
  * const tokenizer = new TokenizeThis(config.tokenizer);
  * this.tokenizer.tokenize('(sql)', (token, surroundedBy) => { ... });
  * @class
  */
class TokenizeThis {
  constructor(config = {}) {
    config = {
      shouldTokenize: ['(', ')', ',', '*', '/', '%', '+', '-', '=', '!=', '!', '<', '>', '<=', '>=', '^'],
      shouldMatch: ['"', "'", '`'],
      shouldDelimitBy: [' ', '\n', '\r', '\t'],
      convertLiterals: true,
      escapeCharacter: '\\',
      ...config,
    };

    this.convertLiterals = config.convertLiterals;
    this.escapeCharacter = config.escapeCharacter;

    this.tokenizeList = [];
    this.tokenizeMap = {};
    this.matchList = [];
    this.matchMap = {};
    this.delimiterList = [];
    this.delimiterMap = {};

    // Sorts the tokenizable substrings based on their length, such that "<=" will get matched before "<" does.
    config.shouldTokenize.sort(sortTokenizableSubstrings).forEach((token) => {
      /* istanbul ignore else */
      if (!this.tokenizeMap[token]) {
        this.tokenizeList.push(token);
        this.tokenizeMap[token] = token;
      }
    });

    config.shouldMatch.forEach((match) => {
      /* istanbul ignore else */
      if (!this.matchMap[match]) {
        this.matchList.push(match);
        this.matchMap[match] = match;
      }
    });

    config.shouldDelimitBy.forEach((delimiter) => {
      /* istanbul ignore else */
      if (!this.delimiterMap[delimiter]) {
        this.delimiterList.push(delimiter);
        this.delimiterMap[delimiter] = delimiter;
      }
    });

    this.config = config;
  }

  /**
   * Creates a Tokenizer, then immediately calls "tokenize".
   *
   * @param {string} str
   * @param {function} forEachToken
   * @returns {*}
   */
  tokenize(str, forEachToken) {
    const tokenizerInstance = new Tokenizer(this, str, forEachToken);
    return tokenizerInstance.tokenize();
  }
}

module.exports = TokenizeThis;
