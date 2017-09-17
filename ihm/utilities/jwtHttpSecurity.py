# -*- coding: utf-8 -*-
# pylint: disable=W0613
from pyramid.httpexceptions import HTTPFound, HTTPNotFound, HTTPForbidden
from pyramid.response import Response
import logging, json
from traceback import print_exc
from ihm.utilities.context import denied_tools_views
import pyramid_jwt
import jwt, random, string;

LOG = logging.getLogger('Jwt_Service')
SECRET_KEY = "aUeJHgGGM7EWVWY7edn2525x"


# TOOO To Decorator
def checking_security_request(request, token):
    """
    This function will execute each time before handle a call request
    Security to check token
    """
    # check expiration time of token
    # check identity of token
    # check if request.get_accout_id the session of pyramid is valid else expire the token and the session also
    # delete the token from the browser if we could
    try:
        output = jwt.decode(token, SECRET_KEY)
        # we want to return a dico of credentials
        # could keep it in the request ?
        # TODO We can check the group of user here if he is allow or not to user this call
    except (jwt.InvalidTokenError, jwt.DecodeError):
        LOG.error('Error Token is not valid')
        return Response(status=400, body=json.dumps({'Error': "Invalid credentials"}), content_type="application/json")
    except jwt.ExpiredSignatureError:
        LOG.error('Error Token has been expired')
        return Response(status=400, body=json.dumps({'Error': "token expired We have to return to login page"}), content_type="application/json")
    return output


def checking_security_request_decorator():
    """ 
        This function will execute each time before handle a call request
        Security to check tokens
        get token date expiration
        # pyramid_jwt.expiration(token)
    """
    def decorated(view_function):
            def wrapper(request):
                try:
                    bearer = request.authorization[0]
                    token = request.authorization[1]
                    if token:
                        output = jwt.decode(token, SECRET_KEY)
                    else:
                        raise jwt.InvalidTokenError
                    # we want to return a dico of credentials
                    # could keep it in the request ?
                    # TODO We can check the group of user here if he is allow or not to user this call
                except (jwt.InvalidTokenError, jwt.DecodeError):
                    LOG.error('Error Token is not valid')
                    return Response(status=400, body=json.dumps({'Error': "Invalid credentials"}), content_type="application/json")
                except jwt.ExpiredSignatureError:
                    LOG.error('Error Token has been expired')
                    return Response(status=400, body=json.dumps({'Error': "token expired We have to return to login page"}), content_type="application/json")
                return view_function(request, output)
            return wrapper
    return decorated


class ServiceJwt(object):
    """
    Class provide many services about Json Web Token, we need it to communicate with App Angular
    These Services : Generate Token - Valid Token - define secret key
    """
    saveToken = None

    def getVirtualId(self):
        return "".join([string.ascii_letters.__add__(string.digits)[random.randint(0, len(string.ascii_letters + string.digits) - 1)] for i in range(10)])

    def encodeToken(self, credentials):
        # I add a new fake id fictif, because i want generate a new signature each time inside token
        id_virtual = self.getVirtualId()
        credentials['id_virtual'] = id_virtual
        token = jwt.encode(credentials, SECRET_KEY, algorithm='HS256')
        saveToken = token
        LOG.info('Token has been generated successfully')
        output = jwt.decode(token, SECRET_KEY)
        print ('Token has been succussfully generated: {} \n and it decode is equal to {}'.format(token, output))
        return token

    def validToken(self):
        try:
            output = jwt.decode(token, SECRET_KEY)
            return True
        except:
            return False

    def decodeToken(self, request, token):
        try:
            output = jwt.decode(token, SECRET_KEY)
        except:
            raise HTTPNotFound(request)
            return
        return output

    def expireToken(self):
        pass

    def checkPolicySession(self):
        """if we can check connexion of pyramid"""
        pass

tokenJwt = ServiceJwt()
