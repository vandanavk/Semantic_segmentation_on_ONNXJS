async function runExample(imagePath) {
  // Create an ONNX inference session with WebGL backend.
  const session = new onnx.InferenceSession({ backendHint: 'webgl' });

  // Load an ONNX model. This model is Resnet50 that takes a 1*3*224*224 image and classifies it.
  await session.loadModel("./Resnet-DUC.onnx");

  // Load image.
  const imageLoader = new ImageLoader(imageSize, imageSize);
  const imageData = await imageLoader.getImageData(imagePath);

  // Preprocess the image data to match input dimension requirement, which is 1*3*224*224.
  const width = imageSize;
  const height = imageSize;

  let im = cv.matFromImageData(imgData);

  const preprocessedImage = preprocess(im, width, height);

  let preprocessedData = imageLoader.putImageData(preprocessedImage);

  const inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, width, height]);
  // Run model with Tensor inputs and get the result.
  const outputMap = await session.run([inputTensor]);
  const outputData = outputMap.values().next().value.data;

  postprocess(outputData)
  // Render the output result in html.
  //printMatches(outputData);
}

/**
 * Preprocess raw image data to match Resnet50 requirement.
 */
function preprocess(im, width, height) {
  test_shape = ndarray(new Float32Array(height, width));
  cell_shapes = ndarray(new Float32Array(ceil(height / 8 )*8, ceil(width / 8)* 8));
  rgb_mean = cv.mean(im);

  dataProcessed = cv.copyMakeBorder(im, 0, max(0, int(cell_shapes[0]) - im.shape[0]), 0, max(0, int(cell_shapes[1]) - im.shape[1]), cv.BORDER_CONSTANT, value=rgb_mean);
  dataProcessed = ndarray.ops.transpose(dataProcessed, (2, 0, 1));
  var i;
  for (i = 0; i < 3; i++) {
    dataProcessed[i] -= rgb_mean[i]
  }
  dataProcessed = ndarray.ops.expand_dims(dataProcessed, axis=0)

  return dataProcessed;
}

//def get_palette():
//    # get train id to color mappings from file
//    trainId2colors = {label.trainId: label.color for label in cityscapes_labels.labels}
//    # prepare and return palette
//    palette = [0] * 256 * 3
//    for trainId in trainId2colors:
//        colors = trainId2colors[trainId]
//        if trainId == 255:
//            colors = (0, 0, 0)
//        for i in range(3):
//            palette[trainId * 3 + i] = colors[i]
//    return palette
//
//def colorize(labels):
//    # generate colorized image from output labels and color palette
//    result_img = Image.fromarray(labels).convert('P')
//    result_img.putpalette(get_palette())
//    return np.array(result_img.convert('RGB'))

function get_palette() {

}

function postprocess(outputData) {
}

