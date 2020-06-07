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

* [Fisher](#Fisher)
    * _instance_
        * [.classify(item, [fallback])](#Fisher+classify) ⇒ <code>string</code>
        * [.categoryProbability(feature, category)](#Fisher+categoryProbability) ⇒ <code>number</code>
        * [.fisherProbability(item, category)](#Fisher+fisherProbability) ⇒ <code>number</code>
        * [.getMinimum(category)](#Fisher+getMinimum) ⇒ <code>number</code>
        * [.setMinimum(category, minimum)](#Fisher+setMinimum) ⇒ <code>number</code>
    * _static_
        * [.inverseChiSquared(probability, degreeOfFreedom)](#Fisher.inverseChiSquared) ⇒ <code>number</code>

<a name="Fisher+classify"></a>

### fisher.classify(item, [fallback]) ⇒ <code>string</code>
Classifies a given item, falling back to a given fallback or underscore.

**Kind**: instance method of [<code>Fisher</code>](#Fisher)  
**Returns**: <code>string</code> - - The best category for the provided item.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>string</code> |  | The item to classify. |
| [fallback] | <code>string</code> | <code>&quot;&#x27;_&#x27;&quot;</code> | The category to fallback to when one cannot be determined. |

<a name="Fisher+categoryProbability"></a>

### fisher.categoryProbability(feature, category) ⇒ <code>number</code>
Returns the probability of a given feature in a given category.

**Kind**: instance method of [<code>Fisher</code>](#Fisher)  
**Returns**: <code>number</code> - - The probability, the frequency in this category divided by the overall frequency.  

| Param | Type | Description |
| --- | --- | --- |
| feature | <code>string</code> | The feature to look up in the category. |
| category | <code>string</code> | The category to find the feature in. |

<a name="Fisher+fisherProbability"></a>

### fisher.fisherProbability(item, category) ⇒ <code>number</code>
Returns the Fisher probability of a given item in a given category.

**Kind**: instance method of [<code>Fisher</code>](#Fisher)  
**Returns**: <code>number</code> - - The probability, using Inverse Chi Squared.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>string</code> | The item to determine the probabolity of being in the category. |
| category | <code>string</code> | The category to find the item in. |

<a name="Fisher+getMinimum"></a>

### fisher.getMinimum(category) ⇒ <code>number</code>
Returns the minimum for a given category.

**Kind**: instance method of [<code>Fisher</code>](#Fisher)  
**Returns**: <code>number</code> - - The miniumum for the category, or 0.5.  

| Param | Type | Description |
| --- | --- | --- |
| category | <code>string</code> | The category to get the minimum for. |

<a name="Fisher+setMinimum"></a>

### fisher.setMinimum(category, minimum) ⇒ <code>number</code>
Sets the minimum for a given category.

**Kind**: instance method of [<code>Fisher</code>](#Fisher)  
**Returns**: <code>number</code> - - The miniumum for the category.  

| Param | Type | Description |
| --- | --- | --- |
| category | <code>string</code> | The category to set the minimum for. |
| minimum | <code>number</code> | The minimum to set for the category. |

<a name="Fisher.inverseChiSquared"></a>

### Fisher.inverseChiSquared(probability, degreeOfFreedom) ⇒ <code>number</code>
The inverse chi squared distribution is a continuous probability distribution
of the reciprocal of a variable distributed according to the chi squared distribution.

**Kind**: static method of [<code>Fisher</code>](#Fisher)  
**Returns**: <code>number</code> - - The miniumum for the category.  
**See**: [Inverse-Chi-Squared Distribution](https://en.wikipedia.org/wiki/Inverse-chi-squared_distribution)  

| Param | Type | Description |
| --- | --- | --- |
| probability | <code>number</code> | The scale, or, probability. |
| degreeOfFreedom | <code>number</code> | The variance, or, degree of freedom. |

