class Matrix {
  /**
   * Creates a new matrix of given size, filled with zeros
   *
   * @param {int} rows
   * @param {int} cols
   * @returns {Matrix} - The new matrix
   */
  static ofSize (rows, cols) {
    const m = []
    for (let row = 0; row < rows; row++) {
      m[row] = new Array(cols).fill(0)
    }
    return new this(m)
  }

  /**
   * Creates a new matrix from an array
   *
   * @param {array} m
   * @returns {Matrix} - The new matrix
   */
  static ofMatrix (m) {
    return new this(m)
  }

  /**
   * Checks if two matrices have the same dimensions
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {boolean} - Whether they are of the same dimension or not
   */
  static haveSameDimensions (a, b) {
    return a.rows === b.rows && a.cols === b.cols
  }

  constructor (m) {
    this.m = m

    if (m.length < 1 || m[0].length < 1) {
      throw new Error('Matrix mus be at least 1x1.')
    }

    this.rows = m.length
    this.cols = m[0].length
  }

  /**
   * Checks if this matrix contains given index
   * @param {int} row
   * @param {int} col
   * @returns {boolean} - Whether it contains the index or not
   */
  containsIndex (row, col) {
    return row < this.rows && col < this.cols
  }

  /**
   * Retrieves the value at given index
   *
   * @param {int} row
   * @param {int} col
   * @returns {number} - Element at given index
   * @throws {Error} - Throws error if element out of bounds
   */
  valueAt (row, col) {
    if (!this.containsIndex(row, col)) {
      throw new Error(`Matrix does not contain {row: ${row}, col: ${col}}`)
    }

    return this.m[row][col]
  }

  /**
   * Set value at given index
   *
   * @param {int} row
   * @param {int} col
   * @param {number} val - The value to set
   * @throws {Error} - Throws error if element out of bounds
   */
  setValueAt (row, col, val) {
    if (!this.containsIndex(row, col)) {
      throw new Error(`Matrix does not contain {row: ${row}, col: ${col}}`)
    }

    this.m[row][col] = val
  }

  /**
   * Retrieves a row from the matrix
   *
   * @param {int} row - Index of the row
   * @returns {array} - A copy of the requested row
   * @throws {Error} - Throws error if index is out of bounds
   */
  getRow (row) {
    if (row >= this.rows) {
      throw new Error(`Matrix only contains ${this.rows} rows.`)
    }
    return [...this.m[row]]
  }

  /**
   * Retrieves the column vector at given index
   *
   * @param {int} col
   * @returns {array} - A copy of the requested column vector
   * @throws {Error} - Throws error if index is out of bounds
   */
  getCol (col) {
    if (col >= this.cols) {
      throw new Error(`Matrix only contains ${this.cols} cols.`)
    }
    return this.m.map(row => row[col])
  }

  /**
   * Determines whether this is multipliable with that
   *
   * @param {Matrix} that - The matrix to multiply this with
   * @returns {boolean} - If they are multipliable or not
   */
  isMultipliableWith (that) {
    return this.cols === that.rows
  }

  /**
   * Returns the result matrix-multiplication THIS*THAT
   *
   * @param {Matrix} that - Matrix to multiply with
   * @returns {Matrix} - The result of the multiplication
   * @throws {Error} - Throws error in case matrices are not multipliable
   */
  multiply (that) {
    if (!this.isMultipliableWith(that)) {
      throw new Error('Matrices not compatible.')
    }

    const result = Matrix.ofSize(this.rows, that.cols)

    for (let y = 0; y < result.rows; y++) {
      for (let x = 0; x < result.cols; x++) {
        const rowFirst = this.getRow(y)
        const colSecond = that.getCol(x)

        let num = 0
        for (let i = 0; i < rowFirst.length; i++) {
          num += rowFirst[i] * colSecond[i]
        }

        result.setValueAt(y, x, num)
      }
    }

    return result
  }

  /**
   * Returns a new matrix containing the Hadamard-product of this and that
   *
   * @param {Matrix} that - The other matrix to perform the product with
   * @returns {Matrix} - The new matrix containing the Hadamard-product
   */
  hadamardProduct (that) {
    return this.map((element, row, col) => element * that.valueAt(row, col))
  }

  /**
   * Returns a new matrix containing the element-wise sum of this plus that
   *
   * @param {Matrix} that - The matrix to subtract from this
   * @returns {Matrix} - The new matrix containing the sum this plus that
   * @throws {Error} - Throws error if matrices are not of the same dimension
   */
  add (that) {
    if (!Matrix.haveSameDimensions(this, that)) {
      throw new Error('Matrices must be of the same dimensions.')
    }

    return this.map((element, row, col) => element + that.valueAt(row, col))
  }

  /**
   * Returns a new matrix containing the element-wise difference of this minus that
   *
   * @param {Matrix} that - The matrix to subtract from this
   * @returns {Matrix} - The new matrix containing the difference this minus that
   * @throws {Error} - Throws error if matrices are not of the same dimension
   */
  subtract (that) {
    if (!Matrix.haveSameDimensions(this, that)) {
      throw new Error('Matrices must be of the same dimensions.')
    }

    return this.map((element, row, col) => element - that.valueAt(row, col))
  }

  /**
   * Returns the accumulated value. Works like Array.reduce()
   *
   * @param {function} f - The function to be called for each element. Gets args (acc, element, row, col)
   * @param {*} acc - The initial accumulator
   * @returns {*} - The final accumulator
   */
  reduce (f, acc) {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        acc = f(acc, this.m[y][x], y, x)
      }
    }

    return acc
  }

  /**
   * Returns a new array with function f applied to all elements. Works like Array.map()
   *
   * @param {function} f - The function to apply to all elements. Gets args (element, row, col)
   * @returns {Matrix} - The new mapped matrix
   */
  map (f) {
    const result = Matrix.ofSize(this.rows, this.cols)

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        result.setValueAt(row, col, f(this.valueAt(row, col), row, col))
      }
    }

    return result
  }

  /**
   * Returns a new matrix that is the transpose of current the matrix
   *
   * @returns {Matrix} - The new transposed matrix
   */
  transpose () {
    const result = Matrix.ofSize(this.cols, this.rows)

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        result.m[x][y] = this.m[y][x]
      }
    }

    return result
  }

  /**
   * Creates a copy of current matrix
   *
   * @returns {Matrix} - The new copy
   */
  copy () {
    const result = Matrix.ofSize(this.rows, this.cols)

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        result.m[y][x] = this.m[y][x]
      }
    }

    return result
  }
}

module.exports = Matrix
