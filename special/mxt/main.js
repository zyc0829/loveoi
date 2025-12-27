/* =====================
   DOM 获取（全部判空）
===================== */

const audio = document.getElementById('audio');
const bigPlay = document.getElementById('bigPlay');
const feed = document.getElementById('feed');
const hint = document.getElementById('hint');
const timeEl = document.getElementById('time');

/* =====================
   状态控制
===================== */

let feedShown = false;
let imagesReady = false;

/* =====================
   信息流数据
===================== */

const posts = [
  {
    img: './img/1.jpg',
    text: '高考完收书那天',
    ip: '广州',
    date: '2025.6.10'
  },
  {
    img: './img/2.jpg',
    text:'穆老师穆老师 我今天也在好好学习哦',
	ip:'珠海',
	date :'2025.12.1'
  },
  {
    img: './img/3.jpg',
    text: '坐飞机好累好无聊喔 但是偶尔也有好风景啦 下次买个好点的降噪耳机就可以听广播剧咯',
    date:'2025.8.17'
  },
  {
    img:'./img/4.jpg',
    text:'暑假参加完穆老师线下后和小伙伴去贵州玩的时候拍到了完整的大彩虹🌈',
    ip:'贵州',
  },
  {
    img:'./img/5.jpg',
    text:'看浪潮，起心潮',
    ip:'白滨',
    date:'2024.1.27'
  },
  {
    img:'./img/6.jpg',
    text:'裁一段星河送给你，好叫你不逊色这漫天烟火',
  },
  {
    img:'./img/7.jpg',
    text:'这是我第一次为了线下减肥塞下这条裙子拍的照片，背景很杂乱不好意思哈哈哈',
    date:'2025.11.28'
  },
  {
    img:'./img/8.jpg',
    text:'派我家小狗出场——见小狗者得好运！三只小狗三倍好运～希望穆老师新的一年顺顺利利，平安喜乐！',
    ip:'福州',
    date:'2025.12.27'
  },
];

/* =====================
   工具函数
===================== */

// 时间格式化
function formatTime(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 图片预加载
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

// 创建单条信息流
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
      span.textContent = `日期：${data.date}`;
      meta.appendChild(span);
    }

    post.appendChild(meta);
  }

  return post;
}

/* =====================
   页面加载即开始预加载图片
===================== */

preloadImages(posts).then(() => {
  imagesReady = true;
});

/* =====================
   iOS 音频解锁（关键）
===================== */

document.addEventListener('touchstart', function unlockAudio() {
  if (!audio) return;
  audio.play().then(() => {
    audio.pause();
  }).catch(() => {});
  document.removeEventListener('touchstart', unlockAudio);
});

/* =====================
   播放控制（click + touch）
===================== */

function togglePlay() {
  if (!audio) return;

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

if (bigPlay) {
  bigPlay.addEventListener('touchstart', function (e) {
    e.preventDefault();   // 关键：阻止 click 合成
    togglePlay();
  });
}


/* =====================
   播放状态反馈
===================== */

if (audio) {

  audio.addEventListener('play', () => {
    if (bigPlay) bigPlay.textContent = '❚❚';
    if (hint) hint.textContent = '正在播放…';
  });

  audio.addEventListener('pause', () => {
    if (bigPlay) bigPlay.textContent = '▶';
    if (hint) hint.textContent = '点击可再次播放';
  });

  audio.addEventListener('timeupdate', () => {
    if (!timeEl) return;
    timeEl.textContent =
      `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  });

  audio.addEventListener('ended', () => {
    if (bigPlay) bigPlay.textContent = '▶';
    if (hint) hint.textContent = '小惊喜主题：想和你分享的某个瞬间~';

    if (feedShown) return;
    feedShown = true;

    if (!feed) return;
    feed.classList.remove('hidden');

    posts.forEach((item, index) => {
      const post = createPost(item, index);
      feed.appendChild(post);

      requestAnimationFrame(() => {
        post.classList.add('show');
      });
    });
  });
}

