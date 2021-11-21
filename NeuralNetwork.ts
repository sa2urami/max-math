import { Matrix } from './matrix'

type Func = (x: number, y: number[]) => number

class ActivationFunction {
    constructor(
        public activate: Func,
        public deactivate: Func = (x) => x * (1 - x),
    ) {}
}

class Layer {
    n: number
    bias: Matrix
    weights: Matrix | undefined = undefined
    value: Matrix
    constructor(
        m: number,
        public func: ActivationFunction = NeuralNetwork.sigmoid,
    ) {
        this.n = m
        this.bias = new Matrix(m, 1)
        this.bias.rand()
        this.value = new Matrix(m, 1)
        // this.weights = Matrix
    }
}

export class NeuralNetwork {
    static sigmoid = new ActivationFunction((x) => 1 / (1 + Math.exp(-x)))
    static relu = new ActivationFunction(
        (x) => Math.max(0, x),
        (x) => {
            if (x == 0) return 0
            else return 1
        },
    )
    static softmax = new ActivationFunction((x, y) => {
        let b = 0
        for (const val of y) b += val
        return x / b
    })

    layers: Layer[]
    constructor(
        m: (number | [number, ActivationFunction])[],
        public learning_rate: number = 0.1,
    ) {
        this.layers = []
        for (let i = 0; i < m.length; i++) {
            const newLocal = m[i]
            this.layers[i] = new Layer(
                //@ts-ignore
                ...(Array.isArray(newLocal) ? newLocal : [newLocal]),
            )
            if (i != m.length - 1) {
                const getNum = (i): number =>
                    Array.isArray(m[i]) ? m[i][0] : m[i]
                this.layers[i].weights = new Matrix(getNum(i), getNum([i + 1]))
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
            this.layers[i + 1].value.map(this.layers[i].func.activate)
        }
        return this.layers[this.layers.length - 1].value.toArray()
    }
    backpropagation(input: number[], answer: number) {
        this.activate(input)
        let target = new Matrix(this.layers[this.layers.length - 1].n, 1)
        if (this.layers[this.layers.length - 1].n == 1)
            target.data[0][0] = answer
        else target.data[answer][0] = 1
        target.subtract(this.layers[this.layers.length - 1].value)
        let errors = target
        for (let k = this.layers.length - 2; k >= 0; k--) {
            let l = this.layers[k]

            let l1 = this.layers[k + 1]
            const gradients = l1.value.clone()
            gradients.map(l.func.deactivate)
            gradients.multiply(errors)

            gradients.multiply(this.learning_rate)
            let deltas = Matrix.multiply(gradients, Matrix.transpose(l.value))
            l.weights!.add(Matrix.transpose(deltas))
            l1.bias.add(gradients)
            errors = Matrix.multiply(l.weights!, errors)
        }
    }
}
