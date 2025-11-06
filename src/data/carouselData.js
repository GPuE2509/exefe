import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faStar,
  faGift,
  faHeart,
  faLightbulb
} from "@fortawesome/free-solid-svg-icons";

export default [
  {
    id: 1,
    bgColor: "#F54748",
    icon: <FontAwesomeIcon icon={faBook} size="3x" />,
    title: "Khám phá thế giới tri thức",
    desc: "Hàng ngàn cuốn sách hay đang chờ bạn khám phá. Từ tiểu thuyết kinh điển đến khoa học viễn tưởng."
  },
  {
    id: 2,
    bgColor: "#7952B3",
    icon: <FontAwesomeIcon icon={faStar} size="3x" />,
    title: "Sách mới nhất",
    desc: "Cập nhật những tác phẩm mới nhất từ các tác giả nổi tiếng. Đón đầu xu hướng đọc sách."
  },
  {
    id: 3,
    bgColor: "#1597BB",
    icon: <FontAwesomeIcon icon={faGift} size="3x" />,
    title: "Ưu đãi đặc biệt",
    desc: "Giảm giá lên đến 50% cho các cuốn sách bán chạy. Cơ hội sở hữu những cuốn sách yêu thích."
  },
  {
    id: 4,
    bgColor: "#185ADB",
    icon: <FontAwesomeIcon icon={faHeart} size="3x" />,
    title: "Sách được yêu thích",
    desc: "Những cuốn sách được độc giả đánh giá cao nhất. Chất lượng nội dung và hình thức tuyệt vời."
  },
  {
    id: 5,
    bgColor: "#FF616D",
    icon: <FontAwesomeIcon icon={faLightbulb} size="3x" />,
    title: "Tri thức mở rộng",
    desc: "Mở rộng kiến thức với những cuốn sách về khoa học, lịch sử, và phát triển bản thân."
  }
];
