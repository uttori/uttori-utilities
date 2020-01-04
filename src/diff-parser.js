/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable security/detect-possible-timing-attacks */
const debug = require('debug')('Uttori.Utilities.DiffParser');
const Operator = require('./operator');
const TokenizeThis = require('./tokenizer');

// https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging
// https://git-scm.com/docs/git-diff
/**
  * Parses the output of a unified `diff` string into an abstract syntax tree.
  * The tree is object-based, where each key is the operator, and its value is an array of the operands.
  * The number of operands depends on if the operation is defined as unary, binary, or ternary in the config.
  * @property {Object} config - The configuration object.
  * @property {TokenizeThis} tokenizer - The tokenizer instance.
  * @property {Object} operators - The operators from config converted to Operator objects.
  * @example <caption>Init DiffParser</caption>
  * const parser = new DiffParser();
  * const parsed = parser.parse(unified_diff);
  * @class
  */
class DiffParser {
/**
  * Creates an instance of SqlWhereParser.
  * @param {Object} config - A configuration object.
  * @constructor
  */
  constructor(config = {}) {
    debug('constructor:', config);
    config = {
      operators: [],
      tokenizer: {
        convertLiterals: false,
        shouldDelimitBy: ['\n\r', '\r\n', '\n', '\r'],
        shouldMatch: [],
        shouldTokenize: [],
      },
      ...config,
    };
    this.tokenizer = new TokenizeThis(config.tokenizer);
    this.operators = {};
    this.config = config;
  }

