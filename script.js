const CONTACT_EMAIL = "htxmetrics@gmail.com";
const WHATSAPP_NUMBER = "+5521997049203";
const COMPLETED_CHALLENGES_KEY = "codigo-de-partida-missoes";

const form = document.querySelector("#interest-form");
const status = document.querySelector("#form-status");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#nav-links");
const lessonTabs = document.querySelectorAll(".lesson-tab");
const lessonCode = document.querySelector("#lesson-code");
const codeInput = document.querySelector("#code-input");
const lessonFilename = document.querySelector("#lesson-filename");
const lessonExplanation = document.querySelector("#lesson-explanation");
const previewFrame = document.querySelector("#lesson-preview-frame");
const runButton = document.querySelector("#run-code");
const resetButton = document.querySelector("#reset-code");
const liveUpdate = document.querySelector("#live-update");
const challengeChoices = document.querySelectorAll(".challenge-choice");
const challengeContent = document.querySelector("#challenge-content");
const challengeHintButton = document.querySelector("#show-hint");
const challengeSolutionButton = document.querySelector("#show-solution");
const challengeFeedback = document.querySelector("#challenge-feedback");
const portfolioAction = document.querySelector("#portfolio-action");
const portfolioProjects = document.querySelector("#portfolio-projects");
const globeCanvas = document.querySelector("#hero-globe");
const globeContext = globeCanvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const lessonExamples = {
  html: {
    filename: "index.html",
    explanation: "HTML organiza o conteúdo: aqui criamos um título e um botão que o navegador consegue reconhecer.",
    code: `<main class="cartao">\n  <span>MEU PRIMEIRO PROJETO</span>\n  <h1>Minha primeira página</h1>\n  <p>Feita por mim, linha por linha.</p>\n  <button id="acao">Clique para testar</button>\n</main>`,
  },
  css: {
    filename: "style.css",
    explanation: "CSS define a aparência: selecionamos o botão e descrevemos como ele deve ficar na tela.",
    code: `* { box-sizing: border-box; }\n\nbody {\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  margin: 0;\n  background: #111719;\n  color: #f0f5f6;\n  font-family: system-ui, sans-serif;\n}\n\n.cartao {\n  width: min(90%, 420px);\n  padding: 2rem;\n  border: 1px solid #40535b;\n  background: #20292d;\n}\n\nbutton {\n  padding: .8rem 1rem;\n  border: 0;\n  background: #35b7e8;\n  color: #111719;\n  cursor: pointer;\n}`,
  },
  js: {
    filename: "script.js",
    explanation: "JavaScript adiciona comportamento: ouvimos o clique e atualizamos o texto do botão.",
    code: `const botao = document.querySelector("#acao");\n\nif (botao) {\n  botao.addEventListener("click", () => {\n    botao.textContent = "Você conseguiu!";\n  });\n}`,
  },
};
const initialExamples = Object.fromEntries(
  Object.entries(lessonExamples).map(([language, example]) => [language, { ...example }])
);
const challengeData = {
  html: {
    label: "DESAFIO 01 · ESTRUTURA",
    title: "Dê um nome novo à página",
    description: "Na aba HTML do editor, troque o título “Minha primeira página” pelo seu nome ou por uma ideia sua. Execute e veja a mudança.",
    hint: "Procure o texto que está entre as tags <h1> e </h1>. Você pode substituir somente as palavras.",
    solution: lessonExamples.html.code.replace("Minha primeira página", "Uma ideia minha"),
    isComplete: (code) => !code.includes("Minha primeira página"),
  },
  css: {
    label: "DESAFIO 02 · ESTILO",
    title: "Escolha uma cor para o botão",
    description: "Na aba CSS, encontre o fundo do botão e mude a cor. Experimente um tom diferente e execute a prévia.",
    hint: "Procure a propriedade background dentro do bloco button. Cores podem ser escritas em hexadecimal, como #35b7e8.",
    solution: lessonExamples.css.code.replace("#35b7e8", "#56d6a7"),
    isComplete: (code) => code.includes("background:") && code.includes("#56d6a7"),
  },
  js: {
    label: "DESAFIO 03 · INTERAÇÃO",
    title: "Escreva sua própria resposta ao clique",
    description: "Na aba JavaScript, mude a mensagem que aparece quando alguém clica no botão. Execute e teste na prévia.",
    hint: "Encontre a string entre aspas na linha que define textContent. Troque só a frase, mantendo as aspas.",
    solution: lessonExamples.js.code.replace("Você conseguiu!", "Código feito por mim!"),
    isComplete: (code) => !code.includes("Você conseguiu!") && code.includes("textContent"),
  },
};
let activeLanguage = "html";
let activeChallenge = "html";
let completedChallenges = new Set();

