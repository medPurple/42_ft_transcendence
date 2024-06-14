# from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Individual, Elem, Attack, Species, Game, Player

# from arena import models

# import time

def index(request):
	return HttpResponse("Hello from arena app")



# background program
# def runGames():
# 	# time.sleep(3)
# 	# setupDB()
# 	x = 0
# 	while True:
# 		x += 1

def testView(request):
	# Renvoie une réponse HTTP avec un message simple
	return HttpResponse("Bonjour, ceci est une vue Django !", content_type='text/plain')

# TO DO : mettre a jour les elems
def getMultiplyingFactor(attType, defType, type):

	if attType.name == type.name:
		multiFactor = 1.5
	else:
		multiFactor = 1
	match defType.name:
		case "Flotte":
			multiFactor *= type.attElemFlotte
		case "Feuille":
			multiFactor *= type.attElemFeuille
		case "Chaud":
			multiFactor *= type.attElemChaud
		case "Brise":
			multiFactor *= type.attElemBrise
		case "Sable":
			multiFactor *= type.attElemSable
		case "Bagarre":
			multiFactor *= type.attElemBagarre
		case "Caillou":
			multiFactor *= type.attElemCaillou
	return multiFactor / 100

def	damageCalculator(attacker, defender, attack):
	(((((attacker.lvl * 0.4 + 2) * attacker.at * attack.power) / defender.de) / 50) + 2) * getMultiplyingFactor(attacker.elem, defender.elem, attack.elem)

# TO DO : ajouter les taux de capture sur les pokemons
def canItakeThisOne(hp, hp_max, lvl, rate):
	return ((1 - (hp / hp_max)) * rate + (random.randint(0, 20) - lvl) / 50 > 1)


# TO DO : ameliorer cette formule
def giveMeExpPlease(lvlDead, lvlAlive, rate):
	lvlDead * 8 * (3 - rate) + lvlAlive - lvlDead


#############################################################################################################
#	API / SERIALIZERS
#############################################################################################################

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
# from django.shortcuts import get_object_or_404s
from .serializers import ElemModelSerializer

class arenaAPI(APIView):
	serilizerClass = ElemModelSerializer

#############################################################################################################
#	GENERATE POKEMON
#############################################################################################################

import random

# V2
# def generatePokemonZone1():
# 	try:
# 		nbr = random.randint(1, 100)
# 		if (nbr > 50):
# 		# spawn roucoul
# 			newPokemon = Individual(species=speRoucoul, lvl=random.randint(2, 4))

# 		elif (nbr > 5):
# 			newPokemon = Individual(species=speRattata, lvl=random.randint(2, 4))
		
# 		elif (nbr > 1):
# 			newPokemon = Individual(species=speNidoranM, lvl=random.randint(2, 4))
		
# 		else:
# 			newPokemon = Individual(species=spePikachu, lvl=random.randint(2, 4))
	
# 	except Species.DoesNotExist:
# 		print("Individual creation failed or species not set")
# 	return newPokemon

# def generatePokemonZone2():
# 	try:
# 		nbr = random.randint(1, 100)
# 		if (nbr > 50):
# 		# spawn roucoul
# 			newPokemon = Individual(species=speRoucoul, lvl=random.randint(5, 8))

# 		elif (nbr > 5):
# 			newPokemon = Individual(species=speRattata, lvl=random.randint(5, 8))
		
# 		elif (nbr > 1):
# 			newPokemon = Individual(species=speAbra, lvl=random.randint(5, 8))
		
# 		else:
# 			newPokemon = Individual(species=speFantominus, lvl=random.randint(5, 8))
	
# 	except Species.DoesNotExist:
# 		print("Individual creation failed or species not set")
# 	return newPokemon


#############################################################################################################
#	ENDPOINTS
#############################################################################################################

from .serializers import GameUserSerializer, GameMatchSerializer
import logging

logger = logging.getLogger(__name__)

# Mettre a jour toutes les variables d'ID

# liste des interactions
# soigner les pokemons -> post
# changer 2 pokemons de place -> post
# donner la liste des pokemons du player -> get

