const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.onload = function(){
    const canvasEL = document.querySelector('canvas');
    const context = canvasEL.getContext('2d');

    canvasEL.width = GameViewport.WIDTH;
    canvasEL.height = GameViewport.HEIGHT;

    const [ken, backgroundKen] = document.querySelectorAll('img');

    const position = {
        x: GameViewport.WIDTH /2 - ken.width / 2,
        y: 110,
    };

    let velosity = 2;

    function frame() {
        position.x += velosity;

        if(position.x > GameViewport.WIDTH - ken.width || position.x < 0) {
           velosity = -velosity;
        }

        //context.clearRect(0, 0, GameViewport.WIDTH, GameViewport.HEIGHT);
        context.drawImage(backgroundKen, 0, 0);

        // context.strokeStyle = 'yellow';
        // context.moveTo(0, 0);
        // context.lineTo(GameViewport.WIDTH, GameViewport.HEIGHT);
        // context.moveTo(GameViewport.WIDTH, 0);
        // context.lineTo(0, GameViewport.HEIGHT);
        // context.stroke();

        context.drawImage(ken, position.x, position.y);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);

    console.log(context);
}