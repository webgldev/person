export const section04 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 04</h2>
    <div id="label04">섹션 4 라벨</div>
  `;
  document.getElementById('section04').innerHTML = container.innerHTML;
  return container;
}
