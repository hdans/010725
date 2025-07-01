document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Inisialisasi AOS (Animate On Scroll) ---
    AOS.init({
        duration: 1200,
        once: true,
        offset: 100,
    });

    // --- 2. REVISI: Inisialisasi tsParticles pada setiap Canvas ---
    const particleOptions = {
        particles: {
            number: { value: 30, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.2, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 0.5, direction: "none", out_mode: "out" },
        },
        interactivity: {
            events: { onhover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
        },
    };
    
    document.querySelectorAll('.particle-canvas').forEach(canvas => {
        tsParticles.load({ element: canvas, options: particleOptions });
    });

    // --- 3. Logika Splash Screen ---
    const enterButton = document.getElementById('enter-button');
    const splashPage = document.getElementById('page-1');
    const mainContent = document.getElementById('main-content');

    enterButton.addEventListener('click', () => {
        splashPage.style.transition = 'opacity 0.8s ease-out';
        splashPage.style.opacity = '0';
        splashPage.addEventListener('transitionend', () => {
            splashPage.style.display = 'none';
            mainContent.style.display = 'block';
            document.body.style.overflow = 'auto';
            AOS.refresh();
            // Trigger observer untuk cek audio & bunga setelah konten tampil
            audioObserver.observe(document.getElementById('page-2'));
            flowerObserver.observe(document.getElementById('animated-flower'));
        }, { once: true });
    });

    // --- 4. Logika Audio Player ---
    const audio = document.getElementById('background-music');
    const audioControlButton = document.getElementById('audio-control-button');
    let isMusicPlaying = false;
    let hasAttemptedPlay = false;

    const audioObserver = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && !hasAttemptedPlay) {
            hasAttemptedPlay = true;
            try {
                await audio.play();
                isMusicPlaying = true;
                audioControlButton.textContent = 'Jeda';
                audioControlButton.classList.remove('hidden');
            } catch (error) {
                console.log('Autoplay diblokir, tampilkan tombol manual.');
                audioControlButton.classList.remove('hidden');
            }
        }
    }, { threshold: 0.5 });

    audioControlButton.addEventListener('click', () => {
        if (isMusicPlaying) {
            audio.pause();
            audioControlButton.textContent = 'Putar Musik';
        } else {
            audio.play();
            audioControlButton.textContent = 'Jeda';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // --- 5. REVISI: Logika Animasi Bunga Mekar & Idle ---
    const flower = document.getElementById('animated-flower');
    let hasBloomed = false;

    const flowerObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasBloomed) {
            // Tambahkan kelas untuk memulai animasi 'bloom'
            flower.classList.add('blooming');
            hasBloomed = true;
            
            // Dengarkan event saat animasi 'bloom' selesai
            flower.addEventListener('animationend', (event) => {
                // Pastikan event ini hanya untuk animasi bloom, bukan idle nanti
                if (event.animationName === 'bloom') {
                    // Hapus kelas blooming dan tambahkan kelas idle
                    flower.classList.remove('blooming');
                    flower.classList.add('idle');
                }
            }, { once: true }); // Hanya jalankan listener ini sekali
        }
    }, { threshold: 0.6 }); // Trigger saat 60% bunga terlihat
});