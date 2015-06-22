import webapp2
from google.appengine.ext import ndb
import db_defs
import json

class Category(webapp2.RequestHandler):
	def post(self, **kwargs):
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			name = self.request.get('name', default_value=None)
			nameList = [x.name for x in db_defs.Category.query(db_defs.Category.user == key).fetch()]
			if name in nameList:
				self.abort(400)
			new_cat = db_defs.Category()
			new_cat.name = name
			new_cat.user = key
			new_cat.put()
			out = new_cat.to_dict(kwargs['token'])
			self.response.write(json.dumps(out, sort_keys=True, indent=4))
		else:
			self.abort(404)	
			
	def get(self, **kwargs):
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			if 'id' in kwargs:
				target = ndb.Key(db_defs.Category, int(kwargs['id'])).get()
				if target:
					out = target.to_dict(kwargs['token'])
					self.response.write(json.dumps(out, sort_keys=True, indent=4))
				else:
					self.abort(400)	
			else:
				name = self.request.get('name', default_value=None)
				catList = db_defs.Category.query(db_defs.Category.user == key).fetch()
				if catList:
					out = {}
					for x in catList:
						out[str(x.key.id())] = x.to_dict(kwargs['token'])
					self.response.write(json.dumps(out, sort_keys=True, indent=4))
				else:
					self.abort(400)	
		else:
			self.abort(404)
			
	def delete(self, **kwargs):		
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			if 'id' in kwargs:
				markList = db_defs.Marker.query(db_defs.Marker.category == ndb.Key(db_defs.Category, int(kwargs['id']))).fetch()
				ndb.Key(db_defs.Category, int(kwargs['id'])).delete()
				for x in markList:
					x.key.delete()
				catList = db_defs.Category.query(db_defs.Category.user == key).fetch()
				out = {}
				for x in catList:
					out[str(x.key.id())] = x.to_dict(kwargs['token'])
				self.response.write(json.dumps(out, sort_keys=True, indent=4))
			else: 
				self.abort(404)	
		else:
			self.abort(404)	

			
	def put(self, **kwargs):
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			if 'id' in kwargs:
				target = ndb.Key(db_defs.Category, int(kwargs['id'])).get()
				if target:
					name = self.request.get('name', default_value=None)
					if name:
						target.name = name
						target.put()
					out = target.to_dict(kwargs['token'])
					self.response.write(json.dumps(out, sort_keys=True, indent=4))
				else:
					self.abort(400)	
			else:
				self.abort(400)	
		else:
			self.abort(404)	