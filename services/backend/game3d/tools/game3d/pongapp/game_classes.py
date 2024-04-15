import time 

class   paddleC:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.position.x;
        self.position.y;
        self.position.z;
        self.width;
        self.height;
        self.scale.x;
        self.scale.y;
        self.scale.z;
        

class   ballC:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.position.x;
        self.position.y;
        self.position.z;
        self.width;
        self.height;
        self.scale.x;
        self.scale.y;
        self.scale.z;
 


class   gameState:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.players_nb = 0;
        self.player1Score = 0;
        self.player2Score = 0;
        self.paddle1;
        self.paddle2;
        self.ball = ballC();
        self.active = false;
    
