const assert = require('assert')
const Matrix = require('../')
const { describe, it } = require('mocha')

describe('Create matrix (ofSize)', () => {
  it('Should have the right dimensions', () => {
    const rows = 2
    const cols = 4
    const matrix = Matrix.ofSize(rows, cols)

    assert.strictEqual(matrix.rows, rows, 'Property rows did not match')
    assert.strictEqual(matrix.cols, cols, 'Property cols did not match')
  })

  it('All elements should have value 0', () => {
    const m1 = Matrix.ofSize(3, 2)
    const m2 = Matrix.ofMatrix([
      [0, 0],
      [0, 0],
      [0, 0]
    ])

    assert.deepStrictEqual(m1, m2, 'Matrix did not initialize properly')
  })

  it('Should throw exception if invalid size', () => {
    assert.throws(() => Matrix.ofSize(0, 0), Error, 'Did not throw error')
    assert.throws(() => Matrix.ofSize(1, 0), Error, 'Did not throw error')
    assert.throws(() => Matrix.ofSize(0, 1), Error, 'Did not throw error')
    assert.throws(() => Matrix.ofSize(-1, 2), Error, 'Did not throw error')
  })
})

describe('Create matrix (ofMatrix)', () => {
  it('Should have the right dimensions', () => {
    const m = [
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]

    const matrix = Matrix.ofMatrix(m)

    assert.strictEqual(matrix.rows, 2, 'Property rows did not match')
    assert.strictEqual(matrix.cols, 4, 'Property cols did not match')
  })

  it('Should throw exception if invalid size', () => {
    assert.throws(() => Matrix.ofMatrix([]), Error, 'Did not throw error')
    assert.throws(() => Matrix.ofMatrix([[]]), Error, 'Did not throw error')
    assert.throws(() => Matrix.ofMatrix([[], [], []]), Error, 'Did not throw error')
  })
})

describe('Get and set specific value', () => {
  it('Should get the right value', () => {
    const m = [
      [0, 0, 2, 2],
      [1, 1, 3, 3]
    ]

    const matrix = Matrix.ofMatrix(m)

    assert.strictEqual(matrix.valueAt(0, 0), m[0][0], 'Value did not match')
    assert.strictEqual(matrix.valueAt(0, 2), m[0][2], 'Value did not match')
    assert.strictEqual(matrix.valueAt(1, 0), m[1][0], 'Value did not match')
    assert.strictEqual(matrix.valueAt(1, 3), m[1][3], 'Value did not match')
  })

  it('Should set the right value', () => {
    const matrix = Matrix.ofSize(2, 4)

    matrix.setValueAt(0, 0, 2)
    assert.strictEqual(matrix.valueAt(0, 0), 2, 'Value did not match')

    matrix.setValueAt(1, 3, 2)
    assert.strictEqual(matrix.valueAt(1, 3), 2, 'Value did not match')
  })

  it('Should throw exception if request is outside matrix bounds', () => {
    const m = [
      [0, 0, 2, 2],
      [1, 1, 3, 3]
    ]

    const matrix = Matrix.ofMatrix(m)
    assert.throws(() => matrix.valueAt(0, 4), Error, 'Did not throw error')
    assert.throws(() => matrix.valueAt(2, 0), Error, 'Did not throw error')
    assert.throws(() => matrix.setValueAt(0, 4, 0), Error, 'Did not throw error')
    assert.throws(() => matrix.setValueAt(2, 0, 0), Error, 'Did not throw error')
  })
})

describe('Check if matrices are multipliable', () => {
  it('Should be multipliable', () => {
    const m1 = Matrix.ofSize(2, 4)
    const m2 = Matrix.ofSize(4, 2)

    assert.strictEqual(m1.isMultipliableWith(m2), true, 'Was not multipliable')
    assert.strictEqual(m2.isMultipliableWith(m1), true, 'Was not multipliable')
    assert.strictEqual(m1.isMultipliableWith(m1), false, 'Was multipliable')
    assert.strictEqual(m2.isMultipliableWith(m2), false, 'Was multipliable')
  })
})

describe('Multiply matrices', () => {
  it('Should throw exception if matrices are not compatible', () => {
    const m1 = Matrix.ofSize(2, 4)
    const m2 = Matrix.ofSize(2, 4)

    assert.throws(() => m1.multiply(m2), Error, 'Did not throw error')
  })

  it('Should multiply matrices', () => {
    const m1 = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const m2 = Matrix.ofMatrix([
      [1],
      [2],
      [3]
    ])

    const result = Matrix.ofMatrix([
      [14],
      [32]
    ])

    assert.deepStrictEqual(m1.multiply(m2), result, 'Matrices did not multiply correctly')
  })

  it('Should not mutate input matrices', () => {
    const m1 = Matrix.ofSize(2, 4)
    const m1Equal = Matrix.ofSize(2, 4)
    const m2 = Matrix.ofSize(4, 2)
    const m2Equal = Matrix.ofSize(4, 2)

    m1.multiply(m2)

    assert.deepStrictEqual(m1, m1Equal, 'Matrix m1 was mutated')
    assert.deepStrictEqual(m2, m2Equal, 'Matrix m2 was mutated')
  })
})