  /**
   * Parse a SQL statement with an evaluator function.
   * Uses an implementation of the Shunting-Yard Algorithm: https://wcipeg.com/wiki/Shunting_yard_algorithm
   * See also: https://en.wikipedia.org/wiki/Shunting-yard_algorithm
   * @param {String} sql - Query string to process.
   * @param {Function} [evaluator] - Function to evaluate operators.
   * @returns {Object} - The parsed query tree.
   */
  parse(diff) {
    debug('parse:', diff);
    const output = [];
    const tokenStream = [];
    let activeFileComparison = false;
    let activeFileChunk = false;
    let activeGitLiteral = false;
    let hasDiffCli = false;
    let mode = '';

    let lineNumberOld = 0;
    let lineNumberNew = 0;

    this.tokenizer.tokenize(diff, (token, _surroundedBy) => {
      tokenStream.push(token);
    });

    tokenStream.forEach((token, index) => {
      /* istanbul ignore else */
      if (typeof token === 'string') {
        // console.log('token:', token);
        // console.log('activeFileComparison:', activeFileComparison);
        // console.log('activeFileChunk:', activeFileChunk);
        // console.log('output:', output);
        const output_index = output.length - 1;
        let chunk_index = output[output_index] && output[output_index].chunks ? output[output_index].chunks.length - 1 : 0;
        const literal_index = output[output_index] && output[output_index].git_binary_patch_literals ? output[output_index].git_binary_patch_literals.length - 1 : 0;

        // No file started, start one
        const type = DiffParser.detectLineType(token);
        tokenStream.push(type);
        switch (type) {
          case 'diff-cli': {
            output.push({
              type: 'text',
              cli: token,
              chunks: [],
            });
            hasDiffCli = true;
            activeFileChunk = false;
            activeFileComparison = true;
            activeGitLiteral = false;
            return;
          }
          case 'new-file': {
            // Check for valid header lines
            if (tokenStream[index - 1].startsWith('--- ') && tokenStream[index + 1]) {
              output[output_index] = {
                ...output[output_index],
                new: DiffParser.praseFileLine(token),
              };
              activeFileChunk = false;
              activeFileComparison = true;
              activeGitLiteral = false;
            }
            break;
          }
          case 'old-file': {
            if (tokenStream[index + 1].startsWith('+++ ')) {
              if (!hasDiffCli) {
                console.log('no diff found, marking new file comparison');
                output.push({
                  cli: '',
                  chunks: [],
                  old: DiffParser.praseFileLine(token),
                });
              } else {
                output[output_index] = {
                  ...output[output_index],
                  old: DiffParser.praseFileLine(token),
                };
              }
              activeFileChunk = false;
              activeFileComparison = true;
              activeGitLiteral = false;
              // Reset diff check, we know we are in new file at this point.
              hasDiffCli = false;
            }
            break;
          }
          case 'index-checksum': {
            output[output_index] = {
              ...output[output_index],
              index: token,
            };
            mode = 'git';
            return;
          }
          case 'mode-change': {
            output[output_index] = {
              ...output[output_index],
              mode_change: token,
            };
            mode = 'git';
            return;
          }
          case 'deleted-file': {
            output[output_index] = {
              ...output[output_index],
              deleted: token,
            };
            mode = 'git';
            return;
          }
          case 'new-file-git': {
            output[output_index] = {
              ...output[output_index],
              new_file: token,
            };
            mode = 'git';
            return;
          }
          case 'binary': {
            output[output_index] = {
              ...output[output_index],
              type: 'binary',
              text: token,
            };
            activeFileChunk = false;
            activeFileComparison = false;
            activeGitLiteral = false;
            mode = 'git';
            return;
          }
          case 'dissimilarity-index': {
            output[output_index] = {
              ...output[output_index],
              dissimilarity_index: token,
            };
            mode = 'git';
            return;
          }
          case 'similarity-index': {
            output[output_index] = {
              ...output[output_index],
              similarity_index: token, // unchanged percentage
            };
            mode = 'git';
            return;
          }
          case 'copy-from': {
            output[output_index] = {
              ...output[output_index],
              copy_from: token,
            };
            mode = 'git';
            return;
          }
          case 'copy-to': {
            output[output_index] = {
              ...output[output_index],
              copy_to: token,
            };
            mode = 'git';
            return;
          }
          case 'rename-from': {
            output[output_index] = {
              ...output[output_index],
              rename_to: token,
            };
            mode = 'git';
            return;
          }
          case 'rename-to': {
            output[output_index] = {
              ...output[output_index],
              rename_to: token,
            };
            mode = 'git';
            return;
          }
          case 'git-binary-patch': {
            output[output_index] = {
              ...output[output_index],
              git_binary_patch: token,
              git_binary_patch_literals: [],
              type: 'binary',
            };
            mode = 'git';
            return;
          }
          case 'git-binary-patch-literal': {
            output[output_index].git_binary_patch_literals.push({
              header: token,
              lines: [],
            });
            activeGitLiteral = true;
            mode = 'git';
            return;
          }
          case 'chunk-header-combined': {
            let header = token;
            let content;

            // Check for contect on the same line, is this even valid?
            if (!token.trim().endsWith('@@@')) {
              // Extract header, push content in.
              const last_index = token.lastIndexOf('@@@');
              header = token.slice(0, last_index + 3);
              content = token.slice(last_index + 3);
            }

            header = DiffParser.praseChunkHeader(header);
            output[output_index] = {
              ...output[output_index],
              type: 'text',
            };
            output[output_index].chunks.push({
              header,
              lines: [],
            });
            activeFileChunk = true;
            mode = 'combined';
            /* istanbul ignore next */
            lineNumberOld = header.line_numbers_from_file_a.start || 1;
            /* istanbul ignore next */
            lineNumberNew = header.line_numbers_to_file.start || 1;

            if (content) {
              chunk_index = output[output_index].chunks.length - 1;
              content = DiffParser.parseCombinedContent(content, { old: lineNumberOld, new: lineNumberNew });
              /* istanbul ignore else */
              if (['unchanged', 'change-new', 'change-old', 'change-both-add', 'change-both-remove-add', 'change-both-add-remove'].includes(content.type)) {
                lineNumberNew += 1;
              }
              /* istanbul ignore else */
              if (['unchanged', 'change-new', 'change-old', 'change-both-remove', 'change-both-remove-add', 'change-both-add-remove'].includes(content.type)) {
                lineNumberOld += 1;
              }
              output[output_index].chunks[chunk_index].lines.push(content);
            }
            return;
          }
          case 'chunk-header': {
            let header = token;
            let content;

            // Check for contect on the same line, is this even valid?
            if (!token.trim().endsWith('@@')) {
              // Extract header, push content in.
              const last_index = token.lastIndexOf('@@');
              header = token.slice(0, last_index + 2);
              content = token.slice(last_index + 2);
            }

            header = DiffParser.praseChunkHeader(header);
            output[output_index] = {
              ...output[output_index],
              type: 'text',
            };
            output[output_index].chunks.push({
              header,
              lines: [],
            });
            activeFileChunk = true;
            mode = 'unified';
            lineNumberOld = header.line_numbers_from_file.start || 1;
            lineNumberNew = header.line_numbers_to_file.start || 1;

            if (content) {
              chunk_index = output[output_index].chunks.length - 1;
              content = DiffParser.parseUnifiedContent(content, { old: lineNumberOld, new: lineNumberNew });
              /* istanbul ignore else */
              if (['unchanged', 'change-new'].includes(content.type)) {
                lineNumberNew += 1;
              }
              /* istanbul ignore else */
              if (['unchanged', 'change-old'].includes(content.type)) {
                lineNumberOld += 1;
              }
              output[output_index].chunks[chunk_index].lines.push(content);
            }
            return;
          }
          default: {
            // Diff content lines
            /* istanbul ignore else */
            if (activeFileComparison && activeFileChunk) {
              const header = { old: lineNumberOld, new: lineNumberNew };
              let content;
              if (mode === 'unified') {
                content = DiffParser.parseUnifiedContent(token, header);
                if (['unchanged', 'change-new'].includes(content.type)) {
                  lineNumberNew += 1;
                }
                if (['unchanged', 'change-old'].includes(content.type)) {
                  lineNumberOld += 1;
                }
              } else {
                content = DiffParser.parseCombinedContent(token, header);
                /* istanbul ignore else */
                if (['unchanged', 'change-new', 'change-old', 'change-both-add', 'change-both-remove-add', 'change-both-add-remove'].includes(content.type)) {
                  lineNumberNew += 1;
                }
                /* istanbul ignore else */
                if (['unchanged', 'change-new', 'change-old', 'change-both-remove', 'change-both-remove-add', 'change-both-add-remove'].includes(content.type)) {
                  lineNumberOld += 1;
                }
              }

              output[output_index].chunks[chunk_index].lines.push(content);
              return;
            }

            // In a GIT binary patch, keep adding lines
            /* istanbul ignore else */
            if (activeGitLiteral) {
              output[output_index].git_binary_patch_literals[literal_index].lines.push(token);
            }
            break;
          }
        }
      }
    });

    return output;
  }

