const audio = document.getElementById('audio');
const bigPlay = document.getElementById('bigPlay');
const feed = document.getElementById('feed');
const hint = document.getElementById('hint');
const timeEl = document.getElementById('time');

let feedShown = false;

/**
 * 信息流数据
 * text / ip / date 均可省略
 */
const posts = [
  {
    img: './img/1.jpg',
    text: '高考完收书那天',
    ip: '广州',
    date: '2025.6.10'
  },
  {
    img: './img/2.jpg',
    text:'喵'
  },
  {
    img: './img/3.jpg',
    text: '今天路过一家咖啡店'
  }
];

/* ===== 时间格式 ===== */
function formatTime(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ===== 预加载图片 ===== */
function preloadImages(list) {
  return Promise.all(
    list.map(item => {
      return new Promise(resolve => {
        const img = new Image();
        img.src = item.img;
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}

/* ===== 创建单条 ===== */
function createPost(data, index) {
  const post = document.createElement('div');
  post.className = 'post';

  const id = String(index + 1).padStart(3, '0');

  const idLine = document.createElement('div');
  idLine.className = 'post-id';
  idLine.textContent = `毛线团 ${id} 号`;
  post.appendChild(idLine);

  if (data.text) {
    const text = document.createElement('div');
    text.className = 'post-text';
    text.textContent = data.text;
    post.appendChild(text);
  }

  const img = document.createElement('img');
  img.src = data.img;
  post.appendChild(img);

  if (data.ip || data.date) {
    const meta = document.createElement('div');
    meta.className = 'post-meta';

    if (data.ip) {
      const span = document.createElement('span');
      span.textContent = `IP：${data.ip}`;
      meta.appendChild(span);
    }

    if (data.date) {
      const span = document.createElement('span');
      span.textContent = `时间：${data.date}`;
      meta.appendChild(span);
    }

    post.appendChild(meta);
  }

  return post;
}

/* ===== 播放 / 暂停 ===== */
bigPlay.addEventListener('click', async () => {
  if (audio.paused) {
    await audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener('play', () => {
  bigPlay.textContent = '❚❚';
  hint.textContent = '正在播放…';
});

audio.addEventListener('pause', () => {
  bigPlay.textContent = '▶';
  hint.textContent = '点击可再次播放';
});

/* ===== 更新时间 ===== */
audio.addEventListener('timeupdate', () => {
  timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

/* ===== 播放结束 → 每 1 秒一条 ===== */
audio.addEventListener('ended', async () => {
  bigPlay.textContent = '▶';
  hint.textContent = '你可以再听一遍';

  if (feedShown) return;
  feedShown = true;

  await preloadImages(posts);
  feed.classList.remove('hidden');

  let index = 0;
  const timer = setInterval(() => {
    if (index >= posts.length) {
      clearInterval(timer);
      return;
    }

    const post = createPost(posts[index], index);
    feed.appendChild(post);

    requestAnimationFrame(() => {
      post.classList.add('show');
    });

    index++;
  }, 500);
});
