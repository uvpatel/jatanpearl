// Balcony platform scroll cue - fades the hero's "Scroll down" in, and out
// again for good once the guest scrolls. Styling and markup: scroll-cue.css.
//
// A template whose hero starts behind a cover ("Tap to open") marks its cue
// data-after-cover, and dispatches 'balcony:cover-open' on document once that
// cover is out of the way - a "scroll down" over an unopened cover would be
// telling the guest to do the wrong thing. data-delay (ms) holds the cue back
// a little longer, for a cover that is still animating away when it says so.
(function () {
  var cues = Array.prototype.slice.call(document.querySelectorAll('.scroll-cue'));
  if (!cues.length) return;

  // The host editing the invitation has nothing to scroll towards - every
  // section is laid out in front of them, and the cue would sit over the hero
  // they are editing.
  if (new URLSearchParams(location.search).has('edit')) {
    cues.forEach(function (c) { c.remove(); });
    return;
  }

  // Past this, the guest has found the rest of the page - the cue's job is done.
  var SCROLLED = 60;

  function gone() {
    if (window.scrollY <= SCROLLED) return false;
    cues.forEach(function (c) { c.classList.add('is-gone'); });
    window.removeEventListener('scroll', gone);
    return true;
  }
  window.addEventListener('scroll', gone, { passive: true });

  cues.forEach(function (cue) {
    var delay = parseInt(cue.getAttribute('data-delay'), 10) || 0;
    function show() {
      window.setTimeout(function () {
        if (!gone()) cue.classList.add('is-shown');
      }, delay);
    }
    if (cue.hasAttribute('data-after-cover')) {
      document.addEventListener('balcony:cover-open', show, { once: true });
    } else {
      show();
    }
  });
})();
