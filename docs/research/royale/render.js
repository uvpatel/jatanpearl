// Royale - drawing the invitation from its config.
//
// Runs before the animation scripts (see the script order in index.html) so
// they start against the final DOM: date-reveal.js reads the date this puts
// on the section, and gallery.js measures the frames this builds.
//
// In edit mode it also draws the editing affordances - contenteditable fields
// carrying their config path in data-edit, the chips that take a card out and
// put it back, and the gallery's and ceremonies' own controls. editor.js
// wires the behaviour; nothing here listens for anything.
(function () {
  const RY = window.Royale;
  if (!RY) return;

  const cfg = RY.config;
  const edit = RY.mode === 'edit';
  const esc = RY.esc;
  const $ = (id) => document.getElementById(id);

  /**
   * Write a value into an element and, in edit mode, make it editable in
   * place. This is the ONLY place editability is granted, so it is also where
   * the trial's allowlist is enforced: a locked field still renders, it just
   * is not contenteditable, and editor.js's delegated handlers (which all
   * match on [data-edit]) never see it.
   */
  function editable(el, path, value, opts) {
    if (!el) return;
    const o = opts || {};
    el.textContent = value == null ? '' : value;

    if (!edit) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('data-edit');
      el.removeAttribute('data-locked');
      el.removeAttribute('title');
      return;
    }

    if (RY.canEdit(path)) {
      el.setAttribute('contenteditable', 'plaintext-only');
      el.dataset.edit = path;
      el.spellcheck = false;
      if (o.multiline) el.dataset.editMultiline = '1';
      if (o.placeholder) el.dataset.editPlaceholder = o.placeholder;
      el.removeAttribute('data-locked');
      el.removeAttribute('title');
    } else {
      el.removeAttribute('contenteditable');
      el.setAttribute('data-locked', '1');
      el.title = 'Buy this template to edit';
    }
  }

  // ---- Removable cards --------------------------------------------------
  // A family scroll, the compliments and the note can be taken out and put
  // back. Only a flag moves - the writing stays in the config while the card
  // is out, so restoring brings it back exactly as the host left it, and a
  // guest simply never sees it. The host gets a slot in its place, or the
  // card would vanish with no way back.
  const CARD_LABEL = {
    groomFamily: "Groom's family scroll",
    brideFamily: "Bride's family scroll",
    compliments: 'Compliments scroll',
    note: 'Note scroll',
    gallery: 'Photo gallery',
  };

  function applyCardState(key, branch, el) {
    if (!el) return true;
    // Undefined counts as on: a config saved before a flag existed must not
    // silently lose its card.
    const on = !branch || branch.enabled !== false;
    el.hidden = !on;

    let slot = el.parentNode.querySelector('[data-card-slot="' + key + '"]');
    if (!on && edit) {
      if (!slot) {
        slot = document.createElement('div');
        slot.className = 'ry-slot';
        slot.dataset.cardSlot = key;
        el.parentNode.insertBefore(slot, el.nextSibling);
      }
      slot.innerHTML =
        '<span class="ry-slot__text">' + esc(CARD_LABEL[key] || 'Card') + ' removed</span>' +
        '<button type="button" class="ry-slot__btn" data-action="card-restore" data-card="' + key + '">' +
        '+ Add it back</button>';
      slot.hidden = false;
    } else if (slot) {
      slot.hidden = true;
    }

    if (on && edit && RY.canEdit(key)) {
      let chip = el.querySelector(':scope > .ry-chip');
      if (!chip) {
        chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'ry-chip';
        chip.dataset.action = 'card-remove';
        chip.dataset.card = key;
        chip.innerHTML = '&times; Remove';
        chip.title = 'Remove this card';
        el.appendChild(chip);
      }
      chip.hidden = false;
    } else {
      const chip = el.querySelector(':scope > .ry-chip');
      if (chip) chip.hidden = true;
    }

    return on;
  }

  // ---- The couple's names on the hero ------------------------------------
  function renderNames() {
    editable($('ryBrideName'), 'brideName', cfg.brideName, { placeholder: 'Bride' });
    editable($('ryGroomName'), 'groomName', cfg.groomName, { placeholder: 'Groom' });
  }

  // ---- The gate's card ---------------------------------------------------
  // The symbol is painted as a mask so the artwork takes the ink colour, the
  // same way papercut paints its own opening symbol.
  function renderInvocation() {
    const symEl = document.querySelector('.royale-card__symbol');
    const sym = RY.symbolById(cfg.invocation.symbol);
    if (symEl) {
      symEl.hidden = !sym.src;
      if (sym.src) {
        symEl.style.webkitMaskImage = "url('" + sym.src + "')";
        symEl.style.maskImage = "url('" + sym.src + "')";
      }
    }

    const line = RY.invocationLines(cfg.invocation);
    const mantra = $('ryInvocation');
    if (mantra) {
      mantra.textContent = line.text || '';
      mantra.hidden = !line.text;
      mantra.dir = line.rtl ? 'rtl' : 'ltr';
      mantra.style.fontFamily = (line.isEnglish || line.isCustom || !line.font)
        ? 'var(--font-display)'
        : "'" + line.font + "', serif";
    }

    // One button opens the tradition/script/symbol picker (editor.js).
    const card = document.querySelector('.royale-card');
    if (edit && card && RY.canEdit('invocation.religion') && !card.querySelector('.ry-inv-btn')) {
      card.insertAdjacentHTML('afterbegin',
        '<button type="button" class="ry-inv-btn" data-action="invocation-pick">Change invocation</button>');
    }
  }

  /**
   * The guest's name, from ?to= - and NOTHING while the host is editing, or
   * when the link names nobody. The host has no guest to show and the line
   * is not theirs to edit, so the editor leaves it off rather than filling
   * it with a placeholder. A personalised link that arrives without a name
   * behaves exactly like the common link: the line is dropped rather than
   * standing in for the guest with a general greeting. Both callers already
   * hide the element on an empty string, so there is no blank gap where the
   * name would have been.
   */
  function guestHtml() {
    if (edit || RY.commonLink) return '';
    const name = RY.guestName();
    return name ? esc(name) : '';
  }

  function renderGateCard() {
    renderInvocation();
    const guest = $('ryGuestGreeting');
    if (guest) {
      guest.innerHTML = guestHtml();
      guest.hidden = guest.innerHTML === '';
    }
    editable($('ryIntroNote'), 'introNote', cfg.introNote, { multiline: true, placeholder: 'Your invitation line…' });
  }

  // ---- The family scrolls ------------------------------------------------
  function renderFamily(cardId, path, family) {
    const card = $(cardId);
    if (!applyCardState(path, family, card)) return;

    const p = path === 'groomFamily' ? 'ryGroom' : 'ryBride';
    editable($(p + 'CardName'), path + '.name', family.name, { placeholder: 'Full name' });
    editable($(p + 'RelLabel'), path + '.relLabel', family.relLabel, { placeholder: 'e.g. Son of' });
    editable($(p + 'ParentA'), path + '.parentA', family.parentA, { placeholder: "Parent's name" });
    editable($(p + 'ParentB'), path + '.parentB', family.parentB, { placeholder: "Parent's name" });
    editable($(p + 'GrandLabel'), path + '.grandLabel', family.grandLabel, { placeholder: 'e.g. Grandson of' });
    editable($(p + 'GrandA'), path + '.grandA', family.grandA, { placeholder: "Grandparent's name" });
    editable($(p + 'GrandB'), path + '.grandB', family.grandB, { placeholder: "Grandparent's name" });
    joiner($(p + 'ParentJoin'), path + '.parentJoin', family.parentJoin, family.parentA, family.parentB);
    joiner($(p + 'GrandJoin'), path + '.grandJoin', family.grandJoin, family.grandA, family.grandB);
  }

  // The "&" between two names is the host's to change or delete - a family
  // naming one parent, or no grandparents, has nothing for it to join.
  // `== null`, not `||`: an invitation saved before the field existed gets
  // its "&", one the host cleared stays cleared. For guests it is taken out
  // whenever it is blank or either name beside it is - an empty flex item
  // would still cost the row a gap. Inline display, not el.hidden: royale has
  // no blanket [hidden] rule to beat the author styles.
  function joiner(el, path, value, a, b) {
    if (!el) return;
    const text = value == null ? '&' : String(value);
    editable(el, path, text, { placeholder: '&' });
    const joins = text.trim() && (a || '').trim() && (b || '').trim();
    el.style.display = edit || joins ? '' : 'none';
  }

  function renderFamilies() {
    renderFamily('ryGroomCard', 'groomFamily', cfg.groomFamily);
    renderFamily('ryBrideCard', 'brideFamily', cfg.brideFamily);
  }

  // ---- The date reveal ---------------------------------------------------
  // date-reveal.js takes the date off the section, so this is the only place
  // the wedding date reaches the dials.
  function renderDate() {
    const section = $('ryDateReveal');
    if (section) section.setAttribute('data-date', cfg.eventISO || '');

    // Into the label, not the button: the button also holds its plaque drawing.
    const btn = $('ryRevealBtn');
    const btnLabel = btn && btn.querySelector('.ry-plaque__label');
    if (btnLabel) btnLabel.textContent = cfg.revealButton || 'Reveal the Date';
    const after = $('ryRevealAfter');
    if (after) after.textContent = cfg.revealAfter || 'Save the Date';

    // The picker stands under the plaques rather than behind a button: a host
    // should see that the date is theirs to set without having to find the
    // control first. Built once and left in place (the values are written
    // below on every render), the same way rose-invitation's date field is.
    //
    // A calendar AND three typed fields, as papercut and rose both offer: on
    // iOS Safari a type="date" field is a scrolling wheel with no way to type
    // at all. Either one sets the date; editor.js keeps them in step.
    if (!edit || !section || !RY.canEdit('eventISO')) return;

    let panel = section.querySelector('.ry-date-edit');
    if (!panel) {
      panel = document.createElement('div');
      panel.className = 'ry-date-edit';
      panel.innerHTML =
        '<label class="ry-date-edit__field"><span>Wedding date</span>' +
        '<input type="date" class="ry-date-edit__iso date-input" data-edit-input="eventISO"></label>' +
        '<div class="ry-date-edit__manual">' +
        '<label><span>Day</span><input type="number" min="1" max="31" class="ry-date-edit__day" placeholder="8"></label>' +
        '<label><span>Month</span><input type="number" min="1" max="12" class="ry-date-edit__month" placeholder="2"></label>' +
        '<label><span>Year</span><input type="number" min="1900" max="2999" class="ry-date-edit__year" placeholder="2026"></label>' +
        '</div>' +
        '<p class="ry-date-edit__hint">The ceremonies move with it, keeping the days between them. Ceremonies you added yourself keep their own dates.</p>';
      section.appendChild(panel);
    }

    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cfg.eventISO || '');
    panel.querySelector('.ry-date-edit__iso').value = cfg.eventISO || '';
    panel.querySelector('.ry-date-edit__day').value = parts ? +parts[3] : '';
    panel.querySelector('.ry-date-edit__month').value = parts ? +parts[2] : '';
    panel.querySelector('.ry-date-edit__year').value = parts ? parts[1] : '';
  }

  // ---- The gallery -------------------------------------------------------
  // Keep in step with the same constant in editor.js, which refuses the add
  // once the gallery is full. This one only decides whether the tile is drawn
  // and what count it prints.
  const GALLERY_MAX = 10;

  function frameHtml(item, i) {
    const type = item.type === 'story' ? 'story' : item.type === 'landscape' ? 'landscape' : 'portrait';
    const controls = edit && RY.canEdit('gallery.items')
      ? '<div class="ry-frame-controls">' +
        '<button type="button" data-action="gallery-move" data-dir="-1" data-index="' + i + '" title="Move back">◀</button>' +
        '<button type="button" data-action="gallery-remove" data-index="' + i + '" title="Remove">✕</button>' +
        '<button type="button" data-action="gallery-move" data-dir="1" data-index="' + i + '" title="Move on">▶</button>' +
        '</div>'
      : '';

    const head =
      '<div class="gframe gframe--' + type + '" style="--hang: ' + (+item.hang || 110) + 'px;">' +
      '<span class="gframe__hook" aria-hidden="true"></span>' +
      '<svg class="gframe__cord" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
      '<path d="M50 0L0 100M50 0L100 100" /><path class="gframe__twist" d="M50 0L0 100M50 0L100 100" /></svg>' +
      controls +
      '<div class="gframe__body">' +
      '<span class="gframe__side gframe__side--top"></span><span class="gframe__side gframe__side--right"></span>' +
      '<span class="gframe__side gframe__side--bottom"></span><span class="gframe__side gframe__side--left"></span>' +
      '<div class="gframe__face"><div class="gframe__lip">';

    const tail = '</div></div></div></div>';

    if (type === 'story') {
      return head +
        '<div class="gframe__mat gframe__story">' +
        '<p' + ed('gallery.items.' + i + '.text', { multiline: true, placeholder: 'Write your story…' }) + '>' +
        RY.nl2br(item.text || '') + '</p>' +
        '</div>' + tail;
    }

    const img = (item.image || '').trim();

    // How the picture sits in its frame. A photo is rarely framed well by
    // whatever crop `cover` happens to choose, so the host gets to say: zoom
    // in, and drag the part they want into view. Both are stored per frame and
    // both default to reproducing the old behaviour exactly - scale 1 with the
    // centre showing IS `background: center / cover`, which is what this
    // replaced. An <img> rather than that background, because CSS can multiply
    // a scale but cannot multiply `cover`.
    // The three numbers ride on the element and frameImage() turns them into
    // a size and an offset once the picture's own proportions are known.
    const zoom = Math.min(3, Math.max(1, +item.zoom || 1));
    const px = Number.isFinite(+item.posX) ? Math.min(100, Math.max(0, +item.posX)) : 50;
    const py = Number.isFinite(+item.posY) ? Math.min(100, Math.max(0, +item.posY)) : 50;
    const imgTag = img
      ? '<img class="gframe__img" src="' + esc(img) + '" alt="" draggable="false" ' +
        'data-zoom="' + zoom + '" data-pos-x="' + px + '" data-pos-y="' + py + '">'
      : '';

    const canEditGallery = edit && RY.canEdit('gallery.items');

    // One surface, four gestures. While editing the picture area IS the
    // control: tap it to choose (or swap) the photo, drag to move the picture
    // inside its frame, wheel or pinch to zoom. A tap is a pointerdown and up
    // with no travel between them, so it never fires at the end of a drag -
    // see the handler in editor.js.
    //
    // That replaced a slider and a Replace button sitting under the frame.
    // Both were controls for a thing whose obvious control is the thing
    // itself, and on a phone the slider took a third of the frame's width.
    const photo = canEditGallery
      ? '<div class="gframe__photo gframe__photo--adjust" data-adjust="' + i + '" ' +
        'title="' + (img ? 'Tap to change, drag to move, scroll or pinch to zoom' : 'Tap to add a photo') + '">' +
        imgTag + (img ? '' : '<span class="gframe__placeholder">Tap to add a photo</span>') + '</div>'
      : '<div class="gframe__photo">' + imgTag +
        (img ? '' : '<span class="gframe__placeholder">Your photo here</span>') + '</div>';
    return head +
      '<figure class="gframe__mat">' +
      photo +
      '<figcaption class="gframe__caption"' + ed('gallery.items.' + i + '.caption', { placeholder: '#caption' }) + '>' +
      esc(item.caption || '') + '</figcaption>' +
      '</figure>' + tail;
  }

  /** editable()'s attribute half, for markup built as a string. */
  function ed(path, opts) {
    if (!edit) return '';
    if (!RY.canEdit(path)) return ' data-locked="1" title="Buy this template to edit"';
    const o = opts || {};
    return ' data-edit="' + path + '"' +
      (o.multiline ? ' data-edit-multiline="1"' : '') +
      (o.placeholder ? ' data-edit-placeholder="' + esc(o.placeholder) + '"' : '') +
      ' contenteditable="plaintext-only" spellcheck="false"';
  }

  /**
   * A frame with nothing in it is the host's to fill; their guests never see
   * it.
   *
   * The template's own pages are the exception: there the empty frames the
   * defaults ship with (placeholder: true) are the sample gallery, and they
   * hang with their "Your photo here" mat, so the gallery reads as it is
   * drawn - portrait and landscape pictures among the story cards. An
   * invitation that belongs to a host always arrives with a platform payload
   * (RY.platform, see platform-adapter.js), so this never reaches a guest,
   * and it takes nothing away from the host: an empty frame of their own is
   * still theirs to fill or to remove.
   */
  function galleryFilled(item) {
    if (item.type === 'story') return !!(item.text || '').trim();
    return !!(item.image || '').trim() || (!RY.platform && item.placeholder === true);
  }

  // ---- Laying a picture in its frame --------------------------------------
  // The obvious way - 'object-fit: cover' plus a 'scale' - cannot pan a
  // zoomed picture. cover crops the image to the element's box first, so the
  // scale enlarges an already-cropped picture and object-position is still
  // only free to move within the *unzoomed* crop. In a portrait frame that
  // crop overflows sideways and not at all vertically, so zooming in and
  // dragging down to bring someone's face up did precisely nothing.
  //
  // So the element is sized to the whole picture instead: its natural
  // proportions, scaled up to cover the frame and then multiplied by the
  // host's zoom. The frame's overflow:hidden is the crop, and panning is a
  // plain pixel translate - which means every part of a zoomed picture is
  // reachable on both axes, and the picture keeps pace with the finger
  // holding it. Returns how far it can still travel, which is what the
  // editor's drag needs to convert pointer pixels into stored position.
  function frameImage(el) {
    const box = el && el.parentElement;
    if (!box) return null;
    const bw = box.clientWidth, bh = box.clientHeight;
    const nw = el.naturalWidth, nh = el.naturalHeight;
    if (!bw || !bh || !nw || !nh) return null;

    // A gallery frame never goes below covering (zoom 1). An added ceremony's
    // photo may (data-zoom-min, below 1), so a cut-out picture can be shown
    // whole, with the card's own colour round it.
    const min = Math.min(1, +el.dataset.zoomMin || 1);
    const zoom = Math.min(3, Math.max(min, +el.dataset.zoom || 1));
    const fit = Math.max(bw / nw, bh / nh) * zoom;
    const w = nw * fit, h = nh * fit;
    el.style.width = w + 'px';
    el.style.height = h + 'px';

    // What is left over once the frame is covered: the travel available. The
    // stored position spends it - 50 centred, 0 bringing the left or top
    // edge in, 100 the right or bottom - and clamping it to 0..100 is what
    // stops a drag pulling a gap in beside the picture. Zoomed out below
    // covering, the spare goes negative and the same position places the
    // smaller picture inside the frame instead: 50 centred, 0 against the
    // left or top, 100 against the right or bottom.
    const spareX = w - bw, spareY = h - bh;
    const x = Number.isFinite(+el.dataset.posX) ? +el.dataset.posX : 50;
    const y = Number.isFinite(+el.dataset.posY) ? +el.dataset.posY : 50;
    // The picture starts at the frame's top-left corner, so 0 already has its
    // left or top edge flush; 50 backs it off by half the spare and centres
    // it, 100 by all of it and brings the far edge in.
    el.style.transform = 'translate(' + (-(x / 100) * spareX) + 'px,' +
                                        (-(y / 100) * spareY) + 'px)';
    return { ovX: Math.max(0, spareX / 2), ovY: Math.max(0, spareY / 2) };
  }

  // A picture cannot be laid out until it has reported its proportions, and
  // the layout is in pixels, so it is also redone whenever the frame changes
  // size - a phone turning on its side, mostly.
  function frameImages(root) {
    (root || document).querySelectorAll('.gframe__img, .ryc-card__photo-img').forEach((el) => {
      if (el.complete && el.naturalWidth) frameImage(el);
      else el.addEventListener('load', () => frameImage(el), { once: true });
    });
  }

  window.addEventListener('resize', () => frameImages());

  function renderGallery() {
    const section = document.querySelector('.royale-gallery');
    const track = document.querySelector('.royale-gallery__track');
    if (!section || !track) return;

    const all = Array.isArray(cfg.gallery.items) ? cfg.gallery.items : [];
    const items = edit ? all : all.filter(galleryFilled);
    const on = cfg.gallery.enabled !== false && (edit || items.length > 0);

    applyCardState('gallery', cfg.gallery, section);
    section.hidden = !on && !edit;
    if (!on) return;

    // The rail is the thing the frames hang from, so it stays first.
    let html = '<div class="royale-gallery__rail" aria-hidden="true"></div>';
    items.forEach((item, i) => { html += frameHtml(item, i); });

    if (edit && RY.canEdit('gallery.items') && items.length < GALLERY_MAX) {
      html +=
        '<div class="gframe ry-frame-add" style="--hang: 110px;">' +
        '<div class="ry-frame-add__box"><p>Add a frame (' + items.length + '/' + GALLERY_MAX + ')</p>' +
        '<button type="button" data-action="gallery-add" data-type="portrait">+ Portrait</button>' +
        '<button type="button" data-action="gallery-add" data-type="landscape">+ Landscape</button>' +
        '<button type="button" data-action="gallery-add" data-type="story">+ Words</button>' +
        '</div></div>';
    }

    track.innerHTML = html;
    frameImages(track);
  }

  // ---- The ceremonies ----------------------------------------------------
  /**
   * An added ceremony's picture: the host's own photo where a built-in card
   * has the template's artwork. It fills the arch itself - cut to the shape
   * of the cream panel inside the card (#ryCeremonyPanel in index.html), no frame
   * of its own - down to a straight edge above the name (styles.css).
   *
   * Zoomed and placed the way a gallery picture is (frameImage), except that
   * it may also be zoomed OUT below covering its area - a cut-out picture can
   * then sit whole with the card's colour round it. While editing, the
   * picture area is the control, as a gallery frame's is: tap to choose or
   * swap the photo, drag to move it, wheel or pinch to zoom (editor.js).
   */
  function ceremonyPhotoHtml(c, i, editable) {
    const src = (c.art || '').trim();
    const min = RY.CEREMONY_ZOOM_MIN;
    const zoom = Math.min(3, Math.max(min, +c.zoom || 1));
    const px = Number.isFinite(+c.posX) ? Math.min(100, Math.max(0, +c.posX)) : 50;
    const py = Number.isFinite(+c.posY) ? Math.min(100, Math.max(0, +c.posY)) : 50;
    const img = src
      ? '<img class="ryc-card__photo-img" src="' + esc(src) + '" alt="" draggable="false" decoding="async" ' +
        'data-zoom="' + zoom + '" data-zoom-min="' + min + '" data-pos-x="' + px + '" data-pos-y="' + py + '">'
      : '';
    if (!editable) return '<div class="ryc-card__photo"><div class="ryc-card__photo-box">' + img + '</div></div>';
    return '<div class="ryc-card__photo">' +
      '<div class="ryc-card__photo-box ryc-card__photo-box--adjust" data-cphoto="' + i + '" ' +
      'title="' + (src ? 'Tap to change, drag to move, scroll or pinch to zoom' : 'Tap to add a photo') + '">' +
      (img || '<span class="ryc-card__photo-empty">Tap to add a photo</span>') + '</div></div>';
  }

  /**
   * One ceremony. A host edits the writing where they read it, on the card
   * itself, and the card holds exactly what a guest's does in exactly the
   * same places: the picture the same size, the name, venue and date where
   * they print. So anything a guest never sees - the map link, the photo's
   * zoom, the note on an added card that is still hidden - goes on a panel
   * under the card instead (ceremonyBelowHtml), never into it.
   */
  function ceremonyHtml(c, i) {
    const name = (c.name || '').trim();
    const map = RY.mapLink(c);
    const editable = edit && RY.canEdit('ceremonies');

    // An added ceremony is deleted outright rather than switched off: it is
    // the host's own, and there is nothing of the template's to keep for it.
    let control = '';
    if (editable && c.custom) {
      control = '<button type="button" class="ry-cere-toggle ry-cere-remove" data-action="ceremony-remove" data-index="' + i + '" title="Delete this ceremony">&times; Remove</button>';
    } else if (editable) {
      // Says which state the card is in, as papercut's toggle does.
      control = '<label class="ry-cere-toggle" title="Include this ceremony in the invitation"><input type="checkbox" data-edit-toggle="ceremonies.' + i + '.enabled"' +
        (c.enabled !== false ? ' checked' : '') + '> ' + (c.enabled !== false ? 'Included' : 'Excluded') + '</label>';
    }

    const card = '<article class="ryc-card' + (c.custom ? ' ryc-card--own' : '') + '"' + (c.enabled === false ? ' data-off="1"' : '') + '>' +
      control +
      (c.custom ? ceremonyPhotoHtml(c, i, editable) : '') +
      '<div class="ryc-card__inner">' +
      (c.custom
        ? ''
        : '<div class="ryc-card__artwell">' +
          '<img class="ryc-card__art" src="' + esc(c.art || '') + '" alt="" aria-hidden="true" loading="lazy" decoding="async">' +
          '</div>') +
      '<h3 class="ryc-card__name"' + ed('ceremonies.' + i + '.name', { placeholder: c.custom ? 'Ceremony name' : 'Ceremony' }) + '>' + esc(name) + '</h3>' +
      '<div class="ryc-card__foot">' +
      '<div class="ryc-card__where">' +
      '<p class="ryc-card__venue"' + ed('ceremonies.' + i + '.venue', { placeholder: 'Venue' }) + '>' + esc(c.venue || '') + '</p>' +
      (map
        ? '<a class="ryc-card__map" href="' + esc(map) + '" target="_blank" rel="noopener" aria-label="' + esc(name) + ' venue on the map">' +
          '<img src="media/location.svg" alt="" aria-hidden="true" loading="lazy" decoding="async"></a>'
        : '') +
      '</div>' +
      // The time is optional: a ceremony with none simply shows its date,
      // and the field is left empty for a host who has not fixed one yet.
      '<p class="ryc-card__when">' +
      (editable
        ? '<span class="ry-cere-field"><input type="date" data-edit-input="ceremonies.' + i + '.date" value="' + esc(c.date || '') + '"></span>' +
          (c.time
            // A time already set: the field, plus an explicit way to take it off.
            // Clearing a native <input type="time"> is fiddly and browser-specific,
            // which made an optional field feel mandatory - the same reason
            // rose-invitation grew this pair.
            ? '<span class="ry-cere-field ry-cere-field--time"><input type="time" data-edit-input="ceremonies.' + i + '.time" value="' + esc(c.time) + '" title="Time (optional)">' +
              '<button type="button" class="ry-cere-time-x" data-action="ceremony-time-remove" data-index="' + i + '" title="Remove the time" aria-label="Remove the time">&times;</button></span>'
            : '<span class="ry-cere-field ry-cere-field--time"><button type="button" class="ry-cere-time-add" data-action="ceremony-time-add" data-index="' + i + '">+ Add time</button></span>')
        : '<span class="ryc-card__date">' + esc(RY.fmtDate(c.date)) + '</span>' +
          (RY.fmtTime(c.time) ? '<span class="ryc-card__time">' + esc(RY.fmtTime(c.time)) + '</span>' : '')) +
      '</p>' +
      '</div></div></article>';

    // The card and its panel travel together as one item of the grid, so the
    // panel stays under its own card in every layout.
    return editable ? '<div class="ryc-edit">' + card + ceremonyBelowHtml(c, i) + '</div>' : card;
  }

  /** The host's controls for one ceremony that have no place on the card. */
  function ceremonyBelowHtml(c, i) {
    // Says why an added card the host can see is not on the guests' copy.
    const hint = c.custom && !RY.ceremonyLive(c)
      ? '<p class="ry-cere-hint">Hidden from guests until it has a name and a photo</p>'
      : '';

    // The same zoom the wheel and a pinch give, for a host with neither -
    // and a way to change the photo that does not depend on a tap telling
    // itself apart from a drag.
    const zoom = c.custom && (c.art || '').trim()
      ? '<div class="ry-cere-photo"><span>Photo</span>' +
        '<button type="button" data-action="ceremony-zoom" data-dir="-1" data-index="' + i + '" title="Zoom out" aria-label="Zoom out">&minus;</button>' +
        '<button type="button" data-action="ceremony-zoom" data-dir="1" data-index="' + i + '" title="Zoom in" aria-label="Zoom in">+</button>' +
        '<button type="button" data-action="ceremony-photo" data-index="' + i + '">Change photo</button>' +
        '</div>'
      : '';

    // The pin on the card searches for the venue on its own; this is for a
    // host who has the exact place and wants the pin to land on it.
    return '<div class="ry-cere-below">' + hint + zoom +
      '<label class="ry-cere-map"><span>Map link</span>' +
      '<input type="url" data-edit-input="ceremonies.' + i + '.mapUrl" value="' + esc(c.mapUrl || '') + '" ' +
      'placeholder="Paste a Google Maps link"></label>' +
      '</div>';
  }

  function renderCeremonies() {
    const grid = document.querySelector('.ryc-grid');
    if (!grid) return;

    const all = Array.isArray(cfg.ceremonies) ? cfg.ceremonies : [];
    // In the order they happen, for the host as much as the guest, so a
    // ceremony added for the first evening takes its place before the Haldi
    // rather than trailing after the Reception. Each card still edits its
    // own entry by its place in the stored array (all.indexOf).
    const list = RY.ceremoniesByDate(edit ? all : all.filter(RY.ceremonyLive));

    // A divider under every card but the last, as the design has it; the
    // three-across layout keeps only the ones between the rows (styles.css).
    let html = '';
    list.forEach((c, i) => {
      html += ceremonyHtml(c, all.indexOf(c));
      if (i < list.length - 1) {
        html += '<img class="ryc-divider' + ((i + 1) % 3 === 0 ? ' ryc-divider--row' : '') +
          '" src="media/divider2.png" alt="" aria-hidden="true" loading="lazy" decoding="async">';
      }
    });

    // The host's own ceremonies, up to the limit. editor.js enforces it; this
    // only decides whether the tile is drawn and what count it prints.
    const own = all.filter((c) => c.custom).length;
    if (edit && RY.canEdit('ceremonies') && own < RY.CUSTOM_CEREMONY_MAX) {
      html +=
        '<div class="ryc-add"><div class="ry-frame-add__box">' +
        '<p>Have another ceremony? Add it with your own photo (' + own + '/' + RY.CUSTOM_CEREMONY_MAX + ')</p>' +
        '<button type="button" data-action="ceremony-add">+ Add a ceremony</button>' +
        '</div></div>';
    }

    grid.innerHTML = html;
    frameImages(grid);
    // A name that wraps onto a second line comes down to fit on one, within
    // limits (_platform/fit-text.js).
    if (window.BalconyFitText) window.BalconyFitText.fit('.ryc-card__name');
  }

  // ---- The compliments and the note --------------------------------------
  function renderCompliments() {
    const card = $('ryComplimentCard');
    if (!applyCardState('compliments', cfg.compliments, card)) return;

    editable($('ryComplimentLead'), 'compliments.lead', cfg.compliments.lead, { placeholder: 'With Best Compliments From:' });

    const box = $('ryComplimentLines');
    if (!box) return;
    const lines = Array.isArray(cfg.compliments.lines) ? cfg.compliments.lines : [];
    const live = edit ? lines : lines.filter((l) => (l || '').trim());
    box.innerHTML = live.map((line, i) => (
      '<p class="royale-scroll__line">' +
      '<span' + ed('compliments.lines.' + i, { placeholder: 'Family name' }) + '>' + esc(line || '') + '</span>' +
      (edit && RY.canEdit('compliments.lines')
        ? '<button type="button" class="ry-line-x" data-action="compliment-line-remove" data-index="' + i + '" aria-label="Remove line">✕</button>'
        : '') +
      '</p>'
    )).join('');

    if (edit && RY.canEdit('compliments.lines') && !card.querySelector('.ry-line-add')) {
      box.insertAdjacentHTML('afterend',
        '<button type="button" class="ry-line-add" data-action="compliment-line-add">+ Add a line</button>');
    }
  }

  function renderNote() {
    const card = $('ryNoteCard');
    if (!applyCardState('note', cfg.note, card)) return;
    editable($('ryNoteLead'), 'note.lead', cfg.note.lead, { placeholder: 'A Note From Us' });
    editable($('ryNoteText'), 'note.text', cfg.note.text, { multiline: true, placeholder: 'Your message…' });
  }

  // ---- The closing board -------------------------------------------------
  function renderFarewell() {
    const names = document.querySelector('.royale-outro__names');
    if (names) {
      names.innerHTML = guestHtml();
      names.hidden = names.innerHTML === '';
    }
    editable(document.querySelector('.royale-outro__line'), 'farewell.line', cfg.farewell.line, { placeholder: 'Your closing line' });
  }

  // ---- Media row: the Instagram button ------------------------------------
  // The one removable icon in the row - locations and the calendar are derived
  // from the ceremonies, but not every couple has a page to share. Same
  // contract as applyCardState: guests never see a removed button, and the
  // host gets a remove chip on a live one and an "add it back" pill in its
  // place once it is off.
  function renderSocial() {
    const igBtn = document.getElementById('ryIgBtn');
    if (!igBtn) return;
    if (!cfg.social) cfg.social = { instagram: true, instagramUrl: '' };
    // Undefined counts as on - an invitation saved before this existed must
    // not silently lose the icon.
    const on = cfg.social.instagram !== false;
    const canEdit = edit && RY.canEdit('social');

    igBtn.hidden = !on;
    if (!canEdit) return;

    // Wrapped once, so the chip can pin to the icon's corner. The wrap adds no
    // layout of its own, so the row spaces the same with or without it.
    let wrap = igBtn.parentElement.classList.contains('ry-social-wrap')
      ? igBtn.parentElement
      : null;
    if (!wrap) {
      wrap = document.createElement('span');
      wrap.className = 'ry-social-wrap';
      igBtn.replaceWith(wrap);
      wrap.appendChild(igBtn);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'ry-chip ry-chip--social';
      chip.dataset.action = 'social-remove';
      chip.setAttribute('aria-label', 'Remove the Instagram button');
      chip.title = 'Remove Instagram';
      chip.innerHTML = '&times;';
      wrap.appendChild(chip);

      const restore = document.createElement('button');
      restore.type = 'button';
      restore.className = 'ry-slot__btn ry-social-restore';
      restore.dataset.action = 'social-restore';
      restore.textContent = '+ Add Instagram';
      wrap.appendChild(restore);
    }
    wrap.querySelector('.ry-chip--social').hidden = !on;
    wrap.querySelector('.ry-social-restore').hidden = on;
  }

  function renderAll() {
    renderNames();
    renderGateCard();
    renderFamilies();
    renderDate();
    renderGallery();
    renderCeremonies();
    renderCompliments();
    renderNote();
    renderSocial();
    renderFarewell();
  }

  // editor.js re-frames a picture on every step of a drag or a pinch.
  RY.frameImage = frameImage;

  RY.render = {
    all: renderAll,
    names: renderNames,
    gateCard: renderGateCard,
    invocation: renderInvocation,
    families: renderFamilies,
    date: renderDate,
    gallery: renderGallery,
    ceremonies: renderCeremonies,
    compliments: renderCompliments,
    note: renderNote,
    social: renderSocial,
    farewell: renderFarewell,
  };

  renderAll();
})();
