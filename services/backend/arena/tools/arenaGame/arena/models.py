from django.db import models
import random

from .utils import getHpStat, getStat

#############################################################################################################
#	CLASSIC DATA TO BATTLE
#############################################################################################################

# TO DO : ajouter l'xp necessaire pour chaque pokemon
# TO DO : faire la table de l'apprentissage de capacites

class Elem(models.Model):
	name = models.CharField(primary_key=True, max_length=255)
	attElemFlotte = models.IntegerField(default=0)
	attElemFeuille = models.IntegerField(default=0)
	attElemChaud = models.IntegerField(default=0)
	attElemBrise = models.IntegerField(default=0)
	attElemSable = models.IntegerField(default=0)
	attElemBagarre = models.IntegerField(default=0)
	attElemCaillou = models.IntegerField(default=0)
	attElemBanal = models.IntegerField(default=0)
	attElemTumeur = models.IntegerField(default=0)
	attElemVolt = models.IntegerField(default=0)
	attElemPsy = models.IntegerField(default=0)
	attElemBou = models.IntegerField(default=0)
	attElemSombre = models.IntegerField(default=0)
	attElemFourmi = models.IntegerField(default=0)
	attElemFroid = models.IntegerField(default=0)
	attElemDragon = models.IntegerField(default=0)

class Attack(models.Model):
	name = models.CharField(primary_key=True, max_length=255)
	elem = models.ForeignKey(Elem, on_delete=models.CASCADE, null=True)
	power = models.IntegerField(default=0)
	variety = models.IntegerField(default=0)
	# 0 -> physique
	# 1 -> special

class Species(models.Model):
	name = models.CharField(primary_key=True, max_length=255)
	elem = models.ForeignKey(Elem, on_delete=models.CASCADE, null=True)
	hp = models.IntegerField(default=0, null=True)
	at = models.IntegerField(default=0, null=True)
	sa = models.IntegerField(default=0, null=True)
	de = models.IntegerField(default=0, null=True)
	sd = models.IntegerField(default=0, null=True)
	sp = models.IntegerField(default=0, null=True)

	# catch rate / xp rate
	rate = models.IntegerField(default=1)

# TO DO : ajouter les attaques de chaque pokemon
class	AttackSpecies(models.Model):
	species = models.ForeignKey(Species, on_delete=models.CASCADE, null=True)
	attack = models.ForeignKey(Attack, on_delete=models.CASCADE, null=True)
	lvl = models.IntegerField(default=0)

class Evolution(models.Model):
	name = models.CharField(primary_key=True, max_length=255)
	species = models.ForeignKey(Species, related_name='evolvesFrom', on_delete=models.CASCADE, null=True)
	evolvesTo = models.ForeignKey(Species, related_name='evolvesTo', on_delete=models.CASCADE, null=True)
	lvl = models.IntegerField(default=0)
	# -1 -> evolution via pierre lune / -2 -> evolution via pierre volt
	# 0 -> evolution par echange

