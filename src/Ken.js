const ken = document.querySelector('img[alt="Ken"]');

const position = {
    // x: GameViewport.WIDTH /2 - ken.width / 2,
    x: 80,
    y: 110,
};

let velosity = 2;

export function updateKen(context) {
    position.x += velosity;

    if(position.x > context.canvas.width - ken.width || position.x < 0) {
        velosity = -velosity;
    }
}

export function drawKen(context) {
    context.drawImage(ken, position.x, position.y);
}
