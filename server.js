const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// index.html이 있는 현재 폴더를 정적 파일 디렉토리로 설정
app.use(express.static(__dirname));

// 랭킹 데이터를 저장할 임시 배열 (메모리 저장 방식)
let leaderboards = [];

// [POST] 점수 등록 API
app.post('/api/score', (req, res) => {
    const { studentId, name, score } = req.body;
    
    if (!studentId || !name) {
        return res.status(400).json({ error: "학번과 이름을 입력해주세요." });
    }

    // 기존에 동일 학번이 있는지 확인
    const existingUser = leaderboards.find(user => user.studentId === studentId);
    
    if (existingUser) {
        // 기존 기록보다 높을 때만 갱신
        if (score > existingUser.score) {
            existingUser.score = score;
        }
    } else {
        // 신규 등록
        leaderboards.push({ studentId, name, score });
    }

    // 점수 높은 순(내림차순)으로 정렬
    leaderboards.sort((a, b) => b.score - a.score);
    
    // 상위 10명만 남기기
    leaderboards = leaderboards.slice(0, 10);

    res.json({ success: true, leaderboards });
});

// [GET] 랭킹 불러오기 API
app.get('/api/leaderboard', (req, res) => {
    res.json(leaderboards);
});

// 루트 페이지 접속 시 index.html 띄우기
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
