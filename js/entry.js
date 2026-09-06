// Classic loader: file:// cannot load ES modules. Both modes use the same source code.
(() => {
  const script = document.createElement('script');
  const local = location.protocol === 'file:';
  script.src = new URL(local ? './local-preview.js' : './app.js', document.currentScript.src).href;
  if (!local) {
    script.type = 'module';
    const font = document.createElement('link');
    font.rel = 'preload';
    font.href = 'assets/fonts/Inter.ttf';
    font.as = 'font';
    font.type = 'font/ttf';
    font.crossOrigin = 'anonymous';
    document.head.append(font);
  }
  document.head.append(script);
})();
