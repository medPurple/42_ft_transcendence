import time 

class   paddleC:

    def __init__(self, *args, **kwargs):
        #super().__init__(*args, **kwargs)
        self.positionX = 0;
        self.positionY = 0;
        self.positionZ = 0;
        self.width = 0;
        self.height = 0;
        self.scaleX = 0
        self.scaleY = 0;
        self.scaleZ = 0;
        

class   ballC:

    def __init__(self, *args, **kwargs):
        #super().__init__(*args, **kwargs)
        self.positionX = 0;
        self.positionY = 0;
        self.positionZ = 0;
        self.width = 0;
        self.height = 0;
        self.scaleX = 0;
        self.scaleY = 0;
        self.scaleZ = 0;
 


class   gameStateC:

    def __init__(self, *args, **kwargs):
        #super().__init__(*args, **kwargs)
        self.group_name = 0;
        self.players_nb = 0;
        self.player1Score = 0;
        self.player2Score = 0;
        self.paddle1 = 0;
        self.paddle2 = 0;
        self.ball = ballC();
        self.active = 0;
    
