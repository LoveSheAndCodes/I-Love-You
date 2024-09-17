let currentQuestion = 0;
let answers = {};

const questions = [
    { text: "Quem você acha que fez isso? 🤔", type: "text", id: "whoMadeThis" },
    { text: "Quantos pontos você me dá em atração? 🥰", type: "number", id: "attractiveness" },
    { text: "O que você sente por mim? 💖", type: "text", id: "feelings" },
    { text: "Como você se sentiria se soubesse que eu gosto de você? 💕", type: "text", id: "reaction" },
    { text: "Qual cor você prefere? 🎨", type: "radio", id: "favoriteColor", options: ["Roxo", "Rosa"] },
    { text: "Você ficaria comigo? 😘", type: "radio", id: "stayWithMe", options: ["Sim", "Não"] },
    { text: "Te encontro quinta-feira, dia 19 na escola? 📅", type: "radio", id: "meetUp", options: ["Sim", "Não"] }
];

function showMainIntro() {
    document.getElementById("introDica").style.display = 'none';
    document.getElementById("introQuiz").style.display = 'block';
}

function startQuiz() {
    document.getElementById("introQuiz").style.display = 'none';
    document.getElementById("questionContainer").style.display = 'block';
    loadQuestion();
}

function nextQuestion() {
    let answer;

    if (questions[currentQuestion].type === "number") {
        answer = answers['attractiveness'];
    } else if (questions[currentQuestion].type === "radio") {
        answer = document.querySelector(`input[name="${questions[currentQuestion].id}"]:checked`)?.value;
    } else {
        const currentInput = document.querySelector(`#${questions[currentQuestion].id}`);
        answer = currentInput ? currentInput.value : null;
    }

    if (answer) {
        answers[questions[currentQuestion].id] = answer;

        if (questions[currentQuestion].id === "stayWithMe" && answer === "Não") {
            showSadEmoji();
        } else {
            currentQuestion++;

            if (currentQuestion < questions.length) {
                loadQuestion();
            } else {
                handleFinalAnswer();
            }
        }
    } else {
        alert("Por favor, responda a pergunta antes de prosseguir.");
    }
}

function loadQuestion() {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = '';

    const question = document.createElement("h2");
    question.textContent = questions[currentQuestion].text;
    question.className = "question";

    let input;
    if (questions[currentQuestion].type === "number") {
        input = document.createElement("div");
        for (let i = 1; i <= 10; i++) {
            const button = document.createElement("button");
            button.className = "number-button";
            button.textContent = i;
            button.onclick = function() { selectNumber(i); };
            input.appendChild(button);
        }
    } else if (questions[currentQuestion].type === "text") {
        input = document.createElement("textarea");
        input.id = questions[currentQuestion].id;
        input.placeholder = "Digite sua resposta aqui...";
    } else if (questions[currentQuestion].type === "radio") {
        input = document.createElement("div");
        input.className = "radio-container";
    
        questions[currentQuestion].options.forEach((option, index) => {
            const container = document.createElement("div");
            container.className = "option-container";
    
            const colorDiv = document.createElement("div");
            colorDiv.className = "color-option";
            colorDiv.style.backgroundColor = option === "Roxo" ? "#800080" : "#ff69b4";
            colorDiv.dataset.color = option === "Roxo" ? "roxo" : "rosa";
    
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = questions[currentQuestion].id;
            radio.value = option;
            radio.id = `${questions[currentQuestion].id}_${index}`;
    
            const label = document.createElement("label");
            label.textContent = option;
            label.className = "radio-label";
    
            colorDiv.onclick = () => {
                radio.checked = true;
                selectColor(option);
            };
    
            colorDiv.appendChild(radio);
            container.appendChild(colorDiv);
            container.appendChild(label);
    
            input.appendChild(container);
        });
    }

    const button = document.createElement("button");
    button.textContent = "Próximo";
    button.onclick = nextQuestion;

    questionContainer.appendChild(question);
    questionContainer.appendChild(input);
    questionContainer.appendChild(button);
}

function selectNumber(value) {
    document.querySelectorAll('.number-button').forEach(button => {
        button.classList.remove('selected');
    });
    event.target.classList.add('selected');
    answers['attractiveness'] = value;
}

function selectColor(color) {
    document.querySelectorAll('.color-option').forEach(div => {
        div.style.border = "none";
    });
    const selectedDiv = Array.from(document.querySelectorAll('.color-option')).find(div => div.style.backgroundColor === (color === "Roxo" ? "#800080" : "#ff69b4"));
    selectedDiv.style.border = "2px solid #ff1493";
    answers['favoriteColor'] = color;
}

