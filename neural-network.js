"use strict"


class Matrix {
    constructor(rows, cols, data = []) {
        this._rows = rows
        this._cols = cols
        this._data = data

        if (data == null || data.length == 0) {
            this._data = []

            for (let i = 0; i < this._rows; i++) {
                this.data[i] = []
                for (let j = 0; j < this._cols; j++) {
                    this._data[i][j] = 0
                }

            }
        } else {

            if (data.length != rows || data[0].length != cols) {
                throw new Error("Incorrect data dimensions")
            }
        }



    }

    get rows() {
        return this._rows
    }

    get cols() {
        return this._cols
    }

    get data() {
        return this._data
    }

    static add(m0, m1) {
        Matrix.checkDimensions(m0, m1)
        let m = new Matrix(m0.rows, m0.cols)
        for (let i = 0; i < m.rows; i++) {

            for (let j = 0; j < m.cols; j++) {

                m.data[i][j] = m0.data[i][j] + m1.data[i][j]

            }

        }
        return m
    }

    static subtract(m0, m1) {
        Matrix.checkDimensions(m0, m1)
        let m = new Matrix(m0.rows, m0.cols)
        for (let i = 0; i < m.rows; i++) {

            for (let j = 0; j < m.cols; j++) {
                
                m.data[i][j] = m0.data[i][j] - m1.data[i][j]

            }

        }
        return m
    }

    static multiply(m0, m1) {
        Matrix.checkDimensions(m0, m1)
        let m = new Matrix(m0.rows, m0.cols)
        for (let i = 0; i < m.rows; i++) {

            for (let j = 0; j < m.cols; j++) {
                
                m.data[i][j] = m0.data[i][j] * m1.data[i][j]

            }

        }
        return m
    }

    static checkDimensions(m0, m1) {
        if (m0.rows != m1.rows || m0.cols != m1.cols) {
            throw new Error("Matrices are of different dimensions!")
        }
    }

    randomWeights() {
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                this._data[i][j] = Math.random() * 2 - 1
            }

        }
    }

}