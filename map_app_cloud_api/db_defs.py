from google.appengine.ext import ndb
import datetime

base_url = "http://map-app-496.appspot.com/"

class Model(ndb.Model):
	def to_dict(self):
		d = super(Model,self).to_dict()
		d['key'] = self.key.id()
		return d

class Marker(Model):
	lat = ndb.FloatProperty(required=True)
	lon = ndb.FloatProperty(required=True)
	popup = ndb.StringProperty(required=False)
	user = ndb.KeyProperty(required=True)
	category = ndb.KeyProperty(required=True)
	
	def to_dict(self, token):
		d = super(Model,self).to_dict()
		d['category'] = d['category'].id()
		d['user'] = d['user'].id()
		d['key'] = self.key.id()
		d['url'] = base_url + "marker/" + token + "/" + str(d['key'])
		return d

class Category(Model):
	name = ndb.StringProperty(required=True)
	user = ndb.KeyProperty(required=True)
		
	def to_dict(self, token):
		d = super(Model,self).to_dict()
		d['user'] = d['user'].id()
		d['key'] = self.key.id()
		d['url'] = base_url + "category/" + token + "/" + str(d['key'])
		return d

class User(Model):
	name = ndb.StringProperty(required=True)
	password = ndb.StringProperty(required=True)

class Token(Model):
	user = ndb.KeyProperty(required=True)
	time = ndb.DateTimeProperty(auto_now_add=True)
	
	def to_dict(self):
		d = {'token': self.key.id()}
		d['category'] = base_url + "category/" + str(self.key.id())
		d['marker'] = base_url + "marker/" + str(self.key.id())
		return d

def validateToken(value):
	token = ndb.Key(Token, int(value)).get()
	if token:
		now = datetime.datetime.now()
		expiration = token.time + datetime.timedelta(days=1)
		if now < expiration:
			return token.user
	return