"use strict"
const LOG_ON = true
const LOG_FREQ = 50000
let train_count = 0


class NeuralNetwork {
    constructor(numInputs, numHidden,numOutputs){
        this._hidden = []
        this._inputs = []
        this._numInputs = numInputs 
        this._numHidden = numHidden 
        this._numOutputs = numOutputs
        this._bias0 = new Matrix(1, this._numHidden)
        this._bias1 = new Matrix(1, this._numOutputs)
        this._weights0 = new Matrix(this._numInputs, this._numHidden) 
        this._weights1 = new Matrix(this._numHidden, this._numOutputs)

        this._logCount = LOG_FREQ
        
        this._bias0.randomWeights()
        this._bias1.randomWeights()
        this._weights0.randomWeights()
        this._weights1.randomWeights()

    }

    get bias0(){
        return this._bias0
    }

    set bias0(bias){
        this._bias0 = bias
    }

    get bias1(){
        return this._bias1
    }

    set bias1(bias){
        this._bias1 = bias
    }

    get inputs(){
        return this._inputs
    }

    set inputs(inputs){
        this._inputs = inputs
    }

    get hidden(){
        return this._hidden
    }

    set hidden(hidden){
        this._hidden = hidden
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

    get logCount(){
        return this._logCount
    }

    set logCount(count){
        this._logCount = count
    }

    feedForward(inputArray){

        this.inputs = Matrix.convertFromArray(inputArray)

        this.hidden = Matrix.dot(this.inputs,this.weights0)
        this.hidden = Matrix.add(this.hidden, this.bias0)
        this.hidden = Matrix.map(this.hidden, x => sigmoid(x))
        
        let outputs = Matrix.dot(this.hidden,this.weights1)
        outputs = Matrix.add(outputs, this.bias1)
        outputs = Matrix.map(outputs, x => sigmoid(x))

        return outputs
    }
    
    train(inputArray,targetArray){

        let outputs = this.feedForward(inputArray)

        let targets = Matrix.convertFromArray(targetArray)
        let outputErros = Matrix.subtract(targets,outputs)

        if(LOG_ON){
            if (this.logCount == LOG_FREQ){
                console.log("Nº" + train_count + " error = " + outputErros.data[0][0] )
                
            }
            this.logCount--
            train_count++
            if(this.logCount ==0){
                this.logCount = LOG_FREQ
            }
        }

        let outputDerivs = Matrix.map(outputs, x => sigmoid(x,true))
        let outputDeltas = Matrix.multiply(outputErros, outputDerivs)
        
        let weights1T = Matrix.transpose(this.weights1)
        let hiddenErros = Matrix.dot(outputDeltas, weights1T)

        let hiddenDerivs = Matrix.map(this.hidden, x => sigmoid(x,true))
        let hiddenDeltas = Matrix.multiply(hiddenErros, hiddenDerivs)

        let hiddenT = Matrix.transpose(this.hidden)
        this.weights1 = Matrix.add(this.weights1,Matrix.dot(hiddenT,outputDeltas))      
        let inputsT = Matrix.transpose(this.inputs)
        this.weights0 = Matrix.add(this.weights0,Matrix.dot(inputsT,hiddenDeltas))

        this.bias1 = Matrix.add(this.bias1, outputDeltas)
        this.bias0 = Matrix.add(this.bias0, hiddenDeltas)

        
        

    }
}

function sigmoid(x, deriv = false) {
    if(deriv){
        return x * (1- x)
    }
    return 1 / (1+ Math.exp(-x))
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