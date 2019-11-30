let model;
const PATH = '/1CNN-Model/model.json';
const labels_dict = {0 : 'W', 1 : 'NR', 2 : 'R'};

async function setup() {

  console.log('Loading model...');
  let model = await tf.loadLayersModel(PATH);
  console.log('Model loaded')

  const values = [];
  for (let i = 0; i < 10000; i++) {
    values[i] = Math.random(0, 100);
  }
  const shape = [1, 5000, 2];
  const input = tf.tensor3d(values, shape, "float32");
  const prediction = model.predict(input).dataSync();
  const prediction_arr = Array.from(prediction)

  const score = labels_dict[prediction_arr.indexOf(1)];

  console.log(input.toString());
  console.log(prediction_arr);
  console.log(score)
  console.log('DONE 1');
}

setup();

console.log('DONE 2');

