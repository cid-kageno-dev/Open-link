// --- 1. INITIAL LOAD: Read URL Parameters ---
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    
    if(params.has('name')) {
        const name = params.get('name');
        document.getElementById('display-name').innerText = name;
        document.getElementById('entry-title').innerText = `Surprise for ${name}!`;
    }
    
    if(params.has('note')) {
        document.getElementById('display-note').innerText = params.get('note');
    }
    
    if(params.has('emoji')) {
        document.getElementById('display-emoji').innerText = params.get('emoji');
    }
});

// --- 2. EDITOR LOGIC ---
function toggleEditor(show) {
    const ui = document.getElementById('creator-ui');
    const stage = document.getElementById('main-stage');
    
    ui.style.display = show ? 'flex' : 'none';
    
    if(show) {
        stage.style.display = 'flex';
        stage.style.opacity = '1';
        stage.style.transform = 'scale(0.7)'; // Shrink card to fit behind editor
    } else {
        stage.style.transform = 'scale(1)';
    }
}

function liveUpdate() {
    const name = document.getElementById('edit-name').value;
    const note = document.getElementById('edit-note').value;
    const emoji = document.getElementById('edit-emoji').value;
    
    if(name) document.getElementById('display-name').innerText = name;
    if(note) document.getElementById('display-note').innerText = note;
    if(emoji) document.getElementById('display-emoji').innerText = emoji;

    // Visual feedback that card updated
    const card = document.getElementById('birthday-card');
    card.classList.remove('update-pulse');
    void card.offsetWidth; // Trigger Reflow
    card.classList.add('update-pulse');
}

function copyLink() {
    const name = encodeURIComponent(document.getElementById('edit-name').value);
    const note = encodeURIComponent(document.getElementById('edit-note').value);
    const emoji = encodeURIComponent(document.getElementById('edit-emoji').value);
    
    // Construct the magic link
    const link = `${window.location.origin}${window.location.pathname}?name=${name}&note=${note}&emoji=${emoji}`;
    
    navigator.clipboard.writeText(link).then(() => {
        const status = document.getElementById('copy-status');
        status.innerText = "✅ Link copied! Send it to your friend.";
        setTimeout(() => status.innerText = "", 3000);
    });
}

// --- 3. CORE PAGE ANIMATIONS ---
function startParty() {
    const entry = document.getElementById('entry-screen');
    const stage = document.getElementById('main-stage');
    
    entry.style.opacity = 0;
    setTimeout(() => {
        entry.style.display = 'none';
        stage.style.display = 'flex';
        setTimeout(() => stage.style.opacity = 1, 50);
        initConfetti();
    }, 800);
}

function flipCard() {
    document.getElementById('birthday-card').classList.toggle('is-flipped');
}

// --- 4. CONFETTI SYSTEM ---
let particles = [];
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for(let i=0; i<100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            v: Math.random() * 3 + 2,
            s: Math.random() * 5 + 2,
            c: `hsl(${Math.random() * 360}, 70%, 60%)`
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.y += p.v;
            if(p.y > canvas.height) p.y = -10;
            ctx.fillStyle = p.c;
            ctx.fillRect(p.x, p.y, p.s, p.s);
        });
        requestAnimationFrame(render);
    }
    render();
}
