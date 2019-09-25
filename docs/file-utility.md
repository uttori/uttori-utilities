## Functions

<dl>
<dt><a href="#ensureDirectory">ensureDirectory(folder)</a></dt>
<dd><p>Creates a folder recursively.</p>
</dd>
<dt><a href="#ensureDirectorySync">ensureDirectorySync(folder)</a></dt>
<dd><p>Creates a folder recursively.</p>
</dd>
<dt><a href="#deleteFile">deleteFile(folder, name, extension)</a></dt>
<dd><p>Deletes a file from the file system.</p>
</dd>
<dt><a href="#deleteFileSync">deleteFileSync(folder, name, extension)</a></dt>
<dd><p>Deletes a file from the file system, synchronously.</p>
</dd>
<dt><a href="#readFile">readFile(folder, name, extension, encoding)</a> ⇒ <code>Object</code></dt>
<dd><p>Reads a file from the file system.</p>
</dd>
<dt><a href="#readFileSync">readFileSync(folder, name, extension, encoding)</a> ⇒ <code>Object</code></dt>
<dd><p>Reads a file from the file system, synchronously.</p>
</dd>
<dt><a href="#readJSON">readJSON(folder, name, extension, encoding)</a> ⇒ <code>Object</code></dt>
<dd><p>Reads a JSON file from the file system and parses it to an object.</p>
</dd>
<dt><a href="#readJSONSync">readJSONSync(folder, name, extension, encoding)</a> ⇒ <code>Object</code></dt>
<dd><p>Reads a JSON file from the file system and parses it to an object, synchronously.</p>
</dd>
<dt><a href="#readFolder">readFolder(folder)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Reads a folder from the file system.</p>
</dd>
<dt><a href="#readFolderSync">readFolderSync(folder)</a> ⇒ <code>Array.&lt;string&gt;</code></dt>
<dd><p>Reads a folder from the file system, synchronysly.</p>
</dd>
<dt><a href="#writeFile">writeFile(config, folder, name, content, encoding)</a></dt>
<dd><p>Write a file to the file system.</p>
</dd>
<dt><a href="#writeFileSync">writeFileSync(config, folder, name, content, encoding)</a></dt>
<dd><p>Write a file to the file system, synchronysly.</p>
</dd>
</dl>

<a name="ensureDirectory"></a>

## ensureDirectory(folder)
Creates a folder recursively.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder to be created. |

<a name="ensureDirectorySync"></a>

## ensureDirectorySync(folder)
Creates a folder recursively.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder to be created. |

<a name="deleteFile"></a>

## deleteFile(folder, name, extension)
Deletes a file from the file system.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder of the file to be deleted. |
| name | <code>string</code> | The name of the file to be deleted. |
| extension | <code>string</code> | The file extension of the file to be deleted. |

<a name="deleteFileSync"></a>

## deleteFileSync(folder, name, extension)
Deletes a file from the file system, synchronously.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder of the file to be deleted. |
| name | <code>string</code> | The name of the file to be deleted. |
| extension | <code>string</code> | The file extension of the file to be deleted. |

<a name="readFile"></a>

## readFile(folder, name, extension, encoding) ⇒ <code>Object</code>
Reads a file from the file system.

**Kind**: global function  
**Returns**: <code>Object</code> - - The parsed JSON file contents.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | <code>string</code> |  | The folder of the file to be read. |
| name | <code>string</code> |  | The name of the file to be read. |
| extension | <code>string</code> |  | The file extension of the file to be read. |
| encoding | <code>string</code> | <code>&quot;utf8&quot;</code> | The encoding of the file to be read as. |

<a name="readFileSync"></a>

## readFileSync(folder, name, extension, encoding) ⇒ <code>Object</code>
Reads a file from the file system, synchronously.

**Kind**: global function  
**Returns**: <code>Object</code> - - The parsed JSON file contents.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | <code>string</code> |  | The folder of the file to be read. |
| name | <code>string</code> |  | The name of the file to be read. |
| extension | <code>string</code> |  | The file extension of the file to be read. |
| encoding | <code>string</code> | <code>&quot;utf8&quot;</code> | The encoding of the file to be read as. |

<a name="readJSON"></a>

## readJSON(folder, name, extension, encoding) ⇒ <code>Object</code>
Reads a JSON file from the file system and parses it to an object.

**Kind**: global function  
**Returns**: <code>Object</code> - - The parsed JSON file contents.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | <code>string</code> |  | The folder of the file to be read. |
| name | <code>string</code> |  | The name of the file to be read. |
| extension | <code>string</code> |  | The file extension of the file to be read. |
| encoding | <code>string</code> | <code>&quot;utf8&quot;</code> | The encoding of the file to be read as. |

<a name="readJSONSync"></a>

## readJSONSync(folder, name, extension, encoding) ⇒ <code>Object</code>
Reads a JSON file from the file system and parses it to an object, synchronously.

**Kind**: global function  
**Returns**: <code>Object</code> - - The parsed JSON file contents.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| folder | <code>string</code> |  | The folder of the file to be read. |
| name | <code>string</code> |  | The name of the file to be read. |
| extension | <code>string</code> |  | The file extension of the file to be read. |
| encoding | <code>string</code> | <code>&quot;utf8&quot;</code> | The encoding of the file to be read as. |

<a name="readFolder"></a>

## readFolder(folder) ⇒ <code>Array.&lt;string&gt;</code>
Reads a folder from the file system.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - - The file paths found in the folder.  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder to be read. |

<a name="readFolderSync"></a>

## readFolderSync(folder) ⇒ <code>Array.&lt;string&gt;</code>
Reads a folder from the file system, synchronysly.

**Kind**: global function  
**Returns**: <code>Array.&lt;string&gt;</code> - - The file paths found in the folder.  

| Param | Type | Description |
| --- | --- | --- |
| folder | <code>string</code> | The folder to be read. |

<a name="writeFile"></a>

## writeFile(config, folder, name, content, encoding)
Write a file to the file system.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | The configuration object. |
| config.extension | <code>string</code> | The file extension of the file to be written. |
| folder | <code>string</code> | The folder of the file to be written. |
| name | <code>string</code> | The name of the file to be written. |
| content | <code>string</code> | The content of the file to be written. |
| encoding | <code>string</code> | The encoding of the file to be written as. |

<a name="writeFileSync"></a>

## writeFileSync(config, folder, name, content, encoding)
Write a file to the file system, synchronysly.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | The configuration object. |
| config.extension | <code>string</code> | The file extension of the file to be written. |
| folder | <code>string</code> | The folder of the file to be written. |
| name | <code>string</code> | The name of the file to be written. |
| content | <code>string</code> | The content of the file to be written. |
| encoding | <code>string</code> | The encoding of the file to be written as. |