function showSadEmoji() {
    document.getElementById("questionContainer").innerHTML = `
        <h2>Desculpa por qualquer coisa!</h2>
        <picture>
            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.webp" type="image/webp">
            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.gif" alt="😭" width="256" height="256">
        </picture>`;
    sendToDiscord();
}

function handleFinalAnswer() {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML = '';

    const finalAnswer = answers['meetUp'];
    if (finalAnswer === "Sim") {
        questionContainer.innerHTML = `
            <h2>Vou ficar te esperando! 😊</h2>
            <div class="bg_heart"></div>
            <style>
                .bg_heart {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
    
                .heart {
                    position: absolute;
                    top: -50%;
                    transform: rotate(-45deg);
                    background: rgba(255, 0, 0, 1);
                    width: 50px;
                    height: 50px;
                }
    
                .heart:before {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    border-radius: 100%;
                }
    
                .heart:after {
                    content: "";
                    position: absolute;
                    top: 0;
                    right: -50%;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    border-radius: 100%;
                }
    
                @keyframes love {
                    0% { top: 110%; }
                    100% { top: -10%; }
                }
            </style>`;
        
        createHearts();
    } else if (finalAnswer === "Não") {
        questionContainer.innerHTML = `
            <h2>Oh não! 😢</h2>
            <picture>
                <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.webp" type="image/webp">
                <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f62d/512.gif" alt="😭" width="256" height="256">
            </picture>`;
    }
    sendToDiscord();
}

function createHearts() {
    setInterval(function() {
        var r_num = Math.floor(Math.random() * 40) + 1;
        var r_size = Math.floor(Math.random() * 65) + 10;
        var r_left = Math.floor(Math.random() * 100) + 1;
        var r_bg = Math.floor(Math.random() * 25) + 100;
        var r_time = Math.floor(Math.random() * 5) + 5;

        var heart1 = document.createElement('div');
        heart1.className = 'heart';
        heart1.style.width = r_size + 'px';
        heart1.style.height = r_size + 'px';
        heart1.style.left = r_left + '%';
        heart1.style.background = 'rgba(255,' + (r_bg - 25) + ',' + r_bg + ',1)';
        heart1.style.animation = 'love ' + r_time + 's ease-in-out infinite';

        var heart2 = document.createElement('div');
        heart2.className = 'heart';
        heart2.style.width = r_size + 'px';
        heart2.style.height = r_size + 'px';
        heart2.style.left = r_left + '%';
        heart2.style.background = 'rgba(255,' + (r_bg - 25) + ',' + r_bg + ',1)';
        heart2.style.animation = 'love ' + r_time + 's ease-in-out infinite';

        document.querySelector('.bg_heart').appendChild(heart1);
        document.querySelector('.bg_heart').appendChild(heart2);
    }, 300);
}

function sendToDiscord() {
    const webhookUrl = 'https://discord.com/api/webhooks/1285597021645963304/BPCCMXw4dSLe5Kgj4do04R7w0BYxcF8U27L2CRsPXIHLaar65JbKH5UDTzm-FH9v3ufA';  // Substitua pelo URL do seu webhook do Discord

    const embed = {
        embeds: [
            {
                title: "Respostas do Questionário",
                description: "Aqui estão as respostas do questionário:",
                color: 0x00ff00,
                fields: [
                    { name: "Quem voce acha que fez essas perguntas?", value: answers['whoMadeThis'] || 'Não quer ficar...' },
                    { name: "Atração por mim", value: answers['attractiveness'] ? `${answers['attractiveness']} pontos` : 'Não especificado' },
                    { name: "O que você sente por mim?", value: answers['feelings'] || 'Não especificado' },
                    { name: "Como você se sentiria se soubesse que eu gosto de você?", value: answers['reaction'] || 'Não especificado' },
                    { name: "Qual cor você prefere?", value: answers['favoriteColor'] || 'Não especificado' },
                    { name: "Você ficaria comigo?", value: answers['stayWithMe'] || 'Não especificado' },
                    { name: "Te encontro quinta-feira, dia 19 na escola?", value: answers['meetUp'] || 'Não especificado' }
                ],
                footer: {
                    text: "Obrigado por participar! 💖"
                }
            }
        ]
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: '@here', embeds: embed.embeds })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erro ao enviar para o Discord');
        }
    }).catch(error => {
        console.error('Erro:', error);
    });
}
