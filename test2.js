const url = "https://masonrygallery.s3.filebase.com/182-500.jpeg";
let { pathname } = new URL(url, "http://example.org"); // dummy domain to avoid invalid URL error
pathname = pathname.substring(1);
pathname;
const images = {
  small:
    "https://devchallenges.s3.filebase.com/1626229753556-masongallery-500.jpeg",
  medium:
    "https://devchallenges.s3.filebase.com/1626229753556-masongallery-1000.jpeg",
  large:
    "https://devchallenges.s3.filebase.com/1626229753556-masongallery-1500.jpeg",
};

const { small, medium, large } = images;
small;
medium;
large;
const data = [small, medium, large];
//   for (let item of data){
//       let {pathname} = new URL(item.url, )
//   }
const deleteS3 = async (url, Bucket) => {
  let { pathname } = new URL(url, "http://example.org");
  pathname = pathname.substring(1);
  const params = {
    Bucket,
    Key: pathname,
  };
  await s3.deleteObject(params).promise();
};

data.forEach((url) => {
  deleteS3(url, Bucket);
});
