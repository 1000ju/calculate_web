import getSortedNum from "../util/get-sorted-num";
import extractNum from "../util/extract-num";
import "./AveWater.css";
import { useEffect, useState } from "react";

const AveWater = ({
  onUpdate,
  averagePrice,
  stockCount,
  totalCost,
  W_averagePrice,
  W_stockCount,
  W_totalCost,
}) => {
  //props받는거 받고싶은거만 받아도 되나...?
  const [typeValue, setTypeValue] = useState({
    stockPrice: "",
    input: "", //투입금액
    share: "", //주식수
    goal: "", //평단가
    //type과 key를 맞춰 type을 저장에 활용
  });
  const [calType, setCalType] = useState("goal");
  const onClickCalType = (e) => {
    const selectType = e.target.getAttribute("value");
    setCalType(selectType);
    //console.log(selectType);
  };

  const onChangeValue = (e) => {
    let name = e.target.name; // name 속성을 가져옴
    let value = e.target.value; // e.target.value로 변경
    //console.log(name, value);
    //console.log(typeValue);

    // if(/^\d*(\.\d+)?$/.test(value))
    value = getSortedNum(value); //value가 문자열인 가능성 때문에
    setTypeValue({
      ...typeValue,
      [name]: value,
    });
  };

  const renderContent = () => {
    switch (calType) {
      case "input":
        return <div className="title">투입 금액</div>;
      case "share":
        return <div className="title">주식 매수</div>;
      case "goal":
        return <div className="title">목표 단가</div>;
      default:
        return <div>옵션을 선택하세요.</div>;
    }
  };

  useEffect(() => {
    //계산결과가 숫자인 경우에만 저장되게 -> getsortedNum으로 변환 후 저장
    //계산할 때는 extractNum으로 숫자 추출해서 사용
    const cal_stockPrice = extractNum(typeValue.stockPrice);
    const cal_input = extractNum(typeValue.input);
    const cal_share = extractNum(typeValue.share);
    const cal_goal = extractNum(typeValue.goal);
    //type => switch case도 좋은데 너무 길어질까봐.. 완성하고 너무 길지 않으면 switch case로 변경. 그 전에는 if
    let water_money = 0; //총액 - 물타기
    let water_stock = 0; //주식수 - 물타기
    let water_ave = 0; //평단가 - 물타기

    if (calType === "input" && cal_input) {
      //value가 있는경우

      //총금액
      water_money = Number(totalCost) + cal_input;
      //주식수
      water_stock = Number(stockCount) + cal_input / cal_stockPrice;
      //평단가
      water_ave = water_money / water_stock;
    }

    if (calType === "share" && cal_share) {
      //총금액
      water_money = Number(totalCost) + cal_stockPrice * cal_share;
      //주식 수
      water_stock = Number(stockCount) + cal_share;
      //평단가
      water_ave = water_money / water_stock;
    }

    if (calType === "goal" && cal_goal) {
      //평단가
      water_ave = cal_goal;
      //추가 주식 수
      water_stock =
        (Number(totalCost) / cal_goal - Number(stockCount)) /
        (1 - cal_stockPrice / cal_goal);
      //총금액
      water_money = Number(totalCost) + water_stock * cal_stockPrice;

      //총 주식 수
      water_stock += Number(stockCount);
    }

    console.log(
      `평단가 : ${water_ave} 주식수 : ${water_stock} 총액 : ${water_money}`
    );
    //저장
    onUpdate({
      W_averagePrice: water_ave.toFixed(2),
      W_stockCount: water_stock.toFixed(2),
      W_totalCost: water_money.toFixed(2),
    });
  }, [typeValue, calType, onUpdate, averagePrice, stockCount, totalCost]);

  return (
    <div className="AveWater">
      <h1>물타기 계산기</h1>

      <section className="type_section">
        <div className="title">계산 기능</div>
        <div
          onClick={onClickCalType}
          value={"input"}
          className={`select ${calType === "input" ? `select_${calType}` : ""}`}
        >
          투입금액
        </div>

        <div
          onClick={onClickCalType}
          value={"share"}
          className={`select ${calType === "share" ? `select_${calType}` : ""}`}
        >
          주식매수
        </div>
        <div
          onClick={onClickCalType}
          value={"goal"}
          className={`select ${calType === "goal" ? `select_${calType}` : ""}`}
        >
          목표단가
        </div>
      </section>

      <section className="price_section">
        <div className="title">현재 주가</div>
        <input
          onChange={onChangeValue}
          name="stockPrice"
          value={typeValue.stockPrice}
          placeholder="$"
        ></input>
      </section>

      <section className="value_section">
        {/* type에 따라서 받는 값과 이름이 바뀜*/}
        {renderContent()}
        <input
          onChange={onChangeValue}
          name={calType}
          value={typeValue[calType]}
          // value에 state를 쓰다보니 반영이 제때 안되는것 같은데
          placeholder="$"
        ></input>
      </section>

      <section className="result_section">
        <div className="top">
          <div className="sum_average">
            <div className="title">평단가</div>
            <div className="price">{`$ ${getSortedNum(W_averagePrice)}`}</div>
          </div>

          <div className="sum_stock">
            <div className="title">수량</div>
            <div className="price">{`$ ${getSortedNum(W_stockCount)}`}</div>
          </div>

          <div className="sum_totalMoney">
            <div className="title">총 금액</div>
            <div className="price">{`$ ${getSortedNum(W_totalCost)}`}</div>
          </div>
        </div>
        <div className="bottom">
          <div className="sum_stock">
            <div className="title">추가 수량</div>
            <div className="price">{`$ (+ ${
              W_stockCount >= stockCount
                ? getSortedNum(W_stockCount - stockCount)
                : 0
            })`}</div>
          </div>

          <div className="sum_totalMoney">
            <div className="title">추가 금액</div>
            <div className="price">{`$ (+ ${
              W_totalCost >= totalCost
                ? getSortedNum(W_totalCost - totalCost)
                : 0
            })`}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AveWater;
