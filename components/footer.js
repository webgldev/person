export const footer = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <p>Footer</p>
  `;
  document.getElementById('footer').innerHTML = container.innerHTML;
  return container;
}
