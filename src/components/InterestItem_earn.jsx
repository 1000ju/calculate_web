import { useEffect, useState } from "react";
import getSortedNum from "../util/get-sorted-num";
import extractNum from "../util/extract-num";
import Excel from "./Excel";
import "./InterestItem_earn.css";
//적립식 복리 계산기마다 결과가 달라서 참고할 자료가 마땅치 않음.
//현재 결과도 어느정도는 괜찮은듯하니 일단 계속하고
//계산에 대한 부분은 형한테 직접 피드백을 받아야할 것 같음.
const EAR = (input) => {
  let rate = extractNum(input.rate);
  rate /= 100;
  let payTerm = 0; //복리방식
  switch (input.rateRule) {
    case "year": {
      payTerm = 1;
      break;
    }
    case "half year": {
      payTerm = 2;
      break;
    }
    case "quarter": {
      payTerm = 4;
      break;
    }
    case "month": {
      payTerm = 12;
      break;
    }
    case "day": {
      payTerm = 365;
      break;
    }
    default:
      payTerm = 0;
  }

  let ratioTemp = Number(rate / payTerm + 1); //
  let num = 1;
  // console.log(
  //   "복리방식 : " + payTerm,
  //   "이자율 : " + rate + " 계산 전 : " + ratioTemp
  // );
  for (let i = 0; i < payTerm; i++) {
    num *= ratioTemp;
  }
  num -= 1;

  return num.toFixed(4);
};

const InterestItem_earn = () => {
  const [profit, setProfit] = useState([
    {
      month: 0,
      principal: 0,
      totalAmount: 0,
      income: 0,
      profitRate: 0,
    },
  ]); //복리 수익 과정
  const [input, setInput] = useState({
    startMoney: "", //원금
    plusMoney: "", //추가금
    term: "", //복리 기간
    rate: "", //이자률
    rateRule: "year", //복리방식

    EARate: "",
  });
  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    //console.log(e);

    if (name !== "rateRule") value = getSortedNum(value);
    console.log(name + " : " + value);
    if (name === "term") {
      // 복리 3자리 숫자만 허용
      if (/^\d{0,3}$/.test(value)) {
        setInput({
          ...input,
          [name]: value,
        });
      }
    } else if (
      name === "startMoney" ||
      name === "plusMoney" ||
      name === "rate"
    ) {
      // 숫자, 소수점, 쉼표 허용
      setInput({
        ...input,
        [name]: value,
      });
    } else if (name === "rateRule") {
      setInput({
        ...input,
        [name]: value,
      });
    }
  };

  //console.log(EAR(input));
  //적립식 복리계산 part
  const onClickCalculater = () => {
    const startMoney = Number(extractNum(input.startMoney)); // 초기 금액
    const plusMoney = Number(extractNum(input.plusMoney)); // 매월 적립 금액
    const term = input.term; // 투자 기간 (개월)
    const eaRate = EAR(input); // 연간 실효 이자율 계산
    setInput({
      ...input,
      EARate: eaRate * 100,
    });

    // 실효 이자율을 12로 나누어 월 평균 이자율로 계산
    const monthEAR = eaRate / 12;

    // 원금, 수익, 총액을 저장할 배열
    const profitItems = [];
    let totalPrincipal = startMoney; // 총 원금
    let totalProfit = 0; // 총 수익
    let pre_temp = 0; //An-1 임시저장
    // 복리 계산

    for (let i = 1; i <= term; i++) {
      // 첫 번째 달 계산
      if (i === 1) {
        //A1 = P0 *(1*r)
        totalProfit = totalPrincipal * (1 + monthEAR);
        pre_temp = totalProfit;
      }
      // i번째 달의 원금 계산
      else if (i > 1) {
        totalPrincipal += plusMoney; //여기서 문자열 계산됨*** // 원금 - 매달 적립금 추가
        //An = An-1 *(1+r)+ P
        totalProfit = pre_temp * (1 + monthEAR) + plusMoney;
        pre_temp = totalProfit;
      }
      //console.log(`원금 : ${totalPrincipal} 수익금 : ${totalProfit}`);

      //수익
      const cal_income = (totalProfit - totalPrincipal).toFixed(2);
      // 결과를 배열에 저장
      profitItems.push({
        // 월, 원금, 최종금액(수익), 수익, 수익률
        month: i, //월
        principal: totalPrincipal, //원금
        income: cal_income, // 총수익
        totalAmount: totalProfit.toFixed(2), //최종금액(이자수익계산)
        profitRate: ((cal_income / totalPrincipal) * 100).toFixed(2), // 수익률
      });
    }

    // // 결과를 상태에 저장 ********************

    // -> 최종금액과 총수익 input에도 있는데 한 곳에서만 관리 (수정필요)
    // -> profit에서 관리하고 출력div에서 값으로 profit값으로 변경
    setProfit(profitItems);

    //console.log(profitItems); // 각 달의 원금, 수익, 총액 출력
  };

  console.log(profit); // 각 달의 원금, 수익, 총액 출력
  const lastProfit = profit[profit.length - 1];
  //profit은 객체 리스트, 마지막 객체의 값들이 결괏값

  return (
    <div className="InterestItem_earn">
      <section>
        <h1>적립식 복리 계산기</h1>
      </section>

      <section className="startMoney_section">
        <h3>시작 금액 ($)</h3>
        <input
          name="startMoney"
          value={input.startMoney}
          onChange={onChangeInput}
          placeholder="1,000,000"
        />
      </section>

      <section className="plusMoney_section">
        <h3>매월 적립 금액 ($)</h3>
        <input
          name="plusMoney"
          value={input.plusMoney}
          onChange={onChangeInput}
          placeholder="1,000,000"
        />
      </section>

      <section className="term_section">
        <h3>투자 기간 (개월)</h3>
        <input
          name="term"
          value={input.term}
          onChange={onChangeInput}
          placeholder="20"
        />
      </section>

      <section className="rate_section">
        <h3>이자율 (연이율) </h3>

        <input
          name="rate"
          value={input.rate}
          onChange={onChangeInput}
          placeholder="5%"
          // 계산하기 onClick에 맨 마지막에 % 추가
        />
        <div>월 5%이율 === 연 60%이율</div>
      </section>

      <section className="rule_section">
        <select onChange={onChangeInput} name="rateRule">
          <option value={"year"}>연복리</option>
          <option value={"half year"}>반기복리</option>
          <option value={"quarter"}>분기복리</option>
          <option value={"month"}>월복리</option>
          <option value={"day"}>일복리</option>
        </select>
        <div className="resultRate">{`연간 실효 이자율 ${input.EARate} %`}</div>
      </section>

      <section className="button_section">
        <button onClick={onClickCalculater}>계산하기</button>
      </section>

      {/* 계산 결과를 도출하는 부분 */}
      <section className="calculate_section">
        <div className="top">
          <div className="total_left">
            <div className="title">총 수익</div>
            <div className="price">{`$ ${getSortedNum(
              lastProfit.income
            )}`}</div>
          </div>
          <div className="total_right">
            <div className="title">최종 금액</div>
            <div className="price">{`$ ${getSortedNum(
              lastProfit.totalAmount
            )}`}</div>
          </div>
        </div>
        {/* css */}
        <div className="bottom">
          <div className="total_left">
            <div className="title">최종 수익률</div>
            <div className="price">
              {` ${getSortedNum(lastProfit.profitRate)} %`}
            </div>
          </div>
          <div className="total_right">
            <div className="title">총 원금</div>
            <div className="price">
              {`$ ${getSortedNum(lastProfit.principal)}`}
            </div>
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
              type={"earn"}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default InterestItem_earn;
