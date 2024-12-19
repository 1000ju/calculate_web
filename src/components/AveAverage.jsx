import { useEffect, useState } from "react";
import "./AveAverage.css";
import getSortedNum from "../util/get-sorted-num";
import extractNum from "../util/extract-num";

const AveAverage = ({ onUpdate }) => {
  // 입력값으로는 매수단가, 주식 수만 받으면 됨.
  const [inputs, setInputs] = useState([{ value1: "", value2: "" }]); // 초기 상태
  const [calResult, setCalResult] = useState({}); //useEffect 외부에서 값을 사용해야하기 때문에

  // 저장 방법 -> 객체 리스트 : 객체를 만듦, {...으로 기존값, 신규 입력}
  //
  const handleInputChange = (index, event) => {
    const newInputs = [...inputs];
    const { name, value } = event.target;
    newInputs[index][name] = value; // 입력값 업데이트
    setInputs(newInputs);
  };

  const handleAddInput = () => {
    // 새로운 입력란 추가
    setInputs([...inputs, { value1: "", value2: "" }]);
  };
  const handleDeleteInput = (targetId) => {
    setInputs(inputs.filter((item, index) => index !== targetId));
  };

  // 계산 결과 : 평단가 / 주식 수 / 합계금액 => averagePrice페이지에 저장
  useEffect(() => {
    let sumAve = 0; //평단가
    let stock = 0; //주식 수
    let totalMoney = 0; //총액

    //inputs를 받아온다
    const newInputs = [...inputs];
    let sumMoney = 0;
    for (let i = 0; i < newInputs.length; i++) {
      const aveTemp = Number(extractNum(inputs[i].value1)) || 0; // 단가, 숫자로 변환
      const stockTemp = Number(extractNum(inputs[i].value2)) || 0; // 주식 수, 숫자로 변환
      sumMoney = aveTemp * stockTemp; //금액

      stock += stockTemp;
      totalMoney += sumMoney;
    }
    if (stock > 0) sumAve = (totalMoney / stock).toFixed(2);
    else sumAve = 0;

    onUpdate({
      averagePrice: sumAve,
      stockCount: stock,
      totalCost: totalMoney,
    }); //결괏값 3개를 객체로 전달 (상위 컴포넌트 state 변수명과 맞추고)

    const resultTemp = { sumAve, stock, totalMoney };
    setCalResult(resultTemp);

    //console.log(`${sumAve} ${stock} ${totalMoney}`);
    //계산 잘됨 -> 상위에서 저장되는지 확인
  }, [inputs, onUpdate]);

  return (
    <div className="AveAverage">
      <h1>평단가 계산기</h1>
      <section className="title_section">
        <div>매수단가</div>
        <div>주식 수량</div>
        <div>총액</div>
      </section>

      <section className="input_section">
        {inputs.map((input, index) => (
          <div key={index} className="input_value">
            <input
              type="text"
              name="value1"
              value={getSortedNum(input.value1)}
              onChange={(event) => handleInputChange(index, event)}
              placeholder={`단가 ${index + 1}`}
              className="value1"
            />
            <input
              type="text"
              name="value2"
              value={getSortedNum(input.value2)}
              onChange={(event) => handleInputChange(index, event)}
              placeholder={`수량 ${index + 1}`}
              className="value2"
            />
            <div className="multiple">
              {`총액 : ${getSortedNum(
                Number(extractNum(input.value1)) *
                  Number(extractNum(input.value2))
              )}`}
              {/* 첫 번째 입력값 출력 */}
            </div>

            {/* 값 지우는 함수는 해당 index 제외하고 반환하면 됨. filter */}
            <button className="delete" onClick={() => handleDeleteInput(index)}>
              X
            </button>
          </div>
        ))}
      </section>

      <section className="button_section">
        <button onClick={handleAddInput}>입력란 추가</button>
      </section>

      <section className="result_section">
        <div className="sum_average">
          <div className="title">평단가</div>
          <div className="price">{`$ ${getSortedNum(calResult.sumAve)}`}</div>
        </div>

        <div className="sum_stock">
          <div className="title">수량</div>
          <div className="price">{` ${getSortedNum(calResult.stock)} `}</div>
        </div>

        <div className="sum_totalMoney">
          <div className="title">총 금액</div>
          <div className="price">{`$ ${getSortedNum(
            calResult.totalMoney
          )}`}</div>
        </div>
      </section>
    </div>
  );
};

export default AveAverage;
