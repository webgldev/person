export const section02 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 02</h2>
    <div id="label02">섹션 2 라벨</div>
  `;
  document.getElementById('section02').innerHTML = container.innerHTML;
  return container;
}
