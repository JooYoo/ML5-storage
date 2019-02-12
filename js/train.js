var video = document.getElementById('video');
var videoStatus = document.getElementById('videoStatus');
var loading = document.getElementById('loading');
var aBtn = document.getElementById('a-btn');
var bBtn = document.getElementById('b-btn');
var aCount = document.getElementById('sampleA-count');
var bCount = document.getElementById('sampleB-count');
var containerA = document.getElementById('canvas-container-a');
var containerB = document.getElementById('canvas-container-b');
var train = document.getElementById('train-btn');
var loss = document.getElementById('loss');
var result = document.getElementById('result');
var predict = document.getElementById('predict');
var saveBtn = document.getElementById('save-btn');
var loadBtn = document.getElementById('load-btn');

let totalloss = 0;

// get stream from cam
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.srcObject = stream;
        video.play();
    });
}

// extract features from MobileNet
const featureExtractor = ml5.featureExtractor('MobileNet', function () {
    loading.innerText = "Model loaded!";
    // create classifier
    const classifier = featureExtractor.classification(video, function () {
        videoStatus.innerText = 'Video ready!'
    });

    // add SampleA
    aBtn.onclick = function () {
        classifier.addImage('SampleA');
        console.log('add SampleA');
    }
    // add SampleB
    bBtn.onclick = function () {
        classifier.addImage('SampleB');
        console.log('add SampleB');
    }

    // train
    train.onclick = function () {
        classifier.train(function (lossValue) {
            if (lossValue) {
                totalloss = lossValue;
                loss.innerHTML = "loss: " + totalloss;
            }
        });
    }

    // get result
    predict.onclick = function () {
        classifier.classify(gotResults);
    }
    function gotResults(err, data) {
        if (err) {
            console.error(err);
        }
        result.innerText = data;
        classifier.classify(gotResults);
    }

    // save model
    saveBtn.onclick = function () {
        classifier.save();
        saveBtn.innerHTML = "Model Saved";
    }

    // load model
    loadBtn.onclick = function () {
        classifier.load('./savedModel/model.json', function () {
            loadBtn.innerHTML = "Retrain Model Loaded";
            classifier.classify(gotResults);
        });
    }
});


// Sample A: takePhoto
function takeScreenshotA() {
    let canvas = document.createElement('canvas');
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    let canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(
        video,
        0, 0,
        video.offsetWidth, video.offsetHeight
    );

    containerA.prepend(canvas);
    aCount.innerText = Number(aCount.innerText) + 1;
}

// Sample B: takePhoto
function takeScreenshotB() {
    let canvas = document.createElement('canvas');
    canvas.width = video.offsetWidth;
    canvas.height = video.offsetHeight;

    let canvasContext = canvas.getContext("2d");
    canvasContext.drawImage(
        video,
        0, 0,
        video.offsetWidth, video.offsetHeight
    );

    containerB.prepend(canvas);
    bCount.innerText = Number(bCount.innerText) + 1;
}
