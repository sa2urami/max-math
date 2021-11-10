import { Matrix } from '../matrix'
import { NeuralNetwork } from '../NeuralNetwork'
let m = new NeuralNetwork([2, 2, 1])
let data = [
    [0, 1],
    [1, 0],
    [1, 1],
    [0, 0],
]
let answer = [1, 1, 0, 0]
let EpochCount = 100
let BatchSize = 5000
for (let i = 0; i < EpochCount; i++) {
    for (let j = 0; j < BatchSize; j++) {
        let c = Math.floor(Math.random() * 4)
        m.backpropagation(data[c], answer[c])
    }
    for (let i = 0; i < 4; i++) {
        console.log(m.activate(data[i]))
    }
}
