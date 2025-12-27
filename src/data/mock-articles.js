export const MOCK_ARTICLES = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Update Project Harian #${i + 1}: Implementasi Fitur Baru`,
  date: new Date(Date.now() - i * 86400000).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  excerpt:
    "Hari ini saya mengerjakan refactoring kode pada bagian autentikasi dan meningkatkan performa aplikasi dengan lazy loading. Tantangan utama adalah menangani state management yang kompleks.",
  content: `
    <p>Hari ini adalah hari yang produktif. Saya memulai hari dengan melakukan review kode dari sprint sebelumnya dan menemukan beberapa area yang bisa dioptimalkan.</p>
    
    <h3>Refactoring Autentikasi</h3>
    <p>Sistem autentikasi yang lama menggunakan pendekatan yang agak berlebihan. Saya menyederhanakannya dengan menggunakan Context API dan JWT yang disimpan di LocalStorage dengan mekanisme refresh token yang lebih aman.</p>
    
    <h3>Tantangan Performa</h3>
    <p>Salah satu isu yang saya temukan adalah bundle size yang terlalu besar. Untuk mengatasinya, saya menerapkan code splitting menggunakan React.lazy dan Suspense pada level rute (route-based code splitting).</p>
    
    <ul>
      <li>Mengurangi initial load time sebesar 40%</li>
      <li>Memisahkan vendor chunks</li>
      <li>Optimasi gambar menggunakan format WebP</li>
    </ul>

    <p>Besok rencananya saya akan fokus pada unit testing untuk memastikan fitur-fitur baru ini berjalan stabil di berbagai skenario.</p>
  `,
  tags: ["React", "Refactoring", "Daily Update"],
}));
