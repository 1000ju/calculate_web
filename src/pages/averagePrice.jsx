import AveAverage from "../components/AveAverage";
import AveWater from "../components/AveWater";
import AveExchange from "../components/AveExchange";
import { useCallback, useEffect, useState } from "react";

const AveragePrice = () => {
  const [results, setResults] = useState({
    averagePrice: "",
    stockCount: "",
    totalCost: "",
    //  물타기 계산결과
    W_averagePrice: "",
    W_stockCount: "",
    W_totalCost: "",
  });

  // 자식 컴포넌트에서 계산 결과를 받아오는 함수
  const handleResultsUpdate = useCallback((newResults) => {
    setResults((prevResults) => ({
      ...prevResults,
      ...newResults, // 자식 컴포넌트에서 받은 값으로 업데이트
    }));
  }, []);

  // useEffect(() => {
  //   console.log(results);
  // }, [results]);

  return (
    <div>
      <AveAverage onUpdate={handleResultsUpdate} />
      <AveWater onUpdate={handleResultsUpdate} {...results} />
      <AveExchange {...results} />
    </div>
  );
};

export default AveragePrice;
