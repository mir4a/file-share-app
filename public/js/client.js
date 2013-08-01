sendFile.onsubmit = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);

  xhr.send(JSON.stringify({note: this.elements.note.value, file: this.elements.file.value}))

  this.elements.note.value = '';
  return false;
}

function subscribe() {
  var xhr = new XMLHttpRequest();

  xhr.open("GET","/download", true);

  xhr.onload = function() {
    var p = document.createElement('p');
    p.textContent = this.responseText;
    trunk.appendChild(p);

    subscribe();
  };

  xhr.onerror = xhr.onabort = function() {
    setTimeout(subscribe, 500);
  };

  xhr.send('');
}