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

  let im = cv.imread(document.getElementById('imageSource'));

  const preprocessedImage = preprocess(im, width, height);
//
//  let preprocessedData = imageLoader.putImageData(preprocessedImage);
//
//  const inputTensor = new onnx.Tensor(preprocessedData, 'float32', [1, 3, width, height]);
//  // Run model with Tensor inputs and get the result.
//  const outputMap = await session.run([inputTensor]);
//  const outputData = outputMap.values().next().value.data;
//
//  outputImage = postprocess(outputData, width, height);
//  // Render the output result in html.
  printMatches(preprocessedImage);
}

/**
 * Preprocess raw image data to match Resnet50 requirement.
 */
function preprocess(im, width, height) {
  test_shape = [height, width];
  cell_shapes = [Math.ceil(height / 8 )*8, Math.ceil(width / 8)* 8];
  rgb_mean = cv.mean(im);

  let dataProcessed = new cv.Mat();
  cv.copyMakeBorder(im, dataProcessed, 0, Math.max(0, parseInt(cell_shapes[0]) - im.matSize[0]), 0, Math.max(0, parseInt(cell_shapes[1]) - im.matSize[1]), cv.BORDER_CONSTANT, value=rgb_mean);
//  ndarray.ops.transpose(dataProcessed, (2, 0, 1));
//  var i;
//  for (i = 0; i < 3; i++) {
//    dataProcessed[i] -= rgb_mean[i];
//  }
//  dataProcessed = ndarray.ops.expand_dims(dataProcessed, axis=0);
//
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

function colorize(labels) {

}


//    # re-arrange output
//    test_width = int((int(img_width) / ds_rate) * ds_rate)
//    test_height = int((int(img_height) / ds_rate) * ds_rate)
//    feat_width = int(test_width / ds_rate)
//    feat_height = int(test_height / ds_rate)
//    labels = labels.reshape((label_num, 4, 4, feat_height, feat_width))
//    labels = np.transpose(labels, (0, 3, 1, 4, 2))
//    labels = labels.reshape((label_num, int(test_height / cell_width), int(test_width / cell_width)))
//
//    labels = labels[:, :int(img_height / cell_width),:int(img_width / cell_width)]
//    labels = np.transpose(labels, [1, 2, 0])
//    labels = cv.resize(labels, (result_width, result_height), interpolation=cv.INTER_LINEAR)
//    labels = np.transpose(labels, [2, 0, 1])
//
//    # get softmax output
//    softmax = labels
//
//    # get classification labels
//    results = np.argmax(labels, axis=0).astype(np.uint8)
//    raw_labels = results
//
//    # comput confidence score
//    confidence = float(np.max(softmax, axis=0).mean())
//
//    # generate segmented image
//    result_img = Image.fromarray(colorize(raw_labels)).resize(result_shape[::-1])
//
//    # generate blended image
//    blended_img = Image.fromarray(cv.addWeighted(im[:, :, ::-1], 0.5, np.array(result_img), 0.5, 0))

function postprocess(outputData, width, height) {
    var ds_rate = 8;
    var cell_width = 2;
    var label_num = 19;
    var result_width = width;
    var result_height = height;

    var test_width = int((int(width)/ds_rate) * ds_rate);
    var test_height = int((int(height)/ds_rate) * ds_rate);
    var feat_width = int(test_width / ds_rate);
    var feat_height = int(test_height / ds_rate);

    ndarray.ops.reshape(outputData, (label_num, 4, 4, feat_height, feat_width));
    ndarray.ops.transpose(outputData, (0, 3, 1, 4, 2));
    ndarray.ops.reshape(outputData, (label_num, int(test_height / cell_width), int(test_width / cell_width)));

    // one line here
    ndarray.ops.transpose(outputData, (1, 2, 0));
    labels = cv.resize(outputData, (result_width, result_height), interpolation=cv.INTER_LINEAR);
    ndarray.ops.transpose(labels, (2, 0, 1));

    results = ndarray.ops.argmax(labels, axis=0);

    // two lines here
}

function printMatches(im) {
  cv.imshow('canvasOutput', im);
}

