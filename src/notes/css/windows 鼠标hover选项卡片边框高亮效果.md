---
Created At: 2025/1/23 16:16:59
Updated At: 2025/1/23 16:16:59
File Name: windows 鼠标hover选项卡片边框高亮效果
---

# windows 鼠标hover选项卡片边框高亮效果（待改进）

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      background: #000;
    }
    .card-wrap {
      display: grid;
      margin: 0 auto;
      width: 90%;
      margin-top: 1em;
      color: #f0f0f0;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      text-align: center;
    }
    .card {
      aspect-ratio: 4/3;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, .1);
      position: relative;
      overflow: hidden;
    }
    .card .inner {
      position: absolute;
      inset: 2px;
      background-color: #222;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3;
    }
    .card::before {
      content: "";
      position: absolute;
      z-index: 2;
      top: 0;
      left: 0;
      inset: 0;
      background: radial-gradient(closest-side circle, rgba(255, 255, 255, 0.6) 0%, transparent);
      border-radius: inherit;
      transform: translate(var(--x, -1000px), var(--y, -1000px));
    }
  </style>
</head>
<body>
  <div class="card-wrap">
    <div class="card">
      <div class="inner">wish you every success</div>
    </div>
    <div class="card">
      <div class="inner">wish you every success</div>
    </div>
    <div class="card">
      <div class="inner">wish you every success</div>
    </div>
    <div class="card">
      <div class="inner">wish you every success</div>
    </div>
    <div class="card">
      <div class="inner">wish you every success</div>
    </div>
    <div class="card">
      <div class="inner">wish you every success</div>
    </div>
  </div>

  <script>
    const cardWrapEl = document.querySelector(".card-wrap")
    const cardEls = document.querySelectorAll(".card")

    cardWrapEl.onmousemove = function (e) {
      for (const card of cardEls) {
        // getBoundingClientRect提供了元素的大小及其相对于视口的位置。
        const react = card.getBoundingClientRect()
        const x = e.clientX - react.left - react.width / 2
        const y = e.clientY - react.top - react.height / 2
        card.style.setProperty('--x', `${x}px`)
        card.style.setProperty('--y', `${y}px`)
      }
    }
  </script>
</body>
</html>

```
