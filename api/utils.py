import secrets
import os
from PIL import Image
from flask import url_for, current_app
import time

now = time.time()


def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(
        current_app.root_path, "../public/uploads", picture_fn)

    # output_size = (125, 125)
    i = Image.open(form_picture)
    # i.thumbnail(output_size)

    i.save(picture_path)
    return picture_fn


def delete_pictures():

    results_folder = "./frontend/build/results"
    results = [
        os.path.join(results_folder, filename)
        for filename in os.listdir(results_folder)
    ]

    if results:
        for file in results:
            if (now - os.stat(file).st_mtime) > 450:
                os.remove(file)
