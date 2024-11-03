export const section01 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 01</h2>
  `;
  document.getElementById('section01').innerHTML = container.innerHTML;
  return container;
}
