const debug = require('debug')('Uttori.Utilities.Classifier');
const FileUtility = require('./file-utility');

/**
 * Event class used in conjunction with the Event Dispatcher.
 * @property {String} label - The human readable identifier of the event.
 * @property {Function[]} callbacks - The functions to be executed when an event is fired.
 * @example <caption>new UttoriEvent(label)</caption>
 * const event = new UttoriEvent('event-label');
 * event.register(callback);
 * event.fire({ data });
 * @class
 */
class Classifier {
  constructor(model = {}) {
    this.frequency = model.frequency ? { ...model.frequency } : {};
    this.categories = model.categories ? { ...model.categories } : {};
    this.thresholds = model.thresholds ? { ...model.thresholds } : {};
    this.minimums = model.minimums ? { ...model.minimums } : {};
  }

  categoryCount(category) {
    debug('categoryCount:', category);
    const count = this.categories[category] || 0;
    debug('count =', count);
    return count;
  }

  featureCount(feature, category) {
    debug('featureCount:', feature, category);
    const count = this.frequency[feature] && this.frequency[feature][category] ? this.frequency[feature][category] : 0;
    debug('count =', count);
    return count;
  }

  featureProbability(feature, category) {
    debug('featureProbability:', feature, category);
    const probability = this.categoryCount(category) === 0 ? 0 : this.featureCount(feature, category) / this.categoryCount(category);
    debug('probability =', probability);
    return probability;
  }

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
   * @param  {String} text - Text to extract features from.
   * @return {Array}
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

  // increment or instantiate a count for a given category
  incrementCategory(category) {
    debug('incrementCategory:', category);
    this.categories[category] = this.categories[category] ? this.categories[category] + 1 : 1;
    debug('count = ', this.categories[category]);
  }

  // increment or instantiate a count for a given category of a given feature
  incrementFeature(feature, category) {
    debug('incrementFeature:', feature, category);
    if (!this.frequency[feature]) {
      this.frequency[feature] = {};
    }
    this.frequency[feature][category] = this.frequency[feature][category] ? this.frequency[feature][category] + 1 : 1;
    debug('count = ', this.frequency[feature][category]);
  }

  // returns the total count of categories
  totalCount() {
    const totalCount = Object.values(this.categories).reduce((result, value) => result + value, 0);
    debug('totalCount = ', totalCount);
    return totalCount;
  }

  //  trains the classifier with a given item, for a given category
  train(item, category) {
    debug('train:', item, category);
    if (typeof item !== 'string' || item.length === 0) {
      debug('item must be a string, got:', typeof item);
      return;
    }
    Classifier.getFeatures(item).map((feature) => this.incrementFeature(feature, category));
    this.incrementCategory(category);
  }

  // returns the weightedProbability for a given feature
  weightedProbability(feature, _category, basicProbability, weight = 1, assumedProbability = 0.5) {
    debug('weightedProbability:', feature, _category, basicProbability, weight, assumedProbability);
    const totals = this.getCategories().reduce(
      (result, category) => result + this.featureCount(feature, category), 0,
    );

    return ((weight * assumedProbability) + (totals * basicProbability)) / (weight + totals);
  }

  // exports a trained model
  save(folder, name, extension, encoding) {
    debug('save:', folder, name, extension, encoding);
    const content = JSON.stringify(this, null, 2);
    FileUtility.writeFileSync(folder, name, extension, content, encoding);
  }
}

module.exports = Classifier;
