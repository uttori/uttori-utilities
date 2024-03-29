const debug = require('debug')('Uttori.Utilities.FileUtility');
const fs = require('fs-extra');
const sanitize = require('sanitize-filename');
const path = require('path');

/**
 * Creates a folder recursively.
 *
 * @async
 * @param {string} folder - The folder to be created.
 */
const ensureDirectory = async (folder) => {
  /* istanbul ignore else */
  if (folder) {
    try {
      await fs.ensureDir(folder);
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
 *
 * @param {string} folder - The folder to be created.
 */
const ensureDirectorySync = (folder) => {
  /* istanbul ignore else */
  if (folder) {
    try {
      fs.ensureDirSync(folder);
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
 *
 * @async
 * @param {string} folder - The folder of the file to be deleted.
 * @param {string} name - The name of the file to be deleted.
 * @param {string} extension - The file extension of the file to be deleted.
 */
const deleteFile = async (folder, name, extension) => {
  debug('deleteFile:', folder, name, extension);
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  debug('Deleting target:', target);
  try { await fs.unlink(target); } catch (error) {
    /* istanbul ignore next */
    debug('Error deleting file:', target, error);
  }
};

/**
 * Deletes a file from the file system, synchronously.
 *
 * @param {string} folder - The folder of the file to be deleted.
 * @param {string} name - The name of the file to be deleted.
 * @param {string} extension - The file extension of the file to be deleted.
 */
const deleteFileSync = (folder, name, extension) => {
  debug('deleteFile:', folder, name, extension);
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  debug('Deleting target:', target);
  try { fs.unlinkSync(target); } catch (error) {
    /* istanbul ignore next */
    debug('Error deleting file:', target, error);
  }
};

/**
 * Reads a file from the file system.
 *
 * @async
 * @param {string} folder - The folder of the file to be read.
 * @param {string} name - The name of the file to be read.
 * @param {string} extension - The file extension of the file to be read.
 * @param {string} encoding - The encoding of the file to be read as.
 * @returns {Promise} - The parsed JSON file contents.
 */
const readFile = async (folder, name, extension, encoding = 'utf8') => {
  debug('Reading File:', folder, name, extension, encoding);
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  debug('Reading target:', target);
  let content;
  try { content = await fs.readFile(target, encoding); } catch (error) {
    /* istanbul ignore next */
    debug('Error reading file:', target, error);
  }
  return content;
};

/**
 * Reads a file from the file system, synchronously.
 *
 * @param {string} folder - The folder of the file to be read.
 * @param {string} name - The name of the file to be read.
 * @param {string} extension - The file extension of the file to be read.
 * @param {string} encoding - The encoding of the file to be read as.
 * @returns {object} - The parsed JSON file contents.
 */
const readFileSync = (folder, name, extension, encoding = 'utf8') => {
  debug('Reading File:', folder, name, extension, encoding);
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  debug('Reading target:', target);
  let content;
  try { content = fs.readFileSync(target, { encoding }); } catch (error) {
    /* istanbul ignore next */
    debug('Error reading file:', target, error);
  }
  return content;
};

/**
 * Reads a JSON file from the file system and parses it to an object.
 *
 * @async
 * @param {string} folder - The folder of the file to be read.
 * @param {string} name - The name of the file to be read.
 * @param {string} extension - The file extension of the file to be read.
 * @param {string} encoding - The encoding of the file to be read as.
 * @returns {Promise} - The parsed JSON file contents.
 */
const readJSON = async (folder, name, extension, encoding = 'utf8') => {
  debug('Reading File:', folder, name, extension, encoding);
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  let content;
  if (await fs.pathExists(target)) {
    debug('Reading target:', target);
    try { content = await fs.readFile(target, encoding); } catch (error) {
      /* istanbul ignore next */
      debug('Error reading file:', target, error);
    }
  } else {
    debug('Target does not exist:', target);
    return content;
  }
  /* istanbul ignore else */
  if (content) {
    try { content = JSON.parse(content); } catch (error) {
      /* istanbul ignore next */
      debug('Error parsing JSON:', content, error);
    }
  } else {
    /* istanbul ignore next */
    debug('Content was null or undefined.');
  }
  return content;
};

/**
 * Reads a JSON file from the file system and parses it to an object, synchronously.
 *
 * @param {string} folder - The folder of the file to be read.
 * @param {string} name - The name of the file to be read.
 * @param {string} extension - The file extension of the file to be read.
 * @param {string} encoding - The encoding of the file to be read as.
 * @returns {object} - The parsed JSON file contents.
 */
const readJSONSync = (folder, name, extension, encoding = 'utf8') => {
  debug('Reading File:', folder, name, extension, encoding);
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  let content;
  if (fs.existsSync(target)) {
    debug('Reading target:', target);
    try { content = fs.readFileSync(target, { encoding }); } catch (error) {
      /* istanbul ignore next */
      debug('Error reading file:', target, error);
    }
  } else {
    debug('Target does not exist:', target);
    return content;
  }
  /* istanbul ignore else */
  if (content) {
    try { content = JSON.parse(content); } catch (error) {
      /* istanbul ignore next */
      debug('Error parsing JSON:', content, error);
    }
  } else {
    /* istanbul ignore next */
    debug('Content was null or undefined.');
  }
  return content;
};

/**
 * Reads a folder from the file system.
 *
 * @async
 * @param {string} folder - The folder to be read.
 * @returns {Promise} - The file paths found in the folder.
 */
const readFolder = async (folder) => {
  debug('Reading Folder:', folder);
  if (await fs.pathExists(folder)) {
    const content = await fs.readdir(folder);
    return content.map((file) => path.parse(file).name);
  }
  debug('Folder not found!');
  return [];
};

/**
 * Reads a folder from the file system, synchronysly.
 *
 * @param {string} folder - The folder to be read.
 * @returns {string[]} - The file paths found in the folder.
 */
const readFolderSync = (folder) => {
  debug('Reading Folder:', folder);
  if (fs.existsSync(folder)) {
    const content = fs.readdirSync(folder);
    return content.map((file) => path.parse(file).name);
  }
  debug('Folder not found!');
  return [];
};

/**
 * Write a file to the file system.
 *
 * @async
 * @param {string} folder - The folder of the file to be written.
 * @param {string} name - The name of the file to be written.
 * @param {string} extension - The file extension of the file to be written.
 * @param {string} content - The content of the file to be written.
 * @param {string} encoding - The encoding of the file to be written as.
 */
const writeFile = async (folder, name, extension, content, encoding = 'utf8') => {
  debug('Writing File with:', { folder, name, extension, content, encoding });
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  debug('Writing target:', target);
  try { await fs.writeFile(target, content, encoding); } catch (error) {
    /* istanbul ignore next */
    debug('Error writing file:', target, content, error);
  }
};

/**
 * Write a file to the file system, synchronysly.
 *
 * @param {string} folder - The folder of the file to be written.
 * @param {string} name - The name of the file to be written.
 * @param {string} extension - The file extension of the file to be written.
 * @param {string} content - The content of the file to be written.
 * @param {string} encoding - The encoding of the file to be written as.
 */
const writeFileSync = (folder, name, extension, content, encoding = 'utf8') => {
  debug('Writing File with:', { folder, name, extension, content, encoding });
  /* istanbul ignore else */
  if (extension) {
    extension = `.${extension}`;
  }
  const target = `${folder}/${sanitize(`${name}${extension}`)}`;
  debug('Writing target:', target);
  try { fs.writeFileSync(target, content, encoding); } catch (error) {
    /* istanbul ignore next */
    debug('Error writing file:', target, content, error);
  }
};

module.exports = {
  ensureDirectory,
  ensureDirectorySync,
  deleteFile,
  deleteFileSync,
  readFile,
  readFileSync,
  readJSON,
  readJSONSync,
  readFolder,
  readFolderSync,
  writeFile,
  writeFileSync,
};
