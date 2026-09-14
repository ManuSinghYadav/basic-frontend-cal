from mangum import Mangum

from routes.api import app


handler = Mangum(app)