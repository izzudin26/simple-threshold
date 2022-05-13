const imagePicker = document.querySelector("#uploadImage");
const imageShow = document.querySelector("#defaultImage");
const canvasGray = document.querySelector("#outputGray");
const canvasThreshold = document.querySelector("#outputThreshold");
const median = document.querySelector("#median")
const col = document.querySelector("#column")

imagePicker.addEventListener("change", (event) => {
  imageShow.src = URL.createObjectURL(event.target.files[0]);
});

imageShow.onload = () => {

    //read image when img src load new image
  const src = cv.imread(imageShow);

  //create variable dst CV
  const dst = new cv.Mat();

  //create target size
  const size = new cv.Size(256, 256);

  //Convert RGB to GRAY
  cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);
  cv.imshow("outputGray", dst);

  //Resize dst image
  cv.resize(dst, dst, size, 0, 0, cv.INTER_AREA);

  //get median and max value from pixel valuee
  const medianVal = getMedian(dst.data);
  const maxVal = getMax(dst.data);

  //output 
  median.innerHTML = medianVal
  col.innerHTML = dst.data.length

  //do thresholding binary 
  //threshold(source, destination, threshold value, maxValue, type)
  cv.threshold(dst, dst, medianVal, 256, cv.THRESH_BINARY)
  cv.imshow("outputThreshold", dst)

  src.delete()
  dst.delete()
};

function getMedian(data) {
  const mid = data.length / 2;
  data = [...data].sort((a, b) => a - b);
  return data.length % 2 !== 0 ? data[mid] : (data[mid - 1] + data[mid]) / 2;
}

function getMax(data) {
  data = [...data].sort((a, b) => a - b);
  return data[data.length - 1];
}
