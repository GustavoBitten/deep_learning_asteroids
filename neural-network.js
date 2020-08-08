"use strict"

class NeuralNetwork {
    constructor(numInputs, numHidden,numOutputs){
        this._numInputs = numInputs 
        this._numHidden = numHidden 
        this._numOutputs = numOutputs
        this._weights0 = new Matrix(this._numInputs, this._numHidden) 
        this._weights1 = new Matrix(this._numHidden, this._numOutputs)
        
        this._weights0.randomWeights()
        this._weights1.randomWeights()
    }

    get weights0(){
        return this._weights0
    }

    set weights0(weights){
        this._weights0 = weights
    }

    get weights1(){
        return this._weights1
    }

    set weights1(weights){
        this._weights1 = weights
    }

}  




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

    static dot(m0,m1){
        if(m0.cols != m1.rows){
            throw new Error ("Matrices are not \"dot\" compatible ")
        }
        let m = new Matrix(m0.rows, m1.cols)
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                let sum = 0
                for (let k = 0; k < m0.cols; k++){
                    sum += m0.data[i][k]* m1.data[k][j]
                }
                m.data[i][j] = sum
            }

        }
        return m
        
    }

    static convertFromArray(arr){
        return new Matrix(1, arr.length, [arr])
    }

    static map(m0, mFunction){
        let m = new Matrix(m0.rows, m0.cols)
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = mFunction(m0.data[i][j])
            }

        }
        return m
    }

    static checkDimensions(m0, m1) {
        if (m0.rows != m1.rows || m0.cols != m1.cols) {
            throw new Error("Matrices are of different dimensions!")
        }
    }

    static transpose(m0){
        let m = new Matrix(m0.cols, m0.rows)
        for (let i = 0; i < m0.rows; i++) {
            for (let j = 0; j < m0.cols; j++) {
                m.data[j][i] = m0.data[i][j]
            }
        }
        return m
    }

    randomWeights() {
        for (let i = 0; i < this._rows; i++) {
            for (let j = 0; j < this._cols; j++) {
                this._data[i][j] = Math.random() * 2 - 1
            }

        }
    }

}