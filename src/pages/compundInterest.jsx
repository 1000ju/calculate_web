import { useState } from "react";
import InterestItem from "../components/InterestItem";
import TSelect from "../components/TSelect";
const CompoundInterest = () => {
  const [type, setType] = useState("basic");
  const onUpdate = (input) => {
    setType(input);
  };
  //원금에 이자를 더해서 계산하는법
  //기본 복리, 적립식 복리
  //화폐 설정

  return (
    <div>
      <TSelect onUpdate={onUpdate} />
      <InterestItem type={type} />
    </div>
  );
};

export default CompoundInterest;
