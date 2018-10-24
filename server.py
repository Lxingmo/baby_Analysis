import tornado.ioloop
import tornado.web
from tornado.options import define, options
from tornado.websocket import WebSocketHandler
import configparser
import logging
import json
import os
import time
import datetime
from PIL import Image
from io import BytesIO
import requests

define("port", default=9895, help="run on the given port", type=int)


class GetWarningVoice(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Content-type', 'application/json')

    def post(self):
        
        args,files = {},{}
        tornado.httputil.parse_body_arguments(self.request.headers["Content-Type"], self.request.body, args, files)
        for key,value in args.items():
            args[key] = value[0].decode()

        # print("args = {}".format(args))
        # img = Image.open(BytesIO(files["photo"][0]["body"]))
        # img.save("addface.png", format='PNG')
        print(json.dumps(args, ensure_ascii=False,sort_keys=True, indent=2))
        
        result = {
                        "status": 0,
                        "data": ['警告','危险'],
                        # "data": [], 
                }
        self.write(json.dumps(result, ensure_ascii=False))

class GetHtml(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Content-type', 'application/json')

    def get(self):
        self.redirect('./static/static/index.html')
        
class ForwardingRequestHandler (tornado.web.RequestHandler):
    def handle_response(self, response):
        if response.error and not isinstance(response.error,tornado.httpclient.HTTPError):
            self.set_status(500)
            self.write("Internal server error:\n" +str(response.error))
            self.finish()
        else:
            print(response.body)
            self.set_status(response.code)
            for header in ("Date", "Cache-Control", "Server", "Content-Type", "Location"):
                v = response.headers.get(header)
                if v:
                    self.set_header(header, v)
            if response.body:
                self.write(response.body)
            self.finish()

    @tornado.web.asynchronous
    def post(self):
        try:
            headers=self.request.headers
            # headers["Cookie"] = "JSESSIONID=2EC49FF85E87C8782E91DD2A6774EE72"
            tornado.httpclient.AsyncHTTPClient().fetch(
                tornado.httpclient.HTTPRequest(
                    url="%s://%s:%s%s" % (self.request.protocol, target_host or "127.0.0.1", target_post or 80, self.request.uri),
                    method=self.request.method,
                    body=self.request.body,
                    headers=headers,
                    follow_redirects=False),
                callback=lambda response:self.handle_response(response))
        except tornado.httpclient.HTTPError as x:
            if hasattr(x, response) and x.response:
                self.handle_response(x.response)
        except tornado.httpclient.CurlError as x:
            self.set_status(500)
            self.write("Internal server error:\n" + ''.join(traceback.format_exception(*sys.exc_info())))
            self.finish()
        except:
            self.set_status(500)
            self.write("Internal server error:\n" + ''.join(traceback.format_exception(*sys.exc_info())))
            self.finish()

    @tornado.web.asynchronous
    def get(self):
        try:
            headers=self.request.headers
            # headers["Cookie"] = "JSESSIONID=2EC49FF85E87C8782E91DD2A6774EE72" 
            tornado.httpclient.AsyncHTTPClient().fetch(
                tornado.httpclient.HTTPRequest(
                    url="%s://%s:%s%s" % (self.request.protocol, target_host or "127.0.0.1", target_post or 80, self.request.uri),
                    method=self.request.method,
                    headers=headers,
                    follow_redirects=False),
                callback=lambda response: self.handle_response(response))
        except tornado.httpclient.HTTPError as x:
            if hasattr(x, response) and x.response:
                self.handle_response(x.response)
        except tornado.httpclient.CurlError as x:
            self.set_status(500)
            self.write("Internal server error:\n" + ''.join(traceback.format_exception(*sys.exc_info())))
            self.finish()
        except:
            self.set_status(500)
            self.write("Internal server error:\n" + ''.join(traceback.format_exception(*sys.exc_info())))
            self.finish()

    @tornado.web.asynchronous
    def delete(self):
        try:
            headers=self.request.headers 
            tornado.httpclient.AsyncHTTPClient().fetch(
                tornado.httpclient.HTTPRequest(
                    url="%s://%s:%s%s" % (self.request.protocol, target_host or "127.0.0.1", target_post or 80, self.request.uri),
                    method=self.request.method,
                    headers=headers,
                    follow_redirects=False),
                callback=lambda response: self.handle_response(response))
        except tornado.httpclient.HTTPError as x:
            if hasattr(x, response) and x.response:
                self.handle_response(x.response)
        except tornado.httpclient.CurlError as x:
            self.set_status(500)
            self.write("Internal server error:\n" + ''.join(traceback.format_exception(*sys.exc_info())))
            self.finish()
        except:
            self.set_status(500)
            self.write("Internal server error:\n" + ''.join(traceback.format_exception(*sys.exc_info())))
            self.finish()


class GetStreamAddress(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', '*')
        self.set_header('Content-type', 'application/json')

    def get(self):
        result = {
            "status": 200,
            "msg": "成功",
            "data": "rtmp://192.168.10.212:1936/myapp/ai_baby"
        }

        self.write(json.dumps(result, ensure_ascii=False))
# def make_app():
#     return tornado.web.Application([
#         (r"/login", LoginHandler),
#         (r"/historyface1", HistoryFaceHandler),
#     ],debug=True)
def make_app():
    settings = {
        "template_path": os.path.join(os.path.dirname(__file__), "static"),
        "static_path":  os.path.join(os.path.dirname(__file__), 'static'),
        # http://localhost:8080/static/default_face.jpg
        "debug" : True,
    }

    return tornado.web.Application([
        # (r'/',GetHtml),
        # (r"/.*", ForwardingRequestHandler),
        (r'/getStreamAddress',GetStreamAddress),
        
        # (r'/(.*)', tornado.web.StaticFileHandler, {'path': "static/"}),
    ],**settings)

if __name__ == "__main__":
    isrem_password = False
    rem_name = ""
    rem_password = ""

    target_host = "192.168.10.212"
    target_post = "9895"

    tornado.options.parse_command_line()

    print("strat server.....")
    app = make_app()
    app.listen(options.port)
    tornado.ioloop.IOLoop.current().start()