try {
  completedChallenges = new Set(JSON.parse(localStorage.getItem(COMPLETED_CHALLENGES_KEY) || "[]"));
} catch {
  completedChallenges = new Set();
}

document.querySelector("#year").textContent = new Date().getFullYear();

function drawGlobe(time = 0) {
  const bounds = globeCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  const width = bounds.width;
  const height = bounds.height;

  if (globeCanvas.width !== Math.round(width * pixelRatio) || globeCanvas.height !== Math.round(height * pixelRatio)) {
    globeCanvas.width = Math.round(width * pixelRatio);
    globeCanvas.height = Math.round(height * pixelRatio);
  }

  globeContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  globeContext.clearRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height * 0.67;
  const radius = Math.min(width * 0.39, height * 0.72);
  const rotation = reduceMotion ? 0.18 : time * 0.000045;
  const cosRotation = Math.cos(rotation);
  const sinRotation = Math.sin(rotation);

  for (let latitude = -84; latitude <= 84; latitude += 5) {
    const latitudeRadians = latitude * Math.PI / 180;
    const cosLatitude = Math.cos(latitudeRadians);
    const sinLatitude = Math.sin(latitudeRadians);

    for (let longitude = -180; longitude < 180; longitude += 5) {
      const longitudeRadians = longitude * Math.PI / 180;
      const x = cosLatitude * Math.sin(longitudeRadians);
      const z = cosLatitude * Math.cos(longitudeRadians);
      const rotatedX = x * cosRotation + z * sinRotation;
      const rotatedZ = z * cosRotation - x * sinRotation;

      if (rotatedZ <= 0) continue;

      const pointX = centerX + rotatedX * radius;
      const pointY = centerY - sinLatitude * radius;
      const alpha = 0.1 + rotatedZ * 0.52;
      const pointSize = 0.55 + rotatedZ * 0.8;
      globeContext.fillStyle = `rgba(64, 177, 218, ${alpha})`;
      globeContext.beginPath();
      globeContext.arc(pointX, pointY, pointSize, 0, Math.PI * 2);
      globeContext.fill();
    }
  }

  for (let longitude = -150; longitude <= 150; longitude += 30) {
    const longitudeRadians = longitude * Math.PI / 180;
    globeContext.beginPath();
    let drawing = false;

    for (let latitude = -88; latitude <= 88; latitude += 2) {
      const latitudeRadians = latitude * Math.PI / 180;
      const x = Math.cos(latitudeRadians) * Math.sin(longitudeRadians);
      const z = Math.cos(latitudeRadians) * Math.cos(longitudeRadians);
      const rotatedX = x * cosRotation + z * sinRotation;
      const rotatedZ = z * cosRotation - x * sinRotation;

      if (rotatedZ <= 0) {
        drawing = false;
        continue;
      }

      const pointX = centerX + rotatedX * radius;
      const pointY = centerY - Math.sin(latitudeRadians) * radius;
      if (!drawing) globeContext.moveTo(pointX, pointY);
      else globeContext.lineTo(pointX, pointY);
      drawing = true;
    }

    globeContext.strokeStyle = "rgba(65, 166, 202, 0.12)";
    globeContext.lineWidth = 1;
    globeContext.stroke();
  }

  if (!reduceMotion) window.requestAnimationFrame(drawGlobe);
}

drawGlobe();
if (reduceMotion) window.addEventListener("resize", () => drawGlobe());

function renderPreview() {
  const html = lessonExamples.html.code;
  const css = lessonExamples.css.code.replace(/<\/style/gi, "<\\/style");
  const js = lessonExamples.js.code.replace(/<\/script/gi, "<\\/script");
  previewFrame.srcdoc = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
}

function saveActiveCode() {
  lessonExamples[activeLanguage].code = codeInput.value;
}

function updateChallengeFeedback(recordCompletion = false) {
  const challenge = challengeData[activeChallenge];
  const passed = challenge.isComplete(lessonExamples[activeChallenge].code);
  if (passed && recordCompletion && !completedChallenges.has(activeChallenge)) {
    completedChallenges.add(activeChallenge);
    try {
      localStorage.setItem(COMPLETED_CHALLENGES_KEY, JSON.stringify([...completedChallenges]));
    } catch {}
  }
  challengeChoices.forEach((choice) => {
    const isComplete = completedChallenges.has(choice.dataset.challenge);
    choice.classList.toggle("is-complete", isComplete);
    choice.title = isComplete ? "Missão concluída neste navegador" : "Missão ainda não concluída";
  });
  document.querySelector("#challenge-progress").textContent = `${completedChallenges.size} de 3 missões concluídas neste navegador`;
  const isCompleted = completedChallenges.has(activeChallenge);
  challengeFeedback.textContent = isCompleted
    ? "Missão concluída. Você alterou o código e executou a prévia."
    : passed
      ? "Boa alteração. Execute a prévia para concluir a missão."
      : "Edite o exemplo ou carregue uma solução para concluir a missão.";
  challengeFeedback.classList.toggle("is-complete", isCompleted);
}

