import webapp2
from google.appengine.ext import ndb
import db_defs
import json

class User(webapp2.RequestHandler):
	def post(self):
		#get username and password from request
		new_user = self.request.get('newlogin', default_value=None)
		username = self.request.get('username', default_value=None)
		password = self.request.get('password', default_value=None)
		if new_user == "True":
			#validate username
			userList = [x.name for x in db_defs.User.query().fetch()]
			if username in userList:
				self.abort(400)
			#store user-name and password
			user = db_defs.User()
			user.name = username
			user.password = password
			user.put()
		else:
			user = db_defs.User.query(db_defs.User.name == username).get()
			if user:
				if password != user.password:
					self.abort(403)
			else:
				self.abort(404)
			# if valid, generate, store new token and return to client
			old_token = db_defs.Token.query(db_defs.Token.user == user.key).get()
			if old_token:
				old_token.key.delete()
		#generate and store token
		token = db_defs.Token()
		token.user = user.key
		token.put()
		
		#return token to client
		out = token.to_dict()
		self.response.write(json.dumps(out, sort_keys=True, indent=4))
	
	def get(self):
		out = {'warning':'GET not implemented'}	
		self.response.write(json.dumps(out, sort_keys=True, indent=4))
		
	def delete(self, **kwargs):		
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			key.delete()
			out = {"message": "user deleted"}
			self.response.write(json.dumps(out, sort_keys=True, indent=4))
		else:
			self.abort(404)	
		
	def put(self):
		#validate user-name and password
		username = self.request.get('username', default_value=None)
		password = self.request.get('password', default_value=None)
		newpass = self.request.get('newpass', default_value=None)
		# if valid, generate new token and return to client
		user = db_defs.User.query(db_defs.User.name == username).get()
		if user:
			if password != user.password:
				self.abort(400)
		else:
			self.abort(400)
		user.password = newpass
		user.put()
		old_token = db_defs.Token.query(db_defs.Token.user == user.key).get()
		if old_token:
			old_token.key.delete()
		token = db_defs.Token()
		token.user = user.key
		token.put()
		
		out = token.to_dict()
		self.response.write(json.dumps(out, sort_keys=True, indent=4))