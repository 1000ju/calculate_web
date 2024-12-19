import "./Excel.css";
import getSortedNum from "../util/get-sorted-num";
const Excel = ({ id, E_total, E_profit, E_amount, E_ratio, E_stock, type }) => {
  console.log(id, E_total, E_profit, E_amount, E_ratio, E_stock, type);

  if (type === "earn") {
    // 적립식 복리일 때는 넘어오는 값이 전부다 undifined인거지..?
    if (id <= 1) {
      return (
        <div className="Excel">
          <section className="title_bar">
            <div className="id_earn">#</div>
            <div className="E_total_earn">원금</div>
            <div className="E_profit_earn">수익 ($)</div>
            <div className="E_amount_earn">총액 ($)</div>
            <div className="E_ratio_earn">수익률</div>
          </section>
        </div>
      );
    } else {
      return (
        <div className="Excel">
          <section className="excel_value">
            <div className="id_earn">{id}</div>
            <div className="E_total_earn">{getSortedNum(E_total)}</div>
            <div className="E_profit_earn">{`+ ${getSortedNum(E_profit)}`}</div>
            <div className="E_amount_earn">{getSortedNum(E_amount)}</div>
            <div className="E_ratio_earn">{`${getSortedNum(E_ratio)} %`}</div>
          </section>
        </div>
      );
    }
  }

  if (type === "basic") {
    if (id <= 1) {
      return (
        <div className="Excel">
          <section className="title_bar">
            <div className="id">#</div>
            <div className="E_profit">수익 ($)</div>
            <div className="E_amount">총액 ($)</div>
            <div className="E_ratio">수익률</div>
          </section>
          <section className="excel_value">
            <div className="id">{id}</div>
            <div className="E_profit">{`+ ${getSortedNum(E_profit)}`}</div>
            <div className="E_amount">{getSortedNum(E_amount)}</div>
            <div className="E_ratio">{`${getSortedNum(E_ratio)} %`}</div>
          </section>
        </div>
      );
    } else {
      return (
        <div className="Excel">
          <section className="excel_value">
            <div className="id">{id}</div>
            <div className="E_profit">{`+ ${getSortedNum(E_profit)}`}</div>
            <div className="E_amount">{getSortedNum(E_amount)}</div>
            <div className="E_ratio">{`${getSortedNum(E_ratio)} %`}</div>
          </section>
        </div>
      );
    }
  }
  // earn basic 타입에 따라서 랜더링할 값이 하나 추가됨. 맨 위에 title추가

  // 배당 계산 Excel
  if (type === "divident") {
    if (id === 1) {
      return (
        <div className="Excel">
          <section className="title_bar_divident">
            <div className="id_divident">#</div>
            <div className="E_stock_divident">주식 수</div>
            <div className="E_total_divident">원금</div>
            <div className="E_amount_divident">총액 ($)</div>
            <div className="E_profit_divident">배당금 ($)</div>
            <div className="E_ratio_divident">수익률</div>
          </section>
        </div>
      );
    } else if (id > 1) {
      return (
        <div className="Excel">
          <section className="excel_value_divident">
            <div className="id_divident">{id}</div>
            <div className="E_stock_divident">{getSortedNum(E_stock)}</div>
            <div className="E_total_divident">{getSortedNum(E_total)}</div>
            <div className="E_amount_divident">{getSortedNum(E_amount)}</div>
            <div className="E_profit_divident">{`+ ${getSortedNum(
              E_profit
            )}`}</div>
            <div className="E_ratio_divident">{`${getSortedNum(
              E_ratio
            )} %`}</div>
          </section>
        </div>
      );
    }
  }
};

export default Excel;
