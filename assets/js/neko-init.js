// assets/js/neko-init.js

function initNekoCats() {
  const nekoImageUrls = [
    "testing.gif" // hỗ trợ file gif
  ];

  // Tạo neko chính (theo chuột)
  const mainNeko = new Neko({ 
    nekoName: "main-neko", 
    nekoImageUrl: "./assets/cursor/testing.gif", // gif vẫn hoạt động
    initialPosX: window.innerWidth / 2,
    initialPosY: window.innerHeight / 2
  });
  mainNeko.init();
  mainNeko.isFollowing = true;

  // Tạo thêm các neko khác (nếu có)
  nekoImageUrls.forEach((url, index) => {
    const neko = new Neko({
      nekoName: `neko-${index}`,
      nekoImageUrl: `./neko/images/${url}`,
      initialPosX: 50 + (index % 5) * 80,
      initialPosY: 50 + Math.floor(index / 5) * 80
    });
    neko.init();
  });
}

// Kiểm tra xem Neko class đã load chưa và khởi tạo
if (typeof Neko === 'undefined') {
  console.error('Neko class not found. Load neko.js first');
} else {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNekoCats);
  } else {
    initNekoCats();
  }
}
