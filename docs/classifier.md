<a name="Classifier"></a>

## Classifier
Classifier base class for use with the Naive Bayes and Fisher classifiers.
In practice, it is better tolerating false positives for "good", more than false negatives for "good".
Example: It is better to see a message that is spam rather than lose a message that is not spam.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [categories] | <code>Object</code> | Categories in the classfier. |
| [frequency] | <code>Object</code> | Frequency counts. |
| [minimums] | <code>Object</code> | Used in the Fisher classifier. |
| [thresholds] | <code>Object</code> | Used with the Naive Bayes classifier. |


* [Classifier](#Classifier)
    * [new Classifier([model])](#new_Classifier_new)
    * _instance_
        * [.categoryCount(category)](#Classifier+categoryCount) ⇒ <code>Number</code>
        * [.featureCount(feature, category)](#Classifier+featureCount) ⇒ <code>Number</code>
        * [.featureProbability(feature, category)](#Classifier+featureProbability) ⇒ <code>Number</code>
        * [.getCategories()](#Classifier+getCategories) ⇒ <code>Array.&lt;String&gt;</code>
        * [.incrementCategory(category)](#Classifier+incrementCategory)
        * [.incrementFeature(feature, category)](#Classifier+incrementFeature)
        * [.totalCount()](#Classifier+totalCount) ⇒ <code>Number</code>
        * [.train(item, category)](#Classifier+train)
        * [.weightedProbability(feature, _category, basicProbability, [weight], [assumedProbability])](#Classifier+weightedProbability) ⇒ <code>Number</code>
        * [.save([spaces])](#Classifier+save) ⇒ <code>String</code>
    * _static_
        * [.getFeatures(text)](#Classifier.getFeatures) ⇒ <code>Array.&lt;String&gt;</code>

<a name="new_Classifier_new"></a>

### new Classifier([model])
Creates a new Classifier.


| Param | Type | Description |
| --- | --- | --- |
| [model] | <code>Object</code> | The trained model to initiate with. |

**Example** *(new Classifier(model))*  
```js
const classifier = new Classifier();
classifier.train(item, category);
Classifier.getFeatures('test');
```
<a name="Classifier+categoryCount"></a>

### classifier.categoryCount(category) ⇒ <code>Number</code>
Returns the count for a given category or 0 if the category isn't found.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Number</code> - - The count for the provided category.  

| Param | Type | Description |
| --- | --- | --- |
| category | <code>String</code> | The category to find the count for. |

<a name="Classifier+featureCount"></a>

### classifier.featureCount(feature, category) ⇒ <code>Number</code>
Returns the frequency for a given category in a given feature, or 0 if the feature or category isn't found.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Number</code> - - The count for the provided category of the provided feature.  

| Param | Type | Description |
| --- | --- | --- |
| feature | <code>String</code> | The feature to look for the category in. |
| category | <code>String</code> | The category to find the count for. |

<a name="Classifier+featureProbability"></a>

### classifier.featureProbability(feature, category) ⇒ <code>Number</code>
Returns the probability for a given category in a given feature, or 0 if the category isn't found.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Number</code> - - The probability for the feature to match the category (feature count / category count).  

| Param | Type | Description |
| --- | --- | --- |
| feature | <code>String</code> | The feature to look for the category in. |
| category | <code>String</code> | The category to find the count for. |

<a name="Classifier+getCategories"></a>

### classifier.getCategories() ⇒ <code>Array.&lt;String&gt;</code>
Returns the names of all the categories.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Array.&lt;String&gt;</code> - - The array of category keys.  
<a name="Classifier+incrementCategory"></a>

### classifier.incrementCategory(category)
Increment or instantiate a count for a given category.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  

| Param | Type | Description |
| --- | --- | --- |
| category | <code>String</code> | The category to increment the count for. |

<a name="Classifier+incrementFeature"></a>

### classifier.incrementFeature(feature, category)
Increment or instantiate a count for a given category of a given feature.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  

| Param | Type | Description |
| --- | --- | --- |
| feature | <code>String</code> | The feature to find the category to increment the count for. |
| category | <code>String</code> | The category to increment the count for. |

<a name="Classifier+totalCount"></a>

### classifier.totalCount() ⇒ <code>Number</code>
Returns the total count of categories.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Number</code> - - The count of used categories.  
<a name="Classifier+train"></a>

### classifier.train(item, category)
Trains the classifier with a given item, for a given category

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  

| Param | Type | Description |
| --- | --- | --- |
| item | <code>String</code> | The item to train a given category. |
| category | <code>String</code> | The category to increment the count for. |

<a name="Classifier+weightedProbability"></a>

### classifier.weightedProbability(feature, _category, basicProbability, [weight], [assumedProbability]) ⇒ <code>Number</code>
Returns the weightedProbability for a given feature

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Number</code> - - The weighted probability of the provided feature.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| feature | <code>String</code> |  | The feature to find the weighted probability of. |
| _category | <code>String</code> |  | Currently unused. |
| basicProbability | <code>Number</code> |  | The probability of the applicable classifier (Fisher: category, Naive Bayes: feature) |
| [weight] | <code>Number</code> | <code>1</code> | The provided weight of the feature. |
| [assumedProbability] | <code>Number</code> | <code>0.5</code> | Assumed probability of the feature. |

<a name="Classifier+save"></a>

### classifier.save([spaces]) ⇒ <code>String</code>
Exports the current model as a JSON string.

**Kind**: instance method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>String</code> - - The model as JSON.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [spaces] | <code>Number</code> | <code>0</code> | Spaces to indent JSON. |

<a name="Classifier.getFeatures"></a>

### Classifier.getFeatures(text) ⇒ <code>Array.&lt;String&gt;</code>
Given a text string, tokenize it into an array of word features.
This is the default used if one is not provided when instantiated.
This attempts to add support for English, Cyrillic, Korean, Japanese and Chinese.

The supported cheacter ranges are:
SU+0400 – U+04FF: Cyrillic, 256 characters
SU+0500 – U+052F: Cyrillic Supplement, 48 characters
SU+2DE0 – U+2DFF: Cyrillic Extended-A, 32 characters
SU+A640 – U+A69F: Cyrillic Extended-B, 96 characters
SU+1C80 – U+1C8F: Cyrillic Extended-C, 9 characters
SU+1D2B         : Cyrillic Phonetic Extensions, 1 of 2 characters
SU+1D78         : Cyrillic Phonetic Extensions, 2 of 2 characters
SU+FE2E – U+FE2F: Cyrillic Combining Half Marks, 2 characters
SU+1100 - U+11FF: Hangul Jamo (Korean) (Choseong, Jungseong, and Jongseong)
SU+3040 – U+30FF: Hiragana & Katakana (Japanese only)
SU+3400 – U+4DBF: CJK unified ideographs extension A (Chinese, Japanese, and Korean)
SU+4E00 – U+9FFF: CJK unified ideographs (Chinese, Japanese, and Korean)
SU+F900 – U+FAFF: CJK compatibility ideographs (Chinese, Japanese, and Korean)
SU+FF66 – U+FF9F: half-width katakana (Japanese only)

See also: https://en.wikipedia.org/wiki/Cyrillic_script_in_Unicode
See also: https://codeday.me/en/qa/20190306/12457.html
See also: http://flyingsky.github.io/2018/01/26/javascript-detect-chinese-japanese/

**Kind**: static method of [<code>Classifier</code>](#Classifier)  
**Returns**: <code>Array.&lt;String&gt;</code> - - The features found in the provided text.  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | Text to extract features from. |

