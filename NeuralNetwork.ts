import { Matrix } from './matrix'

function sigmoid(x: number) {
    return 1 / (1 + Math.exp(-x))
}
function dsigmoid(x: number) {
    return x * (1 - x)
}
class Layer {
    n: number
    bias: Matrix
    weights: Matrix | undefined = undefined
    value: Matrix
    constructor(m) {
        this.n = m
        this.bias = new Matrix(m, 1)
        this.bias.rand()
        this.value = new Matrix(m, 1)
        // this.weights = Matrix
    }
}

export class NeuralNetwork {
    //learning_rate = 0.1
    layers: Layer[]
    constructor(m: number[],public learning_rate:number = 0.1) {
        this.layers = []
        for (let i = 0; i < m.length; i++) {
            this.layers[i] = new Layer(m[i])
            if (i != m.length - 1) {
                this.layers[i].weights = new Matrix(m[i], m[i + 1])
                this.layers[i].weights!.rand()
            }
        }
    }
    activate(input: number[] = []) {
        if (input.length != 0) {
            for (let i = 0; i < this.layers[0].n; i++)
                this.layers[0].value.data[i][0] = input[i]
        }
        for (let i = 0; i < this.layers.length - 1; i++) {
            this.layers[i + 1].value = Matrix.multiply(
                Matrix.transpose(this.layers[i].weights!),
                this.layers[i].value,
            )
            this.layers[i + 1].value.add(this.layers[i + 1].bias)
            this.layers[i + 1].value.map(sigmoid)
        }
        return this.layers[this.layers.length-1].value.toArray()
    }
    backpropagation(input: number[], answer: number) {
        this.activate(input)
        let target = new Matrix(this.layers[this.layers.length - 1].n, 1)
        if (this.layers[this.layers.length - 1].n==1)
        target.data[0][0] = answer
        else
        target.data[answer][0]=1
        target.subtract(this.layers[this.layers.length - 1].value)
        let errors = target
        for (let k = this.layers.length - 2; k >= 0; k--) {
            let l = this.layers[k]

            let l1 = this.layers[k + 1]
            const gradients = l1.value.clone()
            gradients.map(dsigmoid)
            gradients.multiply(errors)

            gradients.multiply(this.learning_rate)
            let deltas = Matrix.multiply(gradients, Matrix.transpose(l.value))
            l.weights!.add(Matrix.transpose(deltas))
            l1.bias.add(gradients)
            errors = Matrix.multiply(l.weights!, errors)
        }
    }
}
