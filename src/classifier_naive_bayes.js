const debug = require('debug')('Uttori.Utilities.NaiveBayes');
const Classifier = require('./classifier');

// https://en.wikipedia.org/wiki/Naive_Bayes_classifier
// https://github.com/ttezel/bayes/blob/master/lib/naive_bayes.js
// https://github.com/substack/gamma.js/blob/master/index.js
// https://github.com/zetos/inv-chisquare-cdf/blob/master/src/invChiSquareCDF.js
class NaiveBayes extends Classifier {
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

  documentProbability(item, category) {
    debug('documentProbability:', item, category);
    return Classifier.getFeatures(item).reduce(
      (result, feature) => result * this.weightedProbability(feature, category, this.featureProbability(feature, category)), 1,
    );
  }

  probability(item, category) {
    debug('probability:', item, category);
    const categoryProbability = this.categoryCount(category) / this.totalCount();
    const documentProbability = this.documentProbability(item, category);

    const probability = documentProbability * categoryProbability;
    debug('probability =', probability);
    return probability;
  }

  // get thresholds for categories.
  getThreshold(category) {
    debug('getThreshold:', category);
    const threshold = this.thresholds[category] || 0.5;
    debug('threshold =', threshold);
    return threshold;
  }

  // set thresholds for categories.
  setThreshold(category, threshold) {
    debug('setThreshold:', category, threshold);
    this.thresholds[category] = threshold;
    debug('threshold =', this.thresholds[category]);
    return this;
  }

  setMinimum() {
    debug('setMinimum is only used with the Fisher classifier, this is NaiveBayes');
    return this;
  }
}

module.exports = NaiveBayes;
