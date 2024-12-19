import { useState } from "react";
import getSortedNum from "../util/get-sorted-num";
import extractNum from "../util/extract-num";
import Excel from "./Excel";
import "./InterestItem_basic.css";

const InterestItem_basic = () => {
  const [profit, setProfit] = useState([]); //복리 수익 과정
  const [input, setInput] = useState({
    money: "", //원금
    term: "", //복리 기간
    rate: "", //수익률
    total: "", //최종 금액
    income: "", //총수익 (최종금액-원금)
  });
  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    //console.log(e);

    value = getSortedNum(value);
    console.log(name + " : " + value);
    if (name === "term") {
      // 복리 3자리 숫자만 허용
      if (/^\d{0,3}$/.test(value)) {
        setInput({
          ...input,
          [name]: value,
        });
      }
    } else if (name === "money" || name === "rate") {
      // 숫자, 소수점, 쉼표 허용
      //if (/^(\d{1,3}(,\d{3})*|\d+)(\.\d+)?$/.test(value)) {
      // if (/^[\d,.""]+$/.test(value)) {
      setInput({
        ...input,
        [name]: value,
      });
    }
  };

  //복리계산 part
  const onClickCalculater = () => {
    const money = extractNum(input.money);
    const rate = extractNum(input.rate);
    let sum = money;
    let ratio = 1 + Number(rate / 100);
    let pre_temp = money;
    const profitItems = [];

    for (let i = 1; i <= Number(input.term); i++) {
      sum *= ratio;

      const profitItem = {
        id: i, //id

        E_profit: (sum - pre_temp).toFixed(2), //수익 -> 1번 원금*수익률(1.05) - 원금
        E_amount: sum.toFixed(2), //총액 -> 원금*수익률(1.05)
        E_ratio: (((sum - money) / money) * 100).toFixed(2), //수익률 -> (총액-원금)/원금 *100
      };
      if (profitItem) {
        //console.log(profitItem);
        profitItems.push(profitItem);
      }
      pre_temp = sum;
    }
    //sum의 결과를 저장하는 배열 (push), state, 로 값만 저장하고 for문 밖에서 반복문으로 다시 item을 개산하고 배열에 넣어주기

    setProfit(profitItems);
    //state는 비동기적으로 작동하기 때문에 반복문 내부에서 직접 사용하면 정상적으로 저장이 안됨
    setInput({
      ...input,
      total: sum.toFixed(2),
      income: (sum.toFixed(2) - money).toFixed(2),
    });

    //console.log(profit);
  };

  return (
    <div className="InterestItem_basic">
      <section>
        <h1>복리 계산기</h1>
      </section>

      <section className="money_section">
        <h3>초기 금액 ($)</h3>
        <input
          name="money"
          value={input.money}
          onChange={onChangeInput}
          placeholder="1,000,000"
        />
      </section>

      <section className="term_section">
        <h3>복리 횟수 (기간)</h3>
        <input
          name="term"
          value={input.term}
          onChange={onChangeInput}
          placeholder="20"
        />
      </section>

      <section className="rate_section">
        <h3>수익률 (%)</h3>
        <input
          name="rate"
          value={input.rate}
          onChange={onChangeInput}
          placeholder="5%"
          // 계산하기 onClick에 맨 마지막에 % 추가
        />
      </section>

      <section className="button_section">
        <button onClick={onClickCalculater}>계산하기</button>
      </section>

      {/* 계산 결과를 도출하는 부분 */}
      <section className="calculate_section">
        <div className="total_interest">
          <div className="title_interest">총 수익</div>
          <div className="price_interest">{`$ ${getSortedNum(
            input.income
          )}`}</div>
        </div>
        <div className="total_money">
          <div className="title_money">최종 금액</div>
          <div className="price_money">{`$ ${getSortedNum(input.total)}`}</div>
        </div>
      </section>

      <section className="excel_section">
        {/* onClick이 발생하면 해당 div를 초기화하고 시작 */}
        <div>
          {profit.map((item) => (
            <Excel key={item.id} {...item} type="basic" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default InterestItem_basic;
