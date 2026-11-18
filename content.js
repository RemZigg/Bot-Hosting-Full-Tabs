(() => {
  // Fallback list, used only if the real links can't be read from the "More" menu.
  const FALLBACK_TABS = [
    { path: 'github',      label: 'GitHub' },
    { path: 'startup',     label: 'Startup' },
    { path: 'packages',    label: 'Packages' },
    { path: 'network',     label: 'Network' },
    { path: 'sftp',        label: 'SFTP' },
    { path: 'location',    label: 'Location' },
    { path: 'permissions', label: 'Sharing' }
  ];

  const MARK = 'data-bhx-tab';
  const NAV_SEL = 'nav.tabs[aria-label="Deployment"]';
  let harvested = null;   // [{href, label}] read from the real menu
  let harvesting = false;

  const norm = (p) => p.replace(/\/+$/, '');

  // Base path of the deployment = the first tab's (Console) path,
  // e.g. /dash/deployments/<id>  (older site: /a/d/<id>).
  function getBase(nav) {
    const first = nav.querySelector(`a.tab:not([${MARK}])`);
    if (!first) return null;
    try {
      return norm(new URL(first.getAttribute('href'), location.href).pathname);
    } catch (e) { return null; }
  }

  function currentItems(base) {
    if (harvested && harvested.length) return harvested;
    return FALLBACK_TABS.map((t) => ({ href: `${base}/${t.path}`, label: t.label }));
  }

  // Open the hidden "More" menu once, copy its links, close it again.
  function harvest(nav) {
    if (harvested || harvesting) return;
    const btn = nav.querySelector('button.tab.more, .more-wrap button');
    if (!btn) return;
    harvesting = true;
    btn.click();
    setTimeout(() => {
      const links = [...document.querySelectorAll('[role="menu"] a[href]')]
        .filter((a) => !a.hasAttribute(MARK) && !nav.contains(a) || a.closest('[role="menu"]'));
      const seen = new Set();
      const items = [];
      for (const a of links) {
        const label = a.textContent.trim();
        let href;
        try { href = new URL(a.getAttribute('href'), location.href).pathname; } catch (e) { continue; }
        if (!label || seen.has(href)) continue;
        seen.add(href);
        items.push({ href: norm(href), label });
      }
      if (btn.getAttribute('aria-expanded') === 'true') btn.click();
      if (items.length) harvested = items;
      harvesting = false;
      update();
    }, 150);
  }

  function update() {
    const nav = document.querySelector(NAV_SEL);
    if (!nav) return;
    const base = getBase(nav);
    if (!base) return;

    const template = nav.querySelector(`a.tab:not([${MARK}])`);
    const moreWrap = nav.querySelector('.more-wrap');
    const current = norm(location.pathname);
    const items = currentItems(base);

    // Remove stale injected tabs (e.g. after switching deployments).
    const wanted = new Set(items.map((i) => i.href));
    nav.querySelectorAll(`a[${MARK}]`).forEach((a) => {
      if (!wanted.has(a.getAttribute(MARK))) a.remove();
    });

    for (const item of items) {
      let a = nav.querySelector(`a[${MARK}="${CSS.escape(item.href)}"]`);
      if (!a) {
        a = template.cloneNode(false);
        a.setAttribute(MARK, item.href);
        a.textContent = item.label;
        a.classList.remove('on');
        a.removeAttribute('aria-current');
        if (moreWrap) nav.insertBefore(a, moreWrap);
        else nav.appendChild(a);
      }
      if (a.getAttribute('href') !== item.href) a.setAttribute('href', item.href);
      const active = current === item.href;
      a.classList.toggle('on', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }

    harvest(nav);
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; update(); });
  };

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
  update();
})();
