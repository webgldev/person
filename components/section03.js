export const section03 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 03</h2>
    <div id="label03">섹션 3 라벨</div>
  `;
  document.getElementById('section03').innerHTML = container.innerHTML;
  return container;
}
