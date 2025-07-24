document.addEventListener('DOMContentLoaded', () => {
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
    // Vì các ảnh sẽ nằm ngang hàng với index.html, chúng ta không cần tiền tố 'images/' nữa.
    // Đảm bảo tên file CHÍNH XÁC là 'anh (số).jpeg' (chữ 'anh' thường, đuôi '.jpeg' thường)
    for (let i = 1; i <= 113; i++) { // Vòng lặp từ 1 đến 113 ảnh
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
});