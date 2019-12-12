let model = -1;
const PATH = '/1CNN-Model/model.json';
const labels_dict = {0 : 'W', 1 : 'NR', 2 : 'R'};

async function setup() {

  console.log('Loading model...');
  model = await tf.loadLayersModel(PATH);
  console.log('Model loaded')

  //const values = [];
  //for (let i = 0; i < 10000; i++) {
  //  values[i] = Math.random(0, 100);
  //}
  //const shape = [1, 5000, 2];
  //const input = tf.tensor3d(values, shape, "float32");
  //const prediction = model.predict(input).dataSync();
  //const prediction_arr = Array.from(prediction)

  //const score = labels_dict[prediction_arr.indexOf(1)];

  //console.log(input.toString());
  //console.log(prediction_arr);
  //console.log(score)
  console.log('DONE SETUP');
}

function array_to_tensor(array) {
	const shape = [1, 5000, 2];
	const tensor = tf.tensor3d(array, shape, "float32");
	return tensor
}

async function predict(tensor) {
	const prediction = model.predict(tensor).dataSync();
  	const prediction_arr = Array.from(prediction)

  	const score = labels_dict[prediction_arr.indexOf(1)];
  	return score
}

async function main(array) {
	if (model == -1) {
		await setup();
	}
	
	let tensor = array_to_tensor(array);

	let score = await predict(tensor);

	console.log('Score predicted: '+score);
	console.log('DONE MAIN');
	return score
}

/////////////////////////////////////////////////////////////////////

const values = [];
for (let i = 0; i < 10000; i++) {
	values[i] = Math.random(0, 100);
}
let score = main(values);