  static detectLineType(line = '') {
    if (!line) {
      return 'unknown';
    }
    if (line.startsWith('diff ')) {
      return 'diff-cli';
    }
    if (line.startsWith('--- ')) {
      return 'old-file';
    }
    if (line.startsWith('+++ ')) {
      return 'new-file';
    }
    if (line.startsWith('index ')) {
      return 'index-checksum';
    }
    if (line.startsWith('mode ')) {
      return 'mode-change';
    }
    if (line.startsWith('deleted file mode')) {
      return 'deleted-file';
    }
    if (line.startsWith('Binary files ') && line.trim().endsWith(' differ')) {
      return 'binary';
    }
    if (line.startsWith('new file mode')) {
      return 'new-file-git';
    }
    if (line.startsWith('dissimilarity index')) {
      return 'dissimilarity-index';
    }
    if (line.startsWith('similarity index')) {
      return 'similarity-index';
    }
    if (line.startsWith('copy from ')) {
      return 'copy-from';
    }
    if (line.startsWith('copy to ')) {
      return 'copy-to';
    }
    if (line.startsWith('rename from ')) {
      return 'rename-from';
    }
    if (line.startsWith('rename to ')) {
      return 'rename-to';
    }
    if (line.startsWith('GIT binary patch')) {
      return 'git-binary-patch';
    }
    if (line.startsWith('literal ')) {
      return 'git-binary-patch-literal';
    }
    if (line.startsWith('@@@ ') && (line.match(/@@@/g)).length === 2) {
      return 'chunk-header-combined';
    }
    if (line.startsWith('@@ ') && (line.match(/@@/g)).length === 2) {
      return 'chunk-header';
    }

    return 'unknown';
  }

