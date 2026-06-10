// Theme toggle script – persists user choice in localStorage
(function() {
  const key = 'theme';
  const root = document.documentElement;
  const saved = localStorage.getItem(key);
  if (saved) {
    root.dataset.theme = saved;
  }
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', function() {
    const newTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = newTheme;
    localStorage.setItem(key, newTheme);
  });
})();
