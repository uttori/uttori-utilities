const debug = require('debug')('Uttori.Utilities.Fisher');
const Classifier = require('./classifier');

/**
 * Unlike Naïve Bayes, which combines feature probabilities to arrive at document probability,
 * Fisher calculates category probability for each feature, combines the probabilities,
 * then sees if the set of probabilities is more or less than the expected value for a random document.
 * Calculate normalized Bayesian probability, then fit the result to an inverse chi-square function
 * to see what is the probability that a random document of that classification would have those features (i.e., terms).
 * Fisher normalizes the frequencies for each category, so we might have far more "bad" training data than good,
 * so the net cast by the "bad" data will be "wider" than we'd like.
 * Example: is an email spam, or not spam?
 * Example: is a news article about technology, politics, or sports?
 * Example: is a piece of text expressing positive emotions, or negative emotions?
 *
 * @example <caption>new Fisher()</caption>
 * const messages = [
 *   ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'clean'],
 *   ['Donec faucibus vulputate feugiat.', 'spam'],
 *   ['Duis eu sapien nec elit consectetur convallis.', 'clean'],
 *   [1, 'spam'],
 * ];
 * const filter = new Fisher();
 * messages.forEach(([message, category]) => {
 *   filter.train(message, category);
 * });
 * filter.setMinimum('spam', 0.5);
 * filter.classify('dolor sit amet');
 *  ➜ 'clean'
 * @class
 */
class Fisher extends Classifier {
  /**
   * Classifies a given item, falling back to a given fallback or underscore.
   *
   * @param {string} item - The item to classify.
   * @param {string} [fallback='_'] - The category to fallback to when one cannot be determined.
   * @returns {string} - The best category for the provided item.
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

    categories.forEach((category) => {
      const p = this.fisherProbability(item, category);
      if (p > this.getMinimum(category) && p > max) {
        max = p;
        best = category;
      }
    });

    return best;
  }

  /**
   * Returns the probability of a given feature in a given category.
   *
   * @param {string} feature - The feature to look up in the category.
   * @param {string} category - The category to find the feature in.
   * @returns {number} - The probability, the frequency in this category divided by the overall frequency.
   */
  categoryProbability(feature, category) {
    // The frequency of this feature in this category.
    const clf = this.featureProbability(feature, category);
    if (clf === 0) {
      return 0;
    }

    // The frequency of this feature in all the categories.
    const frequencySum = this.getCategories().reduce((result, key) => result + this.featureProbability(feature, key), 0);

    // The probability is the frequency in this category divided by the overall frequency.
    return clf / frequencySum;
  }

  /**
   * Returns the Fisher probability of a given item in a given category.
   *
   * @param {string} item - The item to determine the probabolity of being in the category.
   * @param {string} category - The category to find the item in.
   * @returns {number} - The probability, using Inverse Chi Squared.
   */
  fisherProbability(item, category) {
    const features = Classifier.getFeatures(item);
    // Multiply all the probabilities together.
    const probability = features.reduce((result, feature) => result * this.weightedProbability(feature, category, this.categoryProbability(feature, category)), 1);

    // Take the natural log of the probability and multiply by -2.
    const fScore = (-2) * Math.log(probability);

    // Use the provided Inverse Chi Squared function to get the probability of getting the fScore value we got.
    return Fisher.inverseChiSquared(fScore, features.length * 2);
  }

  /**
   * Returns the minimum for a given category.
   *
   * @param {string} category - The category to get the minimum for.
   * @returns {number} - The miniumum for the category, or 0.5.
   */
  getMinimum(category) {
    return this.minimums[category] || 0.5;
  }

  /**
   * Sets the minimum for a given category.
   *
   * @param {string} category - The category to set the minimum for.
   * @param {number} minimum - The minimum to set for the category.
   * @returns {number} - The miniumum for the category.
   */
  setMinimum(category, minimum) {
    this.minimums[category] = minimum;
    return this.minimums[category];
  }

  // eslint-disable-next-line class-methods-use-this
  setThreshold() {
    debug('setThreshold is only used with the NaiveBayes classifier, this is Fisher');
  }

  /**
   * The inverse chi squared distribution is a continuous probability distribution
   * of the reciprocal of a variable distributed according to the chi squared distribution.
   *
   * @param {number} probability - The scale, or, probability.
   * @param {number} degreeOfFreedom - The variance, or, degree of freedom.
   * @returns {number} - The miniumum for the category.
   * @see {@link https://en.wikipedia.org/wiki/Inverse-chi-squared_distribution|Inverse-Chi-Squared Distribution}
   */
  static inverseChiSquared(probability, degreeOfFreedom) {
    const m = probability / 2;
    let sum = Math.exp((-1) * m);
    let term = Math.exp((-1) * m);

    for (let i = 1; i < Math.floor(degreeOfFreedom / 2); i++) {
      term *= m / i;
      sum += term;
    }
    /* istanbul ignore next */
    return sum < 1 ? sum : 1;
  }
}

module.exports = Fisher;
