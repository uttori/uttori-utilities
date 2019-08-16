const debug = require('debug')('Uttori.Utilities.FileUtility');
const fs = require('fs-extra');
const sanitize = require('sanitize-filename');
const path = require('path');

/**
 * Creates a folder recursively.
 * @async
 * @param {string} folder - The folder to be created.
 */
const ensureDirectory = async (folder) => {
  /* istanbul ignore else */
  if (folder) {
    try {
      await fs.ensureDir(folder, { recursive: true });
    } catch (error) {
      /* istanbul ignore next */
      if (error.code !== 'EEXIST') {
        debug('Error creting directories:', error);
      }
    }
  }
};

/**
 * Creates a folder recursively.
 * @param {string} folder - The folder to be created.
 */
const ensureDirectorySync = (folder) => {
  /* istanbul ignore else */
  if (folder) {
    try {
      fs.ensureDirSync(folder, { recursive: true });
    } catch (error) {
      /* istanbul ignore next */
      if (error.code !== 'EEXIST') {
        debug('Error creting directories:', error);
      }
    }
  }
};

/**
 * Deletes a file from the file system.
 * @async
 * @param {string} folder - The folder of the file to be deleted.
 * @param {string} name - The name of the file to be deleted.
 * @param {string} extension - The file extension of the file to be deleted.
 */
const deleteFile = async (folder, name, extension) => {
  debug('deleteFile:', folder, name, extension);
  const target = `${folder}/${sanitize(`${name}`)}.${extension}`;
  debug('Deleting target:', target);
  try { await fs.unlink(target); } catch (error) {
    /* istanbul ignore next */
    debug('Error deleting file:', target, error);
  }
};

/**
 * Reads a file from the file system.
 * @async
 * @param {string} folder - The folder of the file to be read.
 * @param {string} name - The name of the file to be read.
 * @param {string} extension - The file extension of the file to be read.
 * @param {string} encoding - The encoding of the file to be read as.
 * @returns {Object} - The parsed JSON file contents.
 */
const readFile = async (folder, name, extension, encoding = 'utf8') => {
  debug('Reading File:', folder, name, extension, encoding);
  const target = `${folder}/${sanitize(`${name}`)}.${extension}`;
  debug('Reading target:', target);
  let content;
  try { content = await fs.readFile(target, encoding); } catch (error) {
    /* istanbul ignore next */
    debug('Error reading file:', target, error);
  }
  return content;
};

/**
 * Reads a JSON file from the file system and parses it to an object.
 * @async
 * @param {string} folder - The folder of the file to be read.
 * @param {string} name - The name of the file to be read.
 * @param {string} extension - The file extension of the file to be read.
 * @param {string} encoding - The encoding of the file to be read as.
 * @returns {Object} - The parsed JSON file contents.
 */
const readJSON = async (folder, name, extension, encoding = 'utf8') => {
  debug('Reading File:', folder, name, extension, encoding);
  const target = `${folder}/${sanitize(`${name}`)}.${extension}`;
  debug('Reading target:', target);
  let content;
  try { content = await fs.readFile(target, encoding); } catch (error) {
    /* istanbul ignore next */
    debug('Error reading file:', target, error);
  }
  try { content = JSON.parse(content); } catch (error) {
    /* istanbul ignore next */
    debug('Error parsing JSON:', content, error);
  }
  return content;
};

/**
 * Reads a folder from the file system.
 * @async
 * @param {string} folder - The folder to be read.
 * @returns {string[]} - The file paths found in the folder.
 */
const readFolder = async (folder) => {
  debug('Reading Folder:', folder);
  if (await fs.exists(folder)) {
    const content = await fs.readdir(folder);
    return content.map((file) => path.parse(file).name);
  }
  debug('Folder not found!');
  return [];
};

/**
 * Write a file to the file system.
 * @async
 * @param {object} config - The configuration object.
 * @param {string} config.extension - The file extension of the file to be written.
 * @param {string} folder - The folder of the file to be written.
 * @param {string} name - The name of the file to be written.
 * @param {string} content - The content of the file to be written.
 * @param {string} encoding - The encoding of the file to be written as.
 */
const writeFile = async (folder, name, extension, content, encoding = 'utf8') => {
  debug('writeFile:', folder, name, extension, content, encoding);
  const target = `${folder}/${sanitize(`${name}`)}.${extension}`;
  debug('Writing target:', target);
  try { await fs.writeFile(target, content, encoding); } catch (error) {
    /* istanbul ignore next */
    debug('Error writing file:', target, content, error);
  }
};

module.exports = {
  ensureDirectory,
  ensureDirectorySync,
  deleteFile,
  readFile,
  readJSON,
  readFolder,
  writeFile,
};
