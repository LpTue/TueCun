document.addEventListener('DOMContentLoaded', () => {  // Tí sửa lại "document.addEventListener('DOMContentLoaded', () => {"
    // --- Phần Đếm Ngày ---
    const dayCountElement = document.getElementById('dayCount');
    const startDateDisplay = document.getElementById('startDateDisplay');
    const startDate = new Date('2023-10-20T00:00:00'); // Đặt ngày bắt đầu ở đây: YYYY-MM-DDT00:00:00

    function updateDayCount() {
        const now = new Date();
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        dayCountElement.textContent = diffDays; // Cập nhật số ngày hiển thị
    }

    // Hiển thị ngày bắt đầu dưới dạng DD/MM/YYYY
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    startDateDisplay.textContent = `Ngày bắt đầu: ${startDate.toLocaleDateString('vi-VN', options)}`; // Hiển thị "Ngày bắt đầu: 10/20/2023"

    updateDayCount(); // Cập nhật lần đầu
    setInterval(updateDayCount, 1000 * 60 * 60); // Cập nhật mỗi giờ

    // --- Phần Thời gian trên thanh Top Bar ---
    function updateTime() {
        const timeElement = document.querySelector('.top-bar .time');
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}`;
    }

    updateTime(); // Cập nhật lần đầu
    setInterval(updateTime, 1000); // Cập nhật mỗi giây

    // --- Phần Gallery Ảnh ---
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const closeGalleryBtn = document.getElementById('closeGalleryBtn');
    const galleryPopup = document.getElementById('galleryPopup');
    const galleryImagesContainer = document.getElementById('galleryImagesContainer');

    const galleryImagePaths = [];

    // **** ĐIỀU CHỈNH ĐƯỜNG DẪN ẢNH GALLERY Ở ĐÂY ****
    // Đảm bảo tên file CHÍNH XÁC là 'anh (số).jpeg' (chữ 'anh' thường, đuôi '.jpeg' thường)
    for (let i = 1; i <= 139; i++) { // Vòng lặp từ 1 đến 139 ảnh
        galleryImagePaths.push(`anh (${i}).jpeg`); // Đã bỏ 'images/'
    }
    // Nếu bạn có ít hơn hoặc nhiều hơn 113 ảnh, hãy điều chỉnh số lượng ở trên.

    function loadGalleryImages() {
        galleryImagesContainer.innerHTML = '';
        galleryImagePaths.forEach(path => {
            const img = document.createElement('img');
            img.src = path;
            img.alt = 'Ảnh kỷ niệm';
            galleryImagesContainer.appendChild(img);
        });
    }

    openGalleryBtn.addEventListener('click', () => {
        loadGalleryImages();
        galleryPopup.classList.add('active');
    });

    closeGalleryBtn.addEventListener('click', () => {
        galleryPopup.classList.remove('active');
    });

    galleryPopup.addEventListener('click', (event) => {
        if (event.target === galleryPopup) {
            galleryPopup.classList.remove('active');
        }
    });

    // --- Phần Hiệu ứng Sóng nước bằng Canvas ---
    const canvas = document.getElementById('loveWaveCanvas');
    const ctx = canvas.getContext('2d');
    let frame = 0; // Biến đếm khung hình để tạo hiệu ứng chuyển động
    const waveAmplitude = 10; // Biên độ sóng (độ cao của sóng)
    const waveFrequency = 0.02; // Tần số sóng (độ "co giãn" của sóng)
    const waveSpeed = 0.05; // Tốc độ di chuyển của sóng
    const fillColor = 'rgba(255, 105, 180, 0.7)'; // Màu hồng cho sóng

    function resizeCanvas() {
        // Đảm bảo canvas có cùng kích thước với container cha
        const container = canvas.parentElement; // love-circle-container
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Xóa canvas mỗi khung hình

        ctx.fillStyle = fillColor; // Đặt màu cho sóng
        ctx.beginPath(); // Bắt đầu vẽ một đường mới

        // Bắt đầu từ góc dưới bên trái của canvas
        ctx.moveTo(0, canvas.height);

        // Vẽ đường sóng
        for (let x = 0; x < canvas.width; x++) {
            // Công thức sóng sin: y = amplitude * sin(frequency * x + phase) + offset
            // phase được tạo từ biến frame để sóng di chuyển
            const y = canvas.height * 0.7 - waveAmplitude * Math.sin(x * waveFrequency + frame * waveSpeed); // Điều chỉnh 0.7 để sóng ở khoảng 70% chiều cao
            ctx.lineTo(x, y);
        }

        // Kết thúc đường sóng và vẽ xuống góc dưới bên phải
        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath(); // Đóng đường để tạo hình dạng kín
        ctx.fill(); // Tô màu cho hình dạng

        frame++; // Tăng biến frame để sóng di chuyển
        requestAnimationFrame(drawWave); // Yêu cầu trình duyệt gọi lại hàm drawWave cho khung hình tiếp theo
    }

    // Chạy các hàm khi trang được tải
    resizeCanvas(); // Thiết lập kích thước canvas ban đầu
    window.addEventListener('resize', resizeCanvas); // Cập nhật kích thước canvas khi cửa sổ thay đổi
    drawWave(); // Bắt đầu vẽ sóng

    // --- Music Playback (Phát nhiều bài & Điều khiển) ---
    const backgroundMusic = document.getElementById('backgroundMusic');
    const currentSongNameElement = document.getElementById('currentSongName');
    const musicInfoElement = document.getElementById('musicInfo');
    // Loại bỏ: const musicOverlay = document.getElementById('musicOverlay');
    // Loại bỏ: const playMusicButton = document.getElementById('playMusicButton');

    const playPauseButton = document.getElementById('playPauseButton');
    const nextButton = document.getElementById('nextButton');
    const progressBar = document.getElementById('progressBar');
    const currentTimeElement = document.getElementById('currentTime');
    const totalTimeElement = document.getElementById('totalTime');
    const songProgressContainer = document.querySelector('.song-progress');


    let currentSongIndex = 0;
    let isPlaying = false; // Biến theo dõi trạng thái phát nhạc

    // **** ĐIỀU CHỈNH DANH SÁCH BÀI HÁT Ở ĐÂY ****
    // Đảm bảo các file nhạc (ví dụ: "ten_bai_hat_1.mp3", "ten_bai_hat_2.mp3")
    // nằm cùng thư mục với index.html
    // Tên bạn nhập vào đây sẽ là tên file thật của bạn (có thể viết thường)
    const musicPlaylist = [
        'nơi này có anh.mp3', // Tên file nhạc của bạn, viết thường
        'đường tôi chở em về.mp3',
        'chàng trai bất tử.mp3',
        // Thêm các bài hát khác vào đây, mỗi bài là một chuỗi
        // 'ten_bai_hat_3.mp3',
        // 'bai_hat_cuoi_cung.mp3'
    ];

    // Hàm tiện ích để viết hoa chữ cái đầu của mỗi từ
    function capitalizeWords(str) {
        return str.replace(/_/g, ' ') // Thay thế dấu gạch dưới bằng khoảng trắng
                  .split(' ') // Chia chuỗi thành mảng các từ
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Viết hoa chữ cái đầu và viết thường phần còn lại
                  .join(' '); // Nối các từ lại bằng khoảng trắng
    }

    // Hàm định dạng thời gian từ giây sang MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function updatePlayPauseButton() {
        if (isPlaying) {
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Icon tạm dừng
        } else {
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Icon phát
        }
    }

    function updateSongDisplay() {
        if (musicPlaylist.length > 0) {
            const fileNameWithExtension = musicPlaylist[currentSongIndex].split('/').pop();
            const songNameWithoutExtension = fileNameWithExtension.split('.')[0];
            const formattedSongName = capitalizeWords(songNameWithoutExtension);

            currentSongNameElement.textContent = formattedSongName;
            musicInfoElement.classList.add('active'); // Hiển thị music-info
        } else {
            currentSongNameElement.textContent = '';
            musicInfoElement.classList.remove('active'); // Ẩn music-info
        }
    }

    function playCurrentSong() {
        if (musicPlaylist.length === 0) {
            console.log("Danh sách phát nhạc trống.");
            musicInfoElement.classList.remove('active');
            // Loại bỏ: if (musicOverlay) musicOverlay.classList.remove('active');
            isPlaying = false;
            updatePlayPauseButton();
            return;
        }

        backgroundMusic.src = musicPlaylist[currentSongIndex];
        backgroundMusic.load(); // Tải bài hát mới

        const playPromise = backgroundMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayPauseButton();
                updateSongDisplay(); // Cập nhật hiển thị tên bài hát
                // Loại bỏ: if (musicOverlay) musicOverlay.classList.remove('active');
            }).catch(error => {
                console.log('Autoplay was prevented or error playing song:', error);
                isPlaying = false;
                updatePlayPauseButton();
                musicInfoElement.classList.remove('active');
                // Thông báo cho người dùng rằng họ cần click để phát nhạc (nếu trình duyệt chặn autoplay)
                currentSongNameElement.textContent = "Nhạc bị chặn phát tự động. Bấm nút Play.";
            });
        }
    }

    function togglePlayPause() {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
        } else {
            // Cố gắng phát lại từ vị trí hiện tại
            backgroundMusic.play().then(() => {
                isPlaying = true;
            }).catch(error => {
                console.log('Error attempting to play music:', error);
                // Xử lý lỗi nếu không thể phát (ví dụ: trình duyệt chặn)
                isPlaying = false; // Đảm bảo trạng thái đúng
                // Loại bỏ: if (musicOverlay) musicOverlay.classList.add('active');
            });
        }
        updatePlayPauseButton();
    }


    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % musicPlaylist.length; // Chuyển sang bài tiếp theo, quay lại 0 nếu hết list
        playCurrentSong();
    }

    // --- Xử lý sự kiện cho điều khiển nhạc ---

    // Cập nhật tổng thời gian khi metadata của nhạc được tải
    backgroundMusic.addEventListener('loadedmetadata', () => {
        totalTimeElement.textContent = formatTime(backgroundMusic.duration);
    });

    // Cập nhật thời gian hiện tại và thanh tiến trình
    backgroundMusic.addEventListener('timeupdate', () => {
        currentTimeElement.textContent = formatTime(backgroundMusic.currentTime);
        const progressPercent = (backgroundMusic.currentTime / backgroundMusic.duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    });

    // Tự động chuyển bài khi kết thúc
    backgroundMusic.addEventListener('ended', () => {
        playNextSong();
    });

    // Xử lý sự kiện click vào thanh tiến trình để tua nhạc
    songProgressContainer.addEventListener('click', (e) => {
        const progressBarWidth = songProgressContainer.clientWidth;
        const clickX = e.offsetX; // Vị trí click tương đối trong thanh
        const seekTime = (clickX / progressBarWidth) * backgroundMusic.duration;
        backgroundMusic.currentTime = seekTime;
    });

    // Xử lý sự kiện click cho nút Play/Pause
    playPauseButton.addEventListener('click', togglePlayPause);

    // Xử lý sự kiện click cho nút Next
    nextButton.addEventListener('click', playNextSong);

    // Cố gắng phát nhạc ngay khi DOMContentLoaded
    playCurrentSong(); // Gọi lần đầu để bắt đầu phát

    // Loại bỏ: Lắng nghe sự kiện click trên nút Play của overlay (nếu dùng)
    // Loại bỏ: if (playMusicButton) { ... }

    // Lắng nghe sự kiện click bất cứ đâu trên document (backup nếu nhạc bị chặn)
    // Chỉ lắng nghe một lần để bắt đầu nhạc nếu nó chưa phát
    document.addEventListener('click', () => {
        if (backgroundMusic.paused && musicPlaylist.length > 0) {
            playCurrentSong();
        }
    }, { once: true });


    // Khởi tạo trạng thái ban đầu của nút Play/Pause
    updatePlayPauseButton();

    // Hiển thị music info ngay từ đầu và load tên bài hát đầu tiên
    updateSongDisplay();

    // Loại bỏ logic hiển thị overlay ban đầu
    // if (musicPlaylist.length > 0 && musicOverlay) { ... }
});