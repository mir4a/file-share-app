var clients = [];

exports.upload = function (req, res) {
  console.log("Upload");

  clients.push(res);
};

exports.download = function (mes) {
  console.log("messaga " + mes);

  clients.forEach(function (res) {
    res.end(mes);
  });

  clients = [];
};