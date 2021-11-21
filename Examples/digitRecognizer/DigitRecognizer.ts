import { Matrix } from '../../matrix'
import { NeuralNetwork } from '../../neuralNetwork'
import { argmax } from '../../utilities'
import _ from 'lodash'
import { join } from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import getPixelsCb from 'get-pixels'
import * as WebSocket from 'ws'
const getPixels = promisify(getPixelsCb)
//@ts-ignore
const filesList = await fs.promises.readdir('Examples/digitRecognizer/train/')
let m = new NeuralNetwork([784, 60, 60, 10], 0.001)
let EpochCount = 100
let BatchSize = 600
let n = 0
let yes = 0
const wss = new WebSocket.WebSocketServer({ port: 8080 })

let connected = false

wss.on('connection', (ws) => {
    console.log('connected')
    if (connected) throw new Error('already connected')
    connected = true
    ws.on('message', (values) => {
        const arr = JSON.parse(String(values)) as number[][]
        const pixelsLightness = arr.flat(1)
        let v = m.activate(pixelsLightness)
        ws.send(JSON.stringify(v))
    })
    ws.on('close', () => (connected = false))
    ws.on('error', (err) => {
        connected = false
        throw err
    })
})
for (let i = 0; i < EpochCount; i++) {
    // const filesListShuffled = _.shuffle(filesList)
    const filesListShuffled = filesList
    for (let j = 0; j < BatchSize; j++) {
        const file = filesListShuffled[j]
        const answer = +/(\d).png/.exec(file)![1]
        // @ts-ignore
        const { data: pixelsData } = await getPixels(
            join('Examples/digitRecognizer/train/', file),
        )
        // @ts-ignore
        const pixelsLightness = _.chunk(pixelsData, 4).map(([f]) => f / 255)
        m.backpropagation(pixelsLightness, answer)
        if (answer == argmax(m.layers[m.layers.length - 1].value.toArray()))
            yes++
        n++
    }
    console.log(
        Math.floor((yes / n) * 1000) / 10 +
            '% ' +
            Math.floor(((n - yes) / n) * 1000) / 10 +
            '%',
    )
    yes = 0
    n = 0
}
