#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


import django

# Définissez le module de configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arenaGame.settings')

# import threading
django.setup()

# from arena import views
from arena.addData import addData
# from django.db.models.signals import post_migrate
# from django.dispatch import receiver

# @receiver(post_migrate)
# def run_add_data(sender, **kwargs):
#     addData()

def main():
	"""Run administrative tasks."""
	os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arenaGame.settings')
	try:
		from django.core.management import execute_from_command_line
	except ImportError as exc:
		raise ImportError(
			"Couldn't import Django. Are you sure it's installed and "
			"available on your PYTHONPATH environment variable? Did you "
			"forget to activate a virtual environment?"
		) from exc
	# background_thread = threading.Thread(target=views.runGames)
	# background_thread.daemon = True
	# background_thread.start()
	# views.updateDB()
	# addData()
	execute_from_command_line(sys.argv)

if __name__ == '__main__':
	main()