import extractNum from "../util/extract-num";
import getSortedNum from "../util/get-sorted-num";
import "./Divident.css";
import { useState } from "react";
import Excel from "./Excel";

const Divident = () => {
  const [profit, setProfit] = useState([
    {
      month: 0, //월

      sumStock: 0, //주식 수
      principal: 0, //원금
      totalAmount: 0, //최종금액
      income: 0, //총 수익(배당금금)
      profitRate: 0, //수익률
      //배당성장
      portionGrowth: 0,
    },
  ]);
  const [input, setInput] = useState({
    startMoney: "550",
    plusMoney: "550",
    shareDivident: "3.12",
    growthRate: "2.89",
    stockPrice: "55",
    isTrue: true,
    term: "",
    portionRule: "year",
  });

  const onChangeInput = (e) => {
    let { name, value, checked } = e.target;
    //console.log(name, value, checked);

    if (name !== "portionRule") value = getSortedNum(value);

    // 별도처리
    if (name === "isTrue") {
      setInput({
        ...input,
        [name]: checked,
      });
    } else {
      setInput({
        ...input,
        [name]: value,
      });
    }
  };
  //console.log(input);

  const onClickCalculate = () => {
    console.log(input);
    const input_startMoney = extractNum(input.startMoney);
    const input_plusMoney = extractNum(input.plusMoney);
    const input_stockPrice = extractNum(input.stockPrice);
    const input_shareDivident = extractNum(input.shareDivident);
    const input_growthRate = extractNum(input.growthRate);
    const profitItems = [];
    const routine = extractNum(input.term) * 12;

    let sum_money = 0;
    let sum_stock = 0;
    let sum_original = 0; //원금
    let temp_shareDivident = 0; //배당금
    let cal_income = 0; //지급된 배당금
    for (let i = 1; i <= routine; i++) {
      if (i === 1) {
        sum_money += input_startMoney;
        sum_original += input_startMoney;
        //첫째 달에는 매월추가금x, 배당금x
        temp_shareDivident = input_shareDivident;
      } else {
        sum_money += input_plusMoney;
        sum_original += input_plusMoney;
      }

      sum_stock = sum_money / input_stockPrice; //주식 수 갱신
      // 배당금 성장 처리
      if (i % 12 === 0) {
        temp_shareDivident *= 1 + input_growthRate / 100; // 연간 배당금 성장
      }
      if (input.isTrue === true) {
        if (input.portionRule === "year" && i % 12 === 0) {
          //연배당 = 주식 수 * (주당배당금)
          sum_money += sum_stock * temp_shareDivident;
          cal_income += sum_stock * temp_shareDivident;
        } else if (input.portionRule === "half year" && i % 6 === 0) {
          //반기배당 = 주식 수 * (주당배당금/2)
          sum_money += sum_stock * (temp_shareDivident / 2);
          cal_income += sum_stock * (temp_shareDivident / 2);
        } else if (input.portionRule === "quarter" && i % 4 === 0) {
          //분기배당 =  주식 수 * (주당배당금/4)
          sum_money += sum_stock * (temp_shareDivident / 4);
          cal_income += sum_stock * (temp_shareDivident / 4);
        } else if (input.portionRule === "month") {
          sum_money += sum_stock * (temp_shareDivident / 12);
          cal_income += sum_stock * (temp_shareDivident / 12);
        }
        // 주당배당금은 1년 지급액이라서 반기배당이면, 상반기에 연배당의 절반을 지급, 하반기에 절반을 지급하는 방식. 주당배당금을 배당방식에 따라 쪼개어 일부 지급하는 방식이기 때문.
        // cal_income = (sum_money - sum_original).toFixed(2);
      } else if (input.isTrue === false) {
        if (input.portionRule === "year" && i % 12 === 0) {
          //연배당 = 주식 수 * (주당배당금)
          cal_income += sum_stock * temp_shareDivident;
        } else if (input.portionRule === "half year" && i % 6 === 0) {
          //반기배당 = 주식 수 * (주당배당금/2)
          cal_income += sum_stock * (temp_shareDivident / 2);
        } else if (input.portionRule === "quarter" && i % 4 === 0) {
          //분기배당 =  주식 수 * (주당배당금/4)
          cal_income += sum_stock * (temp_shareDivident / 4);
        } else if (input.portionRule === "month") {
          cal_income += sum_stock * (temp_shareDivident / 12);
        }
      }
      //마지막 사이클 (연,반기,분기,월)에서 1회 누락되는 주식 추가 매수(주식 수)
      if (i === routine) {
        //마지막 사이클이면면
        sum_stock = sum_money / input_stockPrice; //주식 수 갱신
      }

      //console.log(sum_money, sum_original, sum_stock, cal_income);
      profitItems.push({
        month: i, //월

        sumStock: sum_stock.toFixed(2), //주식 수
        principal: sum_original, //원금
        totalAmount: sum_money.toFixed(2), //최종금액
        income: cal_income.toFixed(2), //총 수익(배당금)
        profitRate: ((cal_income / sum_original) * 100).toFixed(2), //수익률률
        //수익률은 원금에 따른 수익률.얼마나 벌었는지 확인하는 지표
        portionGrowth: temp_shareDivident, //배당성장 반영 배당금
      });
    }
    setProfit(profitItems);
  };

  const lastProfit = profit[profit.length - 1];
  console.log(lastProfit);

  return (
    <div className="Divident">
      <section>
        <h1>배당 투자 계산기</h1>
      </section>

      <section className="startMoney_section">
        <h3>초기 금액 ($)</h3>
        <input
          name="startMoney"
          value={input.startMoney}
          onChange={onChangeInput}
          placeholder="1,000,000"
        />
      </section>

      <section className="plusMoney_section">
        <h3>매월 추가 매수금 ($)</h3>
        <input
          name="plusMoney"
          value={input.plusMoney}
          onChange={onChangeInput}
          placeholder="1,000,000"
        />
      </section>

      <section className="divident_section">
        <h3>주당 배당금($)</h3>
        <input
          name="shareDivident"
          value={input.shareDivident}
          onChange={onChangeInput}
          placeholder="3.12"
        />
      </section>

      <section className="growthRate_section">
        <h3>배당 성장률(%)</h3>
        <h4>[ 배당성장이 일정하지 않은 경우 결괏값이 부정확할 수 있습니다 ]</h4>
        <input
          name="growthRate"
          value={input.growthRate}
          onChange={onChangeInput}
          placeholder="5.5%"
        />
      </section>

      <section className="stockPrice_section">
        <h3>주가($)</h3>
        <input
          name="stockPrice"
          value={input.stockPrice}
          onChange={onChangeInput}
          placeholder="55.34"
        />
      </section>

      <section className="reinvest_section">
        <h3>배당금 재투자</h3>
        <input
          name="isTrue"
          checked={input.isTrue}
          onChange={onChangeInput}
          type="checkbox"
        />
      </section>

      <section className="term_section">
        <h3>투자 기간 (년)</h3>
        <input
          name="term"
          value={input.term}
          onChange={onChangeInput}
          placeholder="10"
        />
      </section>

      <section className="rule_section">
        <select onChange={onChangeInput} name="portionRule">
          <option value={"year"}>연배당</option>

          <option value={"half year"}>반기배당</option>
          <option value={"quarter"}>분기배당</option>
          <option value={"month"}>월배당</option>
        </select>
        <div className="resultPortion">{`배당률 ${getSortedNum(
          (
            (extractNum(input.shareDivident) / extractNum(input.stockPrice)) *
            100
          ).toFixed(2)
        )} %`}</div>
      </section>

      <section className="button_section">
        <button onClick={onClickCalculate}>계산하기</button>
      </section>

      {/* 계산 결과를 도출하는 부분 */}
      <section className="calculate_section">
        <div className="top">
          <div className="total_left">
            <div className="title">주식 수</div>
            <div className="price">{`$ ${getSortedNum(
              lastProfit.sumStock
            )}`}</div>
          </div>
          <div className="total_center">
            <div className="title">원금</div>
            <div className="price">{`$ ${getSortedNum(
              lastProfit.principal
            )}`}</div>
          </div>
          <div className="total_right">
            <div className="title">최종금액</div>
            <div className="price">{`$ ${getSortedNum(
              lastProfit.totalAmount
            )}`}</div>
          </div>
        </div>
        {/* css */}
        <div className="bottom">
          <div className="total_left">
            <div className="title">최종 수익률</div>
            {/* 원금에 대한 최종 수익률임.  */}
            <div className="price">{`$ ${getSortedNum(
              lastProfit.profitRate
            )} %`}</div>
          </div>
          <div className="total_right">
            <div className="title">총 배당금</div>
            <div className="price">{`$ ${getSortedNum(
              lastProfit.income
            )}`}</div>
          </div>
        </div>
      </section>

      <section className="excel_section">
        <div>
          {profit.map((item) => (
            <Excel
              key={item.month}
              id={item.month}
              E_total={item.principal}
              E_profit={item.income}
              E_amount={item.totalAmount}
              E_ratio={item.profitRate}
              E_stock={item.sumStock}
              type={"divident"}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Divident;
