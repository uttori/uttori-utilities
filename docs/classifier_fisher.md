<a name="Fisher"></a>

## Fisher
Unlike Naïve Bayes, which combines feature probabilities to arrive at document probability,
Fisher calculates category probability for each feature, combines the probabilities,
then sees if the set of probabilities is more or less than the expected value for a random document.
Calculate normalized Bayesian probability, then fit the result to an inverse chi-square function
to see what is the probability that a random document of that classification would have those features (i.e., terms).
Fisher normalizes the frequencies for each category, so we might have far more "bad" training data than good,
so the net cast by the "bad" data will be "wider" than we'd like.
Example: is an email spam, or not spam?
Example: is a news article about technology, politics, or sports?
Example: is a piece of text expressing positive emotions, or negative emotions?

**Kind**: global class  
