
window.disablescroll = function () {

  document.body.dataset.scrollY = window.scrollY;

  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  `;
}

window.enablesroll = function () {
  document.body.style.cssText = ``;
  window.scroll({top: document.body.dataset.scrollY})
}
