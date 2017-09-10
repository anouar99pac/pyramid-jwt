# -*- coding: utf-8 -*-

import logging
import pkg_resources

from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.session import UnencryptedCookieSessionFactoryConfig
from pyramid.settings import aslist

# from ihm.i18n import custom_locale_negotiator
from ihm.configure import configure_app
from pyramid_jwt import set_jwt_authentication_policy

__version__ = pkg_resources.get_distribution("ihm").version


def log(request):
    """
    Retourne le logger "ihm" stocké dans le registre de pyramid
    """
    logger = request.registry['ihm_logger']
    return logger


def main(global_config, **settings):
    """
    This function returns a Pyramid WSGI application.
    Point d'entrée du server Pyramid

     - settings est un dictionnnaire généré par pyramid. Il contient les
    options de configuration de pyramid qui sont renseigné dans le *.ini donné
    en argument de pserve (mais seulement la part [app:main])
     - global_config contient l'environnement de lancement de pyramid :
        - le fichier de config .ini actuel
        - le répertoire source du projet
    """

    # Pyramid requires an authorization policy to be active.
   
    # configuration de pyramid : on utilise le données renseignées dans le
    # fichier de config (settings), les données d'authentification
    config = Configurator(
        settings=settings,
    )
    config.set_authorization_policy(ACLAuthorizationPolicy())
    # New configuration of JWT authentification for Pyramid
    # Enable JWT authentication.
    # config.commit()
    config.include('pyramid_jwt')
    # FixeMe
    config.set_jwt_authentication_policy('secret')

    # on enregistre le sesssion_maker sqlalchemy dans le registre pyramid pour
    # y avoir accès depuis une view

    # Configuration du logging
    logger = logging.getLogger('ihm')
    config.registry['ihm_logger'] = logger

    # Récupération des plugins définis dans la config
    plugins = aslist(settings.get('plugins', []))

    # Configuration des routes de l'application et des plugins
    configure_app(config, plugins)
    # scan va importer les views disponibles dans le module ihm.views (toutes
    # les methodes décorées par view_config)
    # les modules de traduction vont s'éxecuter au début de chaque view
    # config.add_translation_dirs('ihm:locale')
    # config.add_subscriber('ihm.i18n.add_renderer_globals',
    #                       'pyramid.events.BeforeRender')
    # config.add_subscriber('ihm.i18n.add_localizer',
    #                       'pyramid.events.NewRequest')
    # config.set_locale_negotiator(custom_locale_negotiator)

    # Création de l'app
    app = config.make_wsgi_app()
    return app
