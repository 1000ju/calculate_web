// 복리 계산기
const getSortedNum = (num) => {
  let temp = "";
  let number;

  // type을 받아서 계산하는 경우에는 1단계만. 없으면 2단계까지
  // 1단계가 숫자랑 소수점 포함해서 깔끔한 숫자 상태로 만드는 거임

  if (num) {
    // 기존 쉼표 제거 단계
    // 초기값이 없는 첫 시작에서는 null이라서 오류 발생 => null일 때는 계산을 안하는 것으로
    num = String(num);
    const numbersArray = num.match(/[\d .]+/g); // 숫자와 소수점 포함
    //console.log(numbersArray);

    if (numbersArray) {
      number = numbersArray.join(""); // 사이에 아무것도 없이 숫자와 소수점을 이어붙임
      //console.log(number);
    }
  }

  if (number) {
    // 정수 부분과 소수 부분 분리
    const [integerPart, decimalPart] = number.split(".");
    //console.log(integerPart, decimalPart);
    // 정수 부분에 3자리마다 쉼표 넣어줌
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // 소수 부분이 있는 경우 처리
    if (decimalPart || number.toString().includes(".")) {
      temp = `${formattedInteger}.${decimalPart}`;
    } else {
      temp = formattedInteger; // 소수 부분이 없으면 정수 부분만 반환
    }
    //console.log(temp);
  }

  return temp;
};

// 출력할 때는 쉼표가 있어도 괜찮지만, 숫자 계산할 때는 extractNum 모듈로 숫자 추출해서 계산하세요..!
export default getSortedNum;