class Individual(models.Model):

	id_ind = models.IntegerField(primary_key=True)
	name = models.CharField(max_length=255, null=True)
	species = models.ForeignKey(Species, on_delete=models.CASCADE, null=True)
	lvl = models.IntegerField(default=0)
	iv_hp = models.IntegerField(default=0)
	iv_at = models.IntegerField(default=0)
	iv_sa = models.IntegerField(default=0)
	iv_de = models.IntegerField(default=0)
	iv_sd = models.IntegerField(default=0)
	iv_sp = models.IntegerField(default=0)
	hp = models.IntegerField(default=0)
	hp_max = models.IntegerField(default=0)
	at = models.IntegerField(default=0)
	sa = models.IntegerField(default=0)
	de = models.IntegerField(default=0)
	sd = models.IntegerField(default=0)
	sp = models.IntegerField(default=0)
	id_att_1 = models.ForeignKey(Attack, related_name='attack_individual_set_1', on_delete=models.CASCADE, null=True)
	id_att_2 = models.ForeignKey(Attack, related_name='attack_individual_set_2', on_delete=models.CASCADE, null=True)
	id_att_3 = models.ForeignKey(Attack, related_name='attack_individual_set_3', on_delete=models.CASCADE, null=True)
	id_att_4 = models.ForeignKey(Attack, related_name='attack_individual_set_4', on_delete=models.CASCADE, null=True)

	expToReachNextLvl = models.FloatField(default=0)
	expActual = models.FloatField(default=0)

	def __init__(self, *args, **kwargs):

		# ~ constructeur 2 arguments pokemon + lvl
		if (len(args) == 2):

			self.iv_hp = random.randint(0, 6)
			self.iv_at = random.randint(0, 6)
			self.iv_sa = random.randint(0, 6)
			self.iv_de = random.randint(0, 6)
			self.iv_sd = random.randint(0, 6)
			self.iv_sp = random.randint(0, 6)
			# voir pour changer intance -> name speces
			self.species = Species.objects.get(name = args[0])
			self.lvl = args[1]
			self.expActual = 0
			self.expToReachNextLvl = self.rate * float(self.lvl) * (3 + 4 * self.lvl / 50)
			# mettre a jour les stats
			self.hp = self.getHpStat(self.species.hp, self.iv_hp, self.lvl)
			self.hp_max = self.getHpStat(self.species.hp, self.iv_hp, self.lvl)
			self.at = self.getStat(self.species.at, self.iv_at, self.lvl)
			self.sa = self.getStat(self.species.sa, self.iv_sa, self.lvl)
			self.de = self.getStat(self.species.de, self.iv_de, self.lvl)
			self.sd = self.getStat(self.species.sd, self.iv_sd, self.lvl)
			self.sp = self.getStat(self.species.sp, self.iv_sp, self.lvl)

		# ~ constructeur 7 arguments pour les evolutions
		# ~ en fait ca sert a rien car si tu veux faire evoluer un pokemon faut juste changer species
		elif (len(args) == 8):
			self.iv_hp = args[0]
			self.iv_at = args[1]
			self.iv_sa = args[2]
			self.iv_de = args[3]
			self.iv_sd = args[4]
			self.iv_sp = args[5]
			# voir pour changer intance -> name species
			self.species = args[6]
			self.lvl = args[7]

	

#	bot attack random
	def	attackSelection(self):
		while (1):
			randNbr = random.randint(0,3)
			if (randNbr == 0 and self.id_att_1 is not None):
				return self.id_att_1
			if (randNbr == 1 and self.id_att_2 is not None):
				return self.id_att_2
			if (randNbr == 2 and self.id_att_3 is not None):
				return self.id_att_3
			if (randNbr == 3 and self.id_att_4 is not None):
				return self.id_att_4
			

	# TO DO ? changer les instances de species en name de species dans la classe evolution ?
	def macronEvolution(self):
		try:
			pokemonGo = Evolution.objects.get(name = self.species.name)
			if (pokemonGo.lvl <= self.lvl and pokemonGo.lvl > 0):
				self.species = pokemonGo.evolvesTo
		except Evolution.DoesNotExist:
			return
	
	def	lvlUp(self):
		self.lvl += 1
		self.hp += self.getHpStat(self.species.hp, self.iv_hp, self.lvl) - self.hp_max
		self.hp_max = self.getHpStat(self.species.hp, self.iv_hp, self.lvl)
		self.at = self.getStat(self.species.at, self.iv_at, self.lvl)
		self.sa = self.getStat(self.species.sa, self.iv_sa, self.lvl)
		self.de = self.getStat(self.species.de, self.iv_de, self.lvl)
		self.sd = self.getStat(self.species.sd, self.iv_sd, self.lvl)
		self.sp = self.getStat(self.species.sp, self.iv_sp, self.lvl)
		# if pokemon doit evoluer
		# change self.species = nouveau species
		self.macronEvolution()
		self.save()

class Item(models.Model):
	name = models.CharField(primary_key=True, max_length=255)
	description = models.TextField(null=True)