  static parseUnifiedContent(line = '', header = { old: 0, new: 0 }) {
    const lineType = line.slice(0, 1);
    const text = line.slice(1);
    switch (lineType) {
      case ' ': {
        return {
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'unchanged',
        };
      }
      case '+': {
        return {
          line_number_new: header.new,
          line_number_old: null,
          raw: line,
          text,
          type: 'change-new',
        };
      }
      case '-': {
        return {
          line_number_new: null,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-old',
        };
      }
      case '\\': {
        // \ No newline at end of file
        return {
          line_number_new: null,
          line_number_old: null,
          raw: line,
          text,
          type: 'missing-new-line-eof',
        };
      }
      default: {
        return {
          line_number_new: null,
          line_number_old: null,
          raw: line,
          text,
          type: 'unknown',
        };
      }
    }
  }

  static parseCombinedContent(line = '', header = { old: 0, new: 0 }) {
    const lineType = line.slice(0, 2);
    const text = line.slice(2);
    switch (lineType) {
      case '  ': {
        return {
          file: ['a', 'b'],
          line_number_new: header.new++,
          line_number_old: header.old++,
          raw: line,
          text,
          type: 'unchanged',
        };
      }
      case '+ ': {
        return {
          file: ['a'],
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-new',
        };
      }
      case '- ': {
        return {
          file: ['a'],
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-old',
        };
      }
      case ' +': {
        return {
          file: ['b'],
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-new',
        };
      }
      case ' -': {
        return {
          file: ['b'],
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-old',
        };
      }
      case '++': {
        return {
          file: ['a', 'b'],
          line_number_new: header.new,
          line_number_old: null,
          raw: line,
          text,
          type: 'change-both-add',
        };
      }
      case '--': {
        return {
          file: ['a', 'b'],
          line_number_new: null,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-both-remove',
        };
      }
      case '-+': {
        return {
          file: ['a', 'b'],
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-both-remove-add',
        };
      }
      case '+-': {
        return {
          file: ['a', 'b'],
          line_number_new: header.new,
          line_number_old: header.old,
          raw: line,
          text,
          type: 'change-both-add-remove',
        };
      }
      default: {
        return {
          file: [],
          line_number_new: null,
          line_number_old: null,
          raw: line,
          text,
          type: 'unknown',
        };
      }
    }
  }

