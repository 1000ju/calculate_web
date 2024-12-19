import { useState } from "react";
import "./TSelect.css";

const TSelect = ({ onUpdate }) => {
  const [type2, setType2] = useState("basic");
  const onClickType = (e) => {
    const selectedValue = e.target.getAttribute("value"); // value 속성 가져오기
    setType2(selectedValue);

    onUpdate(selectedValue);
  };

  return (
    <div className="TSelect">
      <div
        onClick={onClickType}
        className={`select ${type2 === "basic" ? `select_${type2}` : ""}`}
        value={"basic"}
      >
        기본
      </div>
      <div
        onClick={onClickType}
        className={`select ${type2 === "earn" ? `select_${type2}` : ""}`}
        value={"earn"}
      >
        적립식
      </div>
    </div>
  );
};

export default TSelect;
