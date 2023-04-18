const middy = require("@middy/core");
// // const jsonBodyParser = require("@middy/http-json-body-parser");
// // const urlencodeParser = require("@middy/http-urlencode-body-parser");
// // const multiparDataParser = require("@middy/http-multipart-body-parser");
const cors = require('@middy/http-cors');

const postTestImage = async (event, context) => {
  // const request = event.body;
  // const file = request.images;
  // let upladedInfo = await uploadFile(file.filename, file.content, "image/jpeg");


  // await s3.createBucket(async function () {
  //   const params = {
  //     Bucket: process.env.BUCKET_NAME,
  //     Key: file.filename,
  //     Body: file.content,
  //   };

  //   await s3.upload(params, function (err, data) {
  //     if (err) {
  //       console.log(err);
  //     }
  //     console.log("respondio data", data);
  //     upladedInfo = data;
  //   });
  // });

  // console.log("respuesta subida ", upladedInfo);
  let ola = event.body
  return {
    // headers: {
    //   "Access-Control-Allow-Headers" : "Content-Type",
    //   "Access-Control-Allow-Origin":  "https://rustika-front.vercel.app",
    //   "Access-Control-Allow-Methods": "POST"
    // },
    statusCode: 200,
    body: JSON.stringify({
      response: ola
    })
  };
};

module.exports = { 
  postTestImage: middy(postTestImage)
    .use(cors({origins: ["https://rustika-front.vercel.app", "http://localhost:3000"], methods: "POST"}))
};
