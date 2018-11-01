test('renders "no item" when no items are given', () => {
  //arrange
  const container = document.createElement("div");
  ReactDOM.render(<ItemList items={[]} />, container);
  //act
  expect(container.textContent).toMatch("no items");
  //assert
});

test("renders the items given", () => {
  //arrange
  const container = document.createElement("div");
  ReactDOM.render(<ItemList items={["apple", "orange", "pear"]} />, container);
  //act
  expect(container.textContent).toMatch("apple");
  expect(container.textContent).toMatch("oragnge");
  expect(container.textContent).toMatch("pear");
  //assert
});
