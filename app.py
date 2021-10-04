from flask import Flask, request, send_from_directory
from flask_cors import CORS
from api.image_colorization import colorize
from api.utils import save_picture, delete_pictures


app = Flask(__name__, static_url_path='', static_folder='frontend/build')
# CORS(app)

ALLOWED_EXTENSIONS = set(["png", "jpg", "jpeg"])


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/upload", methods=["POST"])
def fileUpload():
    if "file" not in request.files:
        resp = {"message": "No file part in the request"}
        resp["status_code"] = 400
        return resp
    file = request.files["file"]

    if file.filename == "":
        resp = {"message": "No file selected for uploading"}
        resp["status_code"] = 400
        return resp
    if file and allowed_file(file.filename):
        delete_pictures()
        fn = save_picture(file)
        resp = {"message": "File successfully uploaded", "filename": fn}
        resp["status_code"] = 201
        return resp
    else:
        resp = {"message": "Allowed file types are  png, jpg, jpeg"}
        resp["status_code"] = 400
        return resp


@app.route("/api/colorize", methods=["POST"])
def colorize_route():
    # image_path = "../public/uploads/" + request.json["name"]
    # image_path = request.json["path"]
    delete_pictures()
    try:
        fn = colorize(request.files["file"].read())
        resp = {"result": fn}
        resp["status_code"] = 200
        return resp
    except:
        resp = {"message": "Something went wrong, try again"}
        resp["status_code"] = 400
        return resp


@app.route("/", defaults={'path': ''})
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    app.run()
