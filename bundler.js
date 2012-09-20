var browserify = require('browserify')
  , jsp = require('uglify-js').parser
  , pro = require('uglify-js').uglify
  , fs = require('fs');

var generate = function (filename) {
  var sourceFile = __dirname + '/viewmodels/' + filename + '.js'
    , targetFile = __dirname + '/public/javascripts/' + filename + '.js'
    , ast
    , sourceData
    , minifiedData;

  sourceData = browserify(sourceFile).bundle();
  ast = jsp.parse(sourceData);
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  minifiedData = pro.gen_code(ast);

  fs.writeFile(targetFile, minifiedData, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('generated: ' + targetFile);
    }
  });
};

exports.generate = generate;
