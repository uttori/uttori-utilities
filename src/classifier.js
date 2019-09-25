const debug = require('debug')('Uttori.Utilities.Classifier');

/**
 * Classifier base class for use with the Naive Bayes and Fisher classifiers.
 * In practice, it is better tolerating false positives for "good", more than false negatives for "good".
 * Example: It is better to see a message that is spam rather than lose a message that is not spam.
 * @property {Object} [categories] - Categories in the classfier.
 * @property {Object} [frequency] - Frequency counts.
 * @property {Object} [minimums] - Used in the Fisher classifier.
 * @property {Object} [thresholds] - Used with the Naive Bayes classifier.
 * @example <caption>new Classifier(model)</caption>
 * const classifier = new Classifier();
 * classifier.train(item, category);
 * Classifier.getFeatures('test');
 * @class
 */
class Classifier {
  /**
   * Creates a new Classifier.
   * @param {Object} [model] - The trained model to initiate with.
   * @constructor
   */
  constructor(model = {}) {
    this.categories = model.categories ? { ...model.categories } : {};
    this.frequency = model.frequency ? { ...model.frequency } : {};
    this.minimums = model.minimums ? { ...model.minimums } : {};
    this.thresholds = model.thresholds ? { ...model.thresholds } : {};
  }

  /**
   * Returns the count for a given category or 0 if the category isn't found.
   * @param {String} category - The category to find the count for.
   * @returns {Number} - The count for the provided category.
   * @memberof Classifier
   */
  categoryCount(category) {
    debug('categoryCount:', category);
    const count = this.categories[category] || 0;
    debug('count =', count);
    return count;
  }

  /**
   * Returns the frequency for a given category in a given feature, or 0 if the feature or category isn't found.
   * @param {String} feature - The feature to look for the category in.
   * @param {String} category - The category to find the count for.
   * @returns {Number} - The count for the provided category of the provided feature.
   * @memberof Classifier
   */
  featureCount(feature, category) {
    debug('featureCount:', feature, category);
    const count = this.frequency[feature] && this.frequency[feature][category] ? this.frequency[feature][category] : 0;
    debug('count =', count);
    return count;
  }

  /**
   * Returns the probability for a given category in a given feature, or 0 if the category isn't found.
   * @param {String} feature - The feature to look for the category in.
   * @param {String} category - The category to find the count for.
   * @returns {Number} - The probability for the feature to match the category (feature count / category count).
   * @memberof Classifier
   */
  featureProbability(feature, category) {
    debug('featureProbability:', feature, category);
    const probability = this.categoryCount(category) === 0 ? 0 : this.featureCount(feature, category) / this.categoryCount(category);
    debug('probability =', probability);
    return probability;
  }

  /**
   * Returns the names of all the categories.
   * @returns {String[]} - The array of category keys.
   * @memberof Classifier
   */
  getCategories() {
    const categories = Object.keys(this.categories);
    debug('getCategories = ', categories);
    return categories;
  }

