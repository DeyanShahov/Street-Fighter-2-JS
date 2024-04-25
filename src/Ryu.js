const ryu = document.querySelector('img[alt="Ryu"]');

const position = {
    // x: GameViewport.WIDTH /2 - ken.width / 2,
    x: 80,
    y: 110,
};

let velosity = -2;

export function updateRyu(context) {
    position.x += velosity;

    if(position.x > context.canvas.width - ryu.width || position.x < 0) {
        velosity = -velosity;
    }
}

export function drawRyu(context) {
    context.drawImage(ryu, position.x, position.y);
}