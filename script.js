// 과자 데이터
const snacks = [
    { name: '새우깡', price: '1,500원' },
    { name: '양파링', price: '1,500원' },
    { name: '포카칩', price: '1,800원' },
    { name: '콘칩', price: '1,800원' },
    { name: '꼬깔콘', price: '1,500원' },
    { name: '맥심커피', price: '2,000원' }
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
    ctx.fillStyle = index % 2 === 0 ? '#FFE082' : '#FFD54F';
    ctx.fill();
    ctx.strokeStyle = '#FFB300';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 텍스트 그리기
    const textRadius = radius * 0.7;
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = '#FF8F00';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(snacks[index].name, 0, -textRadius);
    ctx.font = 'bold 20px Arial';
    ctx.fillText(snacks[index].price, 0, -textRadius + 30);

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
        <div class="result-content">
            <span class="result-label">선택된 과자</span>
            <span class="result-name">${selectedSnack.name}</span>
            <span class="result-price">${selectedSnack.price}</span>
        </div>
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

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const currentProgress = easeOut(progress);

        // currentRotation: 라디안 단위
        currentRotation = (spinAngle * currentProgress * Math.PI) / 180;
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            const total_degrees = (currentRotation * 180 / Math.PI) % 360;
            const adjusted_deg = (360 - total_degrees + 270) % 360;  // 6시 방향 기준 보정
            const sector_angle = 360 / snacks.length;
            const selected_index = Math.floor(adjusted_deg / sector_angle);

            console.log('Total Degrees:', total_degrees);
            console.log('Adjusted Degrees (12시 기준):', adjusted_deg);
            console.log('Selected Index:', selected_index);

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