describe('Perform Hadaman Product', () => {
  it('Should multiply matrices', () => {
    const m1 = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const m2 = Matrix.ofMatrix([
      [3, 4, 5],
      [5, 6, 7]
    ])

    const result = Matrix.ofMatrix([
      [3, 8, 15],
      [20, 30, 42]
    ])

    assert.deepStrictEqual(m1.hadamardProduct(m2), result, 'Matrices did not Hadaman-multiply correctly')
    assert.deepStrictEqual(m2.hadamardProduct(m1), result, 'Matrices did not Hadaman-multiply correctly')
  })

  it('Should not mutate input matrices', () => {
    const m1 = Matrix.ofSize(2, 4)
    const m1Equal = Matrix.ofSize(2, 4)
    const m2 = Matrix.ofSize(2, 4)
    const m2Equal = Matrix.ofSize(2, 4)

    m1.hadamardProduct(m2)

    assert.deepStrictEqual(m1, m1Equal, 'Matrix m1 was mutated')
    assert.deepStrictEqual(m2, m2Equal, 'Matrix m2 was mutated')
  })
})

describe('Add matrices', () => {
  it('Should add', () => {
    const m1 = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const m2 = Matrix.ofMatrix([
      [3, 4, 5],
      [5, 6, 7]
    ])

    const result = Matrix.ofMatrix([
      [4, 6, 8],
      [9, 11, 13]
    ])

    assert.deepStrictEqual(m1.add(m2), result, 'Matrices did not add correctly')
    assert.deepStrictEqual(m2.add(m1), result, 'Matrices did not add correctly')
  })

  it('Should not mutate input matrices', () => {
    const m1 = Matrix.ofSize(2, 4)
    const m1Equal = Matrix.ofSize(2, 4)
    const m2 = Matrix.ofSize(2, 4)
    const m2Equal = Matrix.ofSize(2, 4)

    m1.add(m2)

    assert.deepStrictEqual(m1, m1Equal, 'Matrix m1 was mutated')
    assert.deepStrictEqual(m2, m2Equal, 'Matrix m2 was mutated')
  })
})

describe('Subtract matrices', () => {
  it('Should subtract', () => {
    const m1 = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const m2 = Matrix.ofMatrix([
      [3, 4, 5],
      [5, 6, 7]
    ])

    const result = Matrix.ofMatrix([
      [-2, -2, -2],
      [-1, -1, -1]
    ])

    assert.deepStrictEqual(m1.subtract(m2), result, 'Matrices did not subtract correctly')
    assert.notDeepStrictEqual(m2.subtract(m1), result, 'Matrices did not subtract correctly')
  })

  it('Should not mutate input matrices', () => {
    const m1 = Matrix.ofSize(2, 4)
    const m1Equal = Matrix.ofSize(2, 4)
    const m2 = Matrix.ofSize(2, 4)
    const m2Equal = Matrix.ofSize(2, 4)

    m1.subtract(m2)

    assert.deepStrictEqual(m1, m1Equal, 'Matrix m1 was mutated')
    assert.deepStrictEqual(m2, m2Equal, 'Matrix m2 was mutated')
  })
})

describe('Apply function to matrix', () => {
  it('Should apply function to each element', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const result = Matrix.ofMatrix([
      [2, 4, 6],
      [8, 10, 12]
    ])

    const f = x => x * 2

    assert.deepStrictEqual(matrix.map(f), result, 'Did not apply function correctly')
  })

  it('Should not mutate matrix', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const matrixEqual = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const f = x => x * 2

    matrix.map(f)
    assert.deepStrictEqual(matrix, matrixEqual, 'Matrix was mutated')
  })
})

describe('Transpose matrix', () => {
  it('Should create a new transposed matrix', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2],
      [3, 4],
      [5, 6]
    ])

    const transposed = Matrix.ofMatrix([
      [1, 3, 5],
      [2, 4, 6]
    ])

    assert.deepStrictEqual(matrix.transpose(), transposed, 'Did not transpose correctly')
  })

  it('Should not mutate matrix', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const matrixEqual = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    matrix.transpose()
    assert.deepStrictEqual(matrix, matrixEqual, 'Matrix was mutated')
  })
})

describe('Copy matrix', () => {
  it('Should create a new identical matrix', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2],
      [3, 4],
      [5, 6]
    ])

    assert.deepStrictEqual(matrix.copy(), matrix, 'Did not copy correctly')
    assert.notStrictEqual(matrix.copy(), matrix, 'Copy returns same instance')
  })

  it('Should not mutate matrix', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const matrixEqual = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    matrix.copy()
    assert.deepStrictEqual(matrix, matrixEqual, 'Matrix was mutated')
  })
})

describe('Reduce matrix', () => {
  it('Should behave like Array.reduce', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2],
      [3, 4],
      [5, 6]
    ])

    assert.strictEqual(matrix.reduce((acc, val) => val > acc ? val : acc, -Infinity), 6, 'Max value was incorrect')
    assert.strictEqual(matrix.reduce((acc, val) => val < acc ? val : acc, Infinity), 1, 'Min value was incorrect')
    assert.strictEqual(matrix.reduce((acc, val) => val + acc, 0), 21, 'Sum value was incorrect')
  })

  it('Should not mutate matrix', () => {
    const matrix = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    const matrixEqual = Matrix.ofMatrix([
      [1, 2, 3],
      [4, 5, 6]
    ])

    matrix.reduce((acc, val) => acc + val, 0)
    assert.deepStrictEqual(matrix, matrixEqual, 'Matrix was mutated')
  })
})
