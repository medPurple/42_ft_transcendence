import time 
import threading
import asyncio
import random
import logging
import time
from channels.layers import get_channel_layer
from . import initvalues as iv
from .models import GameSettings

logger = logging.getLogger(__name__)

map_locations = {
    iv.NORTH_WEST: [100, 50],
    iv.NORTH: [100, 0],
    iv.NORTH_EAST: [100, -50],
    iv.WEST: [0, 50],
    iv.CENTER: [0, 0],
    iv.EAST: [0, -50],
    iv.SOUTH_WEST: [-100, 50],
    iv.SOUTH: [-100, 0],
    iv.SOUTH_EAST: [-100, -50]
}

remote_parties = []
local_parties = []

class   paddleC:

    def __init__(self, player, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if (player == 1):
            self.positionX = iv.PADDLE1_POSITION_X
            self.positionY = 0
            self.scaleY = 0
            self.scaleZ = 0
            self.width = iv.PADDLE1_WIDTH
            self.height = iv.PADDLE1_HEIGHT
            self.dirY = iv.PADDLE1_DIR_Y
            self.speed = iv.PADDLE1_SPEED
            self.powerup = iv.NONE_PU
            self.move = "false"
        else :
            self.positionX = iv.PADDLE2_POSITION_X
            self.positionY = 0
            self.scaleY = 0
            self.scaleZ = 0
            self.width = iv.PADDLE2_WIDTH
            self.height = iv.PADDLE2_HEIGHT
            self.dirY = iv.PADDLE2_DIR_Y
            self.speed = iv.PADDLE2_SPEED
            self.powerup = iv.NONE_PU
            self.move = "false"

class   ballC:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.positionX = iv.BALL_POSITION_X
        self.positionY = iv.BALL_POSITION_Y
        self.dirX = iv.BALL_DIR_X
        self.dirY = iv.BALL_DIR_Y
        self.speed = iv.BALL_SPEED
        self.boosted = 0


class   gameStateC:

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.game_mode = 0
        self.task = 0
        self.match_object = 0
        self.player1_user_id = 0 
        self.player2_user_id = 0
        self.group_name = 0
        self.players_nb = 0
        self.player1Score = iv.PADDLE1_SCORE
        self.player2Score = iv.PADDLE2_SCORE
        self.limitScore = 7
        self.paddle1 = paddleC(1)
        self.paddle2 = paddleC(2)
        self.ball = ballC()
        self.powerUpTimer = 0
        self.pauseTimer = 0
        self.powerUpState = iv.PU_NO
        self.powerUpPositionX = iv.DEFAULT_PU_LOC 
        self.powerUpPositionY = iv.DEFAULT_PU_LOC 
        self.activePowerUp = iv.NONE_PU
        self.shouldHandlePowerUp = 0
        self.status = iv.NOT_STARTED
        self._lock = threading.Lock()

    async def run_game_loop(self):
        self.status = iv.RUNNING
        while (self.status == iv.RUNNING or self.status == iv.PAUSED):
            with self._lock:
                if(self.status == iv.PAUSED):
                    self.checkPauseTimer()
                if (self.status == iv.RUNNING):
                    #logger.info(self.status)
                    if (self.shouldHandlePowerUp):
                        self.powerUpHandling(self.ball, self.paddle1, self.paddle2) # Lancer que si powerup actif
                    self.ballPhysics(self.ball)
                    if (self.shouldHandlePowerUp):
                        self.isBallOnPowerUp(self.ball, self.paddle1, self.paddle2) # Lancer que si powerup actif	
                    self.paddlePhysics(self.ball, self.paddle1, self.paddle2)
                    self.paddle1Movement(self.paddle1)
                    self.paddle2Movement(self.paddle2)

            await asyncio.sleep(0.032)
            #self.logObject()
            await self.broadcastGameState()
        if (self.status == iv.FINISHED):
            logger.info("J'arrete la partie")
            await self.stopGame()

    async def stopGame(self):
        if (self.game_mode == 'remote'):
            global remote_parties
            remote_parties.remove(self)
            

    def checkPauseTimer(self):
        if (time.time() - self.pauseTimer > 5):
            self.status = iv.FINISHED

    def popPowerUp(self):
        global map_locations
        powerUpLoc = chr(random.randint(0, 8) + ord('0'))
        self.powerUpPositionX = map_locations[powerUpLoc][0]
        self.powerUpPositionY = map_locations[powerUpLoc][1]
        self.activePowerUp = random.randint(0, 3)
        self.powerUpState = iv.PU_ON_FIELD
        self.powerUpTimer = time.time()

    def depopPowerUp(self):
        self.powerUpPositionX = iv.DEFAULT_PU_LOC
        self.powerUpPositionY = iv.DEFAULT_PU_LOC 
        self.activePowerUp = iv.NONE_PU 
        self.powerUpState = iv.PU_NO
        self.powerUpTimer = time.time()

    def resetPowerUp(self):
        self.powerUpPositionX = iv.DEFAULT_PU_LOC
        self.powerUpPositionY = iv.DEFAULT_PU_LOC 
        self.activePowerUp = iv.NONE_PU 
        self.powerUpState = iv.PU_NO
        self.paddle1.powerup = iv.NONE_PU
        self.paddle2.powerup = iv.NONE_PU
        self.powerUpTimer = time.time()

    def powerUpHandling(self, ball, paddle1, paddle2):
        if (self.powerUpState == iv.PU_NO and time.time() - self.powerUpTimer >= 3):
            self.popPowerUp()
        if (self.powerUpState == iv.PU_ON_FIELD and time.time() - self.powerUpTimer >= 30):
            self.depopPowerUp()
        if (self.powerUpState == iv.PU_ON_PLAYER and time.time() - self.powerUpTimer >= 15):
            self.resetPowerUp()

    def ballPhysics(self, ball):
        if ((self.paddle1.powerup == iv.SELF_BALL_ACCEL and ball.dirX > 0) or (self.paddle2.powerup == iv.SELF_BALL_ACCEL and ball.dirX < 0)):
            ball.boosted = 1
            ball.speed *= 1.5
        if (ball.positionX <= -iv.FIELD_WIDTH / 2):
            self.resetBall(self.ball, 2)
        if (ball.positionX >= iv.FIELD_WIDTH / 2):
            self.resetBall(self.ball, 1)
        if (ball.positionY <= -iv.FIELD_HEIGHT / 2):
            ball.dirY = -ball.dirY
        if (ball.positionY >= iv.FIELD_HEIGHT / 2):
            ball.dirY = -ball.dirY
        ball.positionX += ball.dirX * ball.speed
        ball.positionY += ball.dirY * ball.speed
        if (ball.dirY > ball.speed * 2):
            ball.dirY = ball.speed * 2
        if (ball.dirY < -ball.speed * 2):
            ball.dirY = -ball.speed * 2
        if (ball.boosted == 1):
            ball.boosted = 0
            ball.speed /= 1.5

    def applyHeightChange(self, paddle):
        if (self.activePowerUp == iv.SELF_BIG_PADDLE):
            paddle.height = iv.PADDLE1_AUGMENTED_HEIGHT
        if (self.activePowerUp == iv.OTHER_SMALL_PADDLE):
            if (paddle == self.paddle1):
                self.paddle2.height == iv.PADDLE2_DIMINISHED_HEIGHT
            else:
                self.paddle1.height == iv.PADDLE1_DIMINISHED_HEIGHT

    def pickupPowerUp(self, paddle):
        paddle.powerup = self.activePowerUp
        if (self.activePowerUp == iv.OTHER_SMALL_PADDLE or self.activePowerUp == iv.SELF_BIG_PADDLE):
            self.applyHeightChange(paddle)
        self.powerUpPositionX = iv.DEFAULT_PU_LOC
        self.powerUpPositionY = iv.DEFAULT_PU_LOC
        self.powerUpState = iv.PU_ON_PLAYER
        self.powerUpTimer = time.time()

    def isBallOnPowerUp(self, ball, paddle1, paddle2):
        if (ball.positionX <= self.powerUpPositionX + iv.PU_OFFSET and ball.positionX >= self.powerUpPositionX - iv.PU_OFFSET):
            if (ball.positionY <= self.powerUpPositionY + iv.PU_OFFSET and ball.positionY >= self.powerUpPositionY - iv.PU_OFFSET):
                if (ball.dirX < 0):
                    self.pickupPowerUp(paddle2)
                else :
                    self.pickupPowerUp(paddle1)

    def resetBall(self, ball, index):
        ball.positionX = 0
        ball.positionY = 0

        if (index == 1):
            self.player1Score += 1
            ball.dirX = -1
        else:
            self.player2Score += 1
            ball.dirX = 1
        ball.dirY = 1
        if (ball.boosted == 1):
            ball.speed /= 1.5
            ball.boosted = 0
        self.resetPowerUp()
        self.checkForScore()

    def checkForScore(self):
        if (self.player1Score == self.limitScore or self.player2Score == self.limitScore):
            self.status = iv.FINISHED

    def paddlePhysics(self, ball, paddle1, paddle2):
        if (ball.positionX <= paddle1.positionX + paddle1.width and ball.positionX >= paddle1.positionX):
            if (ball.positionY <= paddle1.positionY + paddle1.height / 2 and ball.positionY >= paddle1.positionY - paddle1.height / 2):
                if (ball.dirX < 0):
                    ball.dirX = -ball.dirX
                    ball.dirY -= paddle1.dirY * 0.4
        if (ball.positionX <= paddle2.positionX and ball.positionX >= paddle2.positionX - paddle2.width):
            if (ball.positionY <= paddle2.positionY + paddle2.height / 2 and ball.positionY >= paddle2.positionY - paddle2.height / 2):
                if (ball.dirX > 0):
                    ball.dirX = -ball.dirX
                    ball.dirY -= paddle2.dirY * 0.4

    def paddle1Movement(self, paddle1):
        if (paddle1.move == "left"):
            if (paddle1.positionY < iv.FIELD_HEIGHT * 0.45):
                paddle1.dirY = paddle1.speed * 0.5
            else:
                paddle1.dirY = 0
        elif (paddle1.move == "right"):
            if (paddle1.positionY > -iv.FIELD_HEIGHT * 0.45):
                paddle1.dirY = -paddle1.speed * 0.5
            else:
                paddle1.dirY = 0
        else:
            paddle1.dirY = 0
        paddle1.scaleY += (1 - paddle1.scaleY) * 0.2
        paddle1.scaleZ += (1 - paddle1.scaleZ) * 0.2
        paddle1.positionY += paddle1.dirY

    def paddle2Movement(self, paddle2):
        if (paddle2.move == "right"):
            if (paddle2.positionY < iv.FIELD_HEIGHT * 0.45):
                paddle2.dirY = paddle2.speed * 0.5
            else:
                paddle2.dirY = 0
        elif (paddle2.move == "left"):
            if (paddle2.positionY > -iv.FIELD_HEIGHT * 0.45):
                paddle2.dirY = -paddle2.speed * 0.5
            else:
                paddle2.dirY = 0
        else:
            paddle2.dirY = 0
        paddle2.scaleY += (1 - paddle2.scaleY) * 0.2
        paddle2.scaleZ += (1 - paddle2.scaleZ) * 0.2
        paddle2.positionY += paddle2.dirY

    async def broadcastGameState(self):
        channel_layer = get_channel_layer()
        await channel_layer.group_send(
            self.group_name,
            {
                "type": "game.state",
                "game_state": {
                    "player1_user_id": self.player1_user_id,
                    "player2_user_id": self.player2_user_id,
                    "player1Score": self.player1Score,
                    "player2Score": self.player2Score,
                    "limitScore": self.limitScore,
                    "paddle1.positionX": self.paddle1.positionX,
                    "paddle1.positionY": self.paddle1.positionY,
                    "paddle1.width": self.paddle1.width,
                    "paddle1.powerup": self.paddle1.powerup,
                    "paddle2.positionX": self.paddle2.positionX,
                    "paddle2.positionY": self.paddle2.positionY,
                    "paddle2.width": self.paddle2.width,
                    "paddle2.powerup": self.paddle2.powerup,
                    "ball.positionX": self.ball.positionX,
                    "ball.positionY": self.ball.positionY,
                    "powerup.state": self.powerUpState,
                    "powerup.positionX": self.powerUpPositionX,
                    "powerup.positionY": self.powerUpPositionY,
                    "powerup.active": self.activePowerUp,
                    "status": self.status
                }
            }
        )
            
    def logObject(self):

        logbuff = self
        logger.info("group_name : %s" % (logbuff.group_name))
        logger.info("players_nb : %d" % (logbuff.players_nb))
        logger.info("player1Score : %d" % (logbuff.player1Score))
        logger.info("player2Score : %d" % (logbuff.player2Score))
        logger.info("paddle1.positionX : %d" % (logbuff.paddle1.positionX))
        logger.info("paddle1.positionY : %d" % (logbuff.paddle1.positionY))
        logger.info("paddle1.scaleY : %d" % (logbuff.paddle1.scaleY))
        logger.info("paddle1.scaleZ : %d" % (logbuff.paddle1.scaleZ))
        logger.info("paddle1.width : %d" % (logbuff.paddle1.width))
        logger.info("paddle1.height : %d" % (logbuff.paddle1.height))
        logger.info("paddle1.dirY : %d" % (logbuff.paddle1.dirY))
        logger.info("paddle1.speed : %d" % (logbuff.paddle1.speed))
        logger.info("paddle1.move : %s" % (logbuff.paddle1.move))
        logger.info("paddle2.positionX : %d" % (logbuff.paddle2.positionX))
        logger.info("paddle2.positionY : %d" % (logbuff.paddle2.positionY))
        logger.info("paddle2.scaleY : %d" % (logbuff.paddle2.scaleY))
        logger.info("paddle2.scaleZ : %d" % (logbuff.paddle2.scaleZ))
        logger.info("paddle2.width : %d" % (logbuff.paddle2.width))
        logger.info("paddle2.height : %d" % (logbuff.paddle2.height))
        logger.info("paddle2.dirY : %d" % (logbuff.paddle2.dirY))
        logger.info("paddle2.speed : %d" % (logbuff.paddle2.speed))
        logger.info("paddle2.move : %s" % (logbuff.paddle2.move))
        logger.info("ball.positionY : %d" % (logbuff.ball.positionY))
        logger.info("ball.positionX : %d" % (logbuff.ball.positionX))
        logger.info("ball.dirX : %d" % (logbuff.ball.dirX))
        logger.info("ball.dirY : %d" % (logbuff.ball.dirY))
        logger.info("ball.speed : %d" % (logbuff.ball.speed))
        logger.info("active : %d" % (logbuff.active))

