const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
    SCALE: 4
};

window.onload = function(){
    const canvasEL = document.querySelector('canvas');
    const context = canvasEL.getContext('2d');

    canvasEL.width = GameViewport.WIDTH;
    canvasEL.height = GameViewport.HEIGHT;

    canvasEL.style.width = `${GameViewport.WIDTH * GameViewport.SCALE}px`;
    canvasEL.style.height = `${GameViewport.HEIGHT * GameViewport.SCALE}px`;

    console.log(context);
}