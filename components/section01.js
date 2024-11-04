export const section01 = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Section 01</h2>
    <div id="label01">섹션 1 라벨</div>
  `;
  document.getElementById('section01').innerHTML = container.innerHTML;
  return container;
}
