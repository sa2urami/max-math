import _ from 'lodash'
import { argmax } from '../../utilities'

const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
const mult = 20

const count = 28
canvas.width = count * mult + 200
canvas.height = count * mult
let painting = false
canvas.onpointerdown = () => (painting = true)
canvas.onpointerup = () => (painting = false)

let connected = false
let grid = [] as number[][]
//@ts-ignore
window.grid = grid
let outputValues = [] as number[]

const resetGrid = () => {
    _.times(28, (x) => {
        grid[x] = []
        _.times(28, (y) => {
            grid[x][y] = 0
        })
    })
    console.log(grid)
}
resetGrid()

const socket = new WebSocket('ws://localhost:8080')

socket.onmessage = ({ data }) => {
    outputValues = JSON.parse(data)
    redraw()
}

socket.onopen = () => {
    connected = true
    redraw()
}
socket.onclose = () => {
    connected = false
    redraw()
}

const drawGrid = () => {
    ctx.fillStyle = connected ? 'black' : 'red'
    _.times(count, (y) => {
        ctx.fillRect(0, y * mult, canvas.width - 200, 2)
    })

    _.times(count, (x) => {
        ctx.fillRect(x * mult, 0, 2, canvas.height)
    })
}

const redraw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const y in grid) {
        for (const x in grid[y]) {
            const val = Math.max(0, 255 - grid[y][x] * 255)
            ctx.fillStyle = `rgb(${val}, ${val}, ${val})`
            ctx.fillRect(+x * mult, +y * mult, mult, mult)
        }
    }
    drawGrid()
    const xColumns = count * mult
    const lineHeight = 48
    const yMax = argmax(outputValues)
    for (let y = 0; y <= 9; y++) {
        ctx.font = '48px monospace'
        ctx.fillStyle = yMax === y ? 'red' : 'black'
        ctx.fillText(String(y), xColumns, y * lineHeight + 35)
        ctx.font = '12px monospace'
        ctx.fillText(
            (outputValues[y] * 100).toFixed(3) + '%',
            xColumns + 100,
            y * lineHeight,
        )
        ctx.fillStyle =
            outputValues[y] < 0.2
                ? 'green'
                : outputValues[y] < 0.6
                ? 'yellow'
                : 'red'
        ctx.fillRect(
            xColumns + 50,
            y * lineHeight,
            outputValues[y] * 50,
            lineHeight - 15,
        )
    }
}
redraw()

const gridChanged = () => {
    socket.send(JSON.stringify(grid))
    redraw()
}

canvas.onpointermove = ({ clientX, clientY }) => {
    if (!painting) return
    const x = Math.floor(clientX / mult)
    const y = Math.floor(clientY / mult)
    if (x >= count) return
    if (!grid[y]) grid[y] = []
    const intens = 1
    grid[y][x] = Math.min(grid[y][x] + intens, 1)
    gridChanged()
}
//@ts-ignore
window.testOne = () => {
    socket.send('true')
}

canvas.oncontextmenu = (e) => {
    grid = []
    resetGrid()
    gridChanged()
    e.preventDefault()
}

const render = (values) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const lineHeight = 48
    const xColumns = 200
}
