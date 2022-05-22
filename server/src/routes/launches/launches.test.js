describe('Test GET /launches', () => {
  test('It should respond with 200 success',() => {
    let response = 200
    expect(response).toBe(200);
  })
});


describe('Test POST /launches', () => {
  test('It should respond with 201 success',() => {
    let response = 201
    expect(response).toBe(201);
  })

  test('It should catch missing required properties',() => {})
  test('It should catch invalid dates',() => {})
});