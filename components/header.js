export const header = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <h1>Scroll Animation</h1>
    <nav>
      <a href="#section01" class="scroll-link" data-target="section01">Section 01</a>
      <a href="#section02" class="scroll-link" data-target="section02">Section 02</a>
      <a href="#section03" class="scroll-link" data-target="section03">Section 03</a>
      <a href="#section04" class="scroll-link" data-target="section04">Section 04</a>
      <a href="#section05" class="scroll-link" data-target="section05">Section 05</a>
    </nav>
  `;
  document.getElementById('header').innerHTML = container.innerHTML;
  return container;
}
