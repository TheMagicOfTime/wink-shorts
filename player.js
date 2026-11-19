'use strict';

const feed = document.querySelector('#feed');
const template = document.querySelector('#clip');
const panel = document.querySelector('#panel');
const shareDialog = document.querySelector('#share-dialog');
const clips = window.WINK_CLIPS;
const prefs = 'wink-shorts-fisher.';
const read = key => { try { return localStorage.getItem(prefs + key); } catch { return null; } };
const save = (key, value) => { try { localStorage.setItem(prefs + key, value); } catch {} };
let muted = read('sound') !== 'on';
let volume = Number(read('volume') ?? 0.8);
if (!(volume > 0 && volume <= 1)) volume = 0.8;
let active = -1;
let pausedForComments = null;
let pausedForShare = null;
const icon = (button, name, label) => {
  button.querySelector('use').setAttribute('href', '#' + name);
  button.setAttribute('aria-label', label);
};
function soundUI(row) {
  const video = row.querySelector('video');
  video.muted = muted;
  video.volume = volume;
  icon(row.querySelector('.sound'), muted ? 'muted' : 'sound', muted ? 'Включить звук' : 'Выключить звук');
  row.querySelector('.volume').value = muted ? 0 : volume;
}
function updateSound() {
  save('sound', muted ? 'off' : 'on');
  save('volume', volume);
  rows.forEach(soundUI);
}
function shareBox(clip) {
  const url = new URL(location.href);
  url.hash = 'video=' + clip.id;
  const field = document.createElement('input');
  field.readOnly = true;
  field.value = url.href;
  field.setAttribute('aria-label', 'Ссылка на ролик');
  const copy = document.createElement('button');
  copy.className = 'copy';
  copy.textContent = 'Скопировать ссылку';
  const status = document.createElement('p');
  status.className = 'panel-note';
  status.setAttribute('role', 'status');
  copy.onclick = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(field.value);
      copied = true;
    } catch {
      field.focus();
      field.select();
      try { copied = document.execCommand('copy'); } catch {}
    }
    status.textContent = copied ? 'Ссылка скопирована' : 'Выделенная ссылка готова к копированию.';
  };
  document.querySelector('#share-content').replaceChildren(field, copy, status);
}
function openComments(clip, video) {
  if (panel.open) {
    document.querySelector('#panel-title').focus({preventScroll:true});
    return;
  }
  pausedForComments = video.paused ? null : video;
  video.pause();
  winkComments.open(clip);
  panel.show();
  positionDrawer(video);
}
function closeComments() {
  panel.close();
  if (active >= 0) {
    rows[active].querySelector('.comments').focus({preventScroll:true});
    if (pausedForComments === rows[active].querySelector('video')) start(pausedForComments);
  }
  pausedForComments = null;
}
function openShare(clip, video) {
  pausedForShare = video.paused ? null : video;
  video.pause();
  shareBox(clip);
  shareDialog.showModal();
}
function positionDrawer(video) {
  const edge = video.getBoundingClientRect().right;
  const room = window.innerWidth - edge;
  // Keep the requested gap when there is space for a readable comments column.
  const alongside = room >= 360;
  panel.style.setProperty('--video-edge', edge + 'px');
  panel.classList.toggle('alongside', alongside);
}
window.addEventListener('resize', () => {
  if (panel.open && panel.classList.contains('drawer') && active >= 0)
    positionDrawer(rows[active].querySelector('video'));
});
document.querySelector('#close-panel').onclick = closeComments;
shareDialog.querySelector('.close-share').onclick = () => shareDialog.close();
shareDialog.addEventListener('click', event => {
  const rect = shareDialog.getBoundingClientRect();
  if (event.target === shareDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) shareDialog.close();
});
shareDialog.addEventListener('close', () => {
  if (active >= 0 && pausedForShare === rows[active].querySelector('video')) start(pausedForShare);
  pausedForShare = null;
});
function start(video) {
  video.play().catch(() => {}); // Browser policies can require a tap on the play control.
}
function setupLike(row, clip) {
  const button = row.querySelector('.like');
  const key = 'like.' + clip.id;
  function display(liked) {
    button.setAttribute('aria-pressed', String(liked));
    button.querySelector('.count').textContent = (clip.likes + Number(liked)).toLocaleString('ru-RU');
  }
  display(read(key) === 'yes');
  button.onclick = () => {
    const liked = button.getAttribute('aria-pressed') !== 'true';
    display(liked);
    save(key, liked ? 'yes' : 'no');
  };
}
const rows = clips.map((clip, i) => {
  const row = template.content.firstElementChild.cloneNode(true);
  const video = row.querySelector('video');
  row.id = 'video-' + clip.id;
  row.querySelector('h2').textContent = clip.title;
  row.setAttribute('aria-label', clip.title);
  video.setAttribute('aria-label', clip.title);
  const play = row.querySelector('.play');
  const seek = row.querySelector('.seek');
  const retry = row.querySelector('.retry');
  const toggle = () => {
    pausedForComments = null;
    if (video.paused) start(video);
    else video.pause();
  };
  play.onclick = toggle;
  video.onclick = toggle;
  video.addEventListener('play', () => {
    if (i !== active) return video.pause();
    icon(play, 'pause', 'Приостановить');
  });
  video.addEventListener('pause', () => icon(play, 'play', 'Воспроизвести'));
  video.addEventListener('error', () => { if (video.hasAttribute('src')) retry.hidden = false; });
  video.addEventListener('loadeddata', () => { retry.hidden = true; });
  retry.onclick = () => { video.src = clip.src; start(video); };
  video.addEventListener('loadedmetadata', () => { if (Number.isFinite(video.duration)) seek.max = video.duration; });
  video.addEventListener('timeupdate', () => {
    if (!Number.isFinite(video.duration)) return;
    seek.value = video.currentTime;
    seek.style.setProperty('--p', (video.currentTime / video.duration * 100) + '%');
  });
  seek.oninput = () => {
    if (Number.isFinite(video.duration)) video.currentTime = Number(seek.value);
    seek.style.setProperty('--p', (seek.value / seek.max * 100) + '%');
  };
  row.querySelector('.sound').onclick = () => { muted = !muted; updateSound(); };
  row.querySelector('.volume').oninput = event => {
    const next = Number(event.target.value);
    muted = next === 0;
    if (!muted) volume = next;
    updateSound();
  };
  soundUI(row);
  row.querySelector('.expand').onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (row.querySelector('.stage').requestFullscreen) await row.querySelector('.stage').requestFullscreen();
      else video.webkitEnterFullscreen?.();
    } catch {}
  };
  setupLike(row, clip);
  row.querySelector('.comments .count').textContent = winkComments.count(clip);
  row.querySelector('.comments').onclick = () => openComments(clip, video);
  row.querySelector('.share').onclick = () => openShare(clip, video);
  feed.append(row);
  return row;
});
function activate(index) {
  if (index === active || !rows[index]) return;
  active = index;
  rows.forEach((row, i) => {
    const video = row.querySelector('video');
    if (i !== index) video.pause();
    if (Math.abs(i - index) <= 1 && !video.hasAttribute('src')) {
      video.preload = i === index ? 'auto' : 'metadata';
      video.src = clips[i].src;
    } else if (Math.abs(i - index) > 1 && video.hasAttribute('src')) {
      video.removeAttribute('src');
      video.load();
    }
  });
  const video = rows[index].querySelector('video');
  if (panel.open) {
    pausedForComments = null;
    winkComments.open(clips[index], true);
    positionDrawer(video);
  }
  if (!shareDialog.open) start(video);
}
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
function go(index, animate = false) {
  const next = Math.max(0, Math.min(rows.length - 1, index));
  const smooth = animate && !reduceMotion.matches;
  feed.scrollTo({top: next * feed.clientHeight, behavior: smooth ? 'smooth' : 'instant'});
  if (!smooth) activate(next);
}
function step(direction) {
  go(Math.round(feed.scrollTop / feed.clientHeight) + direction, true);
}
// The phone drawer leaves a short strip of video available for a swipe.
let swipeStart = null;
feed.addEventListener('touchstart', event => {
  swipeStart = panel.open && matchMedia('(max-width:620px)').matches &&
    event.target.matches('video') && event.touches.length === 1 ? event.touches[0] : null;
}, {passive:true});
feed.addEventListener('touchcancel', () => { swipeStart = null; });
feed.addEventListener('touchend', event => {
  const start = swipeStart;
  swipeStart = null;
  if (!start || !panel.open || event.touches.length) return;
  const end = event.changedTouches[0];
  const dy = end.clientY - start.clientY;
  if (Math.abs(dy) < 35 || Math.abs(dy) <= Math.abs(end.clientX - start.clientX)) return;
  event.preventDefault();
  step(dy < 0 ? 1 : -1);
}, {passive:false});
// Wheel bursts include trackpad inertia. Page once and let the scroll settle.
let wheelDistance = 0;
let wheelUsed = false;
let wheelDirection = 0;
let wheelIdle;
feed.addEventListener('wheel', event => {
  if (event.ctrlKey || shareDialog.open || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  event.preventDefault();
  const direction = Math.sign(event.deltaY);
  if (direction !== wheelDirection) {
    wheelDistance = 0;
    wheelUsed = false;
    wheelDirection = direction;
  }
  clearTimeout(wheelIdle);
  wheelIdle = setTimeout(() => { wheelDistance = 0; wheelUsed = false; }, 170);
  if (wheelUsed) return;
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? feed.clientHeight : 1;
  wheelDistance += Math.abs(event.deltaY) * unit;
  if (wheelDistance >= 18) {
    wheelUsed = true;
    step(direction);
  }
}, {passive:false});
function fromHash() {
  const id = new URLSearchParams(location.hash.slice(1)).get('video');
  go(Math.max(0, clips.findIndex(clip => clip.id === id)));
}
let scheduled = false;
feed.addEventListener('scroll', () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    activate(Math.round(feed.scrollTop / feed.clientHeight));
  });
}, {passive:true});
window.addEventListener('hashchange', fromHash);
document.querySelector('.brand').onclick = event => {
  event.preventDefault();
  if (location.hash) location.hash = 'top';
  go(0);
};
document.addEventListener('keydown', event => {
  if (shareDialog.open || event.defaultPrevented) return;
  if (event.key === 'Escape' && panel.open) {
    event.preventDefault();
    closeComments();
    return;
  }
  if (event.target.matches('input,textarea,select') || event.altKey || event.ctrlKey || event.metaKey) return;
  const delta = {ArrowDown:1,PageDown:1,j:1,ArrowUp:-1,PageUp:-1,k:-1}[event.key];
  if (delta) { event.preventDefault(); if (!event.repeat) step(delta); }
  if (event.code === 'Space' && !event.target.closest('button,a')) { event.preventDefault(); rows[active]?.querySelector('.play').click(); }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && active >= 0) rows[active].querySelector('video').pause();
});
fromHash();
