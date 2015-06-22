import webapp2
from google.appengine.ext import ndb
import db_defs
import json

class Catlist(webapp2.RequestHandler):
			
	def get(self, **kwargs):
		key = db_defs.validateToken(int(kwargs['token']))
		if key:
			if 'id' in kwargs:
				
				name = self.request.get('name', default_value=None)
				catList = db_defs.Marker.query(db_defs.Marker.category == ndb.Key(db_defs.Category, int(kwargs['id']))).fetch()
				if catList:
					out = {}
					for x in catList:
						out[str(x.key.id())] = x.to_dict(kwargs['token'])
					self.response.write(json.dumps(out, sort_keys=True, indent=4))
			else:
				self.abort(400)	
		else:
			self.abort(404)