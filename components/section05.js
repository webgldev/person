export const section05 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 05</h2>
  `;
  document.getElementById('section05').innerHTML = container.innerHTML;
  return container;
}
