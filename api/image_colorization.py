from PIL.Image import fromarray
import numpy as np
import cv2 as cv
import os.path
import secrets

protoFile = "./api/models/colorization_deploy_v2.prototxt"
weightsFile = "./api/models/colorization_release_v2.caffemodel"


def colorize(imagepath):
    # frame = cv.imread(imagepath)

    npimg = np.fromstring(imagepath, np.uint8)
    # convert numpy array to image
    frame = cv.imdecode(npimg, cv.IMREAD_COLOR)

    # Load the bin centers
    numpy_file = np.load("./api/models/pts_in_hull.npy")
    # Read the network into Memory
    Caffe_net = cv.dnn.readNetFromCaffe(protoFile, weightsFile)

    # populate cluster centers as 1x1 convolution kernel
    numpy_file = numpy_file.transpose().reshape(2, 313, 1, 1)
    Caffe_net.getLayer(Caffe_net.getLayerId("class8_ab")).blobs = [
        numpy_file.astype(np.float32)
    ]
    Caffe_net.getLayer(Caffe_net.getLayerId("conv8_313_rh")).blobs = [
        np.full([1, 313], 2.606, np.float32)
    ]

    input_width = 224
    input_height = 224

    # Convert the rgb values of the input image to the range of 0 to 1
    rgb_img = (frame[:, :, [2, 1, 0]] * 1.0 / 255).astype(np.float32)
    lab_img = cv.cvtColor(rgb_img, cv.COLOR_RGB2Lab)
    l_channel = lab_img[:, :, 0]

    # resize the lightness channel to network input size
    l_channel_resize = cv.resize(l_channel, (input_width, input_height))
    l_channel_resize -= 50  # subtract 50 for mean-centering

    Caffe_net.setInput(cv.dnn.blobFromImage(l_channel_resize))
    ab_channel = Caffe_net.forward()[0, :, :, :].transpose(
        (1, 2, 0)
    )  # this is our result

    # original image size
    (original_height, original_width) = rgb_img.shape[:2]
    ab_channel_us = cv.resize(ab_channel, (original_width, original_height))
    lab_output = np.concatenate(
        (l_channel[:, :, np.newaxis], ab_channel_us), axis=2
    )  # concatenate with original image L
    bgr_output = np.clip(cv.cvtColor(lab_output, cv.COLOR_Lab2BGR), 0, 1)

    random_hex = secrets.token_hex(8)
    image_name = random_hex + ".png"
    cv.imwrite("./frontend/build/results/" + image_name,
               (bgr_output * 255).astype(np.uint8))

    return image_name
