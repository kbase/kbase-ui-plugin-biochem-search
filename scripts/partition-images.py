import hashlib
import os
from pathlib import Path
import shutil

REPO_DIR = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
DIR = REPO_DIR + '/_attic'
DEST_DIR = DIR + '/images'


def move_file(dir, filename):
    m = hashlib.sha256()
    m.update(bytes(filename, 'utf-8'))
    hash_dir = m.hexdigest()[0:2]
    dest = DEST_DIR + '/' + hash_dir
    Path(dest).mkdir(parents=True, exist_ok=True)
    shutil.copy(dir + '/' + filename, dest)
    print(dir)


def move_dir(dir):
    path = DIR + '/' + dir
    for file in os.listdir(path):
        move_file(path, file)


def move_them():
    move_dir('modelseed.1')
    move_dir('modelseed.2')
    move_dir('modelseed.3')
    move_dir('modelseed.4')


def main():
    move_them()


main()
