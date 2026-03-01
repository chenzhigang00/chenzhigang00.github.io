const canvas = document.getElementById('ascii-canvas');
const video = document.getElementById('bg-video');

if (!canvas || !video) {
    throw new Error('ASCII effect requires both #ascii-canvas and #bg-video.');
}

const ctx = canvas.getContext('2d');
const hiddenCanvas = document.createElement('canvas');
const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });

const baseChars = [' ', ' ', ' ', '.', '_', '-', '>', '~', 'o', '8', '%'];
const accentChars = ['{', '}', '>', '<', '/', '0', '8', '%', '_', '~'];
const isMobileLayout = window.matchMedia('(max-width: 768px)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let cols = 0;
let rows = 0;
let cellSize = 20;
let renderInterval = prefersReducedMotion ? 120 : isMobileLayout ? 90 : 60;
let trailField = [];
let frameTick = 0;
let lastRenderTime = 0;
let currentFont = '';
let lastPointerMoveAt = 0;
let animationFrameId = 0;
let overlayVisible = false;

let mouseX = -1000;
let mouseY = -1000;
let pmouseX = -1000;
let pmouseY = -1000;

function getCellSize() {
    if (prefersReducedMotion) return 28;
    if (window.innerWidth < 640) return 28;
    if (window.innerWidth < 1024) return 22;
    return 18;
}

function buildTrailField() {
    trailField = Array.from({ length: cols * rows }, () => ({
        force: 0,
        vx: 0,
        vy: 0
    }));
}

function resize() {
    cellSize = getCellSize();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / cellSize);
    rows = Math.ceil(canvas.height / cellSize);
    hiddenCanvas.width = cols;
    hiddenCanvas.height = rows;
    currentFont = `500 ${Math.max(9, Math.floor(cellSize * 0.58))}px "Inter", monospace`;
    buildTrailField();
}

function applyPointerForce(e) {
    pmouseX = mouseX;
    pmouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const mCol = mouseX / cellSize;
    const mRow = mouseY / cellSize;
    const pmCol = pmouseX / cellSize;
    const pmRow = pmouseY / cellSize;
    const radius = 4;
    const radiusSq = radius * radius;
    let moveX = mCol - pmCol;
    let moveY = mRow - pmRow;
    const movementSq = moveX * moveX + moveY * moveY;

    if (movementSq < 0.01) return;

    lastPointerMoveAt = performance.now();

    for (let y = Math.max(0, Math.floor(mRow - radius)); y < Math.min(rows, Math.ceil(mRow + radius)); y++) {
        for (let x = Math.max(0, Math.floor(mCol - radius)); x < Math.min(cols, Math.ceil(mCol + radius)); x++) {
            const dx = x - mCol;
            const dy = y - mRow;
            const distSq = dx * dx + dy * dy;

            if (distSq >= radiusSq) continue;

            const idx = y * cols + x;
            const dist = Math.sqrt(distSq);
            const power = 1 - dist / radius;
            const len = Math.sqrt(moveX * moveX + moveY * moveY) || 1;
            const cell = trailField[idx];

            cell.force = Math.min(1, cell.force + power * 0.7);
            cell.vx += (moveX / len) * power * 2.2;
            cell.vy += (moveY / len) * power * 2.2;
        }
    }
}

function renderFrame() {
    if (video.readyState < 2) return;

    hiddenCtx.fillStyle = '#000';
    hiddenCtx.fillRect(0, 0, cols, rows);

    const rect = video.getBoundingClientRect();
    const scX = cols / canvas.width;
    const scY = rows / canvas.height;

    hiddenCtx.drawImage(
        video,
        rect.left * scX,
        rect.top * scY,
        rect.width * scX,
        rect.height * scY
    );

    let imgData;
    try {
        imgData = hiddenCtx.getImageData(0, 0, cols, rows).data;
    } catch {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = currentFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    frameTick += 1;
    const pointerRecentlyMoved = performance.now() - lastPointerMoveAt < 120;
    const pointerCol = mouseX / cellSize;
    const pointerRow = mouseY / cellSize;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const idx = y * cols + x;
            const pixelIdx = idx * 4;
            const r = imgData[pixelIdx];
            const g = imgData[pixelIdx + 1];
            const b = imgData[pixelIdx + 2];
            const brightNorm = (r + g + b) / 765;
            const charIdx = Math.min(baseChars.length - 1, Math.floor(brightNorm * (baseChars.length - 1)));
            const cell = trailField[idx];

            cell.force *= pointerRecentlyMoved ? 0.88 : 0.72;
            cell.vx *= 0.82;
            cell.vy *= 0.82;

            let finalChar = baseChars[charIdx];
            const forceEffect = cell.force;
            const dx = x - pointerCol;
            const dy = y - pointerRow;
            const nearPointer = dx * dx + dy * dy < 36;

            if (pointerRecentlyMoved && nearPointer && forceEffect > 0.12) {
                const accentIndex = (idx + frameTick) % accentChars.length;
                if (((idx + frameTick) & 3) === 0) {
                    finalChar = accentChars[accentIndex];
                } else {
                    const bumpedIdx = Math.min(baseChars.length - 1, charIdx + Math.floor(forceEffect * 2));
                    finalChar = baseChars[bumpedIdx];
                }
            }

            if (finalChar === ' ' && forceEffect < 0.08) continue;

            const drawX = x * cellSize + cellSize / 2 + cell.vx * 2;
            const drawY = y * cellSize + cellSize / 2 + cell.vy * 2;
            const opacity = Math.min(0.9, Math.max(0.08, brightNorm * 0.55 + forceEffect * 0.7));

            if (forceEffect > 0.2) {
                const glowBoost = 90 * forceEffect;
                ctx.fillStyle = `rgba(${Math.min(255, r + glowBoost)}, ${Math.min(255, g + glowBoost)}, 255, ${opacity})`;
            } else {
                ctx.fillStyle = `rgba(${r}, ${g}, ${Math.min(255, b + 24)}, ${opacity})`;
            }

            ctx.fillText(finalChar, drawX, drawY);
        }
    }
}

function setOverlayVisible(visible) {
    if (overlayVisible === visible) return;
    overlayVisible = visible;
    canvas.style.opacity = visible ? '1' : '0';
}

function hasActiveTrail() {
    for (let i = 0; i < trailField.length; i++) {
        if (trailField[i].force > 0.03) return true;
    }
    return false;
}

function shouldAnimate() {
    if (document.hidden) return false;
    if (performance.now() - lastPointerMoveAt < 160) return true;
    return hasActiveTrail();
}

function stopAnimation() {
    if (!animationFrameId) return;
    cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
}

function animate(now) {
    animationFrameId = 0;

    if (!shouldAnimate()) {
        setOverlayVisible(false);
        return;
    }

    setOverlayVisible(true);
    if (now - lastRenderTime >= renderInterval) {
        lastRenderTime = now;
        renderFrame();
    }

    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (animationFrameId) return;
    animationFrameId = requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
window.addEventListener('pointermove', (e) => {
    applyPointerForce(e);
    startAnimation();
}, { passive: true });
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        setOverlayVisible(false);
        stopAnimation();
    }
});
video.addEventListener('loadeddata', () => {
    setOverlayVisible(false);
});

resize();
setOverlayVisible(false);
