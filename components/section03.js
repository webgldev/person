export const section03 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 03</h2>
  `;
  document.getElementById('section03').innerHTML = container.innerHTML;
  return container;
}
