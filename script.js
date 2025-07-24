const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
let keys = {};

const player = {
  x: 50, y: 450, width: 30, height: 30,
  dx: 0, dy: 0,
  speed: 2, jump: -10,
  onGround: false
};

const platforms = [
  { x: 0, y: 480, width: 400, height: 20 },
  { x: 50, y: 400, width: 300, height: 10 },
  { x: 0, y: 320, width: 250, height: 10 },
  { x: 150, y: 240, width: 250, height: 10 },
  { x: 0, y: 160, width: 200, height: 10 },
  { x: 100, y: 80, width: 200, height: 10 }
];

const fuego = { x: 280, y: 50, width: 30, height: 30 };

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function update() {
  // Movimiento lateral
  if (keys['ArrowLeft']) player.dx = -player.speed;
  else if (keys['ArrowRight']) player.dx = player.speed;
  else player.dx = 0;

  // Saltar
  if (keys[' '] && player.onGround) {
    player.dy = player.jump;
    player.onGround = false;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Colisión con plataformas
  player.onGround = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y &&
      player.dy >= 0
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.onGround = true;
    }
  });

  // Límite de pantalla
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y > canvas.height) player.y = 450; // Reinicio si cae

  // ¿Ganó?
  if (
    player.x < fuego.x + fuego.width &&
    player.x + player.width > fuego.x &&
    player.y < fuego.y + fuego.height &&
    player.y + player.height > fuego.y
  ) {
    alert('¡Fuego apagado!');
    document.location.reload();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Plataformas
  ctx.fillStyle = '#555';
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Jugador
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Fuego
  ctx.fillStyle = 'red';
  ctx.fillRect(fuego.x, fuego.y, fuego.width, fuego.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();



