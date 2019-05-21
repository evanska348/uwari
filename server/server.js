const express = require('express');
const app = express();
const cors = require('cors')
const AWS = require('aws-sdk');
const fs = require('fs');
const bluebird = require('bluebird');
const multiparty = require('multiparty');
const crypto = require('crypto');
var sequence = '';
app.use(cors());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});

// configure the keys for accessing AWS
AWS.config.update({
  accessKeyId: "AKIAIZQTUU4ARPFOXUOA",
  secretAccessKey: "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"
});

//user evanzhao
//access AKIAIZQTUU4ARPFOXUOA
//secret 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

// configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);

// create S3 instance
const s3 = new AWS.S3();

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name) => {
  var params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: "uwari-20181216120843--hostingbucket",
    ContentType: ".ab1",
    Key: `${name}.ab1`
  };
  return s3.upload(params).promise();
};

// const downloadFile = (name) => {
//   let response = s3.getObject(
//     { Bucket: "uwari-20181216120843--hostingbucket", Key: name, },
//     function (error, data) {
//       if (error != null) {
//         console.log('yo')
//         // return downloadFile(name);
//         return error
//       } else {
//         sequence = data.Body.toString('utf8');
//         // console.log(data.Body.toString('utf8'));
//         return data.Body.toString('utf8');
//       }
//     });
//   console.log('hi1')
//   // return response;
// }

const downloadFile = (name) => {
  let response = s3.getObject(
    { Bucket: "uwari-20181216120843--hostingbucket", Key: name, },
    function (error, data) {
      if (error === null) {
        sequence = data.Body.toString('utf8');
        // console.log(data.Body.toString('utf8'));
        return data.Body.toString('utf8');
      } else {
        return error;
      }
    });
  console.log('hi1')
  // return response;
}

// (function repeat() {{
// const download = await downloadFile(`${fileName}.txt`);
// if (download !== undefined) {
//   console.log(download + 
//   )
// }

//   if (error)
//   setTimeout(() => {
//           downloadFile(name)
//         }, 100)
// })()

// for (let i = 0; i < 100; i++) {
//   setTimeout(async function () {
//     console.log('yo')
//     const download = await downloadFile(`${fileName}.txt`);
//     console.log(download)
//     console.log(sequence)
//     if (download !== undefined) {
//       console.log(download)
//     }
//   }, 2000);
// }

// const downloadFile = async function (name) {
// const downloadFile = (name) => {
//   let response = false;
//   console.log(name)
//   while (response === false) {
//     response = s3.getObject(
//       { Bucket: "uwari-20181216120843--hostingbucket", Key: name, },
//       function (error, data) {
//         if (error != null) {
//           console.log(data)
//           return data;
//         } else {
//           response = true;
//           console.log(data.Body.toString('utf8'));
//           sequence = data.Body.toString('utf8');
//           return data.Body.toString('utf8');
//         }
//       });
//     // console.log(response)
//   }
//   console.log(response)
//   return response;
// }
//   try {
//     const headCode = await s3.heaObject(params).promise();
//     const signedUrl = await s3.getSignedUrl('getObject', parrams).promise();
//   } catch (headErr) {
//     if(headErr.code === 'NotFound') {
//     }
//   }
// }

// Define POST route
app.post('/test-upload', (request, response) => {
  const form = new multiparty.Form();
  console.log('hi')
  form.parse(request, async (error, fields, files) => {
    if (error) throw new Error(error);
    try {
      const path = files.file[0].path;
      const buffer = fs.readFileSync(path);
      const timestamp = Date.now().toString();
      const rand = Math.random().toString();
      const type = fields.string[0];
      const hash = crypto.createHash('sha1').update(timestamp + rand).digest('hex');
      const fileName = `${hash}--${type}--`;
      console.log(fileName)
      const data = await uploadFile(buffer, fileName);
      const download = await downloadFile(`${fileName}.txt`);
      while (!sequence) {
        await delay(500);
        downloadFile(`${fileName}.txt`);
        console.log("hey")
      }
      console.log(sequence);
      var params = {
        Bucket: "uwari-20181216120843--hostingbucket",
        Delete: {
          Objects: [
            {
              Key: `${fileName}.ab1`
            },
            { Key: `${fileName}.txt` }
          ],
          Quiet: false
        }
      };
      s3.deleteObjects(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
      })
      let dat = sequence;
      sequence = '';
      return response.status(200).send(dat);
    } catch (error) {
      return response.status(400).send(error);
    }
  });
});

function delay(n) {
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n)
  })
}

app.listen(process.env.PORT || 9000);
console.log('Server up and running...');




// var getObject = function(keyFile) {
//   return new Promise(function(success, reject) {
//       s3.getObject(
//           { Bucket: "uwari-20181216120843--hostingbucket", Key: keyFile },
//           function (error, data) {
//               if(error) {
//                   getObject(keyfile);
//               } else {
//                   success(data);
//               }
//           }
//       );
//   });
// }

// var promises = [];
// var fileContent= '';

//   promises = getObject(fileName);

// Promise.all(promises)
// .then(function(results) {
//       fileContent = data.Body.toString();
//   // continue your process here
// })
// .catch(function(err) {
//   alert(err);
// });