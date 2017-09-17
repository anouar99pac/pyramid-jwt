# coding=utf-8
##############################################################################
#
# Copyright (c) 2016 Agendaless Consulting and Contributors.
# All Rights Reserved To application
#
# This software is subject to the provisions of the BSD-like license at
#
# These functions will add an abstraction class security to Pyramid
#
##############################################################################

from pyramid.httpexceptions import HTTPFound, HTTPNotFound, HTTPForbidden
from pyramid.authentication import AuthTktAuthenticationPolicy
from ihm.utilities.session import get_account_id
from pyramid.view import forbidden_view_config, view_config

# from Crypto.Cipher import AES
import base64



class MyAuthenticationPolicy(AuthTktAuthenticationPolicy):
    def authenticated_userid(self, request):
        user = get_account_id(request)
        if user is not None:
            return user.id


@view_config(context=HTTPNotFound, renderer='../views/site/templates/erreur.pt')
def not_found(request):
    """
       about a pages don't found
    """
    request.response.status = 404
    return {}


@forbidden_view_config()
def forbidden_view(request):
    """
       about a forbidden page, we should to redirect
       in login view
    """
    next_url = request.route_url('login', _query={'next': request.url})
    return HTTPFound(location=next_url)


# def makeSecret(am_account_id):
#     BLOCK_SIZE = 16
#     PADDING = '$'
#     pad = lambda s: s + (BLOCK_SIZE - len(s) % BLOCK_SIZE) * PADDING
#     EncodeAES = lambda c, s: base64.b64encode(c.encrypt(pad(s)))
#     # os.urandom(BLOCK_SIZE) génération secret
#     secret = '\x04\xb4\xe9\xf3\xa0\xb0\xf9\xbc\x81\xca7\x9dl\x19\xce\x90'
#     cipher = AES.new(secret)
#     return EncodeAES(cipher, str(am_account_id)).replace('+', '$')


# def getSecret(challenge_secret):
#     PADDING = '{'
#     DecodeAES = lambda c, e: c.decrypt(base64.b64decode(e)).rstrip(PADDING)
#     secret = '\x04\xb4\xe9\xf3\xa0\xb0\xf9\xbc\x81\xca7\x9dl\x19\xce\x90'
#     cipher = AES.new(secret)
#     return int(DecodeAES(cipher, challenge_secret))