function selectLanguage(language) {
  lessonExamples[activeLanguage].code = codeInput.value;
  activeLanguage = language;
  const example = lessonExamples[language];
  lessonTabs.forEach((tab) => {
    const isSelected = tab.dataset.language === language;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
  });
  lessonFilename.textContent = example.filename;
  codeInput.value = example.code;
  codeInput.setAttribute("aria-label", `Editor de código ${example.filename}`);
  lessonCode.setAttribute("aria-labelledby", `tab-${language}`);
  lessonExplanation.textContent = example.explanation;
  updateChallengeFeedback();
}

function selectChallenge(language) {
  activeChallenge = language;
  const challenge = challengeData[language];
  challengeChoices.forEach((choice) => {
    const isSelected = choice.dataset.challenge === language;
    choice.classList.toggle("is-active", isSelected);
    choice.setAttribute("aria-selected", String(isSelected));
  });
  challengeContent.setAttribute("aria-labelledby", `challenge-choice-${language}`);
  challengeContent.querySelector(".challenge-level").textContent = challenge.label;
  challengeContent.querySelector("h3").textContent = challenge.title;
  challengeContent.querySelector("p:not(.challenge-feedback)").textContent = challenge.description;
  challengeFeedback.textContent = "";
  selectLanguage(language);
}

function applyCurrentCode() {
  saveActiveCode();
  renderPreview();
  updateChallengeFeedback(true);
}

codeInput.value = lessonExamples.html.code;
selectLanguage("html");
renderPreview();

lessonTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectLanguage(tab.dataset.language);
  });
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = [...lessonTabs].indexOf(tab);
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = lessonTabs[(currentIndex + offset + lessonTabs.length) % lessonTabs.length];
    nextTab.focus();
    nextTab.click();
  });
});

codeInput.addEventListener("input", () => {
  saveActiveCode();
  updateChallengeFeedback();
  if (liveUpdate.checked) renderPreview();
});

codeInput.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    event.preventDefault();
    const start = codeInput.selectionStart;
    codeInput.setRangeText("  ", start, codeInput.selectionEnd, "end");
    codeInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
});

runButton.addEventListener("click", applyCurrentCode);

resetButton.addEventListener("click", () => {
  lessonExamples[activeLanguage].code = initialExamples[activeLanguage].code;
  selectLanguage(activeLanguage);
  renderPreview();
  challengeFeedback.textContent = "Exemplo original restaurado.";
  challengeFeedback.classList.remove("is-complete");
});

challengeChoices.forEach((choice) => {
  choice.addEventListener("click", () => selectChallenge(choice.dataset.challenge));
  choice.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = [...challengeChoices].indexOf(choice);
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextChoice = challengeChoices[(currentIndex + offset + challengeChoices.length) % challengeChoices.length];
    nextChoice.focus();
    nextChoice.click();
  });
});

challengeHintButton.addEventListener("click", () => {
  challengeFeedback.textContent = challengeData[activeChallenge].hint;
  challengeFeedback.classList.remove("is-complete");
});

challengeSolutionButton.addEventListener("click", () => {
  const solution = challengeData[activeChallenge].solution;
  selectLanguage(activeChallenge);
  lessonExamples[activeChallenge].code = solution;
  codeInput.value = solution;
  renderPreview();
  challengeFeedback.textContent = "Exemplo carregado no editor. Edite a solução para torná-la sua.";
  challengeFeedback.classList.add("is-complete");
});

portfolioAction.addEventListener("click", () => {
  const isOpen = portfolioAction.getAttribute("aria-expanded") === "true";
  portfolioAction.setAttribute("aria-expanded", String(!isOpen));
  portfolioProjects.classList.toggle("is-highlighted", !isOpen);
  portfolioAction.firstChild.textContent = isOpen ? "Ver projetos " : "Projetos encontrados ";
});

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    navigation.classList.remove("is-open");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!CONTACT_EMAIL && !WHATSAPP_NUMBER) {
    status.textContent = "Para receber pedidos, configure CONTACT_EMAIL ou WHATSAPP_NUMBER no início de script.js. Nenhum dado foi enviado.";
    return;
  }

  const fields = new FormData(form);
  const message = `Olá! Quero saber mais sobre o curso Prime Code.\nNome: ${fields.get("name")}\nE-mail: ${fields.get("email")}\nExperiência: ${fields.get("level")}`;

  if (WHATSAPP_NUMBER) {
    status.textContent = "Abrindo o WhatsApp para você confirmar o envio da mensagem.";
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    return;
  }

  const subject = encodeURIComponent("Informações sobre o curso Prime Code");
  status.textContent = "Abrindo seu aplicativo de e-mail para você confirmar o envio.";
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
});