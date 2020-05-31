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
  UttoriEvent: require('./event'),
  EventDispatcher: require('./event-dispatcher'),
  Network: require('./network'),
  DataStream: require('./data-stream'),
  DataBuffer: require('./data-buffer'),
  DataBufferList: require('./data-buffer-list'),
  DataBitstream: require('./data-bitstream'),
  ImagePNG: require('./data-image-png'),
  CRC32: require('./data-hash-crc32'),
  DiffParser: require('./diff-parser'),
  FYShuffle: require('./fisher–yates-shuffle'),
};
