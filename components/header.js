export const header = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1>Scroll Animation</h1>
  `;
  document.getElementById('header').innerHTML = container.innerHTML;
  return container;
}
