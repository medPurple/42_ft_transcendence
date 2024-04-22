import time 
import threading
import asyncio
from . import initvalues

class   paddleC:

    def __init__(self, player, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if (player == 1):
            self.positionX = initvalues.PADDLE1_POSITION_X
            self.width = initvalues.PADDLE1_WIDTH
            self.dirY = initvalues.PADDLE1_DIR_Y
            self.speed = initvalues.PADDLE1_SPEED
            self.move = "false";
        else :
            self.positionX = initvalues.PADDLE2_POSITION_X
            self.width = initvalues.PADDLE2_WIDTH
            self.dirY = initvalues.PADDLE2_DIR_Y
            self.speed = initvalues.PADDLE2_SPEED
            self.move = "false";

class   ballC:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.positionX = initvalues.BALL_POSITION_X
        self.positionY = initvalues.BALL_POSITION_Y
        self.dirX = initvalues.BALL_DIR_X
        self.dirY = initvalues.BALL_DIR_Y
        self.speed = initvalues.BALL_SPEED


class   gameStateC:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.group_name = 0
        self.players_nb = 0
        self.player1Score = initvalues.PADDLE1_SCORE
        self.player2Score = initvalues.PADDLE2_SCORE
        self.paddle1 = 0
        self.paddle2 = 0
        self.ball = ballC()
        self.active = 0
        self._lock = threading.Lock()

    async def run_game_loop(self):
        self.active = 1 
        while self.active:
            with self._lock:
                self.ballPhysics(self.ball)
                self.paddlePhysics()
                self.paddle1Movement()
                self.paddle2Movement()
            await asyncio.sleep(0.016)
            await self.broadcastGameState()

    def ballPhysics(self, ball):
        if (ball.positionX <= -initvalues.FIELD_WIDTH / 2):
            self.resetBall(2)
        if (ball.positionX >= initvalues.FIELD_WIDTH / 2):
            self.resetBall(1)
        if (ball,positionY <= -initvalues.FIELD_WIDTH / 2):
            ball.dirY = -ball.dirY
        if (ball,positionY >= initvalues.FIELD_WIDTH / 2):
            ball.dirY = -ball.dirY
        ball.positionX += ball.dirX * ball.speed
        ball.positionY += ball.dirY * ball.speed
        if (ball.dirY > ball.speed * 2):
            ball.dirY = ball.speed * 2
        if (ball.dirY < -ball.speed * 2):
            ball.dirY = -ball.speed * 2

