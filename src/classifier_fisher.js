const debug = require('debug')('Uttori.Utilities.Fisher');
const Classifier = require('./classifier');

// https://en.wikipedia.org/wiki/Inverse-chi-squared_distribution
class Fisher extends Classifier {
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

  cProb(feature, category) {
    const clf = this.featureProbability(feature, category);

    if (clf === 0) {
      return 0;
    }

    const freqSum = this.getCategories().reduce(
      (result, key) => result + this.featureProbability(feature, key), 0,
    );

    return clf / freqSum;
  }

  // using Inverse Chi Squared
  fisherProbability(item, category) {
    const features = Classifier.getFeatures(item);
    const probability = features.reduce(
      (result, feature) => result * this.weightedProbability(feature, category, this.cProb(feature, category)), 1,
    );
    const fScore = (-2) * Math.log(probability);

    // fScore === probability === mean
    // degreeOfFreedom === variance
    return Fisher.inverseChiSquared(fScore, features.length * 2);
  }

  getMinimum(category) {
    return this.minimums[category] || 0.5;
  }

  setMinimum(category, minimum) {
    this.minimums[category] = minimum;
    return this;
  }

  setThreshold() {
    debug('setThreshold is only used with the NaiveBayes classifier, this is Fisher');
    return this;
  }


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
