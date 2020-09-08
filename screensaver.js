(function () {
  const currentScript = document.currentScript;
  window.addEventListener(
    'load',
    function () {
      const id = `s${Date.now()}`;
      const el = document.body.appendChild(document.createElement('div'));
      el.id = id;
      el.style.position = 'fixed';

      el.className = 'Screensaver';
      el.innerHTML = `<div>${(currentScript && currentScript.getAttribute('message')) || window.location.hostname}</div>`;

      

      const style = document.body.appendChild(document.createElement('style'));
      const stylesAttribute = currentScript ? JSON.parse(currentScript.getAttribute('styles').replace(/\s+/g, '').replace(/['`]/g, '"').replace(/,}$/g, '}')) : {};
      const styles = Object.keys(stylesAttribute).map(k => `${k}: ${stylesAttribute[k]};`).join('\n');

      style.textContent = `
        #${id} {
          left: 0; top: 0; right: 0; bottom: 0;
          z-index: 100000;
          background-color: #000;
          color: #eee;
          box-shadow: 0 0 0 100000px #000;
        }

        #${id},
        #${id} div {
          line-height: 1;
        }

        #${id} {
          animation: x${id} 13s linear infinite alternate;
        }

        #${id} div {
          animation: y${id} 7s linear infinite alternate;
          display: inline-block;
          ${styles}
        }
      `;

      const { width, height } = el.firstElementChild.getBoundingClientRect();
      
      const widthHeightDependantStyles = (id, width, height) => {
        return `
          #${id},
          #${id} div {
            width: ${width}px;
            height: ${height}px;
          }

          @keyframes x${id} {
            100% {
              transform: translateX(calc(100vw - ${width}px));
            }
          }

          @keyframes y${id} {
            100% {
              transform: translateY(calc(100vh - ${height}px));
            }
          }
        `;
      }

      style.textContent = `${style.textContent}\n${widthHeightDependantStyles(id, width, height)}`;

      let timeoutId = null;
      let timeout = (currentScript && Number(currentScript.getAttribute('timeout'))) || 180000;

      function disable() {
        el.style.display = 'none';
        timeoutId && clearTimeout(timeoutId);
        timeoutId = setTimeout(function () {
          el.style.display = 'block';
        }, timeout);
      }
      disable();
      document.addEventListener('mousemove', disable);
      document.addEventListener('keydown', disable);
    },
    { once: true }
  );
})();
