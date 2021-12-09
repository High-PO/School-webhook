const School = require('school-kr');
const school = new School();
const axios = require("axios");

exports.handler = async (event) => { // AWS Lambda Handler
    const result = await school.search(School.Region.<Your_Region_Code>, '<Your_School_Name>'); // 학교 조회
    school.init(School.Type.<Your_School_Type>, School.Region.<Your_Region_Code>, result[0].schoolCode); // 학교 초기화(이걸 반드시 해야함)
    const meal = await school.getMeal(); // meal이라는 상수에 school.getMeal()을 넣어서 코드를 간소화
    var Today = meal.today // Today로 meal.today(오늘 급식)을 간소화
    try{ //시도
        const skfWk = await axios.post("<Your_WebHook_Url>", { // axios 모듈을 가지고 웹훅 주소로 post를 한다.
            "content":`${meal.month}월 ${meal.day}일 급식입니다.` // post(채팅) 내용
        });
        console.info("날짜 확인 성공"); //성공시 AWS Lambda에 띄울 메세지
    }
    catch(eroor){ //에러 발생시
        console.error("날짜 확인 실패", eroor); //에러 시  AWS Lambda에 '날짜 확인 실패' 라고 띄운다.
    }    
    try{ //시도
        const rmqtlr = await axios.post("<Your_WebHook_Url>", { // 위와 같이 채팅을 사용한다.
            "content":Today // Today => meal.today => school.getMeal() 이므로 아주 간소화 시킨 변수를 채팅으로 보낸다.
        });
        console.info("급식 조회 및 전송 성공"); //성공시 AWS Lambda에 띄울 내용
    } 
    catch(eroor){ //에러 발생시
        console.error("급식 조회 및 전송 실패", eroor); // 에러시 AWS Lambda에 '급식 조회 및 전송 실패' 라고 띄운다.
    }
    const response = { // response라는 상수에 아래의 내용을 넣는다.
        statusCode: 200, //성공 코드 200
        body: JSON.stringify('Successfull! Good Job'), // 성공시 띄울 메세지
    };
    return response; //respose를 반환한다.
};