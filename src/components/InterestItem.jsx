import InterestItem_basic from "./InterestItem_basic";
import InterestItem_earn from "./InterestItem_earn";
const InterestItem = ({ type }) => {
  //section div 태그의 차이는 뭐고 어떨 때 사용을 하는걸까요?
  let temp_component;
  if (type === "basic") {
    temp_component = <InterestItem_basic />;
  } else if (type === "earn") {
    temp_component = <InterestItem_earn />;
  }

  return <div>{temp_component}</div>;
};

export default InterestItem;
