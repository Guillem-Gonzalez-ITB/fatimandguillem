const loadNamesBtn = document.getElementById("loadNames");
const spinBtn = document.getElementById("spin");
const nameOutput = document.getElementById("nameOutput");
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

let names = [];
let currentAngle = 0;

// Funció per carregar noms des d'un fitxer
loadNamesBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("./noms.txt");
    const text = await response.text();
    names = text.split("\n").map(name => name.trim()).filter(name => name);
    drawWheel();
    drawArrow();
    alert("Noms carregats!");
  } catch (error) {
    alert("Error carregant els noms.");
  }
});

// Funció per dibuixar la ruleta
function drawWheel() {
  const numSegments = names.length;
  const anglePerSegment = (2 * Math.PI) / numSegments;

  names.forEach((name, index) => {
    const startAngle = anglePerSegment * index;
    const endAngle = startAngle + anglePerSegment;

    ctx.beginPath();
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, startAngle, endAngle);
    ctx.fillStyle = index % 2 === 0 ? "#FFD700" : "#FF4500";
    ctx.fill();
    ctx.stroke();

    // Escriure el nom
    const textAngle = startAngle + anglePerSegment / 2;
    const textX = 250 + Math.cos(textAngle) * 150;
    const textY = 250 + Math.sin(textAngle) * 150;

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(textAngle);
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(name, -ctx.measureText(name).width / 2, 0);
    ctx.restore();
  });

}

function drawArrow() {
  const arrowX = 450; // Coordenada X fixa de la punta de la fletxa
  const arrowY = 250; // Coordenada Y fixa al centre vertical

  ctx.beginPath();
  ctx.moveTo(arrowX, arrowY); // Punta de la fletxa
  ctx.lineTo(arrowX + 50, arrowY - 20); // Vora superior
  ctx.lineTo(arrowX + 50, arrowY + 20); // Vora inferior
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
}

// Funció per fer girar la ruleta
spinBtn.addEventListener("click", () => {
  if (!names.length) {
    alert("Primer carrega els noms!");
    return;
  }

  const spinTime = Math.random() * 3 + 3; // 3-6 segons
  const spinAngle = Math.random() * 360; // Angle final
  const spinSpeed = spinAngle / spinTime;

  const interval = setInterval(() => {
    currentAngle += spinSpeed;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(currentAngle * Math.PI / 180);
    ctx.translate(-250, -250);
    drawWheel();
    ctx.restore();
    drawArrow();
  }, 20);

  setTimeout(() => {
    clearInterval(interval);

    // Selecciona el nom
    const selectedIndex = Math.floor(
      ((360 - (currentAngle % 360)) / (360 / names.length)) % names.length
    );
    const selectedName = names[selectedIndex];
    nameOutput.textContent = selectedName;
  }, spinTime * 1000);
});