  /**
   * Given a text string, tokenize it into an array of word features.
   * This is the default used if one is not provided when instantiated.
   * This attempts to add support for English, Cyrillic, Korean, Japanese and Chinese.
   *
   * The supported cheacter ranges are:
   * SU+0400 – U+04FF: Cyrillic, 256 characters
   * SU+0500 – U+052F: Cyrillic Supplement, 48 characters
   * SU+2DE0 – U+2DFF: Cyrillic Extended-A, 32 characters
   * SU+A640 – U+A69F: Cyrillic Extended-B, 96 characters
   * SU+1C80 – U+1C8F: Cyrillic Extended-C, 9 characters
   * SU+1D2B         : Cyrillic Phonetic Extensions, 1 of 2 characters
   * SU+1D78         : Cyrillic Phonetic Extensions, 2 of 2 characters
   * SU+FE2E – U+FE2F: Cyrillic Combining Half Marks, 2 characters
   * SU+1100 - U+11FF: Hangul Jamo (Korean) (Choseong, Jungseong, and Jongseong)
   * SU+3040 – U+30FF: Hiragana & Katakana (Japanese only)
   * SU+3400 – U+4DBF: CJK unified ideographs extension A (Chinese, Japanese, and Korean)
   * SU+4E00 – U+9FFF: CJK unified ideographs (Chinese, Japanese, and Korean)
   * SU+F900 – U+FAFF: CJK compatibility ideographs (Chinese, Japanese, and Korean)
   * SU+FF66 – U+FF9F: half-width katakana (Japanese only)
   *
   * See also: https://en.wikipedia.org/wiki/Cyrillic_script_in_Unicode
   * See also: https://codeday.me/en/qa/20190306/12457.html
   * See also: http://flyingsky.github.io/2018/01/26/javascript-detect-chinese-japanese/
   *
   * @param {String} text - Text to extract features from.
   * @return {String[]} - The features found in the provided text.
   * @static
   * @memberof Classifier
   */
  static getFeatures(text) {
    debug('getFeatures:', text);
    // /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/
    // const REGEX_JAPANESE = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]|[\u3400-\u4dbf]/;
    // const REGEX_CHINESE = /[\u4e00-\u9fff]|[\u3400-\u4dbf]|[\u{20000}-\u{2a6df}]|[\u{2a700}-\u{2b73f}]|[\u{2b740}-\u{2b81f}]|[\u{2b820}-\u{2ceaf}]|[\uf900-\ufaff]|[\u3300-\u33ff]|[\ufe30-\ufe4f]|[\uf900-\ufaff]|[\u{2f800}-\u{2fa1f}]/u;
    const regEx = /[\da-z\u0400-\u052F\u1100-\u11FF\u3040-\u309F]+/gi;
    /* istanbul ignore next */
    const features = text.match(regEx) ? text.match(regEx).map((word) => word.toLowerCase()) : [text.trim()];
    debug('features =', features);
    return features;
  }

  /**
   * Increment or instantiate a count for a given category.
   * @param {String} category - The category to increment the count for.
   * @memberof Classifier
   */
  incrementCategory(category) {
    debug('incrementCategory:', category);
    this.categories[category] = this.categories[category] ? this.categories[category] + 1 : 1;
    debug('count = ', this.categories[category]);
  }

  /**
   * Increment or instantiate a count for a given category of a given feature.
   * @param {String} feature - The feature to find the category to increment the count for.
   * @param {String} category - The category to increment the count for.
   * @memberof Classifier
   */
  incrementFeature(feature, category) {
    debug('incrementFeature:', feature, category);
    if (!this.frequency[feature]) {
      this.frequency[feature] = {};
    }
    this.frequency[feature][category] = this.frequency[feature][category] ? this.frequency[feature][category] + 1 : 1;
    debug('count = ', this.frequency[feature][category]);
  }

  /**
   * Returns the total count of categories.
   * @returns {Number} - The count of used categories.
   * @memberof Classifier
   */
  totalCount() {
    const count = Object.values(this.categories).reduce((result, value) => result + value, 0);
    debug('count = ', count);
    return count;
  }

  /**
   * Trains the classifier with a given item, for a given category
   * @param {String} item - The item to train a given category.
   * @param {String} category - The category to increment the count for.
   * @memberof Classifier
   */
  train(item, category) {
    debug('train:', item, category);
    if (typeof item !== 'string' || item.length === 0) {
      debug('item must be a string, got:', typeof item);
      return;
    }
    Classifier.getFeatures(item).map((feature) => this.incrementFeature(feature, category));
    this.incrementCategory(category);
  }

  /**
   * Returns the weightedProbability for a given feature
   * @param {String} feature - The feature to find the weighted probability of.
   * @param {String} _category - Currently unused.
   * @param {Number} basicProbability - The probability of the applicable classifier (Fisher: category, Naive Bayes: feature)
   * @param {Number} [weight=1] - The provided weight of the feature.
   * @param {Number} [assumedProbability=0.5] - Assumed probability of the feature.
   * @returns {Number} - The weighted probability of the provided feature.
   * @memberof Classifier
   */
  weightedProbability(feature, _category, basicProbability, weight = 1, assumedProbability = 0.5) {
    debug('weightedProbability:', feature, _category, basicProbability, weight, assumedProbability);
    const totals = this.getCategories().reduce(
      (result, category) => result + this.featureCount(feature, category), 0,
    );
    return ((weight * assumedProbability) + (totals * basicProbability)) / (weight + totals);
  }

  /**
   * Exports the current model as a JSON string.
   * @param {Number} [spaces=0] - Spaces to indent JSON.
   * @returns {String} - The model as JSON.
   * @memberof Classifier
   */
  save(spaces = 0) {
    debug('save:', spaces);
    return JSON.stringify(this, null, spaces);
  }
}

module.exports = Classifier;
