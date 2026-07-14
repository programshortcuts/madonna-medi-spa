// video-controls.js -web-dev-simp-repo
/* =========================
   VIDEO CONTROLS (CLEAN SYSTEM)
========================= */

export function initAllVideos(root = document) {
    const sections = root.querySelectorAll('.section');

    console.log("VIDEO INIT SECTIONS:", sections.length);

    sections.forEach(bindVideoControls);
}

function bindVideoControls(step) {
    step.tabIndex = 0;

    const vid = step.querySelector('video');

    if (!vid) return;

    // prevent double binding
    if (step.dataset.videoBound === 'true') return;
    step.dataset.videoBound = 'true';

    const playBtn = step.querySelector('.playbtn');
    const fwdBtn = step.querySelector('.fwdBtn');
    const rwdBtn = step.querySelector('.rwdBtn');

    vid.addEventListener('ended', () => {
        resetVideoToPoster(vid);
    });

    vid.addEventListener('play', () => {
        pauseAllVideos(document, vid);
    });

    vid.addEventListener('timeupdate', () => {
        ensurePosterAtStart(vid, playBtn);
    });

    vid.addEventListener('seeked', () => {
        ensurePosterAtStart(vid, playBtn);
    });
    /* =========================
       PLAY / PAUSE
    ========================= */
    // playBtn?.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const wasPlaying = !vid.paused;

    //     pauseAllVideos(document, vid);

    //     if (wasPlaying) {
    //         vid.pause();
    //         return;
    //     }

    //     vid.play()?.catch(() => {});
    // });
    /* =========================
       FORWARD
    ========================= */
    // fwdBtn?.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     vid.currentTime = Math.min(
    //         vid.duration || Infinity,
    //         vid.currentTime + 5
    //     );
    // });
    /* =========================
       REWIND
    ========================= */
    // rwdBtn?.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const nextTime = Math.max(0, vid.currentTime - 0.5);
    //     vid.currentTime = nextTime;

    //     if (nextTime <= 0.05) {
    //         resetVideoToPoster(vid);
    //     }
    // });

    /* =========================
       KEYBOARD CONTROLS (STEP ONLY)
    ========================= */
    step.addEventListener('keydown', (e) => {
        console.log("SECTION KEYDOWN", e.target, e.key);

        if (e.target.closest('.vid-cntrl-btns, .playbtn, .fwdBtn, .rwdBtn')) return;

        const key = e.key.toLowerCase();
        console.log(key)
        if (key === ' ') {
            e.preventDefault();
            console.log("PLAYING VIDEO", vid);

            togglePlay(vid);
            return;
        }
    });
}

/* =========================
   HELPERS
========================= */

function togglePlay(vid) {
    if (vid.paused) vid.play();
    else vid.pause();
}



function resetVideoToPoster(vid) {
    if (!vid) return;

    try {
        const wasPlaying = !vid.paused;
        vid.pause();
        vid.currentTime = 0;
        vid.load();
        if (wasPlaying) {
            vid.pause();
        }
    } catch (error) {
        // ignore reset errors
    }
}

function ensurePosterAtStart(vid, btn) {
    if (!vid || vid.dataset.posterResetting === 'true') return;

    if (vid.paused && vid.currentTime <= 0.05 && !vid.ended) {
        vid.dataset.posterResetting = 'true';
        resetVideoToPoster(vid);

        setTimeout(() => {
            delete vid.dataset.posterResetting;
        }, 100);
    }
}

/* =========================
   GLOBAL SAFETY PAUSE
========================= */

export function pauseAllVideos(root = document, keepVideo = null) {
    const vids = root.querySelectorAll('video');

    vids.forEach((vid) => {
        if (vid === keepVideo) {
            return;
        }

        resetVideoToPoster(vid);

        const step = vid.closest('.section');
        const btn = step?.querySelector('.playbtn');

    });
}