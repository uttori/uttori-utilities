<a name="NaiveBayes"></a>

## NaiveBayes
A Naive-Bayes text classifier based on the idea of Bayes' Theorem,
which is used to calculate conditional probabilities.
The basic idea is to find out what the probability of a document belonging to a class is,
based on the words in the text, whereas the single words are treated as independent features.
Useful for categorizing any text content into any arbitrary set of categories.
Example: is an email spam, or not spam?
Example: is a news article about technology, politics, or sports?
Example: is a piece of text expressing positive emotions, or negative emotions?

**Kind**: global class  

* [NaiveBayes](#NaiveBayes)
    * [.classify(item, [fallback])](#NaiveBayes+classify) ⇒ <code>string</code>
    * [.documentProbability(item, category)](#NaiveBayes+documentProbability) ⇒ <code>number</code>
    * [.probability(item, category)](#NaiveBayes+probability) ⇒ <code>number</code>
    * [.getThreshold(category)](#NaiveBayes+getThreshold) ⇒ <code>number</code>
    * [.setThreshold(category, threshold)](#NaiveBayes+setThreshold) ⇒ <code>number</code>

<a name="NaiveBayes+classify"></a>

### naiveBayes.classify(item, [fallback]) ⇒ <code>string</code>
Returns the category for a given item, or a fallback if a category cannot be determined.

**Kind**: instance method of [<code>NaiveBayes</code>](#NaiveBayes)  
**Returns**: <code>string</code> - - The best category for the provided item.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| item | <code>string</code> |  | The item to classify. |
| [fallback] | <code>string</code> | <code>&quot;&#x27;_&#x27;&quot;</code> | The category to fallback to when one cannot be determined. |

<a name="NaiveBayes+documentProbability"></a>

### naiveBayes.documentProbability(item, category) ⇒ <code>number</code>
Returns the weighted probability of a given document (item) in a given category.

**Kind**: instance method of [<code>NaiveBayes</code>](#NaiveBayes)  
**Returns**: <code>number</code> - - The weighted probability of the item in the category.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>string</code> | The item to find the probability of being in the given category. |
| category | <code>string</code> | The category to check against the item. |

<a name="NaiveBayes+probability"></a>

### naiveBayes.probability(item, category) ⇒ <code>number</code>
Returns the probability of a given document (item) in a given category.

**Kind**: instance method of [<code>NaiveBayes</code>](#NaiveBayes)  
**Returns**: <code>number</code> - - The probability of the item in the category.  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>string</code> | The item to find the probability of being in the given category. |
| category | <code>string</code> | The category to check against the item. |

<a name="NaiveBayes+getThreshold"></a>

### naiveBayes.getThreshold(category) ⇒ <code>number</code>
Returns the threshold for a given category.

**Kind**: instance method of [<code>NaiveBayes</code>](#NaiveBayes)  
**Returns**: <code>number</code> - - The miniumum for the category, or 0.5.  

| Param | Type | Description |
| --- | --- | --- |
| category | <code>string</code> | The category to get the threshold for. |

<a name="NaiveBayes+setThreshold"></a>

### naiveBayes.setThreshold(category, threshold) ⇒ <code>number</code>
Sets the threshold for a given category.

**Kind**: instance method of [<code>NaiveBayes</code>](#NaiveBayes)  
**Returns**: <code>number</code> - - The threshold for the category.  

| Param | Type | Description |
| --- | --- | --- |
| category | <code>string</code> | The category to set the threshold for. |
| threshold | <code>number</code> | The threshold to set for the category. |

