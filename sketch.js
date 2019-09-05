let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfA = 0;
let imagesOfB = 0;
let imagesOfC = 0;
let imagesOfD = 0;
let classificationResult;
let confidence = 0; 
let mySound
let imgClass

function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('Harder, Better, Faster, Stronger.mp3');
}

function setup() {
  createCanvas(640, 480);
  // Create a video element
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Append it to the videoContainer DOM element
  //video.parent('videoContainer');
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
   imgClass = ml5.imageClassifier('./model.json',()=>console.log('loadeddd'))
  // Create a new classifier using those features and give the video we want to use
  const options = { numLabels: 4 }; //Specify the number of classes/labels
  classifier = featureExtractor.classification(video, options);
  
  // Set up the UI buttons
  setupButtons();
  textAlign(CENTER);
  textSize(64);
  fill(0,255,0);
  

  mySound.playMode('untilDone')
  mySound.setVolume(0.2)

// mySound.play(undefined,undefined,undefined,59.5,1)
}

function draw() {
  image(video, 0, 0);
  if (classificationResult == 'A') {
    text("A", width/2, height/2);
    //rect(100,100,100,100);
  } else if (classificationResult == 'B') {
    text("B", width/2, height/2);
    //ellipse(100,100,100,100);
  } else if (classificationResult == 'C') {
    text("C", width/2, height/2);
    //ellipse(100,100,100,100);
  } else if (classificationResult == 'D') {
    text("D", width/2, height/2);
    //ellipse(100,100,100,100);
  }
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}


// Classify the current frame.
function classify() {
  // classifier.classify(gotResults);
  imgClass.classify(video, gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "A" to the classifier
  buttonA = select('#ButtonA');
  buttonA.mousePressed(function() {
    classifier.addImage('A');
    select('#amountOfAImages').html(imagesOfA++);
  });
  
  // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonB = select('#ButtonB');
  buttonB.mousePressed(function() {
    classifier.addImage('B');
    select('#amountOfBImages').html(imagesOfB++);
  });
  
    // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonC = select('#ButtonC');
  buttonC.mousePressed(function() {
    classifier.addImage('C');
    select('#amountOfCImages').html(imagesOfC++);
  });
  
  
    // When the B button is pressed, add the current frame
  // from the video with a label of "B" to the classifier
  buttonD = select('#ButtonD');
  buttonD.mousePressed(function() {
    classifier.addImage('D');
    select('#amountOfDImages').html(imagesOfD++);
  });

  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
  
  // Save model
  saveBtn = select('#save');
  saveBtn.mousePressed(function() {
    classifier.save();
  });

  // Load model
  loadBtn = select('#load');
  loadBtn.changed(function() {
    
    console.log('it changed')
    classifier.load(loadBtn.elt.files, function(){
      console.log('its loaded!!!')
      
      select('#modelStatus').html('Custom Model Loaded!');
    });
  });
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  select('#result').html(result[0].label);
  select('#confidence').html(result[0].confidence);

  classificationResult = result[0].label;
  confidence = result[0].confidence;
  
  mySound.setVolume(0.2)
  if(classificationResult == 'A' && confidence > 0.8) {
      mySound.play(undefined,undefined,undefined,59.5,1)
    //harder
  } else if(classificationResult == 'B' && confidence > 0.8){       
  mySound.play(undefined,undefined,undefined,60.5,1)
    //better
  } else if(classificationResult == 'C' && confidence > 0.8){
                 
   mySound.play(undefined,undefined,undefined,61.5,1)
    //faster
  } else if(classificationResult == 'D' && confidence > 0.8){            
   mySound.play(undefined,undefined,undefined,62.5,1)
    //stronger
  }
  
//   TODO: add the play sound in here
  // ---------- USE BELOW ---------

//   if (result.confidencesByLabel) {
//     const confideces = result.confidencesByLabel;
//     // result.label is the label that has the highest confidence
//     if (result.label) {
//       select('#result').html(result.label);
//       select('#confidence').html(`${confideces[result.label] * 100} %`);

//       // If the confidence is higher then 0.9
//       if (result.label !== currentWord && confideces[result.label] > 0.9) {
//         currentWord = result.label;
//         // Say the current word 
//         myVoice.speak(currentWord);
//       }
//     }
//   }

  classify();
}