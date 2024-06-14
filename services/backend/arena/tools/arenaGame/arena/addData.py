
from .models import Elem, Attack, Species, Individual, Player, Game, Evolution


from django.db import IntegrityError

# Création d'instances d'elem
def	addData():

#############################################################################################################
#	ELEM DATA
#############################################################################################################

# TO DO : revoir les faiblesses et resistances

	try:

		Elem.objects.all().delete()

		try:
			elemFlotte = Elem.objects.get(name="Flotte")
		except Elem.DoesNotExist:
			elemFlotte = Elem.objects.create(name="Flotte", attElemFlotte=50, attElemFeuille=50, attElemChaud=200, attElemBrise=100, attElemSable=200, attElemBagarre=100, attElemCaillou=200, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemFlotte.save()

		try:
			elemFeuille = Elem.objects.get(name="Feuille")
		except Elem.DoesNotExist:
			elemFeuille = Elem.objects.create(name="Feuille", attElemFlotte=200, attElemFeuille=50, attElemChaud=50, attElemBrise=100, attElemSable=100, attElemBagarre=100, attElemCaillou=100, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemFeuille.save()

		try:
			elemChaud = Elem.objects.get(name="Chaud")
		except Elem.DoesNotExist:
			elemChaud = Elem.objects.create(name="Chaud", attElemFlotte=50, attElemFeuille=200, attElemChaud=50, attElemBrise=200, attElemSable=50, attElemBagarre=100, attElemCaillou=100, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemChaud.save()

		try:
			elemBrise = Elem.objects.get(name="Brise")
		except Elem.DoesNotExist:
			elemBrise = Elem.objects.create(name="Brise", attElemFlotte=100, attElemFeuille=100, attElemChaud=50, attElemBrise=50, attElemSable=200, attElemBagarre=100, attElemCaillou=50, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemBrise.save()

		try:
			elemSable = Elem.objects.get(name="Sable")
		except Elem.DoesNotExist:
			elemSable = Elem.objects.create(name="Sable", attElemFlotte=50, attElemFeuille=100, attElemChaud=200, attElemBrise=50, attElemSable=50, attElemBagarre=100, attElemCaillou=100, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemSable.save()

		try:
			elemBagarre = Elem.objects.get(name="Bagarre")
		except Elem.DoesNotExist:
			elemBagarre = Elem.objects.create(name="Bagarre", attElemFlotte=100, attElemFeuille=100, attElemChaud=100, attElemBrise=100, attElemSable=100, attElemBagarre=50, attElemCaillou=100, attElemBanal=200, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemBagarre.save()

		try:
			elemCaillou = Elem.objects.get(name="Caillou")
		except Elem.DoesNotExist:
			elemCaillou = Elem.objects.create(name="Caillou", attElemFlotte=50, attElemFeuille=100, attElemChaud=100, attElemBrise=200, attElemSable=100, attElemBagarre=100, attElemCaillou=50, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemCaillou.save()

		try:
			elemBanal = Elem.objects.get(name="Banal")
		except Elem.DoesNotExist:
			elemBanal = Elem.objects.create(name="Banal", attElemFlotte=100, attElemFeuille=100, attElemChaud=100, attElemBrise=100, attElemSable=100, attElemBagarre=100, attElemCaillou=100, attElemBanal=50, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemBanal.save()

		try:
			elemTumeur = Elem.objects.get(name="Tumeur")
		except Elem.DoesNotExist:
			elemTumeur = Elem.objects.create(name="Tumeur", attElemFlotte=100, attElemFeuille=200, attElemChaud=100, attElemBrise=100, attElemSable=100, attElemBagarre=100, attElemCaillou=100, attElemBanal=100, attElemTumeur=50, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemTumeur.save()

		try:
			elemVolt = Elem.objects.get(name="Volt")
		except Elem.DoesNotExist:
			elemVolt = Elem.objects.create(name="Volt", attElemFlotte=200, attElemFeuille=100, attElemChaud=100, attElemBrise=100, attElemSable=100, attElemBagarre=100, attElemCaillou=100, attElemBanal=100, attElemTumeur=100, attElemVolt=100, attElemPsy=100, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemVolt.save()
	
		try:
			elemPsy = Elem.objects.get(name="Psy")
		except Elem.DoesNotExist:
			elemPsy = Elem.objects.create(name="Psy", attElemFlotte=100, attElemFeuille=100, attElemChaud=100, attElemBrise=100, attElemSable=100, attElemBagarre=200, attElemCaillou=100, attElemBanal=100, attElemTumeur=200, attElemVolt=100, attElemPsy=50, attElemBou=100, attElemSombre=100, attElemFourmi=100, attElemFroid=100, attElemDragon=100)
			elemPsy.save()

#############################################################################################################
#	ATTACK DATA
#############################################################################################################

		try:
			attBulle = Attack.objects.get(name="Bulle")
		except Attack.DoesNotExist:
			attBulle = Attack.objects.create(name="Bulle", elem=elemFlotte, power=40, variety=1)
			attBulle.save()

		try:
			attFeu = Attack.objects.get(name="Feu")
		except Attack.DoesNotExist:
			attFeu = Attack.objects.create(name="Feu", elem=elemChaud, power=40, variety=1)
			attFeu.save()

		try:
			attTige = Attack.objects.get(name="Tige")
		except Attack.DoesNotExist:
			attTige = Attack.objects.create(name="Tige", elem=elemFeuille, power=40, variety=0)
			attTige.save()

		try:
			attSouffle = Attack.objects.get(name="Souffle")
		except Attack.DoesNotExist:
			attSouffle = Attack.objects.create(name="Souffle", elem=elemBrise, power=40, variety=1)
			attSouffle.save()

		try:
			attTornado = Attack.objects.get(name="Tornado")
		except Attack.DoesNotExist:
			attTornado = Attack.objects.create(name="Tornado", elem=elemBrise, power=80, variety=1)
			attTornado.save()

		try:
			attGriffe = Attack.objects.get(name="Griffe")
		except Attack.DoesNotExist:
			attGriffe = Attack.objects.create(name="Griffe", elem=elemBanal, power=35, variety=0)
			attGriffe.save()

#############################################################################################################
#	SPECIES DATA
#############################################################################################################

		Species.objects.all().delete()

		try:
			speCarapuce = Species.objects.get(name="Carapuce")
		except Species.DoesNotExist:
			speCarapuce = Species.objects.create(name="Carapuce", elem=elemFlotte, hp=44, at=48, sa=50, de=65, sd=64, sp=43)
			speCarapuce.save()

		try:
			speCarabaffe = Species.objects.get(name="Carabaffe")
		except Species.DoesNotExist:
			speCarabaffe = Species.objects.create(name="Carabaffe", elem=elemFlotte, hp=59, at=63, sa=65, de=80, sd=80, sp=58)
			speCarabaffe.save()

		try:
			speTortank = Species.objects.get(name="Tortank")
		except Species.DoesNotExist:
			speTortank = Species.objects.create(name="Tortank", elem=elemFlotte, hp=79, at=83, sa=85, de=100, sd=105, sp=78)
			speTortank.save()

		try:
			speSalameche = Species.objects.get(name="Salameche")
		except Species.DoesNotExist:
			speSalameche = Species.objects.create(name="Salameche", elem=elemChaud, hp=39, at=52, sa=60, de=43, sd=50, sp=65)
			speSalameche.save()

		try:
			speReptincel = Species.objects.get(name="Reptincel")
		except Species.DoesNotExist:
			speReptincel = Species.objects.create(name="Reptincel", elem=elemChaud, hp=58, at=64, sa=80, de=58, sd=65, sp=80)
			speReptincel.save()

		try:
			speDracaufeu = Species.objects.get(name="Dracaufeu")
		except Species.DoesNotExist:
			speDracaufeu = Species.objects.create(name="Dracaufeu", elem=elemChaud, hp=78, at=84, sa=109, de=78, sd=85, sp=100)
			speDracaufeu.save()

		try:
			speBulbizarre = Species.objects.get(name="Bulbizarre")
		except Species.DoesNotExist:
			speBulbizarre = Species.objects.create(name="Bulbizarre", elem=elemFeuille, hp=45, at=49, sa=65, de=49, sd=65, sp=45)
			speBulbizarre.save()

		try:
			speHerbizarre = Species.objects.get(name="Herbizarre")
		except Species.DoesNotExist:
			speHerbizarre = Species.objects.create(name="Herbizarre", elem=elemFeuille, hp=60, at=62, sa=80, de=63, sd=80, sp=60)
			speHerbizarre.save()

		try:
			speFlorizarre = Species.objects.get(name="Florizarre")
		except Species.DoesNotExist:
			speFlorizarre = Species.objects.create(name="Florizarre", elem=elemFeuille, hp=80, at=82, sa=100, de=83, sd=100, sp=80)
			speFlorizarre.save()

		try:
			speRoucoul = Species.objects.get(name="Roucoul")
		except Species.DoesNotExist:
			speRoucoul = Species.objects.create(name="Roucoul", elem=elemBrise, hp=40, at=45, sa=35, de=40, sd=35, sp=56)
			speRoucoul.save()

		try:
			speRoucoups = Species.objects.get(name="Roucoups")
		except Species.DoesNotExist:
			speRoucoups = Species.objects.create(name="Roucoups", elem=elemBrise, hp=63, at=60, sa=50, de=55, sd=50, sp=71)
			speRoucoups.save()

		try:
			speRoucarnage = Species.objects.get(name="Roucarnage")
		except Species.DoesNotExist:
			speRoucarnage = Species.objects.create(name="Roucarnage", elem=elemBrise, hp=83, at=80, sa=70, de=75, sd=70, sp=101)
			speRoucarnage.save()

		try:
			speRattata = Species.objects.get(name="Rattata")
		except Species.DoesNotExist:
			speRattata = Species.objects.create(name="Rattata", elem=elemBanal, hp=30, at=56, sa=25, de=35, sd=35, sp=72)
			speRattata.save()

		try:
			speRattatac = Species.objects.get(name="Rattatac")
		except Species.DoesNotExist:
			speRattatac = Species.objects.create(name="Rattatac", elem=elemBanal, hp=55, at=81, sa=50, de=60, sd=70, sp=97)
			speRattatac.save()

		try:
			speNidoranM = Species.objects.get(name="NidoranM")
		except Species.DoesNotExist:
			speNidoranM = Species.objects.create(name="NidoranM", elem=elemTumeur, hp=46, at=57, sa=40, de=40, sd=40, sp=50)
			speNidoranM.save()

		try:
			speNidorino = Species.objects.get(name="Nidorino")
		except Species.DoesNotExist:
			speNidorino = Species.objects.create(name="Nidorino", elem=elemTumeur, hp=61, at=72, sa=55, de=57, sd=55, sp=65)
			speNidorino.save()

		try:
			speNidoking = Species.objects.get(name="Nidoking")
		except Species.DoesNotExist:
			speNidoking = Species.objects.create(name="Nidoking", elem=elemTumeur, hp=81, at=102, sa=85, de=77, sd=75, sp=85)
			speNidoking.save()

		try:
			spePikachu = Species.objects.get(name="Pikachu")
		except Species.DoesNotExist:
			spePikachu = Species.objects.create(name="Pikachu", elem=elemVolt, hp=35, at=55, sa=50, de=40, sd=50, sp=90)
			spePikachu.save()

		try:
			speRaichu = Species.objects.get(name="Raichu")
		except Species.DoesNotExist:
			speRaichu = Species.objects.create(name="Raichu", elem=elemVolt, hp=60, at=90, sa=90, de=55, sd=80, sp=110)
			speRaichu.save()

		try:
			speMachoc = Species.objects.get(name="Machoc")
		except Species.DoesNotExist:
			speMachoc = Species.objects.create(name="Machoc", elem=elemBagarre, hp=70, at=80, sa=35, de=35, sd=35, sp=35)
			speMachoc.save()

		try:
			speMachopeur = Species.objects.get(name="Machopeur")
		except Species.DoesNotExist:
			speMachopeur = Species.objects.create(name="Machopeur", elem=elemBagarre, hp=80, at=100, sa=50, de=70, sd=60, sp=50)
			speMachopeur.save()

		try:
			speMackogneur = Species.objects.get(name="Mackogneur")
		except Species.DoesNotExist:
			speMackogneur = Species.objects.create(name="Mackogneur", elem=elemBagarre, hp=90, at=130, sa=65, de=80, sd=85, sp=65)
			speMackogneur.save()

		try:
			speFantominus = Species.objects.get(name="Fantominus")
		except Species.DoesNotExist:
			speFantominus = Species.objects.create(name="Fantominus", elem=elemTumeur, hp=30, at=35, sa=100, de=30, sd=35, sp=80)
			speFantominus.save()
		
		try:
			speSpectrum = Species.objects.get(name="Spectrum")
		except Species.DoesNotExist:
			speSpectrum = Species.objects.create(name="Spectrum", elem=elemTumeur, hp=45, at=50, sa=115, de=45, sd=55, sp=95)
			speSpectrum.save()
		
		try:
			speEctoplasma = Species.objects.get(name="Ectoplasma")
		except Species.DoesNotExist:
			speEctoplasma = Species.objects.create(name="Ectoplasma", elem=elemTumeur, hp=60, at=65, sa=130, de=60, sd=75, sp=110)
			speEctoplasma.save()

		try:
			speAbra = Species.objects.get(name="Abra")
		except Species.DoesNotExist:
			speAbra = Species.objects.create(name="Abra", elem=elemPsy, hp=25, at=20, sa=105, de=15, sd=55, sp=90)
			speAbra.save()

		try:
			speKadabra = Species.objects.get(name="Kadabra")
		except Species.DoesNotExist:
			speKadabra = Species.objects.create(name="Kadabra", elem=elemPsy, hp=40, at=35, sa=120, de=30, sd=70, sp=105)
			speKadabra.save()

		try:
			speAlakazam = Species.objects.get(name="Alakazam")
		except Species.DoesNotExist:
			speAlakazam = Species.objects.create(name="Alakazam", elem=elemPsy, hp=55, at=50, sa=135, de=45, sd=85, sp=120)
			speAlakazam.save()

#############################################################################################################
#	EVOLUTION DATA
#############################################################################################################

		try:
			evoBulbizarre = Evolution.objects.get(name="Bulbizarre")
		except Evolution.DoesNotExist:
			evoBulbizarre = Evolution.objects.create(name="Bulbizarre", species=speBulbizarre, evolvesTo=speHerbizarre, lvl=16)
			evoBulbizarre.save()

		try:
			evoHerbizarre = Evolution.objects.get(name="Herbizarre")
		except Evolution.DoesNotExist:
			evoHerbizarre = Evolution.objects.create(name="Herbizarre", species=speHerbizarre, evolvesTo=speFlorizarre, lvl=32)
			evoHerbizarre.save()

		try:
			evoSalameche = Evolution.objects.get(name="Salameche")
		except Evolution.DoesNotExist:
			evoSalameche = Evolution.objects.create(name="Salameche", species=speSalameche, evolvesTo=speReptincel, lvl=16)
			evoSalameche.save()

		try:
			evoReptincel = Evolution.objects.get(name="Reptincel")
		except Evolution.DoesNotExist:
			evoReptincel = Evolution.objects.create(name="Reptincel", species=speReptincel, evolvesTo=speDracaufeu, lvl=32)
			evoReptincel.save()

		try:
			evoCarapuce = Evolution.objects.get(name="Carapuce")
		except Evolution.DoesNotExist:
			evoCarapuce = Evolution.objects.create(name="Carapuce", species=speCarapuce, evolvesTo=speCarabaffe, lvl=16)
			evoCarapuce.save()

		try:
			evoCarabaffe = Evolution.objects.get(name="Carabaffe")
		except Evolution.DoesNotExist:
			evoCarabaffe = Evolution.objects.create(name="Carabaffe", species=speCarabaffe, evolvesTo=speTortank, lvl=32)
			evoCarabaffe.save()

		try:
			evoRoucoul = Evolution.objects.get(name="Roucoul")
		except Evolution.DoesNotExist:
			evoRoucoul = Evolution.objects.create(name="Roucoul", species=speRoucoul, evolvesTo=speRoucoups, lvl=18)
			evoRoucoul.save()

		try:
			evoRoucoups = Evolution.objects.get(name="Roucoups")
		except Evolution.DoesNotExist:
			evoRoucoups = Evolution.objects.create(name="Roucoups", species=speRoucoups, evolvesTo=speRoucarnage, lvl=32)
			evoRoucoups.save()

		try:
			evoRattata = Evolution.objects.get(name="Rattata")
		except Evolution.DoesNotExist:
			evoRattata = Evolution.objects.create(name="Rattata", species=speRattata, evolvesTo=speRattatac, lvl=20)
			evoRattata.save()

		try:
			evoNidoranM = Evolution.objects.get(name="NidoranM")
		except Evolution.DoesNotExist:
			evoNidoranM = Evolution.objects.create(name="NidoranM", species=speNidoranM, evolvesTo=speNidorino, lvl=16)
			evoNidoranM.save()

		try:
			evoNidorino = Evolution.objects.get(name="Nidorino")
		except Evolution.DoesNotExist:
			evoNidorino = Evolution.objects.create(name="Nidorino", species=speNidorino, evolvesTo=speNidoking, lvl=-1)
			evoNidorino.save()

		try:
			evoPikachu = Evolution.objects.get(name="Pikachu")
		except Evolution.DoesNotExist:
			evoPikachu = Evolution.objects.create(name="Pikachu", species=spePikachu, evolvesTo=speRaichu, lvl=-2)
			evoPikachu.save()

		try:
			evoAbra = Evolution.objects.get(name="Abra")
		except Evolution.DoesNotExist:
			evoAbra = Evolution.objects.create(name="Abra", species=speAbra, evolvesTo=speKadabra, lvl=16)
			evoAbra.save()
		
		try:
			evoKadabra = Evolution.objects.get(name="Kadabra")
		except Evolution.DoesNotExist:
			evoKadabra = Evolution.objects.create(name="Kadabra", species=speKadabra, evolvesTo=speAlakazam, lvl=0)
			evoKadabra.save()
		
		try:
			evoFantominus = Evolution.objects.get(name="Fantominus")
		except Evolution.DoesNotExist:
			evoFantominus = Evolution.objects.create(name="Fantominus", species=speFantominus, evolvesTo=speSpectrum, lvl=25)
			evoFantominus.save()
		
		try:
			evoSpectrum = Evolution.objects.get(name="Spectrum")
		except Evolution.DoesNotExist:
			evoSpectrum = Evolution.objects.create(name="Spectrum", species=speSpectrum, evolvesTo=speEctoplasma, lvl=0)
			evoSpectrum.save()
		
		try:
			evoMachop = Evolution.objects.get(name="Machoc")
		except Evolution.DoesNotExist:
			evoMachop = Evolution.objects.create(name="Machoc", species=speMachoc, evolvesTo=speMachopeur, lvl=28)
			evoMachop.save()
		
		try:
			evoMachoke = Evolution.objects.get(name="Machopeur")
		except Evolution.DoesNotExist:
			evoMachoke = Evolution.objects.create(name="Machopeur", species=speMachopeur, evolvesTo=speMackogneur, lvl=0)
			evoMachoke.save()

#############################################################################################################
#	TEST - INDIVIDUAL DATA
#############################################################################################################

		# from .views import generatePokemonZone1
		import random

		bulbasaurA1 = Individual(species=speBulbizarre, lvl=random.randint(4,6))
		bulbasaurA1.save()
		bulbasaurA2 = Individual(species=speBulbizarre, lvl=random.randint(4,6))
		bulbasaurA2.save()
		bulbasaurB1 = Individual(species=speBulbizarre, lvl=random.randint(4,6))
		bulbasaurB1.save()
		bulbasaurB2 = Individual(species=speBulbizarre, lvl=random.randint(4,6))
		bulbasaurB2.save()

#############################################################################################################
#	TEST - PLAYER DATA
#############################################################################################################

		# TO DO : ameliorer la creation de pokemon (attaques)
		Player.objects.all().delete()
		try:
			playerA = Player.objects.get(idPlayer=1)
		except Player.DoesNotExist:
			playerA = Player.objects.create(idPlayer=1, idIndividual1=bulbasaurA1, idIndividual2=bulbasaurA2, userName="PlayerA", )
			playerA.save()
		try:
			playerB = Player.objects.create(idPlayer=2, idIndividual1=bulbasaurB1, idIndividual2=bulbasaurB2, userName="PlayerB", )
		except Player.DoesNotExist:
			playerB.save()

#############################################################################################################
#	TEST - GAME DATA
#############################################################################################################

		Game.objects.all().delete()
		try:
			game1 = Game.objects.get(idGame=10)
		except Game.DoesNotExist:
			game1 = Game.objects.create(idGame=10, idPlayerA=playerA, idPlayerB=playerB, nbPlayer=2)
			game1.save()


#############################################################################################################
#	OTHER
#############################################################################################################

	except IntegrityError as e:
		# Interceptez l'erreur d'intégrité (par exemple, une violation de contrainte d'unicité)
		print(f"Erreur d'intégrité lors de la création des éléments : {e}")
		# Vous pouvez journaliser l'erreur ou prendre d'autres mesures nécessaires
	except Exception as e:
		# Interceptez toute autre erreur imprévue
		print(f"Une erreur s'est produite lors de la création des éléments : {e}")
		# Vous pouvez journaliser l'erreur ou prendre d'autres mesures nécessaires

# Création d'instances d'attack
# attack1 = attack.objects.create(name="Goute", elem=elem1, power=50)
# attack2 = attack.objects.create(name="Attack2", elem=elem2, power=40)

# Création d'instances de species
# species1 = species.objects.create(name="Species1", elem=elem1, hp=100, at=80, de=60, sp=70)
# species2 = species.objects.create(name="Species2", elem=elem2, hp=120, at=70, de=50, sp=80)
