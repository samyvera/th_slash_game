const tf = require('@tensorflow/tfjs');

const truthIn = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1]
];
const truthOut = [
    [0],
    [1],
    [1],
    [0]
];

class Brain {
    constructor() {

        const model = tf.sequential();

        const hiddenLayer = tf.layers.dense({
            units: 2,
            inputShape: [2],
            activation: 'sigmoid',
        });
        model.add(hiddenLayer);

        const outputLayer = tf.layers.dense({
            units: 1,
            activation: 'sigmoid',
        });
        model.add(outputLayer);

        const sgdOpt = tf.train.adam(0.1);
        model.compile({
            optimizer: sgdOpt,
            loss: tf.losses.meanSquaredError
        });

        const inputTensor = tf.tensor2d(truthIn);
        const outputTensor = tf.tensor2d(truthOut);

        const train = async () => model.fit(inputTensor, outputTensor, {
            shuffle: true,
            epochs: 1000
        });

        train().then(res => {
            console.log(res.history.loss[0]);
            const result = model.predict(tf.tensor2d([[0, 0]]));
            result.print();
        });
    }
}
module.exports = Brain;