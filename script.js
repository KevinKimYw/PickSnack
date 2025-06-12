// 과자 데이터
const snacks = [
    { name: '초코 라떼 쿠키', link: 'https://www.coupang.com/vp/products/8222547525?vendorItemId=90890878110' },
    { name: '누네띠네', link: 'https://www.coupang.com/vp/products/51594057?vendorItemId=3434804665' },
    { name: '삼각 미니 우유 스틱', link: 'https://www.coupang.com/vp/products/7772173462?vendorItemId=89967136380' },
    { name: '삼각 미니 초코 스틱', link: 'https://www.coupang.com/vp/products/7847306773?vendorItemId=89967140075' },
    { name: '쌀과자', link: 'https://www.coupang.com/vp/products/7424936133?vendorItemId=86386353877' },
    { name: '에이스', link: 'https://www.coupang.com/vp/products/1125854?vendorItemId=85322109837' },
    { name: '초코칩쿠키', link: 'https://www.coupang.com/vp/products/5647417931?vendorItemId=76517317060' },
    { name: '포테이토 스낵', link: 'https://www.coupang.com/vp/products/1258265619?vendorItemId=70256462817' },
    { name: '라운드 미니비스킷', link: 'https://www.coupang.com/vp/products/8386486445?vendorItemId=91508884022' },
    { name: '명가 꽈배기', link: 'https://www.coupang.com/vp/products/8785704150?vendorItemId=92238599903' },
    { name: '쿠키마스타 버터쿠키', link: 'https://www.coupang.com/vp/products/8170150621?vendorItemId=88145591364' },
    { name: '곡물과자', link: 'https://www.coupang.com/vp/products/7650587957?itemId=20355127820&searchId=feed-013a7fce115542f8a071952fa83f5bbd-view_together_ads-P7650587031&vendorItemId=88845335761&sourceType=SDP_ADS&clickEventId=dea0b930-477b-11f0-91ec-1cd1d3e7ccbc' },
];



// 색상 배열 추가
const colors = [
    { bg: ['#FFE082', '#FFD54F'], text: '#B71C1C' }, // 노란색 계열
    { bg: ['#A5D6A7', '#81C784'], text: '#1B5E20' }, // 초록색 계열
    { bg: ['#90CAF9', '#64B5F6'], text: '#0D47A1' }, // 파란색 계열
    { bg: ['#F48FB1', '#F06292'], text: '#880E4F' }, // 분홍색 계열
    { bg: ['#B39DDB', '#9575CD'], text: '#4A148C' }, // 보라색 계열
    { bg: ['#80CBC4', '#4DB6AC'], text: '#004D40' }, // 청록색 계열
    { bg: ['#FFAB91', '#FF8A65'], text: '#BF360C' }, // 주황색 계열
    { bg: ['#CE93D8', '#BA68C8'], text: '#6A1B9A' }, // 연보라색 계열
    { bg: ['#9FA8DA', '#7986CB'], text: '#283593' }  // 연파란색 계열
];

// 캔버스 설정
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');

let currentRotation = 0;
let isSpinning = false;

// 섹션 그리기
function drawSection(index, startAngle, endAngle, radius) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sliceAngle = (2 * Math.PI) / snacks.length;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + sliceAngle / 2);

    // 배경 그리기
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -sliceAngle / 2, sliceAngle / 2);
    ctx.closePath();

    // 현재 색상 세트 가져오기
    const currentColors = colors[index % colors.length];
    ctx.fillStyle = index % 2 === 0 ? currentColors.bg[0] : currentColors.bg[1];

    ctx.fill();
    ctx.strokeStyle = '#FFB300';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 텍스트 그리기
    const textRadius = radius * 0.7;
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = currentColors.text;

    // 텍스트 크기 자동 조절
    const margin = 20; // 양옆 여백
    const maxWidth = (radius * Math.sin(sliceAngle / 2) * 1.5) - (margin * 2); // 섹터의 너비에 맞춤 (여백 제외)
    let fontSize = 28; // 초기 폰트 크기
    ctx.font = `bold ${fontSize}px Arial`;

    // 텍스트 크기 조절
    while (ctx.measureText(snacks[index].name).width > maxWidth && fontSize > 12) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px Arial`;
    }

    ctx.textAlign = 'center';
    ctx.fillText(snacks[index].name, 0, -textRadius);

    ctx.restore();
}

// 선택 표시 그리기
function drawSelector() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.save();

    // 화살표 그리기
    ctx.beginPath();
    ctx.moveTo(centerX - 15, centerY - radius - 20);
    ctx.lineTo(centerX, centerY - radius);
    ctx.lineTo(centerX + 15, centerY - radius - 20);
    ctx.closePath();
    ctx.fillStyle = '#FFB300';
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 원형 장식
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius - 20, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFB300';
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
}

// 돌림판 그리기
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const sliceAngle = (2 * Math.PI) / snacks.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 중앙 원
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fillStyle = '#FFB300';
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 각 섹션 그리기
    for (let i = 0; i < snacks.length; i++) {
        const startAngle = i * sliceAngle + currentRotation;
        const endAngle = startAngle + sliceAngle;
        drawSection(i, startAngle, endAngle, radius);
    }

    // 선택 표시 그리기
    drawSelector();
}

// 결과 표시
function showResult(selectedSnack) {
    const resultDiv = document.getElementById('result');
    if (!resultDiv || !selectedSnack) return;

    resultDiv.innerHTML = `
        <a href="${selectedSnack.link}" target="_blank" rel="noopener noreferrer" class="result-name">${selectedSnack.name}</a>
    `;
}

// 돌림판 회전
function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    spinBtn.disabled = true;

    const resultDiv = document.getElementById('result');
    if (resultDiv) resultDiv.innerHTML = '';

    const spinAngle = 3600 + Math.random() * 360;  // 10바퀴 이상 + 랜덤
    const spinDuration = 5000;
    const startTime = performance.now();

    // 색상 배열 섞기
    for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const currentProgress = easeOut(progress);

        currentRotation = (spinAngle * currentProgress * Math.PI) / 180;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            const total_degrees = (currentRotation * 180 / Math.PI) % 360;
            const adjusted_deg = (360 - total_degrees + 270) % 360;  // 6시 방향 기준 보정
            const sector_angle = 360 / snacks.length;
            const selected_index = Math.floor(adjusted_deg / sector_angle);

            if (selected_index >= 0 && selected_index < snacks.length) {
                const selectedSnack = snacks[selected_index];
                showResult(selectedSnack);
            }

            isSpinning = false;
            spinBtn.disabled = false;
        }
    }

    requestAnimationFrame(animate);
}

// 초기화
drawWheel();
document.getElementById('spin-btn').addEventListener('click', spinWheel); 