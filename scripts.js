import { header } from "./components/header.js";
import { footer } from "./components/footer.js";

import { section01 } from "./components/section01.js";
import { section02 } from "./components/section02.js";
import { section03 } from "./components/section03.js";
import { section04 } from "./components/section04.js";
import { section05 } from "./components/section05.js";

import { setupScroll } from "./components/scrollParam.js";

document.addEventListener('DOMContentLoaded', () => {
  header();
  footer();
  setupScroll();
  
  section01();
  section02();
  section03();
  section04();
  section05();
});
