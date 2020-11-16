// TODO Restructure to allow https://jaketrent.com/post/import-parts-node-packages-slash/
module.exports = {
  FileUtility: require('./file-utility'),
  FunctionQueue: require('./function-queue'),
  Operator: require('./operator'),
  parseQueryToArray: require('./parse-query-to-array'),
  parseQueryToRamda: require('./parse-query-to-ramda'),
  TokenizeThis: require('./tokenizer'),
  validateQuery: require('./validate-query'),
  SqlWhereParser: require('./where-parser'),
  Classifier: require('./classifier'),
  NaiveBayes: require('./classifier_naive_bayes'),
  Fisher: require('./classifier_fisher'),
  Network: require('./network'),
  DiffParser: require('./diff-parser'),
  fyShuffle: require('./fisher–yates-shuffle'),
};
