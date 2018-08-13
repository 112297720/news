(function(d, w) {
  const doc = d.documentElement;
  function rem() {
    const width = Math.min(doc.getBoundingClientRect().width, 736);
    doc.style.fontSize = width / 7.5 + 'px';
  }
  rem();
  w.addEventListener('resize', rem);
})(document, window);
  