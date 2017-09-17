# -*- coding: utf-8 -*-
# pylint: disable=W0613
from pyramid.view import view_config
# from pyramid.security import remember, forget
# from pyramid.httpexceptions import HTTPFound, HTTPNotFound, HTTPForbidden
import logging


LOG = logging.getLogger('session_manager')
@view_config(route_name='home', renderer='./templates/accueil.pt')
def my_view(request):
    LOG.info('first App')
    return {'one': 'one', 'project': 'PyramidDemo'}
