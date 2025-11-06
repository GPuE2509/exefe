// Dữ liệu mẫu cho sách
export const booksData = [
  {
    id: 1,
    title: "Sapiens: Lược sử loài người",
    author: "Yuval Noah Harari",
    price: 180000,
    category: "Lịch sử",
    image: "/img/SOCOLA/cake1.jpg",
    description: "Cuốn sách khám phá lịch sử tiến hóa của loài người từ thời kỳ đồ đá đến hiện tại, với những phân tích sâu sắc về cách thức con người đã thay đổi thế giới.",
    rating: 4.8,
    reviews: 1250,
    inStock: true,
    publisher: "Nhà xuất bản Thế giới",
    publishYear: 2011,
    pages: 443,
    language: "Tiếng Việt"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 220000,
    category: "Self-help",
    image: "/img/DÂU/cake2.jpg",
    description: "Cuốn sách về cách xây dựng những thói quen tốt và loại bỏ những thói quen xấu thông qua những thay đổi nhỏ nhưng có tác động lớn.",
    rating: 4.9,
    reviews: 2100,
    inStock: true,
    publisher: "Nhà xuất bản Trẻ",
    publishYear: 2018,
    pages: 320,
    language: "Tiếng Việt"
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    price: 250000,
    category: "Khoa học viễn tưởng",
    image: "/img/MATCHA/cake3.jpg",
    description: "Tác phẩm kinh điển của thể loại khoa học viễn tưởng, kể về cuộc phiêu lưu trên hành tinh sa mạc Arrakis và cuộc chiến giành quyền kiểm soát gia vị quý giá.",
    rating: 4.7,
    reviews: 1800,
    inStock: true,
    publisher: "Nhà xuất bản Kim Đồng",
    publishYear: 1965,
    pages: 688,
    language: "Tiếng Việt"
  },
  {
    id: 4,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 200000,
    category: "Tài chính",
    image: "/img/TIRAMINSU/cake4.jpg",
    description: "Cuốn sách khám phá những bài học về tiền bạc và đầu tư thông qua góc nhìn tâm lý học, giúp độc giả hiểu rõ hơn về cách thức quản lý tài chính cá nhân.",
    rating: 4.6,
    reviews: 950,
    inStock: true,
    publisher: "Nhà xuất bản Lao động",
    publishYear: 2020,
    pages: 256,
    language: "Tiếng Việt"
  },
  {
    id: 5,
    title: "1984",
    author: "George Orwell",
    price: 150000,
    category: "Văn học",
    image: "/img/RED/cake5.jpg",
    description: "Tác phẩm kinh điển về một xã hội dystopian, nơi chính phủ kiểm soát mọi khía cạnh của cuộc sống con người thông qua công nghệ và tuyên truyền.",
    rating: 4.9,
    reviews: 3200,
    inStock: true,
    publisher: "Nhà xuất bản Văn học",
    publishYear: 1949,
    pages: 328,
    language: "Tiếng Việt"
  },
  {
    id: 6,
    title: "The Lean Startup",
    author: "Eric Ries",
    price: 190000,
    category: "Kinh doanh",
    image: "/img/TRÁI CÂY/cake6.jpg",
    description: "Cuốn sách về phương pháp khởi nghiệp tinh gọn, giúp các doanh nhân xây dựng và phát triển sản phẩm một cách hiệu quả thông qua việc học hỏi liên tục.",
    rating: 4.5,
    reviews: 1100,
    inStock: true,
    publisher: "Nhà xuất bản Kinh tế",
    publishYear: 2011,
    pages: 336,
    language: "Tiếng Việt"
  }
];

export const categories = [
  { id: 1, name: "Văn học", slug: "van-hoc" },
  { id: 2, name: "Khoa học viễn tưởng", slug: "khoa-hoc-vien-tuong" },
  { id: 3, name: "Lịch sử", slug: "lich-su" },
  { id: 4, name: "Self-help", slug: "self-help" },
  { id: 5, name: "Tài chính", slug: "tai-chinh" },
  { id: 6, name: "Kinh doanh", slug: "kinh-doanh" },
  { id: 7, name: "Khoa học", slug: "khoa-hoc" },
  { id: 8, name: "Nghệ thuật", slug: "nghe-thuat" }
];

export const featuredBooks = booksData.slice(0, 3);
export const bestSellerBooks = booksData.slice(3, 6);
export const newBooks = booksData.slice(0, 4);
