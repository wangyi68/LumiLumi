const songs = [
            "SYENSANREMIX.mp4"
        ];

        let currentSongIndex = 0;
        let isPlaying = false;

        // Dùng video element để phát MP4
        const audio = document.createElement("video");
        audio.style.display = "none"; // ẩn video
        audio.volume = 1.0;
        document.body.appendChild(audio);

        function shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }

        let shuffledSongs = shuffleArray(songs);

        function initMusicPlayer() {
            loadSong(currentSongIndex);
            audio.addEventListener('ended', nextSong);
        }

        function startMusicAfterTerminal() {
            isPlaying = true;
            audio.play().catch(error => {
                console.error("Music playback error:", error);
                setTimeout(() => {
                    audio.play().catch(e => console.error("Retry error:", e));
                }, 1000);
            });
        }

        function loadSong(index) {
            audio.src = `./assets/music/${shuffledSongs[index]}`;
            if (isPlaying) {
                audio.play().catch(error => console.error("Play error:", error));
            }
        }

        function nextSong() {
            currentSongIndex = Math.floor(Math.random() * shuffledSongs.length);
            loadSong(currentSongIndex);
        }

        document.addEventListener('DOMContentLoaded', () => {
            shuffledSongs = shuffleArray([...songs]);
            initMusicPlayer();
        });

        // Expose ra window để gọi từ console hoặc code khác
        window.MusicPlayer = {
            start: startMusicAfterTerminal,
            getAudio: () => audio
        };