class GameUserAPI(APIView):
	def post(self, request):
		# logger.info(f'User ID: {user_id}')
		interaction = request.data.get('interaction')
		if interaction == 'listAllPokemon':
			# recuperer l'id du joueur
			# changer 2 pokemons de place
			return Response({})
		elif interaction == 'healPokemon':
			# recuperer l'id du joueur
			# player.restoreAllIndividual()
			return Response({})
		elif interaction == 'getBanalStone':
			# recuperer l'id du joueur
			# ajouter une pierre banale dans l'inventaire
			return Response({})
		elif interaction == 'getVoltStone':
			# recuperer l'id du joueur
			# ajouter une pierre volt dans l'inventaire
			return Response({})
		elif interaction == 'useBanalStone':
			# recuperer l'id du joueur
			# supprimer l'item
			# faire evoluer le pokemon
			return Response({})
		elif interaction == 'useVoltStone':
			# recuperer l'id du joueur
			# supprimer l'item
			# faire evoluer le pokemon
			return Response({})

		userSerializer = GameUserSerializer(data=request.data)
		if userSerializer.is_valid():
			userSerializer.save()
			return Response(userSerializer.data, status=status.HTTP_201_CREATED)
		return Response(userSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def get(self, request, user_id=None):
		# logger.info(f'User ID: {user_id}')
		interaction = request.data.get('interaction')
		if interaction == 'listAllPokemon':
			# recuperer l'id du joueur
			# player.idIndividual1 # 1 a 6
			return Response({})
		if user_id:
			try:
				user = Player.objects.get(idPlayer=user_id)
				userSerializer = GameUserSerializer(user)
				return Response(userSerializer.data, status=status.HTTP_200_OK)
			except Player.DoesNotExist:
				return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
		else:
			users = Player.objects.all()
			userSerializer = GameUserSerializer(users, many=True)
			return Response(userSerializer.data, status=status.HTTP_200_OK)
	
	def put(self, request, user_id=None):
		# logger.info(f'User ID: {user_id}')
		if not user_id:
			return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game_user = Player.objects.get(idPlayer=user_id)
		except Player.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

		userSerializer = GameUserSerializer(game_user, data=request.data, partial=True)
		if userSerializer.is_valid():
			userSerializer.save()
			return Response(userSerializer.data, status=status.HTTP_200_OK)
		return Response(userSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, user_id=None):
		# logger.info(f'Match ID: {match_id}')
		if not user_id:
			return Response({"error": "Player ID is required"}, status=status.HTTP_400_BAD_REQUEST)
		try:
			user = Player.objects.get(id=user_id)
		except Player.DoesNotExist:
			return Response({"error": "Player not found"}, status=status.HTTP_404_NOT_FOUND)
		user.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)

class GameMatchAPI(APIView):
	def post(self, request):
			# logger.info(f'Match ID: {match_id}')
			player1 = request.data.get('player1')
			player2 = request.data.get('player2')
			
			try:
				user1, _ = Player.objects.get_or_create(userID=player1.get("id"))
				user2, _ = Player.objects.get_or_create(userID=player2.get("id"))
			except Player.DoesNotExist:
				return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
			match1, match1_created = Game.objects.get_or_create(
				player1=user1,
				player2=user2,
				defaults={
					"player1_score": 0,
					"player2_score": 0,
					"status": 0,
				}
			)
			match2, match2_created = GameMatch.objects.get_or_create(
				player1=user2,
				player2=user1,
				defaults={
					"player1_score": 0,
					"player2_score": 0,
					"status": 0,
				}
			)
			if (match1_created and match2_created):
				match2.delete()
				match_serializer = GameMatchSerializer(match1)
				return Response(match_serializer.data, status=status.HTTP_201_CREATED)
			elif (match1_created and not match2_created):
				match1.delete()
				match_serializer = GameMatchSerializer(match2)
				return Response(match_serializer.data, status=status.HTTP_201_CREATED)
			elif (not match1_created and match2_created):
				match2.delete()
				match_serializer = GameMatchSerializer(match1)
				return Response(match_serializer.data, status=status.HTTP_201_CREATED)


	def get(self, request, match_id=None):
		# logger.info(f'Match ID: {match_id}')
		if match_id:
			try:
				game = Game.objects.get(idGame=match_id)
				gameSerializer = GameMatchSerializer(game)
				return Response(gameSerializer.data, status=status.HTTP_200_OK)
			except Game.DoesNotExist:
				return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

		else:
			games = Game.objects.all()
			gameSerializer = GameMatchSerializer(games, many=True)
			return Response(gameSerializer.data, status=status.HTTP_200_OK)

	def put(self, request, match_id=None):
		# logger.info(f'Match ID: {match_id}')
		if not match_id:
			return Response({"error: Match ID not found"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game = Game.objects.get(idGame=match_id)
		except Game.DoesNotExist:
			return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)
		
		gameSerializer = GameMatchSerializer(game, data=request.data, partial=True)
		if gameSerializer.is_valid():
			gameSerializer.save()
			return Response(gameSerializer.data, status=status.HTTP_200_OK)
		return Response(gameSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

	def delete(self, request, match_id=None):
		# logger.info(f'Match ID: {match_id}')
		if not match_id:
			return Response({"error": "Match ID is required"}, status=status.HTTP_400_BAD_REQUEST)

		try:
			game = Game.objects.get(idGame=match_id)
		except Game.DoesNotExist:
			return Response({"error": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

		game.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)
