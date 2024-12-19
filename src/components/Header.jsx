import "./Header.css";
import thumbnail from "./../assets/thumbnail.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const nav = useNavigate();

  return (
    <div className="Header">
      <img onClick={() => nav("/")} src={thumbnail} />
      <div className="interest" onClick={() => nav("/interest")}>
        복리 계산기
      </div>
      <div className="price" onClick={() => nav("/price")}>
        평단가 / 물타기
      </div>
      <div className="revenue" onClick={() => nav("/revenue")}>
        배당 계산기
      </div>
    </div>
  );
};

export default Header;
