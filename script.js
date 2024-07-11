var n, s, r, pos = new Array();
var solving = false;

function init() {
  var sb, nsb, ns, ss;
  
  sb = document.querySelector('#sol-btn');
  nsb = document.querySelector('#next-sol-btn');
  ns = document.querySelector('#num_sq');
  ss = document.querySelector('#size_sq');
  
  sb.addEventListener('click', newBoard);
  nsb.addEventListener('mousedown', function() {
    if (!solving) {
      solveWithBacktracking();
    }
  });
  ns.addEventListener('input', calcSize);
  ns.value = '4';
  calcSize();
  sb.style.borderRadius = sb.offsetHeight / 2 + "px";
  nsb.style.borderRadius = nsb.offsetHeight / 2 + "px";
  
  if (window.innerHeight > window.innerWidth) {
    sb.style.width = nsb.style.width = ns.style.width = ss.style.width = '20%';
    sb.style.margin = nsb.style.margin = ns.style.margin = ss.style.margin = '0.5%';
    nsb.innerHTML = 'Next<i class="fas fa-step-forward"></i>';
  }
  
  return;
}

function calcSize() {
  var num, size;
  num = parseInt(document.querySelector('#num_sq').value);
  
  if (window.innerHeight < window.innerWidth) {
    size = Math.round(window.innerHeight / num * 0.7);
  } else {
    size = Math.round(window.innerWidth / num * 0.85);
  }
  document.querySelector('#size_sq').value = size;
  
  return size;
}

function newBoard() {
  n = parseInt(document.querySelector('#num_sq').value);
  s = parseInt(document.querySelector('#size_sq').value);
  
  if (!n || n < 4) {
    alert("Number of queens should be at least 4.");
    document.querySelector('#num_sq').focus();
    return;
  }
  
  if (!s || isNaN(s)) {
    s = calcSize();
  }
  
  r = document.querySelector('#sol-num');
  r.textContent = '0';
  var d = document.querySelector('#chessboard');
  d.innerHTML = '<svg id="cnvs" width="' + n * s + '" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1"></svg>';
  var c = document.querySelector('#cnvs');
  var clrs = ['#FFCE9E', '#D18B47'];
  
  d.style.border = '5px solid black';
  d.style.height = n * s + "px";
  d.style.width = n * s + "px";
  
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n * s; j += 2 * s) {
      c.innerHTML += '<rect x="' + j + '" y="' + i * s + '" width="' + s + '" height="' + s + '" fill="' + clrs[i % 2] + '" />';
      c.innerHTML += '<rect x="' + (j + s) + '" y="' + i * s + '" width="' + s + '" height="' + s + '" fill="' + clrs[1 - i % 2] + '" />';
    }
  }
  
  for (var i = 0; i < n; i++) {
    d.insertAdjacentHTML('beforeend', '<img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg" height="' + s + '" id="q' + i + '" style="left: -' + s + 'px; top: ' + i * s + 'px;"/>');
  }
  
  for (var i = 0; i < n - 1; i++) {
    pos[i] = 0;
  }
  pos[n - 1] = -1;
  
  solve();
}

async function solveWithBacktracking() {
  solving = true;
  pos[n - 1]++;
  
  for (var i = 0; i < n; i++) {
    var safePos = false;
    for (var j = pos[i]; j < n; j++) {
      if (isSafe(i, j)) {
        pos[i] = j;
        safePos = true;
        await moveQueen(i, j);
        break;
      }
    }
    
    if (!safePos) {
      if (i == 0) {
        r.textContent = '0';
      }
      pos[i] = 0;
      if (i > 0) {
        pos[i - 1]++;
        i -= 2;
        await moveQueen(i + 1, -1);
      } else {
        await moveQueen(i, -1);
      }
    }
  }
  
  r.textContent = (parseInt(r.textContent) + 1).toString();
  solving = false;
}

async function moveQueen(row, col) {
  var queen = document.querySelector('#q' + row);
  if (col >= 0) {
    queen.style.left = col * s + 'px';
  } else {
    queen.style.left = '-100px';
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}

function isSafe(i, j) {
  if (i === 0) return true;
  
  for (var k = i - 1; k >= 0; k--) {
    if (pos[k] === j || Math.abs(pos[k] - j) === i - k) return false;
  }
  
  return true;
}

init();
