// 복리 계산기
const extractNum = (num) => {
  let number = "";

  // type을 받아서 계산하는 경우에는 1단계만. 없으면 2단계까지
  // 1단계가 숫자랑 소수점 포함해서 깔끔한 숫자 상태로 만드는 거임

  if (num) {
    // 기존 쉼표 제거 단계
    // 초기값이 없는 첫 시작에서는 null이라서 오류 발생 => null일 때는 계산을 안하는 것으로

    const numbersArray = num.match(/[\d.]+/g); // 숫자와 소수점 포함
    //console.log(numbersArray);2

    if (numbersArray) {
      number = numbersArray.join(""); // 사이에 아무것도 없이 숫자와 소수점을 이어붙임
      //console.log(number);
    }
  }

  return Number(number);
};

export default extractNum;
