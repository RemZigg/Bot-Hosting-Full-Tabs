(() => {
  // Items that normally live in the "More" dropdown.
  const EXTRA_TABS = [
    { path: 'github',      label: 'GitHub' },
    { path: 'startup',     label: 'Startup' },
    { path: 'packages',    label: 'Packages' },
    { path: 'network',     label: 'Network' },
    { path: 'sftp',        label: 'SFTP' },
    { path: 'location',    label: 'Location' },
    { path: 'permissions', label: 'Sharing' }
  ];

  const MARK = 'data-bhx-tab';

  function getDeploymentId() {
    const m = location.pathname.match(/^\/a\/d\/([^/]+)/);
    return m ? m[1] : null;
  }

  function normalize(p) {
    return p.replace(/\/+$/, '');
  }

  function update() {
    const id = getDeploymentId();
    const nav = document.querySelector('nav.tabs[aria-label="Deployment"]');
    if (!id || !nav) return;

    // Use an existing native tab as a template so we inherit Svelte's scoped classes.
    const template = nav.querySelector(`a.tab:not([${MARK}])`);
    if (!template) return;

    const moreWrap = nav.querySelector('.more-wrap');
    const current = normalize(location.pathname);

    for (const item of EXTRA_TABS) {
      const href = `/a/d/${id}/${item.path}`;
      let a = nav.querySelector(`a[${MARK}="${item.path}"]`);

      if (!a) {
        a = template.cloneNode(false);
        a.setAttribute(MARK, item.path);
        a.textContent = item.label;
        a.classList.remove('on');
        a.removeAttribute('aria-current');
        if (moreWrap) nav.insertBefore(a, moreWrap);
        else nav.appendChild(a);
      }

      if (a.getAttribute('href') !== href) a.setAttribute('href', href);

      const active = current === href;
      a.classList.toggle('on', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
  }

  // The dashboard is a SvelteKit SPA: re-run whenever the DOM changes
  // (client-side navigation, re-renders that drop our injected tabs, etc.).
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      update();
    });
  };

  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  update();
})();
