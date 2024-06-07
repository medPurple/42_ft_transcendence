import json

from channels.generic.websocket import WebsocketConsumer

from .models import Game

# loggers
import logging
logger = logging.getLogger(__name__)

class Challenger(WebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = None
		self.waitingA = True
		self.waitingB = False

	def connect(self):
		# logger.debug("je passe ici")
		self.accept()
		self.send(text_data=json.dumps({"message": "Internet"}))

	async def disconnect(self, code):
		logger.debug("je m'en vais")
		pass

	def performAttack(self, action):
		print("Performing an attack")
		# Add the code to perform an attack
	
	def runAway(self):
		print("Running away")
		# Add the code to run away
	
	def changePokemon(self, action):
		print("Changing Pokemon")
		# Add the code to change Pokemon
	
	def useItem(self, action):
		print("Using an item from the inventory")
		# Add the code to use an item

	# recup l'id du joueur et le matchId
	def receive(self, text_data):
		try:
			# Essayer de charger le texte comme JSON
			data = json.loads(text_data)
		except json.JSONDecodeError:
			# Si une erreur de décodage se produit, gérer le cas où le texte n'est pas JSON valide
			# print("Erreur : Le texte reçu n'est pas un JSON valide")
			return

		try:
			self.game = Game.objects.get(idGame=10)
			self.send(text_data=json.dumps({"message": "ca marche"}))
		except Game.DoesNotExist:
			print("Player with idPlayer=1 does not exist")

		action = data.get('content')
		# Convert action to integer if it's a string
		if isinstance(action, str) and action.isdigit():
			action = int(action)
		# Check the value of action and perform actions accordingly
			if 0 <= action <= 3:
				self.performAttack(action)
			elif action == 4:
				self.runAway()
			elif 5 <= action <= 10:
				self.changePokemon(action)
			elif action >= 11:
				self.useItem(action)
			else:
				print("Invalid action")
			# print("content :" + action)
		if (self.game != None):
			responseData = {
				"nameA": self.game.idPlayerA.idIndividual1.name,
				"nameB": self.game.idPlayerB.idIndividual1.name,
				"hpA": str(self.game.idPlayerA.idIndividual1.hp),
				"hpB": str(self.game.idPlayerB.idIndividual1.hp),
				"hpMaxA": str(self.game.idPlayerA.idIndividual1.hp_max),
				"hpMaxB": str(self.game.idPlayerB.idIndividual1.hp_max),
				"lvlA": str(self.game.idPlayerA.idIndividual1.lvl),
				"lvlB": str(self.game.idPlayerB.idIndividual1.lvl),
				"att1": self.game.idPlayerA.idIndividual1.id_att1.name,
				"att1Pow": "Charge",
				"att1Type": "0",
				"att2": self.game.idPlayerA.idIndividual1.id_att2.name,
				"att2Pow": "Charge",
				"att2Type": "0",
				"att3": "",
				"att3Pow": "Charge",
				"att3Type": "0",
				"att4": "",
				"att4Pow": "Charge",
				"att4Type": "0",
				"xpRate": str(self.game.idPlayerA.idIndividual1.xpActual / self.game.idPlayerA.idIndividual1.xpTpReachNextLvl),
				"lastMoveA": "Charge",
				"lastMoveB": "Charge",
				"effA": "0",
				"effB": "0",
				"fastest": "0",
				"arenaType": "1",
			}
		else :
			responseData = {
				"message": "Erreur"
			}
		self.send(text_data=json.dumps(responseData))

		# self.send(text_data=json.dumps({"message": msg}))

