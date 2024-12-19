import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";

import CompoundInterest from "./pages/compundInterest";
import AveragePrice from "./pages/averagePrice";
import Portion from "./pages/portion";

// 페이지 라우팅
// 공급자 x
// 공통 컴포넌트

//header부분이랑 본문 부분이랑 완전히 분리해서 사용하는 법
//배경 설정되어있느니 분리만하면 되는데 그게 안됨
function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/interest" element={<CompoundInterest />} />
        <Route path="/price" element={<AveragePrice />} />
        <Route path="/revenue" element={<Portion />} />
      </Routes>
    </>
  );
}

export default App;
