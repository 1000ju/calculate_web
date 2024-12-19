import { useState, useEffect } from "react";
import "./AveExchange.css";
import getSortedNum from "../util/get-sorted-num";

const findStandard = (stand) => {
  //환전 기준에 따른 기호 변경
  switch (stand) {
    case "WON":
      return "₩";
    case "DOLLAR":
      return "$";
    case "YEN":
      return "￥";
    default:
      return;
  }
};

const changeStandard = (stand) => {
  switch (stand) {
    case "WON":
      return "KRW";
    case "DOLLAR":
      return "USD";
    case "YEN":
      return "JPY";
    default:
      return;
  }
};

const AveExchange = ({
  averagePrice,
  stockCount,
  totalCost,
  W_averagePrice,
  W_stockCount,
  W_totalCost,
}) => {
  const [rate, setRate] = useState(1); // 환율
  const [currency, setCurrency] = useState({
    //환율 기준을 잡고
    curNow: "WON",
    curLater: "WON",
  });
  const [chose, setChose] = useState("average_result"); //출력할 값 선택
  const [value, setValue] = useState({
    before_ave: "",
    before_total: "",
    average: "",
    total: "",
  });
  const onChangeUpdate = (e) => {
    const { name, value } = e.target;
    setCurrency({
      ...currency,
      [name]: value,
    });
    //console.log(name, value);
  };
  const onChangeChose = (e) => {
    const value = e.target.value;
    setChose(value);
    console.log(value);
  };

  //API로 환율정보 가져오기
  const API_KEY = "a8270944cbbdfed4eeabd9ab";
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${changeStandard(
            currency.curNow
          )}/${changeStandard(currency.curLater)}`
        );
        const data = await response.json();
        setRate(data.conversion_rate); // 환율을 state에 저장
      } catch (error) {
        console.error("Error fetching exchange rate:", error); // 에러 처리
      }
    };

    fetchRate();
  }, [currency]); // 화폐 단위 선택이 바뀔 때마다.

  //물타기 값이 있으면 물타기로, 없다면 기존 평단가로
  const onClickCalculate = () => {
    let temp_Bave = 0;
    let temp_Btotal = 0;
    let temp_ave = 0;
    let temp_total = 0;
    if (chose === "average_result") {
      temp_Bave = averagePrice;
      temp_Btotal = totalCost;
      temp_ave = (averagePrice * rate).toFixed(2);
      temp_total = (totalCost * rate).toFixed(2);
    } else if (chose === "water_result") {
      temp_Bave = W_averagePrice;
      temp_Btotal = W_totalCost;
      temp_ave = (W_averagePrice * rate).toFixed(2);
      temp_total = (W_totalCost * rate).toFixed(2);
    }
    setValue({
      before_ave: temp_Bave,
      before_total: temp_Btotal,
      average: temp_ave,
      total: temp_total,
    });
    console.log(temp_Bave, temp_Btotal);
  };

  return (
    <div className="AveExchange">
      <h1>환율 계산기</h1>

      <h2>화폐 선택</h2>
      <section className="select_section">
        <div className="select_now">
          <div>현재 화폐</div>
          <select name="curNow" onChange={onChangeUpdate}>
            <option value={"WON"}>₩ 1,000</option>
            <option value={"DOLLAR"}>$ 1,000</option>
            <option value={"YEN"}>￥ 1,000</option>
          </select>
        </div>

        <div className="select_later">
          <div>환전할 화폐</div>
          <select name="curLater" onChange={onChangeUpdate}>
            <option value={"WON"}>₩ 1,000</option>
            <option value={"DOLLAR"}>$ 1,000</option>
            <option value={"YEN"}>￥ 1,000</option>
          </select>
        </div>
      </section>

      <section className="standard_section">
        <h2>{`환율  [ ${currency.curNow} => ${currency.curLater} ]`}</h2>
        <div>
          {`${findStandard(currency.curLater)} ${getSortedNum(
            rate.toFixed(2)
          )}`}
        </div>
      </section>

      <section className="chose_section">
        <h2>환율 계산할 값 선택</h2>
        <select onChange={onChangeChose}>
          <option value={"average_result"}>평단가 계산결과</option>
          <option value={"water_result"}>물타기 계산결과</option>
        </select>
        <div>선택한 결과에 값이 없다면 출력값은 0으로 고정됩니다.</div>
      </section>

      <section className="button_section">
        <button onClick={onClickCalculate}>계산하기</button>
      </section>

      <section className="result_section">
        <div className="text">
          <div className="title">평단가</div>
          <div className="title">총 액</div>
        </div>
        <div className="before">
          <div className="title">Before</div>
          <div className="price">
            <div>{`${findStandard(currency.curNow)} ${getSortedNum(
              value.before_ave
            )}`}</div>
            <div>{`${findStandard(currency.curNow)} ${getSortedNum(
              value.before_total
            )}`}</div>
          </div>
        </div>
        <div className="title">{" => "}</div>
        <div className="after">
          <div className="title">After</div>
          <div className="price">
            <div>{`${findStandard(currency.curLater)} ${getSortedNum(
              value.average
            )}`}</div>
            <div>{`${findStandard(currency.curLater)} ${getSortedNum(
              value.total
            )}`}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AveExchange;