  // Hunks of differences; each hunk shows one area where the files differ.
  // If a hunk contains just one line, only its start line number appears. Otherwise its line numbers look like ‘start,count’. An empty hunk is considered to start at the line that follows the hunk.
  // If a hunk and its context contain two or more lines, its line numbers look like ‘start,count’. Otherwise only its end line number appears. An empty hunk is considered to end at the line that precedes the hunk.
  static praseChunkHeader(raw = '') {
    let line = raw;
    if (line.startsWith('@@ ') && line.trim().endsWith(' @@')) {
      line = line.trim().replace(/\s?@@\s?/g, '');
      const changes = line.split(' ');
      const offsets = changes.map((change) => change.split(','));
      if (!offsets[0] || !offsets[1]) {
        return {
          error: 'invalid',
          line_numbers_from_file: {
            start: 1,
            count: 0,
          },
          line_numbers_to_file: {
            start: 1,
            count: 0,
          },
          mode: 'unified',
          raw,
        };
      }
      return {
        line_numbers_from_file: {
          count: parseInt(offsets[0][1] || 0, 10),
          start: parseInt(offsets[0][0].slice(1), 10),
        },
        line_numbers_to_file: {
          count: parseInt(offsets[1][1] || 0, 10),
          start: parseInt(offsets[1][0].slice(1), 10),
        },
        mode: 'unified',
        raw,
      };
    }
    if (line.startsWith('@@@ ') && line.trim().endsWith(' @@@')) {
      line = line.trim().replace(/\s?@@@\s?/g, '');
      const changes = line.split(' ');
      const offsets = changes.map((change) => change.split(','));
      if (!offsets[0] || !offsets[1] || !offsets[2]) {
        return {
          error: 'invalid',
          line_numbers_from_file_a: {
            start: 1,
            count: 0,
          },
          line_numbers_from_file_b: {
            start: 1,
            count: 0,
          },
          line_numbers_to_file: {
            start: 1,
            count: 0,
          },
          mode: 'combined',
          raw,
        };
      }
      return {
        line_numbers_from_file_a: {
          count: parseInt(offsets[0][1] || 0, 10),
          start: parseInt(offsets[0][0].slice(1), 10),
        },
        line_numbers_from_file_b: {
          count: parseInt(offsets[1][1] || 0, 10),
          start: parseInt(offsets[1][0].slice(1), 10),
        },
        line_numbers_to_file: {
          count: parseInt(offsets[2][1] || 0, 10),
          start: parseInt(offsets[2][0].slice(1), 10),
        },
        mode: 'combined',
        raw,
      };
    }

    return {
      line_numbers_from_file: {
        start: 1,
        count: 0,
      },
      line_numbers_to_file: {
        start: 1,
        count: 0,
      },
      mode: 'none',
      raw,
    };
  }

  /*
   * +++ Date Timestamp[FractionalSeconds] TimeZone
   * +++ 2002-02-21 23:30:39.942229878 -0800
   * https://www.gnu.org/software/diffutils/manual/html_node/Detailed-Unified.html
   */
  static praseFileLine(raw) {
    let date = '';
    let time = '';
    let fraction_seconds = '';
    let time_zone = '';
    let type = '';
    let filename = '';

    // Detect Line Type: --- or +++
    if (raw.startsWith('+++ ')) {
      type = 'new-file';
      filename = raw.replace(/^\+{3}\s/, '');
    } else if (raw.startsWith('--- ')) {
      type = 'old-file';
      filename = raw.replace(/^-{3}\s/, '');
    } else {
      type = 'unknown';
      filename = raw;
    }

    // Remove Quotes
    const filename_quoted = filename.match(/^"(.*?)"/);
    if (filename_quoted && filename_quoted.length > 0) {
      filename = filename.replace(filename_quoted[0], filename_quoted[1]);
    }

    // Replace prefixes
    let prefix_done = false;
    const prefixes = ['a/', 'b/', 'c/', 'i/', 'o/', 'w/'];
    prefixes.forEach((prefix) => {
      if (prefix_done) {
        return;
      }
      if (filename.startsWith(prefix)) {
        // eslint-disable-next-line security/detect-non-literal-regexp
        filename = filename.replace(new RegExp(`^${prefix}`), '');
        prefix_done = true;
      }
    });

    // Extract timestamps generated by the unified diff
    const datetime_regex = /\s+\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)? [+-]\d{4}.*$/;
    const matches = filename.match(datetime_regex);
    if (matches && matches.length > 0) {
      [date, time, time_zone] = matches[0].trim().split(' ');
      if (time.includes('.')) {
        [time, fraction_seconds] = time.split('.');
      }
      filename = filename.replace(datetime_regex, '');
    }

    filename = filename.trim();

    return {
      raw,
      type,
      filename,
      date,
      time,
      fraction_seconds,
      time_zone,
    };
  }
}

module.exports = DiffParser;