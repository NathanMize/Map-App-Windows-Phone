import webapp2
from google.appengine.ext import ndb
import db_defs
import json
import datetime

class Marker(webapp2.RequestHandler):
	def post(self, **kwargs):
		# validate token return error if invalid
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			input = self.request.arguments()
			new_marker = db_defs.Marker()
			new_marker.user = key
			if 'lat' in input:
				lat = self.request.get('lat', default_value=None)
				new_marker.lat = float(lat)
			else:
				self.abort(400)
			
			if 'lon' in input:
				lon = self.request.get('lon', default_value=None)
				new_marker.lon = float(lon)
			else:
				self.abort(400)
			if 'category' in input:		
				category_id = self.request.get('category', default_value=None)
				category = ndb.Key(db_defs.Category, int(category_id)).get()
			
				if category.user == key:
					new_marker.category = category.key
				else:
					self.abort(404)
			else:
				self.abort(400)	
			popup = self.request.get('popup', default_value="")
			if popup:
				new_marker.popup = popup
			new_marker.put()
			# return object to user
			out = new_marker.to_dict(kwargs['token'])
			self.response.write(json.dumps(out, sort_keys=True, indent=4))
		else:
			self.abort(404)	
		
	def get(self, **kwargs):
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			if 'id' in kwargs:
				target = ndb.Key(db_defs.Marker, int(kwargs['id'])).get()
				if target:
					out = target.to_dict(kwargs['token'])
					self.response.write(json.dumps(out, sort_keys=True, indent=4))
				else:
					self.abort(401)	
			else:
				name = self.request.get('name', default_value=None)
				markList = db_defs.Marker.query(db_defs.Marker.user == key).fetch()
				if markList:
					out = {}
					for x in markList:
						out[str(x.key.id())] = x.to_dict(kwargs['token'])
					self.response.write(json.dumps(out, sort_keys=True, indent=4))
				else:
					self.abort(402)	
		else:
			self.abort(403)			
		
	def delete(self, **kwargs):		
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			if 'id' in kwargs:
				ndb.Key(db_defs.Marker, int(kwargs['id'])).delete()
				markList = db_defs.Marker.query(db_defs.Marker.user == key).fetch()
				out = {}
				for x in markList:
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
				marker = ndb.Key(db_defs.Marker, int(kwargs['id'])).get()
				input = self.request.arguments()
				
				if 'lat' in input:
					lat = self.request.get('lat', default_value=None)
					marker.lat = float(lat)
				
				if 'lon' in input:
					lon = self.request.get('lon', default_value=None)
					marker.lon = float(lon)
					
				if 'category' in input:
					category_id = self.request.get('category', default_value=None)
					category = ndb.Key(db_defs.Category, int(category_id)).get()
					if category.user == key:
						marker.category = category.key
					else:
						self.abort(404)
						
				if 'popup' in input:	
					popup = self.request.get('popup', default_value=None)
				
					marker.popup = popup
					
				marker.put()
				# return object to user
				out = marker.to_dict(kwargs['token'])
				self.response.write(json.dumps(out, sort_keys=True, indent=4))
			else:
				self.abort(400)	
		else:
			self.abort(404)	