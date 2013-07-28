if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  console.dir(evt);
  var files = evt.dataTransfer.files; // FileList object.
  console.dir(files);
  var f = files[0];
  var mime = f.type || 'text/plain';
  console.log("=======");
  console.dir(f);
  var newName = "new___" + f.name;

  console.info("размер загружаемого файла "+f.size);

  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.TEMPORARY, f.size, createNewFile, errorHandler);
//  window.webkitStorageInfo.requestQuota(PERSISTENT, f.size, function(grantedBytes) {
//    window.requestFileSystem(window.PERSISTENT, f.size, createNewFile, errorHandler);
//  });


  function createNewFile(fs) {
    fs.root.getFile(newName, {create:false}, function(fileEntry) {
      fileEntry.remove(function() {
        console.log('File removed.');
      }, errorHandler);
    });
    fs.root.getFile(newName, {create: true},
      function (fileEntry) {
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.seek(0);
          console.warn("file length when create " + fileWriter.length);
//          var blob = new Blob([], {type: mime});
//
//          fileWriter.write(blob);

        });

        iterateChunks(piesces);
        console.log("link to file: " + fileEntry.toURL());

      },
      errorHandler);
  }


  document.getElementById('list').innerHTML = '<strong>' + f.name + ' bytes, last modified ' + f.lastModifiedDate.toLocaleDateString() + ' type:' + (f.type || 'n/a') + '</strong>';

//  var r = new FileReader();
//  r.readAsDataURL(f);
//
//  console.log(r);

  var fileSize = f.size;
  var chunk = 64000;

  function fileProgress(chunk, fSize) {
    var _chunk = chunk || 64000;
    var pieces = fSize / chunk;
    return Math.ceil(pieces);
  }

  var piesces = fileProgress(chunk, fileSize);

  console.warn(fileProgress(chunk, fileSize));

  var _from = 0,
    _to;

  function iterateChunks(times) {
    for (var i = 1; i <= times; i++) {
      setTimeout(function () {
        if (_from + chunk > fileSize) {
          _to = fileSize;
        } else {
          _to = _from + chunk;
        }
        console.log('Bytes: [' + _from + ', ' + _to + ']');


        readBlob(_from, _to);


        console.count('number of piesces');
        _from += chunk + 1;
      }, 5000);
    }
  }


  var fakeFileSize = 0;
  function readBlob(_startByte, _stopByte) {
    var start = parseInt(_startByte) || 0;
    var stop = parseInt(_stopByte);

//    console.error([start, stop]);
    var reader = new FileReader();

    if (f.webkitSlice) {
      var blob = f.webkitSlice(start, stop);
    } else if (f.mozSlice) {
      var blob = f.mozSlice(start, stop);
    } else if (f.slice) {
      var blob = f.slice(start, stop);
    }

    console.count("!!!!!!blob ±!!!!!! ");
    console.count(blob);

    reader.readAsBinaryString(blob);

    console.count(reader.result);

    reader.onloadstart = function () {
      console.count("начал загрузку: " + f.name);
    };
    reader.onprogress = function () {
      console.count("в процессе загрузки: " + f.name);
    };
    reader.onerror = function (err) {
      console.count("ошибка загрузки: " + f.name);
      console.error(err);
    };
    reader.onloadend = function () {
      console.count("Загрузка: " + f.name + " завершена");
    };

//    alert("ffff");

    console.warn("Blob length " + blob.length);
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(window.PERSISTENT, f.size, appendBlobToFile, errorHandler);
    function appendBlobToFile(fs) {
      fs.root.getFile(newName, {},
        function (fileEntry) {
          console.dir(fileEntry);
          console.dir(fileEntry.filesystem);
          fileEntry.createWriter(function (fileWriter) {
            fileWriter.seek(fakeFileSize);
            console.warn("file length " + fileWriter.length);
//            var _blob = new Blob([blob], {type: 'text/plain'});

            fileWriter.write(blob);

          });

          console.count("link to file: " + fileEntry.toURL());
        },
        errorHandler);
    }

    fakeFileSize += chunk;

    return blob;
  }

  function errorHandler(e) {
    var msg = '';

    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
      default:
        msg = 'Unknown Error';
        break;
    }

    console.log('Error: ' + msg);
  }

  function onInitFs(fs) {
    console.log('Opened file system: ' + fs.name);
  }


}


function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);