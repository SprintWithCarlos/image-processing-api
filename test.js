const fs = require("fs");
const faker = require("faker");
let data = [];
const host = "https://masonrygallery.s3.filebase.com/";
for (let i = 0; i < 190; i++) {
  data.push({
    title: faker.lorem.sentence(),
    images: {
      name: i,
      small: `${host}${i}-500.jpeg`,
      medium: `${host}${i}-1000.jpeg`,
      large: `${host}${i}-1500.jpeg`,
    },
  });
}

fs.writeFile("data.json", JSON.stringify(data), (err, func) => {
  if (err) {
    console.error(err);
  } else {
    console.log("ok");
  }
});

// mongoimport --uri mongodb+srv://dbAdmin:gm1929hw@thereshapers.qyiiu.mongodb.net/devchallenges --collection masonryposts --type json --file data.json --jsonArray
// mongosh "mongodb+srv://thereshapers.qyiiu.mongodb.net/devchallenges" --username dbAdmin
// 2021-06-14T01:35:50.295+00:00
