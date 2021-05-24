
window.onload = () => App();

function App() {

  const app = document.getElementById('app');
  const videoEl = document.createElement('video');
  const cvEl = document.createElement('canvas');
  const txtEl = document.createElement('div');

  const scale = 1;
  let timer = null;

  app.style.fontFamily = 'SimSun, serif';
  app.style.fontSize = '12px';
  app.style.textAlign = 'center';
  app.style.marginTop = '60px';

  videoEl.src = "badapple.mp4";
  videoEl.addEventListener('timeupdate', onVideoUpdate);
  videoEl.addEventListener('pause', onVideoPause);
  videoEl.controls = true;
  videoEl.volume = 1;

  txtEl.style.diplay = 'inline-block';

  app.append(videoEl);
  app.append(cvEl);
  app.append(txtEl);

  function onVideoUpdate() {
    cvEl.width = videoEl.videoWidth * scale;
    cvEl.height = videoEl.videoHeight * scale;
    txtEl.width = `${videoEl.videoWidth * scale}px`;
    txtEl.height = `${videoEl.videoHeight * scale}px`;
    onTick();
  }

  function onVideoPause() {
    cancelAnimationFrame(timer);
  }

  function onTick() {
    if (!videoEl.isPause) {
      timer = requestAnimationFrame(onTick);
      renderCanvas();
      renderText();
    }
  }

  function renderCanvas() {
    cvEl.getContext('2d').drawImage(videoEl, 0, 0, cvEl.width, cvEl.height);
  }

  function renderText() {
    const { data, width, height } = cvEl.getContext('2d').getImageData(0, 0, cvEl.width, cvEl.height);
    let pEls = '';
    for (let h = 0; h < height; h += 12) {
      let pEl = '';
      for (let w = 0; w < width; w += 6) {
        const index = (w + width * h) * 4; // *4 = (R,G,B,A)
        const gray = getGray(
          data[index],        // r
          data[index + 1],    // g
          data[index + 2]     // b
        );
        pEl += toText(gray);
      }
      pEl += '<br />';
      pEls += pEl;
    }
    txtEl.innerHTML = pEls;
  }

  function getGray(r, g, b) {
    return (r * 299 + g * 587 + b * 114) / 1000
  }

  function toText(g) {
    if (g <= 30) {
      return '#';
    } else if (g > 30 && g <= 60) {
      return '&';
    } else if (g > 60 && g <= 120) {
      return '$';
    } else if (g > 120 && g <= 150) {
      return '*';
    } else if (g > 150 && g <= 180) {
      return 'o';
    } else if (g > 180 && g <= 210) {
      return '!';
    } else if (g > 210 && g <= 240) {
      return ';';
    } else {
      return '.';
    }
  }
}

