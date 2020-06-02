const debug = require('debug')('Uttori.Utilities.NaiveBayes');
const Classifier = require('./classifier');

/**
 * A Naive-Bayes text classifier based on the idea of Bayes' Theorem,
 * which is used to calculate conditional probabilities.
 * The basic idea is to find out what the probability of a document belonging to a class is,
 * based on the words in the text, whereas the single words are treated as independent features.
 * Useful for categorizing any text content into any arbitrary set of categories.
 * Example: is an email spam, or not spam?
 * Example: is a news article about technology, politics, or sports?
 * Example: is a piece of text expressing positive emotions, or negative emotions?
 *
 * @example <caption>new NaiveBayes()</caption>
 * const messages = [
 *   ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'clean'],
 *   ['Donec faucibus vulputate feugiat.', 'spam'],
 *   ['Duis eu sapien nec elit consectetur convallis.', 'clean'],
 *   [1, 'spam'],
 * ];
 * const filter = new NaiveBayes();
 * messages.forEach(([message, category]) => {
 *   filter.train(message, category);
 * });
 * filter.setThreshold('spam', 0.5);
 * filter.classify('dolor sit amet');
 *  ➜ 'clean'
 * @class
 */
class NaiveBayes extends Classifier {
  /**
   * Returns the category for a given item, or a fallback if a category cannot be determined.
   *
   * @param {string} item - The item to classify.
   * @param {string} [fallback='_'] - The category to fallback to when one cannot be determined.
   * @returns {string} - The best category for the provided item.
   * @memberof Classifier
   */
  classify(item, fallback = '_') {
    debug('classify:', item, fallback);
    if (typeof item !== 'string' || item.length === 0) {
      debug('item must be a string, got:', typeof item);
      return fallback;
    }

    let best = fallback;
    let max = 0;
    const categories = this.getCategories();
    const probabilities = {};

    categories.forEach((category) => {
      probabilities[category] = this.probability(item, category);

      if (probabilities[category] > max) {
        max = probabilities[category];
        best = category;
      }
    });

    const found = Object.keys(probabilities).find(
      (category) => category !== best && probabilities[category] * this.getThreshold(best) > probabilities[best],
    );

    /* istanbul ignore next */
    return found ? fallback : best;
  }

  /**
   * Returns the weighted probability of a given document (item) in a given category.
   *
   * @param {string} item - The item to find the probability of being in the given category.
   * @param {string} category - The category to check against the item.
   * @returns {number} - The weighted probability of the item in the category.
   * @memberof Classifier
   */
  documentProbability(item, category) {
    debug('documentProbability:', item, category);
    const probability = Classifier.getFeatures(item).reduce(
      (result, feature) => result * this.weightedProbability(feature, category, this.featureProbability(feature, category)), 1,
    );
    debug('documentProbability =', probability);
    return probability;
  }

  /**
   * Returns the probability of a given document (item) in a given category.
   *
   * @param {string} item - The item to find the probability of being in the given category.
   * @param {string} category - The category to check against the item.
   * @returns {number} - The probability of the item in the category.
   * @memberof Classifier
   */
  probability(item, category) {
    debug('probability:', item, category);
    const categoryProbability = this.categoryCount(category) / this.totalCount();
    const documentProbability = this.documentProbability(item, category);

    const probability = documentProbability * categoryProbability;
    debug('probability =', probability);
    return probability;
  }

  /**
   * Returns the threshold for a given category.
   *
   * @param {string} category - The category to get the threshold for.
   * @returns {number} - The miniumum for the category, or 0.5.
   * @memberof Classifier
   */
  getThreshold(category) {
    debug('getThreshold:', category);
    const threshold = this.thresholds[category] || 0.5;
    debug('threshold =', threshold);
    return threshold;
  }

  /**
   * Sets the threshold for a given category.
   *
   * @param {string} category - The category to set the threshold for.
   * @param {number} threshold - The threshold to set for the category.
   * @returns {number} - The threshold for the category.
   * @memberof Classifier
   */
  setThreshold(category, threshold) {
    debug('setThreshold:', category, threshold);
    this.thresholds[category] = threshold;
    debug('threshold =', this.thresholds[category]);
    return threshold;
  }

  // eslint-disable-next-line class-methods-use-this
  setMinimum() {
    debug('setMinimum is only used with the Fisher classifier, this is NaiveBayes');
  }
}

module.exports = NaiveBayes;
