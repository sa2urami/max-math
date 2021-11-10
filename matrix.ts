type Matonum = Matrix | number

export class Matrix {
    data: number[][]
    constructor(public rows: number, public cols: number) {
        this.data = Array.from({ length: rows }, () => Array(this.cols).fill(0))
    }
    copy(n: Matrix) {
        this.cols = n.cols
        this.rows = n.rows
        this.data = [...n.data.map((nums) => [...nums])]
    }
    multiply(n: Matonum) {
        if (n instanceof Matrix) {
            if (this.cols == n.rows) {
                let result = new Matrix(this.rows, n.cols)
                for (let i = 0; i < result.rows; i++) {
                    for (let j = 0; j < result.cols; j++) {
                        for (let k = 0; k < this.cols; k++)
                            result.data[i][j] += this.data[i][k] * n.data[k][j]
                    }
                }
                this.copy(result)
            } else if (this.rows == n.rows && this.cols == n.cols) {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++)
                        this.data[i][j] *= n.data[i][j]
                }
            } else {
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) this.data[i][j] *= n
            }
        }
    }
    static multiply(a: Matrix, n: Matonum) {
        if (n instanceof Matrix) {
            if (a.cols == n.rows) {
                let result = new Matrix(a.rows, n.cols)
                for (let i = 0; i < result.rows; i++) {
                    for (let j = 0; j < result.cols; j++) {
                        for (let k = 0; k < a.cols; k++)
                            result.data[i][j] += a.data[i][k] * n.data[k][j]
                    }
                }
                return result
            } else if (a.rows === n.rows && a.cols === n.cols) {
                let result = new Matrix(a.rows, a.cols)
                result.copy(a)
                for (let i = 0; i < a.rows; i++) {
                    for (let j = 0; j < a.cols; j++)
                        result.data[i][j] *= n.data[i][j]
                }
                return result
            } else {
                //console.log('Something went wrong')
                throw new Error('Something went wrong')
                //return undefined
            }
        } else {
            let result = new Matrix(a.rows, a.cols)
            result.copy(a)
            for (let i = 0; i < a.rows; i++) {
                for (let j = 0; j < a.cols; j++) result.data[i][j] *= n
            }
            return result
        }
    }
    add(n: Matonum) {
        if (n instanceof Matrix) {
            if (this.rows == n.rows && this.cols == n.cols) {
                for (let i = 0; i < this.rows; i++) {
                    for (let j = 0; j < this.cols; j++)
                        this.data[i][j] += n.data[i][j]
                }
            } else throw new Error("Can't add 'cause matrix don't match")
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) this.data[i][j] += n
            }
        }
    }
    subtract(n: Matonum) {
        if (n instanceof Matrix) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] -= n.data[i][j]
            }
        } else {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) this.data[i][j] -= n
            }
        }
    }
    print() {
        console.table(this.data)
    }
    rand() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = (Math.random() - 0.5) * 2
        }
    }
    transpose() {
        let result = new Matrix(this.cols, this.rows)
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++)
                result.data[j][i] = this.data[i][j]
        }
        this.copy(result)
    }
    static transpose(a: Matrix) {
        let result = new Matrix(a.cols, a.rows)
        for (let i = 0; i < a.rows; i++) {
            for (let j = 0; j < a.cols; j++) result.data[j][i] = a.data[i][j]
        }
        return result
    }
    map(func: (arg0: any) => any) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = func(this.data[i][j])
        }
    }
    clone() {
        let buf = new Matrix(0, 0)
        buf.copy(this)
        return buf
    }
    toArray() {
        const buf: number[] = []
        if (this.cols == 1) {
            for (let i = 0; i < this.rows; i++)
                buf[i] = this.data[i][0]
        }
        return buf
    }
}
