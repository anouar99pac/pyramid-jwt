# -*- coding: utf-8 -*-
# pylint: disable=W0613
from pyramid.view import view_config
from pyramid.security import remember, forget
from pyramid.httpexceptions import HTTPFound, HTTPNotFound, HTTPForbidden
import logging
from traceback import print_exc

from ihm.utilities.constants import ALLOWED_NETEVEN_IPS
from ihm.utilities.session import check_ip_is_neteven
from ihm.utilities.context import denied_tools_views

LOG = logging.getLogger('session_manager')

@view_config(route_name='home', renderer='./templates/accueil.pt')
def my_view(request):
    # try:
    #     query = request.dbsession.query(MyModel)
    #     one = query.filter(MyModel.name == 'one').first()
    # except DBAPIError:
    #     return Response(db_err_msg, content_type='text/plain', status=500)
    return {'one': 'one', 'project': 'PyramidDemo'}
