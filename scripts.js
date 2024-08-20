document.addEventListener('DOMContentLoaded', function () {
    const announcementPlayer = document.getElementById('announcementPlayer');
    const musicPlayer = document.getElementById('musicPlayer');
    const announcementPlaylist = document.getElementById('announcementPlaylist');
    const musicPlaylist = document.getElementById('musicPlaylist');
    const announcementStatus = document.getElementById('announcementStatus');

    // Lista de anuncios con horarios en minutos y segundos
    const announcements = [
        { src: 'announcements/normas.wav', time: '10:58' },
        { src: 'announcements/normas.wav', time: '11:58' },
        { src: 'announcements/salida.wav', time: '11:59' },
        { src: 'announcements/normas.wav', time: '12:58' },
        { src: 'announcements/salida.wav', time: '12:59' },
        { src: 'announcements/normas.wav', time: '13:58' },
        { src: 'announcements/salida.wav', time: '13:59' },
        { src: 'announcements/normas.wav', time: '14:58' },
        { src: 'announcements/salida.wav', time: '14:59' },
        { src: 'announcements/normas.wav', time: '15:58' },
        { src: 'announcements/salida.wav', time: '15:59' },
        { src: 'announcements/normas.wav', time: '16:58' },
        { src: 'announcements/salida.wav', time: '16:59' },
        { src: 'announcements/normas.wav', time: '17:58' },
        { src: 'announcements/salida.wav', time: '17:59' },
        { src: 'announcements/normas.wav', time: '18:58' },
        { src: 'announcements/salida.wav', time: '18:59' },
        { src: 'announcements/normas.wav', time: '19:58' },
        { src: 'announcements/salida.wav', time: '19:59' },
        { src: 'announcements/normas.wav', time: '20:58' },
        { src: 'announcements/salida.wav', time: '20:59' },
        { src: 'announcements/salida.wav', time: '21:59' }
    ];

    const musicFiles = [
        'music/mixpop.mp3'
    ];

    // Cargar anuncios
    announcements.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `Anuncio ${index + 1} - Hora: ${item.time}`;
        announcementPlaylist.appendChild(li);
    });

    // Cargar música
    musicFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = `Música ${index + 1}`;
        musicPlaylist.appendChild(li);
    });

    let isAnnouncementPlaying = false;
    let updateStatusInterval = null;

    function parseTime(timeStr) {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function getCurrentTimeInSeconds() {
        const now = new Date();
        return now.getMinutes() * 60 + now.getSeconds();
    }

    function playAnnouncement(announcement) {
        announcementPlayer.src = announcement.src;
        announcementPlayer.play();
        announcementPlayer.onended = scheduleNextAnnouncement;
    }

    function scheduleNextAnnouncement() {
        if (announcements.length === 0) {
            announcementStatus.textContent = 'No hay más anuncios programados.';
            return;
        }

        const now = new Date();
        const currentTimeInSeconds = getCurrentTimeInSeconds();
        const nextAnnouncement = announcements[0];
        const announcementTimeInSeconds = parseTime(nextAnnouncement.time);

        // Calcular el tiempo restante hasta el próximo anuncio
        let timeout;
        if (announcementTimeInSeconds > currentTimeInSeconds) {
            timeout = (announcementTimeInSeconds - currentTimeInSeconds) * 1000;
        } else {
            timeout = ((60 * 60) - (currentTimeInSeconds - announcementTimeInSeconds)) * 1000;
        }

        if (updateStatusInterval !== null) {
            clearInterval(updateStatusInterval);
        }

        // Mostrar la cuenta regresiva hasta el próximo anuncio
        updateStatus();
        updateStatusInterval = setInterval(updateStatus, 1000);

        // Reproducir el próximo anuncio en el tiempo programado
        setTimeout(() => {
            playAnnouncement(nextAnnouncement);
            if (updateStatusInterval !== null) {
                clearInterval(updateStatusInterval);
            }
        }, timeout);
    }

    function updateStatus() {
        if (announcements.length === 0) {
            announcementStatus.textContent = 'No hay más anuncios programados.';
            return;
        }

        const currentTimeInSeconds = getCurrentTimeInSeconds();
        const nextAnnouncement = announcements[0];
        const announcementTimeInSeconds = parseTime(nextAnnouncement.time);

        let remainingSeconds;
        if (announcementTimeInSeconds >= currentTimeInSeconds) {
            remainingSeconds = announcementTimeInSeconds - currentTimeInSeconds;
        } else {
            remainingSeconds = (60 * 60) - (currentTimeInSeconds - announcementTimeInSeconds);
        }

        announcementStatus.textContent = `Proximo anuncio en: ${formatTime(remainingSeconds)}`;
    }

    function initializeMusicPlayer() {
        let currentTrackIndex = 0;
        musicPlayer.src = musicFiles[currentTrackIndex];
        musicPlayer.play();

        musicPlayer.onended = () => {
            currentTrackIndex = (currentTrackIndex + 1) % musicFiles.length;
            musicPlayer.src = musicFiles[currentTrackIndex];
            musicPlayer.play();
        };
    }

    // Sincronización entre reproductores
    announcementPlayer.onplay = () => {
        isAnnouncementPlaying = true;
        musicPlayer.pause();
    };

    announcementPlayer.onpause = () => {
        isAnnouncementPlaying = false;
        musicPlayer.play();
    };

    // Inicializar el reproductor de música
    initializeMusicPlayer();

    // Programar el primer anuncio
    scheduleNextAnnouncement();
});
