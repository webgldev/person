export const setupScroll = () => {
  const scrollLinks = document.querySelectorAll('.scroll-link');
  const sections = document.querySelectorAll('section');

  // 스크롤 링크 클릭 시 부드러운 스크롤 이동
  scrollLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetSection = document.querySelector(`#${targetId}`);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
        history.pushState(null, null, `#${targetId}`);
      }
    });
  });

  // 섹션이 뷰포트에 들어올 때 URL 업데이트
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.6
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        history.replaceState(null, null, `#${id}`);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // 뒤로 가기/앞으로 가기 버튼 처리
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1);
    const targetSection = document.querySelector(`#${hash}`);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });

  // 페이지 로드 시 URL에 해시가 있다면 해당 섹션으로 스크롤
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetSection = document.querySelector(`#${targetId}`);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }
}
