# -*- coding: utf-8 -*-
# pylint: disable=W0613
from pyramid.view import view_config
from pyramid.security import remember, forget
from pyramid.httpexceptions import HTTPFound, HTTPNotFound, HTTPForbidden
import logging, json
from traceback import print_exc

from ihm.utilities.jwtHttpSecurity import tokenJwt, checking_security_request, checking_security_request_decorator
from ihm.utilities.context import denied_tools_views
import pyramid_jwt
import jwt, random, string


@view_config(route_name='neteven_json_web_token',
             renderer='json')
def json_web_token(request):
    """
        Cas Json Web token
        this view ll return the token ID to front-end
        this token is generated by pyramid_jwt
    """

    # pyramid_jwt.set_jwt_authentication_policy(SECRET_KEY)
    # Here I generate my token
    # So i need to get credentials session of user
    credentials = {'account_id': 2525, 'login': 'mokh2anouar@gmail.com'}
    token = tokenJwt.getToken(credentials)
    print(token)
    testUser = {'login': 'mokhtari.anouar@gmail.com', 'account_id': 1116, 'username': 'test', 'password': 'test', 'name': 'MOKHTARI Anouar'}
    params = json.loads(request.body)

    # check credential of account_id and token
    # we can also send token
    # check user credentials and return fake jwt token if valid
    if params.get('username') == testUser.get('username') and params.get('password') == testUser.get('password'):
        return {'token': token}
    else:
        return


@view_config(route_name='neteven_credentials',
             renderer='json')
@checking_security_request_decorator()
def api_credentials(request, credentials):
    print('try to call this Http URL api_credentials')
    # check for fake auth token in header and return test users if valid, this security is implemented server side
    # in a real application
    # if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
    #                 connection.mockRespond(new Response(
    #                     new ResponseOptions({ status: 200, body: [testUser] })
    #                 ));
    #             } else {
    #                 // return 401 not authorised if token is null or invalid
    #                 connection.mockRespond(new Response(
    #                     new ResponseOptions({ status: 401 })
    #                 ));
    #             }
    # the header must contain the token or token jwt defined here
    # and we have to code decorator or token
    # for each call we must verify token call
    # i get token

    # bearer = request.authorization[0]
    # token = request.authorization[1]
    # if token:
    #     user = checking_security_request(request, token)
    print ('okkokokokokok')
    result = [credentials]
    return result


@view_config(route_name='test',
             renderer='json')
def api_credentials(request, credentials):
    result = {"test":"test","am":"constantine"}
    return result