class Player(models.Model):
	idPlayer = models.IntegerField(primary_key=True, unique=True)
	isBot = models.BooleanField(default=False)
	idIndividual1 = models.ForeignKey(Individual, related_name='individual_1', on_delete=models.CASCADE, null=True)
	idIndividual2 = models.ForeignKey(Individual, related_name='individual_2', on_delete=models.CASCADE, null=True)
	idIndividual3 = models.ForeignKey(Individual, related_name='individual_3', on_delete=models.CASCADE, null=True)
	idIndividual4 = models.ForeignKey(Individual, related_name='individual_4', on_delete=models.CASCADE, null=True)
	idIndividual5 = models.ForeignKey(Individual, related_name='individual_5', on_delete=models.CASCADE, null=True)
	idIndividual6 = models.ForeignKey(Individual, related_name='individual_6', on_delete=models.CASCADE, null=True)
	inventory = models.ManyToManyField(Item, through='PlayerInventory')

	# mandatory for user
	# userID = models.IntegerField(unique=True)
	userName = models.CharField(max_length=100, unique=True)
	gamesWon = models.IntegerField(default=0)
	gamesLost = models.IntegerField(default=0)
	gamesPlayed = models.IntegerField(default=0)

	def restoreAllIndividual(self):
		individuals = [
			self.idIndividual1, self.idIndividual2, self.idIndividual3,
			self.idIndividual4, self.idIndividual5, self.idIndividual6
		]
		for individual in individuals:
			if individual is not None:
				individual.hp = individual.hp_max
				individual.save()
	
	def get_player_inventory(self):
		myInventory = PlayerInventory.objects.filter(player=self)
		items = [{'item': inv.item.name, 'quantity': inv.quantity} for inv in myInventory]
		return items

class PlayerInventory(models.Model):
	player = models.ForeignKey(Player, on_delete=models.CASCADE, null=True)
	item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
	quantity = models.IntegerField(default=1)


		

# Usage de l'inventaire
# player = Player.objects.create(isBot=False)
# item1 = Item.objects.create(name="Potion", description="Restores 20 HP")
# item2 = Item.objects.create(name="Super Potion", description="Restores 50 HP")

# # Ajouter des objets à l'inventaire du joueur
# player.inventory.add(item1, through_defaults={'quantity': 3})
# player.inventory.add(item2, through_defaults={'quantity': 2})

class Game(models.Model):
	idGame = models.IntegerField(primary_key=True)
	idPlayerA = models.ForeignKey(Player, related_name='player_a_games', on_delete=models.CASCADE, null=True)
	idPlayerB = models.ForeignKey(Player, related_name='player_b_games', on_delete=models.CASCADE, null=True)
	nbPlayer = models.IntegerField(default=2)
	nbAttackWeAreWaitingFor = models.IntegerField(default=2)

	
	# set attack A
	attackA = models.ForeignKey(Attack, related_name="attack_a", on_delete=models.CASCADE, null=True)
	# set attack B
	attackB = models.ForeignKey(Attack, related_name="attack_b", on_delete=models.CASCADE, null=True)

	def individualsAttack(self):
		print(self.idPlayerA, self.idPlayerB, self.attackA, self.attackB)
		
		# mettre en mode attente du choix d'attaque
		self.nbAttackWeAreWaitingFor = self.nbPlayer

	def	updateAttackA(self, attackA):
		# update attack
		self.attackA = attackA
		self.nbAttackWeAreWaitingFor -= 1
		# si on est pret on lance l'attaque
		if (self.nbAttackWeAreWaitingFor == 0):
			self.individualsAttack()
		print("A")

	def	updateAttackB(self, attackB):
		# update attack
		self.attackB = attackB
		self.nbAttackWeAreWaitingFor -= 1
		# si on est pret on lance l'attaque
		if (self.nbAttackWeAreWaitingFor == 0):
			self.individualsAttack()
		print("B")

#############################################################################################################
#	IMAGE
#############################################################################################################
#	classe qui wrap des images

# class Image(models.Model):
# 	image_field = models.ImageField(upload_to='jess.png')

# 	def image_url(self):
# 		return self.image_field.url